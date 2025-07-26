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


def test_export_raw_data_csv(tmp_path):
    exporter = ExcelExporter(output_dir=tmp_path)
    data = [
        {"name": "A", "value": 1},
        {"name": "B", "value": 2},
    ]
    path = exporter.export_raw_data_csv(data, filename="out.csv", include_metadata=False)
    assert os.path.exists(path)
    with open(path) as f:
        lines = [line.strip() for line in f.readlines()]
    assert lines[0] == "name,value"
    assert lines[1] == "A,1"
    assert lines[2] == "B,2"


def test_pdf_format_currency_and_export_chart(tmp_path):
    generator = PDFReportGenerator(output_dir=tmp_path)
    assert generator._format_currency(500) == "$500.00"
    assert generator._format_currency(1500) == "$1.5K"
    assert generator._format_currency(2_000_000) == "$2.0M"
    chart_data = {
        "data": [
            {"period": "Q1", "value": 1},
            {"period": "Q2", "value": 2},
        ]
    }
    img_path = generator.export_chart_as_image(chart_data, chart_type="line", filename="chart.png")
    assert os.path.exists(img_path)
