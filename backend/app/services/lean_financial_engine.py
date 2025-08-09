"""
Lean Financial Modeling Engine
Core financial calculation engine for comprehensive financial modeling
Based on the lean financial modeling plan.
"""

import json
from typing import Dict, List, Any, Optional, Tuple, Union
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session

# Database model imports removed to avoid circular imports in lean version
# from app.models.parameter import Parameter, ParameterValue, Scenario
# from app.models.financial import FinancialStatement


class StatementType(str, Enum):
    """Financial statement types"""

    PROFIT_LOSS = "profit_loss"
    BALANCE_SHEET = "balance_sheet"
    CASH_FLOW = "cash_flow"
    DCF_VALUATION = "dcf_valuation"


@dataclass
class CoreParameters:
    """Core parameters for financial modeling based on lean plan"""

    # Economic Environment Parameters
    inflation_rate: float = 0.03
    gdp_growth_rate: float = 0.025
    interest_rate_environment: float = 0.045
    currency_exchange_rate: float = 1.0

    # Tax Environment Parameters
    corporate_tax_rate: float = 0.21
    state_tax_rate: float = 0.05
    effective_tax_rate: float = 0.26
    tax_credits: float = 0.0

    # Revenue Parameters
    product_revenue_growth: float = 0.05
    service_revenue_growth: float = 0.07
    product_price_inflation: float = 0.02
    service_price_inflation: float = 0.03

    # COGS Parameters
    direct_materials_percentage: float = 0.35
    direct_labor_percentage: float = 0.20
    manufacturing_overhead_percentage: float = 0.15
    materials_inflation_rate: float = 0.03
    labor_cost_inflation: float = 0.04

    # Operating Expenses Parameters
    sales_commission_percentage: float = 0.03
    marketing_spend_percentage: float = 0.05
    rnd_percentage: float = 0.08
    executive_salaries_percentage: float = 0.02
    office_rent_percentage: float = 0.01

    # Financial Parameters
    short_term_interest_rate: float = 0.05
    long_term_interest_rate: float = 0.06
    cash_investment_return: float = 0.02

    # Working Capital Parameters
    accounts_receivable_days: float = 45
    inventory_days: float = 60
    accounts_payable_days: float = 30

    # Capital Expenditure Parameters
    maintenance_capex_percentage: float = 0.03
    growth_capex_percentage: float = 0.05

    # Depreciation Parameters
    depreciation_percentage: float = 0.10
    amortization_percentage: float = 0.15

    # DCF Parameters
    discount_rate: float = 0.10
    terminal_growth_rate: float = 0.02
    projection_period_years: int = 5
    beta: float = 1.2
    risk_free_rate: float = 0.03
    market_risk_premium: float = 0.07


@dataclass
class ProfitLossStatement:
    """Comprehensive P&L Statement structure"""

    # Revenue Section
    product_revenue: float = 0
    service_revenue: float = 0
    licensing_revenue: float = 0
    other_revenue: float = 0
    total_revenue: float = 0

    # Cost of Goods Sold Section
    direct_materials: float = 0
    direct_labor: float = 0
    manufacturing_overhead: float = 0
    freight_and_delivery: float = 0
    total_cogs: float = 0

    # Gross Profit
    gross_profit: float = 0
    gross_margin_percentage: float = 0

    # Operating Expenses
    sales_commission: float = 0
    marketing_spend: float = 0
    advertising: float = 0
    rnd_expenses: float = 0
    executive_salaries: float = 0
    admin_salaries: float = 0
    office_rent: float = 0
    utilities: float = 0
    insurance: float = 0
    total_operating_expenses: float = 0

    # Operating Income
    operating_income: float = 0
    operating_margin_percentage: float = 0

    # Other Income/Expense
    interest_expense: float = 0
    interest_income: float = 0
    foreign_exchange_gain_loss: float = 0
    total_other_income_expense: float = 0

    # Income Before Tax
    income_before_tax: float = 0

    # Tax Section
    current_tax_expense: float = 0
    deferred_tax_expense: float = 0
    tax_credits_applied: float = 0
    total_tax_expense: float = 0
    effective_tax_rate_actual: float = 0

    # Net Income
    net_income: float = 0
    net_margin_percentage: float = 0


