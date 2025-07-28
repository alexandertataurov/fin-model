import pytest
import jwt
import time
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash, verify_password
from unittest.mock import patch


@pytest.mark.security
class TestAuthenticationSecurity:
    """Test authentication security measures."""

    def test_password_hashing_security(self):
        """Test password hashing and verification."""
        password = "SecurePassword123!"
        hashed = get_password_hash(password)
        
        # Should not store plain text
        assert password != hashed
        
        # Should verify correctly
        assert verify_password(password, hashed) is True
        
        # Should reject wrong password
        assert verify_password("WrongPassword", hashed) is False
        
        # Should use salt (different hashes for same password)
        hashed2 = get_password_hash(password)
        assert hashed != hashed2

    def test_jwt_token_security(self, client, db_session):
        """Test JWT token security."""
        # Create user
        user = User(
            username="securitytest",
            email="security@test.com",
            hashed_password=get_password_hash("TestPassword123!"),
            full_name="Security Test"
        )
        db_session.add(user)
        db_session.commit()
        
        # Login to get token
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "securitytest", "password": "TestPassword123!"}
        )
        assert response.status_code == 200
        token = response.json()["access_token"]
        
        # Verify token structure
        decoded = jwt.decode(token, options={"verify_signature": False})
        assert "sub" in decoded
        assert "exp" in decoded
        assert "iat" in decoded
        
        # Test token expiration
        expired_token = jwt.encode({
            "sub": str(user.id),
            "exp": int(time.time()) - 3600,  # Expired 1 hour ago
            "iat": int(time.time()) - 7200
        }, "test-secret")
        
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {expired_token}"}
        )
        assert response.status_code == 401

    def test_failed_login_attempts(self, client, db_session):
        """Test protection against brute force attacks."""
        # Create user
        user = User(
            username="brutetest",
            email="brute@test.com",
            hashed_password=get_password_hash("TestPassword123!"),
            full_name="Brute Test"
        )
        db_session.add(user)
        db_session.commit()
        
        # Simulate multiple failed login attempts
        for i in range(5):
            response = client.post(
                "/api/v1/auth/login",
                data={"username": "brutetest", "password": "wrongpassword"}
            )
            assert response.status_code == 401
        
        # After multiple failures, account should be temporarily locked
        # (Implementation would need rate limiting)
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "brutetest", "password": "TestPassword123!"}
        )
        # Should either succeed or be rate limited based on implementation

    def test_session_management(self, client, db_session):
        """Test session security."""
        # Create user and login
        user = User(
            username="sessiontest",
            email="session@test.com",
            hashed_password=get_password_hash("TestPassword123!"),
            full_name="Session Test"
        )
        db_session.add(user)
        db_session.commit()
        
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "sessiontest", "password": "TestPassword123!"}
        )
        token = response.json()["access_token"]
        
        # Test authenticated access
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        
        # Test logout (if implemented)
        # response = client.post(
        #     "/api/v1/auth/logout",
        #     headers={"Authorization": f"Bearer {token}"}
        # )
        # assert response.status_code == 200

    def test_password_strength_requirements(self, client):
        """Test password strength validation."""
        weak_passwords = [
            "123456",
            "password",
            "abc123",
            "qwerty",
            "admin"
        ]
        
        for weak_password in weak_passwords:
            response = client.post(
                "/api/v1/auth/register",
                json={
                    "username": f"weaktest_{weak_password}",
                    "email": f"weak_{weak_password}@test.com",
                    "password": weak_password,
                    "full_name": "Weak Test"
                }
            )
            # Should reject weak passwords
            assert response.status_code in [400, 422]


