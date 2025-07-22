from typing import Dict, List, Any, Optional, Union
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from enum import Enum
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, text
import pandas as pd
import numpy as np
from decimal import Decimal
import json

from app.models.file import UploadedFile, ProcessingLog, FileStatus
from app.models.user import User
from app.services.financial_extractor import FinancialExtractor, FinancialMetric, TimeSeriesData, MetricType


class DashboardPeriod(str, Enum):
    """Dashboard time period options."""
    
    MTD = "mtd"  # Month to date
    QTD = "qtd"  # Quarter to date
    YTD = "ytd"  # Year to date
    LAST_30_DAYS = "last_30_days"
    LAST_90_DAYS = "last_90_days"
    LAST_12_MONTHS = "last_12_months"
    CUSTOM = "custom"


class MetricCategory(str, Enum):
    """Financial metric categories for dashboard organization."""
    
    REVENUE = "revenue"
    PROFITABILITY = "profitability"
    CASH_FLOW = "cash_flow"
    BALANCE_SHEET = "balance_sheet"
    RATIOS = "ratios"
    GROWTH = "growth"
    EFFICIENCY = "efficiency"


@dataclass
class DashboardMetric:
    """Standardized metric for dashboard display."""
    
    name: str
    value: Union[float, int, str]
    category: MetricCategory
    period: str
    unit: str = "currency"
    change: Optional[float] = None  # Period over period change
    change_percentage: Optional[float] = None
    trend: Optional[str] = None  # "up", "down", "stable"
    format_type: str = "number"  # "currency", "percentage", "number"
    display_order: int = 0
    description: Optional[str] = None


@dataclass
class ChartDataPoint:
    """Data point for charts."""
    
    period: str
    value: float
    date: datetime
    label: Optional[str] = None
    category: Optional[str] = None


@dataclass
class DashboardData:
    """Complete dashboard data structure."""
    
    metrics: List[DashboardMetric]
    charts: Dict[str, List[ChartDataPoint]]
    period_info: Dict[str, Any]
    last_updated: datetime
    data_quality_score: float = 1.0


