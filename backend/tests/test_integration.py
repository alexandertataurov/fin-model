import pytest
import tempfile
import os
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.file import UploadedFile
from app.models.parameter import Parameter
from app.models.report import ReportTemplate, ReportExport
from app.core.security import get_password_hash
from app.services.excel_parser import ExcelParser
from app.services.financial_extractor import FinancialExtractor
from app.tasks.file_processing import process_uploaded_file
import pandas as pd


@pytest.mark.integration
class TestFileUploadWorkflow:
    """Integration tests for complete file upload and processing workflow."""

    def test_complete_file_upload_workflow(self, client, db_session, sample_excel_file):
        """Test the complete workflow from file upload to data extraction."""
        # Create and authenticate user
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Test User"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        # Login
        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "testuser", "password": "password123"}
        )
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}

        # Upload file
        with open(sample_excel_file, 'rb') as f:
            upload_response = client.post(
                "/api/v1/files/upload",
                files={"file": ("test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
            )
        
        assert upload_response.status_code == 201
        file_data = upload_response.json()
        file_id = file_data["id"]

        # Verify file was saved to database
        uploaded_file = db_session.query(UploadedFile).filter(UploadedFile.id == file_id).first()
        assert uploaded_file is not None
        assert uploaded_file.original_filename == "test.xlsx"
        assert uploaded_file.user_id == user.id

        # Check file processing status
        status_response = client.get(f"/api/v1/files/{file_id}/status")
        assert status_response.status_code == 200
        
        # Simulate file processing completion
        uploaded_file.processing_status = "completed"
        db_session.commit()

        # Verify processed data can be retrieved
        data_response = client.get(f"/api/v1/files/{file_id}/data")
        assert data_response.status_code == 200
        extracted_data = data_response.json()
        assert "financial_data" in extracted_data

    def test_file_processing_with_parameters(self, client, db_session, sample_excel_file):
        """Test file processing with parameter detection and scenario creation."""
        # Setup authenticated user
        user = User(
            username="paramuser",
            email="param@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Parameter User"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "paramuser", "password": "password123"}
        )
        token = login_response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}

        # Upload file with parameters
        with open(sample_excel_file, 'rb') as f:
            upload_response = client.post(
                "/api/v1/files/upload",
                files={"file": ("params.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
            )
        file_id = upload_response.json()["id"]

        # Create some parameters
        parameters = [
            Parameter(name="Growth Rate", value=0.15, category="assumptions", user_id=user.id),
            Parameter(name="Discount Rate", value=0.10, category="assumptions", user_id=user.id),
            Parameter(name="Tax Rate", value=0.25, category="assumptions", user_id=user.id)
        ]
        db_session.add_all(parameters)
        db_session.commit()

        # Run scenario analysis
        scenario_response = client.post(
            "/api/v1/scenarios/analyze",
            json={
                "file_id": file_id,
                "scenarios": [
                    {"name": "Base Case", "parameters": {"Growth Rate": 0.15}},
                    {"name": "Optimistic", "parameters": {"Growth Rate": 0.20}},
                    {"name": "Pessimistic", "parameters": {"Growth Rate": 0.10}}
                ]
            }
        )
        assert scenario_response.status_code == 201
        scenario_results = scenario_response.json()
        assert len(scenario_results["scenarios"]) == 3

    def test_error_handling_in_workflow(self, client, db_session):
        """Test error handling throughout the integration workflow."""
        # Setup user
        user = User(
            username="erroruser",
            email="error@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Error User"
        )
        db_session.add(user)
        db_session.commit()

        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "erroruser", "password": "password123"}
        )
        token = login_response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}

        # Try to upload invalid file
        invalid_content = b"This is not an Excel file"
        upload_response = client.post(
            "/api/v1/files/upload",
            files={"file": ("invalid.txt", invalid_content, "text/plain")}
        )
        assert upload_response.status_code == 400

        # Try to access non-existent file
        data_response = client.get("/api/v1/files/99999/data")
        assert data_response.status_code == 404


