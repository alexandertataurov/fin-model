import os
import io
import base64
from typing import Dict, List, Any, Optional, Union, Tuple
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")  # Use non-interactive backend
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.backends.backend_pdf import PdfPages
import pandas as pd
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    Image,
    KeepTogether,
)
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
from reportlab.pdfgen import canvas
from PIL import Image as PILImage

from app.core.config import settings


class PDFReportGenerator:
    """Service for generating PDF reports with charts and financial data."""

    def __init__(self, output_dir: Optional[str] = None):
        self.output_dir = (
            Path(output_dir)
            if output_dir
            else Path(settings.UPLOAD_DIR) / "reports"
        )
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Setup styles
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

        # Chart configuration
        self.chart_config = {
            "figure_size": (10, 6),
            "dpi": 300,
            "font_size": 10,
            "title_font_size": 14,
            "colors": [
                "#1976d2",
                "#dc004e",
                "#2e7d32",
                "#ed6c02",
                "#9c27b0",
            ],
        }

    def _setup_custom_styles(self):
        """Setup custom paragraph styles for reports."""
        self.styles.add(
            ParagraphStyle(
                name="CustomTitle",
                parent=self.styles["Heading1"],
                fontSize=24,
                spaceAfter=30,
                alignment=TA_CENTER,
                textColor=colors.Color(0.2, 0.2, 0.2),
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="SectionHeader",
                parent=self.styles["Heading2"],
                fontSize=16,
                spaceBefore=20,
                spaceAfter=12,
                textColor=colors.Color(0.3, 0.3, 0.3),
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="MetricTitle",
                parent=self.styles["Normal"],
                fontSize=12,
                fontName="Helvetica-Bold",
                spaceBefore=10,
                spaceAfter=5,
                textColor=colors.Color(0.4, 0.4, 0.4),
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="MetricValue",
                parent=self.styles["Normal"],
                fontSize=18,
                fontName="Helvetica-Bold",
                alignment=TA_CENTER,
                textColor=colors.Color(0.1, 0.1, 0.1),
            )
        )

    def generate_financial_report(
        self,
        data: Dict[str, Any],
        template_config: Optional[Dict[str, Any]] = None,
        branding_config: Optional[Dict[str, Any]] = None,
        filename: Optional[str] = None,
    ) -> str:
        """
        Generate a comprehensive financial report PDF.

        Args:
            data: Financial data including metrics, charts, and time series
            template_config: Template configuration for layout and sections
            branding_config: Company branding (logo, colors, etc.)
            filename: Output filename (auto-generated if not provided)

        Returns:
            Path to generated PDF file
        """
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"financial_report_{timestamp}.pdf"

        output_path = self.output_dir / filename

        # Create PDF document
        doc = SimpleDocTemplate(
            str(output_path),
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )

        # Build story (content)
        story = []

        # Add header with branding
        story.extend(self._build_header(branding_config))

        # Add executive summary
        if "summary" in data:
            story.extend(self._build_executive_summary(data["summary"]))

        # Add key metrics section
        if "metrics" in data:
            story.extend(self._build_metrics_section(data["metrics"]))

        # Add charts section
        if "charts" in data:
            story.extend(self._build_charts_section(data["charts"]))

        # Add detailed tables
        if "tables" in data:
            story.extend(self._build_tables_section(data["tables"]))

        # Add footer
        story.extend(self._build_footer())

        # Build PDF
        doc.build(
            story,
            onFirstPage=self._add_page_number,
            onLaterPages=self._add_page_number,
        )

        return str(output_path)

    def _build_header(
        self, branding_config: Optional[Dict[str, Any]]
    ) -> List:
        """Build report header with company branding."""
        story = []

        # Company logo
        if branding_config and "logo_path" in branding_config:
            try:
                logo = Image(
                    branding_config["logo_path"],
                    width=2 * inch,
                    height=1 * inch,
                )
                story.append(logo)
                story.append(Spacer(1, 20))
            except:
                pass  # Skip logo if file not found

        # Report title
        title = "Financial Analysis Report"
        if branding_config and "company_name" in branding_config:
            title = f"{branding_config['company_name']} - {title}"

        story.append(Paragraph(title, self.styles["CustomTitle"]))
        story.append(Spacer(1, 20))

        # Report date
        report_date = datetime.now().strftime("%B %d, %Y")
        story.append(
            Paragraph(f"Generated on {report_date}", self.styles["Normal"])
        )
        story.append(Spacer(1, 30))

        return story

    def _build_executive_summary(
        self, summary_data: Dict[str, Any]
    ) -> List:
        """Build executive summary section."""
        story = []

        story.append(
            Paragraph("Executive Summary", self.styles["SectionHeader"])
        )

        # Summary text
        if "overview" in summary_data:
            story.append(
                Paragraph(summary_data["overview"], self.styles["Normal"])
            )
            story.append(Spacer(1, 15))

        # Key highlights
        if "highlights" in summary_data:
            story.append(
                Paragraph("Key Highlights:", self.styles["MetricTitle"])
            )
            for highlight in summary_data["highlights"]:
                story.append(
                    Paragraph(f"• {highlight}", self.styles["Normal"])
                )
            story.append(Spacer(1, 20))

        return story

    def _build_metrics_section(self, metrics_data: Dict[str, Any]) -> List:
        """Build key metrics section with KPI boxes."""
        story = []

        story.append(
            Paragraph(
                "Key Financial Metrics", self.styles["SectionHeader"]
            )
        )

        # Create metrics table (2 columns)
        metrics = []
        if isinstance(metrics_data, dict):
            for key, value in metrics_data.items():
                if isinstance(value, (int, float)):
                    formatted_value = (
                        self._format_currency(value)
                        if "revenue" in key.lower()
                        or "profit" in key.lower()
                        else f"{value:,.2f}"
                    )
                    metrics.append(
                        [key.replace("_", " ").title(), formatted_value]
                    )

        if metrics:
            # Create table with 2 columns, multiple rows
            table_data = []
            for i in range(0, len(metrics), 2):
                row = []
                for j in range(2):
                    if i + j < len(metrics):
                        metric = metrics[i + j]
                        row.extend([metric[0], metric[1]])
                    else:
                        row.extend(["", ""])
                table_data.append(row)

            table = Table(
                table_data,
                colWidths=[2 * inch, 1.5 * inch, 2 * inch, 1.5 * inch],
            )
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("FONTSIZE", (0, 0), (-1, 0), 12),
                        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                        ("GRID", (0, 0), (-1, -1), 1, colors.black),
                    ]
                )
            )

            story.append(table)
            story.append(Spacer(1, 20))

        return story

    def _build_charts_section(self, charts_data: Dict[str, Any]) -> List:
        """Build charts section with matplotlib-generated charts."""
        story = []

        story.append(
            Paragraph("Financial Charts", self.styles["SectionHeader"])
        )

        for chart_name, chart_data in charts_data.items():
            if not chart_data:
                continue

            story.append(
                Paragraph(
                    chart_name.replace("_", " ").title(),
                    self.styles["MetricTitle"],
                )
            )

            # Generate chart based on type
            chart_image = self._generate_chart(chart_name, chart_data)
            if chart_image:
                story.append(chart_image)
                story.append(Spacer(1, 15))

        return story

    def _generate_chart(
        self, chart_type: str, data: List[Dict[str, Any]]
    ) -> Optional[Image]:
        """Generate chart using matplotlib and return as ReportLab Image."""
        if not data:
            return None

        try:
            fig, ax = plt.subplots(
                figsize=self.chart_config["figure_size"]
            )

            # Convert data to pandas DataFrame for easier manipulation
            df = pd.DataFrame(data)

            if chart_type in [
                "revenue_trend",
                "profit_trend",
                "cash_flow_trend",
            ]:
                self._create_line_chart(ax, df, chart_type)
            elif chart_type in ["expense_breakdown", "profit_margins"]:
                self._create_bar_chart(ax, df, chart_type)
            elif chart_type in [
                "asset_distribution",
                "expense_categories",
            ]:
                self._create_pie_chart(ax, df, chart_type)
            else:
                # Default to line chart
                self._create_line_chart(ax, df, chart_type)

            # Save chart to bytes
            img_buffer = io.BytesIO()
            plt.savefig(
                img_buffer,
                format="png",
                dpi=self.chart_config["dpi"],
                bbox_inches="tight",
                facecolor="white",
            )
            img_buffer.seek(0)
            plt.close(fig)

            # Create ReportLab Image
            return Image(img_buffer, width=6 * inch, height=3.6 * inch)

        except Exception as e:
            print(f"Error generating chart {chart_type}: {e}")
            return None

    def _create_line_chart(self, ax, df: pd.DataFrame, chart_type: str):
        """Create line chart."""
        if "period" in df.columns and "value" in df.columns:
            ax.plot(
                df["period"],
                df["value"],
                marker="o",
                linewidth=2,
                color=self.chart_config["colors"][0],
            )
            ax.set_xlabel("Period")
            ax.set_ylabel("Value")
            ax.set_title(chart_type.replace("_", " ").title())
            ax.grid(True, alpha=0.3)
            plt.xticks(rotation=45)

    def _create_bar_chart(self, ax, df: pd.DataFrame, chart_type: str):
        """Create bar chart."""
        if "period" in df.columns and "value" in df.columns:
            bars = ax.bar(
                df["period"],
                df["value"],
                color=self.chart_config["colors"][: len(df)],
            )
            ax.set_xlabel("Category")
            ax.set_ylabel("Value")
            ax.set_title(chart_type.replace("_", " ").title())
            plt.xticks(rotation=45)

            # Add value labels on bars
            for bar in bars:
                height = bar.get_height()
                ax.text(
                    bar.get_x() + bar.get_width() / 2.0,
                    height,
                    f"{height:,.0f}",
                    ha="center",
                    va="bottom",
                )

    def _create_pie_chart(self, ax, df: pd.DataFrame, chart_type: str):
        """Create pie chart."""
        if "period" in df.columns and "value" in df.columns:
            colors = self.chart_config["colors"][: len(df)]
            wedges, texts, autotexts = ax.pie(
                df["value"],
                labels=df["period"],
                autopct="%1.1f%%",
                colors=colors,
                startangle=90,
            )
            ax.set_title(chart_type.replace("_", " ").title())

    def _build_tables_section(self, tables_data: Dict[str, Any]) -> List:
        """Build detailed tables section."""
        story = []

        story.append(
            Paragraph(
                "Detailed Financial Data", self.styles["SectionHeader"]
            )
        )

        for table_name, table_data in tables_data.items():
            if not table_data:
                continue

            story.append(
                Paragraph(
                    table_name.replace("_", " ").title(),
                    self.styles["MetricTitle"],
                )
            )

            # Convert to table format
            if isinstance(table_data, list) and table_data:
                # Extract headers
                headers = (
                    list(table_data[0].keys())
                    if isinstance(table_data[0], dict)
                    else []
                )

                if headers:
                    # Create table data
                    table_rows = [headers]
                    for row in table_data:
                        if isinstance(row, dict):
                            table_rows.append(
                                [str(row.get(h, "")) for h in headers]
                            )

                    # Create ReportLab table
                    table = Table(table_rows)
                    table.setStyle(
                        TableStyle(
                            [
                                (
                                    "BACKGROUND",
                                    (0, 0),
                                    (-1, 0),
                                    colors.grey,
                                ),
                                (
                                    "TEXTCOLOR",
                                    (0, 0),
                                    (-1, 0),
                                    colors.whitesmoke,
                                ),
                                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                                (
                                    "FONTNAME",
                                    (0, 0),
                                    (-1, 0),
                                    "Helvetica-Bold",
                                ),
                                ("FONTSIZE", (0, 0), (-1, 0), 10),
                                ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                                (
                                    "BACKGROUND",
                                    (0, 1),
                                    (-1, -1),
                                    colors.beige,
                                ),
                                (
                                    "GRID",
                                    (0, 0),
                                    (-1, -1),
                                    1,
                                    colors.black,
                                ),
                            ]
                        )
                    )

                    story.append(table)
                    story.append(Spacer(1, 15))

        return story

    def _build_footer(self) -> List:
        """Build report footer."""
        story = []

        story.append(PageBreak())
        story.append(Spacer(1, 50))
        story.append(
            Paragraph(
                "Report generated by FinVision", self.styles["Normal"]
            )
        )
        story.append(
            Paragraph(
                f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
                self.styles["Normal"],
            )
        )

        return story

    def _add_page_number(self, canvas, doc):
        """Add page numbers to each page."""
        page_num = canvas.getPageNumber()
        text = f"Page {page_num}"
        canvas.drawRightString(200 * inch, 0.75 * inch, text)

    def _format_currency(self, value: float, currency: str = "$") -> str:
        """Format value as currency."""
        if abs(value) >= 1_000_000:
            return f"{currency}{value/1_000_000:.1f}M"
        elif abs(value) >= 1_000:
            return f"{currency}{value/1_000:.1f}K"
        else:
            return f"{currency}{value:,.2f}"

    def export_chart_as_image(
        self,
        chart_data: Dict[str, Any],
        chart_type: str,
        format: str = "PNG",
        width: int = 800,
        height: int = 600,
        filename: Optional[str] = None,
    ) -> str:
        """
        Export a single chart as an image file.

        Args:
            chart_data: Chart data
            chart_type: Type of chart to generate
            format: Output format (PNG, SVG, PDF)
            width: Image width in pixels
            height: Image height in pixels
            filename: Output filename

        Returns:
            Path to generated image file
        """
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"chart_{chart_type}_{timestamp}.{format.lower()}"

        output_path = self.output_dir / filename

        try:
            # Set figure size based on DPI
            dpi = 100
            fig_width = width / dpi
            fig_height = height / dpi

            fig, ax = plt.subplots(
                figsize=(fig_width, fig_height), dpi=dpi
            )

            # Generate chart
            if "data" in chart_data:
                df = pd.DataFrame(chart_data["data"])

                if chart_type in ["line", "trend"]:
                    self._create_line_chart(ax, df, chart_type)
                elif chart_type in ["bar", "column"]:
                    self._create_bar_chart(ax, df, chart_type)
                elif chart_type in ["pie", "donut"]:
                    self._create_pie_chart(ax, df, chart_type)

            # Save with specified format
            plt.savefig(
                str(output_path),
                format=format.lower(),
                dpi=dpi,
                bbox_inches="tight",
                facecolor="white",
            )
            plt.close(fig)

            return str(output_path)

        except Exception as e:
            print(f"Error exporting chart: {e}")
            raise e
