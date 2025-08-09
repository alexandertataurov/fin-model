"""
Lean Parameter Management System
Comprehensive parameter management for the lean financial modeling application
Based on the lean financial modeling plan with 12 parameter categories.
"""

from typing import Dict, List, Any, Optional, Tuple, Union
from datetime import datetime
from dataclasses import dataclass, asdict
from enum import Enum
import json
from sqlalchemy.orm import Session

# Database model imports removed to avoid circular imports in lean version
# from app.models.parameter import Parameter, ParameterValue, Scenario
from app.services.lean_financial_engine import CoreParameters


class ParameterCategory(str, Enum):
    """12 Parameter categories from lean plan"""

    ECONOMIC_ENVIRONMENT = "economic_environment"
    TAX_ENVIRONMENT = "tax_environment"
    REVENUE_PARAMETERS = "revenue_parameters"
    COGS_PARAMETERS = "cogs_parameters"
    OPERATING_EXPENSES = "operating_expenses"
    FINANCIAL_PARAMETERS = "financial_parameters"
    OPERATIONAL_PARAMETERS = "operational_parameters"
    CASH_FLOW_LIFECYCLE = "cash_flow_lifecycle"
    CASH_FLOW_STATEMENT = "cash_flow_statement"
    BALANCE_SHEET_PARAMETERS = "balance_sheet_parameters"
    ASSET_LIFECYCLE = "asset_lifecycle"
    VALUATION_PARAMETERS = "valuation_parameters"


class ParameterType(str, Enum):
    """Parameter types"""

    PERCENTAGE = "percentage"
    CURRENCY = "currency"
    DAYS = "days"
    RATIO = "ratio"
    YEARS = "years"
    NUMBER = "number"


class SensitivityLevel(str, Enum):
    """Sensitivity levels for parameters"""

    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


@dataclass
class ParameterDefinition:
    """Definition of a parameter"""

    name: str
    key: str
    category: ParameterCategory
    parameter_type: ParameterType
    default_value: float
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    description: str = ""
    sensitivity_level: SensitivityLevel = SensitivityLevel.MEDIUM
    unit: str = ""
    dependencies: List[str] = None

    def __post_init__(self):
        if self.dependencies is None:
            self.dependencies = []


@dataclass
class ParameterGroup:
    """Group of related parameters"""

    category: ParameterCategory
    name: str
    description: str
    parameters: List[ParameterDefinition]
    display_order: int = 0


