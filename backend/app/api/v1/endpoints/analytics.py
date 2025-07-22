from typing import Any, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.base import get_db
from app.models.user import User
from app.services.analytics_service import AnalyticsService
from app.api.v1.endpoints.auth import get_current_active_user
from app.core.dependencies import require_permissions
from app.core.permissions import Permission

router = APIRouter()


def get_analytics_service(db: Session = Depends(get_db)) -> AnalyticsService:
    """Dependency to get analytics service."""
    return AnalyticsService(db)


@router.get("/overview")
def get_processing_overview(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    current_user: User = Depends(get_current_active_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
) -> Any:
    """
    Get processing overview statistics.
    """
    return analytics_service.get_processing_overview(days)


@router.get("/daily-stats")
def get_daily_processing_stats(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    current_user: User = Depends(get_current_active_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
) -> Any:
    """
    Get daily processing statistics for charts and trends.
    """
    return analytics_service.get_daily_processing_stats(days)


@router.get("/file-types")
def get_file_type_distribution(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    current_user: User = Depends(get_current_active_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
) -> Any:
    """
    Get file type distribution statistics.
    """
    return analytics_service.get_file_type_distribution(days)


@router.get("/user-activity")
def get_user_activity_stats(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    limit: int = Query(
        10, ge=1, le=50, description="Maximum number of users to return"
    ),
    current_user: User = Depends(require_permissions(Permission.USER_LIST)),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
) -> Any:
    """
    Get user activity statistics (admin only).
    """
    return analytics_service.get_user_activity_stats(days, limit)


@router.get("/errors")
def get_error_analysis(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    current_user: User = Depends(get_current_active_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
) -> Any:
    """
    Get error analysis and common issues.
    """
    return analytics_service.get_error_analysis(days)


@router.get("/performance")
def get_performance_metrics(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    current_user: User = Depends(require_permissions(Permission.USER_LIST)),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
) -> Any:
    """
    Get system performance metrics (admin only).
    """
    return analytics_service.get_performance_metrics(days)


@router.get("/dashboard")
def get_dashboard_summary(
    days: int = Query(7, ge=1, le=30, description="Number of days to analyze"),
    current_user: User = Depends(get_current_active_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
) -> Any:
    """
    Get comprehensive dashboard summary data.
    """
    return analytics_service.get_dashboard_summary(days)
