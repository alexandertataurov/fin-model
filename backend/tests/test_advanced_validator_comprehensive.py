import pytest
from unittest.mock import Mock, patch, MagicMock
from typing import List, Dict, Any

from app.services.advanced_validator import (
    AdvancedValidator,
    TemplateType,
    ValidationSeverity,
    ColumnMapping,
    TemplateValidationResult,
    FinancialSection,
)
from app.services.excel_parser import (
    ParsedData,
    SheetInfo,
    CellInfo,
    DataType,
    SheetType,
    ValidationError,
)


class TestAdvancedValidator:
    @pytest.fixture
    def validator(self):
        return AdvancedValidator()

    @pytest.fixture
    def sample_pl_data(self):
        """Sample P&L statement data"""
        return {
            "filename": "pl_statement.xlsx",
            "sheets": [
                {
                    "name": "Profit & Loss",
                    "type": "financial",
                    "headers": ["Account", "Description", "Current Year", "Prior Year"],
                    "data": [
                        ["Revenue", "Total Sales", 1000000, 900000],
                        ["Cost of Sales", "COGS", 600000, 540000],
                        ["Gross Profit", "Revenue - COGS", 400000, 360000],
                        ["Operating Expenses", "OpEx", 250000, 225000],
                        ["Operating Income", "EBIT", 150000, 135000],
                        ["Interest Expense", "Interest", 20000, 18000],
                        ["Net Income", "Bottom Line", 130000, 117000],
                    ],
                }
            ],
        }

    @pytest.fixture
    def sample_balance_sheet_data(self):
        """Sample balance sheet data"""
        return {
            "filename": "balance_sheet.xlsx",
            "sheets": [
                {
                    "name": "Balance Sheet",
                    "type": "financial",
                    "headers": ["Account", "Current Year", "Prior Year"],
                    "data": [
                        ["Current Assets", 500000, 450000],
                        ["Fixed Assets", 800000, 750000],
                        ["Total Assets", 1300000, 1200000],
                        ["Current Liabilities", 200000, 180000],
                        ["Long-term Debt", 400000, 380000],
                        ["Total Equity", 700000, 640000],
                    ],
                }
            ],
        }

    @pytest.fixture
    def sample_cash_flow_data(self):
        """Sample cash flow statement data"""
        return {
            "filename": "cash_flow.xlsx",
            "sheets": [
                {
                    "name": "Cash Flow",
                    "type": "financial",
                    "headers": ["Activity", "Current Year", "Prior Year"],
                    "data": [
                        ["Operating Cash Flow", 180000, 160000],
                        ["Investing Cash Flow", -120000, -100000],
                        ["Financing Cash Flow", -50000, -45000],
                        ["Net Cash Flow", 10000, 15000],
                    ],
                }
            ],
        }

    def test_validator_initialization(self, validator):
        """Test validator initialization"""
        assert hasattr(validator, "pl_template")
        assert hasattr(validator, "balance_sheet_template")
        assert hasattr(validator, "cash_flow_template")

    def test_validate_pl_template_success(self, validator, sample_pl_data):
        """Test successful P&L template validation"""
        result = validator.validate_template(sample_pl_data, TemplateType.PROFIT_LOSS)

        assert isinstance(result, TemplateValidationResult)
        assert result.template_type == TemplateType.PROFIT_LOSS
        assert result.is_valid is True
        assert result.confidence_score > 0.7
        assert len(result.detected_columns) > 0

    def test_validate_balance_sheet_template_success(
        self, validator, sample_balance_sheet_data
    ):
        """Test successful balance sheet template validation"""
        result = validator.validate_template(
            sample_balance_sheet_data, TemplateType.BALANCE_SHEET
        )

        assert isinstance(result, TemplateValidationResult)
        assert result.template_type == TemplateType.BALANCE_SHEET
        assert result.is_valid is True
        assert result.confidence_score > 0.7

    def test_validate_cash_flow_template_success(
        self, validator, sample_cash_flow_data
    ):
        """Test successful cash flow template validation"""
        result = validator.validate_template(
            sample_cash_flow_data, TemplateType.CASH_FLOW
        )

        assert isinstance(result, TemplateValidationResult)
        assert result.template_type == TemplateType.CASH_FLOW
        assert result.is_valid is True
        assert result.confidence_score > 0.7

    def test_validate_template_missing_columns(self, validator):
        """Test template validation with missing required columns"""
        incomplete_data = {
            "filename": "incomplete.xlsx",
            "sheets": [
                {
                    "name": "P&L",
                    "type": "financial",
                    "headers": ["Account"],  # Missing required columns
                    "data": [["Revenue"], ["Expenses"]],
                }
            ],
        }

        result = validator.validate_template(incomplete_data, TemplateType.PROFIT_LOSS)

        assert result.is_valid is False
        assert len(result.missing_columns) > 0
        assert len(result.validation_errors) > 0

    def test_validate_template_no_sheets(self, validator):
        """Test template validation with no sheets"""
        empty_data = {"filename": "empty.xlsx", "sheets": []}

        result = validator.validate_template(empty_data, TemplateType.PROFIT_LOSS)

        assert result.is_valid is False
        assert len(result.validation_errors) > 0

    def test_detect_column_mappings(self, validator, sample_pl_data):
        """Test column mapping detection"""
        sheet_data = sample_pl_data["sheets"][0]
        mappings = validator._detect_column_mappings(
            sheet_data, TemplateType.PROFIT_LOSS
        )

        assert len(mappings) > 0
        assert all(isinstance(mapping, ColumnMapping) for mapping in mappings)
        assert all(
            mapping.confidence >= 0.0 and mapping.confidence <= 1.0
            for mapping in mappings
        )

    def test_identify_financial_sections_pl(self, validator, sample_pl_data):
        """Test financial section identification for P&L"""
        sheet_data = sample_pl_data["sheets"][0]
        sections = validator._identify_financial_sections(
            sheet_data, TemplateType.PROFIT_LOSS
        )

        assert len(sections) > 0
        assert all(isinstance(section, FinancialSection) for section in sections)

        # Check for expected sections
        section_names = [section.name.lower() for section in sections]
        assert any("revenue" in name for name in section_names)
        assert any("cost" in name for name in section_names)

    def test_validate_data_quality(self, validator, sample_pl_data):
        """Test data quality validation"""
        sheet_data = sample_pl_data["sheets"][0]
        quality_score = validator._validate_data_quality(sheet_data)

        assert isinstance(quality_score, float)
        assert 0.0 <= quality_score <= 1.0

    def test_check_calculation_consistency(self, validator, sample_pl_data):
        """Test calculation consistency checking"""
        sheet_data = sample_pl_data["sheets"][0]
        errors = validator._check_calculation_consistency(
            sheet_data, TemplateType.PROFIT_LOSS
        )

        assert isinstance(errors, list)
        # Should have minimal errors for consistent data
        assert len(errors) <= 2

    def test_generate_suggestions(self, validator):
        """Test suggestion generation"""
        validation_result = TemplateValidationResult(
            template_type=TemplateType.PROFIT_LOSS,
            is_valid=False,
            confidence_score=0.6,
            missing_columns=["budget", "variance"],
            validation_errors=[
                ValidationError(
                    message="Missing required section",
                    severity=ValidationSeverity.ERROR,
                    cell_reference="A1",
                )
            ],
        )

        suggestions = validator._generate_suggestions(validation_result)

        assert len(suggestions) > 0
        assert all(isinstance(suggestion, str) for suggestion in suggestions)

    def test_calculate_compliance_score(self, validator, sample_pl_data):
        """Test compliance score calculation"""
        sheet_data = sample_pl_data["sheets"][0]
        template_type = TemplateType.PROFIT_LOSS

        score = validator._calculate_compliance_score(sheet_data, template_type)

        assert isinstance(score, float)
        assert 0.0 <= score <= 1.0

    def test_validate_template_with_errors(self, validator):
        """Test template validation with data errors"""
        error_data = {
            "filename": "error_data.xlsx",
            "sheets": [
                {
                    "name": "P&L",
                    "type": "financial",
                    "headers": ["Account", "Amount", "Prior"],
                    "data": [
                        ["Revenue", "invalid_number", 900000],  # Invalid data type
                        ["Expenses", 500000, "also_invalid"],  # Invalid data type
                        ["", 100000, 90000],  # Empty account name
                    ],
                }
            ],
        }

        result = validator.validate_template(error_data, TemplateType.PROFIT_LOSS)

        assert len(result.validation_errors) > 0
        assert result.data_quality_score < 1.0

    def test_auto_detect_template_type(
        self, validator, sample_pl_data, sample_balance_sheet_data
    ):
        """Test automatic template type detection"""
        # Test P&L detection
        pl_type = validator.auto_detect_template_type(sample_pl_data)
        assert pl_type == TemplateType.PROFIT_LOSS

        # Test Balance Sheet detection
        bs_type = validator.auto_detect_template_type(sample_balance_sheet_data)
        assert bs_type == TemplateType.BALANCE_SHEET

    def test_validate_multiple_sheets(self, validator):
        """Test validation of files with multiple sheets"""
        multi_sheet_data = {
            "filename": "multi_sheet.xlsx",
            "sheets": [
                {
                    "name": "Summary",
                    "type": "general",
                    "headers": ["Metric", "Value"],
                    "data": [["Total Revenue", 1000000]],
                },
                {
                    "name": "Detailed P&L",
                    "type": "financial",
                    "headers": ["Account", "Current", "Prior"],
                    "data": [
                        ["Revenue", 1000000, 900000],
                        ["Expenses", 800000, 720000],
                        ["Net Income", 200000, 180000],
                    ],
                },
            ],
        }

        result = validator.validate_template(multi_sheet_data, TemplateType.PROFIT_LOSS)

        # Should focus on the financial sheet
        assert result.template_type == TemplateType.PROFIT_LOSS


