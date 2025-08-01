from types import SimpleNamespace
from app.services.partial_processor import PartialProcessor


def test_auto_fix_text_to_number():
    pp = PartialProcessor()
    assert pp._auto_fix_text_to_number(" 1,234 ") == 1234.0
    assert pp._auto_fix_text_to_number("bad") is None


def test_auto_fix_missing_headers():
    pp = PartialProcessor()
    sheet = SimpleNamespace(max_column=3)
    headers = pp._auto_fix_missing_headers(sheet)
    assert headers == ["Column_1", "Column_2", "Column_3"]


def test_auto_fix_formula_errors():
    pp = PartialProcessor()
    fixed = pp._auto_fix_formula_errors("=A1/B1 #DIV/0!")
    assert "#DIV/0!" not in fixed
    assert fixed.endswith("0")


def test_auto_fix_date_format():
    pp = PartialProcessor()
    assert pp._auto_fix_date_format("2024-01-02").year == 2024
    assert pp._auto_fix_date_format("not a date") is None
