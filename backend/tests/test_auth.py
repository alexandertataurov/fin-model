import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base, get_db
from app.core.security import get_password_hash
from main import app

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

def test_register_user(client):
    """Test user registration."""
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User",
        "password": "TestPassword123!"
    }
    
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 201
    
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["username"] == user_data["username"]
    assert "hashed_password" not in data

def test_login_user(client):
    """Test user login."""
    # First register a user
    user_data = {
        "email": "login@example.com",
        "username": "loginuser",
        "first_name": "Login",
        "last_name": "User",
        "password": "LoginPassword123!"
    }
    
    register_response = client.post("/api/v1/auth/register", json=user_data)
    assert register_response.status_code == 201
    
    # Verify the user's email (simplified for testing)
    # In a real scenario, you'd use the verification token
    
    # Try to login
    login_data = {
        "email": user_data["email"],
        "password": user_data["password"],
        "remember_me": False
    }
    
    # Note: Login will fail because email is not verified
    # This tests our email verification requirement
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 401
    assert "Email not verified" in response.json()["detail"]

def test_invalid_registration(client):
    """Test registration with invalid data."""
    # Test weak password
    user_data = {
        "email": "weak@example.com",
        "username": "weakuser",
        "first_name": "Weak",
        "last_name": "User",
        "password": "weak"
    }
    
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 422  # Validation error

def test_duplicate_email(client):
    """Test registration with duplicate email."""
    user_data = {
        "email": "duplicate@example.com",
        "username": "duplicate1",
        "first_name": "Duplicate",
        "last_name": "User",
        "password": "DuplicatePassword123!"
    }
    
    # First registration should succeed
    response1 = client.post("/api/v1/auth/register", json=user_data)
    assert response1.status_code == 201
    
    # Second registration with same email should fail
    user_data["username"] = "duplicate2"
    response2 = client.post("/api/v1/auth/register", json=user_data)
    assert response2.status_code == 400
    assert "Email already registered" in response2.json()["detail"]

def test_api_status(client):
    """Test API status endpoint."""
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert data["version"] == "1.0.0" 