@dataclass
class BalanceSheet:
    """Comprehensive Balance Sheet structure"""

    # Current Assets
    cash: float = 0
    cash_equivalents: float = 0
    marketable_securities: float = 0
    accounts_receivable: float = 0
    allowance_for_doubtful_accounts: float = 0
    net_accounts_receivable: float = 0
    inventory: float = 0
    prepaid_expenses: float = 0
    other_current_assets: float = 0
    total_current_assets: float = 0

    # Non-Current Assets
    property_plant_equipment: float = 0
    accumulated_depreciation: float = 0
    net_property_plant_equipment: float = 0
    intangible_assets: float = 0
    accumulated_amortization: float = 0
    net_intangible_assets: float = 0
    long_term_investments: float = 0
    other_non_current_assets: float = 0
    total_non_current_assets: float = 0

    # Total Assets
    total_assets: float = 0

    # Current Liabilities
    accounts_payable: float = 0
    short_term_debt: float = 0
    accrued_expenses: float = 0
    deferred_revenue: float = 0
    income_taxes_payable: float = 0
    other_current_liabilities: float = 0
    total_current_liabilities: float = 0

    # Non-Current Liabilities
    long_term_debt: float = 0
    deferred_tax_liabilities: float = 0
    pension_liabilities: float = 0
    other_long_term_liabilities: float = 0
    total_non_current_liabilities: float = 0

    # Total Liabilities
    total_liabilities: float = 0

    # Equity
    common_stock: float = 0
    retained_earnings: float = 0
    additional_paid_in_capital: float = 0
    treasury_stock: float = 0
    other_equity: float = 0
    total_equity: float = 0

    # Balance Sheet Ratios
    current_ratio: float = 0
    quick_ratio: float = 0
    debt_to_equity_ratio: float = 0
    debt_to_assets_ratio: float = 0
    working_capital: float = 0


@dataclass
class CashFlowStatement:
    """Comprehensive Cash Flow Statement structure"""

    # Operating Activities
    net_income: float = 0
    depreciation: float = 0
    amortization: float = 0
    stock_based_compensation: float = 0
    deferred_taxes: float = 0
    accounts_receivable_change: float = 0
    inventory_change: float = 0
    accounts_payable_change: float = 0
    accrued_expenses_change: float = 0
    net_working_capital_change: float = 0
    operating_cash_flow: float = 0

    # Investing Activities
    capital_expenditures: float = 0
    software_development: float = 0
    intangible_assets_investment: float = 0
    marketable_securities_purchase: float = 0
    marketable_securities_sale: float = 0
    business_acquisitions: float = 0
    investing_cash_flow: float = 0

    # Financing Activities
    short_term_debt_issuance: float = 0
    long_term_debt_issuance: float = 0
    debt_repayment: float = 0
    common_stock_issuance: float = 0
    stock_repurchase: float = 0
    dividends_paid: float = 0
    financing_cash_flow: float = 0

    # Net Cash Flow
    net_cash_flow: float = 0
    beginning_cash_balance: float = 0
    ending_cash_balance: float = 0

    # Cash Flow Metrics
    operating_cash_flow_margin: float = 0
    free_cash_flow: float = 0
    free_cash_flow_margin: float = 0
    cash_conversion_cycle: float = 0


