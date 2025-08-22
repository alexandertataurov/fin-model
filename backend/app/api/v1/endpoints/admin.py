import asyncio
import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Union

from app.core.dependencies import (
    UserWithPermissions,
    get_current_user_with_permissions,
    require_permissions,
)
from app.core.permissions import Permission
from app.models.audit import AuditLog
from app.models.base import get_db
from app.models.file import FileStatus, UploadedFile
from app.models.financial import FinancialStatement
from app.models.maintenance import MaintenanceSchedule
from app.models.parameter import Parameter
from app.models.role import RoleType
from app.models.system_log import SystemLog
from app.models.user import User
from app.schemas.user import AdminUserCreate, AdminUserUpdate
from app.schemas.user import User as UserSchema
from app.schemas.user import UserWithRoles
from app.services.audit_service import log_audit
from app.services.auth_service import AuthService
from app.services.file_service import FileService
from app.services.maintenance_service import MaintenanceService
from app.services.system_log_service import SystemLogService
from app.services import rate_limit_service
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Request,
    status,
)
from fastapi.responses import (
    JSONResponse,
    PlainTextResponse,
    StreamingResponse,
)
from pydantic import BaseModel
from app.schemas.admin import (
    SystemStatsResponse,
    SystemMetricsResponse,
    DataIntegrityResponse,
    SecurityAuditResponse,
    MaintenanceScheduleItem,
    MaintenanceSchedules,
)
from sqlalchemy import and_, desc, func, text
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

router = APIRouter()


class UserActivityResponse(BaseModel):
    user_id: int
    username: str
    last_login: Optional[datetime]
    login_count: int
    files_uploaded: int
    models_created: int
    is_active: bool


class BulkUserActionRequest(BaseModel):
    user_ids: List[int]
    action: str


class UserPermissionsResponse(BaseModel):
    user_id: int
    roles: List[str]
    permissions: List[str]
    is_admin: bool
    is_analyst: bool


@router.get(
    "/users/activity-list", response_model=List[UserActivityResponse]
)
async def get_user_activity(
    request: Request,
    limit: int = Query(50, ge=1, le=1000),
    active_only: bool = Query(False),
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_READ)
    ),
    db: Session = Depends(get_db),
):
    """Get user activity statistics.

    Placed before dynamic '/users/{user_id}' route to avoid path conflicts.
    """
    try:
        # Parse params defensively
        qp = request.query_params
        limit_raw = qp.get("limit")
        try:
            limit_val = int(limit_raw) if limit_raw is not None else 50
        except Exception:
            limit_val = 50
        active_raw = qp.get("active_only")
        active_only_bool = (
            str(active_raw).lower() in {"true", "1", "yes"}
            if active_raw is not None
            else False
        )

        # Aggregate counts using joins
        file_counts = (
            db.query(
                UploadedFile.user_id.label("user_id"),
                func.count(UploadedFile.id).label("files_uploaded"),
            )
            .group_by(UploadedFile.user_id)
            .subquery()
        )
        model_counts = (
            db.query(
                FinancialStatement.created_by_id.label("user_id"),
                func.count(FinancialStatement.id).label("models_created"),
            )
            .group_by(FinancialStatement.created_by_id)
            .subquery()
        )
        login_counts = (
            db.query(
                AuditLog.user_id.label("user_id"),
                func.count(AuditLog.id).label("login_count"),
            )
            .filter(AuditLog.action == "LOGIN", AuditLog.success == "true")
            .group_by(AuditLog.user_id)
            .subquery()
        )

        query = (
            db.query(
                User.id.label("user_id"),
                User.username,
                User.last_login,
                User.is_active,
                func.coalesce(file_counts.c.files_uploaded, 0).label(
                    "files_uploaded"
                ),
                func.coalesce(model_counts.c.models_created, 0).label(
                    "models_created"
                ),
                func.coalesce(login_counts.c.login_count, 0).label(
                    "login_count"
                ),
            )
            .outerjoin(file_counts, User.id == file_counts.c.user_id)
            .outerjoin(model_counts, User.id == model_counts.c.user_id)
            .outerjoin(login_counts, User.id == login_counts.c.user_id)
        )

        if active_only_bool:
            query = query.filter(User.is_active.is_(True))

        results = (
            query.order_by(desc(User.created_at)).limit(limit_val).all()
        )

        return [
            UserActivityResponse(
                user_id=row.user_id,
                username=row.username,
                last_login=row.last_login,
                login_count=row.login_count,
                files_uploaded=row.files_uploaded,
                models_created=row.models_created,
                is_active=bool(row.is_active),
            )
            for row in results
        ]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user activity: {str(e)}",
        )


