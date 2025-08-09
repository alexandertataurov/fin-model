from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta, timezone
import asyncio
import json

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.core.dependencies import require_permissions
from app.core.permissions import Permission
from app.models.base import get_db
from app.models.audit import AuditLog
from app.models.system_log import SystemLog
from app.models.user import User
from app.services.system_log_service import SystemLogService

router = APIRouter()


@router.get("/audit-logs")
def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    action: Optional[str] = Query(None, description="Filter by action type"),
    resource: Optional[str] = Query(None, description="Filter by resource type"),
    success: Optional[bool] = Query(None, description="Filter by success status"),
    search: Optional[str] = Query(None, description="Search in details/message"),
    from_ts: Optional[datetime] = Query(None, description="Start date filter"),
    to_ts: Optional[datetime] = Query(None, description="End date filter"),
    envelope: bool = Query(False, description="Return pagination envelope"),
    current_user: User = Depends(require_permissions(Permission.AUDIT_LOGS)),
    db: Session = Depends(get_db),
) -> Any:
    """Get audit logs with advanced filtering (Admin only)."""
    from app.core.admin_exceptions import (
        handle_admin_error,
        validate_pagination_params,
        validate_date_range,
        create_pagination_response,
    )

    try:
        validate_pagination_params(skip, limit)
        if from_ts or to_ts:
            from_ts_str = from_ts.isoformat() if from_ts else None
            to_ts_str = to_ts.isoformat() if to_ts else None
            validate_date_range(from_ts_str, to_ts_str)
        query = db.query(AuditLog)

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

        total = query.count()
        rows = query.order_by(desc(AuditLog.created_at)).offset(skip).limit(limit).all()

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

        if envelope:
            return create_pagination_response(
                items=items,
                total=total,
                skip=skip,
                limit=limit,
                envelope=True,
            )
        else:
            return {"logs": items, "skip": skip, "limit": limit, "total": total}

    except Exception as e:
        raise handle_admin_error(e, "get audit logs", current_user.id)


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
            return {"items": items, "skip": skip, "limit": limit, "total": total}
        return items
    except Exception:
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
                pass
            await asyncio.sleep(interval_ms / 1000)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
