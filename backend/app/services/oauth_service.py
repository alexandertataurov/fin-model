from typing import Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.mfa import OAuthAccount


class OAuthService:
    """Service for OAuth authentication operations."""
    
    def __init__(self, db: Session):
        self.db = db

    async def handle_oauth_user(
        self,
        provider: str,
        provider_id: str,
        email: str,
        name: str,
        profile_picture: str = None,
        access_token: str = None,
        refresh_token: str = None,
        token_expires_at: datetime = None
    ) -> User:
        """
        Handle OAuth user authentication and account linking.
        
        Args:
            provider: OAuth provider name (google, microsoft)
            provider_id: Provider's unique user ID
            email: User's email from provider
            name: User's display name from provider
            profile_picture: URL to profile picture
            access_token: OAuth access token
            refresh_token: OAuth refresh token
            token_expires_at: Token expiration time
            
        Returns:
            User object (existing or newly created)
        """
        # Check if OAuth account already exists
        oauth_account = self.db.query(OAuthAccount).filter(
            OAuthAccount.provider == provider,
            OAuthAccount.provider_id == provider_id
        ).first()

        if oauth_account:
            # Update existing OAuth account with latest info
            oauth_account.email = email
            oauth_account.display_name = name
            oauth_account.profile_picture = profile_picture
            oauth_account.access_token = access_token
            oauth_account.refresh_token = refresh_token
            oauth_account.token_expires_at = token_expires_at
            oauth_account.updated_at = datetime.now(timezone.utc)
            self.db.commit()
            return oauth_account.user

        # Check if user exists with same email
        existing_user = self.db.query(User).filter(User.email == email).first()

        if existing_user:
            # Link OAuth account to existing user
            oauth_account = OAuthAccount(
                user_id=existing_user.id,
                provider=provider,
                provider_id=provider_id,
                email=email,
                display_name=name,
                profile_picture=profile_picture,
                access_token=access_token,
                refresh_token=refresh_token,
                token_expires_at=token_expires_at
            )
            self.db.add(oauth_account)
            self.db.commit()
            return existing_user

        # Create new user with OAuth account
        # Parse name into first and last name
        name_parts = name.split(' ', 1) if name else ['', '']
        first_name = name_parts[0] if name_parts else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        # Generate unique username from email
        username = self.generate_unique_username(email)
        
        new_user = User(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            full_name=name or f"{first_name} {last_name}".strip(),
            hashed_password="",  # OAuth users don't have passwords initially
            is_verified=True,  # OAuth emails are pre-verified
            is_active=True
        )
        self.db.add(new_user)
        self.db.flush()  # Get the user ID

        # Create OAuth account record
        oauth_account = OAuthAccount(
            user_id=new_user.id,
            provider=provider,
            provider_id=provider_id,
            email=email,
            display_name=name,
            profile_picture=profile_picture,
            access_token=access_token,
            refresh_token=refresh_token,
            token_expires_at=token_expires_at
        )
        self.db.add(oauth_account)

        # Assign default role
        from app.models.role import Role, UserRole, RoleType
        default_role = self.db.query(Role).filter(
            Role.name == RoleType.VIEWER
        ).first()
        if default_role:
            user_role = UserRole(
                user_id=new_user.id,
                role_id=default_role.id,
                assigned_by=None  # System assignment
            )
            self.db.add(user_role)

        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def link_oauth_account_to_user(
        self,
        user: User,
        provider: str,
        provider_id: str,
        email: Optional[str] = None,
        name: Optional[str] = None,
        profile_picture: Optional[str] = None,
        access_token: Optional[str] = None,
        refresh_token: Optional[str] = None,
        token_expires_at: Optional[datetime] = None,
    ) -> None:
        """Link an OAuth account to an existing user, updating if present."""
        existing = self.db.query(OAuthAccount).filter(
            OAuthAccount.user_id == user.id,
            OAuthAccount.provider == provider,
        ).first()

        if existing:
            existing.provider_id = provider_id
            existing.email = email
            existing.display_name = name
            existing.profile_picture = profile_picture
            existing.access_token = access_token
            existing.refresh_token = refresh_token
            existing.token_expires_at = token_expires_at
            existing.updated_at = datetime.now(timezone.utc)
        else:
            account = OAuthAccount(
                user_id=user.id,
                provider=provider,
                provider_id=provider_id,
                email=email,
                display_name=name,
                profile_picture=profile_picture,
                access_token=access_token,
                refresh_token=refresh_token,
                token_expires_at=token_expires_at,
            )
            self.db.add(account)

        self.db.commit()

    def generate_unique_username(self, email: str) -> str:
        """Generate a unique username from email."""
        base_username = email.split('@')[0]
        
        # Clean the username - remove special characters
        import re
        base_username = re.sub(r'[^a-zA-Z0-9_]', '', base_username)
        
        # Ensure it's not empty
        if not base_username:
            base_username = "user"
        
        # Check if username exists
        existing_user = self.db.query(User).filter(
            User.username == base_username
        ).first()
        if not existing_user:
            return base_username
        
        # If exists, append numbers until unique
        counter = 1
        while True:
            candidate = f"{base_username}{counter}"
            existing_user = self.db.query(User).filter(
                User.username == candidate
            ).first()
            if not existing_user:
                return candidate
            counter += 1

    def get_oauth_accounts(self, user: User) -> list[OAuthAccount]:
        """Get all OAuth accounts for a user."""
        return self.db.query(OAuthAccount).filter(
            OAuthAccount.user_id == user.id
        ).all()

    def unlink_oauth_account(self, user: User, provider: str) -> bool:
        """
        Unlink OAuth account from user.
        
        Args:
            user: User object
            provider: OAuth provider to unlink
            
        Returns:
            True if account was unlinked, False if not found
        """
        oauth_account = self.db.query(OAuthAccount).filter(
            OAuthAccount.user_id == user.id,
            OAuthAccount.provider == provider
        ).first()

        if oauth_account:
            self.db.delete(oauth_account)
            self.db.commit()
            return True
        
        return False

    def can_unlink_oauth(self, user: User, provider: str) -> bool:
        """
        Check if OAuth account can be safely unlinked.
        User must have either a password or other OAuth accounts.
        """
        # Check if user has a password set
        if user.hashed_password:
            return True
        
        # Check if user has other OAuth accounts
        other_accounts = self.db.query(OAuthAccount).filter(
            OAuthAccount.user_id == user.id,
            OAuthAccount.provider != provider
        ).count()
        
        return other_accounts > 0

    def refresh_oauth_token(
        self, oauth_account: OAuthAccount
    ) -> Optional[Dict[str, Any]]:
        """
        Refresh OAuth access token using refresh token.
        This is a placeholder - actual implementation would call provider APIs.
        """
        # This would be implemented based on the specific OAuth provider
        # For now, return None to indicate no refresh was performed
        return None

    def get_provider_user_info(
        self, provider: str, access_token: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get user information from OAuth provider using access token.
        This is a placeholder for actual provider API calls.
        """
        # This would make actual API calls to the OAuth provider
        # to get current user information
        return None