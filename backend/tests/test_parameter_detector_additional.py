import pytest
from app.services.parameter_detector import ParameterDetector


def test_extract_numeric_value_various():
    det = ParameterDetector()
    assert det._extract_numeric_value("1,234") == 1234
    assert det._extract_numeric_value("$5.50") == 5.5
    assert det._extract_numeric_value("bad") is None


def test_parse_formula_dependencies_basic():
    det = ParameterDetector()
    formula = "=A1+B1"
    deps = det._parse_formula_dependencies(formula, "Sheet1")
    assert "Sheet1!A1" in deps and "Sheet1!B1" in deps


def test_detect_seasonality_quarterly():
    det = ParameterDetector()
    data = [1, 2, 3, 4, 1, 2, 3, 4]
    result = det.detect_seasonality(data)
    assert result["has_seasonality"]
    assert 4 in result["seasonal_periods"]


def test_validate_assumptions_invalid_value():
    det = ParameterDetector()
    assumptions = {"growth_assumptions": [{"name": "rate", "value": "bad"}]}
    result = det.validate_assumptions(assumptions)
    assert not result["is_valid"]
    assert result["errors"]
