import pytest
import math
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime

from app.services.formula_engine import (
    FormulaEngine,
    ExcelFunction,
    CalculationResult,
    DependencyGraph,
    safe_eval,
)


class TestExcelFunction:
    """Test Excel function implementations"""

    def test_sum_function(self):
        """Test SUM function with various inputs"""
        assert ExcelFunction.SUM(1, 2, 3) == 6
        assert ExcelFunction.SUM([1, 2], [3, 4]) == 10
        assert ExcelFunction.SUM(1.5, 2.5, 3.0) == 7.0
        assert ExcelFunction.SUM() == 0

    def test_average_function(self):
        """Test AVERAGE function"""
        assert ExcelFunction.AVERAGE(1, 2, 3) == 2.0
        assert ExcelFunction.AVERAGE([2, 4], [6, 8]) == 5.0
        assert ExcelFunction.AVERAGE(10, 20, 30) == 20.0
        assert ExcelFunction.AVERAGE() == 0

    def test_max_function(self):
        """Test MAX function"""
        assert ExcelFunction.MAX(1, 5, 3) == 5
        assert ExcelFunction.MAX([1, 2], [8, 4]) == 8
        assert ExcelFunction.MAX(-1, -5, -2) == -1
        assert ExcelFunction.MAX() == 0

    def test_min_function(self):
        """Test MIN function"""
        assert ExcelFunction.MIN(1, 5, 3) == 1
        assert ExcelFunction.MIN([1, 2], [8, 4]) == 1
        assert ExcelFunction.MIN(-1, -5, -2) == -5
        assert ExcelFunction.MIN() == 0

    def test_count_function(self):
        """Test COUNT function"""
        assert ExcelFunction.COUNT(1, 2, 3) == 3
        assert ExcelFunction.COUNT([1, 2], [3, 4, 5]) == 5
        assert ExcelFunction.COUNT(1.5, 2.5) == 2
        assert ExcelFunction.COUNT() == 0

    def test_if_function(self):
        """Test IF function"""
        assert ExcelFunction.IF(True, "yes", "no") == "yes"
        assert ExcelFunction.IF(False, "yes", "no") == "no"
        assert ExcelFunction.IF(5 > 3, 100, 200) == 100
        assert ExcelFunction.IF(False, 100) == 0  # default false value

    def test_round_function(self):
        """Test ROUND function"""
        assert ExcelFunction.ROUND(3.14159, 2) == 3.14
        assert ExcelFunction.ROUND(123.456, 0) == 123
        assert ExcelFunction.ROUND(123.456, -1) == 120
        assert ExcelFunction.ROUND(5.5) == 6  # default 0 digits

    def test_abs_function(self):
        """Test ABS function"""
        assert ExcelFunction.ABS(-5) == 5
        assert ExcelFunction.ABS(5) == 5
        assert ExcelFunction.ABS(-3.14) == 3.14
        assert ExcelFunction.ABS(0) == 0

    def test_sqrt_function(self):
        """Test SQRT function"""
        assert ExcelFunction.SQRT(9) == 3.0
        assert ExcelFunction.SQRT(16) == 4.0
        assert ExcelFunction.SQRT(2) == pytest.approx(1.414, rel=1e-3)

    def test_power_function(self):
        """Test POWER function"""
        assert ExcelFunction.POWER(2, 3) == 8.0
        assert ExcelFunction.POWER(5, 2) == 25.0
        assert ExcelFunction.POWER(10, 0) == 1.0

    def test_exp_function(self):
        """Test EXP function"""
        assert ExcelFunction.EXP(0) == 1.0
        assert ExcelFunction.EXP(1) == pytest.approx(2.718, rel=1e-3)
        assert ExcelFunction.EXP(2) == pytest.approx(7.389, rel=1e-3)

    def test_ln_function(self):
        """Test LN function"""
        assert ExcelFunction.LN(1) == 0.0
        assert ExcelFunction.LN(math.e) == pytest.approx(1.0, rel=1e-10)
        assert ExcelFunction.LN(10) == pytest.approx(2.303, rel=1e-3)

    def test_log_function(self):
        """Test LOG function"""
        assert ExcelFunction.LOG(100, 10) == 2.0
        assert ExcelFunction.LOG(8, 2) == 3.0
        assert ExcelFunction.LOG(1000) == 3.0  # default base 10

    def test_npv_function(self):
        """Test NPV function"""
        # NPV calculation: -1000 + 300/(1+0.1) + 400/(1+0.1)^2 + 500/(1+0.1)^3
        cash_flows = [-1000, 300, 400, 500]
        npv = ExcelFunction.NPV(0.1, *cash_flows)
        expected = -1000 + 300 / 1.1 + 400 / (1.1**2) + 500 / (1.1**3)
        assert npv == pytest.approx(expected, rel=1e-10)


