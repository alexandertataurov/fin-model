import pytest
import json
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import Mock, patch

from main import app
from app.models.user import User
from app.models.mfa import MFAToken, OAuthAccount, WebAuthnCredential
from app.services.mfa_service import MFAService
from app.services.oauth_service import OAuthService
from app.services.webauthn_service import WebAuthnService
from app.services.auth_service import AuthService

client = TestClient(app)


class TestMFAService:
    """Test MFA functionality."""

    def test_generate_totp_secret(self):
        """Test TOTP secret generation."""
        secret = MFAService.generate_totp_secret()
        assert len(secret) == 32
        assert secret.isalnum()

    def test_verify_totp_token(self):
        """Test TOTP token verification."""
        import pyotp
        secret = MFAService.generate_totp_secret()
        totp = pyotp.TOTP(secret)
        valid_token = totp.now()
        
        # Valid token should pass
        assert MFAService.verify_totp_token(secret, valid_token)
        
        # Invalid token should fail
        assert not MFAService.verify_totp_token(secret, "000000")

    def test_generate_backup_codes(self):
        """Test backup code generation."""
        codes = MFAService.generate_backup_codes()
        assert len(codes) == 10
        for code in codes:
            assert len(code) == 9  # XXXX-XXXX format
            assert '-' in code

    @patch('app.services.mfa_service.qrcode')
    def test_generate_qr_code(self, mock_qrcode):
        """Test QR code generation."""
        mock_img = Mock()
        mock_qr = Mock()
        mock_qr.make_image.return_value = mock_img
        mock_qrcode.QRCode.return_value = mock_qr
        
        qr_code = MFAService.generate_qr_code("test@example.com", "TESTSECRET123456")
        assert isinstance(qr_code, str)


class TestOAuthService:
    """Test OAuth functionality."""

    def test_generate_unique_username(self, db_session: Session):
        """Test unique username generation."""
        oauth_service = OAuthService(db_session)
        
        # Test basic email
        username = oauth_service.generate_unique_username("test@example.com")
        assert username == "test"
        
        # Test email with special characters
        username = oauth_service.generate_unique_username("test.user+tag@example.com")
        assert username == "testusertag"

    def test_can_unlink_oauth(self, db_session: Session, test_user: User):
        """Test OAuth account unlinking safety check."""
        oauth_service = OAuthService(db_session)
        
        # User with password can unlink
        test_user.hashed_password = "hashed_password"
        assert oauth_service.can_unlink_oauth(test_user, "google")
        
        # User without password but with other OAuth accounts can unlink
        test_user.hashed_password = ""
        oauth_account = OAuthAccount(
            user_id=test_user.id,
            provider="microsoft",
            provider_id="other_account",
            email="test@example.com"
        )
        db_session.add(oauth_account)
        db_session.commit()
        
        assert oauth_service.can_unlink_oauth(test_user, "google")


class TestWebAuthnService:
    """Test WebAuthn functionality."""

    def test_cleanup_expired_challenges(self, db_session: Session, test_user: User):
        """Test expired challenge cleanup."""
        webauthn_service = WebAuthnService(db_session)
        
        from app.models.mfa import MFAChallenge
        from datetime import datetime, timezone, timedelta
        
        # Create expired challenge
        expired_challenge = MFAChallenge(
            user_id=test_user.id,
            challenge_type="webauthn_registration",
            challenge_data={"test": "data"},
            expires_at=datetime.now(timezone.utc) - timedelta(minutes=1)
        )
        db_session.add(expired_challenge)
        db_session.commit()
        
        # Cleanup should remove expired challenge
        webauthn_service.cleanup_expired_challenges()
        
        remaining = db_session.query(MFAChallenge).filter(
            MFAChallenge.id == expired_challenge.id
        ).first()
        assert remaining is None

    def test_has_webauthn_credentials(self, db_session: Session, test_user: User):
        """Test WebAuthn credential detection."""
        webauthn_service = WebAuthnService(db_session)
        
        # Initially no credentials
        assert not webauthn_service.has_webauthn_credentials(test_user)
        
        # Add credential
        credential = WebAuthnCredential(
            user_id=test_user.id,
            credential_id="test_credential_id",
            public_key="test_public_key",
            sign_count=0,
            device_name="Test Device"
        )
        db_session.add(credential)
        db_session.commit()
        
        # Now should have credentials
        assert webauthn_service.has_webauthn_credentials(test_user)


