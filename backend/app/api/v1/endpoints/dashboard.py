from typing import Dict, List, Any, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from starlette.status import HTTP_200_OK, HTTP_404_NOT_FOUND, HTTP_422_UNPROCESSABLE_ENTITY

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.services.dashboard_metrics import (
    DashboardMetricsService,
    DashboardPeriod,
    MetricCategory,
    DashboardData,
    DashboardMetric,
)
from app.core.permissions import require_permissions
from app.core.security import Permission

router = APIRouter()


@router.get("/metrics/overview", response_model=Dict[str, Any])
async def get_dashboard_overview(
    period: DashboardPeriod = Query(DashboardPeriod.YTD, description="Time period for analysis"),
    start_date: Optional[datetime] = Query(None, description="Custom start date (ISO format)"),
    end_date: Optional[datetime] = Query(None, description="Custom end date (ISO format)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Get overview dashboard metrics including key financial indicators.
    
    Returns a comprehensive view of financial performance for the specified period.
    """
    try:
        metrics_service = DashboardMetricsService(db)
        
        # Get metrics from all dashboard types
        pl_data = metrics_service.get_pl_dashboard_data(
            user_id=current_user.id,
            period=period,
            start_date=start_date,
            end_date=end_date,
        )
        
        cf_data = metrics_service.get_cash_flow_dashboard_data(
            user_id=current_user.id,
            period=period,
            start_date=start_date,
            end_date=end_date,
        )
        
        bs_data = metrics_service.get_balance_sheet_dashboard_data(
            user_id=current_user.id,
            period=period,
            start_date=start_date,
            end_date=end_date,
        )
        
        # Combine key metrics from each category
        key_metrics = []
        
        # Select top metrics from each category
        if pl_data.metrics:
            key_metrics.extend([m for m in pl_data.metrics if m.display_order <= 3])
        
        if cf_data.metrics:
            key_metrics.extend([m for m in cf_data.metrics if m.display_order <= 2])
        
        if bs_data.metrics:
            key_metrics.extend([m for m in bs_data.metrics if m.display_order <= 2])
        
        return {
            "key_metrics": [
                {
                    "name": metric.name,
                    "value": metric.value,
                    "category": metric.category.value,
                    "period": metric.period,
                    "unit": metric.unit,
                    "format_type": metric.format_type,
                    "change": metric.change,
                    "change_percentage": metric.change_percentage,
                    "trend": metric.trend,
                    "description": metric.description,
                }
                for metric in key_metrics
            ],
            "period_info": pl_data.period_info,
            "last_updated": pl_data.last_updated.isoformat(),
            "data_quality_score": pl_data.data_quality_score,
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to generate overview metrics: {str(e)}"
        )


@router.get("/metrics/pl", response_model=Dict[str, Any])
async def get_pl_dashboard_metrics(
    period: DashboardPeriod = Query(DashboardPeriod.YTD),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Get Profit & Loss dashboard metrics including revenue trends and profitability.
    """
    try:
        metrics_service = DashboardMetricsService(db)
        dashboard_data = metrics_service.get_pl_dashboard_data(
            user_id=current_user.id,
            period=period,
            start_date=start_date,
            end_date=end_date,
        )
        
        return {
            "metrics": [
                {
                    "name": metric.name,
                    "value": metric.value,
                    "category": metric.category.value,
                    "period": metric.period,
                    "unit": metric.unit,
                    "format_type": metric.format_type,
                    "change": metric.change,
                    "change_percentage": metric.change_percentage,
                    "trend": metric.trend,
                    "description": metric.description,
                    "display_order": metric.display_order,
                }
                for metric in dashboard_data.metrics
            ],
            "charts": {
                chart_name: [
                    {
                        "period": point.period,
                        "value": point.value,
                        "date": point.date.isoformat(),
                        "label": point.label,
                        "category": point.category,
                    }
                    for point in chart_data
                ]
                for chart_name, chart_data in dashboard_data.charts.items()
            },
            "period_info": dashboard_data.period_info,
            "last_updated": dashboard_data.last_updated.isoformat(),
            "data_quality_score": dashboard_data.data_quality_score,
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to generate P&L metrics: {str(e)}"
        )


@router.get("/metrics/cash-flow", response_model=Dict[str, Any])
async def get_cash_flow_dashboard_metrics(
    period: DashboardPeriod = Query(DashboardPeriod.YTD),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Get Cash Flow dashboard metrics including cash position and flow analysis.
    """
    try:
        metrics_service = DashboardMetricsService(db)
        dashboard_data = metrics_service.get_cash_flow_dashboard_data(
            user_id=current_user.id,
            period=period,
            start_date=start_date,
            end_date=end_date,
        )
        
        return {
            "metrics": [
                {
                    "name": metric.name,
                    "value": metric.value,
                    "category": metric.category.value,
                    "period": metric.period,
                    "unit": metric.unit,
                    "format_type": metric.format_type,
                    "change": metric.change,
                    "change_percentage": metric.change_percentage,
                    "trend": metric.trend,
                    "description": metric.description,
                    "display_order": metric.display_order,
                }
                for metric in dashboard_data.metrics
            ],
            "charts": {
                chart_name: [
                    {
                        "period": point.period,
                        "value": point.value,
                        "date": point.date.isoformat(),
                        "label": point.label,
                        "category": point.category,
                    }
                    for point in chart_data
                ]
                for chart_name, chart_data in dashboard_data.charts.items()
            },
            "period_info": dashboard_data.period_info,
            "last_updated": dashboard_data.last_updated.isoformat(),
            "data_quality_score": dashboard_data.data_quality_score,
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to generate cash flow metrics: {str(e)}"
        )


@router.get("/metrics/balance-sheet", response_model=Dict[str, Any])
async def get_balance_sheet_dashboard_metrics(
    period: DashboardPeriod = Query(DashboardPeriod.YTD),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Get Balance Sheet dashboard metrics including assets, liabilities, and financial ratios.
    """
    try:
        metrics_service = DashboardMetricsService(db)
        dashboard_data = metrics_service.get_balance_sheet_dashboard_data(
            user_id=current_user.id,
            period=period,
            start_date=start_date,
            end_date=end_date,
        )
        
        return {
            "metrics": [
                {
                    "name": metric.name,
                    "value": metric.value,
                    "category": metric.category.value,
                    "period": metric.period,
                    "unit": metric.unit,
                    "format_type": metric.format_type,
                    "change": metric.change,
                    "change_percentage": metric.change_percentage,
                    "trend": metric.trend,
                    "description": metric.description,
                    "display_order": metric.display_order,
                }
                for metric in dashboard_data.metrics
            ],
            "charts": {
                chart_name: [
                    {
                        "period": point.period,
                        "value": point.value,
                        "date": point.date.isoformat(),
                        "label": point.label,
                        "category": point.category,
                    }
                    for point in chart_data
                ]
                for chart_name, chart_data in dashboard_data.charts.items()
            },
            "period_info": dashboard_data.period_info,
            "last_updated": dashboard_data.last_updated.isoformat(),
            "data_quality_score": dashboard_data.data_quality_score,
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to generate balance sheet metrics: {str(e)}"
        )


@router.post("/scenarios/compare", response_model=Dict[str, Any])
async def compare_scenarios(
    scenario_data: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Compare financial metrics across multiple scenarios.
    
    Expected payload:
    {
        "scenario_ids": [1, 2, 3],
        "metrics": ["revenue", "net_income", "cash_flow"]
    }
    """
    try:
        scenario_ids = scenario_data.get("scenario_ids", [])
        metrics = scenario_data.get("metrics", [])
        
        if not scenario_ids or not metrics:
            raise HTTPException(
                status_code=HTTP_422_UNPROCESSABLE_ENTITY,
                detail="scenario_ids and metrics are required"
            )
        
        if len(scenario_ids) > 5:
            raise HTTPException(
                status_code=HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Maximum 5 scenarios can be compared at once"
            )
        
        metrics_service = DashboardMetricsService(db)
        comparison_data = metrics_service.get_scenario_comparison_data(
            user_id=current_user.id,
            scenario_ids=scenario_ids,
            metrics=metrics,
        )
        
        return {
            "scenarios": comparison_data["scenarios"],
            "variance_analysis": comparison_data["variance_analysis"],
            "comparison_charts": {
                chart_name: [
                    {
                        "period": point.period,
                        "value": point.value,
                        "date": point.date.isoformat(),
                        "label": point.label,
                        "category": point.category,
                    }
                    for point in chart_data
                ]
                for chart_name, chart_data in comparison_data["comparison_chart_data"].items()
            },
            "comparison_metadata": {
                "scenario_count": len(scenario_ids),
                "metric_count": len(metrics),
                "generated_at": datetime.utcnow().isoformat(),
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to compare scenarios: {str(e)}"
        )


@router.get("/metrics/time-series/{metric_name}", response_model=Dict[str, Any])
async def get_metric_time_series(
    metric_name: str,
    period: DashboardPeriod = Query(DashboardPeriod.LAST_12_MONTHS),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    granularity: str = Query("monthly", regex="^(daily|weekly|monthly|quarterly)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Get time series data for a specific financial metric.
    """
    try:
        # This would be implemented to return time series data for charts
        # For now, return a placeholder structure
        return {
            "metric_name": metric_name,
            "time_series": [],
            "granularity": granularity,
            "period": period.value,
            "metadata": {
                "total_points": 0,
                "trend": "stable",
                "volatility": 0.0,
                "last_updated": datetime.utcnow().isoformat(),
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to get time series for {metric_name}: {str(e)}"
        )


@router.get("/health", response_model=Dict[str, Any])
async def dashboard_health_check(
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Check dashboard service health and data availability.
    """
    try:
        # Check database connectivity
        db.execute("SELECT 1")
        
        # Check if there are any processed files
        from app.models.file import UploadedFile, FileStatus
        file_count = db.query(UploadedFile).filter(
            UploadedFile.status == FileStatus.COMPLETED
        ).count()
        
        return {
            "status": "healthy",
            "database_connected": True,
            "processed_files_available": file_count > 0,
            "processed_files_count": file_count,
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0",
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat(),
        }


@router.get("/export/{format}")
async def export_dashboard_data(
    format: str,
    dashboard_type: str = Query("overview", regex="^(overview|pl|cash-flow|balance-sheet)$"),
    period: DashboardPeriod = Query(DashboardPeriod.YTD),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Export dashboard data in various formats (CSV, Excel, PDF).
    """
    if format not in ["csv", "excel", "pdf"]:
        raise HTTPException(
            status_code=HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Supported formats: csv, excel, pdf"
        )
    
    try:
        metrics_service = DashboardMetricsService(db)
        
        # Get the appropriate dashboard data
        if dashboard_type == "pl":
            dashboard_data = metrics_service.get_pl_dashboard_data(
                user_id=current_user.id,
                period=period,
                start_date=start_date,
                end_date=end_date,
            )
        elif dashboard_type == "cash-flow":
            dashboard_data = metrics_service.get_cash_flow_dashboard_data(
                user_id=current_user.id,
                period=period,
                start_date=start_date,
                end_date=end_date,
            )
        elif dashboard_type == "balance-sheet":
            dashboard_data = metrics_service.get_balance_sheet_dashboard_data(
                user_id=current_user.id,
                period=period,
                start_date=start_date,
                end_date=end_date,
            )
        else:  # overview
            # For overview, we'd combine data from all dashboards
            dashboard_data = metrics_service.get_pl_dashboard_data(
                user_id=current_user.id,
                period=period,
                start_date=start_date,
                end_date=end_date,
            )
        
        # For now, return a JSON response
        # In a full implementation, this would generate actual file exports
        return {
            "message": f"Export functionality for {format} format would be implemented here",
            "dashboard_type": dashboard_type,
            "period": period.value,
            "metrics_count": len(dashboard_data.metrics),
            "charts_count": len(dashboard_data.charts),
            "export_timestamp": datetime.utcnow().isoformat(),
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to export dashboard data: {str(e)}"
        ) 