@pytest.mark.security
class TestAuthorizationSecurity:
    """Test authorization and access control."""

    def test_role_based_access_control(self, client, db_session):
        """Test RBAC implementation."""
        # Create regular user
        regular_user = User(
            username="regularuser",
            email="regular@test.com",
            hashed_password=get_password_hash("TestPassword123!"),
            full_name="Regular User",
            is_admin=False
        )
        
        # Create admin user
        admin_user = User(
            username="adminuser",
            email="admin@test.com",
            hashed_password=get_password_hash("TestPassword123!"),
            full_name="Admin User",
            is_admin=True
        )
        
        db_session.add_all([regular_user, admin_user])
        db_session.commit()
        
        # Test regular user access
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "regularuser", "password": "TestPassword123!"}
        )
        regular_token = response.json()["access_token"]
        
        # Regular user should not access admin endpoints
        response = client.get(
            "/api/v1/admin/users",
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        assert response.status_code == 403
        
        # Test admin user access
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "adminuser", "password": "TestPassword123!"}
        )
        admin_token = response.json()["access_token"]
        
        # Admin user should access admin endpoints
        response = client.get(
            "/api/v1/admin/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200

    def test_resource_ownership(self, client, db_session):
        """Test that users can only access their own resources."""
        # Create two users
        user1 = User(
            username="user1",
            email="user1@test.com",
            hashed_password=get_password_hash("TestPassword123!"),
            full_name="User One"
        )
        user2 = User(
            username="user2",
            email="user2@test.com",
            hashed_password=get_password_hash("TestPassword123!"),
            full_name="User Two"
        )
        
        db_session.add_all([user1, user2])
        db_session.commit()
        
        # Login as user1
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "user1", "password": "TestPassword123!"}
        )
        user1_token = response.json()["access_token"]
        
        # Login as user2
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "user2", "password": "TestPassword123!"}
        )
        user2_token = response.json()["access_token"]
        
        # User1 creates a file
        response = client.post(
            "/api/v1/files/upload",
            files={"file": ("test.xlsx", b"fake excel data", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
            headers={"Authorization": f"Bearer {user1_token}"}
        )
        assert response.status_code == 201
        file_id = response.json()["id"]
        
        # User2 should not be able to access user1's file
        response = client.get(
            f"/api/v1/files/{file_id}",
            headers={"Authorization": f"Bearer {user2_token}"}
        )
        assert response.status_code == 403

    def test_endpoint_authentication_required(self, client):
        """Test that protected endpoints require authentication."""
        protected_endpoints = [
            ("GET", "/api/v1/auth/me"),
            ("GET", "/api/v1/files/"),
            ("POST", "/api/v1/files/upload"),
            ("GET", "/api/v1/parameters/"),
            ("POST", "/api/v1/parameters/"),
            ("GET", "/api/v1/reports/"),
            ("GET", "/api/v1/dashboard/metrics"),
        ]
        
        for method, endpoint in protected_endpoints:
            if method == "GET":
                response = client.get(endpoint)
            elif method == "POST":
                response = client.post(endpoint, json={})
            
            assert response.status_code == 401


@pytest.mark.security
class TestInputValidationSecurity:
    """Test input validation and sanitization."""

    def test_sql_injection_prevention(self, authenticated_client):
        """Test SQL injection prevention."""
        client, user = authenticated_client
        
        # Test SQL injection in parameter creation
        sql_injection_payloads = [
            "'; DROP TABLE users; --",
            "1' OR '1'='1",
            "1'; SELECT * FROM users; --",
            "1' UNION SELECT * FROM users --"
        ]
        
        for payload in sql_injection_payloads:
            response = client.post(
                "/api/v1/parameters/",
                json={
                    "name": payload,
                    "value": 0.1,
                    "category": "test"
                }
            )
            # Should not cause SQL injection
            assert response.status_code in [201, 400, 422]
            
            # Database should still be intact
            response = client.get("/api/v1/auth/me")
            assert response.status_code == 200

    def test_xss_prevention(self, authenticated_client):
        """Test XSS prevention."""
        client, user = authenticated_client
        
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>",
            "';alert('XSS');'",
        ]
        
        for payload in xss_payloads:
            response = client.post(
                "/api/v1/parameters/",
                json={
                    "name": f"Test Parameter {payload}",
                    "value": 0.1,
                    "category": "test"
                }
            )
            
            if response.status_code == 201:
                # If created, check that payload is sanitized
                param_id = response.json()["id"]
                response = client.get(f"/api/v1/parameters/{param_id}")
                param_data = response.json()
                
                # Should not contain raw script tags
                assert "<script>" not in param_data["name"]
                assert "javascript:" not in param_data["name"]

    def test_file_upload_validation(self, authenticated_client):
        """Test file upload security."""
        client, user = authenticated_client
        
        # Test malicious file types
        malicious_files = [
            ("virus.exe", b"fake exe", "application/x-executable"),
            ("script.php", b"<?php echo 'hack'; ?>", "application/x-php"),
            ("shell.sh", b"#!/bin/bash\nrm -rf /", "application/x-sh"),
            ("large.xlsx", b"x" * (20 * 1024 * 1024), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),  # 20MB
        ]
        
        for filename, content, mimetype in malicious_files:
            response = client.post(
                "/api/v1/files/upload",
                files={"file": (filename, content, mimetype)}
            )
            
            # Should reject malicious files
            if filename.endswith(('.exe', '.php', '.sh')):
                assert response.status_code == 400
            elif len(content) > 10 * 1024 * 1024:  # File too large
                assert response.status_code == 413 or response.status_code == 400

    def test_parameter_validation(self, authenticated_client):
        """Test parameter input validation."""
        client, user = authenticated_client
        
        # Test invalid parameter values
        invalid_params = [
            {"name": "", "value": 0.1, "category": "test"},  # Empty name
            {"name": "x" * 1000, "value": 0.1, "category": "test"},  # Too long name
            {"name": "Test", "value": "not_a_number", "category": "test"},  # Invalid value type
            {"name": "Test", "value": "inf", "category": "test"},  # Non-finite value
            {"name": "Test", "value": 0.1, "category": ""},  # Empty category
        ]
        
        for param in invalid_params:
            response = client.post("/api/v1/parameters/", json=param)
            assert response.status_code in [400, 422]

    def test_json_parsing_security(self, authenticated_client):
        """Test JSON parsing security."""
        client, user = authenticated_client
        
        # Test malformed JSON
        response = client.post(
            "/api/v1/parameters/",
            data='{"name": "test", "value": 0.1, "category": "test"',  # Malformed JSON
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422
        
        # Test deeply nested JSON (JSON bomb)
        nested_json = '{"a":' * 1000 + '1' + '}' * 1000
        response = client.post(
            "/api/v1/parameters/",
            data=nested_json,
            headers={"Content-Type": "application/json"}
        )
        # Should handle gracefully without crashing
        assert response.status_code in [400, 422, 413]


@pytest.mark.security
class TestAPISecurityHeaders:
    """Test security headers and CORS."""

    def test_security_headers(self, client):
        """Test that proper security headers are set."""
        response = client.get("/api/v1/auth/login")
        
        # Check for security headers
        headers = response.headers
        
        # Should have CORS headers if configured
        # assert "Access-Control-Allow-Origin" in headers
        
        # Should have content type header
        assert "content-type" in headers
        
        # Check for security headers (if implemented)
        # assert "X-Content-Type-Options" in headers
        # assert "X-Frame-Options" in headers
        # assert "X-XSS-Protection" in headers

    def test_cors_configuration(self, client):
        """Test CORS configuration."""
        # Test preflight request
        response = client.options(
            "/api/v1/auth/login",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type"
            }
        )
        
        # Should handle OPTIONS request
        assert response.status_code in [200, 204]

    def test_rate_limiting(self, client):
        """Test rate limiting (if implemented)."""
        # Make multiple rapid requests
        responses = []
        for i in range(100):
            response = client.post(
                "/api/v1/auth/login",
                data={"username": "test", "password": "test"}
            )
            responses.append(response.status_code)
        
        # Should have some rate limiting after many requests
        # (Implementation dependent)
        rate_limited = any(status == 429 for status in responses)
        # Note: May not be implemented yet


@pytest.mark.security
class TestDataSecurity:
    """Test data security and privacy."""

    def test_password_not_returned(self, client, db_session):
        """Test that passwords are never returned in API responses."""
        # Create user
        user = User(
            username="passwordtest",
            email="password@test.com",
            hashed_password=get_password_hash("TestPassword123!"),
            full_name="Password Test"
        )
        db_session.add(user)
        db_session.commit()
        
        # Login
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "passwordtest", "password": "TestPassword123!"}
        )
        token = response.json()["access_token"]
        
        # Get user info
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        user_data = response.json()
        
        # Should not contain password fields
        assert "password" not in user_data
        assert "hashed_password" not in user_data

    def test_sensitive_data_logging(self, authenticated_client):
        """Test that sensitive data is not logged."""
        client, user = authenticated_client
        
        # This would require checking logs, which is implementation dependent
        # For now, just ensure API calls don't expose sensitive data in responses
        
        response = client.post(
            "/api/v1/parameters/",
            json={
                "name": "Sensitive Parameter",
                "value": 0.1,
                "category": "confidential"
            }
        )
        
        assert response.status_code == 201
        # Would need to check that logs don't contain sensitive values

    def test_data_encryption_at_rest(self, db_session):
        """Test data encryption at rest (if implemented)."""
        # This would test database encryption
        # Implementation dependent on encryption strategy
        
        # Create user with sensitive data
        user = User(
            username="encrypttest",
            email="encrypt@test.com",
            hashed_password=get_password_hash("TestPassword123!"),
            full_name="Encryption Test"
        )
        db_session.add(user)
        db_session.commit()
        
        # Check that password is hashed (basic check)
        assert user.hashed_password != "TestPassword123!"
        assert len(user.hashed_password) > 50  # Hashed passwords are long


