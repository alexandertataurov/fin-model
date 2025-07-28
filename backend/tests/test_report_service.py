from unittest.mock import MagicMock, patch
import pytest
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


def test_cleanup_expired_exports_calls_delete():
    db = MagicMock()
    expired = MagicMock(id=1, created_by=2)
    db.query.return_value.filter.return_value.all.return_value = [expired]
    with patch('app.services.report_service.PDFReportGenerator'), \
         patch('app.services.report_service.ExcelExporter'), \
         patch('app.services.report_service.DashboardMetricsService'):
        service = ReportService(db)
        with patch.object(service, 'delete_export', return_value=True) as deleter:
            count = service.cleanup_expired_exports()
            assert count == 1
            deleter.assert_called_once_with(expired.id, expired.created_by)


def test_export_chart_invalid_format():
    db = MagicMock()
    with patch('app.services.report_service.PDFReportGenerator') as pdf, \
         patch('app.services.report_service.ExcelExporter'), \
         patch('app.services.report_service.DashboardMetricsService'):
        pdf.return_value.export_chart_as_image.return_value = 'file'
        service = ReportService(db)
        with pytest.raises(ValueError):
            service.export_chart(1, {'type': 'line'}, export_format='BAD')
