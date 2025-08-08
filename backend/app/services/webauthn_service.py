import base64
import json
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from webauthn import (
    generate_registration_options,
    verify_registration_response,
    generate_authentication_options,
    verify_authentication_response,
    options_to_json,
)
from webauthn.helpers import (
    base64url_to_bytes,
    bytes_to_base64url,
    decode_credential_public_key,
)
from webauthn.helpers.structs import (
    AuthenticatorSelectionCriteria,
    UserVerificationRequirement,
    AuthenticatorAttachment,
    PublicKeyCredentialDescriptor,
    PublicKeyCredentialType,
)

from app.models.user import User
from app.models.mfa import WebAuthnCredential, MFAChallenge
from app.core.config import settings


class WebAuthnService:
    """Service for WebAuthn/FIDO2 operations."""

    def __init__(self, db: Session):
        self.db = db

    def generate_registration_options(self, user: User) -> Dict[str, Any]:
        """
        Generate WebAuthn registration options for a user.
        """
        # Get existing credentials to exclude them
        existing_credentials = (
            self.db.query(WebAuthnCredential)
            .filter(WebAuthnCredential.user_id == user.id)
            .all()
        )

        exclude_credentials = [
            PublicKeyCredentialDescriptor(
                id=base64url_to_bytes(cred.credential_id),
                type=PublicKeyCredentialType.PUBLIC_KEY,
            )
            for cred in existing_credentials
        ]

        options = generate_registration_options(
            rp_id=settings.WEBAUTHN_RP_ID,
            rp_name=settings.WEBAUTHN_RP_NAME,
            user_id=str(user.id).encode("utf-8"),
            user_name=user.email,
            user_display_name=user.full_name
            or f"{user.first_name} {user.last_name}".strip(),
            exclude_credentials=exclude_credentials,
            authenticator_selection=AuthenticatorSelectionCriteria(
                authenticator_attachment=AuthenticatorAttachment.PLATFORM,
                user_verification=UserVerificationRequirement.REQUIRED,
            ),
            timeout=60000,  # 60 seconds
        )

        # Store challenge for verification
        challenge_id = self.create_webauthn_challenge(
            user=user, challenge=options.challenge, challenge_type="registration"
        )

        # Convert to JSON-serializable format
        options_json = options_to_json(options)
        options_dict = json.loads(options_json)
        options_dict["challenge_id"] = challenge_id

        return options_dict

    def verify_registration_response(
        self,
        user: User,
        credential: Dict[str, Any],
        challenge_id: str,
        device_name: str = None,
    ) -> WebAuthnCredential:
        """
        Verify WebAuthn registration response and store credential.
        """
        # Get and verify challenge
        challenge_record = self.get_webauthn_challenge(challenge_id, "registration")
        if not challenge_record or challenge_record.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired challenge",
            )

        try:
            verification = verify_registration_response(
                credential=credential,
                expected_challenge=challenge_record.challenge_data["challenge"],
                expected_origin=settings.WEBAUTHN_ORIGIN,
                expected_rp_id=settings.WEBAUTHN_RP_ID,
            )

            if not verification.verified:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Registration verification failed",
                )

            # Store credential
            webauthn_credential = WebAuthnCredential(
                user_id=user.id,
                credential_id=bytes_to_base64url(verification.credential_id),
                public_key=bytes_to_base64url(verification.credential_public_key),
                sign_count=verification.sign_count,
                device_name=device_name or "Unknown Device",
                device_type="platform",  # Since we're using platform authenticator
            )

            self.db.add(webauthn_credential)

            # Remove the challenge
            self.db.delete(challenge_record)

            self.db.commit()
            self.db.refresh(webauthn_credential)

            return webauthn_credential

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Registration failed: {str(e)}",
            )

    def generate_authentication_options(self, user: User) -> Dict[str, Any]:
        """
        Generate WebAuthn authentication options for a user.
        """
        # Get user's credentials
        credentials = (
            self.db.query(WebAuthnCredential)
            .filter(WebAuthnCredential.user_id == user.id)
            .all()
        )

        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No WebAuthn credentials found for user",
            )

        allow_credentials = [
            PublicKeyCredentialDescriptor(
                id=base64url_to_bytes(cred.credential_id),
                type=PublicKeyCredentialType.PUBLIC_KEY,
            )
            for cred in credentials
        ]

        options = generate_authentication_options(
            rp_id=settings.WEBAUTHN_RP_ID,
            allow_credentials=allow_credentials,
            user_verification=UserVerificationRequirement.REQUIRED,
            timeout=60000,  # 60 seconds
        )

        # Store challenge for verification
        challenge_id = self.create_webauthn_challenge(
            user=user, challenge=options.challenge, challenge_type="authentication"
        )

        # Convert to JSON-serializable format
        options_json = options_to_json(options)
        options_dict = json.loads(options_json)
        options_dict["challenge_id"] = challenge_id

        return options_dict

    def verify_authentication_response(
        self, user: User, credential: Dict[str, Any], challenge_id: str
    ) -> bool:
        """
        Verify WebAuthn authentication response.
        """
        # Get and verify challenge
        challenge_record = self.get_webauthn_challenge(challenge_id, "authentication")
        if not challenge_record or challenge_record.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired challenge",
            )

        # Get the credential from database
        credential_id = credential.get("id")
        if not credential_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Missing credential ID"
            )

        stored_credential = (
            self.db.query(WebAuthnCredential)
            .filter(
                WebAuthnCredential.user_id == user.id,
                WebAuthnCredential.credential_id == credential_id,
            )
            .first()
        )

        if not stored_credential:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found"
            )

        try:
            verification = verify_authentication_response(
                credential=credential,
                expected_challenge=challenge_record.challenge_data["challenge"],
                expected_origin=settings.WEBAUTHN_ORIGIN,
                expected_rp_id=settings.WEBAUTHN_RP_ID,
                credential_public_key=base64url_to_bytes(stored_credential.public_key),
                credential_current_sign_count=stored_credential.sign_count,
                require_user_verification=True,
            )

            if verification.verified:
                # Update sign count and last used
                stored_credential.sign_count = verification.new_sign_count
                stored_credential.last_used = datetime.now(timezone.utc)

                # Remove the challenge
                self.db.delete(challenge_record)

                self.db.commit()
                return True
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication verification failed",
                )

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Authentication failed: {str(e)}",
            )

    def get_user_credentials(self, user: User) -> List[WebAuthnCredential]:
        """Get all WebAuthn credentials for a user."""
        return (
            self.db.query(WebAuthnCredential)
            .filter(WebAuthnCredential.user_id == user.id)
            .all()
        )

    def delete_credential(self, user: User, credential_id: str) -> bool:
        """Delete a WebAuthn credential."""
        credential = (
            self.db.query(WebAuthnCredential)
            .filter(
                WebAuthnCredential.user_id == user.id,
                WebAuthnCredential.id == credential_id,
            )
            .first()
        )

        if credential:
            self.db.delete(credential)
            self.db.commit()
            return True

        return False

    def update_credential_name(
        self, user: User, credential_id: str, new_name: str
    ) -> bool:
        """Update the device name of a WebAuthn credential."""
        credential = (
            self.db.query(WebAuthnCredential)
            .filter(
                WebAuthnCredential.user_id == user.id,
                WebAuthnCredential.id == credential_id,
            )
            .first()
        )

        if credential:
            credential.device_name = new_name
            self.db.commit()
            return True

        return False

    def create_webauthn_challenge(
        self, user: User, challenge: bytes, challenge_type: str
    ) -> str:
        """Create a WebAuthn challenge record."""
        # Clean up expired challenges
        self.cleanup_expired_challenges()

        challenge_record = MFAChallenge(
            user_id=user.id,
            challenge_type=f"webauthn_{challenge_type}",
            challenge_data={
                "challenge": bytes_to_base64url(challenge),
                "type": challenge_type,
            },
            expires_at=datetime.utcnow() + timedelta(minutes=2),
        )

        self.db.add(challenge_record)
        self.db.commit()
        self.db.refresh(challenge_record)

        return challenge_record.id

    def get_webauthn_challenge(
        self, challenge_id: str, challenge_type: str
    ) -> Optional[MFAChallenge]:
        """Get WebAuthn challenge by ID and type."""
        return (
            self.db.query(MFAChallenge)
            .filter(
                MFAChallenge.id == challenge_id,
                MFAChallenge.challenge_type == f"webauthn_{challenge_type}",
                MFAChallenge.expires_at > datetime.utcnow(),
            )
            .first()
        )

    def cleanup_expired_challenges(self):
        """Remove expired WebAuthn challenges."""
        self.db.query(MFAChallenge).filter(
            MFAChallenge.expires_at <= datetime.utcnow()
        ).delete()
        self.db.commit()

    def has_webauthn_credentials(self, user: User) -> bool:
        """Check if user has any WebAuthn credentials."""
        count = (
            self.db.query(WebAuthnCredential)
            .filter(WebAuthnCredential.user_id == user.id)
            .count()
        )
        return count > 0
