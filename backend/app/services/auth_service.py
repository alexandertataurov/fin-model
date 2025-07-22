from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.role import Role, UserRole, RoleType
from app.models.audit import AuditLog, AuditAction
from app.schemas.user import UserCreate, UserUpdate, UserLogin
from app.core.security import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    create_refresh_token,
    create_email_verification_token,
    create_password_reset_token,
    verify_email_verification_token,
    verify_password_reset_token,
    generate_secure_token
)


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        return self.db.query(User).filter(User.username == username).first()

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, user_create: UserCreate, role: RoleType = RoleType.VIEWER) -> User:
        """Create a new user with specified role."""
        # Check if user already exists
        if self.get_user_by_email(user_create.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        if self.get_user_by_username(user_create.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

        # Create user
        db_user = User(
            email=user_create.email,
            username=user_create.username,
            first_name=user_create.first_name,
            last_name=user_create.last_name,
            hashed_password=get_password_hash(user_create.password),
            is_active=True,
            is_verified=False,
            verification_token=generate_secure_token(),
            failed_login_attempts=0
        )
        
        self.db.add(db_user)
        self.db.flush()  # Get the user ID

        # Assign role
        role_obj = self.db.query(Role).filter(Role.name == role).first()
        if role_obj:
            user_role = UserRole(
                user_id=db_user.id,
                role_id=role_obj.id,
                is_active=True
            )
            self.db.add(user_role)

        # Log the registration
        self.log_audit_action(
            user_id=db_user.id,
            action=AuditAction.REGISTER,
            success="success"
        )

        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, email: str, password: str, ip_address: str = None, user_agent: str = None) -> Optional[User]:
        """Authenticate user with email and password."""
        user = self.get_user_by_email(email)
        if not user:
            self.log_audit_action(
                action=AuditAction.FAILED_LOGIN,
                success="failure",
                details=f"User not found: {email}",
                ip_address=ip_address,
                user_agent=user_agent
            )
            return None

        # Check if account is locked
        if user.is_locked:
            self.log_audit_action(
                user_id=user.id,
                action=AuditAction.FAILED_LOGIN,
                success="failure",
                details="Account is locked",
                ip_address=ip_address,
                user_agent=user_agent
            )
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail=f"Account is locked until {user.account_locked_until}"
            )

        # Check if account is active
        if not user.is_active:
            self.log_audit_action(
                user_id=user.id,
                action=AuditAction.FAILED_LOGIN,
                success="failure",
                details="Account is not active",
                ip_address=ip_address,
                user_agent=user_agent
            )
            return None

        # Verify password
        if not verify_password(password, user.hashed_password):
            # Increment failed login attempts
            user.failed_login_attempts += 1
            
            # Lock account after 5 failed attempts
            if user.failed_login_attempts >= 5:
                user.account_locked_until = datetime.utcnow() + timedelta(minutes=30)
                self.log_audit_action(
                    user_id=user.id,
                    action=AuditAction.ACCOUNT_LOCKED,
                    success="success",
                    details="Account locked due to multiple failed login attempts",
                    ip_address=ip_address,
                    user_agent=user_agent
                )

            self.log_audit_action(
                user_id=user.id,
                action=AuditAction.FAILED_LOGIN,
                success="failure",
                details=f"Invalid password attempt {user.failed_login_attempts}",
                ip_address=ip_address,
                user_agent=user_agent
            )
            
            self.db.commit()
            return None

        # Successful login - reset failed attempts and update last login
        user.failed_login_attempts = 0
        user.last_login = datetime.utcnow()
        user.account_locked_until = None

        self.log_audit_action(
            user_id=user.id,
            action=AuditAction.LOGIN,
            success="success",
            ip_address=ip_address,
            user_agent=user_agent
        )

        self.db.commit()
        return user

    def verify_email(self, token: str) -> bool:
        """Verify user email with token."""
        email = verify_email_verification_token(token)
        if not email:
            return False

        user = self.get_user_by_email(email)
        if not user or user.verification_token != token:
            return False

        user.is_verified = True
        user.verification_token = None

        self.log_audit_action(
            user_id=user.id,
            action=AuditAction.EMAIL_VERIFICATION,
            success="success"
        )

        self.db.commit()
        return True

    def request_password_reset(self, email: str) -> bool:
        """Request password reset for user."""
        user = self.get_user_by_email(email)
        if not user:
            return False  # Don't reveal if email exists

        # Generate reset token
        reset_token = create_password_reset_token(email)
        user.password_reset_token = reset_token
        user.password_reset_expires = datetime.utcnow() + timedelta(hours=1)

        self.log_audit_action(
            user_id=user.id,
            action=AuditAction.PASSWORD_RESET,
            success="success",
            details="Password reset requested"
        )

        self.db.commit()
        return True

    def reset_password(self, token: str, new_password: str) -> bool:
        """Reset user password with token."""
        email = verify_password_reset_token(token)
        if not email:
            return False

        user = self.get_user_by_email(email)
        if not user or user.password_reset_token != token:
            return False

        if user.password_reset_expires and datetime.utcnow() > user.password_reset_expires:
            return False

        # Update password
        user.hashed_password = get_password_hash(new_password)
        user.password_reset_token = None
        user.password_reset_expires = None
        user.failed_login_attempts = 0
        user.account_locked_until = None

        self.log_audit_action(
            user_id=user.id,
            action=AuditAction.PASSWORD_CHANGE,
            success="success",
            details="Password reset completed"
        )

        self.db.commit()
        return True

    def change_password(self, user_id: int, current_password: str, new_password: str) -> bool:
        """Change user password."""
        user = self.get_user_by_id(user_id)
        if not user:
            return False

        if not verify_password(current_password, user.hashed_password):
            self.log_audit_action(
                user_id=user.id,
                action=AuditAction.PASSWORD_CHANGE,
                success="failure",
                details="Invalid current password"
            )
            return False

        user.hashed_password = get_password_hash(new_password)

        self.log_audit_action(
            user_id=user.id,
            action=AuditAction.PASSWORD_CHANGE,
            success="success"
        )

        self.db.commit()
        return True

    def get_user_roles(self, user_id: int) -> List[str]:
        """Get user roles."""
        user_roles = self.db.query(UserRole).filter(
            UserRole.user_id == user_id,
            UserRole.is_active == True
        ).all()
        
        role_names = []
        for user_role in user_roles:
            role_names.append(user_role.role.name.value)
        
        return role_names

    def assign_role(self, user_id: int, role: RoleType, assigned_by: int) -> bool:
        """Assign role to user."""
        # Check if user already has this role
        existing_role = self.db.query(UserRole).filter(
            UserRole.user_id == user_id,
            UserRole.role.has(Role.name == role),
            UserRole.is_active == True
        ).first()

        if existing_role:
            return False

        # Get role object
        role_obj = self.db.query(Role).filter(Role.name == role).first()
        if not role_obj:
            return False

        # Create user role
        user_role = UserRole(
            user_id=user_id,
            role_id=role_obj.id,
            assigned_by=assigned_by,
            is_active=True
        )

        self.db.add(user_role)

        self.log_audit_action(
            user_id=assigned_by,
            action=AuditAction.ROLE_ASSIGNED,
            success="success",
            details=f"Assigned {role.value} role to user {user_id}"
        )

        self.db.commit()
        return True

    def log_audit_action(
        self, 
        action: AuditAction, 
        user_id: Optional[int] = None,
        success: str = "success",
        resource: Optional[str] = None,
        resource_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        details: Optional[str] = None
    ):
        """Log audit action."""
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            resource=resource,
            resource_id=resource_id,
            ip_address=ip_address,
            user_agent=user_agent,
            details=details,
            success=success
        )
        
        self.db.add(audit_log)

    def logout_user(self, user_id: int, ip_address: str = None, user_agent: str = None):
        """Log user logout."""
        self.log_audit_action(
            user_id=user_id,
            action=AuditAction.LOGOUT,
            success="success",
            ip_address=ip_address,
            user_agent=user_agent
        )
        self.db.commit() 