"""
Enhanced Chart Methods for DashboardService.

Additional methods to be integrated into DashboardService for enhanced chart generation.
"""
from typing import Dict, List, Any, Optional
from app.models.financial import FinancialStatement, StatementType
from app.services.chart_data_service import (
    ChartDataService,
    TimeGranularity,
)
from app.services.metrics_calculation_service import (
    MetricsCalculationService,
)
from app.services.numeric_utils import extract_numeric_value


class EnhancedChartMethods:
    """Enhanced chart generation methods for DashboardService."""

    def __init__(
        self,
        chart_service: ChartDataService,
        metrics_service: MetricsCalculationService,
    ):
        self.chart_service = chart_service
        self.metrics_service = metrics_service

    async def generate_enhanced_dashboard_charts(
        self, statements: List[FinancialStatement], period: str
    ) -> Dict[str, Any]:
        """Generate enhanced dashboard charts using ChartDataService."""

        chart_data = {}

        # Revenue Trend Chart
        try:
            revenue_chart = self.chart_service.create_revenue_trend_chart(
                statements, TimeGranularity.MONTHLY
            )
            chart_data["revenue_trend"] = self.chart_service.to_recharts_format(
                revenue_chart
            )
        except Exception as e:
            print(f"Error generating revenue trend chart: {e}")
            chart_data["revenue_trend"] = None

        # Cash Flow Trend Chart
        try:
            cf_statements = [
                s for s in statements if s.statement_type == StatementType.CASH_FLOW
            ]
            if cf_statements:
                cf_chart = self.chart_service.create_cash_flow_trend_chart(
                    cf_statements
                )
                chart_data["cash_flow_trend"] = self.chart_service.to_recharts_format(
                    cf_chart
                )
        except Exception as e:
            print(f"Error generating cash flow trend chart: {e}")
            chart_data["cash_flow_trend"] = None

        # Expense Breakdown Chart (from most recent P&L)
        try:
            pl_statements = [
                s for s in statements if s.statement_type == StatementType.PROFIT_LOSS
            ]
            if pl_statements:
                latest_pl = pl_statements[0]  # Assuming sorted by date desc
                expense_chart = self.chart_service.create_expense_breakdown_chart(
                    latest_pl
                )
                chart_data["expense_breakdown"] = self.chart_service.to_recharts_format(
                    expense_chart
                )
        except Exception as e:
            print(f"Error generating expense breakdown chart: {e}")
            chart_data["expense_breakdown"] = None

        # Asset Composition Chart (from most recent Balance Sheet)
        try:
            bs_statements = [
                s for s in statements if s.statement_type == StatementType.BALANCE_SHEET
            ]
            if bs_statements:
                latest_bs = bs_statements[0]  # Assuming sorted by date desc
                asset_chart = self.chart_service.create_asset_composition_chart(
                    latest_bs
                )
                chart_data["asset_composition"] = self.chart_service.to_recharts_format(
                    asset_chart
                )
        except Exception as e:
            print(f"Error generating asset composition chart: {e}")
            chart_data["asset_composition"] = None

        # Cash Flow Waterfall Chart (from most recent Cash Flow statement)
        try:
            cf_statements = [
                s for s in statements if s.statement_type == StatementType.CASH_FLOW
            ]
            if cf_statements:
                latest_cf = cf_statements[0]  # Assuming sorted by date desc
                waterfall_chart = self.chart_service.create_cash_flow_waterfall_chart(
                    latest_cf
                )
                chart_data[
                    "cash_flow_waterfall"
                ] = self.chart_service.to_recharts_format(waterfall_chart)
        except Exception as e:
            print(f"Error generating cash flow waterfall chart: {e}")
            chart_data["cash_flow_waterfall"] = None

        # Margin Analysis Chart
        try:
            pl_statements = [
                s for s in statements if s.statement_type == StatementType.PROFIT_LOSS
            ]
            if len(pl_statements) >= 2:  # Need at least 2 periods for trend
                margin_chart = self.chart_service.create_margin_analysis_chart(
                    pl_statements
                )
                chart_data["margin_analysis"] = self.chart_service.to_recharts_format(
                    margin_chart
                )
        except Exception as e:
            print(f"Error generating margin analysis chart: {e}")
            chart_data["margin_analysis"] = None

        # Liquidity Ratios Chart
        try:
            bs_statements = [
                s for s in statements if s.statement_type == StatementType.BALANCE_SHEET
            ]
            if len(bs_statements) >= 2:  # Need at least 2 periods for trend
                liquidity_chart = self.chart_service.create_liquidity_ratios_chart(
                    bs_statements
                )
                chart_data["liquidity_ratios"] = self.chart_service.to_recharts_format(
                    liquidity_chart
                )
        except Exception as e:
            print(f"Error generating liquidity ratios chart: {e}")
            chart_data["liquidity_ratios"] = None

        # Period Comparison Chart
        try:
            if len(statements) >= 2:  # Need at least 2 statements for comparison
                comparison_chart = self.chart_service.create_period_comparison_chart(
                    statements,
                    ["revenue", "net_income", "total_assets"],
                )
                chart_data["period_comparison"] = self.chart_service.to_recharts_format(
                    comparison_chart
                )
        except Exception as e:
            print(f"Error generating period comparison chart: {e}")
            chart_data["period_comparison"] = None

        return chart_data

    async def generate_enhanced_pl_charts(
        self,
        statement: FinancialStatement,
        user_statements: List[FinancialStatement],
    ) -> Dict[str, Any]:
        """Generate enhanced P&L charts using ChartDataService."""

        charts = {}

        try:
            # Revenue Trend
            if len(user_statements) > 1:
                revenue_chart = self.chart_service.create_revenue_trend_chart(
                    user_statements, TimeGranularity.QUARTERLY
                )
                charts["revenue_trend"] = self.chart_service.to_recharts_format(
                    revenue_chart
                )

            # Expense Breakdown
            expense_chart = self.chart_service.create_expense_breakdown_chart(statement)
            charts["expense_breakdown"] = self.chart_service.to_recharts_format(
                expense_chart
            )

            # Margin Analysis
            if len(user_statements) > 1:
                margin_chart = self.chart_service.create_margin_analysis_chart(
                    user_statements
                )
                charts["margin_analysis"] = self.chart_service.to_recharts_format(
                    margin_chart
                )

            # Period Comparison
            if len(user_statements) >= 2:
                comparison_chart = self.chart_service.create_period_comparison_chart(
                    user_statements[:4],  # Last 4 periods
                    [
                        "revenue",
                        "gross_profit",
                        "net_income",
                        "operating_income",
                    ],
                )
                charts["period_comparison"] = self.chart_service.to_recharts_format(
                    comparison_chart
                )

        except Exception as e:
            print(f"Error generating enhanced P&L charts: {e}")

        return charts

    async def generate_enhanced_balance_sheet_charts(
        self,
        statement: FinancialStatement,
        user_statements: List[FinancialStatement],
    ) -> Dict[str, Any]:
        """Generate enhanced Balance Sheet charts using ChartDataService."""

        charts = {}

        try:
            # Asset Composition
            asset_chart = self.chart_service.create_asset_composition_chart(statement)
            charts["asset_composition"] = self.chart_service.to_recharts_format(
                asset_chart
            )

            # Liquidity Ratios Trend
            if len(user_statements) > 1:
                liquidity_chart = self.chart_service.create_liquidity_ratios_chart(
                    user_statements
                )
                charts["liquidity_ratios"] = self.chart_service.to_recharts_format(
                    liquidity_chart
                )

            # Balance Sheet Period Comparison
            if len(user_statements) >= 2:
                comparison_chart = self.chart_service.create_period_comparison_chart(
                    user_statements[:4],  # Last 4 periods
                    [
                        "total_assets",
                        "total_liabilities",
                        "shareholders_equity",
                    ],
                )
                charts[
                    "balance_sheet_comparison"
                ] = self.chart_service.to_recharts_format(comparison_chart)

        except Exception as e:
            print(f"Error generating enhanced Balance Sheet charts: {e}")

        return charts

    async def generate_enhanced_cash_flow_charts(
        self,
        statement: FinancialStatement,
        user_statements: List[FinancialStatement],
    ) -> Dict[str, Any]:
        """Generate enhanced Cash Flow charts using ChartDataService."""

        charts = {}

        try:
            # Cash Flow Waterfall
            waterfall_chart = self.chart_service.create_cash_flow_waterfall_chart(
                statement
            )
            charts["cash_flow_waterfall"] = self.chart_service.to_recharts_format(
                waterfall_chart
            )

            # Cash Flow Trends
            if len(user_statements) > 1:
                trend_chart = self.chart_service.create_cash_flow_trend_chart(
                    user_statements
                )
                charts["cash_flow_trend"] = self.chart_service.to_recharts_format(
                    trend_chart
                )

            # Cash Flow Period Comparison
            if len(user_statements) >= 2:
                comparison_chart = self.chart_service.create_period_comparison_chart(
                    user_statements[:4],  # Last 4 periods
                    [
                        "operating_cash_flow",
                        "investing_cash_flow",
                        "financing_cash_flow",
                    ],
                )
                charts["cash_flow_comparison"] = self.chart_service.to_recharts_format(
                    comparison_chart
                )

        except Exception as e:
            print(f"Error generating enhanced Cash Flow charts: {e}")

        return charts

    def calculate_enhanced_key_metrics(
        self, statements: List[FinancialStatement]
    ) -> Dict[str, Any]:
        """Calculate enhanced key metrics using MetricsCalculationService."""

        try:
            # Calculate comprehensive financial ratios
            financial_ratios = self.metrics_service.calculate_financial_ratios(
                statements
            )

            # Get latest statements by type
            latest_pl = next(
                (
                    s
                    for s in statements
                    if s.statement_type == StatementType.PROFIT_LOSS
                ),
                None,
            )
            latest_bs = next(
                (
                    s
                    for s in statements
                    if s.statement_type == StatementType.BALANCE_SHEET
                ),
                None,
            )
            latest_cf = next(
                (s for s in statements if s.statement_type == StatementType.CASH_FLOW),
                None,
            )

            metrics = {}

            # Revenue metrics
            if latest_pl:
                line_items = latest_pl.line_items or {}
                revenue = extract_numeric_value(
                    line_items, ["revenue", "total_revenue"]
                )
                if revenue:
                    metrics["revenue"] = {
                        "value": revenue,
                        "unit": "USD",
                        "format_type": "currency",
                        "period": f"{latest_pl.period_start} to {latest_pl.period_end}",
                    }

            # Profitability metrics from ratios
            if "profitability" in financial_ratios:
                prof_ratios = financial_ratios["profitability"]

                if prof_ratios.get("gross_margin"):
                    metrics["gross_margin"] = {
                        "value": prof_ratios["gross_margin"],
                        "unit": "%",
                        "format_type": "percentage",
                        "period": "current",
                    }

                if prof_ratios.get("net_margin"):
                    metrics["net_margin"] = {
                        "value": prof_ratios["net_margin"],
                        "unit": "%",
                        "format_type": "percentage",
                        "period": "current",
                    }

            # Liquidity metrics from ratios
            if "liquidity" in financial_ratios:
                liq_ratios = financial_ratios["liquidity"]

                if liq_ratios.get("current_ratio"):
                    metrics["current_ratio"] = {
                        "value": liq_ratios["current_ratio"],
                        "unit": "ratio",
                        "format_type": "number",
                        "period": "current",
                    }

            # Leverage metrics from ratios
            if "leverage" in financial_ratios:
                lev_ratios = financial_ratios["leverage"]

                if lev_ratios.get("debt_to_equity"):
                    metrics["debt_to_equity"] = {
                        "value": lev_ratios["debt_to_equity"],
                        "unit": "ratio",
                        "format_type": "number",
                        "period": "current",
                    }

            # Cash flow metrics
            if latest_cf:
                line_items = latest_cf.line_items or {}
                operating_cf = extract_numeric_value(
                    line_items, ["operating_cash_flow"]
                )
                if operating_cf:
                    metrics["operating_cash_flow"] = {
                        "value": operating_cf,
                        "unit": "USD",
                        "format_type": "currency",
                        "period": f"{latest_cf.period_start} to {latest_cf.period_end}",
                    }

            return metrics

        except Exception as e:
            print(f"Error calculating enhanced key metrics: {e}")
            return {}

    def get_time_series_chart_data(
        self, statements: List[FinancialStatement], metric_key: str
    ) -> Dict[str, Any]:
        """Get time series chart data for a specific metric."""

        try:
            # Create time series data
            time_series = self.metrics_service.create_time_series_data(
                statements=statements,
                metric_key=metric_key,
                metric_name=metric_key.replace("_", " ").title(),
            )

            # Calculate statistics
            statistics = self.metrics_service.calculate_trend_statistics(time_series)

            # Generate forecast
            forecast = self.metrics_service.generate_simple_forecast(
                time_series, periods_ahead=3
            )

            return {
                "time_series": {
                    "periods": time_series.periods,
                    "values": time_series.values,
                    "dates": [d.isoformat() for d in time_series.dates],
                    "unit": time_series.unit,
                },
                "statistics": statistics,
                "forecast": forecast,
            }

        except Exception as e:
            print(f"Error generating time series data: {e}")
            return {}

    def get_chart_data_for_frontend(
        self, chart_dataset: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Convert chart data to frontend-compatible format."""

        # This ensures data is in the correct format for React components
        if not chart_dataset or "type" not in chart_dataset:
            return {}

        chart_type = chart_dataset["type"]

        if chart_type == "pie":
            return {
                "type": "pie",
                "data": chart_dataset.get("data", []),
                "title": chart_dataset.get("title", ""),
                "subtitle": chart_dataset.get("subtitle", ""),
                "options": chart_dataset.get("options", {}),
            }
        elif chart_type == "waterfall":
            return {
                "type": "waterfall",
                "data": chart_dataset.get("data", []),
                "title": chart_dataset.get("title", ""),
                "subtitle": chart_dataset.get("subtitle", ""),
                "options": chart_dataset.get("options", {}),
            }
        else:
            # Line, bar, area charts
            return {
                "type": chart_type,
                "data": chart_dataset.get("data", []),
                "series": chart_dataset.get("series", []),
                "title": chart_dataset.get("title", ""),
                "subtitle": chart_dataset.get("subtitle", ""),
                "xAxisKey": chart_dataset.get("xAxisKey", "period"),
                "currency": chart_dataset.get("currency", "USD"),
                "unit": chart_dataset.get("unit"),
                "options": chart_dataset.get("options", {}),
            }
