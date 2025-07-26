from app.core.config import Settings
from app.core.permissions import (
    PermissionChecker,
    Permission,
    get_permission_description,
)
from app.models.role import RoleType


def test_get_cors_origins_parsing():
    settings = Settings(BACKEND_CORS_ORIGINS="http://a.com,http://b.com")
    assert settings.get_cors_origins() == ["http://a.com", "http://b.com"]
    star = Settings(BACKEND_CORS_ORIGINS="*")
    assert star.get_cors_origins() == ["*"]


def test_permission_checker_basic():
    admin_roles = [RoleType.ADMIN.value]
    viewer_roles = [RoleType.VIEWER.value]

    assert PermissionChecker.has_permission(admin_roles, Permission.USER_CREATE)
    assert not PermissionChecker.has_permission(viewer_roles, Permission.USER_CREATE)
    assert PermissionChecker.has_any_permission(viewer_roles, [Permission.USER_READ, Permission.DATA_EXPORT])
    assert PermissionChecker.has_all_permissions(admin_roles, [Permission.USER_READ, Permission.USER_DELETE])

    perms = PermissionChecker.get_user_permissions(viewer_roles)
    assert Permission.DATA_EXPORT in perms

    assert PermissionChecker.can_access_resource(admin_roles, 1, 2, Permission.MODEL_READ)
    assert PermissionChecker.can_access_resource(viewer_roles, 1, 1, Permission.MODEL_READ)
    assert PermissionChecker.can_access_resource(viewer_roles, 2, 1, Permission.MODEL_READ)


def test_get_permission_description():
    desc = get_permission_description(Permission.USER_CREATE)
    assert "Create" in desc

def test_assemble_cors_origins_list():
    settings = Settings(BACKEND_CORS_ORIGINS=["http://a.com", "http://b.com"])
    assert settings.BACKEND_CORS_ORIGINS == "http://a.com,http://b.com"
    assert settings.get_cors_origins() == ["http://a.com", "http://b.com"]


def test_has_permission_invalid_role():
    assert not PermissionChecker.has_permission(["invalid"], Permission.USER_CREATE)


def test_get_user_permissions_invalid_role():
    assert PermissionChecker.get_user_permissions(["bad"]) == set()


def test_can_access_resource_denied():
    viewer = [RoleType.VIEWER.value]
    assert not PermissionChecker.can_access_resource(
        viewer, 2, 1, Permission.MODEL_UPDATE
    )


def test_assemble_cors_origins_default_if_blank():
    settings = Settings(BACKEND_CORS_ORIGINS="")
    assert settings.get_cors_origins() == ["http://localhost:3000", "http://127.0.0.1:3000"]

def test_can_access_resource_admin():
    admin = [RoleType.ADMIN.value]
    assert PermissionChecker.can_access_resource(
        admin, 2, 1, Permission.MODEL_UPDATE
    )

