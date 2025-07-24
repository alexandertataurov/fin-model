import pytest
import json
import tempfile
import os
from fastapi.testclient import TestClient
from app.models.user import User
from app.models.file import UploadedFile
from app.core.security import get_password_hash


@pytest.mark.api
class TestAuthEndpoints:
    """Test authentication and authorization endpoints."""

    def test_register_success(self, client):
        """Test successful user registration."""
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123",
            "full_name": "Test User"
        }
        response = client.post("/api/v1/auth/register", json=user_data)
        assert response.status_code == 201
        data = response.json()
        assert data["username"] == user_data["username"]
        assert data["email"] == user_data["email"]
        assert "id" in data

    def test_register_duplicate_username(self, client, db_session):
        """Test registration with duplicate username."""
        # Create existing user
        existing_user = User(
            username="testuser",
            email="existing@example.com",
            hashed_password=get_password_hash("password"),
            full_name="Existing User"
        )
        db_session.add(existing_user)
        db_session.commit()

        # Try to register with same username
        user_data = {
            "username": "testuser",
            "email": "new@example.com",
            "password": "testpassword123",
            "full_name": "New User"
        }
        response = client.post("/api/v1/auth/register", json=user_data)
        assert response.status_code == 400

    def test_login_success(self, client, db_session):
        """Test successful login."""
        # Create user
        password = "testpassword123"
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=get_password_hash(password),
            full_name="Test User"
        )
        db_session.add(user)
        db_session.commit()

        # Login
        login_data = {"username": "testuser", "password": password}
        response = client.post("/api/v1/auth/login", data=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials."""
        login_data = {"username": "nonexistent", "password": "wrong"}
        response = client.post("/api/v1/auth/login", data=login_data)
        assert response.status_code == 401

    def test_get_current_user(self, authenticated_client):
        """Test getting current user info."""
        client, user = authenticated_client
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == user.username
        assert data["email"] == user.email

    def test_unauthorized_access(self, client):
        """Test accessing protected endpoint without token."""
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401


@pytest.mark.api
class TestFileEndpoints:
    """Test file upload and management endpoints."""

    def test_upload_file_success(self, authenticated_client, sample_excel_file):
        """Test successful file upload."""
        client, user = authenticated_client
        
        with open(sample_excel_file, 'rb') as f:
            files = {"file": ("test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
            response = client.post("/api/v1/files/upload", files=files)
        
        assert response.status_code == 201
        data = response.json()
        assert data["original_filename"] == "test.xlsx"
        assert data["user_id"] == user.id

    def test_upload_file_unauthorized(self, client, sample_excel_file):
        """Test file upload without authentication."""
        with open(sample_excel_file, 'rb') as f:
            files = {"file": ("test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
            response = client.post("/api/v1/files/upload", files=files)
        
        assert response.status_code == 401

    def test_upload_invalid_file_type(self, authenticated_client):
        """Test uploading invalid file type."""
        client, user = authenticated_client
        
        # Create a text file
        content = b"This is not an Excel file"
        files = {"file": ("test.txt", content, "text/plain")}
        response = client.post("/api/v1/files/upload", files=files)
        
        assert response.status_code == 400

    def test_get_user_files(self, authenticated_client, db_session):
        """Test getting user's files."""
        client, user = authenticated_client
        
        # Create test files
        file1 = FileUpload(
            original_filename="file1.xlsx",
            stored_filename="stored1.xlsx",
            file_path="/path/file1.xlsx",
            file_size=1024,
            user_id=user.id
        )
        file2 = FileUpload(
            original_filename="file2.xlsx",
            stored_filename="stored2.xlsx",
            file_path="/path/file2.xlsx",
            file_size=2048,
            user_id=user.id
        )
        db_session.add_all([file1, file2])
        db_session.commit()

        response = client.get("/api/v1/files/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["original_filename"] in ["file1.xlsx", "file2.xlsx"]

    def test_delete_file_success(self, authenticated_client, db_session):
        """Test successful file deletion."""
        client, user = authenticated_client
        
        # Create test file
        file_upload = FileUpload(
            original_filename="test.xlsx",
            stored_filename="stored.xlsx",
            file_path="/path/test.xlsx",
            file_size=1024,
            user_id=user.id
        )
        db_session.add(file_upload)
        db_session.commit()
        db_session.refresh(file_upload)

        response = client.delete(f"/api/v1/files/{file_upload.id}")
        assert response.status_code == 204

    def test_delete_file_not_found(self, authenticated_client):
        """Test deleting non-existent file."""
        client, user = authenticated_client
        response = client.delete("/api/v1/files/999")
        assert response.status_code == 404

    def test_delete_file_unauthorized(self, authenticated_client, db_session, test_user_data):
        """Test deleting another user's file."""
        client, user = authenticated_client
        
        # Create another user
        other_user = User(
            username="otheruser",
            email="other@example.com",
            hashed_password=get_password_hash("password"),
            full_name="Other User"
        )
        db_session.add(other_user)
        db_session.commit()
        db_session.refresh(other_user)
        
        # Create file owned by other user
        file_upload = FileUpload(
            original_filename="test.xlsx",
            stored_filename="stored.xlsx",
            file_path="/path/test.xlsx",
            file_size=1024,
            user_id=other_user.id
        )
        db_session.add(file_upload)
        db_session.commit()
        db_session.refresh(file_upload)

        response = client.delete(f"/api/v1/files/{file_upload.id}")
        assert response.status_code == 403


@pytest.mark.api
class TestParameterEndpoints:
    """Test parameter management endpoints."""

    def test_get_parameters_empty(self, authenticated_client):
        """Test getting parameters when none exist."""
        client, user = authenticated_client
        response = client.get("/api/v1/parameters/")
        assert response.status_code == 200
        data = response.json()
        assert data == []

    def test_create_parameter(self, authenticated_client):
        """Test creating a new parameter."""
        client, user = authenticated_client
        parameter_data = {
            "name": "Growth Rate",
            "value": 0.15,
            "category": "assumptions",
            "description": "Annual revenue growth rate"
        }
        response = client.post("/api/v1/parameters/", json=parameter_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == parameter_data["name"]
        assert data["value"] == parameter_data["value"]

    def test_update_parameter(self, authenticated_client, db_session):
        """Test updating an existing parameter."""
        client, user = authenticated_client
        
        # Create parameter first
        from app.models.parameter import Parameter
        parameter = Parameter(
            name="Discount Rate",
            value=0.10,
            category="assumptions",
            user_id=user.id
        )
        db_session.add(parameter)
        db_session.commit()
        db_session.refresh(parameter)

        # Update parameter
        update_data = {"value": 0.12}
        response = client.put(f"/api/v1/parameters/{parameter.id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["value"] == 0.12


@pytest.mark.api
class TestReportEndpoints:
    """Test report generation endpoints."""

    def test_generate_report_no_data(self, authenticated_client):
        """Test generating report when no data exists."""
        client, user = authenticated_client
        response = client.post("/api/v1/reports/generate")
        assert response.status_code == 400

    def test_get_reports_empty(self, authenticated_client):
        """Test getting reports when none exist."""
        client, user = authenticated_client
        response = client.get("/api/v1/reports/")
        assert response.status_code == 200
        data = response.json()
        assert data == []


@pytest.mark.api
class TestDashboardEndpoints:
    """Test dashboard and analytics endpoints."""

    def test_get_dashboard_metrics(self, authenticated_client):
        """Test getting dashboard metrics."""
        client, user = authenticated_client
        response = client.get("/api/v1/dashboard/metrics")
        assert response.status_code == 200
        data = response.json()
        assert "total_files" in data
        assert "total_parameters" in data

    def test_get_dashboard_charts(self, authenticated_client):
        """Test getting dashboard chart data."""
        client, user = authenticated_client
        response = client.get("/api/v1/dashboard/charts")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict)


@pytest.mark.api
class TestWebSocketEndpoints:
    """Test WebSocket endpoints."""

    def test_websocket_connection_unauthorized(self, client):
        """Test WebSocket connection without authentication."""
        with pytest.raises(Exception):  # Should fail without auth
            with client.websocket_connect("/api/v1/ws") as websocket:
                pass

    def test_websocket_connection_authorized(self, authenticated_client):
        """Test WebSocket connection with authentication."""
        client, user = authenticated_client
        # Note: Testing WebSocket with authenticated client requires special setup
        # This is a placeholder for when WebSocket auth is properly implemented
        pass


@pytest.mark.api
class TestValidationAndErrorHandling:
    """Test API validation and error handling."""

    def test_invalid_json(self, authenticated_client):
        """Test sending invalid JSON."""
        client, user = authenticated_client
        response = client.post(
            "/api/v1/parameters/",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422

    def test_missing_required_fields(self, authenticated_client):
        """Test missing required fields in request."""
        client, user = authenticated_client
        incomplete_data = {"name": "Test Parameter"}  # Missing required fields
        response = client.post("/api/v1/parameters/", json=incomplete_data)
        assert response.status_code == 422

    def test_invalid_parameter_types(self, authenticated_client):
        """Test invalid parameter types."""
        client, user = authenticated_client
        invalid_data = {
            "name": "Test",
            "value": "not_a_number",  # Should be numeric
            "category": "test"
        }
        response = client.post("/api/v1/parameters/", json=invalid_data)
        assert response.status_code == 422

    def test_rate_limiting(self, authenticated_client):
        """Test rate limiting (if implemented)."""
        # This would test rate limiting if implemented
        # For now, it's a placeholder
        pass 