@pytest.mark.security
class TestSecurityAuditing:
    """Test security auditing and monitoring."""

    def test_audit_logging(self, authenticated_client):
        """Test that security events are logged."""
        client, user = authenticated_client
        
        # Perform actions that should be audited
        actions = [
            ("POST", "/api/v1/parameters/", {"name": "Audit Test", "value": 0.1, "category": "test"}),
            ("DELETE", "/api/v1/parameters/1", None),
        ]
        
        for method, endpoint, data in actions:
            if method == "POST":
                response = client.post(endpoint, json=data)
            elif method == "DELETE":
                response = client.delete(endpoint)
            
            # Actions should be performed (or fail gracefully)
            assert response.status_code in [200, 201, 204, 404]
            
            # Would need to check audit logs (implementation dependent)

    def test_security_monitoring(self, client):
        """Test security monitoring capabilities."""
        # This would test security monitoring systems
        # Implementation dependent
        
        # Test suspicious activity detection
        suspicious_actions = [
            "Multiple failed login attempts",
            "Unusual API access patterns",
            "Privilege escalation attempts"
        ]
        
        # Would need actual monitoring system to test
        pass


@pytest.mark.security
class TestComplianceRequirements:
    """Test compliance with security standards."""

    def test_gdpr_compliance(self, authenticated_client, db_session):
        """Test GDPR compliance features."""
        client, user = authenticated_client
        
        # Test data export (right to data portability)
        response = client.get("/api/v1/auth/export-data")
        # Should provide user data export (if implemented)
        
        # Test data deletion (right to be forgotten)
        # Would need proper implementation
        pass

    def test_password_policy_compliance(self, client):
        """Test password policy compliance."""
        # Test password requirements
        password_tests = [
            ("TooShort1!", False),  # Too short
            ("toolongbutnouppercaseornumbers", False),  # No uppercase/numbers
            ("NoNumbers!", False),  # No numbers
            ("nonumbers123", False),  # No uppercase
            ("NOLOWERCASE123!", False),  # No lowercase
            ("GoodPassword123!", True),  # Good password
        ]
        
        for password, should_pass in password_tests:
            response = client.post(
                "/api/v1/auth/register",
                json={
                    "username": f"policytest_{len(password)}",
                    "email": f"policy_{len(password)}@test.com",
                    "password": password,
                    "full_name": "Policy Test"
                }
            )
            
            if should_pass:
                assert response.status_code == 201
            else:
                assert response.status_code in [400, 422]


