"""
Chart Data Models for dashboard visualizations.

Pydantic models for chart data serialization and validation.
"""
from typing import Dict, List, Any, Optional, Union
from datetime import datetime
from pydantic import BaseModel, Field, validator
from enum import Enum


class ChartType(str, Enum):
    """Chart type enumeration."""
    LINE = "line"
    BAR = "bar"
    PIE = "pie"
    WATERFALL = "waterfall"
    AREA = "area"
    HEATMAP = "heatmap"
    SCATTER = "scatter"


class ChartDataPoint(BaseModel):
    """Single chart data point model."""
    x: Union[str, float, datetime]
    y: float
    label: Optional[str] = None
    color: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class ChartSeries(BaseModel):
    """Chart series model."""
    name: str
    data: List[ChartDataPoint]
    type: ChartType
    color: Optional[str] = None
    options: Optional[Dict[str, Any]] = None


class ChartDataset(BaseModel):
    """Complete chart dataset model."""
    title: str
    subtitle: Optional[str] = None
    series: List[ChartSeries]
    chart_type: ChartType
    x_axis_title: Optional[str] = None
    y_axis_title: Optional[str] = None
    currency: Optional[str] = "USD"
    unit: Optional[str] = None
    responsive: bool = True
    options: Optional[Dict[str, Any]] = None


class RechartsDataPoint(BaseModel):
    """Recharts-compatible data point."""
    period: str
    value: Optional[float] = None
    
    # Dynamic fields for different metrics
    class Config:
        extra = "allow"


class RechartsSeriesConfig(BaseModel):
    """Recharts series configuration."""
    dataKey: str
    name: str
    color: str
    type: ChartType


class RechartsPieDataPoint(BaseModel):
    """Recharts pie chart data point."""
    name: str
    value: float
    fill: str
    label: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class RechartsWaterfallDataPoint(BaseModel):
    """Recharts waterfall chart data point."""
    name: str
    value: float
    type: str = Field(..., pattern="^(start|positive|negative|total)$")
    cumulative: float
    fill: Optional[str] = None
    label: Optional[str] = None


class RechartsChartData(BaseModel):
    """Recharts-compatible chart data structure."""
    type: ChartType
    data: Union[List[RechartsDataPoint], List[RechartsPieDataPoint], List[RechartsWaterfallDataPoint]]
    series: Optional[List[RechartsSeriesConfig]] = None
    title: str
    subtitle: Optional[str] = None
    xAxisKey: Optional[str] = "period"
    currency: Optional[str] = "USD"
    unit: Optional[str] = None
    options: Optional[Dict[str, Any]] = None


class DashboardChartData(BaseModel):
    """Dashboard chart data container."""
    revenue_trend: Optional[RechartsChartData] = None
    expense_breakdown: Optional[RechartsChartData] = None
    cash_flow_waterfall: Optional[RechartsChartData] = None
    asset_composition: Optional[RechartsChartData] = None
    margin_analysis: Optional[RechartsChartData] = None
    liquidity_ratios: Optional[RechartsChartData] = None
    period_comparison: Optional[RechartsChartData] = None
    cash_flow_trend: Optional[RechartsChartData] = None


class MetricValue(BaseModel):
    """Financial metric value with metadata."""
    value: float
    unit: str = "USD"
    format_type: str = "currency"  # currency, percentage, number, ratio
    period: str
    change: Optional[float] = None
    change_percentage: Optional[float] = None
    trend: Optional[str] = None  # up, down, stable
    benchmark: Optional[float] = None
    status: Optional[str] = None  # good, warning, poor


class KeyMetrics(BaseModel):
    """Key financial metrics for dashboard."""
    revenue: Optional[MetricValue] = None
    net_income: Optional[MetricValue] = None
    gross_margin: Optional[MetricValue] = None
    operating_margin: Optional[MetricValue] = None
    current_ratio: Optional[MetricValue] = None
    debt_to_equity: Optional[MetricValue] = None
    return_on_assets: Optional[MetricValue] = None
    return_on_equity: Optional[MetricValue] = None
    operating_cash_flow: Optional[MetricValue] = None
    free_cash_flow: Optional[MetricValue] = None


class PeriodInfo(BaseModel):
    """Period information for dashboard."""
    period: str
    start_date: datetime
    end_date: datetime
    granularity: str = "monthly"  # daily, weekly, monthly, quarterly, yearly
    fiscal_year: Optional[int] = None


class FinancialStatementSummary(BaseModel):
    """Financial statement summary for dashboard."""
    id: int
    statement_type: str
    name: str
    period_start: datetime
    period_end: datetime
    company_name: Optional[str] = None
    file_name: Optional[str] = None
    data_quality_score: Optional[float] = None
    last_updated: datetime


class DashboardData(BaseModel):
    """Complete dashboard data model."""
    statements: List[FinancialStatementSummary]
    active_statement: Optional[FinancialStatementSummary] = None
    key_metrics: KeyMetrics
    chart_data: DashboardChartData
    period_info: PeriodInfo
    last_updated: datetime
    data_quality_score: float = Field(..., ge=0, le=1)
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class PLDashboardData(BaseModel):
    """P&L specific dashboard data."""
    statement: FinancialStatementSummary
    metrics: KeyMetrics
    charts: Dict[str, RechartsChartData]
    period_comparison: Optional[Dict[str, Any]] = None
    data_quality: Optional[Dict[str, Any]] = None


