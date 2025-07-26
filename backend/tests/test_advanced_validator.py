import types
import app.services.advanced_validator as av

class DummySheet:
    def __init__(self):
        self.sheet_type = av.SheetType.PROFIT_LOSS

class DummyParsed:
    def __init__(self):
        self.sheets = []

class DummyParsedWithSheet(DummyParsed):
    def __init__(self):
        self.sheets = [types.SimpleNamespace(sheet_type=av.SheetType.PROFIT_LOSS, name="P&L", cells=[], header_row=1)]


def test_validate_template_no_sheets():
    validator = av.AdvancedValidator()
    res = validator.validate_template(DummyParsed())
    assert not res.is_valid
    assert res.validation_errors


