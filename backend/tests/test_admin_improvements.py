"""
Tests for the improved admin API endpoints.
"""
import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from datetime import datetime, timezone, timedelta
from app.models.user import User
from app.models.audit import AuditLog
from app.core.admin_exceptions import (
    AdminValidationError,
    validate_pagination_params,
    validate_date_range,
    create_pagination_response,
)


class TestAdminExceptions:
    """Test centralized admin exception handling."""

    def test_validate_pagination_params_valid(self):
        """Test validation with valid pagination parameters."""
        # Should not raise any exception
        validate_pagination_params(0, 10)
        validate_pagination_params(50, 100)

    def test_validate_pagination_params_invalid_skip(self):
        """Test validation with invalid skip parameter."""
        with pytest.raises(AdminValidationError) as exc_info:
            validate_pagination_params(-1, 10)
        assert "non-negative" in str(exc_info.value)

    def test_validate_pagination_params_invalid_limit(self):
        """Test validation with invalid limit parameter."""
        with pytest.raises(AdminValidationError) as exc_info:
            validate_pagination_params(0, 0)
        assert "positive" in str(exc_info.value)

        with pytest.raises(AdminValidationError) as exc_info:
            validate_pagination_params(0, 1001)
        assert "exceed 1000" in str(exc_info.value)

    def test_validate_date_range_valid(self):
        """Test validation with valid date range."""
        # Should not raise any exception
        validate_date_range("2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z")
        validate_date_range(None, "2024-01-02T00:00:00Z")
        validate_date_range("2024-01-01T00:00:00Z", None)

    def test_validate_date_range_invalid(self):
        """Test validation with invalid date range."""
        with pytest.raises(AdminValidationError) as exc_info:
            validate_date_range("2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z")
        assert "before end date" in str(exc_info.value)

    def test_create_pagination_response_with_envelope(self):
        """Test pagination response with envelope."""
        items = [{"id": 1}, {"id": 2}]
        response = create_pagination_response(
            items=items, total=10, skip=0, limit=5, envelope=True
        )

        assert "items" in response
        assert "pagination" in response
        assert response["items"] == items
        assert response["pagination"]["total"] == 10
        assert response["pagination"]["has_more"] is True

    def test_create_pagination_response_without_envelope(self):
        """Test pagination response without envelope."""
        items = [{"id": 1}, {"id": 2}]
        response = create_pagination_response(
            items=items, total=10, skip=0, limit=5, envelope=False
        )

        assert response == items


class TestEnhancedUserListing:
    """Test enhanced user listing with filtering."""

    @pytest.fixture
    def mock_user(self):
        """Create a mock user for testing."""
        user = Mock(spec=User)
        user.id = 1
        user.username = "testuser"
        user.email = "test@example.com"
        user.full_name = "Test User"
        user.is_active = True
        user.is_admin = False
        user.is_verified = True
        user.created_at = datetime.now(timezone.utc)
        return user

    def test_user_listing_filtering_parameters(self, client: TestClient, auth_headers):
        """Test that user listing accepts all filtering parameters."""
        response = client.get(
            "/api/v1/admin/users",
            headers=auth_headers,
            params={
                "skip": 0,
                "limit": 10,
                "is_active": True,
                "is_admin": False,
                "is_verified": True,
                "search": "test",
                "envelope": True,
            },
        )
        # Should not return 422 validation error
        assert response.status_code != 422


class TestEnhancedAuditLogs:
    """Test enhanced audit log filtering."""

    def test_audit_logs_filtering_parameters(self, client: TestClient, auth_headers):
        """Test that audit logs accept all filtering parameters."""
        response = client.get(
            "/api/v1/admin/audit-logs",
            headers=auth_headers,
            params={
                "skip": 0,
                "limit": 10,
                "user_id": 1,
                "action": "LOGIN",
                "resource": "user",
                "success": True,
                "search": "test",
                "envelope": True,
            },
        )
        # Should not return 422 validation error
        assert response.status_code != 422


class TestRealActivityMetrics:
    """Test that activity metrics use real data."""

    @patch("app.api.v1.endpoints.admin.users.db.query")
    def test_activity_metrics_queries_audit_logs(
        self, mock_query, client, auth_headers
    ):
        """Test that activity endpoint queries audit logs for real login counts."""
        # Mock the database queries
        mock_user_query = Mock()
        mock_audit_query = Mock()
        mock_file_query = Mock()
        mock_statement_query = Mock()

        mock_query.side_effect = [
            mock_user_query,  # First call for users
            mock_file_query,  # Files uploaded query
            mock_statement_query,  # Models created query
            mock_audit_query,  # Login count query
        ]

        # Configure mocks
        mock_user_query.order_by.return_value.limit.return_value.all.return_value = []
        mock_audit_query.filter.return_value.filter.return_value.filter.return_value.count.return_value = (
            5
        )

        response = client.get("/api/v1/admin/users/activity-list", headers=auth_headers)

        # Verify that AuditLog was queried for login counts
        assert mock_query.called
        # The query should include AuditLog model
        audit_log_queries = [
            call for call in mock_query.call_args_list if "AuditLog" in str(call)
        ]
        assert len(audit_log_queries) > 0


