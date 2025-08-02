"""
Metrics Calculation Service for financial analysis and dashboard metrics.

Provides advanced financial ratio calculations, growth rate analysis, and performance metrics.
"""
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum
import statistics

from app.models.financial import FinancialStatement, StatementType


class MetricCategory(Enum):
    """Financial metric categories."""
    PROFITABILITY = "profitability"
    LIQUIDITY = "liquidity"
    EFFICIENCY = "efficiency"
    LEVERAGE = "leverage"
    GROWTH = "growth"
    VALUATION = "valuation"


@dataclass
class TimeSeriesData:
    """Time series data structure."""
    periods: List[str]
    values: List[float]
    dates: List[datetime]
    metric_name: str
    unit: str


@dataclass
class GrowthRates:
    """Growth rate calculations."""
    period_over_period: List[float]
    year_over_year: Optional[float]
    compound_annual_growth_rate: Optional[float]
    average_growth_rate: float


@dataclass
class Margins:
    """Profit margin calculations."""
    gross_margin: Optional[float]
    operating_margin: Optional[float]
    net_margin: Optional[float]
    ebitda_margin: Optional[float]


@dataclass
class LiquidityRatios:
    """Liquidity ratio calculations."""
    current_ratio: Optional[float]
    quick_ratio: Optional[float]
    cash_ratio: Optional[float]
    working_capital: Optional[float]
    working_capital_ratio: Optional[float]


@dataclass
class EfficiencyRatios:
    """Efficiency/Activity ratio calculations."""
    asset_turnover: Optional[float]
    inventory_turnover: Optional[float]
    receivables_turnover: Optional[float]
    days_sales_outstanding: Optional[float]
    cash_conversion_cycle: Optional[float]


@dataclass
class LeverageRatios:
    """Leverage/Debt ratio calculations."""
    debt_to_equity: Optional[float]
    debt_to_assets: Optional[float]
    equity_ratio: Optional[float]
    debt_service_coverage: Optional[float]
    interest_coverage: Optional[float]