class LeanParameterManager:
    """
    Comprehensive parameter management system for lean financial modeling
    """

    def __init__(self, db: Session):
        self.db = db
        self.parameter_definitions = self._initialize_parameter_definitions()

    def _initialize_parameter_definitions(
        self,
    ) -> Dict[ParameterCategory, ParameterGroup]:
        """Initialize all parameter definitions based on the lean plan"""

        parameter_groups = {}

        # 1. Economic Environment Parameters
        economic_params = [
            ParameterDefinition(
                "Inflation Rate",
                "inflation_rate",
                ParameterCategory.ECONOMIC_ENVIRONMENT,
                ParameterType.PERCENTAGE,
                0.03,
                0.0,
                0.20,
                "General inflation rate %",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "GDP Growth Rate",
                "gdp_growth_rate",
                ParameterCategory.ECONOMIC_ENVIRONMENT,
                ParameterType.PERCENTAGE,
                0.025,
                -0.10,
                0.10,
                "GDP growth rate %",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "Interest Rate Environment",
                "interest_rate_environment",
                ParameterCategory.ECONOMIC_ENVIRONMENT,
                ParameterType.PERCENTAGE,
                0.045,
                0.0,
                0.20,
                "Base interest rate %",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "Currency Exchange Rate",
                "currency_exchange_rate",
                ParameterCategory.ECONOMIC_ENVIRONMENT,
                ParameterType.RATIO,
                1.0,
                0.5,
                2.0,
                "Exchange rate vs USD",
                SensitivityLevel.MEDIUM,
            ),
        ]
        parameter_groups[
            ParameterCategory.ECONOMIC_ENVIRONMENT
        ] = ParameterGroup(
            ParameterCategory.ECONOMIC_ENVIRONMENT,
            "Economic Environment",
            "Macroeconomic parameters affecting the business",
            economic_params,
            1,
        )

        # 2. Tax Environment Parameters
        tax_params = [
            ParameterDefinition(
                "Corporate Tax Rate",
                "corporate_tax_rate",
                ParameterCategory.TAX_ENVIRONMENT,
                ParameterType.PERCENTAGE,
                0.21,
                0.0,
                0.50,
                "Corporate income tax rate %",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "State Tax Rate",
                "state_tax_rate",
                ParameterCategory.TAX_ENVIRONMENT,
                ParameterType.PERCENTAGE,
                0.05,
                0.0,
                0.15,
                "State/local tax rate %",
                SensitivityLevel.MEDIUM,
                "%",
            ),
            ParameterDefinition(
                "Effective Tax Rate",
                "effective_tax_rate",
                ParameterCategory.TAX_ENVIRONMENT,
                ParameterType.PERCENTAGE,
                0.26,
                0.0,
                0.50,
                "Effective tax rate %",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "Tax Credits",
                "tax_credits",
                ParameterCategory.TAX_ENVIRONMENT,
                ParameterType.CURRENCY,
                0.0,
                0.0,
                1000000,
                "Available tax credits",
                SensitivityLevel.MEDIUM,
                "$",
            ),
        ]
        parameter_groups[ParameterCategory.TAX_ENVIRONMENT] = ParameterGroup(
            ParameterCategory.TAX_ENVIRONMENT,
            "Tax Environment",
            "Tax-related parameters and rates",
            tax_params,
            2,
        )

        # 3. Revenue Parameters
        revenue_params = [
            ParameterDefinition(
                "Product Revenue Growth",
                "product_revenue_growth",
                ParameterCategory.REVENUE_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.05,
                -0.50,
                1.0,
                "Product revenue growth %",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "Service Revenue Growth",
                "service_revenue_growth",
                ParameterCategory.REVENUE_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.07,
                -0.50,
                1.0,
                "Service revenue growth %",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "Product Price Inflation",
                "product_price_inflation",
                ParameterCategory.REVENUE_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.02,
                -0.10,
                0.20,
                "Product price inflation %",
                SensitivityLevel.MEDIUM,
                "%",
            ),
            ParameterDefinition(
                "Service Price Inflation",
                "service_price_inflation",
                ParameterCategory.REVENUE_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.03,
                -0.10,
                0.20,
                "Service price inflation %",
                SensitivityLevel.MEDIUM,
                "%",
            ),
        ]
        parameter_groups[ParameterCategory.REVENUE_PARAMETERS] = ParameterGroup(
            ParameterCategory.REVENUE_PARAMETERS,
            "Revenue Parameters",
            "Revenue growth and pricing parameters",
            revenue_params,
            3,
        )

        # 4. COGS Parameters
        cogs_params = [
            ParameterDefinition(
                "Direct Materials %",
                "direct_materials_percentage",
                ParameterCategory.COGS_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.35,
                0.0,
                0.80,
                "Direct materials as % of revenue",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "Direct Labor %",
                "direct_labor_percentage",
                ParameterCategory.COGS_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.20,
                0.0,
                0.60,
                "Direct labor as % of revenue",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "Manufacturing Overhead %",
                "manufacturing_overhead_percentage",
                ParameterCategory.COGS_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.15,
                0.0,
                0.50,
                "Manufacturing overhead as % of revenue",
                SensitivityLevel.MEDIUM,
                "%",
            ),
            ParameterDefinition(
                "Materials Inflation Rate",
                "materials_inflation_rate",
                ParameterCategory.COGS_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.03,
                0.0,
                0.20,
                "Materials cost inflation %",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "Labor Cost Inflation",
                "labor_cost_inflation",
                ParameterCategory.COGS_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.04,
                0.0,
                0.20,
                "Labor cost inflation %",
                SensitivityLevel.HIGH,
                "%",
            ),
        ]
        parameter_groups[ParameterCategory.COGS_PARAMETERS] = ParameterGroup(
            ParameterCategory.COGS_PARAMETERS,
            "Cost of Goods Sold",
            "Direct costs and manufacturing parameters",
            cogs_params,
            4,
        )

        # 5. Operating Expenses Parameters
        opex_params = [
            ParameterDefinition(
                "Sales Commission %",
                "sales_commission_percentage",
                ParameterCategory.OPERATING_EXPENSES,
                ParameterType.PERCENTAGE,
                0.03,
                0.0,
                0.20,
                "Sales commission as % of revenue",
                SensitivityLevel.MEDIUM,
                "%",
            ),
            ParameterDefinition(
                "Marketing Spend %",
                "marketing_spend_percentage",
                ParameterCategory.OPERATING_EXPENSES,
                ParameterType.PERCENTAGE,
                0.05,
                0.0,
                0.30,
                "Marketing as % of revenue",
                SensitivityLevel.MEDIUM,
                "%",
            ),
            ParameterDefinition(
                "R&D %",
                "rnd_percentage",
                ParameterCategory.OPERATING_EXPENSES,
                ParameterType.PERCENTAGE,
                0.08,
                0.0,
                0.30,
                "R&D as % of revenue",
                SensitivityLevel.MEDIUM,
                "%",
            ),
            ParameterDefinition(
                "Executive Salaries %",
                "executive_salaries_percentage",
                ParameterCategory.OPERATING_EXPENSES,
                ParameterType.PERCENTAGE,
                0.02,
                0.0,
                0.10,
                "Executive salaries as % of revenue",
                SensitivityLevel.LOW,
                "%",
            ),
            ParameterDefinition(
                "Office Rent %",
                "office_rent_percentage",
                ParameterCategory.OPERATING_EXPENSES,
                ParameterType.PERCENTAGE,
                0.01,
                0.0,
                0.10,
                "Office rent as % of revenue",
                SensitivityLevel.LOW,
                "%",
            ),
        ]
        parameter_groups[ParameterCategory.OPERATING_EXPENSES] = ParameterGroup(
            ParameterCategory.OPERATING_EXPENSES,
            "Operating Expenses",
            "Sales, marketing, R&D, and administrative expenses",
            opex_params,
            5,
        )

        # 6. Financial Parameters
        financial_params = [
            ParameterDefinition(
                "Short-term Interest Rate",
                "short_term_interest_rate",
                ParameterCategory.FINANCIAL_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.05,
                0.0,
                0.20,
                "Short-term debt rate %",
                SensitivityLevel.MEDIUM,
                "%",
            ),
            ParameterDefinition(
                "Long-term Interest Rate",
                "long_term_interest_rate",
                ParameterCategory.FINANCIAL_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.06,
                0.0,
                0.20,
                "Long-term debt rate %",
                SensitivityLevel.MEDIUM,
                "%",
            ),
            ParameterDefinition(
                "Cash Investment Return",
                "cash_investment_return",
                ParameterCategory.FINANCIAL_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.02,
                0.0,
                0.10,
                "Cash investment return %",
                SensitivityLevel.LOW,
                "%",
            ),
        ]
        parameter_groups[
            ParameterCategory.FINANCIAL_PARAMETERS
        ] = ParameterGroup(
            ParameterCategory.FINANCIAL_PARAMETERS,
            "Financial Parameters",
            "Interest rates and investment returns",
            financial_params,
            6,
        )

        # 7. Operational Parameters
        operational_params = [
            ParameterDefinition(
                "Accounts Receivable Days",
                "accounts_receivable_days",
                ParameterCategory.OPERATIONAL_PARAMETERS,
                ParameterType.DAYS,
                45,
                0,
                365,
                "Days sales outstanding",
                SensitivityLevel.MEDIUM,
                "days",
            ),
            ParameterDefinition(
                "Inventory Days",
                "inventory_days",
                ParameterCategory.OPERATIONAL_PARAMETERS,
                ParameterType.DAYS,
                60,
                0,
                365,
                "Days inventory outstanding",
                SensitivityLevel.MEDIUM,
                "days",
            ),
            ParameterDefinition(
                "Accounts Payable Days",
                "accounts_payable_days",
                ParameterCategory.OPERATIONAL_PARAMETERS,
                ParameterType.DAYS,
                30,
                0,
                365,
                "Days payables outstanding",
                SensitivityLevel.MEDIUM,
                "days",
            ),
            ParameterDefinition(
                "Maintenance CapEx %",
                "maintenance_capex_percentage",
                ParameterCategory.OPERATIONAL_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.03,
                0.0,
                0.20,
                "Maintenance CapEx as % of revenue",
                SensitivityLevel.MEDIUM,
                "%",
            ),
            ParameterDefinition(
                "Growth CapEx %",
                "growth_capex_percentage",
                ParameterCategory.OPERATIONAL_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.05,
                0.0,
                0.30,
                "Growth CapEx as % of revenue",
                SensitivityLevel.HIGH,
                "%",
            ),
        ]
        parameter_groups[
            ParameterCategory.OPERATIONAL_PARAMETERS
        ] = ParameterGroup(
            ParameterCategory.OPERATIONAL_PARAMETERS,
            "Operational Parameters",
            "Working capital and capital expenditure parameters",
            operational_params,
            7,
        )

        # 8. Cash Flow Lifecycle
        cash_flow_lifecycle_params = [
            ParameterDefinition(
                "Collection Period Days",
                "collection_period_days",
                ParameterCategory.CASH_FLOW_LIFECYCLE,
                ParameterType.DAYS,
                45,
                0,
                365,
                "Days to collect receivables",
                SensitivityLevel.MEDIUM,
                "days",
            ),
            ParameterDefinition(
                "Payment Terms Days",
                "payment_terms_days",
                ParameterCategory.CASH_FLOW_LIFECYCLE,
                ParameterType.DAYS,
                30,
                0,
                365,
                "Days payables outstanding",
                SensitivityLevel.MEDIUM,
                "days",
            ),
            ParameterDefinition(
                "Cash Conversion Cycle",
                "cash_conversion_cycle",
                ParameterCategory.CASH_FLOW_LIFECYCLE,
                ParameterType.DAYS,
                75,
                -365,
                365,
                "Cash conversion cycle days",
                SensitivityLevel.HIGH,
                "days",
            ),
        ]
        parameter_groups[
            ParameterCategory.CASH_FLOW_LIFECYCLE
        ] = ParameterGroup(
            ParameterCategory.CASH_FLOW_LIFECYCLE,
            "Cash Flow Lifecycle",
            "Cash conversion and working capital cycle parameters",
            cash_flow_lifecycle_params,
            8,
        )

        # 9. Cash Flow Statement Parameters
        cash_flow_statement_params = [
            ParameterDefinition(
                "Depreciation %",
                "depreciation_percentage",
                ParameterCategory.CASH_FLOW_STATEMENT,
                ParameterType.PERCENTAGE,
                0.10,
                0.0,
                0.30,
                "Depreciation as % of PP&E",
                SensitivityLevel.MEDIUM,
                "%",
            ),
            ParameterDefinition(
                "Amortization %",
                "amortization_percentage",
                ParameterCategory.CASH_FLOW_STATEMENT,
                ParameterType.PERCENTAGE,
                0.15,
                0.0,
                0.30,
                "Amortization as % of intangibles",
                SensitivityLevel.MEDIUM,
                "%",
            ),
        ]
        parameter_groups[
            ParameterCategory.CASH_FLOW_STATEMENT
        ] = ParameterGroup(
            ParameterCategory.CASH_FLOW_STATEMENT,
            "Cash Flow Statement",
            "Cash flow statement specific parameters",
            cash_flow_statement_params,
            9,
        )

        # 10. Balance Sheet Parameters
        balance_sheet_params = [
            ParameterDefinition(
                "Cash % of Revenue",
                "cash_percentage",
                ParameterCategory.BALANCE_SHEET_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.10,
                0.0,
                0.50,
                "Cash as % of revenue",
                SensitivityLevel.MEDIUM,
                "%",
            ),
            ParameterDefinition(
                "PP&E % of Revenue",
                "ppe_percentage",
                ParameterCategory.BALANCE_SHEET_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.30,
                0.0,
                2.0,
                "PP&E as % of revenue",
                SensitivityLevel.MEDIUM,
                "%",
            ),
            ParameterDefinition(
                "Debt to Equity Ratio",
                "debt_to_equity_ratio",
                ParameterCategory.BALANCE_SHEET_PARAMETERS,
                ParameterType.RATIO,
                0.5,
                0.0,
                5.0,
                "Target debt-to-equity ratio",
                SensitivityLevel.HIGH,
            ),
        ]
        parameter_groups[
            ParameterCategory.BALANCE_SHEET_PARAMETERS
        ] = ParameterGroup(
            ParameterCategory.BALANCE_SHEET_PARAMETERS,
            "Balance Sheet Parameters",
            "Balance sheet structure and ratios",
            balance_sheet_params,
            10,
        )

        # 11. Asset Lifecycle
        asset_lifecycle_params = [
            ParameterDefinition(
                "Asset Useful Life",
                "asset_useful_life_years",
                ParameterCategory.ASSET_LIFECYCLE,
                ParameterType.YEARS,
                10,
                1,
                50,
                "Average asset useful life",
                SensitivityLevel.MEDIUM,
                "years",
            ),
            ParameterDefinition(
                "Replacement Cycle",
                "replacement_cycle_years",
                ParameterCategory.ASSET_LIFECYCLE,
                ParameterType.YEARS,
                8,
                1,
                30,
                "Asset replacement frequency",
                SensitivityLevel.MEDIUM,
                "years",
            ),
            ParameterDefinition(
                "Salvage Value %",
                "salvage_value_percentage",
                ParameterCategory.ASSET_LIFECYCLE,
                ParameterType.PERCENTAGE,
                0.10,
                0.0,
                0.50,
                "% of original cost",
                SensitivityLevel.LOW,
                "%",
            ),
        ]
        parameter_groups[ParameterCategory.ASSET_LIFECYCLE] = ParameterGroup(
            ParameterCategory.ASSET_LIFECYCLE,
            "Asset Lifecycle",
            "Asset management and replacement parameters",
            asset_lifecycle_params,
            11,
        )

        # 12. Valuation Parameters
        valuation_params = [
            ParameterDefinition(
                "Discount Rate (WACC)",
                "discount_rate",
                ParameterCategory.VALUATION_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.10,
                0.01,
                0.30,
                "WACC for DCF",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "Terminal Growth Rate",
                "terminal_growth_rate",
                ParameterCategory.VALUATION_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.02,
                0.0,
                0.10,
                "Terminal growth rate %",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "Beta",
                "beta",
                ParameterCategory.VALUATION_PARAMETERS,
                ParameterType.NUMBER,
                1.2,
                0.0,
                3.0,
                "Beta for CAPM",
                SensitivityLevel.HIGH,
            ),
            ParameterDefinition(
                "Risk-free Rate",
                "risk_free_rate",
                ParameterCategory.VALUATION_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.03,
                0.0,
                0.10,
                "Risk-free rate %",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "Market Risk Premium",
                "market_risk_premium",
                ParameterCategory.VALUATION_PARAMETERS,
                ParameterType.PERCENTAGE,
                0.07,
                0.02,
                0.20,
                "Market risk premium %",
                SensitivityLevel.HIGH,
                "%",
            ),
            ParameterDefinition(
                "Projection Period",
                "projection_period_years",
                ParameterCategory.VALUATION_PARAMETERS,
                ParameterType.YEARS,
                5,
                3,
                15,
                "Number of years to project",
                SensitivityLevel.MEDIUM,
                "years",
            ),
        ]
        parameter_groups[
            ParameterCategory.VALUATION_PARAMETERS
        ] = ParameterGroup(
            ParameterCategory.VALUATION_PARAMETERS,
            "Valuation Parameters",
            "DCF and valuation model parameters",
            valuation_params,
            12,
        )

        return parameter_groups

    def get_parameter_groups(
        self,
    ) -> Dict[ParameterCategory, ParameterGroup]:
        """Get all parameter groups"""
        return self.parameter_definitions

    def get_parameter_group(
        self, category: ParameterCategory
    ) -> Optional[ParameterGroup]:
        """Get a specific parameter group"""
        return self.parameter_definitions.get(category)

    def get_parameter_definition(
        self, parameter_key: str
    ) -> Optional[ParameterDefinition]:
        """Get parameter definition by key"""
        for group in self.parameter_definitions.values():
            for param in group.parameters:
                if param.key == parameter_key:
                    return param
        return None

    def create_core_parameters_from_dict(
        self, params_dict: Dict[str, float]
    ) -> CoreParameters:
        """Create CoreParameters object from dictionary"""
        # Get default CoreParameters
        core_params = CoreParameters()

        # Update with provided values
        for key, value in params_dict.items():
            if hasattr(core_params, key):
                setattr(core_params, key, value)

        return core_params

    def validate_parameter_value(
        self, parameter_key: str, value: float
    ) -> Tuple[bool, List[str]]:
        """Validate a parameter value against its definition"""
        param_def = self.get_parameter_definition(parameter_key)
        if not param_def:
            return False, [f"Parameter {parameter_key} not found"]

        errors = []

        # Check min/max bounds
        if param_def.min_value is not None and value < param_def.min_value:
            errors.append(
                f"{parameter_key} value {value} is below minimum {param_def.min_value}"
            )

        if param_def.max_value is not None and value > param_def.max_value:
            errors.append(
                f"{parameter_key} value {value} is above maximum {param_def.max_value}"
            )

        # Type-specific validations
        if param_def.parameter_type == ParameterType.PERCENTAGE:
            if param_def.max_value is None and value > 1.0:
                errors.append(
                    f"{parameter_key} percentage value {value} should be between 0 and 1"
                )

        return len(errors) == 0, errors

    def validate_parameters(
        self, params_dict: Dict[str, float]
    ) -> Tuple[bool, Dict[str, List[str]]]:
        """Validate multiple parameters"""
        all_valid = True
        all_errors = {}

        for key, value in params_dict.items():
            is_valid, errors = self.validate_parameter_value(key, value)
            if not is_valid:
                all_valid = False
                all_errors[key] = errors

        return all_valid, all_errors

    def get_parameter_dependencies(self, parameter_key: str) -> List[str]:
        """Get dependencies for a parameter"""
        param_def = self.get_parameter_definition(parameter_key)
        return param_def.dependencies if param_def else []

    def calculate_parameter_impact(
        self,
        parameter_key: str,
        old_value: float,
        new_value: float,
        base_parameters: CoreParameters,
    ) -> Dict[str, Any]:
        """Calculate the impact of changing a parameter"""
        from app.services.lean_financial_engine import LeanFinancialEngine

        engine = LeanFinancialEngine(self.db)

        # Calculate with old value
        old_params = CoreParameters(**asdict(base_parameters))
        if hasattr(old_params, parameter_key):
            setattr(old_params, parameter_key, old_value)
        old_model = engine.calculate_comprehensive_model(old_params)

        # Calculate with new value
        new_params = CoreParameters(**asdict(base_parameters))
        if hasattr(new_params, parameter_key):
            setattr(new_params, parameter_key, new_value)
        new_model = engine.calculate_comprehensive_model(new_params)

        # Calculate impact
        impact = {
            "parameter_key": parameter_key,
            "old_value": old_value,
            "new_value": new_value,
            "change_percent": ((new_value - old_value) / old_value * 100)
            if old_value != 0
            else 0,
            "impacts": {
                "revenue_impact": {
                    "old": old_model["profit_loss"].total_revenue,
                    "new": new_model["profit_loss"].total_revenue,
                    "change_percent": (
                        (
                            new_model["profit_loss"].total_revenue
                            - old_model["profit_loss"].total_revenue
                        )
                        / old_model["profit_loss"].total_revenue
                        * 100
                    )
                    if old_model["profit_loss"].total_revenue != 0
                    else 0,
                },
                "net_income_impact": {
                    "old": old_model["profit_loss"].net_income,
                    "new": new_model["profit_loss"].net_income,
                    "change_percent": (
                        (
                            new_model["profit_loss"].net_income
                            - old_model["profit_loss"].net_income
                        )
                        / old_model["profit_loss"].net_income
                        * 100
                    )
                    if old_model["profit_loss"].net_income != 0
                    else 0,
                },
                "enterprise_value_impact": {
                    "old": old_model["dcf_valuation"].enterprise_value,
                    "new": new_model["dcf_valuation"].enterprise_value,
                    "change_percent": (
                        (
                            new_model["dcf_valuation"].enterprise_value
                            - old_model["dcf_valuation"].enterprise_value
                        )
                        / old_model["dcf_valuation"].enterprise_value
                        * 100
                    )
                    if old_model["dcf_valuation"].enterprise_value != 0
                    else 0,
                },
                "value_per_share_impact": {
                    "old": old_model["dcf_valuation"].value_per_share,
                    "new": new_model["dcf_valuation"].value_per_share,
                    "change_percent": (
                        (
                            new_model["dcf_valuation"].value_per_share
                            - old_model["dcf_valuation"].value_per_share
                        )
                        / old_model["dcf_valuation"].value_per_share
                        * 100
                    )
                    if old_model["dcf_valuation"].value_per_share != 0
                    else 0,
                },
            },
        }

        return impact

    def create_sensitivity_analysis(
        self,
        base_parameters: CoreParameters,
        sensitivity_parameters: List[str] = None,
        variation_percent: float = 0.20,
    ) -> Dict[str, Any]:
        """Create sensitivity analysis for key parameters"""
        from app.services.lean_financial_engine import LeanFinancialEngine

        if sensitivity_parameters is None:
            # Default high-sensitivity parameters
            sensitivity_parameters = [
                "product_revenue_growth",
                "service_revenue_growth",
                "direct_materials_percentage",
                "direct_labor_percentage",
                "effective_tax_rate",
                "discount_rate",
                "terminal_growth_rate",
            ]

        engine = LeanFinancialEngine(self.db)
        base_model = engine.calculate_comprehensive_model(base_parameters)

        sensitivity_results = {
            "base_case": {
                "parameters": asdict(base_parameters),
                "enterprise_value": base_model[
                    "dcf_valuation"
                ].enterprise_value,
                "value_per_share": base_model["dcf_valuation"].value_per_share,
                "net_income": base_model["profit_loss"].net_income,
            },
            "sensitivity_analysis": {},
        }

        for param_key in sensitivity_parameters:
            if hasattr(base_parameters, param_key):
                base_value = getattr(base_parameters, param_key)

                # Test upward variation
                up_params = CoreParameters(**asdict(base_parameters))
                setattr(
                    up_params,
                    param_key,
                    base_value * (1 + variation_percent),
                )
                up_model = engine.calculate_comprehensive_model(up_params)

                # Test downward variation
                down_params = CoreParameters(**asdict(base_parameters))
                setattr(
                    down_params,
                    param_key,
                    base_value * (1 - variation_percent),
                )
                down_model = engine.calculate_comprehensive_model(down_params)

                sensitivity_results["sensitivity_analysis"][param_key] = {
                    "base_value": base_value,
                    "variation_percent": variation_percent,
                    "upward_case": {
                        "value": base_value * (1 + variation_percent),
                        "enterprise_value": up_model[
                            "dcf_valuation"
                        ].enterprise_value,
                        "value_per_share": up_model[
                            "dcf_valuation"
                        ].value_per_share,
                        "ev_change_percent": (
                            (
                                up_model["dcf_valuation"].enterprise_value
                                - base_model["dcf_valuation"].enterprise_value
                            )
                            / base_model["dcf_valuation"].enterprise_value
                            * 100
                        ),
                    },
                    "downward_case": {
                        "value": base_value * (1 - variation_percent),
                        "enterprise_value": down_model[
                            "dcf_valuation"
                        ].enterprise_value,
                        "value_per_share": down_model[
                            "dcf_valuation"
                        ].value_per_share,
                        "ev_change_percent": (
                            (
                                down_model["dcf_valuation"].enterprise_value
                                - base_model["dcf_valuation"].enterprise_value
                            )
                            / base_model["dcf_valuation"].enterprise_value
                            * 100
                        ),
                    },
                }

        return sensitivity_results

    def create_scenario_templates(self) -> Dict[str, Dict[str, float]]:
        """Create predefined scenario templates"""

        base_params = asdict(CoreParameters())

        templates = {
            "conservative": {
                **base_params,
                "product_revenue_growth": 0.02,
                "service_revenue_growth": 0.03,
                "discount_rate": 0.12,
                "terminal_growth_rate": 0.015,
            },
            "base_case": base_params,
            "optimistic": {
                **base_params,
                "product_revenue_growth": 0.08,
                "service_revenue_growth": 0.12,
                "discount_rate": 0.09,
                "terminal_growth_rate": 0.025,
            },
            "high_inflation": {
                **base_params,
                "inflation_rate": 0.06,
                "materials_inflation_rate": 0.08,
                "labor_cost_inflation": 0.07,
                "interest_rate_environment": 0.08,
            },
            "recession": {
                **base_params,
                "product_revenue_growth": -0.05,
                "service_revenue_growth": -0.02,
                "gdp_growth_rate": -0.02,
                "discount_rate": 0.15,
            },
        }

        return templates

    def export_parameters(
        self, parameters: CoreParameters, format: str = "json"
    ) -> str:
        """Export parameters to specified format"""
        params_dict = asdict(parameters)

        if format.lower() == "json":
            return json.dumps(params_dict, indent=2)
        elif format.lower() == "csv":
            import csv
            import io

            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(["Parameter", "Value"])
            for key, value in params_dict.items():
                writer.writerow([key, value])
            return output.getvalue()
        else:
            raise ValueError(f"Unsupported export format: {format}")

    def import_parameters(
        self, data: str, format: str = "json"
    ) -> CoreParameters:
        """Import parameters from specified format"""
        if format.lower() == "json":
            params_dict = json.loads(data)
            return self.create_core_parameters_from_dict(params_dict)
        else:
            raise ValueError(f"Unsupported import format: {format}")