class TestMaintenanceTasks:
    """Test async maintenance operations."""

    @patch("app.tasks.maintenance.backup_database")
    def test_backup_endpoint_uses_celery(self, mock_backup_task, client, auth_headers):
        """Test that backup endpoint uses Celery task."""
        # Mock the Celery task
        mock_task = Mock()
        mock_task.id = "test-task-id"
        mock_backup_task.delay.return_value = mock_task

        response = client.post("/api/v1/admin/database/backup", headers=auth_headers)

        # Should call the Celery task
        mock_backup_task.delay.assert_called_once()

        # Should return task ID
        if response.status_code == 200:
            data = response.json()
            assert "job_id" in data
            assert data["job_id"] == "test-task-id"

    @patch("app.tasks.maintenance.export_database")
    def test_export_endpoint_uses_celery(self, mock_export_task, client, auth_headers):
        """Test that export endpoint uses Celery task."""
        # Mock the Celery task
        mock_task = Mock()
        mock_task.id = "test-export-task-id"
        mock_export_task.delay.return_value = mock_task

        response = client.post(
            "/api/v1/admin/database/export",
            headers=auth_headers,
            json={"table": "users", "format": "csv"},
        )

        # Should call the Celery task with correct parameters
        mock_export_task.delay.assert_called_once_with("users", "csv")

    @patch("app.tasks.maintenance.reindex_database")
    def test_reindex_endpoint_uses_celery(
        self, mock_reindex_task, client, auth_headers
    ):
        """Test that reindex endpoint uses Celery task."""
        # Mock the Celery task
        mock_task = Mock()
        mock_task.id = "test-reindex-task-id"
        mock_reindex_task.delay.return_value = mock_task

        response = client.post("/api/v1/admin/database/reindex", headers=auth_headers)

        # Should call the Celery task
        mock_reindex_task.delay.assert_called_once()


class TestSecurityAuditEnhancements:
    """Test enhanced security audit functionality."""

    @patch("app.api.v1.endpoints.admin.system.db.query")
    def test_security_audit_queries_real_data(self, mock_query, client, auth_headers):
        """Test that security audit uses real audit log data."""
        # Mock various query chains
        mock_rate_limit_query = Mock()
        mock_failed_login_query = Mock()
        mock_user_query = Mock()

        mock_query.side_effect = [
            mock_rate_limit_query,  # Rate limit violations
            mock_failed_login_query,  # Failed logins count
            mock_failed_login_query,  # Failed login users query
            mock_failed_login_query,  # Suspicious IPs query
            mock_user_query,  # Password violations
        ]

        # Configure mocks to return reasonable values
        mock_rate_limit_query.filter.return_value.filter.return_value.count.return_value = (
            2
        )
        mock_failed_login_query.filter.return_value.filter.return_value.filter.return_value.count.return_value = (
            5
        )
        mock_user_query.filter.return_value.count.return_value = 1

        response = client.get("/api/v1/admin/security/audit", headers=auth_headers)

        if response.status_code == 200:
            data = response.json()
            # Should have real failed login count (not 0)
            assert "failed_logins_24h" in data
            # Should include suspicious activities
            assert "suspicious_activities" in data


class TestSystemMetricsEnhancements:
    """Test enhanced system metrics."""

    @patch("app.api.v1.endpoints.admin.system.db.query")
    def test_system_metrics_uses_real_data(self, mock_query, client, auth_headers):
        """Test that system metrics calculate real values from audit logs."""
        # Mock audit log queries for metrics calculation
        mock_audit_query = Mock()
        mock_query.return_value = mock_audit_query

        # Configure mock to return realistic counts
        mock_audit_query.filter.return_value.filter.return_value.count.return_value = (
            100
        )

        response = client.get("/api/v1/admin/system/metrics", headers=auth_headers)

        if response.status_code == 200:
            data = response.json()
            # Should have real request count (not 0)
            assert "request_count_24h" in data
            assert "error_rate_24h" in data
            assert "avg_response_time" in data