@router.get(
    "/users",
    response_model=Union[List[UserWithRoles], Dict[str, Any]],
)
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    envelope: bool = Query(
        False, description="Return pagination envelope"
    ),
    is_active: Optional[bool] = Query(
        None, description="Filter by active"
    ),
    is_admin: Optional[bool] = Query(None, description="Filter by admin"),
    is_verified: Optional[bool] = Query(
        None, description="Filter verified"
    ),
    search: Optional[str] = Query(None, description="Search users"),
    created_after: Optional[datetime] = Query(
        None, description="Created after"
    ),
    created_before: Optional[datetime] = Query(
        None, description="Created before"
    ),
    current_user: User = Depends(
        require_permissions(Permission.USER_LIST)
    ),
    db: Session = Depends(get_db),
) -> Any:
    """List all users with advanced filtering (Admin only)."""
    from app.core.admin_exceptions import (
        create_pagination_response,
        handle_admin_error,
        validate_pagination_params,
    )

    try:
        # Validate pagination parameters
        validate_pagination_params(skip, limit)

        auth_service = AuthService(db)

        # Build filtered query
        base_query = db.query(User)

        # Apply filters
        if is_active is not None:
            base_query = base_query.filter(User.is_active == is_active)

        if is_admin is not None:
            base_query = base_query.filter(User.is_admin == is_admin)

        if is_verified is not None:
            base_query = base_query.filter(User.is_verified == is_verified)

        if search:
            search_term = f"%{search}%"
            base_query = base_query.filter(
                (User.username.ilike(search_term))
                | (User.email.ilike(search_term))
                | (User.full_name.ilike(search_term))
            )

        if created_after:
            base_query = base_query.filter(
                User.created_at >= created_after
            )

        if created_before:
            base_query = base_query.filter(
                User.created_at <= created_before
            )

        # Get total count before pagination
        total = base_query.count()

        # Apply pagination and ordering
        users = (
            base_query.order_by(desc(User.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

        # Add roles to each user
        users_with_roles: List[UserWithRoles] = []
        for user in users:
            user_roles = auth_service.get_user_roles(user.id)
            user_dict = UserSchema.model_validate(user).model_dump()
            users_with_roles.append(
                UserWithRoles(**user_dict, roles=user_roles)
            )

        # Return paginated response
        return create_pagination_response(
            items=users_with_roles,
            total=total,
            skip=skip,
            limit=limit,
            envelope=envelope,
        )

    except Exception as e:
        raise handle_admin_error(e, "list users", current_user.id)


@router.get("/users/{user_id}", response_model=UserWithRoles)
def get_user(
    user_id: int,
    current_user: User = Depends(
        require_permissions(Permission.USER_READ)
    ),
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
    user_dict = UserSchema.model_validate(user).model_dump()
    return UserWithRoles(**user_dict, roles=user_roles)


@router.post(
    "/users",
    response_model=UserWithRoles,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user_create: AdminUserCreate,
    current_user: User = Depends(
        require_permissions(Permission.USER_CREATE)
    ),
    db: Session = Depends(get_db),
) -> Any:
    """Create a new user (Admin only)."""
    auth_service = AuthService(db)

    created = auth_service.create_user(
        user_create,
        role=user_create.role or RoleType.VIEWER,
    )

    roles = auth_service.get_user_roles(created.id)
    user_dict = UserSchema.model_validate(created).model_dump()
    # Write audit (best-effort)
    log_audit(
        db,
        user_id=current_user.id,
        action="PROFILE_UPDATED",
        resource="user",
        resource_id=str(created.id),
        details=f"Created user {created.username}",
    )
    return UserWithRoles(**user_dict, roles=roles)


@router.put("/users/{user_id}", response_model=UserSchema)
def update_user(
    user_id: int,
    user_update: AdminUserUpdate,
    current_user: User = Depends(
        require_permissions(Permission.USER_UPDATE)
    ),
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
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    # Audit user update
    log_audit(
        db,
        user_id=current_user.id,
        action="PROFILE_UPDATED",
        resource="user",
        resource_id=str(user.id),
        details=f"Updated user {user.username}",
    )

    return user


@router.delete("/users/{user_id}", response_model=Dict[str, str])
def delete_user(
    user_id: int,
    current_user: User = Depends(
        require_permissions(Permission.USER_DELETE)
    ),
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

    db.commit()

    # Audit deactivate
    log_audit(
        db,
        user_id=current_user.id,
        action="PROFILE_UPDATED",
        resource="user",
        resource_id=str(user.id),
        details=f"Deactivated user {user.username}",
    )

    return {"message": "User deactivated successfully"}


@router.post(
    "/users/{user_id}/roles/{role}", response_model=Dict[str, str]
)
def assign_role(
    user_id: int,
    role: RoleType,
    current_user: User = Depends(
        require_permissions(Permission.ROLE_ASSIGN)
    ),
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
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to assign role",
        )

    # Audit role assignment
    log_audit(
        db,
        user_id=current_user.id,
        action="ROLE_ASSIGNED",
        resource="user",
        resource_id=str(user_id),
        details=f"Assigned role {role.value} to user {user_id}",
    )

    return {"message": f"Role {role.value} assigned successfully"}


@router.delete(
    "/users/{user_id}/roles/{role}", response_model=Dict[str, str]
)
def remove_role(
    user_id: int,
    role: RoleType,
    current_user: User = Depends(
        require_permissions(Permission.ROLE_REMOVE)
    ),
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
            UserRole.user_id == user_id,
            Role.name == role,
            UserRole.is_active.is_(True),
        )
        .first()
    )

    if user_role:
        user_role.is_active = False
        db.commit()
        log_audit(
            db,
            user_id=current_user.id,
            action="ROLE_REMOVED",
            resource="user",
            resource_id=str(user_id),
            details=f"Removed role {role.value} from user {user_id}",
        )

    return {"message": f"Role {role.value} removed successfully"}


@router.get("/audit-logs", response_model=Dict[str, Any])
def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    action: Optional[str] = Query(
        None, description="Filter by action type"
    ),
    resource: Optional[str] = Query(
        None, description="Filter by resource type"
    ),
    success: Optional[bool] = Query(
        None, description="Filter by success status"
    ),
    search: Optional[str] = Query(
        None, description="Search in details/message"
    ),
    from_ts: Optional[datetime] = Query(
        None, description="Start date filter"
    ),
    to_ts: Optional[datetime] = Query(None, description="End date filter"),
    envelope: bool = Query(
        False, description="Return pagination envelope"
    ),
    current_user: User = Depends(
        require_permissions(Permission.AUDIT_LOGS)
    ),
    db: Session = Depends(get_db),
) -> Any:
    """Get audit logs with advanced filtering (Admin only)."""
    from app.core.admin_exceptions import (
        create_pagination_response,
        handle_admin_error,
        validate_date_range,
        validate_pagination_params,
    )

    try:
        # Validate parameters
        validate_pagination_params(skip, limit)
        if from_ts or to_ts:
            from_ts_str = from_ts.isoformat() if from_ts else None
            to_ts_str = to_ts.isoformat() if to_ts else None
            validate_date_range(from_ts_str, to_ts_str)
        # Build filtered query
        query = db.query(AuditLog)

        # Apply filters
        if user_id is not None:
            query = query.filter(AuditLog.user_id == user_id)
        if action:
            query = query.filter(AuditLog.action == action)
        if resource:
            query = query.filter(AuditLog.resource == resource)
        if success is not None:
            success_str = "true" if success else "false"
            query = query.filter(AuditLog.success == success_str)
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (AuditLog.details.ilike(search_term))
                | (AuditLog.user_agent.ilike(search_term))
                | (AuditLog.ip_address.ilike(search_term))
            )
        if from_ts:
            query = query.filter(AuditLog.created_at >= from_ts)
        if to_ts:
            query = query.filter(AuditLog.created_at <= to_ts)

        # Get total count and apply pagination
        total = query.count()
        rows = (
            query.order_by(desc(AuditLog.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

        # Format audit log entries
        items = []
        for r in rows:
            is_success = (r.success is True) or (
                isinstance(r.success, str) and r.success.lower() == "true"
            )
            items.append(
                {
                    "id": r.id,
                    "timestamp": r.created_at,
                    "level": "INFO" if is_success else "ERROR",
                    "module": r.resource or "system",
                    "action": r.action,
                    "user_id": r.user_id,
                    "ip_address": r.ip_address,
                    "message": r.details or "",
                    "success": is_success,
                    "resource_id": r.resource_id,
                }
            )

        # Return paginated response
        if envelope:
            return create_pagination_response(
                items=items,
                total=total,
                skip=skip,
                limit=limit,
                envelope=True,
            )
        else:
            # Maintain backward compatibility
            return {
                "logs": items,
                "skip": skip,
                "limit": limit,
                "total": total,
            }

    except Exception as e:
        raise handle_admin_error(e, "get audit logs", current_user.id)


@router.get("/system/health", response_model=Dict[str, Any])
def system_health(
    current_user: User = Depends(
        require_permissions(Permission.SYSTEM_HEALTH)
    ),
    db: Session = Depends(get_db),
) -> Any:
    """Get system health information."""
    from datetime import datetime

    # Get basic statistics
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active.is_(True)).count()
    verified_users = (
        db.query(User).filter(User.is_verified.is_(True)).count()
    )

    # Note: Audit logging removed in lean version
    recent_failed_logins = 0

    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc),
        "users": {
            "total": total_users,
            "active": active_users,
            "verified": verified_users,
        },
        # Do not expose successful login counts
        "activity_24h": {
            "failed_logins": recent_failed_logins,
        },
        "database": {"status": "connected"},
    }


@router.get("/permissions", response_model=UserPermissionsResponse)
def get_user_permissions(
    user_with_perms: UserWithPermissions = Depends(
        get_current_user_with_permissions
    ),
) -> UserPermissionsResponse:
    """Get current user's permissions."""
    return UserPermissionsResponse(
        user_id=user_with_perms.user.id,
        roles=user_with_perms.roles,
        permissions=[p.value for p in user_with_perms.permissions],
        is_admin=user_with_perms.is_admin(),
        is_analyst=user_with_perms.is_analyst(),
    )


@router.get("/database/health", response_model=Dict[str, Any])
@router.get("/maintenance/schedules", response_model=MaintenanceSchedules)
async def get_maintenance_schedules(
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_READ)
    ),
    db: Session = Depends(get_db),
):
    try:
        maintenance_service = MaintenanceService(db)
        schedules = maintenance_service.get_all_schedules()
        items = [
            MaintenanceScheduleItem(
                id=str(s.id),
                name=s.name,
                task=s.task,
                schedule=s.schedule,
                enabled=s.enabled,
            )
            for s in schedules
        ]
        return MaintenanceSchedules(items=items)
    except Exception as e:
        logger.error(f"Failed to get maintenance schedules: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve maintenance schedules",
        )


@router.put("/maintenance/schedules", response_model=MaintenanceSchedules)
async def update_maintenance_schedules(
    schedules: MaintenanceSchedules,
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_ACCESS)
    ),
    db: Session = Depends(get_db),
):
    # Simple validation
    for item in schedules.items:
        allowed = {"cleanup", "vacuum", "archive", "reindex", "backup"}
        if item.task not in allowed:
            raise HTTPException(
                status_code=400, detail=f"Invalid task: {item.task}"
            )
        if not item.schedule:
            raise HTTPException(
                status_code=400, detail="Schedule required"
            )
    # Upsert schedules
    existing = {r.id: r for r in db.query(MaintenanceSchedule).all()}
    for item in schedules.items:
        row = existing.get(item.id)
        if not row:
            row = MaintenanceSchedule(
                id=item.id,
                name=item.name,
                task=item.task,
                schedule=item.schedule,
                enabled=item.enabled,
            )
            db.add(row)
        else:
            row.name = item.name
            row.task = item.task
            row.schedule = item.schedule
            row.enabled = item.enabled
    # Delete removed
    keep_ids = {i.id for i in schedules.items}
    for row in db.query(MaintenanceSchedule).all():
        if row.id not in keep_ids:
            db.delete(row)
    db.commit()
    return await get_maintenance_schedules(
        current_user=current_user, db=db
    )