class DashboardMetricsService:
    """Service for generating dashboard-ready financial metrics."""

    def __init__(self, db: Session):
        self.db = db
        self.financial_extractor = FinancialExtractor()

    def get_pl_dashboard_data(
        self,
        user_id: int,
        period: DashboardPeriod = DashboardPeriod.YTD,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> DashboardData:
        """
        Get P&L dashboard data including revenue trends, margins, and expense breakdown.
        
        Args:
            user_id: User ID to filter data
            period: Time period for analysis
            start_date: Custom start date (if period is CUSTOM)
            end_date: Custom end date (if period is CUSTOM)
            
        Returns:
            DashboardData with P&L metrics and charts
        """
        period_dates = self._get_period_dates(period, start_date, end_date)
        
        # Get processed files for the user and period
        files_data = self._get_processed_files_data(user_id, period_dates)
        
        if not files_data:
            return self._empty_dashboard_data("No data available for the selected period")
        
        # Extract and aggregate P&L metrics
        pl_metrics = self._calculate_pl_metrics(files_data, period_dates)
        revenue_chart = self._generate_revenue_trend_chart(files_data, period_dates)
        margin_chart = self._generate_profit_margin_chart(files_data, period_dates)
        expense_chart = self._generate_expense_breakdown_chart(files_data, period_dates)
        
        return DashboardData(
            metrics=pl_metrics,
            charts={
                "revenue_trend": revenue_chart,
                "profit_margins": margin_chart,
                "expense_breakdown": expense_chart,
            },
            period_info={
                "period": period.value,
                "start_date": period_dates["start_date"].isoformat(),
                "end_date": period_dates["end_date"].isoformat(),
            },
            last_updated=datetime.utcnow(),
        )

    def get_cash_flow_dashboard_data(
        self,
        user_id: int,
        period: DashboardPeriod = DashboardPeriod.YTD,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> DashboardData:
        """Get cash flow dashboard data including waterfall analysis and cash position."""
        
        period_dates = self._get_period_dates(period, start_date, end_date)
        files_data = self._get_processed_files_data(user_id, period_dates)
        
        if not files_data:
            return self._empty_dashboard_data("No cash flow data available")
        
        # Calculate cash flow metrics
        cf_metrics = self._calculate_cash_flow_metrics(files_data, period_dates)
        waterfall_chart = self._generate_cash_waterfall_chart(files_data, period_dates)
        position_chart = self._generate_cash_position_chart(files_data, period_dates)
        
        return DashboardData(
            metrics=cf_metrics,
            charts={
                "cash_waterfall": waterfall_chart,
                "cash_position": position_chart,
            },
            period_info={
                "period": period.value,
                "start_date": period_dates["start_date"].isoformat(),
                "end_date": period_dates["end_date"].isoformat(),
            },
            last_updated=datetime.utcnow(),
        )

    def get_balance_sheet_dashboard_data(
        self,
        user_id: int,
        period: DashboardPeriod = DashboardPeriod.YTD,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> DashboardData:
        """Get balance sheet dashboard data including asset/liability breakdown and ratios."""
        
        period_dates = self._get_period_dates(period, start_date, end_date)
        files_data = self._get_processed_files_data(user_id, period_dates)
        
        if not files_data:
            return self._empty_dashboard_data("No balance sheet data available")
        
        # Calculate balance sheet metrics
        bs_metrics = self._calculate_balance_sheet_metrics(files_data, period_dates)
        assets_chart = self._generate_assets_breakdown_chart(files_data, period_dates)
        ratios_chart = self._generate_financial_ratios_chart(files_data, period_dates)
        
        return DashboardData(
            metrics=bs_metrics,
            charts={
                "assets_breakdown": assets_chart,
                "financial_ratios": ratios_chart,
            },
            period_info={
                "period": period.value,
                "start_date": period_dates["start_date"].isoformat(),
                "end_date": period_dates["end_date"].isoformat(),
            },
            last_updated=datetime.utcnow(),
        )

    def get_scenario_comparison_data(
        self,
        user_id: int,
        scenario_ids: List[int],
        metrics: List[str],
    ) -> Dict[str, Any]:
        """
        Compare multiple scenarios across selected metrics.
        
        Args:
            user_id: User ID
            scenario_ids: List of file IDs representing different scenarios
            metrics: List of metric names to compare
            
        Returns:
            Dictionary with scenario comparison data
        """
        scenarios_data = {}
        
        for scenario_id in scenario_ids:
            file_data = self._get_file_data(user_id, scenario_id)
            if file_data:
                scenario_metrics = self._extract_specific_metrics(file_data, metrics)
                scenarios_data[f"scenario_{scenario_id}"] = scenario_metrics
        
        # Calculate variance analysis
        variance_analysis = self._calculate_scenario_variance(scenarios_data, metrics)
        
        return {
            "scenarios": scenarios_data,
            "variance_analysis": variance_analysis,
            "comparison_chart_data": self._generate_scenario_comparison_charts(scenarios_data, metrics),
        }

    def _get_period_dates(
        self,
        period: DashboardPeriod,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> Dict[str, datetime]:
        """Calculate start and end dates for the given period."""
        
        now = datetime.utcnow()
        
        if period == DashboardPeriod.CUSTOM:
            if not start_date or not end_date:
                raise ValueError("Custom period requires start_date and end_date")
            return {"start_date": start_date, "end_date": end_date}
        
        elif period == DashboardPeriod.MTD:
            start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            end_date = now
            
        elif period == DashboardPeriod.QTD:
            quarter_start_month = ((now.month - 1) // 3) * 3 + 1
            start_date = now.replace(month=quarter_start_month, day=1, hour=0, minute=0, second=0, microsecond=0)
            end_date = now
            
        elif period == DashboardPeriod.YTD:
            start_date = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
            end_date = now
            
        elif period == DashboardPeriod.LAST_30_DAYS:
            start_date = now - timedelta(days=30)
            end_date = now
            
        elif period == DashboardPeriod.LAST_90_DAYS:
            start_date = now - timedelta(days=90)
            end_date = now
            
        elif period == DashboardPeriod.LAST_12_MONTHS:
            start_date = now - timedelta(days=365)
            end_date = now
            
        else:
            # Default to YTD
            start_date = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
            end_date = now
        
        return {"start_date": start_date, "end_date": end_date}

    def _get_processed_files_data(self, user_id: int, period_dates: Dict[str, datetime]) -> List[Dict[str, Any]]:
        """Get processed files data for the user within the period."""
        
        files = (
            self.db.query(UploadedFile)
            .filter(
                and_(
                    UploadedFile.user_id == user_id,
                    UploadedFile.status == FileStatus.COMPLETED,
                    UploadedFile.created_at >= period_dates["start_date"],
                    UploadedFile.created_at <= period_dates["end_date"],
                    UploadedFile.extracted_data.isnot(None),
                )
            )
            .order_by(UploadedFile.created_at.desc())
            .all()
        )
        
        files_data = []
        for file in files:
            if file.extracted_data:
                try:
                    extracted_data = json.loads(file.extracted_data) if isinstance(file.extracted_data, str) else file.extracted_data
                    files_data.append({
                        "file_id": file.id,
                        "filename": file.filename,
                        "created_at": file.created_at,
                        "extracted_data": extracted_data,
                    })
                except (json.JSONDecodeError, TypeError):
                    continue
        
        return files_data

    def _calculate_pl_metrics(self, files_data: List[Dict[str, Any]], period_dates: Dict[str, datetime]) -> List[DashboardMetric]:
        """Calculate P&L metrics from files data."""
        
        metrics = []
        
        # Aggregate revenue across all files
        total_revenue = 0
        total_expenses = 0
        total_net_income = 0
        
        for file_data in files_data:
            extracted = file_data.get("extracted_data", {})
            financial_metrics = extracted.get("financial_metrics", [])
            
            for metric in financial_metrics:
                if isinstance(metric, dict):
                    metric_name = metric.get("name", "").lower()
                    metric_value = metric.get("value", 0)
                    
                    if "revenue" in metric_name or "sales" in metric_name:
                        total_revenue += float(metric_value)
                    elif "expense" in metric_name or "cost" in metric_name:
                        total_expenses += float(metric_value)
                    elif "net income" in metric_name or "profit" in metric_name:
                        total_net_income += float(metric_value)
        
        # Calculate derived metrics
        gross_profit = total_revenue - total_expenses
        gross_margin = (gross_profit / total_revenue * 100) if total_revenue > 0 else 0
        net_margin = (total_net_income / total_revenue * 100) if total_revenue > 0 else 0
        
        # Create dashboard metrics
        metrics.extend([
            DashboardMetric(
                name="Total Revenue",
                value=total_revenue,
                category=MetricCategory.REVENUE,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="currency",
                format_type="currency",
                display_order=1,
                description="Total revenue for the period"
            ),
            DashboardMetric(
                name="Gross Profit",
                value=gross_profit,
                category=MetricCategory.PROFITABILITY,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="currency",
                format_type="currency",
                display_order=2,
                description="Revenue minus cost of goods sold"
            ),
            DashboardMetric(
                name="Gross Margin",
                value=gross_margin,
                category=MetricCategory.PROFITABILITY,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="percentage",
                format_type="percentage",
                display_order=3,
                description="Gross profit as a percentage of revenue"
            ),
            DashboardMetric(
                name="Net Income",
                value=total_net_income,
                category=MetricCategory.PROFITABILITY,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="currency",
                format_type="currency",
                display_order=4,
                description="Bottom line profit after all expenses"
            ),
            DashboardMetric(
                name="Net Margin",
                value=net_margin,
                category=MetricCategory.PROFITABILITY,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="percentage",
                format_type="percentage",
                display_order=5,
                description="Net income as a percentage of revenue"
            ),
        ])
        
        return metrics

    def _calculate_cash_flow_metrics(self, files_data: List[Dict[str, Any]], period_dates: Dict[str, datetime]) -> List[DashboardMetric]:
        """Calculate cash flow metrics from files data."""
        
        metrics = []
        
        operating_cash_flow = 0
        investing_cash_flow = 0
        financing_cash_flow = 0
        
        for file_data in files_data:
            extracted = file_data.get("extracted_data", {})
            financial_metrics = extracted.get("financial_metrics", [])
            
            for metric in financial_metrics:
                if isinstance(metric, dict):
                    metric_name = metric.get("name", "").lower()
                    metric_value = metric.get("value", 0)
                    
                    if "operating cash flow" in metric_name:
                        operating_cash_flow += float(metric_value)
                    elif "investing cash flow" in metric_name:
                        investing_cash_flow += float(metric_value)
                    elif "financing cash flow" in metric_name:
                        financing_cash_flow += float(metric_value)
        
        free_cash_flow = operating_cash_flow + investing_cash_flow
        net_cash_flow = operating_cash_flow + investing_cash_flow + financing_cash_flow
        
        metrics.extend([
            DashboardMetric(
                name="Operating Cash Flow",
                value=operating_cash_flow,
                category=MetricCategory.CASH_FLOW,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="currency",
                format_type="currency",
                display_order=1,
                description="Cash generated from core business operations"
            ),
            DashboardMetric(
                name="Free Cash Flow",
                value=free_cash_flow,
                category=MetricCategory.CASH_FLOW,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="currency",
                format_type="currency",
                display_order=2,
                description="Cash available after capital expenditures"
            ),
            DashboardMetric(
                name="Net Cash Flow",
                value=net_cash_flow,
                category=MetricCategory.CASH_FLOW,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="currency",
                format_type="currency",
                display_order=3,
                description="Total change in cash position"
            ),
        ])
        
        return metrics

    def _calculate_balance_sheet_metrics(self, files_data: List[Dict[str, Any]], period_dates: Dict[str, datetime]) -> List[DashboardMetric]:
        """Calculate balance sheet metrics from files data."""
        
        metrics = []
        
        total_assets = 0
        total_liabilities = 0
        total_equity = 0
        current_assets = 0
        current_liabilities = 0
        
        for file_data in files_data:
            extracted = file_data.get("extracted_data", {})
            financial_metrics = extracted.get("financial_metrics", [])
            
            for metric in financial_metrics:
                if isinstance(metric, dict):
                    metric_name = metric.get("name", "").lower()
                    metric_value = metric.get("value", 0)
                    
                    if "total assets" in metric_name:
                        total_assets += float(metric_value)
                    elif "total liabilities" in metric_name:
                        total_liabilities += float(metric_value)
                    elif "total equity" in metric_name:
                        total_equity += float(metric_value)
                    elif "current assets" in metric_name:
                        current_assets += float(metric_value)
                    elif "current liabilities" in metric_name:
                        current_liabilities += float(metric_value)
        
        # Calculate ratios
        debt_to_equity = (total_liabilities / total_equity) if total_equity > 0 else 0
        current_ratio = (current_assets / current_liabilities) if current_liabilities > 0 else 0
        
        metrics.extend([
            DashboardMetric(
                name="Total Assets",
                value=total_assets,
                category=MetricCategory.BALANCE_SHEET,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="currency",
                format_type="currency",
                display_order=1,
                description="Total assets owned by the company"
            ),
            DashboardMetric(
                name="Total Liabilities",
                value=total_liabilities,
                category=MetricCategory.BALANCE_SHEET,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="currency",
                format_type="currency",
                display_order=2,
                description="Total debts and obligations"
            ),
            DashboardMetric(
                name="Total Equity",
                value=total_equity,
                category=MetricCategory.BALANCE_SHEET,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="currency",
                format_type="currency",
                display_order=3,
                description="Shareholders' equity"
            ),
            DashboardMetric(
                name="Debt-to-Equity Ratio",
                value=debt_to_equity,
                category=MetricCategory.RATIOS,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="ratio",
                format_type="number",
                display_order=4,
                description="Total debt divided by total equity"
            ),
            DashboardMetric(
                name="Current Ratio",
                value=current_ratio,
                category=MetricCategory.RATIOS,
                period=period_dates["start_date"].strftime("%Y-%m-%d"),
                unit="ratio",
                format_type="number",
                display_order=5,
                description="Current assets divided by current liabilities"
            ),
        ])
        
        return metrics

    def _generate_revenue_trend_chart(self, files_data: List[Dict[str, Any]], period_dates: Dict[str, datetime]) -> List[ChartDataPoint]:
        """Generate revenue trend chart data."""
        
        chart_data = []
        
        for file_data in files_data:
            extracted = file_data.get("extracted_data", {})
            time_series = extracted.get("time_series_data", [])
            
            for series in time_series:
                if isinstance(series, dict) and "revenue" in series.get("metric_name", "").lower():
                    data_points = series.get("data_points", [])
                    for point in data_points:
                        chart_data.append(ChartDataPoint(
                            period=point.get("period", ""),
                            value=float(point.get("value", 0)),
                            date=datetime.fromisoformat(point.get("date", datetime.utcnow().isoformat())),
                            label="Revenue",
                            category="revenue"
                        ))
        
        # Sort by date
        chart_data.sort(key=lambda x: x.date)
        
        return chart_data

    def _generate_profit_margin_chart(self, files_data: List[Dict[str, Any]], period_dates: Dict[str, datetime]) -> List[ChartDataPoint]:
        """Generate profit margin trend chart data."""
        # Implementation similar to revenue trend but for margins
        return []

    def _generate_expense_breakdown_chart(self, files_data: List[Dict[str, Any]], period_dates: Dict[str, datetime]) -> List[ChartDataPoint]:
        """Generate expense breakdown chart data."""
        # Implementation for expense categories breakdown
        return []

    def _generate_cash_waterfall_chart(self, files_data: List[Dict[str, Any]], period_dates: Dict[str, datetime]) -> List[ChartDataPoint]:
        """Generate cash flow waterfall chart data."""
        # Implementation for waterfall chart
        return []

    def _generate_cash_position_chart(self, files_data: List[Dict[str, Any]], period_dates: Dict[str, datetime]) -> List[ChartDataPoint]:
        """Generate cash position trend chart data."""
        # Implementation for cash position over time
        return []

    def _generate_assets_breakdown_chart(self, files_data: List[Dict[str, Any]], period_dates: Dict[str, datetime]) -> List[ChartDataPoint]:
        """Generate assets breakdown chart data."""
        # Implementation for assets breakdown
        return []

    def _generate_financial_ratios_chart(self, files_data: List[Dict[str, Any]], period_dates: Dict[str, datetime]) -> List[ChartDataPoint]:
        """Generate financial ratios trend chart data."""
        # Implementation for financial ratios over time
        return []

    def _empty_dashboard_data(self, message: str) -> DashboardData:
        """Return empty dashboard data with message."""
        return DashboardData(
            metrics=[],
            charts={},
            period_info={"message": message},
            last_updated=datetime.utcnow(),
            data_quality_score=0.0
        )

    def _get_file_data(self, user_id: int, file_id: int) -> Optional[Dict[str, Any]]:
        """Get specific file data for scenario comparison."""
        file = (
            self.db.query(UploadedFile)
            .filter(
                and_(
                    UploadedFile.id == file_id,
                    UploadedFile.user_id == user_id,
                    UploadedFile.status == FileStatus.COMPLETED,
                )
            )
            .first()
        )
        
        if file and file.extracted_data:
            try:
                return json.loads(file.extracted_data) if isinstance(file.extracted_data, str) else file.extracted_data
            except (json.JSONDecodeError, TypeError):
                return None
        
        return None

    def _extract_specific_metrics(self, file_data: Dict[str, Any], metric_names: List[str]) -> Dict[str, float]:
        """Extract specific metrics from file data."""
        metrics = {}
        financial_metrics = file_data.get("financial_metrics", [])
        
        for metric in financial_metrics:
            if isinstance(metric, dict):
                name = metric.get("name", "")
                value = metric.get("value", 0)
                
                for target_metric in metric_names:
                    if target_metric.lower() in name.lower():
                        metrics[target_metric] = float(value)
        
        return metrics

    def _calculate_scenario_variance(self, scenarios_data: Dict[str, Dict[str, float]], metrics: List[str]) -> Dict[str, Any]:
        """Calculate variance analysis between scenarios."""
        variance_analysis = {}
        
        if len(scenarios_data) < 2:
            return variance_analysis
        
        scenario_keys = list(scenarios_data.keys())
        base_scenario = scenarios_data[scenario_keys[0]]
        
        for metric in metrics:
            if metric in base_scenario:
                base_value = base_scenario[metric]
                variances = []
                
                for scenario_key in scenario_keys[1:]:
                    scenario = scenarios_data[scenario_key]
                    if metric in scenario:
                        scenario_value = scenario[metric]
                        variance = scenario_value - base_value
                        variance_pct = (variance / base_value * 100) if base_value != 0 else 0
                        
                        variances.append({
                            "scenario": scenario_key,
                            "value": scenario_value,
                            "variance": variance,
                            "variance_percentage": variance_pct
                        })
                
                variance_analysis[metric] = {
                    "base_value": base_value,
                    "variances": variances
                }
        
        return variance_analysis

    def _generate_scenario_comparison_charts(self, scenarios_data: Dict[str, Dict[str, float]], metrics: List[str]) -> Dict[str, List[ChartDataPoint]]:
        """Generate chart data for scenario comparison."""
        chart_data = {}
        
        for metric in metrics:
            data_points = []
            
            for scenario_key, scenario_data in scenarios_data.items():
                if metric in scenario_data:
                    data_points.append(ChartDataPoint(
                        period=scenario_key.replace("scenario_", "Scenario "),
                        value=scenario_data[metric],
                        date=datetime.utcnow(),
                        label=metric,
                        category="scenario_comparison"
                    ))
            
            chart_data[metric] = data_points
        
        return chart_data 