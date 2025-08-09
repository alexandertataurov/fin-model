from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.models.base import get_db
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_active_user
from app.services.mfa_service import MFAService
from app.schemas.mfa import (
    MFASetupResponse,
    MFAVerifySetupRequest,
    MFADisableRequest,
    MFABackupCodesResponse,
    MFAStatusResponse,
    AuthenticationFlowResponse,
    MFAVerifyRequest,
)
from app.core.rate_limiter import RateLimiter

router = APIRouter()


@router.post("/setup", response_model=MFASetupResponse)
def setup_mfa(
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Initialize MFA setup for the current user.
    Returns TOTP secret and QR code for authenticator app setup.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="mfa_setup",
        max_attempts=3,
        window_minutes=60,
        block_minutes=60,
    )

    mfa_service = MFAService(db)

    try:
        setup_data = mfa_service.setup_mfa(current_user)
        return MFASetupResponse(**setup_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to setup MFA",
        )


@router.post("/verify-setup")
def verify_mfa_setup(
    verify_request: MFAVerifySetupRequest,
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Verify TOTP token and enable MFA for the user.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="mfa_verify_setup",
        max_attempts=5,
        window_minutes=15,
        block_minutes=30,
    )

    mfa_service = MFAService(db)

    try:
        success = mfa_service.verify_mfa_setup(
            current_user, verify_request.token
        )
        if success:
            return {"message": "MFA enabled successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification code",
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify MFA setup",
        )


@router.post("/verify", response_model=AuthenticationFlowResponse)
def verify_mfa_token(
    verify_request: MFAVerifyRequest,
    request: Request,
    db: Session = Depends(get_db),
) -> Any:
    """
    Verify MFA token during login process.
    This is used after username/password authentication to complete 2FA.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="mfa_verify",
        max_attempts=5,
        window_minutes=15,
        block_minutes=30,
    )

    from app.services.auth_service import AuthService
    from app.core.security import create_access_token
    from datetime import timedelta
    from app.core.config import settings

    auth_service = AuthService(db)
    mfa_service = MFAService(db)

    # Get client info for audit logging
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    # First authenticate with username/password
    user = auth_service.authenticate_user(
        identifier=verify_request.username,
        password=verify_request.password,
        ip_address=ip_address,
        user_agent=user_agent,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Check if MFA is enabled
    if not mfa_service.is_mfa_enabled(user):
        # MFA not enabled, proceed with normal login
        access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        access_token = create_access_token(
            subject=user.id, expires_delta=access_token_expires
        )
        return AuthenticationFlowResponse(
            status="success",
            access_token=access_token,
            token_type="bearer",
            message="Authentication successful",
        )

    # Verify MFA token
    if mfa_service.verify_mfa_token(
        user, verify_request.mfa_token, verify_request.use_backup
    ):
        # MFA verification successful
        access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        access_token = create_access_token(
            subject=user.id, expires_delta=access_token_expires
        )
        return AuthenticationFlowResponse(
            status="success",
            access_token=access_token,
            token_type="bearer",
            message="Authentication successful",
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid MFA token",
        )


@router.get("/backup-codes", response_model=MFABackupCodesResponse)
def get_backup_codes(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get remaining backup recovery codes for the current user.
    """
    mfa_service = MFAService(db)

    try:
        backup_codes = mfa_service.get_backup_codes(current_user)
        return MFABackupCodesResponse(
            backup_codes=backup_codes, remaining_count=len(backup_codes)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve backup codes",
        )


@router.post("/regenerate-backup-codes", response_model=MFABackupCodesResponse)
def regenerate_backup_codes(
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Generate new backup recovery codes for the current user.
    This invalidates all existing backup codes.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="mfa_regenerate_codes",
        max_attempts=3,
        window_minutes=60,
        block_minutes=60,
    )

    mfa_service = MFAService(db)

    try:
        new_codes = mfa_service.regenerate_backup_codes(current_user)
        return MFABackupCodesResponse(
            backup_codes=new_codes, remaining_count=len(new_codes)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to regenerate backup codes",
        )


@router.post("/disable")
def disable_mfa(
    disable_request: MFADisableRequest,
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Disable MFA for the current user.
    Requires password verification for security.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="mfa_disable",
        max_attempts=5,
        window_minutes=60,
        block_minutes=120,
    )

    mfa_service = MFAService(db)

    try:
        success = mfa_service.disable_mfa(
            current_user, disable_request.password
        )
        if success:
            return {"message": "MFA disabled successfully"}
        else:
            return {"message": "MFA was not enabled"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to disable MFA",
        )


@router.get("/status", response_model=MFAStatusResponse)
def get_mfa_status(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get MFA status for the current user.
    """
    mfa_service = MFAService(db)

    try:
        is_enabled = mfa_service.is_mfa_enabled(current_user)
        backup_codes_count = 0
        last_used = None

        if is_enabled:
            backup_codes = mfa_service.get_backup_codes(current_user)
            backup_codes_count = len(backup_codes)

            # Get last used timestamp
            from app.models.mfa import MFAToken

            mfa_token = (
                db.query(MFAToken)
                .filter(
                    MFAToken.user_id == current_user.id,
                    MFAToken.is_verified == True,
                )
                .first()
            )
            if mfa_token:
                last_used = mfa_token.last_used

        return MFAStatusResponse(
            enabled=is_enabled,
            backup_codes_count=backup_codes_count,
            last_used=last_used,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get MFA status",
        )
