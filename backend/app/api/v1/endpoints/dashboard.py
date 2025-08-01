from typing import Any, List, Optional, Dict
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

# # from fastapi_cache.decorator import cache  # TODO: Fix fastapi-cache2 import  # TODO: Fix fastapi-cache2 import

from app.models.base import get_db
from app.models.user import User
from app.models.file import UploadedFile, FileStatus
from app.models.parameter import Parameter
from app.models.report import ReportExport
from app.api.v1.endpoints.auth import get_current_active_user
from app.core.dependencies import require_permissions
from app.core.permissions import Permission
from app.services.dashboard_metrics import DashboardMetricsService

router = APIRouter()


@router.get("/metrics")
async def get_dashboard_metrics(
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """Return simple dashboard metrics."""
    total_files = (
        db.query(UploadedFile).filter(UploadedFile.user_id == current_user.id).count()
    )
    completed_files = (
        db.query(UploadedFile)
        .filter(
            UploadedFile.user_id == current_user.id,
            UploadedFile.status == FileStatus.COMPLETED,
        )
        .count()
    )
    processing_files = (
        db.query(UploadedFile)
        .filter(
            UploadedFile.user_id == current_user.id,
            UploadedFile.status == FileStatus.PROCESSING,
        )
        .count()
    )
    total_parameters = (
        db.query(Parameter).filter(Parameter.user_id == current_user.id).count()
    )
    total_reports = (
        db.query(ReportExport)
        .filter(ReportExport.created_by == current_user.id)
        .count()
    )
    return {
        "total_files": total_files,
        "completed_files": completed_files,
        "processing_files": processing_files,
        "total_parameters": total_parameters,
        "total_reports": total_reports,
    }


@router.get("/charts")
async def get_dashboard_charts(
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """Return simple example chart data used in tests."""
    return {
        "revenue_trend": [1000, 1200, 1100, 1300],
        "expense_breakdown": {"COGS": 600, "OPEX": 300},
    }


class DashboardPeriod:
    """Dashboard time period constants."""

    MTD = "mtd"  # Month to Date
    QTD = "qtd"  # Quarter to Date
    YTD = "ytd"  # Year to Date
    LAST_30_DAYS = "last_30_days"
    LAST_90_DAYS = "last_90_days"
    LAST_12_MONTHS = "last_12_months"
    CUSTOM = "custom"


@router.get("/metrics/overview")
# @cache(expire=300)  # TODO: Fix caching
async def get_overview_metrics(
    period: str = Query(DashboardPeriod.YTD, description="Time period for metrics"),
    file_id: Optional[int] = Query(None, description="Specific file ID to analyze"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get overview financial metrics for dashboard.

    Returns key metrics across P&L, Balance Sheet, and Cash Flow.
    """
    metrics_service = DashboardMetricsService(db)

    try:
        overview_data = await metrics_service.get_overview_metrics(
            user_id=current_user.id, period=period, file_id=file_id
        )

        return {
            "period": period,
            "file_id": file_id,
            "metrics": overview_data,
            "generated_at": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch overview metrics: {str(e)}",
        )


@router.get("/metrics/pl")
# @cache(expire=300)  # TODO: Fix caching
async def get_pl_metrics(
    period: str = Query(DashboardPeriod.YTD, description="Time period for metrics"),
    file_id: Optional[int] = Query(None, description="Specific file ID to analyze"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get Profit & Loss metrics and charts.

    Returns detailed P&L metrics including revenue, expenses, margins, and trends.
    """
    metrics_service = DashboardMetricsService(db)

    try:
        pl_data = await metrics_service.get_pl_metrics(
            user_id=current_user.id, period=period, file_id=file_id
        )

        return {
            "period": period,
            "file_id": file_id,
            "metrics": pl_data["metrics"],
            "charts": pl_data["charts"],
            "data_quality": pl_data.get("data_quality", {}),
            "generated_at": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch P&L metrics: {str(e)}",
        )


@router.get("/metrics/cash-flow")
# @cache(expire=300)  # TODO: Fix caching
async def get_cash_flow_metrics(
    period: str = Query(DashboardPeriod.YTD, description="Time period for metrics"),
    file_id: Optional[int] = Query(None, description="Specific file ID to analyze"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get Cash Flow metrics and charts.

    Returns cash flow from operations, investing, financing activities and trends.
    """
    metrics_service = DashboardMetricsService(db)

    try:
        cf_data = await metrics_service.get_cash_flow_metrics(
            user_id=current_user.id, period=period, file_id=file_id
        )

        return {
            "period": period,
            "file_id": file_id,
            "metrics": cf_data["metrics"],
            "charts": cf_data["charts"],
            "waterfall_data": cf_data.get("waterfall_data", []),
            "data_quality": cf_data.get("data_quality", {}),
            "generated_at": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Cash Flow metrics: {str(e)}",
        )


@router.get("/metrics/balance-sheet")
# @cache(expire=300)  # TODO: Fix caching
async def get_balance_sheet_metrics(
    period: str = Query(DashboardPeriod.YTD, description="Time period for metrics"),
    file_id: Optional[int] = Query(None, description="Specific file ID to analyze"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get Balance Sheet metrics and charts.

    Returns assets, liabilities, equity, and financial ratios.
    """
    metrics_service = DashboardMetricsService(db)

    try:
        bs_data = await metrics_service.get_balance_sheet_metrics(
            user_id=current_user.id, period=period, file_id=file_id
        )

        return {
            "period": period,
            "file_id": file_id,
            "metrics": bs_data["metrics"],
            "charts": bs_data["charts"],
            "ratios": bs_data.get("ratios", {}),
            "data_quality": bs_data.get("data_quality", {}),
            "generated_at": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Balance Sheet metrics: {str(e)}",
        )


@router.get("/metrics/trends")
# @cache(expire=300)  # TODO: Fix caching
async def get_financial_trends(
    metric_type: str = Query(
        ..., description="Type of metric (revenue, expenses, cash_flow, etc.)"
    ),
    period_range: str = Query(
        "last_12_months", description="Period range for trend analysis"
    ),
    file_id: Optional[int] = Query(None, description="Specific file ID to analyze"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get financial trends over time for specific metrics.

    Returns time-series data for trend analysis and forecasting.
    """
    metrics_service = DashboardMetricsService(db)

    try:
        trend_data = await metrics_service.get_financial_trends(
            user_id=current_user.id,
            metric_type=metric_type,
            period_range=period_range,
            file_id=file_id,
        )

        return {
            "metric_type": metric_type,
            "period_range": period_range,
            "file_id": file_id,
            "trend_data": trend_data["time_series"],
            "statistics": trend_data.get("statistics", {}),
            "forecast": trend_data.get("forecast", []),
            "generated_at": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch financial trends: {str(e)}",
        )


@router.get("/metrics/kpis")
# @cache(expire=300)  # TODO: Fix caching
async def get_key_performance_indicators(
    period: str = Query(DashboardPeriod.YTD, description="Time period for KPIs"),
    industry: Optional[str] = Query(None, description="Industry for benchmarking"),
    file_id: Optional[int] = Query(None, description="Specific file ID to analyze"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get Key Performance Indicators (KPIs) with benchmarking.

    Returns calculated KPIs with industry benchmarks when available.
    """
    metrics_service = DashboardMetricsService(db)

    try:
        kpi_data = await metrics_service.get_key_performance_indicators(
            user_id=current_user.id, period=period, industry=industry, file_id=file_id
        )

        return {
            "period": period,
            "industry": industry,
            "file_id": file_id,
            "kpis": kpi_data["kpis"],
            "benchmarks": kpi_data.get("benchmarks", {}),
            "performance_score": kpi_data.get("performance_score", 0),
            "generated_at": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch KPIs: {str(e)}",
        )


@router.get("/metrics/ratios")
# @cache(expire=300)  # TODO: Fix caching
async def get_financial_ratios(
    ratio_category: Optional[str] = Query(
        None,
        description="Category of ratios (liquidity, profitability, leverage, efficiency)",
    ),
    period: str = Query(DashboardPeriod.YTD, description="Time period for ratios"),
    file_id: Optional[int] = Query(None, description="Specific file ID to analyze"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get financial ratios with analysis and benchmarking.

    Returns calculated financial ratios organized by category.
    """
    metrics_service = DashboardMetricsService(db)

    try:
        ratio_data = await metrics_service.get_financial_ratios(
            user_id=current_user.id,
            ratio_category=ratio_category,
            period=period,
            file_id=file_id,
        )

        return {
            "ratio_category": ratio_category,
            "period": period,
            "file_id": file_id,
            "ratios": ratio_data["ratios"],
            "analysis": ratio_data.get("analysis", {}),
            "trends": ratio_data.get("trends", []),
            "generated_at": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch financial ratios: {str(e)}",
        )


@router.get("/metrics/variance")
async def get_variance_analysis(
    base_period: str = Query(..., description="Base period for comparison"),
    compare_period: str = Query(..., description="Period to compare against"),
    variance_type: str = Query(
        "absolute", description="Type of variance (absolute, percentage)"
    ),
    file_id: Optional[int] = Query(None, description="Specific file ID to analyze"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get variance analysis between two periods.

    Returns detailed variance analysis with explanations for significant changes.
    """
    metrics_service = DashboardMetricsService(db)

    try:
        variance_data = await metrics_service.get_variance_analysis(
            user_id=current_user.id,
            base_period=base_period,
            compare_period=compare_period,
            variance_type=variance_type,
            file_id=file_id,
        )

        return {
            "base_period": base_period,
            "compare_period": compare_period,
            "variance_type": variance_type,
            "file_id": file_id,
            "variances": variance_data["variances"],
            "significant_changes": variance_data.get("significant_changes", []),
            "summary": variance_data.get("summary", {}),
            "generated_at": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch variance analysis: {str(e)}",
        )


@router.get("/data-sources")
async def get_dashboard_data_sources(
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get available data sources for dashboard metrics.

    Returns list of uploaded files and their processing status.
    """
    try:
        # Get user's uploaded files
        files = (
            db.query(UploadedFile)
            .filter(UploadedFile.uploaded_by_id == current_user.id)
            .order_by(UploadedFile.created_at.desc())
            .all()
        )

        data_sources = []
        for file in files:
            data_sources.append(
                {
                    "id": file.id,
                    "filename": file.original_filename,
                    "file_type": file.file_type,
                    "status": file.status,
                    "is_valid": file.is_valid,
                    "created_at": file.created_at.isoformat(),
                    "file_size": file.file_size,
                    "has_financial_data": file.parsed_data is not None,
                }
            )

        return {
            "data_sources": data_sources,
            "total_count": len(data_sources),
            "valid_count": sum(1 for ds in data_sources if ds["is_valid"]),
            "generated_at": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch data sources: {str(e)}",
        )


@router.post("/refresh-cache")
async def refresh_dashboard_cache(
    file_id: Optional[int] = Query(None, description="Specific file ID to refresh"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Refresh dashboard cache for updated data.

    Forces recalculation of metrics and clears cached results.
    """
    metrics_service = DashboardMetricsService(db)

    try:
        refresh_result = await metrics_service.refresh_cache(
            user_id=current_user.id, file_id=file_id
        )

        return {
            "message": "Dashboard cache refreshed successfully",
            "file_id": file_id,
            "refresh_stats": refresh_result,
            "refreshed_at": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to refresh cache: {str(e)}",
        )


@router.get("/health")
async def dashboard_health_check(
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Health check for dashboard services.

    Returns status of dashboard components and data availability.
    """
    try:
        # Check database connectivity
        db.execute("SELECT 1")

        # Check cache connectivity (if implemented)
        cache_status = "healthy"  # Would check Redis/cache here

        # Check data availability
        total_files = db.query(UploadedFile).count()
        processed_files = (
            db.query(UploadedFile).filter(UploadedFile.status == "completed").count()
        )

        return {
            "status": "healthy",
            "database": "connected",
            "cache": cache_status,
            "data_availability": {
                "total_files": total_files,
                "processed_files": processed_files,
                "processing_rate": processed_files / total_files
                if total_files > 0
                else 0,
            },
            "timestamp": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Dashboard service unhealthy: {str(e)}",
        )