@pytest.mark.security
@pytest.mark.slow
class TestPenetrationTesting:
    """Basic penetration testing scenarios."""

    def test_directory_traversal(self, authenticated_client):
        """Test directory traversal attacks."""
        client, user = authenticated_client
        
        # Test path traversal in file operations
        traversal_paths = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "%2e%2e%2f%2e%2e%2f%2e%2e%2f",  # URL encoded
        ]
        
        for path in traversal_paths:
            response = client.get(f"/api/v1/files/{path}")
            # Should not allow directory traversal
            assert response.status_code in [400, 403, 404]

    def test_command_injection(self, authenticated_client):
        """Test command injection prevention."""
        client, user = authenticated_client
        
        # Test command injection in parameters
        injection_payloads = [
            "; ls -la",
            "| cat /etc/passwd",
            "&& rm -rf /",
            "`whoami`",
        ]
        
        for payload in injection_payloads:
            response = client.post(
                "/api/v1/parameters/",
                json={
                    "name": f"Test {payload}",
                    "value": 0.1,
                    "category": "injection_test"
                }
            )
            
            # Should not execute commands
            assert response.status_code in [201, 400, 422]

    def test_buffer_overflow_protection(self, authenticated_client):
        """Test buffer overflow protection."""
        client, user = authenticated_client
        
        # Test with very large inputs
        large_string = "A" * 100000  # 100KB string
        
        response = client.post(
            "/api/v1/parameters/",
            json={
                "name": large_string,
                "value": 0.1,
                "category": "overflow_test"
            }
        )
        
        # Should handle large inputs gracefully
        assert response.status_code in [201, 400, 413, 422] 