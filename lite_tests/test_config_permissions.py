import sys
import types
from enum import Enum

# Create minimal RoleType enum so permissions logic can be imported without
# pulling in the full SQLAlchemy models which require heavy dependencies.
class RoleType(Enum):
    ADMIN = "admin"
    ANALYST = "analyst"
    VIEWER = "viewer"

fake_role = types.ModuleType("app.models.role")
fake_role.RoleType = RoleType
sys.modules.setdefault("app.models.role", fake_role)

from app.core.config import Settings
from app.core.permissions import (
    PermissionChecker,
    Permission,
    get_permission_description,
)


def test_get_cors_origins_parsing(monkeypatch):
    """Ensure CORS list parsing works even if other env vars are set."""
    monkeypatch.delenv("VIRUS_SCANNERS", raising=False)
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
