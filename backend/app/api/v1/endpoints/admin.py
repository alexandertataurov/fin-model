from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

from app.core.dependencies import (
    UserWithPermissions,
    get_current_user_with_permissions,
    require_permissions,
)
from app.core.permissions import Permission
from app.models.base import get_db
from app.models.role import RoleType
from app.models.user import User
from app.models.file import UploadedFile, FileStatus
from app.models.audit import AuditLog
from app.models.parameter import Parameter
from app.models.system_log import SystemLog
from app.models.maintenance import MaintenanceSchedule
from app.services.system_log_service import SystemLogService
from app.services.maintenance_service import MaintenanceService
from app.models.financial import FinancialStatement
from app.schemas.user import (
    User as UserSchema,
    AdminUserUpdate,
    AdminUserCreate,
)
from app.services.auth_service import AuthService
from app.services.database_monitor import get_db_monitor
from app.services.file_service import FileService
from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from fastapi.responses import (
    JSONResponse,
    PlainTextResponse,
    StreamingResponse,
)
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, text
from uuid import uuid4
import asyncio
import json

router = APIRouter()


# Pydantic models for admin API
class SystemStatsResponse(BaseModel):
    users: Dict[str, int]
    files: Dict[str, int]
    financial_data: Dict[str, int]
    system: Dict[str, Any]
    performance: Dict[str, float]


class UserActivityResponse(BaseModel):
    user_id: int
    username: str
    last_login: Optional[datetime]
    login_count: int
    files_uploaded: int
    models_created: int
    is_active: bool


class SystemMetricsResponse(BaseModel):
    cpu_usage: Optional[float]
    memory_usage: Optional[float]
    disk_usage: Optional[float]
    active_connections: int
    request_count_24h: int
    error_rate_24h: float
    avg_response_time: float


class DataIntegrityResponse(BaseModel):
    table_name: str
    record_count: int
    last_updated: Optional[datetime]
    integrity_issues: List[str]
    recommendations: List[str]


class SecurityAuditResponse(BaseModel):
    failed_logins_24h: int
    suspicious_activities: List[Dict[str, Any]]
    rate_limit_violations: int
    password_policy_violations: int
    recommendations: List[str]


class MaintenanceScheduleItem(BaseModel):
    id: str
    name: str
    task: str  # cleanup|vacuum|archive|reindex|backup
    schedule: str  # e.g., "daily 02:00" or cron
    enabled: bool


class MaintenanceSchedules(BaseModel):
    items: List[MaintenanceScheduleItem]


class BackupResponse(BaseModel):
    job_id: str
    message: str


class ExportRequest(BaseModel):
    table: Optional[str] = None
    format: str = "json"  # json|csv


class ExportResponse(BaseModel):
    file_url: str
    message: str


class ReindexResponse(BaseModel):
    job_id: str
    message: str


class BulkUserActionRequest(BaseModel):
    user_ids: List[int]
    action: str


@router.get("/users/activity-list")
async def get_user_activity(
    request: Request,
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
    db: Session = Depends(get_db),
):
    """Get user activity statistics.

    Placed before dynamic '/users/{user_id}' route to avoid path conflicts.
    """
    try:
        query = db.query(User)
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
        if active_only_bool:
            query = query.filter(User.is_active.is_(True))

        users = query.order_by(desc(User.created_at)).limit(limit_val).all()

        activity_data: List[Dict[str, Any]] = []
        for user in users:
            # Count files uploaded by user
            files_uploaded = (
                db.query(UploadedFile)
                .filter(UploadedFile.uploaded_by_id == user.id)
                .count()
            )

            # Count financial statements/models created
            models_created = (
                db.query(FinancialStatement)
                .filter(FinancialStatement.created_by_id == user.id)
                .count()
            )

            activity_data.append(
                {
                    "user_id": user.id,
                    "username": user.username,
                    "last_login": (
                        user.last_login.isoformat() if user.last_login else None
                    ),
                    "login_count": 0,
                    "files_uploaded": files_uploaded,
                    "models_created": models_created,
                    "is_active": bool(user.is_active),
                }
            )

        return activity_data

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user activity: {str(e)}",
        )


@router.get("/users", response_model=Any)
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    envelope: bool = Query(False, description="Return pagination envelope"),
    current_user: User = Depends(require_permissions(Permission.USER_LIST)),
    db: Session = Depends(get_db),
) -> Any:
    """List all users (Admin only)."""
    auth_service = AuthService(db)

    # Get users with pagination
    base_query = db.query(User)
    total = base_query.count()
    users = base_query.offset(skip).limit(limit).all()

    # Add roles to each user
    users_with_roles = []
    for user in users:
        user_roles = auth_service.get_user_roles(user.id)
        user_dict = UserSchema.model_validate(user).model_dump()
        user_dict["roles"] = user_roles
        users_with_roles.append(user_dict)

    if envelope:
        return {
            "items": users_with_roles,
            "skip": skip,
            "limit": limit,
            "total": total,
        }
    return users_with_roles


