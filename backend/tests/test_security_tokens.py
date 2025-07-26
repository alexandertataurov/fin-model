import pytest
from datetime import timedelta
from app.core import security


def test_password_hash_and_verify():
    password = "StrongPass123!"
    hashed = security.get_password_hash(password)
    assert hashed != password
    assert security.verify_password(password, hashed)
    assert not security.verify_password("wrong", hashed)


def test_token_creation_and_verification():
    token = security.create_access_token("user1", expires_delta=timedelta(minutes=5))
    assert security.verify_token(token) == "user1"


def test_email_and_password_reset_tokens():
    email = "test@example.com"
    email_token = security.create_email_verification_token(email)
    reset_token = security.create_password_reset_token(email)
    assert security.verify_email_verification_token(email_token) == email
    assert security.verify_password_reset_token(reset_token) == email


def test_password_strength_scores():
    weak = "123"
    strong = "StrongerPass123!"
    assert not security.check_password_strength(weak)["is_strong"]
    assert security.check_password_strength(strong)["is_strong"]
