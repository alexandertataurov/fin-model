from typing import Any, Dict
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.base import get_db
from app.models.user import User
from app.core.monitoring import performance_monitor
from app.core.dependencies import require_permissions
from app.core.permissions import Permission

router = APIRouter()


@router.get("/metrics", response_model=Dict[str, Any])
async def get_performance_metrics(
    hours: int = Query(24, ge=1, le=168, description="Hours to look back"),
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH)),
    db: Session = Depends(get_db),
) -> Any:
    """Get performance metrics summary."""
    return performance_monitor.get_metrics_summary(hours=hours)


@router.get("/system", response_model=Dict[str, Any])
async def get_system_metrics(
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH)),
    db: Session = Depends(get_db),
) -> Any:
    """Get current system resource metrics."""
    import psutil
    
    # Update system metrics
    performance_monitor.update_system_metrics()
    
    # Get detailed system info
    memory = psutil.virtual_memory()
    cpu_percent = psutil.cpu_percent(interval=1)
    disk = psutil.disk_usage('/')
    
    return {
        "memory": {
            "total": memory.total,
            "available": memory.available,
            "used": memory.used,
            "percent": memory.percent
        },
        "cpu": {
            "percent": cpu_percent,
            "count": psutil.cpu_count()
        },
        "disk": {
            "total": disk.total,
            "used": disk.used,
            "free": disk.free,
            "percent": (disk.used / disk.total) * 100
        },
        "network": {
            "connections": len(psutil.net_connections())
        }
    }


@router.post("/clear-metrics", response_model=Dict[str, Any])
async def clear_old_metrics(
    hours: int = Query(24, ge=1, le=168, description="Clear metrics older than N hours"),
    current_user: User = Depends(require_permissions(Permission.SYSTEM_SETTINGS)),
    db: Session = Depends(get_db),
) -> Any:
    """Clear old performance metrics."""
    performance_monitor.clear_old_metrics(hours=hours)
    return {"message": f"Cleared metrics older than {hours} hours"}


@router.get("/health", response_model=Dict[str, Any])
async def monitoring_health_check(
    current_user: User = Depends(require_permissions(Permission.SYSTEM_HEALTH)),
    db: Session = Depends(get_db),
) -> Any:
    """Health check for monitoring system."""
    try:
        # Test basic functionality
        performance_monitor.update_system_metrics()
        summary = performance_monitor.get_metrics_summary(hours=1)
        
        return {
            "status": "healthy",
            "monitoring_active": True,
            "metrics_available": "message" not in summary,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        } 