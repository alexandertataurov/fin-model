import pytest
from app.services.excel_parser import ExcelParser, ParsedData, SheetInfo, DataType, SheetType, ValidationSummary

def test_validate_data_no_sheets():
    parser = ExcelParser()
    data = ParsedData(file_name='f.xlsx', file_path='f.xlsx', file_size=10)
    summary = parser._validate_data(data)
    assert not summary.is_valid
    assert summary.total_errors == 1
    assert summary.errors[0].message.startswith("No worksheets")


def test_export_to_dict_minimal():
    parser = ExcelParser()
    sheet = SheetInfo(name='S1', sheet_type=SheetType.PROFIT_LOSS, max_row=0, max_column=0)
    data = ParsedData(file_name='f.xlsx', file_path='f.xlsx', file_size=10, sheets=[sheet])
    summary = ValidationSummary(is_valid=True)
    data.validation_summary = summary
    result = parser.export_to_dict(data)
    assert result['file_info']['name'] == 'f.xlsx'
    assert result['sheets'][0]['name'] == 'S1'
    assert result['validation']['is_valid']
