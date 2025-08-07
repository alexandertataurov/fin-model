from typing import Any, Dict, List

from app.core.dependencies import (
    UserWithPermissions,
    get_current_user_with_permissions,
    require_permissions,
)
from app.core.permissions import Permission
from app.models.base import get_db
from app.models.role import RoleType
from app.models.user import User
from app.schemas.user import User as UserSchema
from app.schemas.user import UserUpdate, UserWithRoles
from app.services.auth_service import AuthService
from app.services.database_monitor import get_db_monitor
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/users", response_model=List[UserWithRoles])
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(require_permissions(Permission.USER_LIST)),
    db: Session = Depends(get_db),
) -> Any:
    """List all users (Admin only)."""
    auth_service = AuthService(db)

    # Get users with pagination
    users = db.query(User).offset(skip).limit(limit).all()

    # Add roles to each user
    users_with_roles = []
    for user in users:
        user_roles = auth_service.get_user_roles(user.id)
        user_dict = UserSchema.from_orm(user).dict()
        user_dict["roles"] = user_roles
        users_with_roles.append(UserWithRoles(**user_dict))

    return users_with_roles


@router.get("/users/{user_id}", response_model=UserWithRoles)
def get_user(
    user_id: int,
    current_user: User = Depends(require_permissions(Permission.USER_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """Get user by ID."""
    auth_service = AuthService(db)

    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Get user roles
    user_roles = auth_service.get_user_roles(user.id)
    user_dict = UserSchema.from_orm(user).dict()
    user_dict["roles"] = user_roles

    return UserWithRoles(**user_dict)


@router.put("/users/{user_id}", response_model=UserSchema)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(require_permissions(Permission.USER_UPDATE)),
    db: Session = Depends(get_db),
) -> Any:
    """Update user information."""
    auth_service = AuthService(db)

    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Update user fields
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    # Note: Audit logging removed in lean version
    db.commit()
    db.refresh(user)

    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(require_permissions(Permission.USER_DELETE)),
    db: Session = Depends(get_db),
) -> Any:
    """Delete user (Admin only)."""
    auth_service = AuthService(db)

    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account",
        )

    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Soft delete - deactivate user instead of actual deletion
    user.is_active = False

    # Note: Audit logging removed in lean version
    db.commit()

    return {"message": "User deactivated successfully"}


@router.post("/users/{user_id}/roles/{role}")
def assign_role(
    user_id: int,
    role: RoleType,
    current_user: User = Depends(require_permissions(Permission.ROLE_ASSIGN)),
    db: Session = Depends(get_db),
) -> Any:
    """Assign role to user."""
    auth_service = AuthService(db)

    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Check if user already has this role
    current_roles = auth_service.get_user_roles(user_id)
    if role.value in current_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User already has {role.value} role",
        )

    success = auth_service.assign_role(user_id, role, current_user.id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to assign role"
        )

    return {"message": f"Role {role.value} assigned successfully"}


@router.delete("/users/{user_id}/roles/{role}")
def remove_role(
    user_id: int,
    role: RoleType,
    current_user: User = Depends(require_permissions(Permission.ROLE_REMOVE)),
    db: Session = Depends(get_db),
) -> Any:
    """Remove role from user."""
    auth_service = AuthService(db)

    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Check if user has this role
    current_roles = auth_service.get_user_roles(user_id)
    if role.value not in current_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User does not have {role.value} role",
        )

    # Prevent removing the last role
    if len(current_roles) == 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove the last role from user",
        )

    # Find and deactivate the user role
    from app.models.role import Role, UserRole

    user_role = (
        db.query(UserRole)
        .join(Role)
        .filter(
            UserRole.user_id == user_id, Role.name == role, UserRole.is_active == True
        )
        .first()
    )

    if user_role:
        user_role.is_active = False

        # Note: Audit logging removed in lean version
        db.commit()

    return {"message": f"Role {role.value} removed successfully"}


@router.get("/audit-logs")
def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    user_id: int = Query(None),
    action: str = Query(None),
    current_user: User = Depends(require_permissions(Permission.AUDIT_LOGS)),
    db: Session = Depends(get_db),
) -> Any:
    """Get audit logs (Admin only)."""
    # Note: Audit logging removed in lean version
    return {"message": "Audit logging is not available in the lean version"}


