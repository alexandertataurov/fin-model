import pytest
from fastapi.testclient import TestClient


def test_register_user(client):
    """Test user registration."""
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User",
        "password": "TestPassword123!",
    }

    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 201

    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["username"] == user_data["username"]
    assert "id" in data


def test_login_user(client):
    """Test user login with email verification."""
    # First register a user
    user_data = {
        "email": "login@example.com",
        "username": "loginuser",
        "first_name": "Login",
        "last_name": "User",
        "password": "LoginPassword123!",
    }

    register_response = client.post("/api/v1/auth/register", json=user_data)
    assert register_response.status_code == 201

    # Try to login before email verification (should fail)
    login_data = {"email": user_data["email"], "password": user_data["password"]}

    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 401
    assert "Email not verified" in response.json()["detail"]


def test_invalid_registration(client):
    """Test registration with invalid data."""
    invalid_data = {
        "email": "invalid-email",
        "username": "a",  # too short
        "first_name": "",  # empty
        "last_name": "User",
        "password": "123",  # too short
    }

    response = client.post("/api/v1/auth/register", json=invalid_data)
    assert response.status_code == 422  # Validation error


def test_duplicate_email(client):
    """Test registration with duplicate email."""
    user_data = {
        "email": "duplicate@example.com",
        "username": "duplicateuser",
        "first_name": "Duplicate",
        "last_name": "User",
        "password": "DuplicatePassword123!",
    }

    # Register first user
    response1 = client.post("/api/v1/auth/register", json=user_data)
    assert response1.status_code == 201

    # Try to register with same email but different username
    user_data["username"] = "differentuser"
    response2 = client.post("/api/v1/auth/register", json=user_data)
    assert response2.status_code == 400

    data = response2.json()
    assert "already registered" in data["detail"]


def test_api_status(client):
    """Test API status endpoint."""
    response = client.get("/api/v1/")
    assert response.status_code == 200

    data = response.json()
    assert "message" in data