@router.get("/maintenance/tasks/{task_id}", response_model=Dict[str, Any])
async def get_maintenance_task_status(
    task_id: str,
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_READ)
    ),
):
    """Get the status of a maintenance task."""
    from app.tasks.maintenance import get_task_status

    try:
        status = get_task_status(task_id)
        return status
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get task status: {str(e)}",
        )


@router.post("/rate-limits/clear", response_model=Dict[str, Any])
def clear_rate_limits(
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_ACCESS)
    ),
    db: Session = Depends(get_db),
) -> Any:
    """Clear all rate limiting records to restore access."""
    return rate_limit_service.clear_rate_limits(db)


@router.get("/reports/overview", response_model=Dict[str, Any])
async def get_admin_overview_report(
    format: str = Query("json", pattern="^(json|csv)$"),
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_READ)
    ),
    db: Session = Depends(get_db),
):
    """Generate an admin overview report in JSON or CSV.

    JSON returns a structured object; CSV returns a simple text/csv payload.
    """
    try:
        # Users
        total_users = db.query(User).count()
        active_users = (
            db.query(User).filter(User.is_active.is_(True)).count()
        )
        verified_users = (
            db.query(User).filter(User.is_verified.is_(True)).count()
        )

        # Files
        total_files = db.query(UploadedFile).count()
        failed_files = (
            db.query(UploadedFile)
            .filter(UploadedFile.status == FileStatus.FAILED.value)
            .count()
        )

        # Financial
        total_statements = db.query(FinancialStatement).count()
        total_parameters = db.query(Parameter).count()

        summary = {
            "users": {
                "total": total_users,
                "active": active_users,
                "verified": verified_users,
            },
            "files": {
                "total": total_files,
                "failed": failed_files,
            },
            "financial": {
                "statements": total_statements,
                "parameters": total_parameters,
            },
            "generated_at": datetime.now(timezone.utc)
            .isoformat()
            .replace("+00:00", "Z"),
        }

        if format == "json":
            return JSONResponse(content=summary)

        lines = [
            "section,key,value",
            f"users,total,{total_users}",
            f"users,active,{active_users}",
            f"users,verified,{verified_users}",
            f"files,total,{total_files}",
            f"files,failed,{failed_files}",
            f"financial,statements,{total_statements}",
            f"financial,parameters,{total_parameters}",
        ]
        csv_text = "\n".join(lines) + "\n"
        return PlainTextResponse(
            content=csv_text,
            media_type="text/csv",
            headers={
                "Content-Disposition": (
                    "attachment; filename=admin_overview.csv"
                )
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}",
        )


