from enum import Enum as PyEnum
from typing import List, Set, Dict, Any
from app.models.role import RoleType


class Permission(PyEnum):
    # User Management
    USER_CREATE = "user:create"
    USER_READ = "user:read"
    USER_UPDATE = "user:update"
    USER_DELETE = "user:delete"
    USER_LIST = "user:list"

    # Role Management
    ROLE_ASSIGN = "role:assign"
    ROLE_REMOVE = "role:remove"
    ROLE_READ = "role:read"

    # Financial Models
    MODEL_CREATE = "model:create"
    MODEL_READ = "model:read"
    MODEL_UPDATE = "model:update"
    MODEL_DELETE = "model:delete"
    MODEL_LIST = "model:list"
    MODEL_EXECUTE = "model:execute"

    # Data Management
    DATA_UPLOAD = "data:upload"
    DATA_READ = "data:read"
    DATA_UPDATE = "data:update"
    DATA_DELETE = "data:delete"
    DATA_EXPORT = "data:export"

    # Reports
    REPORT_CREATE = "report:create"
    REPORT_READ = "report:read"
    REPORT_UPDATE = "report:update"
    REPORT_DELETE = "report:delete"
    REPORT_EXPORT = "report:export"

    # Dashboard
    DASHBOARD_READ = "dashboard:read"
    DASHBOARD_CUSTOMIZE = "dashboard:customize"

    # System Administration
    SYSTEM_SETTINGS = "system:settings"
    AUDIT_LOGS = "audit:logs"
    SYSTEM_HEALTH = "system:health"
    ADMIN_ACCESS = "admin:access"


# Role-based permission mapping
ROLE_PERMISSIONS: Dict[RoleType, Set[Permission]] = {
    RoleType.ADMIN: {
        # Full access to everything
        Permission.USER_CREATE,
        Permission.USER_READ,
        Permission.USER_UPDATE,
        Permission.USER_DELETE,
        Permission.USER_LIST,
        Permission.ROLE_ASSIGN,
        Permission.ROLE_REMOVE,
        Permission.ROLE_READ,
        Permission.MODEL_CREATE,
        Permission.MODEL_READ,
        Permission.MODEL_UPDATE,
        Permission.MODEL_DELETE,
        Permission.MODEL_LIST,
        Permission.MODEL_EXECUTE,
        Permission.DATA_UPLOAD,
        Permission.DATA_READ,
        Permission.DATA_UPDATE,
        Permission.DATA_DELETE,
        Permission.DATA_EXPORT,
        Permission.REPORT_CREATE,
        Permission.REPORT_READ,
        Permission.REPORT_UPDATE,
        Permission.REPORT_DELETE,
        Permission.REPORT_EXPORT,
        Permission.DASHBOARD_READ,
        Permission.DASHBOARD_CUSTOMIZE,
        Permission.SYSTEM_SETTINGS,
        Permission.AUDIT_LOGS,
        Permission.SYSTEM_HEALTH,
        Permission.ADMIN_ACCESS,
    },
    RoleType.ANALYST: {
        # Can work with models, data, and reports but limited user management
        Permission.USER_READ,  # Can see other users
        Permission.ROLE_READ,  # Can see roles
        Permission.MODEL_CREATE,
        Permission.MODEL_READ,
        Permission.MODEL_UPDATE,
        Permission.MODEL_DELETE,  # Can delete own models
        Permission.MODEL_LIST,
        Permission.MODEL_EXECUTE,
        Permission.DATA_UPLOAD,
        Permission.DATA_READ,
        Permission.DATA_UPDATE,
        Permission.DATA_DELETE,  # Can delete own data
        Permission.DATA_EXPORT,
        Permission.REPORT_CREATE,
        Permission.REPORT_READ,
        Permission.REPORT_UPDATE,
        Permission.REPORT_DELETE,  # Can delete own reports
        Permission.REPORT_EXPORT,
        Permission.DASHBOARD_READ,
        Permission.DASHBOARD_CUSTOMIZE,
    },
    RoleType.VIEWER: {
        # Read-only access to most content
        Permission.USER_READ,  # Limited to own profile
        Permission.ROLE_READ,
        Permission.MODEL_READ,
        Permission.MODEL_LIST,
        Permission.DATA_READ,
        Permission.DATA_EXPORT,  # Can export data for analysis
        Permission.REPORT_READ,
        Permission.REPORT_EXPORT,
        Permission.DASHBOARD_READ,
    },
}


