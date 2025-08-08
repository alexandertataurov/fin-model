from typing import Optional, List, Dict
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.role import Role, UserRole, RoleType

# Audit models removed in lean version
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    generate_secure_token,
)


def _validate_password_requirements(password: str):
    import re

    requirements = [
        (len(password) >= 8, "at least 8 characters"),
        (re.search(r"[A-Z]", password), "an uppercase letter (A-Z)"),
        (re.search(r"[a-z]", password), "a lowercase letter (a-z)"),
        (re.search(r"\d", password), "a number (0-9)"),
        (
            re.search(r"[!@#$%^&*()_+=\[\]{}|;:,.<>?-]", password),
            "a special character (!@#$...)",
        ),
    ]
    failed = [desc for ok, desc in requirements if not ok]
    if failed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Password must contain: {', '.join(failed)}.",
        )


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        return (
            self.db.query(User).filter(User.username == username).first()
        )

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(
        self, user_create: UserCreate, role: RoleType = RoleType.VIEWER
    ) -> User:
        """Create a new user with specified role."""
        # Check if user already exists
        if self.get_user_by_email(user_create.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already registered",
            )

        if self.get_user_by_username(user_create.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already registered",
            )

        # Validate password requirements
        _validate_password_requirements(user_create.password)

        # Create new user (email verification disabled)
        hashed_password = get_password_hash(user_create.password)

        full_name = user_create.full_name
        if not full_name:
            if user_create.first_name or user_create.last_name:
                full_name = f"{user_create.first_name or ''} {user_create.last_name or ''}".strip()
        db_user = User(
            email=user_create.email,
            username=user_create.username,
            first_name=user_create.first_name or "",
            last_name=user_create.last_name or "",
            full_name=full_name,
            hashed_password=hashed_password,
            is_active=True,
            is_verified=True,
            verification_token=None,
        )

        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)

        # Assign default role
        role_obj = self.db.query(Role).filter(Role.name == role).first()
        if role_obj:
            user_role = UserRole(
                user_id=db_user.id,
                role_id=role_obj.id,
                assigned_by=None,  # System assignment
            )
            self.db.add(user_role)

        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(
        self,
        identifier: str,
        password: str,
        ip_address: str = None,
        user_agent: str = None,
    ) -> Optional[User]:
        """Authenticate user with username or email and password."""
        user = self.get_user_by_email(identifier)
        if not user:
            user = self.get_user_by_username(identifier)
        if not user:
            self.log_audit_action(
                action="FAILED_LOGIN",
                success="failure",
                details=f"User not found: {identifier}",
                ip_address=ip_address,
                user_agent=user_agent,
            )
            return None

        # Check if account is locked
        if user.is_locked:
            self.log_audit_action(
                user_id=user.id,
                action="FAILED_LOGIN",
                success="failure",
                details="Account is locked",
                ip_address=ip_address,
                user_agent=user_agent,
            )
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail=f"Account is locked until {user.account_locked_until}",
            )

        # Check if account is active
        if not user.is_active:
            self.log_audit_action(
                user_id=user.id,
                action="FAILED_LOGIN",
                success="failure",
                details="Account is not active",
                ip_address=ip_address,
                user_agent=user_agent,
            )
            return None

        # Verify password
        if not verify_password(password, user.hashed_password):
            # Increment failed login attempts
            user.failed_login_attempts = (
                user.failed_login_attempts or 0
            ) + 1

            # Lock account after 5 failed attempts
            if user.failed_login_attempts >= 5:
                user.account_locked_until = datetime.now(
                    timezone.utc
                ) + timedelta(minutes=30)
                self.log_audit_action(
                    user_id=user.id,
                    action="ACCOUNT_LOCKED",
                    success="success",
                    details="Account locked due to multiple failed login attempts",
                    ip_address=ip_address,
                    user_agent=user_agent,
                )

            self.log_audit_action(
                user_id=user.id,
                action="FAILED_LOGIN",
                success="failure",
                details=f"Invalid password attempt {user.failed_login_attempts}",
                ip_address=ip_address,
                user_agent=user_agent,
            )

            self.db.commit()
            return None

        # Successful login - reset failed attempts and update last login
        user.failed_login_attempts = 0
        user.last_login = datetime.now(timezone.utc)
        user.account_locked_until = None

        self.log_audit_action(
            user_id=user.id,
            action="LOGIN",
            success="success",
            ip_address=ip_address,
            user_agent=user_agent,
        )

        self.db.commit()
        return user

    def verify_email(self, token: str) -> bool:
        """Verify user's email with token."""
        user = (
            self.db.query(User)
            .filter(User.verification_token == token)
            .first()
        )
        if not user:
            return False

        user.is_verified = True
        user.verification_token = None

        self.log_audit_action(
            user_id=user.id, action="EMAIL_VERIFICATION", success="success"
        )

        self.db.commit()
        return True

    def request_password_reset(self, email: str) -> bool:
        """Request password reset for user."""
        user = self.get_user_by_email(email)
        if not user:
            return False  # Don't reveal if email exists

        # Generate reset token
        reset_token = generate_secure_token()
        user.password_reset_token = reset_token
        user.password_reset_expires = datetime.now(
            timezone.utc
        ) + timedelta(hours=1)

        self.log_audit_action(
            user_id=user.id,
            action="PASSWORD_RESET",
            success="success",
            details="Password reset requested",
        )

        self.db.commit()
        return True

    def reset_password(self, token: str, new_password: str) -> bool:
        """Reset user password with token."""
        user = (
            self.db.query(User)
            .filter(User.password_reset_token == token)
            .first()
        )
        if not user:
            return False

        # Check if token is expired
        if (
            user.password_reset_expires
            and datetime.now(timezone.utc) > user.password_reset_expires
        ):
            return False

        # Validate password requirements
        _validate_password_requirements(new_password)

        # Update password
        user.hashed_password = get_password_hash(new_password)
        user.password_reset_token = None
        user.password_reset_expires = None
        user.failed_login_attempts = 0
        user.account_locked_until = None

        self.log_audit_action(
            user_id=user.id,
            action="PASSWORD_RESET",
            success="success",
            details="Password reset completed",
        )

        self.db.commit()
        return True

    def change_password(
        self, user_id: int, current_password: str, new_password: str
    ) -> bool:
        """Change user password."""
        user = self.get_user_by_id(user_id)
        if not user:
            return False

        # Verify current password
        if not verify_password(current_password, user.hashed_password):
            self.log_audit_action(
                user_id=user.id,
                action="PASSWORD_CHANGE",
                success="failure",
                details="Invalid current password",
            )
            return False

        # Update password
        user.hashed_password = get_password_hash(new_password)

        self.log_audit_action(
            user_id=user.id, action="PASSWORD_CHANGE", success="success"
        )

        self.db.commit()
        return True

    def update_user(
        self, user_id: int, user_update: UserUpdate
    ) -> Optional[User]:
        """Update user information."""
        user = self.get_user_by_id(user_id)
        if not user:
            return None

        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        self.log_audit_action(
            user_id=user.id,
            action="PROFILE_UPDATED",
            success="success",
            details=f"Updated fields: {list(update_data.keys())}",
        )

        self.db.commit()
        self.db.refresh(user)
        return user

    def assign_role(
        self, user_id: int, role: RoleType, assigned_by_id: int
    ) -> bool:
        """Assign role to user."""
        user = self.get_user_by_id(user_id)
        if not user:
            return False

        role_obj = self.db.query(Role).filter(Role.name == role).first()
        if not role_obj:
            return False

        # Check if user already has this role
        existing_role = (
            self.db.query(UserRole)
            .filter(
                UserRole.user_id == user_id,
                UserRole.role_id == role_obj.id,
                UserRole.is_active,
            )
            .first()
        )

        if existing_role:
            return True  # Already has role

        # Assign role
        user_role = UserRole(
            user_id=user_id,
            role_id=role_obj.id,
            assigned_by=assigned_by_id,
        )
        self.db.add(user_role)

        self.log_audit_action(
            user_id=user_id,
            action="ROLE_ASSIGNED",
            success="success",
            details=f"Role {role.value} assigned by user {assigned_by_id}",
        )

        self.db.commit()
        return True

    def remove_role(
        self, user_id: int, role: RoleType, removed_by_id: int
    ) -> bool:
        """Remove role from user."""
        role_obj = self.db.query(Role).filter(Role.name == role).first()
        if not role_obj:
            return False

        user_role = (
            self.db.query(UserRole)
            .filter(
                UserRole.user_id == user_id,
                UserRole.role_id == role_obj.id,
                UserRole.is_active == True,
            )
            .first()
        )

        if not user_role:
            return True  # Already doesn't have role

        # Remove role
        user_role.is_active = False

        self.log_audit_action(
            user_id=user_id,
            action="ROLE_REMOVED",
            success="success",
            details=f"Role {role.value} removed by user {removed_by_id}",
        )

        self.db.commit()
        return True

    def get_user_roles(self, user_id: int) -> List[RoleType]:
        """Get all active roles for a user."""
        user_roles = (
            self.db.query(UserRole)
            .join(Role)
            .filter(
                UserRole.user_id == user_id, UserRole.is_active == True
            )
            .all()
        )

        return [user_role.role.name for user_role in user_roles]

    def logout_user(
        self, user_id: int, ip_address: str = None, user_agent: str = None
    ) -> bool:
        """Logout user and log audit action."""
        user = self.get_user_by_id(user_id)
        if not user:
            return False

        # Log the logout action
        self.log_audit_action(
            user_id=user_id,
            action="LOGOUT",
            success="success",
            ip_address=ip_address,
            user_agent=user_agent,
            details="User logged out successfully",
        )

        self.db.commit()
        return True

    def log_audit_action(
        self,
        action: str,  # Changed from AuditAction to string for lean version
        success: str = "success",
        user_id: Optional[int] = None,
        resource: Optional[str] = None,
        resource_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        details: Optional[str] = None,
    ):
        """Log an audit action - simplified for lean version."""
        # Audit logging removed in lean version - could add simple logging here if needed
        pass

    def create_user_tokens(
        self, user: User, expires_delta: timedelta | None = None
    ) -> Dict[str, str]:
        """Return access and refresh tokens for a user."""
        access = create_access_token(user.id, expires_delta=expires_delta)
        refresh = create_refresh_token(user.id)
        return {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "bearer",
        }