@router.get("/stats", response_model=SystemStatsResponse)
async def get_system_statistics(
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_READ)
    ),
    db: Session = Depends(get_db),
):
    """Get comprehensive system statistics."""
    try:
        # User statistics (robust to failures)
        def safe_count(query_func, default: int = 0) -> int:
            try:
                return int(query_func())
            except Exception:
                return default

        total_users = safe_count(lambda: db.query(User).count())
        active_users = safe_count(
            lambda: db.query(User).filter(User.is_active.is_(True)).count()
        )
        verified_users = safe_count(
            lambda: db.query(User)
            .filter(User.is_verified.is_(True))
            .count()
        )
        new_users_24h = safe_count(
            lambda: db.query(User)
            .filter(
                User.created_at
                >= datetime.now(timezone.utc) - timedelta(hours=24)
            )
            .count()
        )

        # File statistics
        total_files = safe_count(lambda: db.query(UploadedFile).count())
        completed_files = safe_count(
            lambda: db.query(UploadedFile)
            .filter(UploadedFile.status == FileStatus.COMPLETED.value)
            .count()
        )
        processing_files = safe_count(
            lambda: db.query(UploadedFile)
            .filter(UploadedFile.status == FileStatus.PROCESSING.value)
            .count()
        )
        failed_files = safe_count(
            lambda: db.query(UploadedFile)
            .filter(UploadedFile.status == FileStatus.FAILED.value)
            .count()
        )

        # Financial data statistics
        total_statements = safe_count(
            lambda: db.query(FinancialStatement).count()
        )
        total_parameters = safe_count(lambda: db.query(Parameter).count())

        # Database size info
        try:
            db_size_query = (
                "SELECT pg_size_pretty("
                "pg_database_size(current_database()))"
            )
            db_size_result = db.execute(text(db_size_query)).scalar()
            db_size = db_size_result if db_size_result else "Unknown"
        except Exception:
            db_size = "Unknown"

        # Performance metrics (simplified)
        # Average file size not essential in lean context; fall back to 0
        avg_file_size = 0

        return SystemStatsResponse(
            users={
                "total": total_users,
                "active": active_users,
                "verified": verified_users,
                "new_24h": new_users_24h,
            },
            files={
                "total": total_files,
                "completed": completed_files,
                "processing": processing_files,
                "failed": failed_files,
            },
            financial_data={
                "statements": total_statements,
                "parameters": total_parameters,
            },
            system={
                "database_size": db_size,
                "timestamp": datetime.now(timezone.utc),
            },
            performance={
                "avg_file_size_mb": round(
                    (avg_file_size or 0) / (1024 * 1024), 2
                )
            },
        )

    except Exception:
        # Graceful fallback instead of 500
        return SystemStatsResponse(
            users={"total": 0, "active": 0, "verified": 0, "new_24h": 0},
            files={
                "total": 0,
                "completed": 0,
                "processing": 0,
                "failed": 0,
            },
            financial_data={"statements": 0, "parameters": 0},
            system={
                "database_size": "Unknown",
                "timestamp": datetime.now(timezone.utc),
            },
            performance={"avg_file_size_mb": 0.0},
        )