@router.get("/users/{user_id}", response_model=Any)
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
    user_dict = UserSchema.model_validate(user).model_dump()
    user_dict["roles"] = user_roles

    return user_dict


@router.post(
    "/users",
    response_model=Any,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user_create: AdminUserCreate,
    current_user: User = Depends(require_permissions(Permission.USER_CREATE)),
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
    user_dict["roles"] = roles
    # Write audit (best-effort)
    try:
        db.add(
            AuditLog(
                user_id=current_user.id,
                action="PROFILE_UPDATED",
                resource="user",
                resource_id=str(created.id),
                details=f"Created user {created.username}",
                success="true",
            )
        )
        db.commit()
    except Exception:
        db.rollback()
    return user_dict


@router.put("/users/{user_id}", response_model=UserSchema)
def update_user(
    user_id: int,
    user_update: AdminUserUpdate,
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
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    # Audit user update
    try:
        db.add(
            AuditLog(
                user_id=current_user.id,
                action="PROFILE_UPDATED",
                resource="user",
                resource_id=str(user.id),
                details=f"Updated user {user.username}",
                success="true",
            )
        )
        db.commit()
    except Exception:
        db.rollback()

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

    db.commit()

    # Audit deactivate
    try:
        db.add(
            AuditLog(
                user_id=current_user.id,
                action="PROFILE_UPDATED",
                resource="user",
                resource_id=str(user.id),
                details=f"Deactivated user {user.username}",
                success="true",
            )
        )
        db.commit()
    except Exception:
        db.rollback()

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
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to assign role",
        )

    # Audit role assignment
    try:
        db.add(
            AuditLog(
                user_id=current_user.id,
                action="ROLE_ASSIGNED",
                resource="user",
                resource_id=str(user_id),
                details=f"Assigned role {role.value} to user {user_id}",
                success="true",
            )
        )
        db.commit()
    except Exception:
        db.rollback()

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
            UserRole.user_id == user_id,
            Role.name == role,
            UserRole.is_active.is_(True),
        )
        .first()
    )

    if user_role:
        user_role.is_active = False
        db.commit()

        # Audit role removal
        try:
            db.add(
                AuditLog(
                    user_id=current_user.id,
                    action="ROLE_REMOVED",
                    resource="user",
                    resource_id=str(user_id),
                    details=f"Removed role {role.value} from user {user_id}",
                    success="true",
                )
            )
            db.commit()
        except Exception:
            db.rollback()

    return {"message": f"Role {role.value} removed successfully"}


@router.get("/audit-logs")
def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    user_id: int = Query(None),
    action: str = Query(None),
    from_ts: Optional[datetime] = Query(None),
    to_ts: Optional[datetime] = Query(None),
    envelope: bool = Query(False, description="Return pagination envelope"),
    current_user: User = Depends(require_permissions(Permission.AUDIT_LOGS)),
    db: Session = Depends(get_db),
) -> Any:
    """Get audit logs (Admin only) from DB with filters and envelope."""
    try:
        query = db.query(AuditLog)

        if user_id is not None:
            query = query.filter(AuditLog.user_id == user_id)
        if action:
            query = query.filter(AuditLog.action == action)
        if from_ts:
            query = query.filter(AuditLog.created_at >= from_ts)
        if to_ts:
            query = query.filter(AuditLog.created_at <= to_ts)

        total = query.count()
        rows = query.order_by(desc(AuditLog.created_at)).offset(skip).limit(limit).all()

        items = []
        for r in rows:
            is_success = (r.success is True) or (
                isinstance(r.success, str) and r.success.lower() == "true"
            )
            items.append(
                {
                    "timestamp": r.created_at,
                    "level": "INFO" if is_success else "ERROR",
                    "module": r.resource or "system",
                    "action": r.action,
                    "user_id": r.user_id,
                    "message": r.details or "",
                }
            )

        if envelope:
            return {
                "items": items,
                "skip": skip,
                "limit": limit,
                "total": total,
            }
        return {"logs": items, "skip": skip, "limit": limit, "total": total}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get audit logs: {str(e)}",
        )