@dataclass
class DCFValuation:
    """DCF Valuation Model structure"""

    # Free Cash Flow Projections
    projected_revenues: List[float] = None
    projected_operating_income: List[float] = None
    projected_taxes: List[float] = None
    projected_nopat: List[float] = None
    projected_capex: List[float] = None
    projected_depreciation: List[float] = None
    projected_working_capital_change: List[float] = None
    projected_free_cash_flow: List[float] = None

    # Terminal Value
    terminal_value: float = 0
    terminal_growth_rate: float = 0

    # Discount Rate Components
    risk_free_rate: float = 0
    beta: float = 0
    market_risk_premium: float = 0
    cost_of_equity: float = 0
    cost_of_debt: float = 0
    tax_rate: float = 0
    debt_weight: float = 0
    equity_weight: float = 0
    wacc: float = 0

    # Valuation Results
    present_value_fcf: float = 0
    present_value_terminal: float = 0
    enterprise_value: float = 0
    net_debt: float = 0
    equity_value: float = 0
    shares_outstanding: float = 0
    value_per_share: float = 0

    def __post_init__(self):
        if self.projected_revenues is None:
            self.projected_revenues = []
        if self.projected_operating_income is None:
            self.projected_operating_income = []
        if self.projected_taxes is None:
            self.projected_taxes = []
        if self.projected_nopat is None:
            self.projected_nopat = []
        if self.projected_capex is None:
            self.projected_capex = []
        if self.projected_depreciation is None:
            self.projected_depreciation = []
        if self.projected_working_capital_change is None:
            self.projected_working_capital_change = []
        if self.projected_free_cash_flow is None:
            self.projected_free_cash_flow = []