class PermissionChecker:
    """Helper class for checking permissions."""

    @staticmethod
    def has_permission(user_roles: List[str], required_permission: Permission) -> bool:
        """Check if user roles have the required permission."""
        for role_str in user_roles:
            try:
                role = RoleType(role_str)
                if required_permission in ROLE_PERMISSIONS.get(role, set()):
                    return True
            except ValueError:
                continue
        return False

    @staticmethod
    def has_any_permission(
        user_roles: List[str], required_permissions: List[Permission]
    ) -> bool:
        """Check if user roles have any of the required permissions."""
        return any(
            PermissionChecker.has_permission(user_roles, perm)
            for perm in required_permissions
        )

    @staticmethod
    def has_all_permissions(
        user_roles: List[str], required_permissions: List[Permission]
    ) -> bool:
        """Check if user roles have all required permissions."""
        return all(
            PermissionChecker.has_permission(user_roles, perm)
            for perm in required_permissions
        )

    @staticmethod
    def get_user_permissions(user_roles: List[str]) -> Set[Permission]:
        """Get all permissions for user roles."""
        permissions = set()
        for role_str in user_roles:
            try:
                role = RoleType(role_str)
                permissions.update(ROLE_PERMISSIONS.get(role, set()))
            except ValueError:
                continue
        return permissions

    @staticmethod
    def can_access_resource(
        user_roles: List[str],
        resource_owner_id: int,
        current_user_id: int,
        required_permission: Permission,
    ) -> bool:
        """Check if user can access a resource, considering ownership."""
        # Admins can access everything
        if PermissionChecker.has_permission(
            user_roles, Permission.USER_DELETE
        ):  # Admin indicator
            return True

        # Users can access their own resources
        if resource_owner_id == current_user_id:
            return PermissionChecker.has_permission(user_roles, required_permission)

        # For other users' resources, need explicit permission
        # Analysts can read others' work, but viewers cannot
        if required_permission in [
            Permission.MODEL_READ,
            Permission.REPORT_READ,
            Permission.DATA_READ,
        ]:
            return PermissionChecker.has_permission(user_roles, required_permission)

        return False


def get_permission_description(permission: Permission) -> str:
    """Get human-readable description of permission."""
    descriptions = {
        Permission.USER_CREATE: "Create new user accounts",
        Permission.USER_READ: "View user profiles and information",
        Permission.USER_UPDATE: "Update user profiles and settings",
        Permission.USER_DELETE: "Delete user accounts",
        Permission.USER_LIST: "List all users in the system",
        Permission.ROLE_ASSIGN: "Assign roles to users",
        Permission.ROLE_REMOVE: "Remove roles from users",
        Permission.ROLE_READ: "View role information",
        Permission.MODEL_CREATE: "Create new financial models",
        Permission.MODEL_READ: "View financial models",
        Permission.MODEL_UPDATE: "Modify financial models",
        Permission.MODEL_DELETE: "Delete financial models",
        Permission.MODEL_LIST: "List available financial models",
        Permission.MODEL_EXECUTE: "Run financial model simulations",
        Permission.DATA_UPLOAD: "Upload data files",
        Permission.DATA_READ: "View data and datasets",
        Permission.DATA_UPDATE: "Modify data and datasets",
        Permission.DATA_DELETE: "Delete data and datasets",
        Permission.DATA_EXPORT: "Export data to external formats",
        Permission.REPORT_CREATE: "Create new reports",
        Permission.REPORT_READ: "View reports",
        Permission.REPORT_UPDATE: "Modify reports",
        Permission.REPORT_DELETE: "Delete reports",
        Permission.REPORT_EXPORT: "Export reports to external formats",
        Permission.DASHBOARD_READ: "View dashboards",
        Permission.DASHBOARD_CUSTOMIZE: "Customize dashboard layout",
        Permission.SYSTEM_SETTINGS: "Modify system settings",
        Permission.AUDIT_LOGS: "View system audit logs",
        Permission.SYSTEM_HEALTH: "View system health and metrics",
        Permission.ADMIN_ACCESS: "Access administrative functions",
    }
    return descriptions.get(permission, "Unknown permission")
