from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta

from app.models.base import get_db
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_active_user
from app.services.oauth_service import OAuthService
from app.schemas.mfa import (
    OAuthAccountResponse,
    AuthenticationFlowResponse
)
from app.core.oauth import get_oauth_client
from app.core.security import create_access_token
from app.core.config import settings
from app.core.rate_limiter import RateLimiter

router = APIRouter()


@router.get("/google/login")
async def google_login(request: Request):
    """Initiate Google OAuth flow."""
    try:
        google = get_oauth_client('google')
        redirect_uri = f"{settings.FRONTEND_URL}/auth/oauth/google/callback"
        return await google.authorize_redirect(request, redirect_uri)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initiate Google OAuth"
        )


@router.get("/google/callback")
async def google_callback(
    request: Request, 
    db: Session = Depends(get_db)
) -> Any:
    """Handle Google OAuth callback."""
    try:
        google = get_oauth_client('google')
        token = await google.authorize_access_token(request)
        user_info = token.get('userinfo')
        
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user information from Google"
            )

        oauth_service = OAuthService(db)
        
        # Handle OAuth user
        user = await oauth_service.handle_oauth_user(
            provider='google',
            provider_id=user_info['sub'],
            email=user_info['email'],
            name=user_info.get('name', ''),
            profile_picture=user_info.get('picture'),
            access_token=token.get('access_token'),
            refresh_token=token.get('refresh_token'),
            token_expires_at=datetime.now(timezone.utc) + timedelta(seconds=token.get('expires_in', 3600))
        )

        # Generate JWT token for our application
        access_token = create_access_token(
            subject=user.id,
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        # Redirect to frontend with token
        frontend_redirect = f"{settings.FRONTEND_URL}/auth/oauth/success?token={access_token}"
        return RedirectResponse(url=frontend_redirect)
        
    except HTTPException:
        raise
    except Exception as e:
        # Redirect to frontend with error
        frontend_redirect = f"{settings.FRONTEND_URL}/auth/oauth/error?message=google_oauth_failed"
        return RedirectResponse(url=frontend_redirect)


@router.get("/microsoft/login")
async def microsoft_login(request: Request):
    """Initiate Microsoft OAuth flow."""
    try:
        microsoft = get_oauth_client('microsoft')
        redirect_uri = f"{settings.FRONTEND_URL}/auth/oauth/microsoft/callback"
        return await microsoft.authorize_redirect(request, redirect_uri)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initiate Microsoft OAuth"
        )


@router.get("/microsoft/callback")
async def microsoft_callback(
    request: Request, 
    db: Session = Depends(get_db)
) -> Any:
    """Handle Microsoft OAuth callback."""
    try:
        microsoft = get_oauth_client('microsoft')
        token = await microsoft.authorize_access_token(request)
        user_info = token.get('userinfo')
        
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user information from Microsoft"
            )

        oauth_service = OAuthService(db)
        
        # Handle OAuth user
        user = await oauth_service.handle_oauth_user(
            provider='microsoft',
            provider_id=user_info['sub'],
            email=user_info['email'],
            name=user_info.get('name', ''),
            profile_picture=user_info.get('picture'),
            access_token=token.get('access_token'),
            refresh_token=token.get('refresh_token'),
            token_expires_at=datetime.now(timezone.utc) + timedelta(seconds=token.get('expires_in', 3600))
        )

        # Generate JWT token for our application
        access_token = create_access_token(
            subject=user.id,
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        # Redirect to frontend with token
        frontend_redirect = f"{settings.FRONTEND_URL}/auth/oauth/success?token={access_token}"
        return RedirectResponse(url=frontend_redirect)
        
    except HTTPException:
        raise
    except Exception as e:
        # Redirect to frontend with error
        frontend_redirect = f"{settings.FRONTEND_URL}/auth/oauth/error?message=microsoft_oauth_failed"
        return RedirectResponse(url=frontend_redirect)


@router.post("/link/{provider}")
async def link_oauth_account(
    provider: str,
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Link OAuth account to existing user account.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="oauth_link",
        max_attempts=3,
        window_minutes=15,
        block_minutes=30,
    )

    if provider not in ['google', 'microsoft']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported OAuth provider"
        )

    try:
        oauth_client = get_oauth_client(provider)
        redirect_uri = f"{settings.FRONTEND_URL}/auth/oauth/{provider}/link-callback"
        return await oauth_client.authorize_redirect(request, redirect_uri, state=str(current_user.id))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to initiate {provider} OAuth linking"
        )


@router.delete("/unlink/{provider}")
async def unlink_oauth_account(
    provider: str,
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Unlink OAuth account from user.
    """
    # Apply rate limiting
    rate_limiter = RateLimiter(db)
    rate_limiter.check_rate_limit(
        request=request,
        endpoint="oauth_unlink",
        max_attempts=5,
        window_minutes=30,
        block_minutes=60,
    )

    if provider not in ['google', 'microsoft']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported OAuth provider"
        )

    oauth_service = OAuthService(db)
    
    # Check if account can be safely unlinked
    if not oauth_service.can_unlink_oauth(current_user, provider):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot unlink OAuth account. Set a password or link another OAuth account first."
        )
    
    success = oauth_service.unlink_oauth_account(current_user, provider)
    
    if success:
        return {"message": f"{provider.title()} account unlinked successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No {provider} account linked to this user"
        )


@router.get("/accounts", response_model=list[OAuthAccountResponse])
async def get_oauth_accounts(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get all OAuth accounts linked to the current user.
    """
    oauth_service = OAuthService(db)
    accounts = oauth_service.get_oauth_accounts(current_user)
    
    return [
        OAuthAccountResponse(
            id=account.id,
            provider=account.provider,
            email=account.email,
            display_name=account.display_name,
            profile_picture=account.profile_picture,
            created_at=account.created_at
        )
        for account in accounts
    ]