class MetricsCalculationService:
    """Service for calculating financial metrics and ratios."""

    def __init__(self):
        pass

    # ====================
    # Growth Rate Calculations
    # ====================

    def calculate_growth_rates(self, data: TimeSeriesData) -> GrowthRates:
        """Calculate various growth rates from time series data."""
        
        if len(data.values) < 2:
            return GrowthRates(
                period_over_period=[],
                year_over_year=None,
                compound_annual_growth_rate=None,
                average_growth_rate=0.0
            )
        
        # Period-over-period growth rates
        pop_growth = []
        for i in range(1, len(data.values)):
            if data.values[i-1] != 0:
                growth = ((data.values[i] - data.values[i-1]) / data.values[i-1]) * 100
                pop_growth.append(growth)
            else:
                pop_growth.append(0.0)
        
        # Year-over-year growth (if we have enough data points)
        yoy_growth = None
        if len(data.values) >= 12:  # Assuming monthly data
            current_value = data.values[-1]
            year_ago_value = data.values[-12]
            if year_ago_value != 0:
                yoy_growth = ((current_value - year_ago_value) / year_ago_value) * 100
        
        # Compound Annual Growth Rate (CAGR)
        cagr = None
        if len(data.values) >= 2 and data.values[0] != 0:
            periods = len(data.values) - 1
            # Assume periods represent years for CAGR calculation
            years = periods / 12 if len(data.values) > 12 else periods
            if years > 0:
                cagr = (((data.values[-1] / data.values[0]) ** (1/years)) - 1) * 100
        
        # Average growth rate
        avg_growth = statistics.mean(pop_growth) if pop_growth else 0.0
        
        return GrowthRates(
            period_over_period=pop_growth,
            year_over_year=yoy_growth,
            compound_annual_growth_rate=cagr,
            average_growth_rate=avg_growth
        )

    # ====================
    # Margin Calculations
    # ====================

    def calculate_margins(self, pl_data: Dict[str, Any]) -> Margins:
        """Calculate profit margins from P&L data."""
        
        revenue = self._safe_get_numeric(pl_data, ["revenue", "total_revenue", "net_sales"])
        
        if not revenue or revenue <= 0:
            return Margins(
                gross_margin=None,
                operating_margin=None,
                net_margin=None,
                ebitda_margin=None
            )
        
        # Gross Margin = (Revenue - COGS) / Revenue
        cogs = self._safe_get_numeric(pl_data, ["cogs", "cost_of_goods_sold", "cost_of_sales"])
        gross_margin = None
        if cogs is not None:
            gross_profit = revenue - cogs
            gross_margin = (gross_profit / revenue) * 100
        
        # Operating Margin = Operating Income / Revenue
        operating_income = self._safe_get_numeric(pl_data, ["operating_income", "operating_profit", "ebit"])
        operating_margin = None
        if operating_income is not None:
            operating_margin = (operating_income / revenue) * 100
        
        # Net Margin = Net Income / Revenue
        net_income = self._safe_get_numeric(pl_data, ["net_income", "net_profit", "profit_after_tax"])
        net_margin = None
        if net_income is not None:
            net_margin = (net_income / revenue) * 100
        
        # EBITDA Margin = EBITDA / Revenue
        ebitda = self._safe_get_numeric(pl_data, ["ebitda"])
        ebitda_margin = None
        if ebitda is not None:
            ebitda_margin = (ebitda / revenue) * 100
        elif operating_income is not None:
            # Estimate EBITDA as Operating Income + Depreciation
            depreciation = self._safe_get_numeric(pl_data, ["depreciation", "depreciation_amortization"]) or 0
            estimated_ebitda = operating_income + depreciation
            ebitda_margin = (estimated_ebitda / revenue) * 100
        
        return Margins(
            gross_margin=gross_margin,
            operating_margin=operating_margin,
            net_margin=net_margin,
            ebitda_margin=ebitda_margin
        )

    # ====================
    # Liquidity Ratio Calculations
    # ====================

    def calculate_liquidity_ratios(self, bs_data: Dict[str, Any]) -> LiquidityRatios:
        """Calculate liquidity ratios from Balance Sheet data."""
        
        current_assets = self._safe_get_numeric(bs_data, ["current_assets", "total_current_assets"])
        current_liabilities = self._safe_get_numeric(bs_data, ["current_liabilities", "total_current_liabilities"])
        
        # Current Ratio = Current Assets / Current Liabilities
        current_ratio = None
        if current_assets and current_liabilities and current_liabilities > 0:
            current_ratio = current_assets / current_liabilities
        
        # Quick Ratio = (Current Assets - Inventory) / Current Liabilities
        quick_ratio = None
        if current_assets and current_liabilities and current_liabilities > 0:
            inventory = self._safe_get_numeric(bs_data, ["inventory", "inventories"]) or 0
            quick_assets = current_assets - inventory
            quick_ratio = quick_assets / current_liabilities
        
        # Cash Ratio = Cash / Current Liabilities
        cash_ratio = None
        cash = self._safe_get_numeric(bs_data, ["cash", "cash_and_equivalents", "cash_and_cash_equivalents"])
        if cash and current_liabilities and current_liabilities > 0:
            cash_ratio = cash / current_liabilities
        
        # Working Capital = Current Assets - Current Liabilities
        working_capital = None
        if current_assets and current_liabilities:
            working_capital = current_assets - current_liabilities
        
        # Working Capital Ratio = Working Capital / Total Assets
        working_capital_ratio = None
        total_assets = self._safe_get_numeric(bs_data, ["total_assets"])
        if working_capital and total_assets and total_assets > 0:
            working_capital_ratio = working_capital / total_assets
        
        return LiquidityRatios(
            current_ratio=current_ratio,
            quick_ratio=quick_ratio,
            cash_ratio=cash_ratio,
            working_capital=working_capital,
            working_capital_ratio=working_capital_ratio
        )

    # ====================
    # Efficiency Ratio Calculations
    # ====================

    def calculate_efficiency_ratios(self, statements: List[FinancialStatement]) -> EfficiencyRatios:
        """Calculate efficiency/activity ratios from multiple statements."""
        
        # Get the most recent statements of each type
        pl_statement = None
        bs_statement = None
        
        for stmt in statements:
            if stmt.statement_type == StatementType.PROFIT_LOSS and not pl_statement:
                pl_statement = stmt
            elif stmt.statement_type == StatementType.BALANCE_SHEET and not bs_statement:
                bs_statement = stmt
        
        if not pl_statement or not bs_statement:
            return EfficiencyRatios(
                asset_turnover=None,
                inventory_turnover=None,
                receivables_turnover=None,
                days_sales_outstanding=None,
                cash_conversion_cycle=None
            )
        
        pl_data = pl_statement.line_items or {}
        bs_data = bs_statement.line_items or {}
        
        revenue = self._safe_get_numeric(pl_data, ["revenue", "total_revenue", "net_sales"])
        total_assets = self._safe_get_numeric(bs_data, ["total_assets"])
        
        # Asset Turnover = Revenue / Total Assets
        asset_turnover = None
        if revenue and total_assets and total_assets > 0:
            asset_turnover = revenue / total_assets
        
        # Inventory Turnover = COGS / Average Inventory
        inventory_turnover = None
        cogs = self._safe_get_numeric(pl_data, ["cogs", "cost_of_goods_sold"])
        inventory = self._safe_get_numeric(bs_data, ["inventory", "inventories"])
        if cogs and inventory and inventory > 0:
            inventory_turnover = cogs / inventory
        
        # Receivables Turnover = Revenue / Accounts Receivable
        receivables_turnover = None
        accounts_receivable = self._safe_get_numeric(bs_data, ["accounts_receivable", "receivables"])
        if revenue and accounts_receivable and accounts_receivable > 0:
            receivables_turnover = revenue / accounts_receivable
        
        # Days Sales Outstanding = 365 / Receivables Turnover
        days_sales_outstanding = None
        if receivables_turnover and receivables_turnover > 0:
            days_sales_outstanding = 365 / receivables_turnover
        
        # Cash Conversion Cycle (simplified)
        cash_conversion_cycle = None
        if inventory_turnover and receivables_turnover:
            days_inventory_outstanding = 365 / inventory_turnover if inventory_turnover > 0 else 0
            days_payable_outstanding = 0  # Would need accounts payable data
            cash_conversion_cycle = days_inventory_outstanding + days_sales_outstanding - days_payable_outstanding
        
        return EfficiencyRatios(
            asset_turnover=asset_turnover,
            inventory_turnover=inventory_turnover,
            receivables_turnover=receivables_turnover,
            days_sales_outstanding=days_sales_outstanding,
            cash_conversion_cycle=cash_conversion_cycle
        )

    # ====================
    # Leverage/Debt Ratio Calculations
    # ====================

    def calculate_leverage_ratios(
        self, 
        bs_data: Dict[str, Any], 
        pl_data: Optional[Dict[str, Any]] = None
    ) -> LeverageRatios:
        """Calculate leverage/debt ratios from Balance Sheet and P&L data."""
        
        total_debt = self._safe_get_numeric(bs_data, ["total_debt", "total_liabilities"])
        total_equity = self._safe_get_numeric(bs_data, ["shareholders_equity", "total_equity"])
        total_assets = self._safe_get_numeric(bs_data, ["total_assets"])
        
        # Debt-to-Equity Ratio = Total Debt / Total Equity
        debt_to_equity = None
        if total_debt and total_equity and total_equity > 0:
            debt_to_equity = total_debt / total_equity
        
        # Debt-to-Assets Ratio = Total Debt / Total Assets
        debt_to_assets = None
        if total_debt and total_assets and total_assets > 0:
            debt_to_assets = total_debt / total_assets
        
        # Equity Ratio = Total Equity / Total Assets
        equity_ratio = None
        if total_equity and total_assets and total_assets > 0:
            equity_ratio = total_equity / total_assets
        
        # Interest Coverage Ratio = EBIT / Interest Expense
        interest_coverage = None
        if pl_data:
            ebit = self._safe_get_numeric(pl_data, ["ebit", "operating_income", "operating_profit"])
            interest_expense = self._safe_get_numeric(pl_data, ["interest_expense", "financial_costs"])
            if ebit and interest_expense and interest_expense > 0:
                interest_coverage = ebit / interest_expense
        
        # Debt Service Coverage Ratio (simplified)
        debt_service_coverage = None
        # This would require detailed debt service information which is typically not in standard statements
        
        return LeverageRatios(
            debt_to_equity=debt_to_equity,
            debt_to_assets=debt_to_assets,
            equity_ratio=equity_ratio,
            debt_service_coverage=debt_service_coverage,
            interest_coverage=interest_coverage
        )

    # ====================
    # Advanced Calculations
    # ====================

    def calculate_financial_ratios(self, statements: List[FinancialStatement]) -> Dict[str, Any]:
        """Calculate comprehensive financial ratios from multiple statements."""
        
        # Group statements by type
        pl_statements = [s for s in statements if s.statement_type == StatementType.PROFIT_LOSS]
        bs_statements = [s for s in statements if s.statement_type == StatementType.BALANCE_SHEET]
        cf_statements = [s for s in statements if s.statement_type == StatementType.CASH_FLOW]
        
        ratios = {
            "profitability": {},
            "liquidity": {},
            "efficiency": {},
            "leverage": {}
        }
        
        # Profitability ratios
        if pl_statements:
            latest_pl = pl_statements[0]
            margins = self.calculate_margins(latest_pl.line_items or {})
            ratios["profitability"] = {
                "gross_margin": margins.gross_margin,
                "operating_margin": margins.operating_margin,
                "net_margin": margins.net_margin,
                "ebitda_margin": margins.ebitda_margin
            }
        
        # Liquidity ratios
        if bs_statements:
            latest_bs = bs_statements[0]
            liquidity = self.calculate_liquidity_ratios(latest_bs.line_items or {})
            ratios["liquidity"] = {
                "current_ratio": liquidity.current_ratio,
                "quick_ratio": liquidity.quick_ratio,
                "cash_ratio": liquidity.cash_ratio,
                "working_capital": liquidity.working_capital
            }
        
        # Efficiency ratios
        if pl_statements and bs_statements:
            efficiency = self.calculate_efficiency_ratios(statements)
            ratios["efficiency"] = {
                "asset_turnover": efficiency.asset_turnover,
                "inventory_turnover": efficiency.inventory_turnover,
                "receivables_turnover": efficiency.receivables_turnover,
                "days_sales_outstanding": efficiency.days_sales_outstanding
            }
        
        # Leverage ratios
        if bs_statements:
            latest_bs = bs_statements[0]
            pl_data = pl_statements[0].line_items if pl_statements else None
            leverage = self.calculate_leverage_ratios(latest_bs.line_items or {}, pl_data)
            ratios["leverage"] = {
                "debt_to_equity": leverage.debt_to_equity,
                "debt_to_assets": leverage.debt_to_assets,
                "equity_ratio": leverage.equity_ratio,
                "interest_coverage": leverage.interest_coverage
            }
        
        return ratios

    def calculate_dupont_analysis(self, statements: List[FinancialStatement]) -> Dict[str, Any]:
        """Calculate DuPont ROE analysis."""
        
        pl_statement = next((s for s in statements if s.statement_type == StatementType.PROFIT_LOSS), None)
        bs_statement = next((s for s in statements if s.statement_type == StatementType.BALANCE_SHEET), None)
        
        if not pl_statement or not bs_statement:
            return {}
        
        pl_data = pl_statement.line_items or {}
        bs_data = bs_statement.line_items or {}
        
        net_income = self._safe_get_numeric(pl_data, ["net_income", "net_profit"])
        revenue = self._safe_get_numeric(pl_data, ["revenue", "total_revenue"])
        total_assets = self._safe_get_numeric(bs_data, ["total_assets"])
        shareholders_equity = self._safe_get_numeric(bs_data, ["shareholders_equity", "total_equity"])
        
        if not all([net_income, revenue, total_assets, shareholders_equity]) or \
           any(x <= 0 for x in [revenue, total_assets, shareholders_equity]):
            return {}
        
        # DuPont Components
        net_profit_margin = net_income / revenue
        asset_turnover = revenue / total_assets
        equity_multiplier = total_assets / shareholders_equity
        
        # ROE = Net Profit Margin × Asset Turnover × Equity Multiplier
        roe = net_profit_margin * asset_turnover * equity_multiplier
        
        return {
            "roe": roe * 100,  # Convert to percentage
            "net_profit_margin": net_profit_margin * 100,
            "asset_turnover": asset_turnover,
            "equity_multiplier": equity_multiplier,
            "components": {
                "profitability": net_profit_margin * 100,
                "efficiency": asset_turnover,
                "leverage": equity_multiplier
            }
        }

    # ====================
    # Time Series Analysis
    # ====================

    def create_time_series_data(
        self, 
        statements: List[FinancialStatement], 
        metric_key: str,
        metric_name: str
    ) -> TimeSeriesData:
        """Create time series data from a list of statements."""
        
        # Sort statements by period start date
        sorted_statements = sorted(statements, key=lambda x: x.period_start)
        
        periods = []
        values = []
        dates = []
        
        for statement in sorted_statements:
            line_items = statement.line_items or {}
            value = self._safe_get_numeric(line_items, [metric_key])
            
            if value is not None:
                periods.append(statement.period_start.strftime("%Y-%m"))
                values.append(value)
                dates.append(statement.period_start)
        
        # Determine unit based on metric name
        unit = "currency"
        if "ratio" in metric_name.lower() or "margin" in metric_name.lower():
            unit = "percentage"
        elif "turnover" in metric_name.lower():
            unit = "ratio"
        
        return TimeSeriesData(
            periods=periods,
            values=values,
            dates=dates,
            metric_name=metric_name,
            unit=unit
        )

    def calculate_trend_statistics(self, time_series: TimeSeriesData) -> Dict[str, Any]:
        """Calculate statistical measures for trend analysis."""
        
        if len(time_series.values) < 2:
            return {}
        
        values = time_series.values
        
        # Basic statistics
        mean_value = statistics.mean(values)
        median_value = statistics.median(values)
        std_deviation = statistics.stdev(values) if len(values) > 1 else 0
        
        # Trend analysis
        growth_rates = self.calculate_growth_rates(time_series)
        
        # Volatility (coefficient of variation)
        volatility = (std_deviation / mean_value) * 100 if mean_value != 0 else 0
        
        # Min/Max analysis
        min_value = min(values)
        max_value = max(values)
        value_range = max_value - min_value
        
        return {
            "mean": mean_value,
            "median": median_value,
            "standard_deviation": std_deviation,
            "volatility": volatility,
            "minimum": min_value,
            "maximum": max_value,
            "range": value_range,
            "growth_rates": {
                "average_growth": growth_rates.average_growth_rate,
                "cagr": growth_rates.compound_annual_growth_rate,
                "yoy_growth": growth_rates.year_over_year
            }
        }

    def generate_simple_forecast(
        self, 
        time_series: TimeSeriesData, 
        periods_ahead: int = 3
    ) -> List[Dict[str, Any]]:
        """Generate simple forecast based on historical trends."""
        
        if len(time_series.values) < 2:
            return []
        
        growth_rates = self.calculate_growth_rates(time_series)
        avg_growth_rate = growth_rates.average_growth_rate / 100  # Convert from percentage
        
        last_value = time_series.values[-1]
        last_date = time_series.dates[-1]
        
        forecast = []
        
        for i in range(1, periods_ahead + 1):
            # Simple compound growth projection
            forecasted_value = last_value * ((1 + avg_growth_rate) ** i)
            
            # Calculate forecast date (assuming monthly periods)
            forecast_date = last_date + timedelta(days=30 * i)
            
            forecast.append({
                "period": forecast_date.strftime("%Y-%m"),
                "value": forecasted_value,
                "date": forecast_date.isoformat(),
                "type": "forecast",
                "confidence": max(0.5, 1.0 - (i * 0.1))  # Decreasing confidence
            })
        
        return forecast

    # ====================
    # Utility Methods
    # ====================

    def _safe_get_numeric(self, data: Dict[str, Any], possible_keys: List[str]) -> Optional[float]:
        """Safely extract a numeric value from data using possible key names."""
        
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

    def calculate_percentile_ranks(self, values: List[float], benchmarks: Dict[str, float]) -> Dict[str, float]:
        """Calculate percentile ranks against industry benchmarks."""
        
        if not values or not benchmarks:
            return {}
        
        current_value = values[-1]  # Use most recent value
        percentile_ranks = {}
        
        for benchmark_name, benchmark_value in benchmarks.items():
            if benchmark_value != 0:
                percentile_rank = (current_value / benchmark_value) * 100
                percentile_ranks[benchmark_name] = percentile_rank
        
        return percentile_ranks

    def identify_outliers(self, values: List[float], method: str = "iqr") -> List[int]:
        """Identify outliers in a series of values."""
        
        if len(values) < 4:
            return []
        
        outlier_indices = []
        
        if method == "iqr":
            # Interquartile Range method
            sorted_values = sorted(values)
            n = len(sorted_values)
            
            q1 = sorted_values[n // 4]
            q3 = sorted_values[3 * n // 4]
            iqr = q3 - q1
            
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            
            for i, value in enumerate(values):
                if value < lower_bound or value > upper_bound:
                    outlier_indices.append(i)
        
        elif method == "zscore":
            # Z-score method
            mean_val = statistics.mean(values)
            std_val = statistics.stdev(values) if len(values) > 1 else 0
            
            if std_val > 0:
                for i, value in enumerate(values):
                    z_score = abs(value - mean_val) / std_val
                    if z_score > 2.5:  # Threshold for outlier
                        outlier_indices.append(i)
        
        return outlier_indices