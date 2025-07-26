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

def test_suggest_template_improvements_missing_columns():
    from app.services.excel_parser import ParsedData, SheetInfo, CellInfo, DataType, SheetType

    validator = AdvancedValidator()

    sheet = SheetInfo(
        name="P&L",
        sheet_type=SheetType.PROFIT_LOSS,
        max_row=2,
        max_column=2,
        header_row=1,
        data_start_row=2,
        has_formulas=False,
        formula_count=0,
        cells=[
            CellInfo(address="A1", row=1, column=1, value="Account", data_type=DataType.TEXT),
            CellInfo(address="B1", row=1, column=2, value="Amount", data_type=DataType.TEXT),
            CellInfo(address="A2", row=2, column=1, value="Revenue", data_type=DataType.TEXT),
            CellInfo(address="B2", row=2, column=2, value=100, data_type=DataType.NUMBER),
        ],
    )
    parsed = ParsedData(file_name="f.xlsx", file_path="f.xlsx", file_size=1000, sheets=[sheet])
    suggestions = validator.suggest_template_improvements(parsed)
    assert any(s["type"] == "add_column" for s in suggestions["column_suggestions"])
    assert suggestions["formula_suggestions"]  # formula recommendation when count is low