@router.get("/system/health")
def system_health(
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH)),
    db: Session = Depends(get_db),
) -> Any:
    """Get system health information."""
    from datetime import datetime

    # Get basic statistics
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active.is_(True)).count()
    verified_users = db.query(User).filter(User.is_verified.is_(True)).count()

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
    window: Optional[str] = Query(
        None, description="1h|24h|7d or custom analytics window"
    ),
    from_ts: Optional[datetime] = Query(None),
    to_ts: Optional[datetime] = Query(None),
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH)),
    db: Session = Depends(get_db),
):
    """
    Get database query performance analysis.

    Returns information about slow queries and performance metrics.
    """
    try:
        db_monitor = get_db_monitor(db)
        # Forward filters to monitor if supported (fallback to limit only)
        kwargs: Dict[str, Any] = {"limit": limit}
        if window:
            kwargs["window"] = window
        if from_ts:
            kwargs["from_ts"] = from_ts
        if to_ts:
            kwargs["to_ts"] = to_ts
        performance_data = db_monitor.get_query_performance(**kwargs)
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


@router.post("/database/backup", response_model=BackupResponse)
async def backup_database(
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    db: Session = Depends(get_db),
):
    """Trigger a database backup job (stubbed)."""
    job_id = str(uuid4())
    return BackupResponse(job_id=job_id, message="Backup job started")


@router.post("/database/export", response_model=ExportResponse)
async def export_database(
    payload: ExportRequest,
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    db: Session = Depends(get_db),
):
    """Export data (full or table). Returns file URL (stubbed)."""
    filename = (
        f"export_{payload.table or 'full'}_{payload.format}_"
        f"{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    )
    file_url = f"/downloads/{filename}.{payload.format}"
    return ExportResponse(file_url=file_url, message="Export generated")


@router.post("/database/reindex", response_model=ReindexResponse)
async def reindex_database(
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    db: Session = Depends(get_db),
):
    """Rebuild indexes (stubbed job)."""
    job_id = str(uuid4())
    return ReindexResponse(job_id=job_id, message="Reindex job started")


@router.get("/maintenance/schedules", response_model=MaintenanceSchedules)
async def get_maintenance_schedules(
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
    db: Session = Depends(get_db),
):
    rows = db.query(MaintenanceSchedule).order_by(MaintenanceSchedule.id).all()
    items = []
    for r in rows:
        items.append(
            MaintenanceScheduleItem(
                id=r.id,
                name=r.name,
                task=r.task,
                schedule=r.schedule,
                enabled=r.enabled,
            )
        )
    return MaintenanceSchedules(items=items)


@router.put("/maintenance/schedules", response_model=MaintenanceSchedules)
async def update_maintenance_schedules(
    schedules: MaintenanceSchedules,
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    db: Session = Depends(get_db),
):
    # Simple validation
    for item in schedules.items:
        allowed = {"cleanup", "vacuum", "archive", "reindex", "backup"}
        if item.task not in allowed:
            raise HTTPException(status_code=400, detail=f"Invalid task: {item.task}")
        if not item.schedule:
            raise HTTPException(status_code=400, detail="Schedule required")
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
    return await get_maintenance_schedules(current_user=current_user, db=db)


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
            "cleared_records": deleted_count,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear rate limits: {str(e)}",
        )


@router.get("/reports/overview")
async def get_admin_overview_report(
    format: str = Query("json", pattern="^(json|csv)$"),
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
    db: Session = Depends(get_db),
):
    """Generate an admin overview report in JSON or CSV.

    JSON returns a structured object; CSV returns a simple text/csv payload.
    """
    try:
        # Users
        total_users = db.query(User).count()
        active_users = db.query(User).filter(User.is_active.is_(True)).count()
        verified_users = db.query(User).filter(User.is_verified.is_(True)).count()

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
                "Content-Disposition": ("attachment; filename=admin_overview.csv")
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}",
        )


