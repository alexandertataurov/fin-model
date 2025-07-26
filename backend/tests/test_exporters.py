import os
from app.services.excel_exporter import ExcelExporter
from app.services.pdf_generator import PDFReportGenerator


def test_excel_exporter_creates_file(tmp_path):
    exporter = ExcelExporter(output_dir=tmp_path)
    data = {"summary": {"metrics": {"revenue": 1000}}, "pl": {"metrics": {"profit": 200}}}
    path = exporter.export_financial_data(data)
    assert os.path.exists(path)


def test_pdf_generator_creates_file(tmp_path):
    generator = PDFReportGenerator(output_dir=tmp_path)
    data = {"metrics": {"revenue": 1000}, "charts": {"revenue_trend": [{"period": "Q1", "value": 100}, {"period": "Q2", "value": 150}]}}
    path = generator.generate_financial_report(data)
    assert os.path.exists(path)
