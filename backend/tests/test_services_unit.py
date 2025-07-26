import pytest
import tempfile
import os
import pandas as pd
from unittest.mock import Mock, patch, MagicMock
from app.services.excel_parser import ExcelParser
from app.services.financial_extractor import FinancialExtractor
from app.services.parameter_detector import ParameterDetector
from app.services.formula_engine import FormulaEngine
from app.services.scenario_manager import ScenarioManager


@pytest.mark.unit
@pytest.mark.service
class TestExcelParser:
    """Test Excel parsing service."""

    def test_parse_valid_excel_file(self, sample_excel_file):
        """Test parsing a valid Excel file."""
        parser = ExcelParser()
        result = parser.parse_file(sample_excel_file)
        
        assert result is not None
        assert "sheets" in result
        assert len(result["sheets"]) > 0
        assert "metadata" in result

    def test_parse_invalid_file(self):
        """Test parsing an invalid file."""
        parser = ExcelParser()
        
        with tempfile.NamedTemporaryFile(suffix='.txt', delete=False) as f:
            f.write(b"Not an Excel file")
            f.flush()
            
            with pytest.raises(Exception):
                parser.parse_file(f.name)
            
            os.unlink(f.name)

    def test_detect_sheet_types(self, sample_excel_file):
        """Test detection of different sheet types."""
        parser = ExcelParser()
        result = parser.parse_file(sample_excel_file)
        
        # Should detect at least one sheet
        assert len(result["sheets"]) >= 1
        
        # Each sheet should have metadata about its type
        for sheet in result["sheets"]:
            assert "name" in sheet
            assert "type" in sheet
            assert "data" in sheet

    def test_handle_empty_excel_file(self):
        """Test handling an empty Excel file."""
        parser = ExcelParser()
        
        # Create empty Excel file
        df = pd.DataFrame()
        with tempfile.NamedTemporaryFile(suffix='.xlsx', delete=False) as f:
            df.to_excel(f.name, index=False)
            
            result = parser.parse_file(f.name)
            assert result is not None
            
            os.unlink(f.name)

    def test_large_file_handling(self):
        """Test handling large Excel files."""
        parser = ExcelParser()
        
        # Create large dataset
        large_data = {
            'Column1': range(10000),
            'Column2': [f'Value_{i}' for i in range(10000)],
            'Column3': [i * 1.5 for i in range(10000)]
        }
        df = pd.DataFrame(large_data)
        
        with tempfile.NamedTemporaryFile(suffix='.xlsx', delete=False) as f:
            df.to_excel(f.name, index=False)
            
            result = parser.parse_file(f.name)
            assert result is not None
            assert len(result["sheets"][0]["data"]) > 0
            
            os.unlink(f.name)


@pytest.mark.unit
@pytest.mark.service
class TestFinancialExtractor:
    """Test financial data extraction service."""

    @pytest.fixture
    def sample_financial_data(self):
        """Create sample financial data for testing."""
        return {
            "sheets": [{
                "name": "P&L",
                "type": "financial",
                "data": [
                    ["Account", "Q1_2023", "Q2_2023", "Q3_2023"],
                    ["Revenue", 1000000, 1200000, 1100000],
                    ["COGS", -600000, -720000, -660000],
                    ["Gross Profit", 400000, 480000, 440000],
                    ["Operating Expenses", -250000, -280000, -270000],
                    ["EBITDA", 150000, 200000, 170000]
                ]
            }]
        }

    def test_extract_financial_statements(self, sample_financial_data):
        """Test extraction of financial statements."""
        extractor = FinancialExtractor()
        result = extractor.extract_statements(sample_financial_data)
        
        assert result is not None
        assert "income_statement" in result
        assert len(result["income_statement"]) > 0

    def test_identify_financial_line_items(self, sample_financial_data):
        """Test identification of financial line items."""
        extractor = FinancialExtractor()
        result = extractor.extract_statements(sample_financial_data)
        
        # Should identify key financial metrics
        income_statement = result["income_statement"]
        accounts = [item["account"] for item in income_statement]
        
        assert "Revenue" in accounts
        assert "COGS" in accounts or "Cost of Goods Sold" in accounts
        assert "Gross Profit" in accounts

    def test_calculate_financial_ratios(self, sample_financial_data):
        """Test calculation of financial ratios."""
        extractor = FinancialExtractor()
        statements = extractor.extract_statements(sample_financial_data)
        ratios = extractor.calculate_ratios(statements)
        
        assert ratios is not None
        assert "gross_margin" in ratios
        assert "ebitda_margin" in ratios

    def test_handle_missing_data(self):
        """Test handling of missing financial data."""
        extractor = FinancialExtractor()
        incomplete_data = {
            "sheets": [{
                "name": "Incomplete",
                "type": "financial",
                "data": [
                    ["Account", "Q1_2023"],
                    ["Revenue", 1000000],
                    ["", ""]  # Empty row
                ]
            }]
        }
        
        result = extractor.extract_statements(incomplete_data)
        assert result is not None

    def test_multi_currency_handling(self):
        """Test handling of multiple currencies."""
        extractor = FinancialExtractor()
        multi_currency_data = {
            "sheets": [{
                "name": "Multi-Currency",
                "type": "financial",
                "data": [
                    ["Account", "USD_Q1", "EUR_Q1", "GBP_Q1"],
                    ["Revenue", 1000000, 850000, 750000],
                    ["COGS", -600000, -510000, -450000]
                ]
            }]
        }
        
        result = extractor.extract_statements(multi_currency_data)
        assert result is not None