@router.get("/system/metrics", response_model=SystemMetricsResponse)
async def get_system_metrics(
    current_user: User = Depends(
        require_permissions(Permission.SYSTEM_HEALTH)
    ),
    db: Session = Depends(get_db),
):
    """Get real-time system performance metrics."""
    try:
        import psutil

        # System metrics
        cpu_usage = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        memory_usage = memory.percent
        disk = psutil.disk_usage("/")
        disk_usage = disk.percent

        # Database connections (simplified)
        try:
            active_sql = (
                "SELECT count(*) FROM pg_stat_activity "
                "WHERE state = 'active'"
            )
            active_connections_result = db.execute(
                text(active_sql)
            ).scalar()
            active_connections = int(active_connections_result or 0)
        except Exception:
            active_connections = 0

        # Calculate real metrics from audit logs (last 24 hours)
        from datetime import datetime, timedelta, timezone

        twenty_four_hours_ago = datetime.now(timezone.utc) - timedelta(
            hours=24
        )

        # Count successful requests (logins, etc.) in last 24h
        request_count_24h = (
            db.query(AuditLog)
            .filter(
                AuditLog.created_at >= twenty_four_hours_ago,
                AuditLog.success == "true",
            )
            .count()
        )

        # Calculate error rate from failed operations
        total_requests = (
            db.query(AuditLog)
            .filter(AuditLog.created_at >= twenty_four_hours_ago)
            .count()
        )

        failed_requests = (
            db.query(AuditLog)
            .filter(
                AuditLog.created_at >= twenty_four_hours_ago,
                AuditLog.success == "false",
            )
            .count()
        )

        error_rate_24h = (
            (failed_requests / total_requests * 100)
            if total_requests > 0
            else 0.0
        )

        # Estimate avg response time (simplified - could be)
        # enhanced with actual middleware timing
        avg_response_time = 0.15 if total_requests > 0 else 0.0

        return SystemMetricsResponse(
            cpu_usage=cpu_usage,
            memory_usage=memory_usage,
            disk_usage=disk_usage,
            active_connections=active_connections,
            request_count_24h=request_count_24h,
            error_rate_24h=error_rate_24h,
            avg_response_time=avg_response_time,
        )

    except ImportError:
        # psutil not available, return basic info
        return SystemMetricsResponse(
            cpu_usage=None,
            memory_usage=None,
            disk_usage=None,
            active_connections=0,
            request_count_24h=0,
            error_rate_24h=0.0,
            avg_response_time=0.0,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get system metrics: {str(e)}",
        )


