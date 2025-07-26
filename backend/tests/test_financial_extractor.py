import pytest
from unittest.mock import Mock, patch, MagicMock
import pandas as pd
import numpy as np
from datetime import datetime

from app.services.financial_extractor import (
    FinancialExtractor,
    FinancialMetric,
    TimeSeriesData,
    MetricType,
    TimeSeriesType,
    SheetRelationship,
    CalculationDependency
)


class TestFinancialExtractor:
    @pytest.fixture
    def extractor(self):
        return FinancialExtractor()

    @pytest.fixture
    def sample_parsed_data(self):
        return {
            "sheets": [
                {
                    "name": "Income Statement",
                    "type": "financial",
                    "data": [
                        ["Account", "2023", "2022"],
                        ["Revenue", 100000, 90000],
                        ["Cost of Goods Sold", 60000, 54000],
                        ["Gross Profit", 40000, 36000],
                        ["Operating Expenses", 25000, 22000],
                        ["Operating Income", 15000, 14000],
                        ["Net Income", 12000, 11000]
                    ]
                },
                {
                    "name": "Balance Sheet",
                    "type": "financial",
                    "data": [
                        ["Account", "2023", "2022"],
                        ["Current Assets", 50000, 45000],
                        ["Fixed Assets", 80000, 75000],
                        ["Total Assets", 130000, 120000],
                        ["Current Liabilities", 20000, 18000],
                        ["Long-term Debt", 40000, 38000],
                        ["Equity", 70000, 64000]
                    ]
                },
                {
                    "name": "Cash Flow",
                    "type": "financial", 
                    "data": [
                        ["Account", "2023", "2022"],
                        ["Operating Cash Flow", 18000, 16000],
                        ["Investing Cash Flow", -15000, -12000],
                        ["Financing Cash Flow", -5000, -3000],
                        ["Net Cash Flow", -2000, 1000]
                    ]
                }
            ]
        }

    @pytest.fixture
    def sample_pl_data(self):
        return {
            "sheets": [
                {
                    "name": "P&L Statement",
                    "type": "financial",
                    "data": [
                        ["Line Item", "Q1 2023", "Q2 2023", "Q3 2023"],
                        ["Sales Revenue", 25000, 27000, 28000],
                        ["COGS", 15000, 16000, 16500],
                        ["Gross Margin", 10000, 11000, 11500],
                        ["SG&A", 6000, 6500, 7000],
                        ["EBITDA", 4000, 4500, 4500]
                    ]
                }
            ]
        }

    def test_extract_basic_functionality(self, extractor, sample_parsed_data):
        """Test basic extraction functionality"""
        result = extractor.extract(sample_parsed_data)
        
        assert "financial_metrics" in result
        assert "time_series_data" in result
        assert "extraction_metadata" in result
        assert result["extraction_metadata"]["sheets"] == 3

    def test_extract_statements(self, extractor, sample_parsed_data):
        """Test financial statement extraction"""
        result = extractor.extract_statements(sample_parsed_data)
        
        assert "income_statement" in result
        assert "balance_sheet" in result
        assert "cash_flow" in result
        
        # Check income statement extraction
        income_statement = result["income_statement"]
        assert len(income_statement) == 6  # 6 line items
        assert income_statement[0]["account"] == "Revenue"
        assert income_statement[0]["value"] == 100000

    def test_extract_from_pl_data(self, extractor, sample_pl_data):
        """Test extraction from P&L data"""
        result = extractor.extract_statements(sample_pl_data)
        
        income_statement = result["income_statement"]
        assert len(income_statement) == 5  # 5 line items
        assert income_statement[0]["account"] == "Sales Revenue"
        assert income_statement[0]["value"] == 25000

    def test_extract_balance_sheet(self, extractor, sample_parsed_data):
        """Test balance sheet extraction"""
        result = extractor.extract_statements(sample_parsed_data)
        
        balance_sheet = result["balance_sheet"]
        assert len(balance_sheet) == 6  # 6 line items
        assert balance_sheet[0]["account"] == "Current Assets"
        assert balance_sheet[0]["value"] == 50000

    def test_extract_cash_flow(self, extractor, sample_parsed_data):
        """Test cash flow extraction"""
        result = extractor.extract_statements(sample_parsed_data)
        
        cash_flow = result["cash_flow"]
        assert len(cash_flow) == 4  # 4 line items
        assert cash_flow[0]["account"] == "Operating Cash Flow"
        assert cash_flow[0]["value"] == 18000

    def test_extract_empty_data(self, extractor):
        """Test extraction with empty data"""
        empty_data = {"sheets": []}
        result = extractor.extract(empty_data)
        
        assert result["extraction_metadata"]["sheets"] == 0

    def test_extract_with_missing_sheets(self, extractor):
        """Test extraction with missing sheets key"""
        invalid_data = {}
        result = extractor.extract(invalid_data)
        
        assert result["extraction_metadata"]["sheets"] == 0

    def test_extract_with_incomplete_data(self, extractor):
        """Test extraction with incomplete sheet data"""
        incomplete_data = {
            "sheets": [
                {
                    "name": "Incomplete Sheet",
                    "data": [
                        ["Account"],  # Header only
                    ]
                }
            ]
        }
        result = extractor.extract_statements(incomplete_data)
        
        # Should handle incomplete data gracefully
        assert "income_statement" in result
        assert "balance_sheet" in result
        assert "cash_flow" in result

    @patch('app.services.financial_extractor.ExcelParser')
    def test_extract_with_file_path(self, mock_parser, extractor, sample_parsed_data):
        """Test extraction with file path (mocked)"""
        mock_parser_instance = Mock()
        mock_parser_instance.parse_file.return_value = sample_parsed_data
        mock_parser.return_value = mock_parser_instance
        
        result = extractor.extract("/path/to/file.xlsx")
        
        assert "financial_metrics" in result
        mock_parser_instance.parse_file.assert_called_once_with("/path/to/file.xlsx")

    def test_sheet_name_matching(self, extractor):
        """Test sheet name matching logic"""
        test_cases = [
            {
                "sheets": [{"name": "Income Statement", "data": [["Revenue", 1000]]}],
                "expected_key": "income_statement"
            },
            {
                "sheets": [{"name": "Balance Sheet", "data": [["Assets", 5000]]}],
                "expected_key": "balance_sheet"
            },
            {
                "sheets": [{"name": "Cash Flow Statement", "data": [["Operating CF", 2000]]}],
                "expected_key": "cash_flow"
            }
        ]
        
        for case in test_cases:
            result = extractor.extract_statements(case["sheets"])
            assert len(result[case["expected_key"]]) > 0

    def test_data_row_filtering(self, extractor):
        """Test that header rows are properly filtered"""
        data_with_headers = {
            "sheets": [
                {
                    "name": "P&L",
                    "data": [
                        ["Account", "Value"],  # Header row - should be skipped
                        ["Revenue", 1000],      # Data row
                        ["Expenses", 800],      # Data row
                    ]
                }
            ]
        }
        
        result = extractor.extract_statements(data_with_headers)
        income_statement = result["income_statement"]
        
        assert len(income_statement) == 2  # Only data rows, not header
        assert income_statement[0]["account"] == "Revenue"
        assert income_statement[1]["account"] == "Expenses"