class TestCalculationResult:
    """Test CalculationResult dataclass"""

    def test_calculation_result_creation(self):
        """Test CalculationResult creation"""
        result = CalculationResult(
            value=42,
            error=None,
            data_type="number",
            calculation_time=0.001,
            dependencies_used=["A1", "B1"],
        )

        assert result.value == 42
        assert result.error is None
        assert result.data_type == "number"
        assert result.calculation_time == 0.001
        assert len(result.dependencies_used) == 2

    def test_calculation_result_with_error(self):
        """Test CalculationResult with error"""
        result = CalculationResult(
            value=None,
            error="Division by zero",
            data_type="error",
            calculation_time=0.0,
            dependencies_used=[],
        )

        assert result.value is None
        assert result.error == "Division by zero"
        assert result.data_type == "error"


class TestDependencyGraph:
    """Test DependencyGraph dataclass"""

    def test_dependency_graph_creation(self):
        """Test DependencyGraph creation"""
        graph = DependencyGraph(
            nodes={"C1": {"A1", "B1"}, "D1": {"C1"}},
            reverse_nodes={"A1": {"C1"}, "B1": {"C1"}, "C1": {"D1"}},
            calculation_order=["A1", "B1", "C1", "D1"],
            circular_references=[],
        )

        assert "C1" in graph.nodes
        assert "A1" in graph.nodes["C1"]
        assert len(graph.calculation_order) == 4
        assert len(graph.circular_references) == 0

    def test_dependency_graph_with_circular_reference(self):
        """Test DependencyGraph with circular references"""
        graph = DependencyGraph(
            nodes={"A1": {"B1"}, "B1": {"A1"}},
            reverse_nodes={"A1": {"B1"}, "B1": {"A1"}},
            calculation_order=[],
            circular_references=[["A1", "B1"]],
        )

        assert len(graph.circular_references) == 1
        assert "A1" in graph.circular_references[0]
        assert "B1" in graph.circular_references[0]


class TestFormulaEngine:
    """Test FormulaEngine main functionality"""

    @pytest.fixture
    def engine(self):
        return FormulaEngine()

    def test_formula_engine_initialization(self, engine):
        """Test FormulaEngine initialization"""
        assert hasattr(engine, "cell_values")
        assert hasattr(engine, "formulas")
        assert hasattr(engine, "dependency_graph")

    def test_safe_eval_simple_expression(self, engine):
        """Test safe evaluation of simple expressions"""
        result = engine._safe_eval("2 + 3")
        assert result == 5

        result = engine._safe_eval("10 - 4")
        assert result == 6

        result = engine._safe_eval("3 * 4")
        assert result == 12

    def test_safe_eval_with_context(self, engine):
        """Test safe evaluation with context"""
        engine.cell_values = {"A1": 10, "B1": 20}
        result = engine._safe_eval("A1 + B1")
        assert result == 30

    def test_safe_eval_division_by_zero(self, engine):
        """Test safe evaluation handles division by zero"""
        with pytest.raises(ZeroDivisionError):
            engine._safe_eval("10 / 0")

    def test_safe_eval_invalid_expression(self, engine):
        """Test safe evaluation with invalid expression"""
        with pytest.raises(Exception):
            engine._safe_eval("invalid_expression()")

    def test_module_level_safe_eval(self):
        """Test module-level safe_eval function"""
        result = safe_eval("5 + 3")
        assert result == 8

        context = {"x": 10, "y": 5}
        result = safe_eval("x * y", context)
        assert result == 50

    @patch.object(FormulaEngine, "_safe_eval")
    def test_evaluate_formula(self, mock_safe_eval, engine):
        """Test formula evaluation"""
        mock_safe_eval.return_value = 42

        result = engine.evaluate_formula("=A1+B1")

        assert result == 42
        mock_safe_eval.assert_called_once()

    def test_cell_value_storage(self, engine):
        """Test cell value storage and retrieval"""
        engine.set_cell_value("A1", 100)
        engine.set_cell_value("B1", 200)

        assert engine.get_cell_value("A1") == 100
        assert engine.get_cell_value("B1") == 200
        assert engine.get_cell_value("C1") is None  # Non-existent cell

    def test_formula_storage(self, engine):
        """Test formula storage and retrieval"""
        engine.set_formula("C1", "=A1+B1")

        assert engine.get_formula("C1") == "=A1+B1"
        assert engine.get_formula("D1") is None  # Non-existent formula