class TestColumnMapping:
    """Test ColumnMapping dataclass"""

    def test_column_mapping_creation(self):
        """Test ColumnMapping creation"""
        mapping = ColumnMapping(
            column_index=0,
            column_letter="A",
            expected_name="Account",
            detected_name="Account Name",
            confidence=0.95,
            data_type="text",
            sample_values=["Revenue", "Expenses", "Net Income"],
        )

        assert mapping.column_index == 0
        assert mapping.column_letter == "A"
        assert mapping.confidence == 0.95
        assert len(mapping.sample_values) == 3

    def test_column_mapping_defaults(self):
        """Test ColumnMapping with default values"""
        mapping = ColumnMapping(
            column_index=1,
            column_letter="B",
            expected_name="Amount",
            detected_name="Current Amount",
            confidence=0.8,
            data_type="number",
        )

        assert len(mapping.sample_values) == 0


class TestTemplateValidationResult:
    """Test TemplateValidationResult dataclass"""

    def test_validation_result_creation(self):
        """Test TemplateValidationResult creation"""
        result = TemplateValidationResult(
            template_type=TemplateType.PROFIT_LOSS,
            is_valid=True,
            confidence_score=0.9,
            detected_columns=[ColumnMapping(0, "A", "Account", "Account", 1.0, "text")],
            missing_columns=["Budget"],
            validation_errors=[],
            suggestions=["Consider adding budget column"],
            data_quality_score=0.95,
            compliance_score=0.88,
        )

        assert result.template_type == TemplateType.PROFIT_LOSS
        assert result.is_valid is True
        assert result.confidence_score == 0.9
        assert len(result.detected_columns) == 1
        assert len(result.missing_columns) == 1

    def test_validation_result_defaults(self):
        """Test TemplateValidationResult with default values"""
        result = TemplateValidationResult(
            template_type=TemplateType.BALANCE_SHEET,
            is_valid=False,
            confidence_score=0.5,
        )

        assert len(result.detected_columns) == 0
        assert len(result.missing_columns) == 0
        assert len(result.validation_errors) == 0
        assert len(result.suggestions) == 0
        assert result.data_quality_score == 0.0
        assert result.compliance_score == 0.0


