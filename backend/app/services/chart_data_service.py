"""
Chart Data Service for transforming financial data into chart-ready formats.

Provides data transformation utilities for various chart types including
line charts, bar charts, pie charts, waterfall charts, and area charts.
"""
from typing import Dict, List, Any, Optional, Union, Tuple
from datetime import datetime, date
from dataclasses import dataclass
from enum import Enum
import json

from app.models.financial import FinancialStatement, StatementType
from app.services.metrics_calculation_service import TimeSeriesData


class ChartType(Enum):
    """Chart type enumeration."""
    LINE = "line"
    BAR = "bar"
    PIE = "pie"
    WATERFALL = "waterfall"
    AREA = "area"
    HEATMAP = "heatmap"
    SCATTER = "scatter"


class TimeGranularity(Enum):
    """Time granularity for time-series charts."""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"


@dataclass
class ChartDataPoint:
    """Single data point for charts."""
    x: Union[str, float, datetime]
    y: float
    label: Optional[str] = None
    color: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class ChartSeries:
    """Chart series data structure."""
    name: str
    data: List[ChartDataPoint]
    type: ChartType
    color: Optional[str] = None
    options: Optional[Dict[str, Any]] = None


@dataclass
class ChartDataset:
    """Complete chart dataset."""
    title: str
    subtitle: Optional[str]
    series: List[ChartSeries]
    chart_type: ChartType
    x_axis_title: Optional[str] = None
    y_axis_title: Optional[str] = None
    currency: Optional[str] = "USD"
    unit: Optional[str] = None
    responsive: bool = True
    options: Optional[Dict[str, Any]] = None