class TestFinancialMetric:
    def test_financial_metric_creation(self):
        """Test FinancialMetric dataclass creation"""
        metric = FinancialMetric(
            name="Gross Margin",
            value=0.35,
            category=MetricType.PROFITABILITY,
            formula="(Revenue - COGS) / Revenue",
            confidence=0.95,
            source_cells=["B2", "B3", "B4"],
            period="2023-Q1",
            unit="percentage"
        )
        
        assert metric.name == "Gross Margin"
        assert metric.value == 0.35
        assert metric.category == MetricType.PROFITABILITY
        assert metric.confidence == 0.95
        assert len(metric.source_cells) == 3

    def test_financial_metric_defaults(self):
        """Test FinancialMetric with default values"""
        metric = FinancialMetric(
            name="ROI",
            value=0.12,
            category=MetricType.PROFITABILITY,
            formula="Net Income / Investment",
            confidence=0.8,
            source_cells=["A1", "A2"]
        )
        
        assert metric.period is None
        assert metric.unit == "currency"


class TestTimeSeriesData:
    def test_time_series_data_creation(self):
        """Test TimeSeriesData dataclass creation"""
        data_points = [
            {"period": "2023-Q1", "value": 1000, "date": datetime(2023, 3, 31)},
            {"period": "2023-Q2", "value": 1200, "date": datetime(2023, 6, 30)},
            {"period": "2023-Q3", "value": 1100, "date": datetime(2023, 9, 30)}
        ]
        
        time_series = TimeSeriesData(
            metric_name="Revenue",
            data_points=data_points,
            frequency=TimeSeriesType.QUARTERLY,
            trend="increasing",
            growth_rate=0.05,
            volatility=0.08
        )
        
        assert time_series.metric_name == "Revenue"
        assert len(time_series.data_points) == 3
        assert time_series.frequency == TimeSeriesType.QUARTERLY
        assert time_series.trend == "increasing"

    def test_time_series_data_defaults(self):
        """Test TimeSeriesData with default values"""
        time_series = TimeSeriesData(
            metric_name="EBITDA",
            data_points=[{"period": "2023", "value": 5000}],
            frequency=TimeSeriesType.YEARLY
        )
        
        assert time_series.trend is None
        assert time_series.growth_rate is None
        assert time_series.volatility is None