@pytest.mark.integration
class TestDashboardIntegration:
    """Integration tests for dashboard data aggregation and display."""

    def test_dashboard_metrics_aggregation(self, client, db_session):
        """Test dashboard metrics calculation with real data."""
        # Create user with multiple files and parameters
        user = User(
            username="dashuser",
            email="dash@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Dashboard User"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        # Create test files
        files = [
            UploadedFile(
                original_filename="file1.xlsx",
                stored_filename="stored1.xlsx",
                file_path="/path/file1.xlsx",
                file_size=1024,
                user_id=user.id,
                processing_status="completed"
            ),
            UploadedFile(
                original_filename="file2.xlsx",
                stored_filename="stored2.xlsx",
                file_path="/path/file2.xlsx",
                file_size=2048,
                user_id=user.id,
                processing_status="processing"
            )
        ]
        db_session.add_all(files)

        # Create test parameters
        parameters = [
            Parameter(name="Revenue Growth", value=0.15, category="growth", user_id=user.id),
            Parameter(name="Cost Inflation", value=0.08, category="costs", user_id=user.id)
        ]
        db_session.add_all(parameters)

        # Create test reports
        reports = [
            ReportExport(
                title="Q1 Analysis",
                export_format="pdf",
                file_path="/reports/q1.pdf",
                status="completed",
                user_id=user.id
            )
        ]
        db_session.add_all(reports)
        db_session.commit()

        # Login and get dashboard metrics
        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "dashuser", "password": "password123"}
        )
        token = login_response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}

        metrics_response = client.get("/api/v1/dashboard/metrics")
        assert metrics_response.status_code == 200
        
        metrics = metrics_response.json()
        assert metrics["total_files"] == 2
        assert metrics["total_parameters"] == 2
        assert metrics["total_reports"] == 1
        assert metrics["completed_files"] == 1
        assert metrics["processing_files"] == 1

    def test_dashboard_charts_integration(self, client, db_session, sample_excel_file):
        """Test dashboard chart data generation from uploaded files."""
        # Setup user and upload file
        user = User(
            username="chartuser",
            email="chart@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Chart User"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "chartuser", "password": "password123"}
        )
        token = login_response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}

        # Upload and process file
        with open(sample_excel_file, 'rb') as f:
            upload_response = client.post(
                "/api/v1/files/upload",
                files={"file": ("chart_data.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
            )
        file_id = upload_response.json()["id"]

        # Simulate processing completion
        uploaded_file = db_session.query(UploadedFile).filter(UploadedFile.id == file_id).first()
        uploaded_file.processing_status = "completed"
        db_session.commit()

        # Get chart data
        charts_response = client.get("/api/v1/dashboard/charts")
        assert charts_response.status_code == 200
        
        chart_data = charts_response.json()
        assert "revenue_trend" in chart_data
        assert "expense_breakdown" in chart_data
        assert len(chart_data["revenue_trend"]) > 0


@pytest.mark.integration
class TestReportGenerationWorkflow:
    """Integration tests for report generation workflow."""

    def test_complete_report_generation(self, client, db_session, sample_excel_file):
        """Test complete report generation from file upload to PDF output."""
        # Setup user
        user = User(
            username="reportuser",
            email="report@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Report User"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "reportuser", "password": "password123"}
        )
        token = login_response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}

        # Upload file
        with open(sample_excel_file, 'rb') as f:
            upload_response = client.post(
                "/api/v1/files/upload",
                files={"file": ("report_data.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
            )
        file_id = upload_response.json()["id"]

        # Simulate processing completion
        uploaded_file = db_session.query(UploadedFile).filter(UploadedFile.id == file_id).first()
        uploaded_file.processing_status = "completed"
        db_session.commit()

        # Generate report
        report_response = client.post(
            "/api/v1/reports/generate",
            json={
                "file_ids": [file_id],
                "report_type": "financial_analysis",
                "title": "Test Financial Report",
                "include_charts": True,
                "include_scenarios": True
            }
        )
        assert report_response.status_code == 201
        report_data = report_response.json()
        report_id = report_data["id"]

        # Check report status
        status_response = client.get(f"/api/v1/reports/{report_id}/status")
        assert status_response.status_code == 200

        # Simulate report completion
        report = db_session.query(ReportExport).filter(ReportExport.id == report_id).first()
        report.status = "completed"
        report.file_path = f"/reports/{report_id}.pdf"
        db_session.commit()

        # Download report
        download_response = client.get(f"/api/v1/reports/{report_id}/download")
        assert download_response.status_code == 200


@pytest.mark.integration
class TestAuthenticationIntegration:
    """Integration tests for authentication flow."""

    def test_complete_auth_flow(self, client, db_session):
        """Test complete authentication flow from registration to protected access."""
        # Register new user
        register_data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpassword123",
            "full_name": "New User"
        }
        register_response = client.post("/api/v1/auth/register", json=register_data)
        assert register_response.status_code == 201
        user_data = register_response.json()
        user_id = user_data["id"]

        # Login with new user
        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "newuser", "password": "newpassword123"}
        )
        assert login_response.status_code == 200
        token_data = login_response.json()
        token = token_data["access_token"]

        # Access protected endpoint
        client.headers = {"Authorization": f"Bearer {token}"}
        profile_response = client.get("/api/v1/auth/me")
        assert profile_response.status_code == 200
        profile_data = profile_response.json()
        assert profile_data["id"] == user_id
        assert profile_data["username"] == "newuser"

        # Update profile
        update_response = client.put(
            "/api/v1/auth/me",
            json={"full_name": "Updated Name"}
        )
        assert update_response.status_code == 200

        # Logout (if implemented)
        # logout_response = client.post("/api/v1/auth/logout")
        # assert logout_response.status_code == 200

    def test_admin_access_control(self, client, db_session):
        """Test admin access control integration."""
        # Create regular user
        regular_user = User(
            username="regular",
            email="regular@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Regular User",
            is_admin=False
        )
        
        # Create admin user
        admin_user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Admin User",
            is_admin=True
        )
        
        db_session.add_all([regular_user, admin_user])
        db_session.commit()

        # Test regular user cannot access admin endpoints
        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "regular", "password": "password123"}
        )
        token = login_response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}

        admin_response = client.get("/api/v1/admin/users")
        assert admin_response.status_code == 403

        # Test admin user can access admin endpoints
        admin_login = client.post(
            "/api/v1/auth/login",
            data={"username": "admin", "password": "password123"}
        )
        admin_token = admin_login.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {admin_token}"}

        admin_access_response = client.get("/api/v1/admin/users")
        assert admin_access_response.status_code == 200


