from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.models.base import get_db
from app.models.user import User
from app.models.role import RoleType
from app.schemas.user import User as UserSchema, UserUpdate, UserWithRoles
from app.services.auth_service import AuthService
from app.core.dependencies import (
    require_admin,
    require_permissions,
    get_current_user_with_permissions,
    UserWithPermissions,
)
from app.core.permissions import Permission
from app.services.database_monitor import db_monitor

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

    # Log the update
    auth_service.log_audit_action(
        user_id=current_user.id,
        action=auth_service.AuditAction.PROFILE_UPDATED,
        success="success",
        details=f"Updated user {user_id}: {list(update_data.keys())}",
    )

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

    # Log the deletion
    auth_service.log_audit_action(
        user_id=current_user.id,
        action=auth_service.AuditAction.USER_DELETE,
        success="success",
        details=f"Deactivated user {user_id}",
    )

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
    from app.models.role import UserRole, Role

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

        # Log the role removal
        auth_service.log_audit_action(
            user_id=current_user.id,
            action=auth_service.AuditAction.ROLE_REMOVED,
            success="success",
            details=f"Removed {role.value} role from user {user_id}",
        )

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
    from app.models.audit import AuditLog, AuditAction

    query = db.query(AuditLog)

    # Filter by user_id if provided
    if user_id:
        query = query.filter(AuditLog.user_id == user_id)

    # Filter by action if provided
    if action:
        try:
            action_enum = AuditAction(action)
            query = query.filter(AuditLog.action == action_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid action: {action}",
            )

    # Order by most recent first
    query = query.order_by(AuditLog.created_at.desc())

    # Apply pagination
    audit_logs = query.offset(skip).limit(limit).all()

    return audit_logs


@router.get("/system/health")
def system_health(
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH)),
    db: Session = Depends(get_db),
) -> Any:
    """Get system health information."""
    from app.models.audit import AuditLog
    from sqlalchemy import func
    from datetime import datetime, timedelta

    # Get basic statistics
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    verified_users = db.query(User).filter(User.is_verified == True).count()

    # Get recent activity (last 24 hours)
    yesterday = datetime.utcnow() - timedelta(days=1)
    recent_logins = (
        db.query(AuditLog)
        .filter(
            AuditLog.action == "login",
            AuditLog.created_at >= yesterday,
            AuditLog.success == "success",
        )
        .count()
    )

    recent_failed_logins = (
        db.query(AuditLog)
        .filter(AuditLog.action == "failed_login", AuditLog.created_at >= yesterday)
        .count()
    )

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
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH))
):
    """
    Get comprehensive database health check.
    
    Returns detailed information about database status, connection pool,
    table statistics, and performance metrics.
    """
    try:
        health_data = db_monitor.get_health_check()
        return health_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get database health: {str(e)}"
        )


@router.get("/database/performance", response_model=List[Dict[str, Any]])
async def get_database_performance(
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH))
):
    """
    Get database query performance analysis.
    
    Returns information about slow queries and performance metrics.
    """
    try:
        performance_data = db_monitor.get_query_performance(limit=limit)
        return performance_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get performance data: {str(e)}"
        )


@router.get("/database/tables", response_model=Dict[str, Dict[str, Any]])
async def get_table_information(
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH))
):
    """
    Get detailed table size and usage information.
    """
    try:
        table_sizes = db_monitor.get_table_sizes()
        return table_sizes
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get table information: {str(e)}"
        )


@router.post("/database/cleanup", response_model=Dict[str, Any])
async def cleanup_database(
    dry_run: bool = Query(True, description="Whether to perform a dry run"),
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS))
):
    """
    Clean up stale database records based on retention policies.
    
    Use dry_run=false to actually perform the cleanup.
    """
    try:
        cleanup_results = db_monitor.cleanup_stale_data(dry_run=dry_run)
        return cleanup_results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cleanup database: {str(e)}"
        )
