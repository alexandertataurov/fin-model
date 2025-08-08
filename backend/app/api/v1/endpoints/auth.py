from typing import Any
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials,
)
from sqlalchemy.orm import Session

from app.models.base import get_db
from app.models.role import RoleType
# Audit models removed in lean version
from app.schemas.user import (
    UserRegister,
    User,
    UserUpdate,
    UserLogin,
    Token,
    PasswordReset,
    PasswordResetConfirm,
    PasswordChange,
    EmailVerification,
)
from app.schemas.mfa import AuthenticationFlowResponse
from app.services.auth_service import AuthService
from app.core.security import (
    create_access_token,
    verify_token,
)
from app.core.config import settings
from app.core.rate_limiter import RateLimiter

router = APIRouter()

# Use HTTPBearer with auto_error disabled so we can return 401 instead of 403
security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Get current authenticated user."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    user_id = verify_token(token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    auth_service = AuthService(db)
    user = auth_service.get_user_by_id(int(user_id))

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return current_user


def require_role(required_role: RoleType):
    """Decorator to require specific role."""

    def role_checker(
        current_user: User = Depends(get_current_active_user),
        db: Session = Depends(get_db),
    ):
        auth_service = AuthService(db)
        user_roles = auth_service.get_user_roles(current_user.id)

        if required_role.value not in user_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
            )
        return current_user

    return role_checker


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register(
    user_in: UserRegister, request: Request, db: Session = Depends(get_db)
) -> Any:
    """Register a new user."""
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="register",
        max_attempts=3,  # More restrictive for registration
        window_minutes=15,
        block_minutes=60,
    )

    auth_service = AuthService(db)

    # Get client info for audit logging
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    try:
        if user_in.full_name and (
            user_in.first_name is None or user_in.last_name is None
        ):
            parts = user_in.full_name.split(" ", 1)
            user_in.first_name = parts[0]
            user_in.last_name = parts[1] if len(parts) > 1 else ""

        user = auth_service.create_user(user_in, RoleType.VIEWER)

        # Note: Users now start unverified and must verify their email
        # Use the /dev-verify-user endpoint for development testing if needed

        return user

    except HTTPException:
        raise
    except Exception as e:
        auth_service.log_audit_action(
            action="REGISTER",
            success="error",
            details=str(e),
            ip_address=ip_address,
            user_agent=user_agent,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed",
        )