class ChartDataService:
    """Service for transforming financial data into chart-ready formats."""

    def __init__(self):
        self.color_palette = [
            "#3b82f6",  # Blue
            "#ef4444",  # Red  
            "#10b981",  # Green
            "#f59e0b",  # Yellow
            "#8b5cf6",  # Purple
            "#06b6d4",  # Cyan
            "#f97316",  # Orange
            "#84cc16",  # Lime
            "#ec4899",  # Pink
            "#6b7280",  # Gray
        ]

    # ====================
    # Time Series Charts (Line, Area)
    # ====================

    def create_revenue_trend_chart(
        self, 
        statements: List[FinancialStatement],
        granularity: TimeGranularity = TimeGranularity.MONTHLY
    ) -> ChartDataset:
        """Create revenue trend line chart."""
        
        # Filter P&L statements and sort by date
        pl_statements = [
            stmt for stmt in statements 
            if stmt.statement_type == StatementType.PROFIT_LOSS
        ]
        pl_statements.sort(key=lambda x: x.period_start)
        
        revenue_data = []
        for stmt in pl_statements:
            line_items = stmt.line_items or {}
            revenue = self._extract_numeric_value(line_items, [
                "revenue", "total_revenue", "net_sales", "sales"
            ])
            
            if revenue is not None:
                period_label = self._format_period_label(stmt.period_start, granularity)
                revenue_data.append(ChartDataPoint(
                    x=period_label,
                    y=revenue,
                    label=f"${revenue:,.0f}",
                    metadata={
                        "statement_id": stmt.id,
                        "period_start": stmt.period_start.isoformat(),
                        "period_end": stmt.period_end.isoformat(),
                    }
                ))
        
        series = ChartSeries(
            name="Revenue",
            data=revenue_data,
            type=ChartType.LINE,
            color=self.color_palette[0]
        )
        
        return ChartDataset(
            title="Revenue Trend",
            subtitle=f"Revenue performance over time ({granularity.value})",
            series=[series],
            chart_type=ChartType.LINE,
            x_axis_title="Period",
            y_axis_title="Revenue",
            currency="USD",
            options={
                "showDots": True,
                "smooth": True,
                "showGrid": True,
                "showTooltip": True,
            }
        )

    def create_cash_flow_trend_chart(
        self, 
        statements: List[FinancialStatement],
        flow_types: List[str] = None
    ) -> ChartDataset:
        """Create cash flow trend chart with multiple series."""
        
        if flow_types is None:
            flow_types = ["operating_cash_flow", "investing_cash_flow", "financing_cash_flow"]
        
        # Filter cash flow statements
        cf_statements = [
            stmt for stmt in statements 
            if stmt.statement_type == StatementType.CASH_FLOW
        ]
        cf_statements.sort(key=lambda x: x.period_start)
        
        series_list = []
        
        for i, flow_type in enumerate(flow_types):
            flow_data = []
            
            for stmt in cf_statements:
                line_items = stmt.line_items or {}
                flow_value = self._extract_numeric_value(line_items, [
                    flow_type, flow_type.replace("_", " "), flow_type.replace("_", "")
                ])
                
                if flow_value is not None:
                    period_label = self._format_period_label(stmt.period_start, TimeGranularity.QUARTERLY)
                    flow_data.append(ChartDataPoint(
                        x=period_label,
                        y=flow_value,
                        label=f"${flow_value:,.0f}",
                        metadata={"statement_id": stmt.id, "flow_type": flow_type}
                    ))
            
            if flow_data:
                series_list.append(ChartSeries(
                    name=flow_type.replace("_", " ").title(),
                    data=flow_data,
                    type=ChartType.LINE,
                    color=self.color_palette[i % len(self.color_palette)]
                ))
        
        return ChartDataset(
            title="Cash Flow Trends",
            subtitle="Cash flow by category over time",
            series=series_list,
            chart_type=ChartType.LINE,
            x_axis_title="Period",
            y_axis_title="Cash Flow",
            currency="USD",
            options={
                "showLegend": True,
                "showGrid": True,
                "multiSeries": True,
            }
        )

    # ====================
    # Composition Charts (Pie, Bar)
    # ====================

    def create_expense_breakdown_chart(
        self, 
        statement: FinancialStatement,
        expense_categories: List[str] = None
    ) -> ChartDataset:
        """Create expense breakdown pie chart."""
        
        if expense_categories is None:
            expense_categories = [
                "cost_of_goods_sold", "salaries_wages", "rent_utilities", 
                "marketing_advertising", "research_development", "other_expenses"
            ]
        
        line_items = statement.line_items or {}
        expense_data = []
        total_expenses = 0
        
        for category in expense_categories:
            expense_value = self._extract_numeric_value(line_items, [
                category, category.replace("_", " "), category.replace("_", "")
            ])
            
            if expense_value and expense_value > 0:
                expense_data.append(ChartDataPoint(
                    x=category.replace("_", " ").title(),
                    y=expense_value,
                    label=f"${expense_value:,.0f}",
                    metadata={"category": category, "percentage": 0}  # Will calculate below
                ))
                total_expenses += expense_value
        
        # Calculate percentages
        for i, data_point in enumerate(expense_data):
            percentage = (data_point.y / total_expenses) * 100
            expense_data[i].metadata["percentage"] = percentage
            expense_data[i].color = self.color_palette[i % len(self.color_palette)]
        
        series = ChartSeries(
            name="Expenses",
            data=expense_data,
            type=ChartType.PIE,
            options={
                "showPercentages": True,
                "showLabels": True,
            }
        )
        
        return ChartDataset(
            title="Expense Breakdown",
            subtitle=f"Expense composition for {statement.period_start.strftime('%Y-%m')}",
            series=[series],
            chart_type=ChartType.PIE,
            currency="USD",
            options={
                "responsive": True,
                "maintainAspectRatio": False,
            }
        )

    def create_asset_composition_chart(
        self, 
        statement: FinancialStatement
    ) -> ChartDataset:
        """Create asset composition pie chart from balance sheet."""
        
        line_items = statement.line_items or {}
        
        asset_categories = [
            ("current_assets", "Current Assets"),
            ("fixed_assets", "Fixed Assets"), 
            ("intangible_assets", "Intangible Assets"),
            ("other_assets", "Other Assets")
        ]
        
        asset_data = []
        total_assets = self._extract_numeric_value(line_items, ["total_assets"]) or 0
        
        for i, (category_key, category_name) in enumerate(asset_categories):
            asset_value = self._extract_numeric_value(line_items, [
                category_key, category_key.replace("_", " ")
            ])
            
            if asset_value and asset_value > 0:
                percentage = (asset_value / total_assets) * 100 if total_assets > 0 else 0
                asset_data.append(ChartDataPoint(
                    x=category_name,
                    y=asset_value,
                    label=f"${asset_value:,.0f}",
                    color=self.color_palette[i % len(self.color_palette)],
                    metadata={
                        "category": category_key,
                        "percentage": percentage
                    }
                ))
        
        series = ChartSeries(
            name="Assets",
            data=asset_data,
            type=ChartType.PIE
        )
        
        return ChartDataset(
            title="Asset Composition",
            subtitle=f"Asset breakdown as of {statement.period_end.strftime('%Y-%m-%d')}",
            series=[series],
            chart_type=ChartType.PIE,
            currency="USD"
        )

    # ====================
    # Comparison Charts (Bar)
    # ====================

    def create_period_comparison_chart(
        self, 
        statements: List[FinancialStatement],
        metrics: List[str] = None
    ) -> ChartDataset:
        """Create period-over-period comparison bar chart."""
        
        if metrics is None:
            metrics = ["revenue", "gross_profit", "net_income"]
        
        # Sort statements by period
        statements.sort(key=lambda x: x.period_start)
        
        series_list = []
        
        for i, metric in enumerate(metrics):
            metric_data = []
            
            for stmt in statements:
                line_items = stmt.line_items or {}
                value = self._extract_numeric_value(line_items, [
                    metric, metric.replace("_", " ")
                ])
                
                if value is not None:
                    period_label = self._format_period_label(stmt.period_start, TimeGranularity.QUARTERLY)
                    metric_data.append(ChartDataPoint(
                        x=period_label,
                        y=value,
                        label=f"${value:,.0f}",
                        metadata={
                            "statement_id": stmt.id,
                            "metric": metric
                        }
                    ))
            
            if metric_data:
                series_list.append(ChartSeries(
                    name=metric.replace("_", " ").title(),
                    data=metric_data,
                    type=ChartType.BAR,
                    color=self.color_palette[i % len(self.color_palette)]
                ))
        
        return ChartDataset(
            title="Period Comparison",
            subtitle="Key metrics comparison across periods",
            series=series_list,
            chart_type=ChartType.BAR,
            x_axis_title="Period",
            y_axis_title="Amount",
            currency="USD",
            options={
                "showLegend": True,
                "groupedBars": True,
            }
        )

    def create_margin_analysis_chart(
        self, 
        statements: List[FinancialStatement]
    ) -> ChartDataset:
        """Create margin analysis chart showing different margin types."""
        
        pl_statements = [
            stmt for stmt in statements 
            if stmt.statement_type == StatementType.PROFIT_LOSS
        ]
        pl_statements.sort(key=lambda x: x.period_start)
        
        margin_types = [
            ("gross_margin", "Gross Margin"),
            ("operating_margin", "Operating Margin"),
            ("net_margin", "Net Margin")
        ]
        
        series_list = []
        
        for i, (margin_key, margin_name) in enumerate(margin_types):
            margin_data = []
            
            for stmt in pl_statements:
                line_items = stmt.line_items or {}
                
                # Calculate margin based on revenue and relevant profit measure
                revenue = self._extract_numeric_value(line_items, ["revenue", "total_revenue"])
                
                if revenue and revenue > 0:
                    if margin_key == "gross_margin":
                        profit = self._extract_numeric_value(line_items, ["gross_profit"])
                    elif margin_key == "operating_margin":
                        profit = self._extract_numeric_value(line_items, ["operating_income", "operating_profit"])
                    else:  # net_margin
                        profit = self._extract_numeric_value(line_items, ["net_income", "net_profit"])
                    
                    if profit is not None:
                        margin_percentage = (profit / revenue) * 100
                        period_label = self._format_period_label(stmt.period_start, TimeGranularity.QUARTERLY)
                        
                        margin_data.append(ChartDataPoint(
                            x=period_label,
                            y=margin_percentage,
                            label=f"{margin_percentage:.1f}%",
                            metadata={
                                "statement_id": stmt.id,
                                "margin_type": margin_key,
                                "profit_amount": profit,
                                "revenue_amount": revenue
                            }
                        ))
            
            if margin_data:
                series_list.append(ChartSeries(
                    name=margin_name,
                    data=margin_data,
                    type=ChartType.BAR,
                    color=self.color_palette[i % len(self.color_palette)]
                ))
        
        return ChartDataset(
            title="Margin Analysis",
            subtitle="Profitability margins over time",
            series=series_list,
            chart_type=ChartType.BAR,
            x_axis_title="Period",
            y_axis_title="Margin (%)",
            unit="percentage",
            options={
                "showLegend": True,
                "yAxisMax": 100,
                "yAxisMin": -20,
            }
        )

    # ====================
    # Waterfall Charts
    # ====================

    def create_cash_flow_waterfall_chart(
        self, 
        statement: FinancialStatement,
        starting_cash: Optional[float] = None
    ) -> ChartDataset:
        """Create cash flow waterfall chart."""
        
        line_items = statement.line_items or {}
        
        # Extract cash flow components
        operating_cf = self._extract_numeric_value(line_items, [
            "operating_cash_flow", "cash_from_operations"
        ]) or 0
        
        investing_cf = self._extract_numeric_value(line_items, [
            "investing_cash_flow", "cash_from_investing"
        ]) or 0
        
        financing_cf = self._extract_numeric_value(line_items, [
            "financing_cash_flow", "cash_from_financing"
        ]) or 0
        
        # Calculate starting cash if not provided
        if starting_cash is None:
            starting_cash = self._extract_numeric_value(line_items, [
                "beginning_cash", "opening_cash_balance"
            ]) or 100000  # Default fallback
        
        ending_cash = starting_cash + operating_cf + investing_cf + financing_cf
        
        waterfall_data = [
            ChartDataPoint(
                x="Starting Cash",
                y=starting_cash,
                label=f"${starting_cash:,.0f}",
                metadata={"type": "start", "cumulative": starting_cash}
            ),
            ChartDataPoint(
                x="Operating Activities",
                y=operating_cf,
                label=f"${operating_cf:,.0f}",
                color=self.color_palette[2] if operating_cf >= 0 else self.color_palette[1],
                metadata={"type": "positive" if operating_cf >= 0 else "negative", "cumulative": starting_cash + operating_cf}
            ),
            ChartDataPoint(
                x="Investing Activities", 
                y=investing_cf,
                label=f"${investing_cf:,.0f}",
                color=self.color_palette[2] if investing_cf >= 0 else self.color_palette[1],
                metadata={"type": "positive" if investing_cf >= 0 else "negative", "cumulative": starting_cash + operating_cf + investing_cf}
            ),
            ChartDataPoint(
                x="Financing Activities",
                y=financing_cf,
                label=f"${financing_cf:,.0f}",
                color=self.color_palette[2] if financing_cf >= 0 else self.color_palette[1],
                metadata={"type": "positive" if financing_cf >= 0 else "negative", "cumulative": ending_cash}
            ),
            ChartDataPoint(
                x="Ending Cash",
                y=ending_cash,
                label=f"${ending_cash:,.0f}",
                color=self.color_palette[0],
                metadata={"type": "total", "cumulative": ending_cash}
            )
        ]
        
        series = ChartSeries(
            name="Cash Flow",
            data=waterfall_data,
            type=ChartType.WATERFALL
        )
        
        return ChartDataset(
            title="Cash Flow Waterfall",
            subtitle=f"Cash flow analysis for {statement.period_start.strftime('%Y-%m')}",
            series=[series],
            chart_type=ChartType.WATERFALL,
            x_axis_title="Cash Flow Components",
            y_axis_title="Amount",
            currency="USD",
            options={
                "showConnectors": True,
                "showGrid": True,
            }
        )

    # ====================
    # Financial Ratios Charts
    # ====================

    def create_liquidity_ratios_chart(
        self, 
        statements: List[FinancialStatement]
    ) -> ChartDataset:
        """Create liquidity ratios trend chart."""
        
        bs_statements = [
            stmt for stmt in statements 
            if stmt.statement_type == StatementType.BALANCE_SHEET
        ]
        bs_statements.sort(key=lambda x: x.period_start)
        
        ratio_types = [
            ("current_ratio", "Current Ratio"),
            ("quick_ratio", "Quick Ratio"),
            ("cash_ratio", "Cash Ratio")
        ]
        
        series_list = []
        
        for i, (ratio_key, ratio_name) in enumerate(ratio_types):
            ratio_data = []
            
            for stmt in bs_statements:
                line_items = stmt.line_items or {}
                
                # Calculate ratios
                current_assets = self._extract_numeric_value(line_items, ["current_assets"])
                current_liabilities = self._extract_numeric_value(line_items, ["current_liabilities"])
                
                if current_assets and current_liabilities and current_liabilities > 0:
                    if ratio_key == "current_ratio":
                        ratio_value = current_assets / current_liabilities
                    elif ratio_key == "quick_ratio":
                        inventory = self._extract_numeric_value(line_items, ["inventory"]) or 0
                        quick_assets = current_assets - inventory
                        ratio_value = quick_assets / current_liabilities
                    else:  # cash_ratio
                        cash = self._extract_numeric_value(line_items, ["cash", "cash_and_equivalents"]) or 0
                        ratio_value = cash / current_liabilities
                    
                    period_label = self._format_period_label(stmt.period_start, TimeGranularity.QUARTERLY)
                    ratio_data.append(ChartDataPoint(
                        x=period_label,
                        y=ratio_value,
                        label=f"{ratio_value:.2f}",
                        metadata={
                            "statement_id": stmt.id,
                            "ratio_type": ratio_key
                        }
                    ))
            
            if ratio_data:
                series_list.append(ChartSeries(
                    name=ratio_name,
                    data=ratio_data,
                    type=ChartType.LINE,
                    color=self.color_palette[i % len(self.color_palette)]
                ))
        
        return ChartDataset(
            title="Liquidity Ratios",
            subtitle="Liquidity position over time",
            series=series_list,
            chart_type=ChartType.LINE,
            x_axis_title="Period",
            y_axis_title="Ratio",
            unit="ratio",
            options={
                "showLegend": True,
                "showGrid": True,
                "yAxisMin": 0,
            }
        )

    # ====================
    # Utility Methods
    # ====================

    def _extract_numeric_value(self, data: Dict[str, Any], possible_keys: List[str]) -> Optional[float]:
        """Extract numeric value from data using possible key names."""
        
        for key in possible_keys:
            # Try exact match
            if key in data:
                value = data[key]
                if isinstance(value, (int, float)):
                    return float(value)
                elif isinstance(value, str):
                    try:
                        return float(value.replace(',', '').replace('$', '').replace('(', '-').replace(')', ''))
                    except (ValueError, TypeError):
                        continue
            
            # Try case-insensitive match
            for data_key, value in data.items():
                if data_key.lower() == key.lower():
                    if isinstance(value, (int, float)):
                        return float(value)
                    elif isinstance(value, str):
                        try:
                            return float(value.replace(',', '').replace('$', '').replace('(', '-').replace(')', ''))
                        except (ValueError, TypeError):
                            continue
        
        return None

    def _format_period_label(self, date_value: datetime, granularity: TimeGranularity) -> str:
        """Format period label based on granularity."""
        
        if granularity == TimeGranularity.DAILY:
            return date_value.strftime("%Y-%m-%d")
        elif granularity == TimeGranularity.WEEKLY:
            return f"W{date_value.isocalendar().week}-{date_value.year}"
        elif granularity == TimeGranularity.MONTHLY:
            return date_value.strftime("%Y-%m")
        elif granularity == TimeGranularity.QUARTERLY:
            quarter = (date_value.month - 1) // 3 + 1
            return f"Q{quarter} {date_value.year}"
        elif granularity == TimeGranularity.YEARLY:
            return str(date_value.year)
        else:
            return date_value.strftime("%Y-%m")

    def to_recharts_format(self, dataset: ChartDataset) -> Dict[str, Any]:
        """Convert ChartDataset to Recharts-compatible format."""
        
        if dataset.chart_type == ChartType.PIE:
            # Pie chart format
            data = []
            for series in dataset.series:
                for point in series.data:
                    data.append({
                        "name": point.x,
                        "value": point.y,
                        "fill": point.color or self.color_palette[len(data) % len(self.color_palette)],
                        "label": point.label,
                        "metadata": point.metadata
                    })
            
            return {
                "type": "pie",
                "data": data,
                "title": dataset.title,
                "subtitle": dataset.subtitle,
                "options": dataset.options or {}
            }
        
        elif dataset.chart_type == ChartType.WATERFALL:
            # Waterfall chart format
            data = []
            for series in dataset.series:
                for point in series.data:
                    data.append({
                        "name": point.x,
                        "value": point.y,
                        "type": point.metadata.get("type", "positive") if point.metadata else "positive",
                        "cumulative": point.metadata.get("cumulative", point.y) if point.metadata else point.y,
                        "fill": point.color,
                        "label": point.label
                    })
            
            return {
                "type": "waterfall",
                "data": data,
                "title": dataset.title,
                "subtitle": dataset.subtitle,
                "options": dataset.options or {}
            }
        
        else:
            # Line/Bar/Area chart format
            # Create unified data structure
            all_x_values = set()
            for series in dataset.series:
                for point in series.data:
                    all_x_values.add(point.x)
            
            sorted_x_values = sorted(all_x_values)
            data = []
            
            for x_value in sorted_x_values:
                data_point = {"period": x_value}
                
                for series in dataset.series:
                    # Find matching point in series
                    series_value = None
                    for point in series.data:
                        if point.x == x_value:
                            series_value = point.y
                            break
                    
                    data_point[series.name.lower().replace(" ", "_")] = series_value
                
                data.append(data_point)
            
            # Create series configuration
            series_config = []
            for i, series in enumerate(dataset.series):
                series_config.append({
                    "dataKey": series.name.lower().replace(" ", "_"),
                    "name": series.name,
                    "color": series.color or self.color_palette[i % len(self.color_palette)],
                    "type": series.type.value
                })
            
            return {
                "type": dataset.chart_type.value,
                "data": data,
                "series": series_config,
                "title": dataset.title,
                "subtitle": dataset.subtitle,
                "xAxisKey": "period",
                "currency": dataset.currency,
                "unit": dataset.unit,
                "options": dataset.options or {}
            }

    def to_json(self, dataset: ChartDataset) -> str:
        """Convert ChartDataset to JSON string."""
        
        recharts_format = self.to_recharts_format(dataset)
        
        # Convert datetime objects to ISO strings
        def json_serializer(obj):
            if isinstance(obj, (datetime, date)):
                return obj.isoformat()
            raise TypeError(f"Object of type {type(obj)} is not JSON serializable")
        
        return json.dumps(recharts_format, default=json_serializer, indent=2)

    def create_multi_period_comparison(
        self, 
        statements: List[FinancialStatement],
        metrics: List[str],
        comparison_type: str = "period_over_period"
    ) -> ChartDataset:
        """Create multi-period comparison chart with growth rates."""
        
        statements.sort(key=lambda x: x.period_start)
        
        if comparison_type == "year_over_year":
            # Group by year and compare same periods
            yearly_data = {}
            for stmt in statements:
                year = stmt.period_start.year
                if year not in yearly_data:
                    yearly_data[year] = []
                yearly_data[year].append(stmt)
        
        # For now, implement basic period-over-period
        series_list = []
        
        for i, metric in enumerate(metrics):
            metric_data = []
            previous_value = None
            
            for stmt in statements:
                line_items = stmt.line_items or {}
                current_value = self._extract_numeric_value(line_items, [metric])
                
                if current_value is not None:
                    growth_rate = None
                    if previous_value and previous_value != 0:
                        growth_rate = ((current_value - previous_value) / previous_value) * 100
                    
                    period_label = self._format_period_label(stmt.period_start, TimeGranularity.QUARTERLY)
                    metric_data.append(ChartDataPoint(
                        x=period_label,
                        y=current_value,
                        label=f"${current_value:,.0f}" + (f" ({growth_rate:+.1f}%)" if growth_rate else ""),
                        metadata={
                            "statement_id": stmt.id,
                            "metric": metric,
                            "growth_rate": growth_rate,
                            "previous_value": previous_value
                        }
                    ))
                    
                    previous_value = current_value
            
            if metric_data:
                series_list.append(ChartSeries(
                    name=metric.replace("_", " ").title(),
                    data=metric_data,
                    type=ChartType.BAR,
                    color=self.color_palette[i % len(self.color_palette)]
                ))
        
        return ChartDataset(
            title="Multi-Period Comparison",
            subtitle=f"Growth analysis ({comparison_type.replace('_', ' ').title()})",
            series=series_list,
            chart_type=ChartType.BAR,
            x_axis_title="Period",
            y_axis_title="Amount",
            currency="USD",
            options={
                "showLegend": True,
                "showGrowthRates": True,
                "groupedBars": True,
            }
        )