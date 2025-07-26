from functools import wraps
from typing import Any, Callable, List, Set

from app.api.v1.endpoints.auth import get_current_active_user, get_current_user
from app.core.permissions import Permission, PermissionChecker
from app.models.audit import AuditAction
from app.models.base import get_db
from app.models.role import RoleType
from app.models.user import User
from app.services.auth_service import AuthService
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

def require_permissions(
    *required_permissions: Permission,
    unauthenticated_status: int = status.HTTP_401_UNAUTHORIZED,
):
    """Decorator to require specific permissions for an endpoint.

    ``unauthenticated_status`` controls the response code when no ``Authorization``
    header is provided. Standard API endpoints expect ``401 Unauthorized`` while
    some admin routes check for a ``403 Forbidden`` response.
    """

    security = HTTPBearer(auto_error=False)

    def permission_decorator(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: Session = Depends(get_db),
    ):
        # If no credentials were provided at all return the configured status
        # code. Admin endpoints pass ``403`` to mimic FastAPI's default
        # behaviour while most endpoints use ``401``.
        if credentials is None:
            raise HTTPException(
                status_code=unauthenticated_status,
                detail="Not authenticated",
            )

        # Manually resolve the user from the provided credentials so that we do
        # not trigger the 401 response from ``get_current_active_user`` when the
        # Authorization header is missing.
        current_user = get_current_user(credentials, db)
        if not current_user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
            )

        auth_service = AuthService(db)
        user_roles = auth_service.get_user_roles(current_user.id)
        if current_user.is_admin and RoleType.ADMIN.value not in user_roles:
            user_roles.append(RoleType.ADMIN.value)
        if not user_roles:
            user_roles.append(RoleType.VIEWER.value)

        # Check if user has any of the required permissions
        if not PermissionChecker.has_any_permission(
            user_roles, list(required_permissions)
        ):
            # Log permission denied
            auth_service.log_audit_action(
                user_id=current_user.id,
                action=AuditAction.PERMISSION_DENIED,
                success="failure",
                details=f"Missing permissions: {[p.value for p in required_permissions]}",
            )
            auth_service.db.commit()

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permissions: {[p.value for p in required_permissions]}",
            )

        return current_user

    return permission_decorator


def require_all_permissions(*required_permissions: Permission):
    """Decorator to require ALL specified permissions for an endpoint."""

    security = HTTPBearer(auto_error=False)

    def permission_decorator(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        current_user: User = Depends(get_current_active_user),
        db: Session = Depends(get_db),
    ):
        auth_service = AuthService(db)
        user_roles = auth_service.get_user_roles(current_user.id)

        # Check if user has all required permissions
        if not PermissionChecker.has_all_permissions(
            user_roles, list(required_permissions)
        ):
            # Log permission denied
            auth_service.log_audit_action(
                user_id=current_user.id,
                action=AuditAction.PERMISSION_DENIED,
                success="failure",
                details=f"Missing permissions: {[p.value for p in required_permissions]}",
            )
            auth_service.db.commit()

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permissions: {[p.value for p in required_permissions]}",
            )

        return current_user

    return permission_decorator


def require_role(required_role: RoleType):
    """Decorator to require a specific role for an endpoint."""
    security = HTTPBearer(auto_error=False)

    def role_decorator(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        current_user: User = Depends(get_current_active_user),
        db: Session = Depends(get_db),
    ):
        auth_service = AuthService(db)
        user_roles = auth_service.get_user_roles(current_user.id)

        # Check if user has the required role
        role_names = [role.value for role in user_roles]
        if required_role.value not in role_names:
            # Log permission denied
            auth_service.log_audit_action(
                user_id=current_user.id,
                action=AuditAction.PERMISSION_DENIED,
                success="failure",
                details=f"Missing required role: {required_role.value}",
            )
            auth_service.db.commit()

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required role: {required_role.value}",
            )

        return current_user

    return role_decorator

security_admin = HTTPBearer(auto_error=False)

security_admin = HTTPBearer(auto_error=False)


security_admin = HTTPBearer(auto_error=False)


security_admin = HTTPBearer(auto_error=False)


security_admin = HTTPBearer(auto_error=False)