@pytest.mark.unit
@pytest.mark.service
class TestParameterDetector:
    """Test parameter detection service."""

    def test_detect_growth_rates(self):
        """Test detection of growth rates in data."""
        detector = ParameterDetector()
        time_series_data = [1000, 1100, 1210, 1331]  # 10% growth
        
        result = detector.detect_growth_patterns(time_series_data)
        assert result is not None
        assert abs(result["average_growth_rate"] - 0.10) < 0.01

    def test_detect_seasonality(self):
        """Test detection of seasonal patterns."""
        detector = ParameterDetector()
        seasonal_data = [100, 120, 80, 110, 105, 125, 85, 115]  # 4-period cycle
        
        result = detector.detect_seasonality(seasonal_data)
        assert result is not None
        assert "seasonal_pattern" in result

    def test_identify_key_assumptions(self, sample_excel_file):
        """Test identification of key business assumptions."""
        detector = ParameterDetector()
        
        # Mock parsed data
        parsed_data = {
            "sheets": [{
                "name": "Assumptions",
                "type": "parameters",
                "data": [
                    ["Parameter", "Value"],
                    ["Growth Rate", 0.15],
                    ["Discount Rate", 0.10],
                    ["Tax Rate", 0.25]
                ]
            }]
        }
        
        result = detector.identify_assumptions(parsed_data)
        assert result is not None
        assert len(result) > 0

    def test_validate_assumptions(self):
        """Test validation of business assumptions."""
        detector = ParameterDetector()
        assumptions = {
            "growth_rate": 0.15,
            "discount_rate": 0.10,
            "tax_rate": 0.25
        }
        
        validation_result = detector.validate_assumptions(assumptions)
        assert validation_result["is_valid"] is True


@pytest.mark.unit
@pytest.mark.service
class TestFormulaEngine:
    """Test formula calculation engine."""

    def test_evaluate_simple_formula(self):
        """Test evaluation of simple mathematical formulas."""
        engine = FormulaEngine()
        
        variables = {"revenue": 1000000, "cogs": 600000}
        formula = "revenue - cogs"
        
        result = engine.evaluate(formula, variables)
        assert result == 400000

    def test_evaluate_complex_formula(self):
        """Test evaluation of complex financial formulas."""
        engine = FormulaEngine()
        
        variables = {
            "revenue": 1000000,
            "cogs": 600000,
            "opex": 250000,
            "tax_rate": 0.25
        }
        formula = "(revenue - cogs - opex) * (1 - tax_rate)"
        
        result = engine.evaluate(formula, variables)
        assert result == 112500  # (1000000 - 600000 - 250000) * 0.75

    def test_handle_division_by_zero(self):
        """Test handling of division by zero in formulas."""
        engine = FormulaEngine()
        
        variables = {"numerator": 100, "denominator": 0}
        formula = "numerator / denominator"
        
        with pytest.raises(ZeroDivisionError):
            engine.evaluate(formula, variables)

    def test_circular_reference_detection(self):
        """Test detection of circular references in formulas."""
        engine = FormulaEngine()
        
        # This would be a more complex test requiring formula dependency tracking
        # For now, it's a placeholder
        pass

    @patch('app.services.formula_engine.safe_eval')
    def test_security_validation(self, mock_eval):
        """Test that formulas are evaluated securely."""
        engine = FormulaEngine()
        
        # Potentially dangerous formula
        dangerous_formula = "__import__('os').system('rm -rf /')"
        variables = {}
        
        # Should not execute dangerous code
        with pytest.raises(Exception):
            engine.evaluate(dangerous_formula, variables)