class TestFinancialSection:
    """Test FinancialSection dataclass"""

    def test_financial_section_creation(self):
        """Test FinancialSection creation"""
        section = FinancialSection(
            name="Revenue Section",
            section_type="revenue",
            start_row=1,
            end_row=5,
            accounts=["Sales Revenue", "Service Revenue"],
            values=[500000, 300000],
            formulas=["=B1+B2", "=SUM(B1:B2)"],
        )

        assert section.name == "Revenue Section"
        assert section.section_type == "revenue"
        assert section.start_row == 1
        assert section.end_row == 5
        assert len(section.accounts) == 2
        assert len(section.values) == 2

    def test_financial_section_defaults(self):
        """Test FinancialSection with default values"""
        section = FinancialSection(
            name="Expenses", section_type="expense", start_row=10, end_row=15
        )

        assert len(section.accounts) == 0
        assert len(section.values) == 0
        assert len(section.formulas) == 0


class TestAdvancedValidatorIntegration:
    """Integration tests for AdvancedValidator"""

    @pytest.mark.integration
    def test_comprehensive_pl_validation(self):
        """Test comprehensive P&L validation"""
        validator = AdvancedValidator()

        comprehensive_pl_data = {
            "filename": "comprehensive_pl.xlsx",
            "sheets": [
                {
                    "name": "Income Statement",
                    "type": "financial",
                    "headers": [
                        "Line Item",
                        "Current Year",
                        "Prior Year",
                        "Budget",
                        "Variance",
                    ],
                    "data": [
                        ["Revenue", 2500000, 2200000, 2400000, 100000],
                        ["Product Sales", 1800000, 1600000, 1750000, 50000],
                        ["Service Revenue", 700000, 600000, 650000, 50000],
                        ["Cost of Goods Sold", 1500000, 1320000, 1440000, -60000],
                        ["Gross Profit", 1000000, 880000, 960000, 40000],
                        ["Selling Expenses", 300000, 275000, 290000, -10000],
                        ["Administrative Expenses", 200000, 180000, 195000, -5000],
                        ["Total Operating Expenses", 500000, 455000, 485000, -15000],
                        ["Operating Income", 500000, 425000, 475000, 25000],
                        ["Interest Expense", 50000, 45000, 48000, -2000],
                        ["Pre-tax Income", 450000, 380000, 427000, 23000],
                        ["Income Tax", 135000, 114000, 128100, 6900],
                        ["Net Income", 315000, 266000, 298900, 16100],
                    ],
                }
            ],
        }

        result = validator.validate_template(
            comprehensive_pl_data, TemplateType.PROFIT_LOSS
        )

        # Should be highly valid
        assert result.is_valid is True
        assert result.confidence_score > 0.8
        assert result.data_quality_score > 0.8
        assert result.compliance_score > 0.7

        # Should detect all required columns
        assert len(result.detected_columns) >= 4  # At least basic columns
        assert len(result.missing_columns) == 0  # No missing required columns

    @pytest.mark.integration
    def test_multi_template_validation(self):
        """Test validation across multiple template types"""
        validator = AdvancedValidator()

        test_cases = [
            (TemplateType.PROFIT_LOSS, "P&L"),
            (TemplateType.BALANCE_SHEET, "Balance Sheet"),
            (TemplateType.CASH_FLOW, "Cash Flow"),
        ]

        for template_type, sheet_name in test_cases:
            data = {
                "filename": f"{template_type.value}.xlsx",
                "sheets": [
                    {
                        "name": sheet_name,
                        "type": "financial",
                        "headers": ["Account", "Current", "Prior"],
                        "data": [
                            ["Line Item 1", 100000, 90000],
                            ["Line Item 2", 200000, 180000],
                            ["Total", 300000, 270000],
                        ],
                    }
                ],
            }

            result = validator.validate_template(data, template_type)

            assert result.template_type == template_type
            assert isinstance(result.is_valid, bool)
            assert 0.0 <= result.confidence_score <= 1.0

    @pytest.mark.integration
    def test_error_recovery_and_suggestions(self):
        """Test error recovery and suggestion generation"""
        validator = AdvancedValidator()

        problematic_data = {
            "filename": "problematic.xlsx",
            "sheets": [
                {
                    "name": "Broken P&L",
                    "type": "financial",
                    "headers": ["Item", "Value"],  # Missing required columns
                    "data": [
                        ["", 100000],  # Empty account name
                        ["Revenue", "N/A"],  # Invalid data type
                        ["Expenses", 50000],
                        ["Profit", ""],  # Empty value
                    ],
                }
            ],
        }

        result = validator.validate_template(problematic_data, TemplateType.PROFIT_LOSS)

        # Should identify problems
        assert result.is_valid is False
        assert len(result.validation_errors) > 0
        assert len(result.suggestions) > 0
        assert result.data_quality_score < 0.8

        # Should still provide useful feedback
        assert len(result.missing_columns) > 0

        # Suggestions should be actionable
        suggestions_text = " ".join(result.suggestions).lower()
        assert any(
            keyword in suggestions_text
            for keyword in ["add", "fix", "correct", "include"]
        )
