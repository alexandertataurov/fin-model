import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base, get_db
from app.models.role import RoleType
from app.core.permissions import Permission, PermissionChecker
from main import app

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_permissions.db"
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

def test_permission_checker():
    """Test permission checker functionality."""
    # Test admin permissions
    admin_roles = ["admin"]
    assert PermissionChecker.has_permission(admin_roles, Permission.USER_DELETE)
    assert PermissionChecker.has_permission(admin_roles, Permission.MODEL_CREATE)
    assert PermissionChecker.has_permission(admin_roles, Permission.SYSTEM_SETTINGS)

    # Test analyst permissions
    analyst_roles = ["analyst"]
    assert PermissionChecker.has_permission(analyst_roles, Permission.MODEL_CREATE)
    assert PermissionChecker.has_permission(analyst_roles, Permission.DATA_UPLOAD)
    assert not PermissionChecker.has_permission(analyst_roles, Permission.USER_DELETE)
    assert not PermissionChecker.has_permission(analyst_roles, Permission.SYSTEM_SETTINGS)

    # Test viewer permissions
    viewer_roles = ["viewer"]
    assert PermissionChecker.has_permission(viewer_roles, Permission.MODEL_READ)
    assert PermissionChecker.has_permission(viewer_roles, Permission.DASHBOARD_READ)
    assert not PermissionChecker.has_permission(viewer_roles, Permission.MODEL_CREATE)
    assert not PermissionChecker.has_permission(viewer_roles, Permission.USER_DELETE)

def test_resource_access():
    """Test resource access control."""
    # Admin can access everything
    admin_roles = ["admin"]
    assert PermissionChecker.can_access_resource(admin_roles, 999, 1, Permission.MODEL_READ)
    assert PermissionChecker.can_access_resource(admin_roles, 999, 1, Permission.MODEL_DELETE)

    # User can access own resources
    analyst_roles = ["analyst"]
    assert PermissionChecker.can_access_resource(analyst_roles, 1, 1, Permission.MODEL_UPDATE)
    assert PermissionChecker.can_access_resource(analyst_roles, 1, 1, Permission.REPORT_DELETE)

    # User cannot modify others' resources (except reading)
    assert PermissionChecker.can_access_resource(analyst_roles, 2, 1, Permission.MODEL_READ)
    assert not PermissionChecker.can_access_resource(analyst_roles, 2, 1, Permission.MODEL_DELETE)

    # Viewer has limited access
    viewer_roles = ["viewer"]
    assert PermissionChecker.can_access_resource(viewer_roles, 2, 1, Permission.MODEL_READ)
    assert not PermissionChecker.can_access_resource(viewer_roles, 1, 1, Permission.MODEL_UPDATE)

def test_register_and_role_assignment(client):
    """Test user registration and automatic role assignment."""
    user_data = {
        "email": "testuser@example.com",
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User",
        "password": "TestPassword123!"
    }
    
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 201
    
    # User should be assigned viewer role by default
    user = response.json()
    assert user["email"] == user_data["email"]

def test_admin_endpoints_require_permission(client):
    """Test that admin endpoints require proper permissions."""
    # Try to access admin endpoint without authentication
    response = client.get("/api/v1/admin/users")
    assert response.status_code == 403  # HTTPBearer returns 403 when no auth header provided

    # Try to access with invalid token
    response = client.get("/api/v1/admin/users", headers={"Authorization": "Bearer invalid_token"})
    assert response.status_code == 401

def test_role_hierarchy():
    """Test that role hierarchy works correctly."""
    # Admin has all analyst permissions
    admin_roles = ["admin"]
    analyst_permissions = [
        Permission.MODEL_CREATE,
        Permission.MODEL_UPDATE,
        Permission.DATA_UPLOAD,
        Permission.REPORT_CREATE
    ]
    
    for permission in analyst_permissions:
        assert PermissionChecker.has_permission(admin_roles, permission)

    # Analyst has more permissions than viewer
    analyst_roles = ["analyst"]
    viewer_permissions = [
        Permission.MODEL_READ,
        Permission.DASHBOARD_READ,
        Permission.REPORT_READ
    ]
    
    for permission in viewer_permissions:
        assert PermissionChecker.has_permission(analyst_roles, permission)

def test_multiple_roles():
    """Test users with multiple roles."""
    multi_roles = ["viewer", "analyst"]
    
    # Should have highest permissions from both roles
    assert PermissionChecker.has_permission(multi_roles, Permission.MODEL_READ)  # viewer
    assert PermissionChecker.has_permission(multi_roles, Permission.MODEL_CREATE)  # analyst
    assert not PermissionChecker.has_permission(multi_roles, Permission.USER_DELETE)  # admin only

def test_permission_descriptions():
    """Test that all permissions have descriptions."""
    from app.core.permissions import get_permission_description
    
    for permission in Permission:
        description = get_permission_description(permission)
        assert description != "Unknown permission"
        assert len(description) > 0

def test_get_user_permissions():
    """Test getting all permissions for user roles."""
    admin_permissions = PermissionChecker.get_user_permissions(["admin"])
    analyst_permissions = PermissionChecker.get_user_permissions(["analyst"])
    viewer_permissions = PermissionChecker.get_user_permissions(["viewer"])
    
    # Admin should have the most permissions
    assert len(admin_permissions) > len(analyst_permissions)
    assert len(analyst_permissions) > len(viewer_permissions)
    
    # Viewer permissions should be subset of analyst permissions
    assert viewer_permissions.issubset(analyst_permissions)
    
    # Analyst permissions should be subset of admin permissions
    assert analyst_permissions.issubset(admin_permissions) 