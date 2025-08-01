import pytest
from datetime import datetime, timedelta
from io import BytesIO
from fastapi import UploadFile
from fastapi import HTTPException

from app.schemas.user import UserCreate, PasswordChange
from app.models.user import User
from app.services.file_service import FileService
from app.core.config import settings


def test_username_and_password_validation():
    valid = UserCreate(
        email="valid@example.com",
        username="valid_user",
        first_name="Val",
        last_name="User",
        password="Strongpass123",
    )
    assert valid.username == "valid_user"

    with pytest.raises(Exception):
        UserCreate(
            email="bad@example.com",
            username="ab",
            first_name="Bad",
            last_name="User",
            password="Strongpass123",
        )

    with pytest.raises(Exception):
        UserCreate(
            email="bad2@example.com",
            username="bad*name",
            first_name="Bad",
            last_name="User",
            password="Strongpass123",
        )

    with pytest.raises(Exception):
        UserCreate(
            email="bad3@example.com",
            username="goodname",
            first_name="Bad",
            last_name="User",
            password="short",
        )

    with pytest.raises(Exception):
        UserCreate(
            email="bad4@example.com",
            username="goodname",
            first_name="Bad",
            last_name="User",
            password="nonumbershereabcdef",
        )


def test_password_change_validation():
    PasswordChange(current_password="old", new_password="Validpass123")
    with pytest.raises(Exception):
        PasswordChange(current_password="old", new_password="short")


def test_user_is_locked_property():
    future = datetime.utcnow() + timedelta(minutes=5)
    past = datetime.utcnow() - timedelta(minutes=5)

    assert User(account_locked_until=future).is_locked
    assert not User(account_locked_until=past).is_locked
    assert not User(account_locked_until=None).is_locked


def test_file_service_helpers(tmp_path):
    settings.UPLOAD_FOLDER = str(tmp_path)
    service = FileService(db=None)

    assert service.get_file_type("test.xlsx").value == "excel"
    assert service.get_file_type("test.csv").value == "csv"
    with pytest.raises(ValueError):
        service.get_file_type("test.txt")

    fname1 = service.generate_unique_filename("orig.xlsx")
    fname2 = service.generate_unique_filename("orig.xlsx")
    assert fname1 != fname2 and fname1.endswith(".xlsx")

    small = UploadFile(
        file=BytesIO(b"123"),
        filename="small.csv",
        size=3,
        headers={"content-type": "text/csv"},
    )
    service.validate_file(small)

    big = UploadFile(
        file=BytesIO(b"data"),
        filename="big.csv",
        size=service.max_file_size + 1,
        headers={"content-type": "text/csv"},
    )
    with pytest.raises(HTTPException):
        service.validate_file(big)

    bad = UploadFile(
        file=BytesIO(b"123"),
        filename="bad.exe",
        size=3,
        headers={"content-type": "application/octet-stream"},
    )
    with pytest.raises(HTTPException):
        service.validate_file(bad)
