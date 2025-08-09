from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime


class MFASetupResponse(BaseModel):
    """Response for MFA setup initialization."""

    secret: str = Field(..., description="TOTP secret key for manual entry")
    qr_code: str = Field(..., description="Base64-encoded QR code image")
    backup_codes: List[str] = Field(..., description="Recovery backup codes")


class MFAVerifySetupRequest(BaseModel):
    """Request to verify MFA setup."""

    token: str = Field(
        ..., min_length=6, max_length=6, description="6-digit TOTP code"
    )


class MFAVerifyRequest(BaseModel):
    """Request to verify MFA during authentication."""

    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="User password")
    mfa_token: str = Field(..., description="6-digit TOTP code or backup code")
    use_backup: bool = Field(False, description="Whether using a backup code")


class MFADisableRequest(BaseModel):
    """Request to disable MFA."""

    password: str = Field(..., description="Current password for verification")


class MFABackupCodesResponse(BaseModel):
    """Response containing backup codes."""

    backup_codes: List[str] = Field(
        ..., description="List of backup recovery codes"
    )
    remaining_count: int = Field(..., description="Number of remaining codes")


class MFAStatusResponse(BaseModel):
    """Response showing MFA status."""

    enabled: bool = Field(..., description="Whether MFA is enabled")
    backup_codes_count: int = Field(
        0, description="Number of remaining backup codes"
    )
    last_used: Optional[datetime] = Field(
        None, description="Last time MFA was used"
    )


class OAuthLoginRequest(BaseModel):
    """Request for OAuth login callback."""

    provider: str = Field(..., description="OAuth provider (google, microsoft)")
    authorization_code: str = Field(
        ..., description="Authorization code from provider"
    )
    state: str = Field(..., description="State parameter for CSRF protection")


class OAuthAccountLinkRequest(BaseModel):
    """Request to link OAuth account."""

    provider: str = Field(..., description="OAuth provider")
    authorization_code: str = Field(..., description="Authorization code")


class OAuthAccountResponse(BaseModel):
    """Response for OAuth account information."""

    id: str
    provider: str
    email: Optional[str]
    display_name: Optional[str]
    profile_picture: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WebAuthnCredentialResponse(BaseModel):
    """Response for WebAuthn credential information."""

    id: str
    credential_id: str
    device_name: Optional[str]
    device_type: Optional[str]
    created_at: datetime
    last_used: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class WebAuthnRegistrationOptionsResponse(BaseModel):
    """Response for WebAuthn registration options."""

    challenge: str
    rp: dict
    user: dict
    pubKeyCredParams: List[dict]
    authenticatorSelection: dict
    timeout: int
    attestation: str


class WebAuthnRegistrationRequest(BaseModel):
    """Request to complete WebAuthn registration."""

    credential: dict = Field(..., description="WebAuthn credential object")
    device_name: Optional[str] = Field(
        None, description="User-friendly device name"
    )


class WebAuthnAuthenticationOptionsResponse(BaseModel):
    """Response for WebAuthn authentication options."""

    challenge: str
    allowCredentials: List[dict]
    timeout: int
    userVerification: str


class WebAuthnAuthenticationRequest(BaseModel):
    """Request to complete WebAuthn authentication."""

    username: str = Field(..., description="Username or email")
    credential: dict = Field(..., description="WebAuthn assertion")


class AuthenticationFlowResponse(BaseModel):
    """Response for multi-step authentication flows."""

    status: str = Field(
        ..., description="Status: success, mfa_required, webauthn_required"
    )
    access_token: Optional[str] = Field(
        None, description="JWT access token if authentication complete"
    )
    token_type: Optional[str] = Field(None, description="Token type (bearer)")
    challenge_id: Optional[str] = Field(
        None, description="Challenge ID for next step"
    )
    available_methods: Optional[List[str]] = Field(
        None, description="Available 2FA methods"
    )
    message: Optional[str] = Field(None, description="Status message")
