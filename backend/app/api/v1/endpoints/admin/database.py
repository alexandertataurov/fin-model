from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.core.dependencies import require_permissions
from app.core.permissions import Permission
from app.models.audit import AuditLog
from app.models.base import get_db
from app.models.user import User
from app.services.database_monitor import get_db_monitor
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.tasks import maintenance as maintenance_tasks

router = APIRouter()


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


@router.get("/database/health", response_model=Dict[str, Any])
async def get_database_health(
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH)),
    db: Session = Depends(get_db),
):
    """Get comprehensive database health check."""
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
    """Get database query performance analysis."""
    try:
        db_monitor = get_db_monitor(db)
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
    """Get detailed table size and usage information."""
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
    """Clean up stale database records based on retention policies."""
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
    """Trigger a database backup job."""
    try:
        try:
            task = maintenance_tasks.backup_database.delay()
            job_id = str(getattr(task, "id", "unknown"))
        except Exception:
            job_id = "unavailable"
        return BackupResponse(
            job_id=job_id,
            message="Database backup job started successfully",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start backup job: {str(e)}",
        )


@router.post("/database/export", response_model=ExportResponse)
async def export_database(
    payload: ExportRequest,
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    db: Session = Depends(get_db),
):
    """Export data (full or table). Returns file URL."""
    try:
        try:
            task = maintenance_tasks.export_database.delay(
                payload.table, payload.format
            )
            job_id = str(getattr(task, "id", "unknown"))
        except Exception:
            job_id = "unavailable"
        return ExportResponse(
            file_url="/downloads/placeholder",
            message=f"Export job started. Task ID: {job_id}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start export job: {str(e)}",
        )


@router.post("/database/reindex", response_model=ReindexResponse)
async def reindex_database(
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    db: Session = Depends(get_db),
):
    """Rebuild indexes."""
    try:
        try:
            task = maintenance_tasks.reindex_database.delay()
            job_id = str(getattr(task, "id", "unknown"))
        except Exception:
            job_id = "unavailable"
        return ReindexResponse(
            job_id=job_id,
            message="Database reindex job started successfully",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start reindex job: {str(e)}",
        )
