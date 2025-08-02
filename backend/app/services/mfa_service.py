import secrets
import pyotp
import qrcode
import json
import base64
from io import BytesIO
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.models.mfa import MFAToken, MFAChallenge
from app.core.config import settings


class MFAService:
    """Service for Multi-Factor Authentication operations."""
    
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def generate_totp_secret() -> str:
        """Generate a new TOTP secret key."""
        return pyotp.random_base32()

    @staticmethod
    def generate_qr_code(user_email: str, secret: str) -> str:
        """
        Generate QR code for TOTP setup.
        Returns base64-encoded PNG image.
        """
        totp = pyotp.TOTP(secret)
        provisioning_uri = totp.provisioning_uri(
            user_email,
            issuer_name=settings.WEBAUTHN_RP_NAME
        )
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(provisioning_uri)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return img_str

    @staticmethod
    def verify_totp_token(secret: str, token: str, valid_window: int = 1) -> bool:
        """
        Verify TOTP token.
        
        Args:
            secret: TOTP secret key
            token: 6-digit TOTP token
            valid_window: Number of 30-second windows to check (default: 1)
        """
        totp = pyotp.TOTP(secret)
        return totp.verify(token, valid_window=valid_window)

    @staticmethod
    def generate_backup_codes(count: int = 10) -> List[str]:
        """Generate backup recovery codes."""
        codes = []
        for _ in range(count):
            # Generate 8-character alphanumeric code
            code = ''.join(secrets.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') for _ in range(8))
            # Format as XXXX-XXXX
            formatted_code = f"{code[:4]}-{code[4:]}"
            codes.append(formatted_code)
        return codes

    def setup_mfa(self, user: User) -> Dict[str, Any]:
        """
        Initialize MFA setup for a user.
        Returns secret and QR code for setup.
        """
        # Check if user already has MFA enabled
        existing_mfa = self.db.query(MFAToken).filter(
            MFAToken.user_id == user.id,
            MFAToken.is_verified == True
        ).first()
        
        if existing_mfa:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="MFA is already enabled for this account"
            )

        # Generate new secret
        secret = self.generate_totp_secret()
        backup_codes = self.generate_backup_codes()
        
        # Create or update MFA token record
        mfa_token = self.db.query(MFAToken).filter(
            MFAToken.user_id == user.id
        ).first()
        
        if mfa_token:
            # Update existing unverified token
            mfa_token.secret_key = secret
            mfa_token.backup_codes = backup_codes
            mfa_token.is_verified = False
            mfa_token.created_at = datetime.now(timezone.utc)
        else:
            # Create new token
            mfa_token = MFAToken(
                user_id=user.id,
                secret_key=secret,
                backup_codes=backup_codes,
                is_verified=False
            )
            self.db.add(mfa_token)
        
        self.db.commit()
        self.db.refresh(mfa_token)
        
        # Generate QR code
        qr_code = self.generate_qr_code(user.email, secret)
        
        return {
            "secret": secret,
            "qr_code": qr_code,
            "backup_codes": backup_codes
        }

    def verify_mfa_setup(self, user: User, token: str) -> bool:
        """
        Verify TOTP token during MFA setup and enable MFA.
        """
        mfa_token = self.db.query(MFAToken).filter(
            MFAToken.user_id == user.id,
            MFAToken.is_verified == False
        ).first()
        
        if not mfa_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No MFA setup in progress"
            )
        
        # Verify token
        if not self.verify_totp_token(mfa_token.secret_key, token):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification code"
            )
        
        # Enable MFA
        mfa_token.is_verified = True
        mfa_token.last_used = datetime.now(timezone.utc)
        self.db.commit()
        
        return True

    def verify_mfa_token(self, user: User, token: str, use_backup: bool = False) -> bool:
        """
        Verify MFA token during authentication.
        
        Args:
            user: User object
            token: TOTP token or backup code
            use_backup: Whether the token is a backup code
        """
        mfa_token = self.db.query(MFAToken).filter(
            MFAToken.user_id == user.id,
            MFAToken.is_verified == True
        ).first()
        
        if not mfa_token:
            return False
        
        if use_backup:
            # Verify backup code
            if not mfa_token.backup_codes or token not in mfa_token.backup_codes:
                return False
            
            # Remove used backup code
            backup_codes = mfa_token.backup_codes.copy()
            backup_codes.remove(token)
            mfa_token.backup_codes = backup_codes
            
        else:
            # Verify TOTP token
            if not self.verify_totp_token(mfa_token.secret_key, token):
                return False
        
        # Update last used timestamp
        mfa_token.last_used = datetime.now(timezone.utc)
        self.db.commit()
        
        return True

    def disable_mfa(self, user: User, password: str) -> bool:
        """
        Disable MFA for a user after password verification.
        """
        from app.core.security import verify_password
        
        # Verify password
        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid password"
            )
        
        # Remove MFA token
        mfa_token = self.db.query(MFAToken).filter(
            MFAToken.user_id == user.id
        ).first()
        
        if mfa_token:
            self.db.delete(mfa_token)
            self.db.commit()
            return True
        
        return False

    def get_backup_codes(self, user: User) -> List[str]:
        """Get remaining backup codes for a user."""
        mfa_token = self.db.query(MFAToken).filter(
            MFAToken.user_id == user.id,
            MFAToken.is_verified == True
        ).first()
        
        if not mfa_token:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MFA not enabled"
            )
        
        return mfa_token.backup_codes or []

    def regenerate_backup_codes(self, user: User) -> List[str]:
        """Generate new backup codes for a user."""
        mfa_token = self.db.query(MFAToken).filter(
            MFAToken.user_id == user.id,
            MFAToken.is_verified == True
        ).first()
        
        if not mfa_token:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="MFA not enabled"
            )
        
        # Generate new codes
        new_codes = self.generate_backup_codes()
        mfa_token.backup_codes = new_codes
        self.db.commit()
        
        return new_codes

    def is_mfa_enabled(self, user: User) -> bool:
        """Check if MFA is enabled for a user."""
        mfa_token = self.db.query(MFAToken).filter(
            MFAToken.user_id == user.id,
            MFAToken.is_verified == True
        ).first()
        
        return mfa_token is not None

    def create_mfa_challenge(self, user: User, challenge_type: str, challenge_data: Dict = None) -> str:
        """
        Create a temporary MFA challenge for authentication flows.
        Returns challenge ID.
        """
        # Clean up expired challenges
        self.cleanup_expired_challenges()
        
        challenge = MFAChallenge(
            user_id=user.id,
            challenge_type=challenge_type,
            challenge_data=challenge_data,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=5)
        )
        
        self.db.add(challenge)
        self.db.commit()
        self.db.refresh(challenge)
        
        return challenge.id

    def get_mfa_challenge(self, challenge_id: str) -> Optional[MFAChallenge]:
        """Get MFA challenge by ID."""
        challenge = self.db.query(MFAChallenge).filter(
            MFAChallenge.id == challenge_id,
            MFAChallenge.expires_at > datetime.now(timezone.utc)
        ).first()
        
        return challenge

    def cleanup_expired_challenges(self):
        """Remove expired MFA challenges."""
        self.db.query(MFAChallenge).filter(
            MFAChallenge.expires_at <= datetime.now(timezone.utc)
        ).delete()
        self.db.commit()