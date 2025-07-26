from app.services.advanced_validator import AdvancedValidator, TemplateType


def test_get_template_requirements_has_keys():
    validator = AdvancedValidator()
    reqs = validator.get_template_requirements(TemplateType.PROFIT_LOSS)
    assert reqs["template_type"] == TemplateType.PROFIT_LOSS.value
    assert "required_columns" in reqs
    assert "required_sections" in reqs


def test_calculate_column_match_confidence_exact():
    validator = AdvancedValidator()
    assert validator._calculate_column_match_confidence("revenue", "revenue") == 1.0


def test_infer_column_data_type_variants():
    validator = AdvancedValidator()
    assert validator._infer_column_data_type([1, 2, 3]) == "numeric"
    assert validator._infer_column_data_type(["a", "b"]) == "text"
    assert validator._infer_column_data_type([1, "b"]) == "mixed"
