from app.services.parameter_detector import ParameterDetector


def test_detect_growth_patterns_handles_zero():
    det = ParameterDetector()
    data = [0, 0, 10]
    result = det.detect_growth_patterns(data)
    # Prev zero should skip division
    assert result["average_growth_rate"] == 0
    assert result["growth_rates"] == []


def test_detect_growth_patterns_bad_input():
    det = ParameterDetector()
    result = det.detect_growth_patterns(["a", "b"])
    assert "error" in result