@router.post("/login", response_model=Token)
async def login(
    login_data: UserLogin,
    request: Request,
    db: Session = Depends(get_db),
) -> Any:
    """Login user and return access token."""
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="login",
        max_attempts=5,
        window_minutes=15,
        block_minutes=30,
    )

    auth_service = AuthService(db)

    # Extract login data
    identifier = login_data.email
    password = login_data.password
    remember_me = login_data.remember_me or False

    # Get client info for audit logging
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    user = auth_service.authenticate_user(
        identifier=identifier,
        password=password,
        ip_address=ip_address,
        user_agent=user_agent,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Email verification temporarily disabled

    # Create tokens
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    if remember_me:
        access_token_expires = timedelta(days=30)

    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/login-enhanced", response_model=AuthenticationFlowResponse)
async def login_enhanced(
    login_data: UserLogin,
    request: Request,
    db: Session = Depends(get_db),
) -> Any:
    """
    Enhanced login endpoint with multi-step authentication support.
    Returns different responses based on user's authentication setup.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="login_enhanced",
        max_attempts=5,
        window_minutes=15,
        block_minutes=30,
    )

    auth_service = AuthService(db)

    # Extract login data
    identifier = login_data.email
    password = login_data.password
    remember_me = login_data.remember_me or False

    # Get client info for audit logging
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    user = auth_service.authenticate_user(
        identifier=identifier,
        password=password,
        ip_address=ip_address,
        user_agent=user_agent,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Email verification temporarily disabled

    # Check what authentication methods are available/required
    from app.services.mfa_service import MFAService
    from app.services.webauthn_service import WebAuthnService
    
    mfa_service = MFAService(db)
    webauthn_service = WebAuthnService(db)
    
    has_mfa = mfa_service.is_mfa_enabled(user)
    has_webauthn = webauthn_service.has_webauthn_credentials(user)
    
    available_methods = []
    if has_mfa:
        available_methods.append("totp")
    if has_webauthn:
        available_methods.append("webauthn")
    
    # If no additional authentication is required, issue token
    if not has_mfa and not has_webauthn:
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        if remember_me:
            access_token_expires = timedelta(days=30)

        access_token = create_access_token(
            subject=user.id, expires_delta=access_token_expires
        )
        
        return AuthenticationFlowResponse(
            status="success",
            access_token=access_token,
            token_type="bearer",
            message="Authentication successful"
        )
    
    # Create challenge for second factor
    challenge_id = None
    if has_mfa or has_webauthn:
        challenge_id = mfa_service.create_mfa_challenge(
            user=user,
            challenge_type="login",
            challenge_data={
                "user_id": user.id,
                "step": "second_factor",
                "remember_me": remember_me
            }
        )
    
    # Determine available methods only (email verification disabled)
    
    return AuthenticationFlowResponse(
        status="mfa_required",
        challenge_id=challenge_id,
        available_methods=available_methods,
        message=f"Second factor authentication required. Available methods: {', '.join(available_methods)}"
    )


@router.post("/logout")
def logout(
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """Logout user."""
    auth_service = AuthService(db)

    # Get client info for audit logging
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    auth_service.logout_user(
        user_id=current_user.id, ip_address=ip_address, user_agent=user_agent
    )

    return {"message": "Successfully logged out"}


@router.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)) -> Any:
    """Refresh access token."""
    user_id = verify_token(refresh_token, "refresh")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )

    auth_service = AuthService(db)
    user = auth_service.get_user_by_id(int(user_id))

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user"
        )

    # Create new access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": int(access_token_expires.total_seconds()),
    }


@router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_active_user)) -> Any:
    """Get current user information."""
    return current_user


@router.put("/me", response_model=User)
def update_users_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """Update the current user's profile."""
    auth_service = AuthService(db)
    updated = auth_service.update_user(current_user.id, user_update)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return updated


@router.post("/verify-email")
def verify_email(verification: EmailVerification, db: Session = Depends(get_db)) -> Any:
    """Verify user email."""
    auth_service = AuthService(db)

    if auth_service.verify_email(verification.token):
        return {"message": "Email verified successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )


@router.post("/dev-verify-user")
def dev_verify_user(request: dict, db: Session = Depends(get_db)) -> Any:
    """Development only: Manually verify a user by email or user ID."""
    auth_service = AuthService(db)

    user = None
    if "email" in request:
        user = auth_service.get_user_by_email(request["email"])
    elif "user_id" in request:
        user = auth_service.get_user_by_id(request["user_id"])

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if user.is_verified:
        return {"message": f"User {user.email} is already verified"}

    # Manually verify the user
    user.is_verified = True
    user.verification_token = None
    db.commit()
    db.refresh(user)

    auth_service.log_audit_action(
        user_id=user.id,
        action="EMAIL_VERIFICATION",
        success="success",
        details="Manually verified via dev endpoint",
    )

    return {
        "message": f"User {user.email} has been verified successfully",
        "user_id": user.id,
        "email": user.email,
    }


@router.post("/request-password-reset")
def request_password_reset(
    password_reset: PasswordReset, request: Request, db: Session = Depends(get_db)
) -> Any:
    """Request password reset."""
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="password_reset",
        max_attempts=3,
        window_minutes=60,
        block_minutes=120,
    )

    auth_service = AuthService(db)

    # Always return success to prevent email enumeration
    auth_service.request_password_reset(password_reset.email)

    return {"message": "If the email exists, a password reset link has been sent"}


@router.post("/reset-password")
def reset_password(
    reset_data: PasswordResetConfirm, db: Session = Depends(get_db)
) -> Any:
    """Reset password with token."""
    auth_service = AuthService(db)

    if auth_service.reset_password(reset_data.token, reset_data.new_password):
        return {"message": "Password reset successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )


@router.post("/change-password")
def change_password(
    password_change: PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """Change user password."""
    auth_service = AuthService(db)

    if auth_service.change_password(
        user_id=current_user.id,
        current_password=password_change.current_password,
        new_password=password_change.new_password,
    ):
        return {"message": "Password changed successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid current password"
        )
