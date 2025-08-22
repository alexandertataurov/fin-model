import pytest

from app.core.permissions import (
    Permission,
    PermissionChecker,
    ROLE_PERMISSIONS,
)
from app.models.role import RoleType


def test_role_permissions_mapping_contains_admin_critical_permissions():
    admin_perms = ROLE_PERMISSIONS[RoleType.ADMIN]
    assert Permission.ADMIN_ACCESS in admin_perms
    assert Permission.USER_DELETE in admin_perms
    assert Permission.REPORT_READ in admin_perms


def test_has_permission_any_all():
    roles = [RoleType.ADMIN.value]
    assert (
        PermissionChecker.has_permission(roles, Permission.USER_LIST)
        is True
    )
    assert (
        PermissionChecker.has_any_permission(
            roles, [Permission.USER_LIST, Permission.DATA_READ]
        )
        is True
    )
    assert (
        PermissionChecker.has_all_permissions(
            roles, [Permission.USER_LIST, Permission.DATA_READ]
        )
        is True
    )


def test_get_user_permissions_returns_union():
    roles = [RoleType.VIEWER.value, RoleType.ANALYST.value]
    perms = PermissionChecker.get_user_permissions(roles)
    # viewer has REPORT_READ, analyst has MODEL_CREATE
    assert Permission.REPORT_READ in perms
    assert Permission.MODEL_CREATE in perms


def test_can_access_resource_admin_and_ownership_rules():
    admin_roles = [RoleType.ADMIN.value]
    assert (
        PermissionChecker.can_access_resource(
            admin_roles,
            resource_owner_id=123,
            current_user_id=999,
            required_permission=Permission.DATA_READ,
        )
        is True
    )

    # Owner access requires the specific permission
    viewer_roles = [RoleType.VIEWER.value]
    can = PermissionChecker.can_access_resource(
        viewer_roles,
        resource_owner_id=7,
        current_user_id=7,
        required_permission=Permission.DATA_READ,
    )
    assert can is True

    # Viewer does not have MODEL_UPDATE; even as owner should be False
    can = PermissionChecker.can_access_resource(
        viewer_roles,
        resource_owner_id=7,
        current_user_id=7,
        required_permission=Permission.MODEL_UPDATE,
    )
    assert can is False
