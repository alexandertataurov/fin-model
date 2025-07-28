import pytest
from fastapi.testclient import TestClient
from app.models.role import RoleType
from app.core.permissions import Permission, PermissionChecker


def test_permission_checker():
    """Test the permission checker functionality."""
    # Test role permissions - convert RoleType to string
    admin_permissions = PermissionChecker.get_user_permissions([RoleType.ADMIN.value])
    analyst_permissions = PermissionChecker.get_user_permissions(
        [RoleType.ANALYST.value]
    )
    viewer_permissions = PermissionChecker.get_user_permissions([RoleType.VIEWER.value])

    # Admin should have all permissions
    assert len(admin_permissions) > len(analyst_permissions)
    assert len(analyst_permissions) > len(viewer_permissions)

    # Test specific permissions
    assert PermissionChecker.has_permission(
        [RoleType.ADMIN.value], Permission.USER_CREATE
    )
    assert not PermissionChecker.has_permission(
        [RoleType.VIEWER.value], Permission.USER_CREATE
    )


def test_resource_access():
    """Test resource access control."""
    # Test permission checking
    assert PermissionChecker.has_permission(
        [RoleType.ADMIN.value], Permission.MODEL_CREATE
    )
    assert PermissionChecker.has_permission(
        [RoleType.ANALYST.value], Permission.MODEL_READ
    )
    assert PermissionChecker.has_permission(
        [RoleType.VIEWER.value], Permission.DATA_READ
    )

    # Test role hierarchy
    assert PermissionChecker.has_any_permission(
        [RoleType.ADMIN.value], [Permission.USER_READ, Permission.USER_CREATE]
    )
    assert not PermissionChecker.has_any_permission(
        [RoleType.VIEWER.value], [Permission.USER_CREATE, Permission.USER_DELETE]
    )


def test_register_and_role_assignment(client):
    """Test user registration and basic role functionality."""
    user_data = {
        "email": "roles@example.com",
        "username": "rolesuser",
        "first_name": "Roles",
        "last_name": "User",
        "password": "RolesPassword123!",
    }

    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 201

    # Basic registration should work
    data = response.json()
    assert data["email"] == user_data["email"]


def test_admin_endpoints_require_permission(client):
    """Test that admin endpoints require proper permissions."""
    # Try to access admin endpoint without authentication
    response = client.get("/api/v1/admin/users")
    assert response.status_code == 401  # Unauthorized requests should return 401

    # Try to access with invalid token
    response = client.get(
        "/api/v1/admin/users", headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401


def test_role_hierarchy():
    """Test role hierarchy and permission inheritance."""
    # Test that admin has all analyst permissions
    admin_perms = PermissionChecker.get_user_permissions([RoleType.ADMIN.value])
    analyst_perms = PermissionChecker.get_user_permissions([RoleType.ANALYST.value])
    viewer_perms = PermissionChecker.get_user_permissions([RoleType.VIEWER.value])

    # Admin should have at least all analyst permissions
    assert set(analyst_perms).issubset(set(admin_perms))

    # Analyst should have at least all viewer permissions
    assert set(viewer_perms).issubset(set(analyst_perms))


def test_multiple_roles():
    """Test users with multiple roles."""
    # Test combining permissions from multiple roles
    combined_perms = PermissionChecker.get_user_permissions(
        [RoleType.ANALYST.value, RoleType.VIEWER.value]
    )
    analyst_only_perms = PermissionChecker.get_user_permissions(
        [RoleType.ANALYST.value]
    )

    # Combined should have at least analyst permissions
    assert set(analyst_only_perms).issubset(set(combined_perms))


def test_permission_descriptions():
    """Test that all permissions have proper descriptions."""
    for permission in Permission:
        # Each permission should have a non-empty description
        assert hasattr(permission, "value")
        assert len(permission.value) > 0


def test_get_user_permissions():
    """Test getting user permissions from roles."""
    # Test admin permissions
    admin_permissions = PermissionChecker.get_user_permissions([RoleType.ADMIN.value])
    assert Permission.USER_CREATE in admin_permissions
    assert Permission.USER_DELETE in admin_permissions
    assert Permission.AUDIT_LOGS in admin_permissions

    # Test viewer permissions (should be limited)
    viewer_permissions = PermissionChecker.get_user_permissions([RoleType.VIEWER.value])
    assert Permission.DATA_READ in viewer_permissions
    assert Permission.USER_CREATE not in viewer_permissions
    assert Permission.AUDIT_LOGS not in viewer_permissions