class LeanFinancialEngine:
    """
    Lean Financial Modeling Engine for comprehensive financial modeling
    """

    def __init__(self, db: Session):
        self.db = db

    def calculate_profit_loss(
        self, parameters: CoreParameters, base_revenue: float = 1000000
    ) -> ProfitLossStatement:
        """Calculate comprehensive P&L statement"""
        pl = ProfitLossStatement()

        # Revenue Calculations
        pl.product_revenue = (
            base_revenue * 0.7 * (1 + parameters.product_revenue_growth)
        )
        pl.service_revenue = (
            base_revenue * 0.25 * (1 + parameters.service_revenue_growth)
        )
        pl.licensing_revenue = base_revenue * 0.03
        pl.other_revenue = base_revenue * 0.02
        pl.total_revenue = (
            pl.product_revenue
            + pl.service_revenue
            + pl.licensing_revenue
            + pl.other_revenue
        )

        # COGS Calculations
        pl.direct_materials = (
            pl.total_revenue
            * parameters.direct_materials_percentage
            * (1 + parameters.materials_inflation_rate)
        )
        pl.direct_labor = (
            pl.total_revenue
            * parameters.direct_labor_percentage
            * (1 + parameters.labor_cost_inflation)
        )
        pl.manufacturing_overhead = (
            pl.total_revenue * parameters.manufacturing_overhead_percentage
        )
        pl.freight_and_delivery = pl.total_revenue * 0.02
        pl.total_cogs = (
            pl.direct_materials
            + pl.direct_labor
            + pl.manufacturing_overhead
            + pl.freight_and_delivery
        )

        # Gross Profit
        pl.gross_profit = pl.total_revenue - pl.total_cogs
        pl.gross_margin_percentage = (
            pl.gross_profit / pl.total_revenue if pl.total_revenue > 0 else 0
        )

        # Operating Expenses
        pl.sales_commission = (
            pl.total_revenue * parameters.sales_commission_percentage
        )
        pl.marketing_spend = (
            pl.total_revenue * parameters.marketing_spend_percentage
        )
        pl.advertising = pl.total_revenue * 0.02
        pl.rnd_expenses = pl.total_revenue * parameters.rnd_percentage
        pl.executive_salaries = (
            pl.total_revenue * parameters.executive_salaries_percentage
        )
        pl.admin_salaries = pl.total_revenue * 0.03
        pl.office_rent = pl.total_revenue * parameters.office_rent_percentage
        pl.utilities = pl.total_revenue * 0.005
        pl.insurance = pl.total_revenue * 0.003
        pl.total_operating_expenses = (
            pl.sales_commission
            + pl.marketing_spend
            + pl.advertising
            + pl.rnd_expenses
            + pl.executive_salaries
            + pl.admin_salaries
            + pl.office_rent
            + pl.utilities
            + pl.insurance
        )

        # Operating Income
        pl.operating_income = pl.gross_profit - pl.total_operating_expenses
        pl.operating_margin_percentage = (
            pl.operating_income / pl.total_revenue
            if pl.total_revenue > 0
            else 0
        )

        # Other Income/Expense
        pl.interest_expense = pl.total_revenue * 0.01  # Assume some debt
        pl.interest_income = pl.total_revenue * 0.002
        pl.foreign_exchange_gain_loss = 0
        pl.total_other_income_expense = (
            pl.interest_income
            - pl.interest_expense
            + pl.foreign_exchange_gain_loss
        )

        # Income Before Tax
        pl.income_before_tax = (
            pl.operating_income + pl.total_other_income_expense
        )

        # Tax Calculations
        pl.current_tax_expense = max(
            0, pl.income_before_tax * parameters.effective_tax_rate
        )
        pl.deferred_tax_expense = 0
        pl.tax_credits_applied = parameters.tax_credits
        pl.total_tax_expense = (
            pl.current_tax_expense
            + pl.deferred_tax_expense
            - pl.tax_credits_applied
        )
        pl.effective_tax_rate_actual = (
            pl.total_tax_expense / pl.income_before_tax
            if pl.income_before_tax > 0
            else 0
        )

        # Net Income
        pl.net_income = pl.income_before_tax - pl.total_tax_expense
        pl.net_margin_percentage = (
            pl.net_income / pl.total_revenue if pl.total_revenue > 0 else 0
        )

        return pl

    def calculate_balance_sheet(
        self,
        parameters: CoreParameters,
        pl_statement: ProfitLossStatement,
        prior_balance_sheet: Optional[BalanceSheet] = None,
    ) -> BalanceSheet:
        """Calculate comprehensive Balance Sheet"""
        bs = BalanceSheet()

        # Initialize prior values if available
        prior_cash = prior_balance_sheet.cash if prior_balance_sheet else 100000
        prior_ppe = (
            prior_balance_sheet.property_plant_equipment
            if prior_balance_sheet
            else 500000
        )
        prior_accumulated_dep = (
            prior_balance_sheet.accumulated_depreciation
            if prior_balance_sheet
            else 100000
        )

        # Current Assets
        bs.cash = prior_cash + (
            pl_statement.net_income * 0.3
        )  # Simplified cash flow
        bs.cash_equivalents = bs.cash * 0.1
        bs.marketable_securities = bs.cash * 0.05
        bs.accounts_receivable = (
            pl_statement.total_revenue * parameters.accounts_receivable_days
        ) / 365
        bs.allowance_for_doubtful_accounts = bs.accounts_receivable * 0.02
        bs.net_accounts_receivable = (
            bs.accounts_receivable - bs.allowance_for_doubtful_accounts
        )
        bs.inventory = (
            pl_statement.total_cogs * parameters.inventory_days
        ) / 365
        bs.prepaid_expenses = pl_statement.total_revenue * 0.01
        bs.other_current_assets = pl_statement.total_revenue * 0.005
        bs.total_current_assets = (
            bs.cash
            + bs.cash_equivalents
            + bs.marketable_securities
            + bs.net_accounts_receivable
            + bs.inventory
            + bs.prepaid_expenses
            + bs.other_current_assets
        )

        # Non-Current Assets
        bs.property_plant_equipment = prior_ppe + (
            pl_statement.total_revenue * parameters.growth_capex_percentage
        )
        bs.accumulated_depreciation = prior_accumulated_dep + (
            bs.property_plant_equipment * parameters.depreciation_percentage
        )
        bs.net_property_plant_equipment = (
            bs.property_plant_equipment - bs.accumulated_depreciation
        )
        bs.intangible_assets = pl_statement.total_revenue * 0.1
        bs.accumulated_amortization = (
            bs.intangible_assets * parameters.amortization_percentage
        )
        bs.net_intangible_assets = (
            bs.intangible_assets - bs.accumulated_amortization
        )
        bs.long_term_investments = bs.cash * 0.02
        bs.other_non_current_assets = pl_statement.total_revenue * 0.01
        bs.total_non_current_assets = (
            bs.net_property_plant_equipment
            + bs.net_intangible_assets
            + bs.long_term_investments
            + bs.other_non_current_assets
        )

        # Total Assets
        bs.total_assets = bs.total_current_assets + bs.total_non_current_assets

        # Current Liabilities
        bs.accounts_payable = (
            pl_statement.total_cogs * parameters.accounts_payable_days
        ) / 365
        bs.short_term_debt = bs.total_assets * 0.05
        bs.accrued_expenses = pl_statement.total_operating_expenses * 0.1
        bs.deferred_revenue = pl_statement.total_revenue * 0.02
        bs.income_taxes_payable = pl_statement.current_tax_expense * 0.3
        bs.other_current_liabilities = pl_statement.total_revenue * 0.01
        bs.total_current_liabilities = (
            bs.accounts_payable
            + bs.short_term_debt
            + bs.accrued_expenses
            + bs.deferred_revenue
            + bs.income_taxes_payable
            + bs.other_current_liabilities
        )

        # Non-Current Liabilities
        bs.long_term_debt = bs.total_assets * 0.15
        bs.deferred_tax_liabilities = pl_statement.deferred_tax_expense
        bs.pension_liabilities = pl_statement.total_revenue * 0.01
        bs.other_long_term_liabilities = pl_statement.total_revenue * 0.005
        bs.total_non_current_liabilities = (
            bs.long_term_debt
            + bs.deferred_tax_liabilities
            + bs.pension_liabilities
            + bs.other_long_term_liabilities
        )

        # Total Liabilities
        bs.total_liabilities = (
            bs.total_current_liabilities + bs.total_non_current_liabilities
        )

        # Equity
        bs.common_stock = 100000  # Fixed value
        bs.additional_paid_in_capital = 200000  # Fixed value
        bs.treasury_stock = 0
        bs.retained_earnings = (
            bs.total_assets
            - bs.total_liabilities
            - bs.common_stock
            - bs.additional_paid_in_capital
        )
        bs.other_equity = 0
        bs.total_equity = (
            bs.common_stock
            + bs.additional_paid_in_capital
            + bs.retained_earnings
            + bs.other_equity
            - bs.treasury_stock
        )

        # Balance Sheet Ratios
        bs.current_ratio = (
            bs.total_current_assets / bs.total_current_liabilities
            if bs.total_current_liabilities > 0
            else 0
        )
        bs.quick_ratio = (
            (bs.total_current_assets - bs.inventory)
            / bs.total_current_liabilities
            if bs.total_current_liabilities > 0
            else 0
        )
        bs.debt_to_equity_ratio = (
            bs.total_liabilities / bs.total_equity if bs.total_equity > 0 else 0
        )
        bs.debt_to_assets_ratio = (
            bs.total_liabilities / bs.total_assets if bs.total_assets > 0 else 0
        )
        bs.working_capital = (
            bs.total_current_assets - bs.total_current_liabilities
        )

        return bs

    def calculate_cash_flow(
        self,
        parameters: CoreParameters,
        pl_statement: ProfitLossStatement,
        balance_sheet: BalanceSheet,
        prior_balance_sheet: Optional[BalanceSheet] = None,
    ) -> CashFlowStatement:
        """Calculate comprehensive Cash Flow Statement"""
        cf = CashFlowStatement()

        # Operating Activities
        cf.net_income = pl_statement.net_income
        cf.depreciation = (
            balance_sheet.accumulated_depreciation
            * parameters.depreciation_percentage
        )
        cf.amortization = (
            balance_sheet.accumulated_amortization
            * parameters.amortization_percentage
        )
        cf.stock_based_compensation = pl_statement.total_revenue * 0.005
        cf.deferred_taxes = pl_statement.deferred_tax_expense

        # Working Capital Changes (simplified)
        cf.accounts_receivable_change = (
            -balance_sheet.net_accounts_receivable * 0.1
            if not prior_balance_sheet
            else -(
                balance_sheet.net_accounts_receivable
                - prior_balance_sheet.net_accounts_receivable
            )
        )
        cf.inventory_change = (
            -balance_sheet.inventory * 0.1
            if not prior_balance_sheet
            else -(balance_sheet.inventory - prior_balance_sheet.inventory)
        )
        cf.accounts_payable_change = (
            balance_sheet.accounts_payable * 0.1
            if not prior_balance_sheet
            else (
                balance_sheet.accounts_payable
                - prior_balance_sheet.accounts_payable
            )
        )
        cf.accrued_expenses_change = (
            balance_sheet.accrued_expenses * 0.1
            if not prior_balance_sheet
            else (
                balance_sheet.accrued_expenses
                - prior_balance_sheet.accrued_expenses
            )
        )
        cf.net_working_capital_change = (
            cf.accounts_receivable_change
            + cf.inventory_change
            + cf.accounts_payable_change
            + cf.accrued_expenses_change
        )

        cf.operating_cash_flow = (
            cf.net_income
            + cf.depreciation
            + cf.amortization
            + cf.stock_based_compensation
            + cf.deferred_taxes
            + cf.net_working_capital_change
        )

        # Investing Activities
        cf.capital_expenditures = -(
            pl_statement.total_revenue
            * (
                parameters.maintenance_capex_percentage
                + parameters.growth_capex_percentage
            )
        )
        cf.software_development = -(pl_statement.total_revenue * 0.01)
        cf.intangible_assets_investment = -(pl_statement.total_revenue * 0.005)
        cf.marketable_securities_purchase = -(
            balance_sheet.marketable_securities * 0.1
        )
        cf.marketable_securities_sale = 0
        cf.business_acquisitions = 0
        cf.investing_cash_flow = (
            cf.capital_expenditures
            + cf.software_development
            + cf.intangible_assets_investment
            + cf.marketable_securities_purchase
            + cf.marketable_securities_sale
            + cf.business_acquisitions
        )

        # Financing Activities
        cf.short_term_debt_issuance = (
            balance_sheet.short_term_debt * 0.1
            if not prior_balance_sheet
            else max(
                0,
                balance_sheet.short_term_debt
                - (
                    prior_balance_sheet.short_term_debt
                    if prior_balance_sheet
                    else 0
                ),
            )
        )
        cf.long_term_debt_issuance = (
            balance_sheet.long_term_debt * 0.05
            if not prior_balance_sheet
            else max(
                0,
                balance_sheet.long_term_debt
                - (
                    prior_balance_sheet.long_term_debt
                    if prior_balance_sheet
                    else 0
                ),
            )
        )
        cf.debt_repayment = (
            -(balance_sheet.short_term_debt + balance_sheet.long_term_debt)
            * 0.02
        )
        cf.common_stock_issuance = 0
        cf.stock_repurchase = 0
        cf.dividends_paid = (
            -pl_statement.net_income * 0.2 if pl_statement.net_income > 0 else 0
        )
        cf.financing_cash_flow = (
            cf.short_term_debt_issuance
            + cf.long_term_debt_issuance
            + cf.debt_repayment
            + cf.common_stock_issuance
            + cf.stock_repurchase
            + cf.dividends_paid
        )

        # Net Cash Flow
        cf.net_cash_flow = (
            cf.operating_cash_flow
            + cf.investing_cash_flow
            + cf.financing_cash_flow
        )
        cf.beginning_cash_balance = (
            prior_balance_sheet.cash if prior_balance_sheet else 100000
        )
        cf.ending_cash_balance = cf.beginning_cash_balance + cf.net_cash_flow

        # Cash Flow Metrics
        cf.operating_cash_flow_margin = (
            cf.operating_cash_flow / pl_statement.total_revenue
            if pl_statement.total_revenue > 0
            else 0
        )
        cf.free_cash_flow = cf.operating_cash_flow + cf.capital_expenditures
        cf.free_cash_flow_margin = (
            cf.free_cash_flow / pl_statement.total_revenue
            if pl_statement.total_revenue > 0
            else 0
        )
        cf.cash_conversion_cycle = (
            parameters.accounts_receivable_days
            + parameters.inventory_days
            - parameters.accounts_payable_days
        )

        return cf

    def calculate_dcf_valuation(
        self, parameters: CoreParameters, base_revenue: float = 1000000
    ) -> DCFValuation:
        """Calculate DCF valuation model"""
        dcf = DCFValuation()

        # Cost of Capital Calculation (WACC)
        dcf.risk_free_rate = parameters.risk_free_rate
        dcf.beta = parameters.beta
        dcf.market_risk_premium = parameters.market_risk_premium
        dcf.cost_of_equity = dcf.risk_free_rate + (
            dcf.beta * dcf.market_risk_premium
        )
        dcf.cost_of_debt = parameters.long_term_interest_rate * (
            1 - parameters.effective_tax_rate
        )
        dcf.tax_rate = parameters.effective_tax_rate
        dcf.debt_weight = 0.3  # Assume 30% debt
        dcf.equity_weight = 0.7  # Assume 70% equity
        dcf.wacc = (dcf.equity_weight * dcf.cost_of_equity) + (
            dcf.debt_weight * dcf.cost_of_debt
        )

        # Project Free Cash Flows
        current_revenue = base_revenue

        for year in range(parameters.projection_period_years):
            # Revenue projection
            projected_revenue = current_revenue * (
                1 + parameters.product_revenue_growth
            ) ** (year + 1)
            dcf.projected_revenues.append(projected_revenue)

            # Operating income projection (assume 15% operating margin)
            operating_income = projected_revenue * 0.15
            dcf.projected_operating_income.append(operating_income)

            # Tax calculation
            taxes = operating_income * dcf.tax_rate
            dcf.projected_taxes.append(taxes)

            # NOPAT (Net Operating Profit After Tax)
            nopat = operating_income - taxes
            dcf.projected_nopat.append(nopat)

            # CapEx projection
            capex = projected_revenue * (
                parameters.maintenance_capex_percentage
                + parameters.growth_capex_percentage
            )
            dcf.projected_capex.append(capex)

            # Depreciation
            depreciation = capex * 0.8  # Simplified
            dcf.projected_depreciation.append(depreciation)

            # Working capital change
            wc_change = projected_revenue * 0.02  # Assume 2% of revenue
            dcf.projected_working_capital_change.append(wc_change)

            # Free Cash Flow = NOPAT + Depreciation - CapEx - WC Change
            fcf = nopat + depreciation - capex - wc_change
            dcf.projected_free_cash_flow.append(fcf)

        # Terminal Value Calculation
        terminal_fcf = dcf.projected_free_cash_flow[-1] * (
            1 + parameters.terminal_growth_rate
        )
        dcf.terminal_value = terminal_fcf / (
            dcf.wacc - parameters.terminal_growth_rate
        )
        dcf.terminal_growth_rate = parameters.terminal_growth_rate

        # Present Value Calculations
        dcf.present_value_fcf = sum(
            [
                fcf / ((1 + dcf.wacc) ** (i + 1))
                for i, fcf in enumerate(dcf.projected_free_cash_flow)
            ]
        )
        dcf.present_value_terminal = dcf.terminal_value / (
            (1 + dcf.wacc) ** parameters.projection_period_years
        )

        # Enterprise and Equity Value
        dcf.enterprise_value = (
            dcf.present_value_fcf + dcf.present_value_terminal
        )
        dcf.net_debt = base_revenue * 0.1  # Assume net debt of 10% of revenue
        dcf.equity_value = dcf.enterprise_value - dcf.net_debt
        dcf.shares_outstanding = 1000000  # Assume 1M shares
        dcf.value_per_share = dcf.equity_value / dcf.shares_outstanding

        return dcf

    def calculate_comprehensive_model(
        self,
        parameters: CoreParameters,
        base_revenue: float = 1000000,
        prior_balance_sheet: Optional[BalanceSheet] = None,
    ) -> Dict[str, Any]:
        """Calculate comprehensive financial model with all statements"""

        # Calculate P&L
        pl_statement = self.calculate_profit_loss(parameters, base_revenue)

        # Calculate Balance Sheet
        balance_sheet = self.calculate_balance_sheet(
            parameters, pl_statement, prior_balance_sheet
        )

        # Calculate Cash Flow
        cash_flow = self.calculate_cash_flow(
            parameters, pl_statement, balance_sheet, prior_balance_sheet
        )

        # Calculate DCF Valuation
        dcf_valuation = self.calculate_dcf_valuation(parameters, base_revenue)

        return {
            "profit_loss": pl_statement,
            "balance_sheet": balance_sheet,
            "cash_flow": cash_flow,
            "dcf_valuation": dcf_valuation,
            "parameters": parameters,
            "calculation_timestamp": datetime.utcnow(),
            "model_version": "1.0-lean",
        }

    def create_scenario(
        self,
        scenario_name: str,
        parameters: CoreParameters,
        base_revenue: float = 1000000,
    ) -> Dict[str, Any]:
        """Create a financial scenario with given parameters"""
        model_results = self.calculate_comprehensive_model(
            parameters, base_revenue
        )

        # Add scenario metadata
        model_results.update(
            {
                "scenario_name": scenario_name,
                "scenario_id": str(datetime.utcnow().timestamp()),
                "created_at": datetime.utcnow(),
            }
        )

        return model_results

    def compare_scenarios(
        self, scenarios: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Compare multiple scenarios"""
        if not scenarios:
            return {}

        comparison = {
            "scenarios": [],
            "key_metrics_comparison": {},
            "variance_analysis": {},
        }

        for scenario in scenarios:
            pl = scenario["profit_loss"]
            bs = scenario["balance_sheet"]
            cf = scenario["cash_flow"]
            dcf = scenario["dcf_valuation"]

            scenario_summary = {
                "name": scenario.get("scenario_name", "Unnamed"),
                "total_revenue": pl.total_revenue,
                "net_income": pl.net_income,
                "operating_margin": pl.operating_margin_percentage,
                "net_margin": pl.net_margin_percentage,
                "total_assets": bs.total_assets,
                "total_equity": bs.total_equity,
                "debt_to_equity": bs.debt_to_equity_ratio,
                "operating_cash_flow": cf.operating_cash_flow,
                "free_cash_flow": cf.free_cash_flow,
                "enterprise_value": dcf.enterprise_value,
                "equity_value": dcf.equity_value,
                "value_per_share": dcf.value_per_share,
            }

            comparison["scenarios"].append(scenario_summary)

        # Calculate variance analysis
        if len(scenarios) > 1:
            base_scenario = comparison["scenarios"][0]

            for metric in [
                "total_revenue",
                "net_income",
                "enterprise_value",
                "value_per_share",
            ]:
                base_value = base_scenario[metric]
                variances = []

                for scenario_summary in comparison["scenarios"][1:]:
                    variance = (
                        (
                            (scenario_summary[metric] - base_value)
                            / base_value
                            * 100
                        )
                        if base_value != 0
                        else 0
                    )
                    variances.append(
                        {
                            "scenario": scenario_summary["name"],
                            "variance_percent": variance,
                            "absolute_difference": scenario_summary[metric]
                            - base_value,
                        }
                    )

                comparison["variance_analysis"][metric] = variances

        return comparison
