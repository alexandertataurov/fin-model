import pytest
from fastapi.testclient import TestClient
from main import app

# Mark all tests in this file as unit tests
pytestmark = pytest.mark.unit

client = TestClient(app)


def test_root_endpoint():
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "FinVision API"
    assert data["version"] == "1.0.0"
    assert data["status"] == "running"
    assert "cache_status" in data


def test_health_endpoint():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_api_v1_root():
    """Test the API v1 root endpoint."""
    response = client.get("/api/v1/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "FinVision API v1"


def test_api_v1_status():
    """Test the API v1 status endpoint."""
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert data["version"] == "1.0.0"