@router.get("/data/integrity", response_model=List[DataIntegrityResponse])
async def check_data_integrity(
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_READ)
    ),
    db: Session = Depends(get_db),
):
    """Check data integrity across all tables."""
    try:
        integrity_checks = []

        # Check users table
        user_count = db.query(User).count()
        # Orphaned files (no matching user)
        orphaned_files = (
            db.query(UploadedFile)
            .outerjoin(User, UploadedFile.user_id == User.id)
            .filter(User.id.is_(None))
            .count()
        )

        user_issues = []
        user_recommendations = []
        if orphaned_files > 0:
            user_issues.append(
                f"{orphaned_files} files with invalid user references"
            )
            user_recommendations.append(
                "Run cleanup to remove orphaned file records"
            )

        integrity_checks.append(
            DataIntegrityResponse(
                table_name="users",
                record_count=user_count,
                last_updated=datetime.now(timezone.utc),
                integrity_issues=user_issues,
                recommendations=user_recommendations,
            )
        )

        # Check files table
        file_count = db.query(UploadedFile).count()
        file_issues = []
        file_recommendations = []

        # Check for files with inconsistent status
        inconsistent_files = (
            db.query(UploadedFile)
            .filter(
                and_(
                    UploadedFile.status == FileStatus.COMPLETED.value,
                    UploadedFile.is_valid.is_(False),
                )
            )
            .count()
        )

        if inconsistent_files > 0:
            file_issues.append(
                f"{inconsistent_files} files marked as completed but invalid"
            )
            file_recommendations.append(
                "Review and reprocess files with inconsistent status"
            )

        integrity_checks.append(
            DataIntegrityResponse(
                table_name="uploaded_files",
                record_count=file_count,
                last_updated=datetime.now(timezone.utc),
                integrity_issues=file_issues,
                recommendations=file_recommendations,
            )
        )

        # Check financial statements
        statement_count = db.query(FinancialStatement).count()
        statement_issues = []
        statement_recommendations = []

        # Check for statements with missing line items
        empty_statements = (
            db.query(FinancialStatement)
            .filter(FinancialStatement.line_items.is_(None))
            .count()
        )

        if empty_statements > 0:
            statement_issues.append(
                f"{empty_statements} statements with missing line items"
            )
            statement_recommendations.append(
                "Review and populate missing financial data"
            )

        integrity_checks.append(
            DataIntegrityResponse(
                table_name="financial_statements",
                record_count=statement_count,
                last_updated=datetime.now(timezone.utc),
                integrity_issues=statement_issues,
                recommendations=statement_recommendations,
            )
        )

        return integrity_checks

    except Exception as e:
        # Graceful fallback: return error information within response
        return [
            DataIntegrityResponse(
                table_name="system",
                record_count=0,
                last_updated=datetime.now(timezone.utc),
                integrity_issues=[f"error: {str(e)}"],
                recommendations=["Check database schema and permissions"],
            )
        ]


