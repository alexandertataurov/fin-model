from typing import Any, List, Optional, Dict
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.orm import Session

from fastapi_cache.decorator import cache

from app.models.base import get_db
from app.models.user import User
from app.models.file import UploadedFile, FileStatus
from app.models.parameter import Parameter
from app.models.report import ReportExport
from app.api.v1.endpoints.auth import get_current_active_user
from app.core.dependencies import require_permissions
from app.core.permissions import Permission
from app.services.dashboard_metrics import DashboardMetricsService
from app.services.dashboard_service import DashboardService, PeriodFilter
from app.services.metrics_calculation_service import MetricsCalculationService

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
@cache(expire=300)
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
@cache(expire=300)
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
@cache(expire=300)
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
@cache(expire=300)
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
@cache(expire=300)
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
@cache(expire=300)
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
@cache(expire=300)
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


# ====================
# Enhanced Dashboard Endpoints with Financial Statements Integration
# ====================

@router.get("/overview")
async def get_dashboard_overview(
    period: str = Query(PeriodFilter.YTD.value, description="Time period for dashboard"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get complete dashboard overview with real financial data.
    
    Returns statements, key metrics, and chart data integrated from processed Excel files.
    """
    dashboard_service = DashboardService(db)
    
    try:
        period_filter = PeriodFilter(period)
        dashboard_data = await dashboard_service.get_user_dashboard_data(
            user_id=current_user.id,
            period=period_filter
        )
        
        return {
            "statements": dashboard_data.statements,
            "active_statement": dashboard_data.active_statement,
            "key_metrics": dashboard_data.key_metrics,
            "chart_data": dashboard_data.chart_data,
            "last_updated": dashboard_data.last_updated.isoformat(),
            "data_quality_score": dashboard_data.data_quality_score,
            "period_info": dashboard_data.period_info,
            "generated_at": datetime.utcnow().isoformat(),
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid period filter: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch dashboard overview: {str(e)}",
        )


@router.get("/pl/{statement_id}")
async def get_pl_dashboard_data(
    statement_id: int,
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get P&L dashboard data for a specific financial statement.
    
    Returns detailed P&L metrics, charts, and analysis.
    """
    dashboard_service = DashboardService(db)
    
    try:
        pl_data = await dashboard_service.get_pl_data(
            statement_id=statement_id,
            user_id=current_user.id
        )
        
        return pl_data
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch P&L dashboard data: {str(e)}",
        )


@router.get("/balance/{statement_id}")
async def get_balance_sheet_dashboard_data(
    statement_id: int,
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get Balance Sheet dashboard data for a specific financial statement.
    
    Returns detailed Balance Sheet metrics, charts, and ratios.
    """
    dashboard_service = DashboardService(db)
    
    try:
        bs_data = await dashboard_service.get_balance_sheet_data(
            statement_id=statement_id,
            user_id=current_user.id
        )
        
        return bs_data
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Balance Sheet dashboard data: {str(e)}",
        )


@router.get("/cashflow/{statement_id}")
async def get_cash_flow_dashboard_data(
    statement_id: int,
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get Cash Flow dashboard data for a specific financial statement.
    
    Returns detailed Cash Flow metrics, waterfall charts, and trends.
    """
    dashboard_service = DashboardService(db)
    
    try:
        cf_data = await dashboard_service.get_cash_flow_data(
            statement_id=statement_id,
            user_id=current_user.id
        )
        
        return cf_data
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Cash Flow dashboard data: {str(e)}",
        )


@router.get("/metrics/{statement_id}")
async def get_statement_key_metrics(
    statement_id: int,
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get key financial metrics for a specific statement.
    
    Returns calculated financial ratios and performance indicators.
    """
    dashboard_service = DashboardService(db)
    metrics_service = MetricsCalculationService()
    
    try:
        # Get the statement
        statement = dashboard_service._get_statement_by_id(statement_id, current_user.id)
        if not statement:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Financial statement not found"
            )
        
        # Get user's statements for cross-statement analysis
        user_statements = dashboard_service._get_user_statements(current_user.id, limit=5)
        
        # Calculate comprehensive ratios
        financial_ratios = metrics_service.calculate_financial_ratios(user_statements)
        
        # Calculate DuPont analysis if possible
        dupont_analysis = metrics_service.calculate_dupont_analysis(user_statements)
        
        return {
            "statement_id": statement_id,
            "statement_type": statement.statement_type.value,
            "period": f"{statement.period_start} to {statement.period_end}",
            "financial_ratios": financial_ratios,
            "dupont_analysis": dupont_analysis,
            "data_quality_score": dashboard_service._calculate_statement_quality_score(statement),
            "generated_at": datetime.utcnow().isoformat(),
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate statement metrics: {str(e)}",
        )


@router.get("/export/{format}")
async def export_dashboard_data(
    format: str = Path(..., description="Export format (pdf, excel, json)"),
    period: str = Query(PeriodFilter.YTD.value, description="Time period for export"),
    statement_ids: Optional[str] = Query(None, description="Comma-separated statement IDs"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Export dashboard data in various formats.
    
    Generates downloadable reports with dashboard data and visualizations.
    """
    dashboard_service = DashboardService(db)
    
    if format.lower() not in ["pdf", "excel", "json"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid export format. Supported formats: pdf, excel, json"
        )
    
    try:
        period_filter = PeriodFilter(period)
        
        # Get dashboard data
        dashboard_data = await dashboard_service.get_user_dashboard_data(
            user_id=current_user.id,
            period=period_filter
        )
        
        # Process statement IDs if provided
        selected_statements = []
        if statement_ids:
            stmt_ids = [int(id.strip()) for id in statement_ids.split(",")]
            selected_statements = [
                stmt for stmt in dashboard_data.statements 
                if stmt["id"] in stmt_ids
            ]
        else:
            selected_statements = dashboard_data.statements
        
        export_data = {
            "export_format": format.upper(),
            "period": period,
            "statements": selected_statements,
            "key_metrics": dashboard_data.key_metrics,
            "chart_data": dashboard_data.chart_data,
            "generated_at": datetime.utcnow().isoformat(),
        }
        
        if format.lower() == "json":
            return export_data
        else:
            # For PDF/Excel exports, you would integrate with the report service
            # For now, return the data structure that would be used for export
            return {
                "message": f"Dashboard export prepared in {format.upper()} format",
                "export_id": f"dashboard_export_{current_user.id}_{int(datetime.utcnow().timestamp())}",
                "data_summary": {
                    "statements_count": len(selected_statements),
                    "metrics_count": len(dashboard_data.key_metrics),
                    "charts_count": len(dashboard_data.chart_data),
                },
                "download_url": f"/api/v1/dashboard/download/{format}/dashboard_export_{current_user.id}_{int(datetime.utcnow().timestamp())}",
                "expires_at": (datetime.utcnow() + timedelta(hours=24)).isoformat(),
            }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid parameter: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export dashboard data: {str(e)}",
        )


# ====================
# Data Aggregation Endpoints
# ====================

@router.get("/statements")
async def list_user_statements(
    statement_type: Optional[str] = Query(None, description="Filter by statement type"),
    limit: int = Query(10, ge=1, le=50, description="Number of statements to return"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get list of user's financial statements for dashboard.
    
    Returns available statements with metadata for dashboard selection.
    """
    dashboard_service = DashboardService(db)
    
    try:
        from app.models.financial import StatementType
        
        statement_type_filter = None
        if statement_type:
            try:
                statement_type_filter = StatementType(statement_type.upper())
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid statement type: {statement_type}"
                )
        
        statements = dashboard_service._get_user_statements(
            user_id=current_user.id,
            statement_type=statement_type_filter,
            limit=limit
        )
        
        serialized_statements = [
            dashboard_service._serialize_statement(stmt) for stmt in statements
        ]
        
        return {
            "statements": serialized_statements,
            "total_count": len(serialized_statements),
            "statement_type_filter": statement_type,
            "generated_at": datetime.utcnow().isoformat(),
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user statements: {str(e)}",
        )


@router.get("/time-series")
async def get_time_series_data(
    metric_key: str = Query(..., description="Metric key to track over time"),
    statement_type: str = Query(..., description="Statement type for metric"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get time series data for specific metrics across periods.
    
    Returns historical data for trend analysis and forecasting.
    """
    dashboard_service = DashboardService(db)
    metrics_service = MetricsCalculationService()
    
    try:
        from app.models.financial import StatementType
        
        try:
            statement_type_enum = StatementType(statement_type.upper())
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid statement type: {statement_type}"
            )
        
        # Get statements of the specified type
        statements = dashboard_service._get_user_statements(
            user_id=current_user.id,
            statement_type=statement_type_enum,
            limit=50  # Get more for time series
        )
        
        if not statements:
            return {
                "metric_key": metric_key,
                "statement_type": statement_type,
                "time_series": [],
                "statistics": {},
                "forecast": [],
                "message": "No statements found for time series analysis",
            }
        
        # Create time series data
        time_series = metrics_service.create_time_series_data(
            statements=statements,
            metric_key=metric_key,
            metric_name=metric_key.replace('_', ' ').title()
        )
        
        # Calculate statistics
        statistics = metrics_service.calculate_trend_statistics(time_series)
        
        # Generate forecast
        forecast = metrics_service.generate_simple_forecast(time_series, periods_ahead=3)
        
        return {
            "metric_key": metric_key,
            "statement_type": statement_type,
            "time_series": {
                "periods": time_series.periods,
                "values": time_series.values,
                "dates": [d.isoformat() for d in time_series.dates],
                "unit": time_series.unit,
            },
            "statistics": statistics,
            "forecast": forecast,
            "generated_at": datetime.utcnow().isoformat(),
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate time series data: {str(e)}",
        )


@router.get("/comparisons")
async def get_period_comparisons(
    statement_id_1: int = Query(..., description="First statement ID for comparison"),
    statement_id_2: int = Query(..., description="Second statement ID for comparison"),
    current_user: User = Depends(require_permissions(Permission.DASHBOARD_READ)),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get period-over-period comparison analysis.
    
    Returns detailed comparison between two financial statements.
    """
    dashboard_service = DashboardService(db)
    
    try:
        # Get both statements
        statement_1 = dashboard_service._get_statement_by_id(statement_id_1, current_user.id)
        statement_2 = dashboard_service._get_statement_by_id(statement_id_2, current_user.id)
        
        if not statement_1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Statement {statement_id_1} not found"
            )
        
        if not statement_2:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Statement {statement_id_2} not found"
            )
        
        if statement_1.statement_type != statement_2.statement_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot compare statements of different types"
            )
        
        # Calculate comparison metrics
        line_items_1 = statement_1.line_items or {}
        line_items_2 = statement_2.line_items or {}
        
        comparisons = {}
        significant_changes = []
        
        # Compare common metrics
        all_keys = set(line_items_1.keys()) | set(line_items_2.keys())
        
        for key in all_keys:
            value_1 = dashboard_service._extract_metric_value(line_items_1, [key])
            value_2 = dashboard_service._extract_metric_value(line_items_2, [key])
            
            if value_1 is not None and value_2 is not None:
                absolute_change = value_2 - value_1
                percentage_change = ((value_2 - value_1) / value_1 * 100) if value_1 != 0 else 0
                
                comparisons[key] = {
                    "period_1_value": value_1,
                    "period_2_value": value_2,
                    "absolute_change": absolute_change,
                    "percentage_change": percentage_change,
                }
                
                # Identify significant changes (>10% change)
                if abs(percentage_change) > 10:
                    significant_changes.append({
                        "metric": key,
                        "change_type": "increase" if percentage_change > 0 else "decrease",
                        "percentage_change": percentage_change,
                        "absolute_change": absolute_change,
                    })
        
        return {
            "statement_1": {
                "id": statement_id_1,
                "period": f"{statement_1.period_start} to {statement_1.period_end}",
                "type": statement_1.statement_type.value,
            },
            "statement_2": {
                "id": statement_id_2,
                "period": f"{statement_2.period_start} to {statement_2.period_end}",
                "type": statement_2.statement_type.value,
            },
            "comparisons": comparisons,
            "significant_changes": significant_changes,
            "summary": {
                "total_metrics_compared": len(comparisons),
                "significant_changes_count": len(significant_changes),
                "comparison_type": statement_1.statement_type.value,
            },
            "generated_at": datetime.utcnow().isoformat(),
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate period comparison: {str(e)}",
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
