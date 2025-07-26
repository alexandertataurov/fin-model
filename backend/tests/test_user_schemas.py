import pytest
from app.schemas.user import UserBase, UserCreate, UserUpdate, PasswordChange, PasswordResetConfirm


def test_username_validations():
    # valid username
    assert UserBase(username="good-user", email="a@b.com").username == "good-user"

    # too short
    with pytest.raises(ValueError):
        UserBase(username="ab", email="a@b.com")

    # invalid characters
    with pytest.raises(ValueError):
        UserBase(username="bad*name", email="a@b.com")

    # too long
    with pytest.raises(ValueError):
        UserBase(username="a" * 51, email="a@b.com")


def test_name_validations():
    ok = UserBase(username="user123", email="e@e.com", first_name=" John ", last_name=" Doe ")
    assert ok.first_name == "John"
    assert ok.last_name == "Doe"

    with pytest.raises(ValueError):
        UserBase(username="user123", email="e@e.com", first_name="", last_name="Doe")

    with pytest.raises(ValueError):
        UserUpdate(first_name="A" * 51)


def test_password_validations_create_change_reset():
    # valid passwords pass
    UserCreate(username="user1", email="a@b.com", password="strongpass123")
    PasswordChange(current_password="old", new_password="complex123zz")
    PasswordResetConfirm(token="abc", new_password="complex123zz")

    # invalid cases
    with pytest.raises(ValueError):
        UserCreate(username="user1", email="a@b.com", password="short")

    with pytest.raises(ValueError):
        PasswordChange(current_password="old", new_password="nonumbershere")

    with pytest.raises(ValueError):
        PasswordResetConfirm(token="abc", new_password="NOLOWERS123456")


def test_password_change_and_reset_nonumbers():
    with pytest.raises(ValueError):
        PasswordChange(current_password="old", new_password="weaknonumbers")
    with pytest.raises(ValueError):
        PasswordResetConfirm(token="t", new_password="weaknonumbers")
