from typing import List, Callable, Any
from functools import wraps
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.base import get_db
from app.models.user import User
from app.models.role import RoleType
from app.services.auth_service import AuthService
from app.api.v1.endpoints.auth import get_current_active_user
from app.core.permissions import Permission, PermissionChecker


def require_permissions(*required_permissions: Permission):
    """Decorator to require specific permissions for an endpoint."""
    def permission_decorator(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
        auth_service = AuthService(db)
        user_roles = auth_service.get_user_roles(current_user.id)
        
        # Check if user has any of the required permissions
        if not PermissionChecker.has_any_permission(user_roles, list(required_permissions)):
            # Log permission denied
            auth_service.log_audit_action(
                user_id=current_user.id,
                action=auth_service.AuditAction.PERMISSION_DENIED,
                success="failure",
                details=f"Missing permissions: {[p.value for p in required_permissions]}"
            )
            auth_service.db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permissions: {[p.value for p in required_permissions]}"
            )
        
        return current_user
    
    return permission_decorator


def require_all_permissions(*required_permissions: Permission):
    """Decorator to require ALL specified permissions for an endpoint."""
    def permission_decorator(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
        auth_service = AuthService(db)
        user_roles = auth_service.get_user_roles(current_user.id)
        
        # Check if user has all required permissions
        if not PermissionChecker.has_all_permissions(user_roles, list(required_permissions)):
            # Log permission denied
            auth_service.log_audit_action(
                user_id=current_user.id,
                action=auth_service.AuditAction.PERMISSION_DENIED,
                success="failure",
                details=f"Missing permissions: {[p.value for p in required_permissions]}"
            )
            auth_service.db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permissions: {[p.value for p in required_permissions]}"
            )
        
        return current_user
    
    return permission_decorator


def require_role(*required_roles: RoleType):
    """Decorator to require specific roles for an endpoint."""
    def role_decorator(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
        auth_service = AuthService(db)
        user_roles = auth_service.get_user_roles(current_user.id)
        
        # Check if user has any of the required roles
        if not any(role.value in user_roles for role in required_roles):
            # Log permission denied
            auth_service.log_audit_action(
                user_id=current_user.id,
                action=auth_service.AuditAction.PERMISSION_DENIED,
                success="failure",
                details=f"Missing roles: {[r.value for r in required_roles]}"
            )
            auth_service.db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required roles: {[r.value for r in required_roles]}"
            )
        
        return current_user
    
    return role_decorator


def require_admin(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Dependency to require admin role."""
    auth_service = AuthService(db)
    user_roles = auth_service.get_user_roles(current_user.id)
    
    if RoleType.ADMIN.value not in user_roles:
        # Log permission denied
        auth_service.log_audit_action(
            user_id=current_user.id,
            action=auth_service.AuditAction.PERMISSION_DENIED,
            success="failure",
            details="Admin role required"
        )
        auth_service.db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    
    return current_user


def require_analyst_or_admin(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Dependency to require analyst or admin role."""
    auth_service = AuthService(db)
    user_roles = auth_service.get_user_roles(current_user.id)
    
    if not (RoleType.ANALYST.value in user_roles or RoleType.ADMIN.value in user_roles):
        # Log permission denied
        auth_service.log_audit_action(
            user_id=current_user.id,
            action=auth_service.AuditAction.PERMISSION_DENIED,
            success="failure",
            details="Analyst or Admin role required"
        )
        auth_service.db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Analyst or Admin privileges required"
        )
    
    return current_user


def check_resource_access(resource_owner_id: int, required_permission: Permission):
    """Check if current user can access a specific resource."""
    def access_checker(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
        auth_service = AuthService(db)
        user_roles = auth_service.get_user_roles(current_user.id)
        
        if not PermissionChecker.can_access_resource(
            user_roles, resource_owner_id, current_user.id, required_permission
        ):
            # Log permission denied
            auth_service.log_audit_action(
                user_id=current_user.id,
                action=auth_service.AuditAction.PERMISSION_DENIED,
                success="failure",
                details=f"Cannot access resource owned by user {resource_owner_id}"
            )
            auth_service.db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this resource"
            )
        
        return current_user
    
    return access_checker


class UserWithPermissions:
    """Enhanced user object with permission checking methods."""
    
    def __init__(self, user: User, db: Session):
        self.user = user
        self.db = db
        self._auth_service = AuthService(db)
        self._roles = None
        self._permissions = None
    
    @property
    def roles(self) -> List[str]:
        """Get user roles (cached)."""
        if self._roles is None:
            self._roles = self._auth_service.get_user_roles(self.user.id)
        return self._roles
    
    @property
    def permissions(self):
        """Get user permissions (cached)."""
        if self._permissions is None:
            self._permissions = PermissionChecker.get_user_permissions(self.roles)
        return self._permissions
    
    def has_permission(self, permission: Permission) -> bool:
        """Check if user has a specific permission."""
        return PermissionChecker.has_permission(self.roles, permission)
    
    def has_role(self, role: RoleType) -> bool:
        """Check if user has a specific role."""
        return role.value in self.roles
    
    def is_admin(self) -> bool:
        """Check if user is an admin."""
        return self.has_role(RoleType.ADMIN)
    
    def is_analyst(self) -> bool:
        """Check if user is an analyst."""
        return self.has_role(RoleType.ANALYST)
    
    def can_access_resource(self, resource_owner_id: int, required_permission: Permission) -> bool:
        """Check if user can access a resource."""
        return PermissionChecker.can_access_resource(
            self.roles, resource_owner_id, self.user.id, required_permission
        )


def get_current_user_with_permissions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> UserWithPermissions:
    """Get current user with permission checking capabilities."""
    return UserWithPermissions(current_user, db) 