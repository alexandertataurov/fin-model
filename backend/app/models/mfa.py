from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
    Integer,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
from .base import Base


class MFAToken(Base):
    """Multi-Factor Authentication tokens for users."""

    __tablename__ = "mfa_tokens"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    secret_key = Column(String(255), nullable=False)  # TOTP secret
    backup_codes = Column(JSON)  # Recovery codes array
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(
        DateTime, server_default=func.now(), nullable=False
    )
    last_used = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="mfa_token")

    def __repr__(self):
        return f"<MFAToken(id={self.id}, user_id={self.user_id}, verified={self.is_verified})>"


class OAuthAccount(Base):
    """OAuth provider accounts linked to users."""

    __tablename__ = "oauth_accounts"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    provider = Column(
        String(50), nullable=False
    )  # google, microsoft, etc.
    provider_id = Column(String(255), nullable=False)  # Provider's user ID
    email = Column(String(255), nullable=True)  # Email from provider
    display_name = Column(
        String(255), nullable=True
    )  # Display name from provider
    profile_picture = Column(
        String(500), nullable=True
    )  # Profile picture URL
    access_token = Column(
        String(500), nullable=True
    )  # For API calls if needed
    refresh_token = Column(String(500), nullable=True)  # For token refresh
    token_expires_at = Column(DateTime, nullable=True)
    created_at = Column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    user = relationship("User", back_populates="oauth_accounts")

    def __repr__(self):
        return f"<OAuthAccount(id={self.id}, provider={self.provider}, user_id={self.user_id})>"


class WebAuthnCredential(Base):
    """WebAuthn credentials for passwordless authentication."""

    __tablename__ = "webauthn_credentials"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    credential_id = Column(
        String(500), nullable=False, unique=True
    )  # Base64-encoded credential ID
    public_key = Column(
        String(1000), nullable=False
    )  # Base64-encoded public key
    sign_count = Column(Integer, default=0, nullable=False)
    device_name = Column(
        String(255), nullable=True
    )  # User-friendly device name
    device_type = Column(
        String(50), nullable=True
    )  # platform, cross-platform
    created_at = Column(
        DateTime, server_default=func.now(), nullable=False
    )
    last_used = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="webauthn_credentials")

    def __repr__(self):
        return f"<WebAuthnCredential(id={self.id}, user_id={self.user_id}, device={self.device_name})>"


class MFAChallenge(Base):
    """Temporary storage for MFA challenges during authentication."""

    __tablename__ = "mfa_challenges"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    challenge_type = Column(String(50), nullable=False)  # totp, webauthn
    challenge_data = Column(JSON, nullable=True)  # WebAuthn challenge data
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(
        DateTime, server_default=func.now(), nullable=False
    )

    # Relationships
    user = relationship("User")

    def __repr__(self):
        return f"<MFAChallenge(id={self.id}, type={self.challenge_type}, user_id={self.user_id})>"