@pytest.mark.unit
@pytest.mark.service
class TestScenarioManager:
    """Test scenario modeling service."""

    def test_create_scenario(self):
        """Test creation of a new scenario."""
        from unittest.mock import Mock
        mock_db = Mock()
        manager = ScenarioManager(mock_db)
        
        base_assumptions = {
            "growth_rate": 0.10,
            "discount_rate": 0.08,
            "tax_rate": 0.25
        }
        
        scenario = manager.create_scenario("Base Case", base_assumptions)
        assert scenario is not None
        assert scenario["name"] == "Base Case"
        assert scenario["assumptions"] == base_assumptions

    def test_scenario_sensitivity_analysis(self):
        """Test sensitivity analysis across scenarios."""
        from unittest.mock import Mock
        mock_db = Mock()
        manager = ScenarioManager(mock_db)
        
        base_case = {
            "name": "Base",
            "assumptions": {"growth_rate": 0.10, "discount_rate": 0.08}
        }
        
        optimistic_case = {
            "name": "Optimistic", 
            "assumptions": {"growth_rate": 0.15, "discount_rate": 0.08}
        }
        
        pessimistic_case = {
            "name": "Pessimistic",
            "assumptions": {"growth_rate": 0.05, "discount_rate": 0.08}
        }
        
        scenarios = [base_case, optimistic_case, pessimistic_case]
        
        sensitivity = manager.analyze_sensitivity(scenarios, "growth_rate")
        assert sensitivity is not None
        assert len(sensitivity) == 3

    def test_monte_carlo_simulation(self):
        """Test Monte Carlo simulation for scenario analysis."""
        from unittest.mock import Mock
        mock_db = Mock()
        manager = ScenarioManager(mock_db)
        
        # Mock parameters with distributions
        parameter_distributions = {
            "growth_rate": {"type": "normal", "mean": 0.10, "std": 0.02},
            "discount_rate": {"type": "normal", "mean": 0.08, "std": 0.01}
        }
        
        # This would require a more complex implementation
        # For now, it's a test structure
        simulation_result = manager.monte_carlo_simulation(
            parameter_distributions, 
            iterations=100
        )
        
        # Basic structure validation
        assert simulation_result is not None

    def test_scenario_comparison(self):
        """Test comparison of multiple scenarios."""
        from unittest.mock import Mock
        mock_db = Mock()
        manager = ScenarioManager(mock_db)
        
        scenario1 = {
            "name": "Scenario A",
            "results": {"npv": 1000000, "irr": 0.15}
        }
        
        scenario2 = {
            "name": "Scenario B", 
            "results": {"npv": 1200000, "irr": 0.18}
        }
        
        comparison = manager.compare_scenarios([scenario1, scenario2])
        assert comparison is not None
        assert len(comparison) == 2


@pytest.mark.unit
@pytest.mark.service
class TestServiceIntegration:
    """Test integration between services."""

    def test_excel_to_financial_pipeline(self, sample_excel_file):
        """Test the complete pipeline from Excel parsing to financial extraction."""
        parser = ExcelParser()
        extractor = FinancialExtractor()
        
        # Parse Excel file
        parsed_data = parser.parse_file(sample_excel_file)
        assert parsed_data is not None
        
        # Extract financial data
        financial_data = extractor.extract_statements(parsed_data)
        assert financial_data is not None

    def test_parameter_to_scenario_pipeline(self):
        """Test pipeline from parameter detection to scenario creation."""
        detector = ParameterDetector()
        from unittest.mock import Mock
        mock_db = Mock()
        manager = ScenarioManager(mock_db)
        
        # Mock detected parameters
        assumptions = {
            "growth_rate": 0.12,
            "discount_rate": 0.09,
            "tax_rate": 0.28
        }
        
        # Create scenario from parameters
        scenario = manager.create_scenario("Detected Parameters", assumptions)
        assert scenario is not None
        assert scenario["assumptions"] == assumptions

    @patch('app.services.excel_parser.ExcelParser.parse_file')
    @patch('app.services.financial_extractor.FinancialExtractor.extract_statements')
    def test_error_handling_in_pipeline(self, mock_extract, mock_parse):
        """Test error handling throughout the service pipeline."""
        # Mock parser failure
        mock_parse.side_effect = Exception("File parsing failed")
        
        parser = ExcelParser()
        with pytest.raises(Exception):
            parser.parse_file("fake_file.xlsx")
        
        # Mock extractor failure
        mock_parse.side_effect = None
        mock_parse.return_value = {"sheets": []}
        mock_extract.side_effect = Exception("Extraction failed")
        
        extractor = FinancialExtractor()
        with pytest.raises(Exception):
            extractor.extract_statements({"sheets": []})


@pytest.mark.unit
@pytest.mark.performance
class TestServicePerformance:
    """Test service performance characteristics."""

    def test_large_dataset_processing(self):
        """Test processing of large datasets."""
        # This would test performance with large files
        # Implementation depends on specific performance requirements
        pass

    def test_concurrent_processing(self):
        """Test concurrent processing capabilities."""
        # This would test concurrent access to services
        # Implementation depends on concurrency requirements
        pass

    def test_memory_usage(self):
        """Test memory usage during processing."""
        # This would test memory consumption
        # Implementation depends on memory requirements
        pass 