class TestSheetRelationship:
    def test_sheet_relationship_creation(self):
        """Test SheetRelationship dataclass creation"""
        relationship = SheetRelationship(
            source_sheet="Summary",
            target_sheet="Details",
            relationship_type="reference",
            linked_cells=[("A1", "B2"), ("C3", "D4")],
            confidence=0.9
        )
        
        assert relationship.source_sheet == "Summary"
        assert relationship.target_sheet == "Details"
        assert relationship.relationship_type == "reference"
        assert len(relationship.linked_cells) == 2
        assert relationship.confidence == 0.9


class TestCalculationDependency:
    def test_calculation_dependency_creation(self):
        """Test CalculationDependency dataclass creation"""
        dependency = CalculationDependency(
            dependent_cell="C1",
            formula="=A1+B1",
            precedent_cells=["A1", "B1"],
            sheet_name="Sheet1",
            calculation_type="sum"
        )
        
        assert dependency.dependent_cell == "C1"
        assert dependency.formula == "=A1+B1"
        assert len(dependency.precedent_cells) == 2
        assert dependency.sheet_name == "Sheet1"
        assert dependency.calculation_type == "sum"


class TestFinancialExtractorIntegration:
    """Integration tests for FinancialExtractor"""
    
    @pytest.mark.integration
    def test_comprehensive_extraction(self):
        """Test comprehensive extraction with complex data"""
        extractor = FinancialExtractor()
        
        complex_data = {
            "sheets": [
                {
                    "name": "Consolidated P&L",
                    "type": "financial",
                    "data": [
                        ["Metric", "2021", "2022", "2023"],
                        ["Total Revenue", 850000, 920000, 1050000],
                        ["Cost of Revenue", 510000, 552000, 630000],
                        ["Gross Profit", 340000, 368000, 420000],
                        ["R&D Expenses", 85000, 92000, 105000],
                        ["Sales & Marketing", 102000, 110000, 126000],
                        ["General & Admin", 68000, 73000, 84000],
                        ["Operating Income", 85000, 93000, 105000],
                        ["Interest Expense", 12000, 11000, 15000],
                        ["Pre-tax Income", 73000, 82000, 90000],
                        ["Tax Expense", 18250, 20500, 22500],
                        ["Net Income", 54750, 61500, 67500]
                    ]
                },
                {
                    "name": "Balance Sheet Summary",
                    "data": [
                        ["Item", "2021", "2022", "2023"],
                        ["Cash & Equivalents", 125000, 140000, 160000],
                        ["Accounts Receivable", 95000, 110000, 125000],
                        ["Inventory", 80000, 85000, 95000],
                        ["Total Current Assets", 300000, 335000, 380000],
                        ["Property & Equipment", 450000, 485000, 520000],
                        ["Intangible Assets", 75000, 80000, 85000],
                        ["Total Assets", 825000, 900000, 985000]
                    ]
                }
            ]
        }
        
        result = extractor.extract_statements(complex_data)
        
        # Verify comprehensive extraction
        assert len(result["income_statement"]) == 11  # 11 P&L line items
        assert len(result["balance_sheet"]) == 7    # 7 balance sheet items
        
        # Verify specific values
        income_stmt = result["income_statement"]
        revenue_item = next(item for item in income_stmt if item["account"] == "Total Revenue")
        assert revenue_item["value"] == 850000
        
        balance_sheet = result["balance_sheet"]
        cash_item = next(item for item in balance_sheet if item["account"] == "Cash & Equivalents")
        assert cash_item["value"] == 125000

    @pytest.mark.integration
    def test_multi_sheet_extraction(self):
        """Test extraction across multiple related sheets"""
        extractor = FinancialExtractor()
        
        multi_sheet_data = {
            "sheets": [
                {
                    "name": "Income Statement",
                    "data": [["Revenue", 100000], ["Expenses", 75000]]
                },
                {
                    "name": "Balance Sheet",
                    "data": [["Assets", 500000], ["Liabilities", 300000]]
                },
                {
                    "name": "Cash Flow Statement", 
                    "data": [["Operating CF", 25000], ["Investing CF", -15000]]
                }
            ]
        }
        
        result = extractor.extract_statements(multi_sheet_data)
        
        # All statement types should have data
        assert len(result["income_statement"]) > 0
        assert len(result["balance_sheet"]) > 0  
        assert len(result["cash_flow"]) > 0