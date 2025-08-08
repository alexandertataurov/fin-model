from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
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
from app.models.parameter import Parameter
from app.models.financial import FinancialStatement
from app.schemas.user import (
    User as UserSchema,
    UserWithRoles,
    AdminUserUpdate,
    AdminUserCreate,
)
from app.services.auth_service import AuthService
from app.services.database_monitor import get_db_monitor
from app.services.file_service import FileService
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, text

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


class BulkUserActionRequest(BaseModel):
    user_ids: List[int]
    action: str


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


@router.post(
    "/users", response_model=UserWithRoles, status_code=status.HTTP_201_CREATED
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
    user_dict = UserSchema.from_orm(created).dict()
    user_dict["roles"] = roles
    return UserWithRoles(**user_dict)


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

    # Get basic statistics
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active.is_(True)).count()
    verified_users = db.query(User).filter(User.is_verified.is_(True)).count()

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
            "cleared_records": deleted_count,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear rate limits: {str(e)}",
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
            .filter(User.created_at >= datetime.utcnow() - timedelta(hours=24))
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
            db_size_result = db.execute(
                text("SELECT pg_size_pretty(pg_database_size(current_database()))")
            ).scalar()
            db_size = db_size_result if db_size_result else "Unknown"
        except:
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
            system={"database_size": db_size, "timestamp": datetime.utcnow()},
            performance={
                "avg_file_size_mb": round((avg_file_size or 0) / (1024 * 1024), 2)
            },
        )

    except Exception:
        # Graceful fallback instead of 500
        return SystemStatsResponse(
            users={"total": 0, "active": 0, "verified": 0, "new_24h": 0},
            files={"total": 0, "completed": 0, "processing": 0, "failed": 0},
            financial_data={"statements": 0, "parameters": 0},
            system={"database_size": "Unknown", "timestamp": datetime.utcnow()},
            performance={"avg_file_size_mb": 0.0},
        )


@router.get("/users/activity", response_model=List[UserActivityResponse])
async def get_user_activity(
    limit: int = Query(50),
    active_only: Optional[str] = Query(None),
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
    db: Session = Depends(get_db),
):
    """Get user activity statistics."""
    try:
        query = db.query(User)
        # Robust boolean parsing to avoid query param validation issues
        active_only_bool = (
            str(active_only).lower() in {"true", "1", "yes"}
            if active_only is not None
            else False
        )
        if active_only_bool:
            query = query.filter(User.is_active.is_(True))

        users = query.order_by(desc(User.created_at)).limit(limit).all()

        activity_data = []
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
                UserActivityResponse(
                    user_id=user.id,
                    username=user.username,
                    last_login=user.last_login,
                    login_count=0,  # Would need login tracking table
                    files_uploaded=files_uploaded,
                    models_created=models_created,
                    is_active=user.is_active,
                )
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
        import os

        # System metrics
        cpu_usage = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        memory_usage = memory.percent
        disk = psutil.disk_usage("/")
        disk_usage = disk.percent

        # Database connections (simplified)
        try:
            active_connections_result = db.execute(
                text("SELECT count(*) FROM pg_stat_activity WHERE state = 'active'")
            ).scalar()
            active_connections = (
                active_connections_result if active_connections_result else 0
            )
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
                last_updated=datetime.utcnow(),
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
                last_updated=datetime.utcnow(),
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
                last_updated=datetime.utcnow(),
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
                last_updated=datetime.utcnow(),
                integrity_issues=[f"error: {str(e)}"],
                recommendations=["Check database schema and permissions"],
            )
        ]


@router.get("/security/audit", response_model=SecurityAuditResponse)
async def get_security_audit(
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
    db: Session = Depends(get_db),
):
    """Get security audit information."""
    try:
        from app.core.rate_limiter import RateLimit

        # Check for rate limit violations (last 24h)
        rate_limit_violations = (
            db.query(RateLimit)
            .filter(RateLimit.created_at >= datetime.utcnow() - timedelta(hours=24))
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
            recommendations.append(
                "High number of rate limit violations - consider tightening limits"
            )
        if password_violations > 0:
            recommendations.append(
                f"{password_violations} users have not verified their emails"
            )

        return SecurityAuditResponse(
            failed_logins_24h=0,  # Would need login attempt tracking
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
        file_service = FileService()

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
                    UploadedFile.created_at < datetime.utcnow() - timedelta(days=7),
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
            "message": f"{'Would cleanup' if dry_run else 'Cleaned up'} {cleanup_count} files",
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
        if request.action not in {"activate", "deactivate", "verify", "send_reminder"}:
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
                        results["errors"].append(
                            f"Cannot deactivate your own account (user {user.id})"
                        )
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

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to perform bulk action: {str(e)}",
        )


@router.get("/system/logs", response_model=List[Dict[str, Any]])
async def get_system_logs(
    level: str = Query("ERROR", regex="^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$"),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
):
    """Get system logs (simplified - would integrate with actual logging system)."""
    try:
        # This is a placeholder - in a real system, you'd integrate with
        # your logging infrastructure (e.g., read from log files, ELK stack, etc.)

        sample_logs = [
            {
                "timestamp": datetime.utcnow() - timedelta(hours=1),
                "level": "ERROR",
                "message": "Database connection timeout",
                "module": "database",
                "user_id": None,
            },
            {
                "timestamp": datetime.utcnow() - timedelta(hours=2),
                "level": "WARNING",
                "message": "High memory usage detected",
                "module": "system",
                "user_id": None,
            },
            {
                "timestamp": datetime.utcnow() - timedelta(hours=3),
                "level": "INFO",
                "message": "File processing completed",
                "module": "file_service",
                "user_id": 1,
            },
        ]

        # Filter by level
        if level != "DEBUG":
            level_order = {"INFO": 1, "WARNING": 2, "ERROR": 3, "CRITICAL": 4}
            min_level = level_order.get(level, 1)
            sample_logs = [
                log
                for log in sample_logs
                if level_order.get(log["level"], 0) >= min_level
            ]

        return sample_logs[:limit]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get system logs: {str(e)}",
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
            "cleared_records": deleted_count,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear rate limits: {str(e)}",
        )
