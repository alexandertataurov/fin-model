"""
Enhanced Dashboard Service for real-time financial data integration.

Connects processed Excel financial statements to dashboard visualizations.
"""
import json
from typing import Dict, List, Any, Optional, Tuple, Union
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from dataclasses import dataclass
from enum import Enum

from app.models.financial import FinancialStatement, StatementType, PeriodType
from app.models.user import User
from app.models.file import UploadedFile, FileStatus
# Chart data models removed in lean version - using direct data structures
from app.services.dashboard_metrics import DashboardMetricsService
from app.services.financial_extractor import FinancialExtractor
from app.services.chart_data_service import ChartDataService, TimeGranularity
from app.services.metrics_calculation_service import MetricsCalculationService
from app.services.enhanced_chart_methods import EnhancedChartMethods


class PeriodFilter(Enum):
    """Period filter options for dashboard."""
    MTD = "mtd"
    QTD = "qtd"
    YTD = "ytd"
    LAST_30_DAYS = "last_30_days"
    LAST_90_DAYS = "last_90_days"
    LAST_12_MONTHS = "last_12_months"
    CUSTOM = "custom"


@dataclass
class DashboardData:
    """Complete dashboard data structure."""
    statements: List[Dict[str, Any]]
    active_statement: Optional[Dict[str, Any]]
    key_metrics: Dict[str, Any]
    chart_data: Dict[str, List[Dict[str, Any]]]
    last_updated: datetime
    data_quality_score: float
    period_info: Dict[str, str]


@dataclass
class KeyMetrics:
    """Key financial metrics structure."""
    revenue: Dict[str, Any]
    net_income: Dict[str, Any]
    gross_margin: Dict[str, Any]
    current_ratio: Dict[str, Any]
    debt_to_equity: Dict[str, Any]
    return_on_assets: Dict[str, Any]


@dataclass
class ChartDataset:
    """Chart data structure."""
    label: str
    data: List[Union[int, float]]
    period_labels: List[str]
    background_color: List[str]
    border_color: str
    border_width: int


