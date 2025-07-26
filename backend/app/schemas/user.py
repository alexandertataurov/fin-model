from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from app.models.role import RoleType


class UserBase(BaseModel):
    email: EmailStr
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters long")
        if len(v) > 50:
            raise ValueError("Username must be less than 50 characters")
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError(
                "Username can only contain letters, numbers, hyphens, and underscores"
            )
        return v

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_names(cls, v):
        if v is None:
            return v
        if len(v) < 1:
            raise ValueError("Name fields cannot be empty")
        if len(v) > 50:
            raise ValueError("Name fields must be less than 50 characters")
        return v.strip()


class UserCreate(UserBase):
    full_name: Optional[str] = None
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if len(v) > 128:
            raise ValueError("Password must be less than 128 characters")

        # Require at least one digit and one lowercase letter to enforce a
        # reasonably strong password for tests.
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")

class UserRegister(UserCreate):
    pass


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: Optional[bool] = False


class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    is_verified: bool
    last_login: Optional[datetime]
    failed_login_attempts: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserWithRoles(User):
    roles: List[str]


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_names(cls, v):
        if v is not None:
            if len(v) < 1:
                raise ValueError("Name fields cannot be empty")
            if len(v) > 50:
                raise ValueError("Name fields must be less than 50 characters")
            return v.strip()
        return v


class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: Optional[int] = None
    refresh_token: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if len(v) > 128:
            raise ValueError("Password must be less than 128 characters")


        # Check for at least one lowercase letter
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")

        # Check for at least one digit
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")

        # Special characters are optional for password change

        return v


class PasswordReset(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if len(v) > 128:
            raise ValueError("Password must be less than 128 characters")


        # Check for at least one lowercase letter
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")

        # Check for at least one digit
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")

        # Special characters are optional for reset passwords

        return v


class EmailVerification(BaseModel):
    token: str