class BalanceSheetDashboardData(BaseModel):
    """Balance Sheet specific dashboard data."""
    statement: FinancialStatementSummary
    metrics: KeyMetrics
    charts: Dict[str, RechartsChartData] 
    ratios: Optional[Dict[str, Any]] = None
    data_quality: Optional[Dict[str, Any]] = None


class CashFlowDashboardData(BaseModel):
    """Cash Flow specific dashboard data."""
    statement: FinancialStatementSummary
    metrics: KeyMetrics
    charts: Dict[str, RechartsChartData]
    waterfall_data: Optional[RechartsChartData] = None
    data_quality: Optional[Dict[str, Any]] = None


class ExportData(BaseModel):
    """Data export model."""
    export_format: str = Field(..., pattern="^(PDF|EXCEL|JSON)$")
    period: str
    statements: List[FinancialStatementSummary]
    key_metrics: KeyMetrics
    chart_data: DashboardChartData
    generated_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class ChartOptions(BaseModel):
    """Chart display options."""
    responsive: bool = True
    maintainAspectRatio: bool = False
    showLegend: bool = True
    showGrid: bool = True
    showTooltip: bool = True
    showDots: bool = False
    smooth: bool = False
    multiSeries: bool = False
    groupedBars: bool = False
    showPercentages: bool = False
    showLabels: bool = True
    showConnectors: bool = False
    showGrowthRates: bool = False
    yAxisMin: Optional[float] = None
    yAxisMax: Optional[float] = None


class TimeSeriesPoint(BaseModel):
    """Time series data point."""
    date: datetime
    value: float
    period_label: str
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class TimeSeriesData(BaseModel):
    """Time series dataset."""
    metric_name: str
    unit: str = "currency"
    periods: List[str]
    values: List[float]
    dates: List[datetime]
    statistics: Optional[Dict[str, Any]] = None
    forecast: Optional[List[Dict[str, Any]]] = None
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class ComparisonResult(BaseModel):
    """Period comparison result."""
    metric: str
    period_1_value: float
    period_2_value: float
    absolute_change: float
    percentage_change: float
    significance: str = "normal"  # significant, normal, minor


class PeriodComparison(BaseModel):
    """Period-over-period comparison."""
    statement_1: FinancialStatementSummary
    statement_2: FinancialStatementSummary
    comparisons: List[ComparisonResult]
    significant_changes: List[ComparisonResult]
    summary: Dict[str, Any]
    generated_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class DataQuality(BaseModel):
    """Data quality assessment."""
    completeness: float = Field(..., ge=0, le=1)
    accuracy: float = Field(..., ge=0, le=1)
    consistency: float = Field(..., ge=0, le=1)
    overall_score: float = Field(..., ge=0, le=1)
    issues: List[str] = []
    recommendations: List[str] = []
    
    @validator('overall_score')
    def calculate_overall_score(cls, v, values):
        if 'completeness' in values and 'accuracy' in values and 'consistency' in values:
            return (values['completeness'] + values['accuracy'] + values['consistency']) / 3
        return v


class HealthCheckResult(BaseModel):
    """Dashboard health check result."""
    status: str = Field(..., regex="^(healthy|warning|unhealthy)$")
    database: str = "connected"
    cache: str = "healthy"
    data_availability: Dict[str, Any]
    timestamp: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


# Chart-specific response models

class LineChartResponse(BaseModel):
    """Line chart API response."""
    chart_data: RechartsChartData
    metadata: Dict[str, Any] = {}


class BarChartResponse(BaseModel):
    """Bar chart API response."""
    chart_data: RechartsChartData
    metadata: Dict[str, Any] = {}


class PieChartResponse(BaseModel):
    """Pie chart API response."""
    chart_data: RechartsChartData
    metadata: Dict[str, Any] = {}


class WaterfallChartResponse(BaseModel):
    """Waterfall chart API response."""
    chart_data: RechartsChartData
    metadata: Dict[str, Any] = {}


# API Response models

class DashboardOverviewResponse(BaseModel):
    """Dashboard overview API response."""
    statements: List[FinancialStatementSummary]
    active_statement: Optional[FinancialStatementSummary]
    key_metrics: KeyMetrics
    chart_data: DashboardChartData
    last_updated: datetime
    data_quality_score: float
    period_info: PeriodInfo
    generated_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class StatementDashboardResponse(BaseModel):
    """Statement-specific dashboard response."""
    statement_id: int
    statement_type: str
    period: str
    metrics: KeyMetrics
    charts: Dict[str, RechartsChartData]
    data_quality: Optional[DataQuality] = None
    generated_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class TimeSeriesResponse(BaseModel):
    """Time series API response."""
    metric_key: str
    statement_type: str
    time_series: TimeSeriesData
    statistics: Dict[str, Any]
    forecast: List[Dict[str, Any]]
    generated_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class ExportResponse(BaseModel):
    """Export API response."""
    message: str
    export_id: str
    data_summary: Dict[str, int]
    download_url: str
    expires_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }