import time
from datetime import timedelta
import pytest
from app.core.security import (
    get_password_hash,
    verify_password,
    generate_secure_token,
    create_access_token,
    create_refresh_token,
    verify_token,
    check_password_strength,
)


def test_password_hash_and_verify():
    password = "StrongPassw0rd!"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrong", hashed)


def test_generate_secure_token_uniqueness():
    token1 = generate_secure_token(16)
    token2 = generate_secure_token(16)
    assert len(token1) == 16
    assert token1 != token2


def test_jwt_token_creation_and_verification():
    token = create_access_token("user123", expires_delta=timedelta(minutes=5))
    assert verify_token(token) == "user123"
    refresh = create_refresh_token("user123")
    assert verify_token(refresh, token_type="refresh") == "user123"


def test_jwt_token_expiration():
    expired = create_access_token("user123", expires_delta=timedelta(seconds=-1))
    time.sleep(1)
    assert verify_token(expired) is None


def test_check_password_strength():
    weak = check_password_strength("abc")
    assert not weak["is_strong"]
    strong = check_password_strength("VeryStr0ng!Pass")
    assert strong["is_strong"]