@router.get("/security/audit", response_model=SecurityAuditResponse)
async def get_security_audit(
    from_ts: Optional[datetime] = Query(None),
    to_ts: Optional[datetime] = Query(None),
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_READ)
    ),
    db: Session = Depends(get_db),
):
    """Get security audit information."""
    try:
        from app.core.rate_limiter import RateLimit

        # Check for rate limit violations (last 24h)
        start_time = (
            from_ts
            if from_ts
            else datetime.now(timezone.utc) - timedelta(hours=24)
        )
        end_time = to_ts if to_ts else datetime.now(timezone.utc)
        rate_limit_violations = (
            db.query(RateLimit)
            .filter(RateLimit.created_at >= start_time)
            .filter(RateLimit.created_at <= end_time)
            .count()
        )

        # Get real failed login count from audit logs
        failed_logins_24h = (
            db.query(AuditLog)
            .filter(
                AuditLog.action == "FAILED_LOGIN",
                AuditLog.created_at >= start_time,
                AuditLog.created_at <= end_time,
            )
            .count()
        )

        # Check for suspicious activities
        suspicious_activities = []

        # Find users with multiple failed login attempts
        failed_login_users = (
            db.query(
                AuditLog.user_id,
                func.count(AuditLog.id).label("fail_count"),
            )
            .filter(
                AuditLog.action == "FAILED_LOGIN",
                AuditLog.created_at >= start_time,
                AuditLog.created_at <= end_time,
            )
            .group_by(AuditLog.user_id)
            .having(func.count(AuditLog.id) >= 5)
            .all()
        )

        for user_id, fail_count in failed_login_users:
            user = db.query(User).filter(User.id == user_id).first()
            username = user.username if user else f"user_id:{user_id}"
            suspicious_activities.append(
                {
                    "type": "multiple_failed_logins",
                    "description": (
                        f"User {username} has {fail_count} failed login attempts"
                    ),
                    "severity": "high" if fail_count >= 10 else "medium",
                    "user_id": user_id,
                }
            )

        # Find suspicious IP patterns (multiple accounts from same IP)
        suspicious_ips = (
            db.query(
                AuditLog.ip_address,
                func.count(func.distinct(AuditLog.user_id)).label(
                    "user_count"
                ),
            )
            .filter(
                AuditLog.created_at >= start_time,
                AuditLog.created_at <= end_time,
                AuditLog.ip_address.isnot(None),
            )
            .group_by(AuditLog.ip_address)
            .having(func.count(func.distinct(AuditLog.user_id)) >= 5)
            .all()
        )

        for ip_address, user_count in suspicious_ips:
            suspicious_activities.append(
                {
                    "type": "multiple_users_same_ip",
                    "description": (
                        f"IP {ip_address} used by {user_count} different users"
                    ),
                    "severity": "medium",
                    "ip_address": ip_address,
                }
            )

        # Password policy violations (users without email verification)
        password_violations = (
            db.query(User).filter(User.is_verified.is_(False)).count()
        )

        recommendations = []
        if rate_limit_violations > 10:
            msg = (
                "High number of rate limit violations - consider "
                "tightening limits"
            )
            recommendations.append(msg)
        if password_violations > 0:
            recommendations.append(
                f"{password_violations} users have not verified their emails"
            )

        return SecurityAuditResponse(
            failed_logins_24h=failed_logins_24h,
            suspicious_activities=suspicious_activities,
            rate_limit_violations=rate_limit_violations,
            password_policy_violations=password_violations,
            recommendations=recommendations,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get security audit: {str(e)}",
        )


@router.post("/files/cleanup", response_model=Dict[str, Any])
async def cleanup_orphaned_files(
    dry_run: bool = Query(True),
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_WRITE)
    ),
    db: Session = Depends(get_db),
):
    """Clean up orphaned or invalid files."""
    try:
        file_service = FileService(db)

        # Find files to clean up
        orphaned_files = (
            db.query(UploadedFile)
            .filter(~UploadedFile.uploaded_by_id.in_(db.query(User.id)))
            .all()
        )

        failed_files = (
            db.query(UploadedFile)
            .filter(
                and_(
                    UploadedFile.status == FileStatus.FAILED.value,
                    UploadedFile.created_at
                    < datetime.now(timezone.utc) - timedelta(days=7),
                )
            )
            .all()
        )

        files_to_cleanup = orphaned_files + failed_files
        cleanup_count = len(files_to_cleanup)

        if not dry_run:
            for file_record in files_to_cleanup:
                # Delete actual file from storage if it exists
                try:
                    file_service.delete_file(file_record.id, current_user)
                except Exception:
                    pass  # File might not exist

                # Delete database record
                db.delete(file_record)

            db.commit()

        return {
            "message": (
                f"{'Would cleanup' if dry_run else 'Cleaned up'} "
                f"{cleanup_count} files"
            ),
            "orphaned_files": len(orphaned_files),
            "failed_files": len(failed_files),
            "dry_run": dry_run,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cleanup files: {str(e)}",
        )


