from unittest.mock import MagicMock
import pytest
from app.services.analytics_service import AnalyticsService


def test_get_processing_overview_basic():
    db = MagicMock()
    q = db.query.return_value
    q.filter.return_value.scalar.return_value = 1
    service = AnalyticsService(db)
    result = service.get_processing_overview(days=1)
    assert result["total_files"] == 1
    assert result["completed_files"] == 1
    assert result["failed_files"] == 1
    assert result["processing_files"] == 1


@pytest.mark.parametrize(
    "msg,expected",
    [
        ("File not found", "File Access Error"),
        ("excel format corrupt", "File Format Error"),
        ("exceeds size limit", "File Size Error"),
        ("validation failed", "Validation Error"),
        ("permission denied", "Permission Error"),
        ("timeout occurred", "Performance Error"),
        ("memory exceeded", "Resource Error"),
        ("random", "Other Error"),
    ],
)
def test_categorize_error(msg, expected):
    service = AnalyticsService(MagicMock())
    assert service._categorize_error(msg) == expected