@router.get("/stats", response_model=SystemStatsResponse)
async def get_system_statistics(
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
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
            lambda: db.query(User).filter(User.is_verified.is_(True)).count()
        )
        new_users_24h = safe_count(
            lambda: db.query(User)
            .filter(User.created_at >= datetime.now(timezone.utc) - timedelta(hours=24))
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
        total_statements = safe_count(lambda: db.query(FinancialStatement).count())
        total_parameters = safe_count(lambda: db.query(Parameter).count())

        # Database size info
        try:
            db_size_query = (
                "SELECT pg_size_pretty(" "pg_database_size(current_database()))"
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
                "avg_file_size_mb": round((avg_file_size or 0) / (1024 * 1024), 2)
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


@router.get("/users/activity-list")
async def get_user_activity(
    request: Request,
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
    db: Session = Depends(get_db),
):
    """Get user activity statistics."""
    try:
        query = db.query(User)
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
        if active_only_bool:
            query = query.filter(User.is_active.is_(True))

        users = query.order_by(desc(User.created_at)).limit(limit_val).all()

        activity_data: List[Dict[str, Any]] = []
        for user in users:
            files_uploaded = (
                db.query(UploadedFile)
                .filter(UploadedFile.uploaded_by_id == user.id)
                .count()
            )
            models_created = (
                db.query(FinancialStatement)
                .filter(FinancialStatement.created_by_id == user.id)
                .count()
            )
            activity_data.append(
                {
                    "user_id": user.id,
                    "username": user.username,
                    "last_login": (
                        user.last_login.isoformat() if user.last_login else None
                    ),
                    "login_count": 0,
                    "files_uploaded": files_uploaded,
                    "models_created": models_created,
                    "is_active": bool(user.is_active),
                }
            )

        return activity_data

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user activity: {str(e)}",
        )


@router.get("/system/metrics", response_model=SystemMetricsResponse)
async def get_system_metrics(
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH)),
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
                "SELECT count(*) FROM pg_stat_activity " "WHERE state = 'active'"
            )
            active_connections_result = db.execute(text(active_sql)).scalar()
            active_connections = int(active_connections_result or 0)
        except Exception:
            active_connections = 0

        return SystemMetricsResponse(
            cpu_usage=cpu_usage,
            memory_usage=memory_usage,
            disk_usage=disk_usage,
            active_connections=active_connections,
            request_count_24h=0,  # Would need request tracking
            error_rate_24h=0.0,  # Would need error tracking
            avg_response_time=0.0,  # Would need response time tracking
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
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
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
            user_issues.append(f"{orphaned_files} files with invalid user references")
            user_recommendations.append("Run cleanup to remove orphaned file records")

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
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
    db: Session = Depends(get_db),
):
    """Get security audit information."""
    try:
        from app.core.rate_limiter import RateLimit

        # Check for rate limit violations (last 24h)
        start_time = (
            from_ts if from_ts else datetime.now(timezone.utc) - timedelta(hours=24)
        )
        end_time = to_ts if to_ts else datetime.now(timezone.utc)
        rate_limit_violations = (
            db.query(RateLimit)
            .filter(RateLimit.created_at >= start_time)
            .filter(RateLimit.created_at <= end_time)
            .count()
        )

        # Check for suspicious activities (simplified)
        suspicious_activities = []

        # Users with many failed login attempts would go here
        # For now, return empty list

        # Password policy violations (users without email verification)
        password_violations = db.query(User).filter(User.is_verified.is_(False)).count()

        recommendations = []
        if rate_limit_violations > 10:
            msg = "High number of rate limit violations - consider " "tightening limits"
            recommendations.append(msg)
        if password_violations > 0:
            recommendations.append(
                f"{password_violations} users have not verified their emails"
            )

        return SecurityAuditResponse(
            failed_logins_24h=0,
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
    current_user: User = Depends(require_permissions(Permission.ADMIN_WRITE)),
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
                    file_service.delete_file(file_record.file_path)
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
    current_user: User = Depends(require_permissions(Permission.ADMIN_WRITE)),
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

        affected_users = db.query(User).filter(User.id.in_(request.user_ids)).all()

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
                        msg = "Cannot deactivate your own account " f"(user {user.id})"
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


@router.get("/system/logs")
async def get_system_logs(
    level: str = Query("ERROR", pattern="^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$"),
    limit: int = Query(100, ge=1, le=1000),
    skip: int = Query(0, ge=0),
    from_ts: Optional[datetime] = Query(None, description="From timestamp"),
    to_ts: Optional[datetime] = Query(None, description="To timestamp"),
    search: Optional[str] = Query(None, description="Search message/module"),
    envelope: bool = Query(False, description="Return pagination envelope"),
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
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
    level: str = Query("ERROR", pattern="^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$"),
    from_ts: Optional[datetime] = Query(None),
    search: Optional[str] = Query(None),
    interval_ms: int = Query(1000, ge=250, le=5000),
    timeout_s: int = Query(30, ge=5, le=300),
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
    db: Session = Depends(get_db),
):
    """Server-Sent Events stream of system logs (polling-based)."""

    async def event_generator():
        end_time = datetime.now(timezone.utc) + timedelta(seconds=timeout_s)
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
                        (SystemLog.message.ilike(like)) | (SystemLog.module.ilike(like))
                    )
                q = q.filter(
                    SystemLog.level.in_(
                        [lvl for lvl, v in level_order.items() if v >= min_level]
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
                            "timestamp": r.timestamp.isoformat()
                            if r.timestamp
                            else None,
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

    return StreamingResponse(event_generator(), media_type="text/event-stream")