@router.post("/users/bulk-action", response_model=Dict[str, Any])
async def bulk_user_action(
    request: BulkUserActionRequest,
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_WRITE)
    ),
    db: Session = Depends(get_db),
):
    """Perform bulk actions on users."""
    try:
        if request.action not in {
            "activate",
            "deactivate",
            "verify",
            "send_reminder",
        }:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid action",
            )

        affected_users = (
            db.query(User).filter(User.id.in_(request.user_ids)).all()
        )

        if not affected_users:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No users found with provided IDs",
            )

        results = {"success": 0, "failed": 0, "errors": []}

        for user in affected_users:
            try:
                if request.action == "activate":
                    user.is_active = True
                elif request.action == "deactivate":
                    if user.id == current_user.id:
                        results["failed"] += 1
                        msg = (
                            "Cannot deactivate your own account "
                            f"(user {user.id})"
                        )
                        results["errors"].append(msg)
                        continue
                    user.is_active = False
                elif request.action == "verify":
                    user.is_verified = True
                elif request.action == "send_reminder":
                    # Would send email reminder - for now just log
                    pass

                results["success"] += 1

            except Exception as e:
                results["failed"] += 1
                results["errors"].append(
                    f"Failed to {request.action} user {user.id}: {str(e)}"
                )

        db.commit()

        return {
            "message": f"Bulk action '{request.action}' completed",
            "results": results,
            "total_users": len(request.user_ids),
        }

    except HTTPException as e:
        # Re-raise HTTP errors like invalid action (400) without converting
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to perform bulk action: {str(e)}",
        )


@router.get(
    "/system/logs",
    response_model=Union[List[Dict[str, Any]], Dict[str, Any]],
)
async def get_system_logs(
    level: str = Query(
        "ERROR", pattern="^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$"
    ),
    limit: int = Query(100, ge=1, le=1000),
    skip: int = Query(0, ge=0),
    from_ts: Optional[datetime] = Query(
        None, description="From timestamp"
    ),
    to_ts: Optional[datetime] = Query(None, description="To timestamp"),
    search: Optional[str] = Query(
        None, description="Search message/module"
    ),
    envelope: bool = Query(
        False, description="Return pagination envelope"
    ),
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_READ)
    ),
    db: Session = Depends(get_db),
):
    """Get system logs from DB with filters and optional envelope."""
    try:
        log_service = SystemLogService(db)
        items = log_service.get_logs(
            level=level,
            limit=limit,
            skip=skip,
            from_ts=from_ts,
            to_ts=to_ts,
            search=search,
        )

        if envelope:
            total = log_service.get_log_count(level)
            return {
                "items": items,
                "skip": skip,
                "limit": limit,
                "total": total,
            }
        return items
    except Exception:
        # Graceful fallback: return empty results to avoid 500s in admin UI
        empty = {"items": [], "skip": skip, "limit": limit, "total": 0}
        return empty if envelope else []


@router.get("/system/logs/stream")
async def stream_system_logs(
    level: str = Query(
        "ERROR", pattern="^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$"
    ),
    from_ts: Optional[datetime] = Query(None),
    search: Optional[str] = Query(None),
    interval_ms: int = Query(1000, ge=250, le=5000),
    timeout_s: int = Query(30, ge=5, le=300),
    current_user: User = Depends(
        require_permissions(Permission.ADMIN_READ)
    ),
    db: Session = Depends(get_db),
):
    """Server-Sent Events stream of system logs (polling-based)."""

    async def event_generator():
        end_time = datetime.now(timezone.utc) + timedelta(
            seconds=timeout_s
        )
        last_id: int | None = None
        level_order = {"INFO": 1, "WARNING": 2, "ERROR": 3, "CRITICAL": 4}
        min_level = 1 if level == "DEBUG" else level_order.get(level, 1)
        while datetime.now(timezone.utc) < end_time:
            try:
                q = db.query(SystemLog)
                if from_ts:
                    q = q.filter(SystemLog.timestamp >= from_ts)
                if search:
                    like = f"%{search}%"
                    q = q.filter(
                        (SystemLog.message.ilike(like))
                        | (SystemLog.module.ilike(like))
                    )
                q = q.filter(
                    SystemLog.level.in_(
                        [
                            lvl
                            for lvl, v in level_order.items()
                            if v >= min_level
                        ]
                    )
                )
                if last_id is not None:
                    q = q.filter(SystemLog.id > last_id)
                rows = q.order_by(SystemLog.id.asc()).limit(100).all()
                if rows:
                    last_id = rows[-1].id
                    for r in rows:
                        payload = {
                            "id": r.id,
                            "timestamp": (
                                r.timestamp.isoformat()
                                if r.timestamp
                                else None
                            ),
                            "level": r.level,
                            "module": r.module,
                            "message": r.message,
                            "user_id": r.user_id,
                        }
                        yield f"data: {json.dumps(payload)}\n\n"
            except Exception:
                # swallow errors; continue streaming best-effort
                pass
            await asyncio.sleep(interval_ms / 1000)

    return StreamingResponse(
        event_generator(), media_type="text/event-stream"
    )
