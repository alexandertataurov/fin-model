from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.models.base import get_db
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_active_user
from app.services.webauthn_service import WebAuthnService
from app.services.auth_service import AuthService
from app.schemas.mfa import (
    WebAuthnRegistrationOptionsResponse,
    WebAuthnRegistrationRequest,
    WebAuthnAuthenticationOptionsResponse,
    WebAuthnAuthenticationRequest,
    WebAuthnCredentialResponse,
    AuthenticationFlowResponse
)
from app.core.rate_limiter import RateLimiter
from app.core.security import create_access_token
from app.core.config import settings
from datetime import timedelta

router = APIRouter()


@router.post("/register/begin", response_model=WebAuthnRegistrationOptionsResponse)
def begin_webauthn_registration(
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Begin WebAuthn credential registration.
    Returns registration options for the client.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="webauthn_register_begin",
        max_attempts=5,
        window_minutes=15,
        block_minutes=30,
    )

    webauthn_service = WebAuthnService(db)
    
    try:
        options = webauthn_service.generate_registration_options(current_user)
        return WebAuthnRegistrationOptionsResponse(**options)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate registration options"
        )


@router.post("/register/complete", response_model=WebAuthnCredentialResponse)
def complete_webauthn_registration(
    registration_request: WebAuthnRegistrationRequest,
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Complete WebAuthn credential registration.
    Verifies the credential and stores it.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="webauthn_register_complete",
        max_attempts=5,
        window_minutes=15,
        block_minutes=30,
    )

    webauthn_service = WebAuthnService(db)
    
    try:
        # Extract challenge_id from credential
        challenge_id = registration_request.credential.get('challenge_id')
        if not challenge_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing challenge ID"
            )

        credential = webauthn_service.verify_registration_response(
            user=current_user,
            credential=registration_request.credential,
            challenge_id=challenge_id,
            device_name=registration_request.device_name
        )

        return WebAuthnCredentialResponse(
            id=credential.id,
            credential_id=credential.credential_id,
            device_name=credential.device_name,
            device_type=credential.device_type,
            created_at=credential.created_at,
            last_used=credential.last_used
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete registration"
        )


@router.post("/authenticate/begin", response_model=WebAuthnAuthenticationOptionsResponse)
def begin_webauthn_authentication(
    username: str,
    request: Request,
    db: Session = Depends(get_db)
) -> Any:
    """
    Begin WebAuthn authentication.
    Returns authentication options for the client.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="webauthn_auth_begin",
        max_attempts=5,
        window_minutes=15,
        block_minutes=30,
    )

    auth_service = AuthService(db)
    webauthn_service = WebAuthnService(db)
    
    # Get user by username or email
    user = auth_service.get_user_by_email(username)
    if not user:
        user = auth_service.get_user_by_username(username)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    try:
        options = webauthn_service.generate_authentication_options(user)
        return WebAuthnAuthenticationOptionsResponse(**options)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate authentication options"
        )


@router.post("/authenticate/complete", response_model=AuthenticationFlowResponse)
def complete_webauthn_authentication(
    auth_request: WebAuthnAuthenticationRequest,
    request: Request,
    db: Session = Depends(get_db)
) -> Any:
    """
    Complete WebAuthn authentication.
    Verifies the assertion and issues JWT if successful.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="webauthn_auth_complete",
        max_attempts=5,
        window_minutes=15,
        block_minutes=30,
    )

    auth_service = AuthService(db)
    webauthn_service = WebAuthnService(db)
    
    # Get user by username or email
    user = auth_service.get_user_by_email(auth_request.username)
    if not user:
        user = auth_service.get_user_by_username(auth_request.username)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive"
        )

    try:
        # Extract challenge_id from credential
        challenge_id = auth_request.credential.get('challenge_id')
        if not challenge_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing challenge ID"
            )

        # Verify WebAuthn assertion
        success = webauthn_service.verify_authentication_response(
            user=user,
            credential=auth_request.credential,
            challenge_id=challenge_id
        )

        if success:
            # Generate JWT token
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                subject=user.id, expires_delta=access_token_expires
            )

            # Log successful authentication
            from app.models.audit import AuditAction
            auth_service.log_audit_action(
                user_id=user.id,
                action=AuditAction.LOGIN,
                success="success",
                details="WebAuthn authentication successful",
                ip_address=request.client.host if request.client else None,
                user_agent=request.headers.get("user-agent")
            )

            return AuthenticationFlowResponse(
                status="success",
                access_token=access_token,
                token_type="bearer",
                message="WebAuthn authentication successful"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="WebAuthn authentication failed"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete authentication"
        )


@router.get("/credentials", response_model=List[WebAuthnCredentialResponse])
def get_webauthn_credentials(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get all WebAuthn credentials for the current user.
    """
    webauthn_service = WebAuthnService(db)
    credentials = webauthn_service.get_user_credentials(current_user)
    
    return [
        WebAuthnCredentialResponse(
            id=cred.id,
            credential_id=cred.credential_id,
            device_name=cred.device_name,
            device_type=cred.device_type,
            created_at=cred.created_at,
            last_used=cred.last_used
        )
        for cred in credentials
    ]


@router.delete("/credentials/{credential_id}")
def delete_webauthn_credential(
    credential_id: str,
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Delete a WebAuthn credential.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="webauthn_delete_credential",
        max_attempts=10,
        window_minutes=30,
        block_minutes=60,
    )

    webauthn_service = WebAuthnService(db)
    
    success = webauthn_service.delete_credential(current_user, credential_id)
    
    if success:
        return {"message": "WebAuthn credential deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credential not found"
        )


@router.put("/credentials/{credential_id}/name")
def update_credential_name(
    credential_id: str,
    new_name: str,
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Update the device name of a WebAuthn credential.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="webauthn_update_name",
        max_attempts=10,
        window_minutes=30,
        block_minutes=60,
    )

    webauthn_service = WebAuthnService(db)
    
    success = webauthn_service.update_credential_name(current_user, credential_id, new_name)
    
    if success:
        return {"message": "Credential name updated successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credential not found"
        )