class DashboardService:
    """Enhanced dashboard service with real financial data integration."""

    def __init__(self, db: Session):
        self.db = db
        self.financial_extractor = FinancialExtractor()
        self.legacy_service = DashboardMetricsService(db)
        self.chart_service = ChartDataService()
        self.metrics_service = MetricsCalculationService()
        self.enhanced_charts = EnhancedChartMethods(self.chart_service, self.metrics_service)

    # ====================
    # Main Dashboard Methods
    # ====================

    async def get_user_dashboard_data(
        self, 
        user_id: int, 
        period: PeriodFilter = PeriodFilter.YTD
    ) -> DashboardData:
        """Get complete dashboard data for a user."""
        
        # Get user's financial statements
        statements = self._get_user_statements(user_id)
        
        if not statements:
            # Fallback to demo/legacy data
            return await self._get_demo_dashboard_data(user_id, period)
        
        # Get active statement (most recent)
        active_statement = statements[0] if statements else None
        
        # Calculate key metrics
        key_metrics = await self._calculate_dashboard_key_metrics(statements, period)
        
        # Generate chart data using enhanced chart service
        chart_data = await self.enhanced_charts.generate_enhanced_dashboard_charts(statements, period.value)
        
        # Calculate data quality
        data_quality_score = self._calculate_data_quality_score(statements)
        
        # Period information
        period_info = self._get_period_info(period)
        
        return DashboardData(
            statements=[self._serialize_statement(stmt) for stmt in statements],
            active_statement=self._serialize_statement(active_statement) if active_statement else None,
            key_metrics=key_metrics,
            chart_data=chart_data,
            last_updated=datetime.utcnow(),
            data_quality_score=data_quality_score,
            period_info=period_info
        )

    async def get_pl_data(self, statement_id: int, user_id: int) -> Dict[str, Any]:
        """Get P&L dashboard data for a specific statement."""
        
        statement = self._get_statement_by_id(statement_id, user_id)
        if not statement or statement.statement_type != StatementType.PROFIT_LOSS:
            raise ValueError("P&L statement not found")
        
        # Extract P&L specific data
        pl_data = self._extract_pl_data(statement)
        
        # Generate P&L charts
        charts = await self._generate_pl_charts(statement)
        
        # Calculate P&L metrics
        metrics = self._calculate_pl_metrics(statement)
        
        return {
            "statement_id": statement_id,
            "statement_name": f"P&L - {statement.period_start} to {statement.period_end}",
            "metrics": metrics,
            "charts": charts,
            "raw_data": pl_data,
            "period_info": {
                "period": f"{statement.period_start} to {statement.period_end}",
                "start_date": statement.period_start.isoformat(),
                "end_date": statement.period_end.isoformat(),
                "period_type": statement.period_type.value
            },
            "last_updated": statement.updated_at.isoformat(),
            "data_quality_score": self._calculate_statement_quality_score(statement)
        }

    async def get_balance_sheet_data(self, statement_id: int, user_id: int) -> Dict[str, Any]:
        """Get Balance Sheet dashboard data for a specific statement."""
        
        statement = self._get_statement_by_id(statement_id, user_id)
        if not statement or statement.statement_type != StatementType.BALANCE_SHEET:
            raise ValueError("Balance Sheet statement not found")
        
        # Extract Balance Sheet specific data
        bs_data = self._extract_balance_sheet_data(statement)
        
        # Generate Balance Sheet charts
        charts = await self._generate_balance_sheet_charts(statement)
        
        # Calculate Balance Sheet metrics
        metrics = self._calculate_balance_sheet_metrics(statement)
        
        return {
            "statement_id": statement_id,
            "statement_name": f"Balance Sheet - {statement.period_end}",
            "metrics": metrics,
            "charts": charts,
            "raw_data": bs_data,
            "period_info": {
                "period": f"As of {statement.period_end}",
                "end_date": statement.period_end.isoformat(),
                "period_type": statement.period_type.value
            },
            "last_updated": statement.updated_at.isoformat(),
            "data_quality_score": self._calculate_statement_quality_score(statement)
        }

    async def get_cash_flow_data(self, statement_id: int, user_id: int) -> Dict[str, Any]:
        """Get Cash Flow dashboard data for a specific statement."""
        
        statement = self._get_statement_by_id(statement_id, user_id)
        if not statement or statement.statement_type != StatementType.CASH_FLOW:
            raise ValueError("Cash Flow statement not found")
        
        # Extract Cash Flow specific data
        cf_data = self._extract_cash_flow_data(statement)
        
        # Generate Cash Flow charts
        charts = await self._generate_cash_flow_charts(statement)
        
        # Calculate Cash Flow metrics
        metrics = self._calculate_cash_flow_metrics(statement)
        
        return {
            "statement_id": statement_id,
            "statement_name": f"Cash Flow - {statement.period_start} to {statement.period_end}",
            "metrics": metrics,
            "charts": charts,
            "raw_data": cf_data,
            "period_info": {
                "period": f"{statement.period_start} to {statement.period_end}",
                "start_date": statement.period_start.isoformat(),
                "end_date": statement.period_end.isoformat(),
                "period_type": statement.period_type.value
            },
            "last_updated": statement.updated_at.isoformat(),
            "data_quality_score": self._calculate_statement_quality_score(statement)
        }

    async def get_key_metrics(self, user_id: int, statement_ids: List[int] = None) -> Dict[str, Any]:
        """Get key financial metrics across statements."""
        
        if statement_ids:
            statements = [
                self._get_statement_by_id(stmt_id, user_id) 
                for stmt_id in statement_ids
            ]
            statements = [s for s in statements if s is not None]
        else:
            statements = self._get_user_statements(user_id, limit=5)
        
        if not statements:
            return self._get_demo_key_metrics()
        
        return await self._calculate_cross_statement_metrics(statements)

    # ====================
    # Data Processing Methods  
    # ====================

    def _get_user_statements(
        self, 
        user_id: int, 
        statement_type: Optional[StatementType] = None,
        limit: int = 10
    ) -> List[FinancialStatement]:
        """Get user's financial statements."""
        
        query = self.db.query(FinancialStatement).filter(
            FinancialStatement.created_by_id == user_id
        )
        
        if statement_type:
            query = query.filter(FinancialStatement.statement_type == statement_type)
        
        return query.order_by(desc(FinancialStatement.updated_at)).limit(limit).all()

    def _get_statement_by_id(self, statement_id: int, user_id: int) -> Optional[FinancialStatement]:
        """Get a specific statement by ID and user."""
        
        return self.db.query(FinancialStatement).filter(
            and_(
                FinancialStatement.id == statement_id,
                FinancialStatement.created_by_id == user_id
            )
        ).first()

    def _serialize_statement(self, statement: FinancialStatement) -> Dict[str, Any]:
        """Serialize a financial statement for API response."""
        
        if not statement:
            return None
            
        return {
            "id": statement.id,
            "type": statement.statement_type.value,
            "name": f"{statement.statement_type.value.replace('_', ' ').title()} - {statement.period_start} to {statement.period_end}",
            "period_start": statement.period_start.isoformat(),
            "period_end": statement.period_end.isoformat(),
            "period_type": statement.period_type.value,
            "currency": statement.currency,
            "version": statement.version,
            "is_baseline": statement.is_baseline,
            "created_at": statement.created_at.isoformat(),
            "updated_at": statement.updated_at.isoformat(),
        }

    # ====================
    # Metrics Calculation Methods
    # ====================

    async def _calculate_dashboard_key_metrics(
        self, 
        statements: List[FinancialStatement], 
        period: PeriodFilter
    ) -> Dict[str, Any]:
        """Calculate key metrics for dashboard overview."""
        
        # Group statements by type
        pl_statements = [s for s in statements if s.statement_type == StatementType.PROFIT_LOSS]
        bs_statements = [s for s in statements if s.statement_type == StatementType.BALANCE_SHEET]
        cf_statements = [s for s in statements if s.statement_type == StatementType.CASH_FLOW]
        
        metrics = {}
        
        # P&L Metrics
        if pl_statements:
            latest_pl = pl_statements[0]
            pl_data = latest_pl.line_items or {}
            
            metrics["revenue"] = {
                "name": "Revenue",
                "value": self._extract_metric_value(pl_data, ["revenue", "total_revenue", "net_sales"]),
                "format_type": "currency",
                "trend": "up",  # TODO: Calculate actual trend
                "change_percentage": 0  # TODO: Calculate vs previous period
            }
            
            metrics["net_income"] = {
                "name": "Net Income",
                "value": self._extract_metric_value(pl_data, ["net_income", "net_profit", "profit_after_tax"]),
                "format_type": "currency",
                "trend": "up",
                "change_percentage": 0
            }
            
            # Calculate gross margin
            revenue = metrics["revenue"]["value"]
            cogs = self._extract_metric_value(pl_data, ["cogs", "cost_of_goods_sold", "cost_of_sales"]) 
            if revenue and cogs:
                gross_margin = ((revenue - cogs) / revenue) * 100 if revenue > 0 else 0
                metrics["gross_margin"] = {
                    "name": "Gross Margin",
                    "value": gross_margin,
                    "format_type": "percentage",
                    "trend": "up",
                    "change_percentage": 0
                }
        
        # Balance Sheet Metrics
        if bs_statements:
            latest_bs = bs_statements[0]
            bs_data = latest_bs.line_items or {}
            
            current_assets = self._extract_metric_value(bs_data, ["current_assets", "total_current_assets"])
            current_liabilities = self._extract_metric_value(bs_data, ["current_liabilities", "total_current_liabilities"])
            
            if current_assets and current_liabilities and current_liabilities > 0:
                current_ratio = current_assets / current_liabilities
                metrics["current_ratio"] = {
                    "name": "Current Ratio",
                    "value": current_ratio,
                    "format_type": "decimal",
                    "trend": "up" if current_ratio > 1 else "down",
                    "change_percentage": 0
                }
            
            total_debt = self._extract_metric_value(bs_data, ["total_debt", "total_liabilities"])
            total_equity = self._extract_metric_value(bs_data, ["total_equity", "shareholders_equity"])
            
            if total_debt and total_equity and total_equity > 0:
                debt_to_equity = total_debt / total_equity
                metrics["debt_to_equity"] = {
                    "name": "Debt-to-Equity",
                    "value": debt_to_equity,
                    "format_type": "decimal", 
                    "trend": "down" if debt_to_equity < 1 else "up",
                    "change_percentage": 0
                }
        
        # Cash Flow Metrics
        if cf_statements:
            latest_cf = cf_statements[0]
            cf_data = latest_cf.line_items or {}
            
            operating_cf = self._extract_metric_value(cf_data, ["operating_cash_flow", "cash_from_operations"])
            if operating_cf:
                metrics["operating_cash_flow"] = {
                    "name": "Operating Cash Flow",
                    "value": operating_cf,
                    "format_type": "currency",
                    "trend": "up" if operating_cf > 0 else "down",
                    "change_percentage": 0
                }
        
        return metrics

    def _extract_metric_value(self, data: Dict[str, Any], possible_keys: List[str]) -> Optional[float]:
        """Extract a metric value from financial data using possible key names."""
        
        for key in possible_keys:
            # Try exact match
            if key in data:
                value = data[key]
                if isinstance(value, (int, float)):
                    return float(value)
                elif isinstance(value, str) and value.replace('.', '').replace('-', '').isdigit():
                    return float(value)
            
            # Try case-insensitive match
            for data_key, value in data.items():
                if data_key.lower() == key.lower():
                    if isinstance(value, (int, float)):
                        return float(value)
                    elif isinstance(value, str) and value.replace('.', '').replace('-', '').isdigit():
                        return float(value)
        
        return None

    # ====================
    # Chart Generation Methods
    # ====================

    async def _generate_dashboard_charts(
        self, 
        statements: List[FinancialStatement], 
        period: PeriodFilter
    ) -> Dict[str, List[Dict[str, Any]]]:
        """Generate chart data for dashboard overview."""
        
        charts = {}
        
        # Revenue trend (from P&L statements)
        pl_statements = [s for s in statements if s.statement_type == StatementType.PROFIT_LOSS]
        if pl_statements:
            charts["revenue_trend"] = await self._generate_revenue_trend_chart(pl_statements)
            charts["expense_breakdown"] = await self._generate_expense_breakdown_chart(pl_statements[0])
        
        # Cash flow waterfall (from Cash Flow statements)
        cf_statements = [s for s in statements if s.statement_type == StatementType.CASH_FLOW]
        if cf_statements:
            charts["cash_flow_waterfall"] = await self._generate_cash_flow_waterfall_chart(cf_statements[0])
        
        # Asset composition (from Balance Sheet statements)
        bs_statements = [s for s in statements if s.statement_type == StatementType.BALANCE_SHEET]
        if bs_statements:
            charts["asset_composition"] = await self._generate_asset_composition_chart(bs_statements[0])
        
        return charts

    async def _generate_revenue_trend_chart(
        self, 
        pl_statements: List[FinancialStatement]
    ) -> List[Dict[str, Any]]:
        """Generate revenue trend chart data."""
        
        chart_data = []
        
        for statement in sorted(pl_statements, key=lambda x: x.period_start):
            line_items = statement.line_items or {}
            revenue = self._extract_metric_value(line_items, ["revenue", "total_revenue", "net_sales"])
            
            if revenue is not None:
                chart_data.append({
                    "period": statement.period_start.strftime("%Y-%m"),
                    "value": revenue,
                    "date": statement.period_start.isoformat(),
                    "label": f"{statement.period_start.strftime('%b %Y')}"
                })
        
        return chart_data

    async def _generate_expense_breakdown_chart(
        self, 
        statement: FinancialStatement
    ) -> List[Dict[str, Any]]:
        """Generate expense breakdown chart data."""
        
        line_items = statement.line_items or {}
        expense_categories = [
            ("Cost of Goods Sold", ["cogs", "cost_of_goods_sold", "cost_of_sales"]),
            ("Operating Expenses", ["operating_expenses", "opex", "selling_admin"]),
            ("Interest Expense", ["interest_expense", "financial_costs"]),
            ("Tax Expense", ["tax_expense", "income_tax"]),
            ("Other Expenses", ["other_expenses", "miscellaneous"])
        ]
        
        chart_data = []
        
        for category_name, possible_keys in expense_categories:
            value = self._extract_metric_value(line_items, possible_keys)
            if value and value > 0:
                chart_data.append({
                    "period": category_name,
                    "value": value,
                    "category": category_name,
                    "label": category_name
                })
        
        return chart_data

    # ====================
    # P&L Specific Methods
    # ====================

    def _extract_pl_data(self, statement: FinancialStatement) -> Dict[str, Any]:
        """Extract P&L specific data structure."""
        
        line_items = statement.line_items or {}
        
        return {
            "revenue": {
                "total_revenue": self._extract_metric_value(line_items, ["revenue", "total_revenue", "net_sales"]),
                "product_revenue": self._extract_metric_value(line_items, ["product_revenue", "goods_revenue"]),
                "service_revenue": self._extract_metric_value(line_items, ["service_revenue", "services_revenue"])
            },
            "expenses": {
                "cogs": self._extract_metric_value(line_items, ["cogs", "cost_of_goods_sold"]),
                "operating_expenses": self._extract_metric_value(line_items, ["operating_expenses", "opex"]),
                "interest_expense": self._extract_metric_value(line_items, ["interest_expense"])
            },
            "profit": {
                "gross_profit": self._extract_metric_value(line_items, ["gross_profit", "gross_income"]),
                "operating_profit": self._extract_metric_value(line_items, ["operating_profit", "ebit"]),
                "net_income": self._extract_metric_value(line_items, ["net_income", "net_profit"])
            }
        }

    def _calculate_pl_metrics(self, statement: FinancialStatement) -> List[Dict[str, Any]]:
        """Calculate P&L specific metrics."""
        
        pl_data = self._extract_pl_data(statement)
        metrics = []
        
        # Revenue metric
        total_revenue = pl_data["revenue"]["total_revenue"]
        if total_revenue:
            metrics.append({
                "name": "Total Revenue",
                "value": total_revenue,
                "category": "revenue",
                "period": statement.period_start.strftime("%Y-%m"),
                "unit": statement.currency,
                "format_type": "currency",
                "display_order": 1
            })
        
        # Gross Profit Margin
        gross_profit = pl_data["profit"]["gross_profit"]
        if gross_profit and total_revenue and total_revenue > 0:
            margin = (gross_profit / total_revenue) * 100
            metrics.append({
                "name": "Gross Profit Margin",
                "value": margin,
                "category": "profitability",
                "period": statement.period_start.strftime("%Y-%m"),
                "unit": "%",
                "format_type": "percentage",
                "display_order": 2
            })
        
        # Net Income
        net_income = pl_data["profit"]["net_income"]
        if net_income:
            metrics.append({
                "name": "Net Income",
                "value": net_income,
                "category": "profitability",
                "period": statement.period_start.strftime("%Y-%m"),
                "unit": statement.currency,
                "format_type": "currency",
                "display_order": 3
            })
        
        return metrics

    async def _generate_pl_charts(self, statement: FinancialStatement) -> Dict[str, List[Dict[str, Any]]]:
        """Generate P&L specific charts."""
        
        charts = {}
        
        # Revenue trend chart (single period for now)
        charts["revenue_trend"] = await self._generate_revenue_trend_chart([statement])
        
        # Profit margins chart
        charts["profit_margins"] = await self._generate_profit_margins_chart(statement)
        
        # Expense breakdown chart
        charts["expense_breakdown"] = await self._generate_expense_breakdown_chart(statement)
        
        return charts

    async def _generate_profit_margins_chart(self, statement: FinancialStatement) -> List[Dict[str, Any]]:
        """Generate profit margins chart data."""
        
        pl_data = self._extract_pl_data(statement)
        revenue = pl_data["revenue"]["total_revenue"]
        
        if not revenue or revenue <= 0:
            return []
        
        chart_data = []
        
        # Gross Margin
        gross_profit = pl_data["profit"]["gross_profit"]
        if gross_profit:
            margin = (gross_profit / revenue) * 100
            chart_data.append({
                "period": "Gross Margin",
                "value": margin,
                "label": "Gross Margin"
            })
        
        # Operating Margin
        operating_profit = pl_data["profit"]["operating_profit"]
        if operating_profit:
            margin = (operating_profit / revenue) * 100
            chart_data.append({
                "period": "Operating Margin",
                "value": margin,
                "label": "Operating Margin"
            })
        
        # Net Margin
        net_income = pl_data["profit"]["net_income"]
        if net_income:
            margin = (net_income / revenue) * 100
            chart_data.append({
                "period": "Net Margin",
                "value": margin,
                "label": "Net Margin"
            })
        
        return chart_data

    # ====================
    # Balance Sheet Methods
    # ====================

    def _extract_balance_sheet_data(self, statement: FinancialStatement) -> Dict[str, Any]:
        """Extract Balance Sheet specific data structure."""
        
        line_items = statement.line_items or {}
        
        return {
            "assets": {
                "current_assets": self._extract_metric_value(line_items, ["current_assets", "total_current_assets"]),
                "fixed_assets": self._extract_metric_value(line_items, ["fixed_assets", "non_current_assets", "ppe"]),
                "total_assets": self._extract_metric_value(line_items, ["total_assets"])
            },
            "liabilities": {
                "current_liabilities": self._extract_metric_value(line_items, ["current_liabilities", "total_current_liabilities"]),
                "long_term_liabilities": self._extract_metric_value(line_items, ["long_term_liabilities", "non_current_liabilities"]),
                "total_liabilities": self._extract_metric_value(line_items, ["total_liabilities"])
            },
            "equity": {
                "shareholders_equity": self._extract_metric_value(line_items, ["shareholders_equity", "total_equity"]),
                "retained_earnings": self._extract_metric_value(line_items, ["retained_earnings"])
            }
        }

    def _calculate_balance_sheet_metrics(self, statement: FinancialStatement) -> List[Dict[str, Any]]:
        """Calculate Balance Sheet specific metrics."""
        
        bs_data = self._extract_balance_sheet_data(statement)
        metrics = []
        
        # Total Assets
        total_assets = bs_data["assets"]["total_assets"]
        if total_assets:
            metrics.append({
                "name": "Total Assets",
                "value": total_assets,
                "category": "assets",
                "period": statement.period_end.strftime("%Y-%m-%d"),
                "unit": statement.currency,
                "format_type": "currency",
                "display_order": 1
            })
        
        # Current Ratio
        current_assets = bs_data["assets"]["current_assets"]
        current_liabilities = bs_data["liabilities"]["current_liabilities"]
        if current_assets and current_liabilities and current_liabilities > 0:
            ratio = current_assets / current_liabilities
            metrics.append({
                "name": "Current Ratio",
                "value": ratio,
                "category": "liquidity",
                "period": statement.period_end.strftime("%Y-%m-%d"),
                "unit": "ratio",
                "format_type": "ratio",
                "display_order": 2
            })
        
        # Debt-to-Equity Ratio
        total_liabilities = bs_data["liabilities"]["total_liabilities"]
        shareholders_equity = bs_data["equity"]["shareholders_equity"]
        if total_liabilities and shareholders_equity and shareholders_equity > 0:
            ratio = total_liabilities / shareholders_equity
            metrics.append({
                "name": "Debt-to-Equity Ratio", 
                "value": ratio,
                "category": "leverage",
                "period": statement.period_end.strftime("%Y-%m-%d"),
                "unit": "ratio",
                "format_type": "ratio",
                "display_order": 3
            })
        
        return metrics

    async def _generate_balance_sheet_charts(self, statement: FinancialStatement) -> Dict[str, List[Dict[str, Any]]]:
        """Generate Balance Sheet specific charts."""
        
        charts = {}
        
        # Asset composition chart
        charts["asset_composition"] = await self._generate_asset_composition_chart(statement)
        
        # Liability composition chart
        charts["liability_composition"] = await self._generate_liability_composition_chart(statement)
        
        # Liquidity ratios chart
        charts["liquidity_ratios"] = await self._generate_liquidity_ratios_chart(statement)
        
        return charts

    async def _generate_asset_composition_chart(self, statement: FinancialStatement) -> List[Dict[str, Any]]:
        """Generate asset composition pie chart data."""
        
        bs_data = self._extract_balance_sheet_data(statement)
        chart_data = []
        
        current_assets = bs_data["assets"]["current_assets"]
        if current_assets and current_assets > 0:
            chart_data.append({
                "period": "Current Assets",
                "value": current_assets,
                "category": "Current Assets",
                "label": "Current Assets"
            })
        
        fixed_assets = bs_data["assets"]["fixed_assets"]
        if fixed_assets and fixed_assets > 0:
            chart_data.append({
                "period": "Fixed Assets",
                "value": fixed_assets,
                "category": "Fixed Assets", 
                "label": "Fixed Assets"
            })
        
        return chart_data

    # ====================
    # Cash Flow Methods
    # ====================

    def _extract_cash_flow_data(self, statement: FinancialStatement) -> Dict[str, Any]:
        """Extract Cash Flow specific data structure."""
        
        line_items = statement.line_items or {}
        
        return {
            "operating": {
                "operating_cash_flow": self._extract_metric_value(line_items, ["operating_cash_flow", "cash_from_operations"]),
                "net_income": self._extract_metric_value(line_items, ["net_income"]),
                "depreciation": self._extract_metric_value(line_items, ["depreciation", "depreciation_amortization"])
            },
            "investing": {
                "investing_cash_flow": self._extract_metric_value(line_items, ["investing_cash_flow", "cash_from_investing"]),
                "capex": self._extract_metric_value(line_items, ["capital_expenditures", "capex"]),
                "investments": self._extract_metric_value(line_items, ["investments", "asset_purchases"])
            },
            "financing": {
                "financing_cash_flow": self._extract_metric_value(line_items, ["financing_cash_flow", "cash_from_financing"]),
                "debt_issuance": self._extract_metric_value(line_items, ["debt_issuance", "borrowings"]),
                "dividends": self._extract_metric_value(line_items, ["dividends_paid", "dividends"])
            }
        }

    def _calculate_cash_flow_metrics(self, statement: FinancialStatement) -> List[Dict[str, Any]]:
        """Calculate Cash Flow specific metrics."""
        
        cf_data = self._extract_cash_flow_data(statement)
        metrics = []
        
        # Operating Cash Flow
        operating_cf = cf_data["operating"]["operating_cash_flow"]
        if operating_cf:
            metrics.append({
                "name": "Operating Cash Flow",
                "value": operating_cf,
                "category": "operating",
                "period": statement.period_start.strftime("%Y-%m"),
                "unit": statement.currency,
                "format_type": "currency",
                "display_order": 1,
                "trend": "up" if operating_cf > 0 else "down"
            })
        
        # Free Cash Flow (OCF - CapEx)
        capex = cf_data["investing"]["capex"] or 0
        if operating_cf:
            free_cf = operating_cf - abs(capex)  # CapEx is usually negative
            metrics.append({
                "name": "Free Cash Flow",
                "value": free_cf,
                "category": "operating",
                "period": statement.period_start.strftime("%Y-%m"),
                "unit": statement.currency, 
                "format_type": "currency",
                "display_order": 2,
                "trend": "up" if free_cf > 0 else "down"
            })
        
        # Cash Flow from Investing
        investing_cf = cf_data["investing"]["investing_cash_flow"]
        if investing_cf:
            metrics.append({
                "name": "Investing Cash Flow",
                "value": investing_cf,
                "category": "investing",
                "period": statement.period_start.strftime("%Y-%m"),
                "unit": statement.currency,
                "format_type": "currency",
                "display_order": 3,
                "trend": "down" if investing_cf < 0 else "up"  # Negative is normal for investing
            })
        
        return metrics

    async def _generate_cash_flow_charts(self, statement: FinancialStatement) -> Dict[str, List[Dict[str, Any]]]:
        """Generate Cash Flow specific charts."""
        
        charts = {}
        
        # Cash flow waterfall chart
        charts["cash_flow_waterfall"] = await self._generate_cash_flow_waterfall_chart(statement)
        
        # Operating cash flow trend (single period for now)
        charts["operating_cf_trend"] = await self._generate_operating_cf_trend_chart(statement)
        
        return charts

    async def _generate_cash_flow_waterfall_chart(self, statement: FinancialStatement) -> List[Dict[str, Any]]:
        """Generate cash flow waterfall chart data."""
        
        cf_data = self._extract_cash_flow_data(statement)
        chart_data = []
        
        # Starting point (opening cash - not in this statement, using 0)
        chart_data.append({
            "period": "Opening Cash",
            "value": 0,  # TODO: Get from previous period
            "type": "start",
            "category": "opening"
        })
        
        # Operating Cash Flow
        operating_cf = cf_data["operating"]["operating_cash_flow"]
        if operating_cf:
            chart_data.append({
                "period": "Operating",
                "value": operating_cf,
                "type": "positive" if operating_cf >= 0 else "negative",
                "category": "operating"
            })
        
        # Investing Cash Flow
        investing_cf = cf_data["investing"]["investing_cash_flow"]
        if investing_cf:
            chart_data.append({
                "period": "Investing",
                "value": investing_cf,
                "type": "positive" if investing_cf >= 0 else "negative",
                "category": "investing"
            })
        
        # Financing Cash Flow
        financing_cf = cf_data["financing"]["financing_cash_flow"]
        if financing_cf:
            chart_data.append({
                "period": "Financing",
                "value": financing_cf,
                "type": "positive" if financing_cf >= 0 else "negative",
                "category": "financing"
            })
        
        # Ending Cash
        net_change = (operating_cf or 0) + (investing_cf or 0) + (financing_cf or 0)
        chart_data.append({
            "period": "Closing Cash",
            "value": net_change,  # Simplified - should be opening + net change
            "type": "end",
            "category": "closing"
        })
        
        return chart_data

    async def _generate_operating_cf_trend_chart(self, statement: FinancialStatement) -> List[Dict[str, Any]]:
        """Generate operating cash flow trend data (single period)."""
        
        cf_data = self._extract_cash_flow_data(statement)
        operating_cf = cf_data["operating"]["operating_cash_flow"]
        
        if not operating_cf:
            return []
        
        return [{
            "period": statement.period_start.strftime("%Y-%m"),
            "value": operating_cf,
            "date": statement.period_start.isoformat(),
            "label": f"{statement.period_start.strftime('%b %Y')}"
        }]

    # ====================
    # Utility Methods
    # ====================

    def _calculate_data_quality_score(self, statements: List[FinancialStatement]) -> float:
        """Calculate overall data quality score."""
        
        if not statements:
            return 0.0
        
        total_score = sum(self._calculate_statement_quality_score(stmt) for stmt in statements)
        return total_score / len(statements)

    def _calculate_statement_quality_score(self, statement: FinancialStatement) -> float:
        """Calculate data quality score for a single statement."""
        
        if not statement or not statement.line_items:
            return 0.0
        
        line_items = statement.line_items
        total_fields = len(line_items)
        
        if total_fields == 0:
            return 0.0
        
        non_null_fields = sum(1 for value in line_items.values() if value is not None and value != "")
        completeness_score = non_null_fields / total_fields
        
        # Additional quality checks could be added here
        # - Consistency checks
        # - Formula validation 
        # - Balance sheet balancing
        # - etc.
        
        return min(completeness_score, 1.0)

    def _get_period_info(self, period: PeriodFilter) -> Dict[str, str]:
        """Get period information for display."""
        
        now = datetime.utcnow()
        
        if period == PeriodFilter.MTD:
            start_date = now.replace(day=1)
            return {
                "period": "Month to Date",
                "start_date": start_date.isoformat(),
                "end_date": now.isoformat()
            }
        elif period == PeriodFilter.QTD:
            quarter_start = datetime(now.year, ((now.month - 1) // 3) * 3 + 1, 1)
            return {
                "period": "Quarter to Date",
                "start_date": quarter_start.isoformat(),
                "end_date": now.isoformat()
            }
        elif period == PeriodFilter.YTD:
            year_start = datetime(now.year, 1, 1)
            return {
                "period": "Year to Date",
                "start_date": year_start.isoformat(),
                "end_date": now.isoformat()
            }
        elif period == PeriodFilter.LAST_30_DAYS:
            start_date = now - timedelta(days=30)
            return {
                "period": "Last 30 Days",
                "start_date": start_date.isoformat(),
                "end_date": now.isoformat()
            }
        elif period == PeriodFilter.LAST_90_DAYS:
            start_date = now - timedelta(days=90)
            return {
                "period": "Last 90 Days",
                "start_date": start_date.isoformat(),
                "end_date": now.isoformat()
            }
        elif period == PeriodFilter.LAST_12_MONTHS:
            start_date = now.replace(year=now.year - 1)
            return {
                "period": "Last 12 Months",
                "start_date": start_date.isoformat(),
                "end_date": now.isoformat()
            }
        else:
            return {
                "period": "Custom Period",
                "start_date": now.isoformat(),
                "end_date": now.isoformat()
            }

    # ====================
    # Demo/Fallback Methods
    # ====================

    async def _get_demo_dashboard_data(self, user_id: int, period: PeriodFilter) -> DashboardData:
        """Get demo dashboard data when no real data is available."""
        
        # Fallback to legacy service for demo data
        legacy_data = await self.legacy_service.get_overview_metrics(user_id, period.value)
        
        return DashboardData(
            statements=[],
            active_statement=None,
            key_metrics=legacy_data.get("metrics", {}),
            chart_data=legacy_data.get("charts", {}),
            last_updated=datetime.utcnow(),
            data_quality_score=0.7,  # Demo data quality
            period_info=self._get_period_info(period)
        )

    def _get_demo_key_metrics(self) -> Dict[str, Any]:
        """Get demo key metrics."""
        
        return {
            "revenue": {
                "name": "Revenue",
                "value": 1000000,
                "format_type": "currency",
                "trend": "up",
                "change_percentage": 15.2
            },
            "net_income": {
                "name": "Net Income", 
                "value": 150000,
                "format_type": "currency",
                "trend": "up",
                "change_percentage": 8.5
            },
            "gross_margin": {
                "name": "Gross Margin",
                "value": 35.5,
                "format_type": "percentage",
                "trend": "up",
                "change_percentage": 2.1
            }
        }

    async def _calculate_cross_statement_metrics(self, statements: List[FinancialStatement]) -> Dict[str, Any]:
        """Calculate metrics that require multiple statement types."""
        
        # Group statements by type
        pl_statements = [s for s in statements if s.statement_type == StatementType.PROFIT_LOSS]
        bs_statements = [s for s in statements if s.statement_type == StatementType.BALANCE_SHEET]
        cf_statements = [s for s in statements if s.statement_type == StatementType.CASH_FLOW]
        
        metrics = {}
        
        # ROA = Net Income / Total Assets
        if pl_statements and bs_statements:
            latest_pl = pl_statements[0]
            latest_bs = bs_statements[0]
            
            net_income = self._extract_metric_value(latest_pl.line_items or {}, ["net_income", "net_profit"])
            total_assets = self._extract_metric_value(latest_bs.line_items or {}, ["total_assets"])
            
            if net_income and total_assets and total_assets > 0:
                roa = (net_income / total_assets) * 100
                metrics["return_on_assets"] = {
                    "name": "Return on Assets",
                    "value": roa,
                    "format_type": "percentage",
                    "trend": "up" if roa > 0 else "down",
                    "change_percentage": 0
                }
        
        # Cash Conversion Cycle (simplified)
        if cf_statements and pl_statements:
            # This would require more detailed working capital analysis
            # For now, just include operating cash flow ratio
            latest_cf = cf_statements[0]
            latest_pl = pl_statements[0]
            
            operating_cf = self._extract_metric_value(latest_cf.line_items or {}, ["operating_cash_flow"])
            revenue = self._extract_metric_value(latest_pl.line_items or {}, ["revenue", "total_revenue"])
            
            if operating_cf and revenue and revenue > 0:
                cf_ratio = (operating_cf / revenue) * 100
                metrics["cash_conversion_ratio"] = {
                    "name": "Cash Conversion Ratio",
                    "value": cf_ratio,
                    "format_type": "percentage",
                    "trend": "up" if cf_ratio > 0 else "down",
                    "change_percentage": 0
                }
        
        return metrics

    # ====================
    # Additional Utility Methods
    # ====================

    async def _generate_liability_composition_chart(self, statement: FinancialStatement) -> List[Dict[str, Any]]:
        """Generate liability composition chart data."""
        
        bs_data = self._extract_balance_sheet_data(statement)
        chart_data = []
        
        current_liabilities = bs_data["liabilities"]["current_liabilities"]
        if current_liabilities and current_liabilities > 0:
            chart_data.append({
                "period": "Current Liabilities",
                "value": current_liabilities,
                "category": "Current Liabilities",
                "label": "Current Liabilities"
            })
        
        long_term_liabilities = bs_data["liabilities"]["long_term_liabilities"]
        if long_term_liabilities and long_term_liabilities > 0:
            chart_data.append({
                "period": "Long-term Liabilities",
                "value": long_term_liabilities,
                "category": "Long-term Liabilities",
                "label": "Long-term Liabilities"
            })
        
        return chart_data

    async def _generate_liquidity_ratios_chart(self, statement: FinancialStatement) -> List[Dict[str, Any]]:
        """Generate liquidity ratios chart data."""
        
        bs_data = self._extract_balance_sheet_data(statement)
        chart_data = []
        
        current_assets = bs_data["assets"]["current_assets"]
        current_liabilities = bs_data["liabilities"]["current_liabilities"]
        
        if current_assets and current_liabilities and current_liabilities > 0:
            current_ratio = current_assets / current_liabilities
            chart_data.append({
                "period": "Current Ratio",
                "value": current_ratio,
                "label": "Current Ratio"
            })
            
            # Quick ratio would require more detailed current assets breakdown
            # For now, approximate as 80% of current assets
            quick_ratio = (current_assets * 0.8) / current_liabilities
            chart_data.append({
                "period": "Quick Ratio",
                "value": quick_ratio,
                "label": "Quick Ratio (Est.)"
            })
        
        return chart_data