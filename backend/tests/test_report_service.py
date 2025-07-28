from unittest.mock import MagicMock, patch
from app.services.report_service import ReportService
from app.models.report import ReportType


def test_create_template_commits():
    db = MagicMock()
    with patch('app.services.report_service.PDFReportGenerator'), \
         patch('app.services.report_service.ExcelExporter'), \
         patch('app.services.report_service.DashboardMetricsService'), \
         patch('app.services.report_service.ReportTemplate') as mock_model:
        service = ReportService(db)
        instance = mock_model.return_value
        data = {'name': 'T1', 'report_type': ReportType.FINANCIAL_SUMMARY}
        result = service.create_template(user_id=1, template_data=data)
        db.add.assert_called_once_with(instance)
        db.commit.assert_called()
        db.refresh.assert_called_once_with(instance)
        assert result is instance


def test_get_template_returns_first():
    db = MagicMock()
    query = db.query.return_value
    filter_q = query.filter.return_value
    filter_q.first.return_value = 'x'
    with patch('app.services.report_service.PDFReportGenerator'), \
         patch('app.services.report_service.ExcelExporter'), \
         patch('app.services.report_service.DashboardMetricsService'):
        service = ReportService(db)
        result = service.get_template(1, user_id=2)
    assert result == 'x'
    db.query.assert_called_once()