class TestFormulaEngineIntegration:
    """Integration tests for FormulaEngine"""

    @pytest.fixture
    def populated_engine(self):
        """Create engine with sample data"""
        engine = FormulaEngine()
        engine.set_cell_value("A1", 100)
        engine.set_cell_value("A2", 200)
        engine.set_cell_value("A3", 300)
        engine.set_cell_value("B1", 10)
        engine.set_cell_value("B2", 20)
        engine.set_cell_value("B3", 30)
        return engine

    @pytest.mark.integration
    def test_complex_formula_evaluation(self, populated_engine):
        """Test evaluation of complex formulas"""
        # Test SUM function
        populated_engine.set_formula("C1", "=SUM(A1:A3)")
        result = populated_engine.evaluate_formula("=SUM(A1,A2,A3)")
        assert result == 600  # 100 + 200 + 300

    @pytest.mark.integration
    def test_nested_function_calls(self, populated_engine):
        """Test nested Excel functions"""
        # Test nested functions like ROUND(AVERAGE(...))
        result = populated_engine.evaluate_formula("=ROUND(AVERAGE(100,200,300), 0)")
        assert result == 200

    @pytest.mark.integration
    def test_conditional_formulas(self, populated_engine):
        """Test IF conditions in formulas"""
        result = populated_engine.evaluate_formula("=IF(100>50, 'High', 'Low')")
        assert result == "High"

        result = populated_engine.evaluate_formula("=IF(10>50, 'High', 'Low')")
        assert result == "Low"

    @pytest.mark.integration
    def test_mathematical_formulas(self, populated_engine):
        """Test mathematical Excel functions"""
        result = populated_engine.evaluate_formula("=SQRT(16)")
        assert result == 4.0

        result = populated_engine.evaluate_formula("=POWER(2,3)")
        assert result == 8.0

        result = populated_engine.evaluate_formula("=ABS(-25)")
        assert result == 25

    @pytest.mark.integration
    def test_formula_dependencies(self, populated_engine):
        """Test formula dependency tracking"""
        populated_engine.set_formula("C1", "=A1+B1")
        populated_engine.set_formula("C2", "=C1*2")

        # C2 should depend on C1, which depends on A1 and B1
        dependencies = populated_engine.get_dependencies("C2")
        assert "C1" in dependencies or len(dependencies) > 0

    @pytest.mark.integration
    def test_circular_reference_detection(self, populated_engine):
        """Test circular reference detection"""
        populated_engine.set_formula("D1", "=D2+1")
        populated_engine.set_formula("D2", "=D1+1")

        populated_engine.build_dependency_graph()

        # Should detect circular reference
        with pytest.raises(Exception):
            populated_engine.detect_circular_references()

    @pytest.mark.integration
    def test_batch_calculation(self, populated_engine):
        """Test batch calculation of multiple formulas"""
        formulas = {
            "C1": "=A1+B1",
            "C2": "=A2+B2",
            "C3": "=A3+B3",
            "D1": "=SUM(C1,C2,C3)",
        }

        results = populated_engine.evaluate_batch(formulas)

        assert results["C1"] == 110  # 100 + 10
        assert results["C2"] == 220  # 200 + 20
        assert results["C3"] == 330  # 300 + 30
        assert results["D1"] == 660  # 110 + 220 + 330

    @pytest.mark.integration
    def test_error_handling_in_formulas(self, populated_engine):
        """Test error handling in formula evaluation"""
        # Division by zero
        with pytest.raises(Exception):
            populated_engine.evaluate_formula("=10/0")

        # Invalid function
        with pytest.raises(Exception):
            populated_engine.evaluate_formula("=INVALID_FUNCTION()")

        # Missing cell reference
        with pytest.raises(Exception):
            populated_engine.evaluate_formula("=MISSING_CELL + 10")

    @pytest.mark.integration
    def test_financial_calculations(self, populated_engine):
        """Test financial calculation scenarios"""
        # NPV calculation
        cash_flows = [-1000, 300, 400, 500]
        npv_result = populated_engine.evaluate_formula(
            f"=NPV(0.1, {','.join(map(str, cash_flows))})"
        )

        # Should calculate proper NPV
        expected_npv = sum(cf / (1.1**i) for i, cf in enumerate(cash_flows))
        assert npv_result == pytest.approx(expected_npv, rel=1e-10)

    @pytest.mark.integration
    def test_performance_with_large_dataset(self, populated_engine):
        """Test performance with large number of calculations"""
        import time

        # Add many cells
        for i in range(1, 101):  # 100 cells
            populated_engine.set_cell_value(f"E{i}", i)

        start_time = time.time()
        result = populated_engine.evaluate_formula("=SUM(E1:E100)")
        end_time = time.time()

        # Should complete within reasonable time
        assert end_time - start_time < 1.0  # Less than 1 second
        assert result == sum(range(1, 101))  # 5050