@router.get("/system/health")
def system_health(
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH)),
    db: Session = Depends(get_db),
) -> Any:
    """Get system health information."""
    from datetime import datetime

    from sqlalchemy import func

    # Get basic statistics
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    verified_users = db.query(User).filter(User.is_verified == True).count()

    # Note: Audit logging removed in lean version
    recent_logins = 0
    recent_failed_logins = 0

    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "users": {
            "total": total_users,
            "active": active_users,
            "verified": verified_users,
        },
        "activity_24h": {
            "successful_logins": recent_logins,
            "failed_logins": recent_failed_logins,
        },
        "database": {"status": "connected"},
    }


@router.get("/permissions")
def get_user_permissions(
    user_with_perms: UserWithPermissions = Depends(get_current_user_with_permissions),
) -> Any:
    """Get current user's permissions."""
    return {
        "user_id": user_with_perms.user.id,
        "roles": user_with_perms.roles,
        "permissions": [p.value for p in user_with_perms.permissions],
        "is_admin": user_with_perms.is_admin(),
        "is_analyst": user_with_perms.is_analyst(),
    }


@router.get("/database/health", response_model=Dict[str, Any])
async def get_database_health(
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH)),
    db: Session = Depends(get_db),
):
    """
    Get comprehensive database health check.

    Returns detailed information about database status, connection pool,
    table statistics, and performance metrics.
    """
    try:
        db_monitor = get_db_monitor(db)
        health_data = db_monitor.get_health_check()
        return health_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get database health: {str(e)}",
        )


@router.get("/database/performance", response_model=List[Dict[str, Any]])
async def get_database_performance(
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH)),
    db: Session = Depends(get_db),
):
    """
    Get database query performance analysis.

    Returns information about slow queries and performance metrics.
    """
    try:
        db_monitor = get_db_monitor(db)
        performance_data = db_monitor.get_query_performance(limit=limit)
        return performance_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get performance data: {str(e)}",
        )


@router.get("/database/tables", response_model=Dict[str, Dict[str, Any]])
async def get_table_information(
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH)),
    db: Session = Depends(get_db),
):
    """
    Get detailed table size and usage information.
    """
    try:
        db_monitor = get_db_monitor(db)
        table_sizes = db_monitor.get_table_sizes()
        return table_sizes
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get table information: {str(e)}",
        )


@router.post("/database/cleanup", response_model=Dict[str, Any])
async def cleanup_database(
    dry_run: bool = Query(True, description="Whether to perform a dry run"),
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    db: Session = Depends(get_db),
):
    """
    Clean up stale database records based on retention policies.

    Use dry_run=false to actually perform the cleanup.
    """
    try:
        db_monitor = get_db_monitor(db)
        cleanup_results = db_monitor.cleanup_stale_data(dry_run=dry_run)
        return cleanup_results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cleanup database: {str(e)}",
        )


@router.post("/rate-limits/clear", response_model=Dict[str, Any])
def clear_rate_limits(
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    db: Session = Depends(get_db),
) -> Any:
    """Clear all rate limiting records to restore access."""
    try:
        from app.core.rate_limiter import RateLimit
        
        # Delete all rate limit records
        deleted_count = db.query(RateLimit).delete()
        db.commit()
        
        return {
            "message": "Rate limits cleared successfully",
            "cleared_records": deleted_count
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear rate limits: {str(e)}",
        )


@router.post("/dev-clear-rate-limits", response_model=Dict[str, Any])
def dev_clear_rate_limits(
    db: Session = Depends(get_db),
) -> Any:
    """Development only: Clear rate limiting records without authentication."""
    try:
        from app.core.rate_limiter import RateLimit
        
        # Delete all rate limit records
        deleted_count = db.query(RateLimit).delete()
        db.commit()
        
        return {
            "message": "Rate limits cleared successfully (dev endpoint)",
            "cleared_records": deleted_count
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear rate limits: {str(e)}",
        )
