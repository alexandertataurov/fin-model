from unittest.mock import patch
from app.services.partial_processor import PartialProcessor, FileValidationResult


def test_process_with_issues_fails_gracefully():
    pp = PartialProcessor()
    with patch('app.services.partial_processor.load_workbook', side_effect=Exception('bad')):
        result = pp.process_with_issues('bad.xlsx', FileValidationResult(is_valid=False, errors=['e']))
        assert not result.success
        assert result.recommendations