def require_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security_admin),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Dependency to require admin role."""
    auth_service = AuthService(db)
    user_roles = auth_service.get_user_roles(current_user.id)
    if current_user.is_admin and RoleType.ADMIN.value not in user_roles:
        user_roles.append(RoleType.ADMIN.value)
    if not user_roles:
        user_roles.append(RoleType.VIEWER.value)

    # Check if user has admin role
    role_names = [role.value for role in user_roles]
    if RoleType.ADMIN.value not in role_names:
        # Log permission denied
        auth_service.log_audit_action(
            user_id=current_user.id,
            action=AuditAction.PERMISSION_DENIED,
            success="failure",
            details="Missing admin role",
        )
        auth_service.db.commit()

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required"
        )

    return current_user


class UserWithPermissions:
    """Class to hold user with their permissions for dependency injection."""

    def __init__(
        self, user: User, permissions: Set[Permission], user_roles: List[str] = None
    ):
        self.user = user
        self.permissions = permissions
        self._user_roles = user_roles or []

    @property
    def roles(self) -> List[str]:
        """Get user roles."""
        return self._user_roles

    def is_admin(self) -> bool:
        """Check if user is admin."""
        return Permission.ADMIN_ACCESS in self.permissions

    def is_analyst(self) -> bool:
        """Check if user is analyst."""
        return Permission.MODEL_CREATE in self.permissions and not self.is_admin()


def get_current_user_with_permissions(
    current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)
) -> UserWithPermissions:
    """Get current user with their permissions."""
    auth_service = AuthService(db)
    user_roles = auth_service.get_user_roles(current_user.id)
    permissions = PermissionChecker.get_user_permissions(user_roles)

    return UserWithPermissions(current_user, permissions, user_roles)


def require_resource_access(resource_type: str):
    """Decorator to require access to a specific resource type."""

    def resource_decorator(
        current_user: User = Depends(get_current_active_user),
        db: Session = Depends(get_db),
    ):
        auth_service = AuthService(db)
        user_roles = auth_service.get_user_roles(current_user.id)

        # Check resource-specific permissions based on the resource type
        required_permission = None
        if resource_type == "financial_model":
            required_permission = Permission.MODEL_READ
        elif resource_type == "analytics":
            required_permission = Permission.ANALYTICS_VIEW
        elif resource_type == "reports":
            required_permission = Permission.REPORT_VIEW
        else:
            # Default to general read permission
            required_permission = Permission.DATA_READ

        if not PermissionChecker.has_permission(user_roles, required_permission):
            # Log permission denied
            auth_service.log_audit_action(
                user_id=current_user.id,
                action=AuditAction.PERMISSION_DENIED,
                success="failure",
                details=f"Missing permission for resource type: {resource_type}",
            )
            auth_service.db.commit()

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied for resource: {resource_type}",
            )

        return current_user

    return resource_decorator


def check_resource_ownership(resource_id: int, resource_type: str):
    """Decorator to check if user owns the resource or has admin permissions."""

    def ownership_decorator(
        current_user: User = Depends(get_current_active_user),
        db: Session = Depends(get_db),
    ):
        auth_service = AuthService(db)
        user_roles = auth_service.get_user_roles(current_user.id)

        # Admins can access all resources
        role_names = [role.value for role in user_roles]
        if RoleType.ADMIN.value in role_names:
            return current_user

        # TODO: Implement resource ownership checking
        # This would involve checking if the user created/owns the specific resource
        # For now, we'll allow access if user has the required permissions

        required_permission = None
        if resource_type == "financial_model":
            required_permission = Permission.MODEL_READ
        elif resource_type == "analytics":
            required_permission = Permission.ANALYTICS_VIEW
        elif resource_type == "reports":
            required_permission = Permission.REPORT_VIEW
        else:
            required_permission = Permission.DATA_READ

        if not PermissionChecker.has_permission(user_roles, required_permission):
            # Log permission denied
            auth_service.log_audit_action(
                user_id=current_user.id,
                action=AuditAction.PERMISSION_DENIED,
                success="failure",
                details=f"Missing permission for resource {resource_type}:{resource_id}",
            )
            auth_service.db.commit()

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied for resource: {resource_type}:{resource_id}",
            )

        return current_user

    return ownership_decorator