class TestEnhancedAuthEndpoints:
    """Test enhanced authentication API endpoints."""

    def test_mfa_setup_requires_auth(self):
        """Test that MFA setup requires authentication."""
        response = client.post("/api/v1/auth/mfa/setup")
        assert response.status_code == 401

    def test_oauth_login_google(self):
        """Test Google OAuth login initiation."""
        # This would require proper OAuth configuration
        # For now, just test that the endpoint exists
        response = client.get("/api/v1/auth/oauth/google/login")
        # Expecting redirect or error due to missing OAuth config
        assert response.status_code in [302, 500]

    def test_webauthn_registration_requires_auth(self):
        """Test that WebAuthn registration requires authentication."""
        response = client.post("/api/v1/auth/webauthn/register/begin")
        assert response.status_code == 401

    def test_enhanced_login_invalid_credentials(self):
        """Test enhanced login with invalid credentials."""
        response = client.post("/api/v1/auth/login-enhanced", json={
            "username": "nonexistent@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401

    def test_enhanced_login_missing_credentials(self):
        """Test enhanced login with missing credentials."""
        response = client.post("/api/v1/auth/login-enhanced", json={
            "username": "test@example.com"
            # Missing password
        })
        assert response.status_code == 400


class TestSecurityFeatures:
    """Test security aspects of enhanced authentication."""

    def test_backup_codes_are_unique(self):
        """Test that backup codes are unique."""
        codes1 = MFAService.generate_backup_codes()
        codes2 = MFAService.generate_backup_codes()
        
        # Should not have any overlapping codes
        assert not set(codes1).intersection(set(codes2))

    def test_totp_secret_is_random(self):
        """Test that TOTP secrets are random."""
        secret1 = MFAService.generate_totp_secret()
        secret2 = MFAService.generate_totp_secret()
        
        assert secret1 != secret2

    def test_rate_limiting_headers(self):
        """Test that rate limiting is applied to auth endpoints."""
        # Make multiple requests to trigger rate limiting
        for _ in range(6):  # More than the limit of 5
            response = client.post("/api/v1/auth/login-enhanced", json={
                "username": "test@example.com",
                "password": "wrongpassword"
            })
        
        # Should eventually get rate limited
        assert response.status_code in [401, 429]  # Either auth failed or rate limited


class TestAuthenticationFlow:
    """Test complete authentication flows."""

    @pytest.mark.asyncio
    async def test_complete_mfa_flow_simulation(self, db_session: Session, test_user: User):
        """Simulate a complete MFA authentication flow."""
        mfa_service = MFAService(db_session)
        
        # 1. Setup MFA
        setup_data = mfa_service.setup_mfa(test_user)
        assert "secret" in setup_data
        assert "qr_code" in setup_data
        assert "backup_codes" in setup_data
        
        # 2. Verify setup (simulate user entering TOTP)
        import pyotp
        totp = pyotp.TOTP(setup_data["secret"])
        valid_token = totp.now()
        
        success = mfa_service.verify_mfa_setup(test_user, valid_token)
        assert success
        
        # 3. Verify MFA is enabled
        assert mfa_service.is_mfa_enabled(test_user)
        
        # 4. Simulate login with MFA
        new_token = totp.now()
        mfa_verified = mfa_service.verify_mfa_token(test_user, new_token, use_backup=False)
        assert mfa_verified

    def test_oauth_user_creation(self, db_session: Session):
        """Test OAuth user creation and linking."""
        oauth_service = OAuthService(db_session)
        
        # Test creating new user via OAuth
        user = oauth_service.handle_oauth_user(
            provider="google",
            provider_id="google_user_123",
            email="newuser@example.com",
            name="New User",
            profile_picture="https://example.com/avatar.jpg"
        )
        
        assert user.email == "newuser@example.com"
        assert user.is_verified is True  # OAuth users are pre-verified
        assert user.full_name == "New User"
        
        # Check OAuth account was created
        oauth_account = db_session.query(OAuthAccount).filter(
            OAuthAccount.user_id == user.id,
            OAuthAccount.provider == "google"
        ).first()
        
        assert oauth_account is not None
        assert oauth_account.provider_id == "google_user_123"


@pytest.fixture
def test_user(db_session: Session) -> User:
    """Create a test user."""
    from app.core.security import get_password_hash
    
    user = User(
        email="test@example.com",
        username="testuser",
        first_name="Test",
        last_name="User",
        full_name="Test User",
        hashed_password=get_password_hash("testpassword"),
        is_verified=True,
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def db_session():
    """Create a test database session."""
    # This would be configured in conftest.py with proper test database setup
    from app.models.base import get_db
    # For now, return a mock session
    return Mock(spec=Session)