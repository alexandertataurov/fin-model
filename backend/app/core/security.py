from datetime import datetime, timedelta
from typing import Optional, Any, Union
from jose import jwt, JWTError
from passlib.context import CryptContext
import secrets
import string
from app.core.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate password hash."""
    return pwd_context.hash(password)


def generate_secure_token(length: int = 32) -> str:
    """Generate a secure random token."""
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def create_access_token(
    subject: Union[str, Any],
    expires_delta: Optional[timedelta] = None,
    token_type: str = "access",
) -> str:
    """Create a JWT access token."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": token_type,
        "iat": datetime.utcnow(),
    }

    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(subject: Union[str, Any]) -> str:
    """Create a JWT refresh token."""
    expire = datetime.utcnow() + timedelta(
        days=30
    )  # Refresh tokens last 30 days

    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "refresh",
        "iat": datetime.utcnow(),
    }

    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def verify_token(token: str, token_type: str = "access") -> Optional[str]:
    """Verify and decode a JWT token."""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )

        # Check token type
        if payload.get("type") != token_type:
            return None

        # Check expiration
        if payload.get("exp") and datetime.utcnow() > datetime.fromtimestamp(
            payload["exp"]
        ):
            return None

        user_id: str = payload.get("sub")
        if user_id is None:
            return None

        return user_id
    except JWTError:
        return None


def create_email_verification_token(email: str) -> str:
    """Create a token for email verification."""
    expire = datetime.utcnow() + timedelta(
        hours=24
    )  # Email verification tokens last 24 hours

    to_encode = {
        "exp": expire,
        "sub": email,
        "type": "email_verification",
        "iat": datetime.utcnow(),
    }

    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_password_reset_token(email: str) -> str:
    """Create a token for password reset."""
    expire = datetime.utcnow() + timedelta(
        hours=1
    )  # Password reset tokens last 1 hour

    to_encode = {
        "exp": expire,
        "sub": email,
        "type": "password_reset",
        "iat": datetime.utcnow(),
    }

    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def verify_email_verification_token(token: str) -> Optional[str]:
    """Verify an email verification token and return the email."""
    return verify_token(token, "email_verification")


def verify_password_reset_token(token: str) -> Optional[str]:
    """Verify a password reset token and return the email."""
    return verify_token(token, "password_reset")


def check_password_strength(password: str) -> dict:
    """Check password strength and return feedback."""
    feedback = {"score": 0, "is_strong": False, "feedback": []}

    # Length check
    if len(password) >= 8:
        feedback["score"] += 1
    else:
        feedback["feedback"].append(
            "Password should be at least 8 characters long"
        )

    if len(password) >= 12:
        feedback["score"] += 1

    # Character variety checks
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)

    if has_upper:
        feedback["score"] += 1
    else:
        feedback["feedback"].append("Include uppercase letters")

    if has_lower:
        feedback["score"] += 1
    else:
        feedback["feedback"].append("Include lowercase letters")

    if has_digit:
        feedback["score"] += 1
    else:
        feedback["feedback"].append("Include numbers")

    if has_special:
        feedback["score"] += 1
    else:
        feedback["feedback"].append("Include special characters")

    # No common patterns
    common_patterns = ["123", "abc", "password", "qwerty"]
    if not any(pattern in password.lower() for pattern in common_patterns):
        feedback["score"] += 1
    else:
        feedback["feedback"].append("Avoid common patterns")

    feedback["is_strong"] = feedback["score"] >= 5

    return feedback