@pytest.mark.integration
class TestPerformanceIntegration:
    """Integration tests for performance characteristics."""

    def test_concurrent_file_uploads(self, client, db_session):
        """Test system behavior under concurrent file uploads."""
        # This would test concurrent upload handling
        # Implementation would depend on async capabilities
        pass

    def test_large_file_processing(self, client, db_session):
        """Test processing of large Excel files."""
        # Create large test file
        large_data = {
            'Account': [f'Account_{i}' for i in range(1000)],
            'Q1': [1000 + i for i in range(1000)],
            'Q2': [1100 + i for i in range(1000)],
            'Q3': [1200 + i for i in range(1000)],
            'Q4': [1300 + i for i in range(1000)]
        }
        
        df = pd.DataFrame(large_data)
        
        with tempfile.NamedTemporaryFile(suffix='.xlsx', delete=False) as f:
            df.to_excel(f.name, index=False)
            
            # Setup user and login
            user = User(
                username="perfuser",
                email="perf@example.com",
                hashed_password=get_password_hash("password123"),
                full_name="Performance User"
            )
            db_session.add(user)
            db_session.commit()

            login_response = client.post(
                "/api/v1/auth/login",
                data={"username": "perfuser", "password": "password123"}
            )
            token = login_response.json()["access_token"]
            client.headers = {"Authorization": f"Bearer {token}"}

            # Upload large file
            with open(f.name, 'rb') as large_file:
                upload_response = client.post(
                    "/api/v1/files/upload",
                    files={"file": ("large.xlsx", large_file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
                )
            
            assert upload_response.status_code == 201
            
            # Cleanup
            os.unlink(f.name)


@pytest.mark.integration
class TestDataConsistency:
    """Integration tests for data consistency across the system."""

    def test_data_consistency_across_operations(self, client, db_session, sample_excel_file):
        """Test data consistency when performing multiple operations."""
        # Setup user
        user = User(
            username="consistuser",
            email="consist@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Consistency User"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        login_response = client.post(
            "/api/v1/auth/login",
            data={"username": "consistuser", "password": "password123"}
        )
        token = login_response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}

        # Upload file
        with open(sample_excel_file, 'rb') as f:
            upload_response = client.post(
                "/api/v1/files/upload",
                files={"file": ("consistency.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
            )
        file_id = upload_response.json()["id"]

        # Create parameters
        param_response = client.post(
            "/api/v1/parameters/",
            json={"name": "Test Parameter", "value": 0.15, "category": "test"}
        )
        param_id = param_response.json()["id"]

        # Generate report
        report_response = client.post(
            "/api/v1/reports/generate",
            json={"file_ids": [file_id], "report_type": "test_report"}
        )
        report_id = report_response.json()["id"]

        # Verify all related data exists
        file_check = client.get(f"/api/v1/files/{file_id}")
        assert file_check.status_code == 200

        param_check = client.get(f"/api/v1/parameters/{param_id}")
        assert param_check.status_code == 200

        report_check = client.get(f"/api/v1/reports/{report_id}")
        assert report_check.status_code == 200

        # Delete file and check cascade effects
        delete_response = client.delete(f"/api/v1/files/{file_id}")
        assert delete_response.status_code == 204

        # Related data should be properly handled
        file_check_after = client.get(f"/api/v1/files/{file_id}")
        assert file_check_after.status_code == 404 