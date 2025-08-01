import os
import json
import shutil
from typing import Dict, List, Any, Optional, Union
from datetime import datetime, timedelta
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.models.report import (
    ReportTemplate,
    ReportSchedule,
    ReportExport,
    ReportType,
    ExportFormat,
    ReportStatus,
)
from app.models.user import User
from app.services.pdf_generator import PDFReportGenerator
from app.services.excel_exporter import ExcelExporter
from app.services.dashboard_metrics import DashboardMetricsService
from app.core.config import settings


class ReportService:
    """Main service for managing reports, templates, and exports."""

    def __init__(self, db: Session):
        self.db = db
        self.pdf_generator = PDFReportGenerator()
        self.excel_exporter = ExcelExporter()
        self.dashboard_service = DashboardMetricsService(db)

        # Default templates
        self.default_templates = {
            ReportType.FINANCIAL_SUMMARY: {
                "name": "Financial Summary Report",
                "sections": ["executive_summary", "key_metrics", "charts", "trends"],
                "layout": "standard",
                "include_charts": True,
                "include_tables": True,
            },
            ReportType.PROFIT_LOSS: {
                "name": "Profit & Loss Report",
                "sections": [
                    "pl_metrics",
                    "revenue_analysis",
                    "expense_breakdown",
                    "margins",
                ],
                "layout": "detailed",
                "include_charts": True,
                "include_comparisons": True,
            },
            ReportType.BALANCE_SHEET: {
                "name": "Balance Sheet Report",
                "sections": ["assets", "liabilities", "equity", "ratios"],
                "layout": "standard",
                "include_charts": True,
                "include_ratios": True,
            },
            ReportType.CASH_FLOW: {
                "name": "Cash Flow Report",
                "sections": [
                    "operating_cf",
                    "investing_cf",
                    "financing_cf",
                    "waterfall",
                ],
                "layout": "waterfall",
                "include_charts": True,
                "include_waterfall": True,
            },
        }

    # Template Management
    def create_template(
        self, user_id: int, template_data: Dict[str, Any]
    ) -> ReportTemplate:
        """Create a new report template."""
        template = ReportTemplate(
            name=template_data["name"],
            description=template_data.get("description"),
            report_type=template_data["report_type"],
            template_config=template_data.get("template_config", {}),
            branding_config=template_data.get("branding_config", {}),
            created_by=user_id,
        )

        self.db.add(template)
        self.db.commit()
        self.db.refresh(template)

        return template

    def get_templates(
        self,
        user_id: int,
        report_type: Optional[ReportType] = None,
        include_system: bool = True,
    ) -> List[ReportTemplate]:
        """Get available templates for a user."""
        query = self.db.query(ReportTemplate).filter(
            and_(
                ReportTemplate.is_active == True,
                or_(
                    ReportTemplate.created_by == user_id,
                    ReportTemplate.is_system == True if include_system else False,
                ),
            )
        )

        if report_type:
            query = query.filter(ReportTemplate.report_type == report_type)

        return query.order_by(ReportTemplate.created_at.desc()).all()

    def get_template(self, template_id: int, user_id: int) -> Optional[ReportTemplate]:
        """Get a specific template."""
        return (
            self.db.query(ReportTemplate)
            .filter(
                and_(
                    ReportTemplate.id == template_id,
                    or_(
                        ReportTemplate.created_by == user_id,
                        ReportTemplate.is_system == True,
                    ),
                )
            )
            .first()
        )

    def update_template(
        self, template_id: int, user_id: int, update_data: Dict[str, Any]
    ) -> Optional[ReportTemplate]:
        """Update a template."""
        template = (
            self.db.query(ReportTemplate)
            .filter(
                and_(
                    ReportTemplate.id == template_id,
                    ReportTemplate.created_by == user_id,
                    ReportTemplate.is_system == False,  # Can't update system templates
                )
            )
            .first()
        )

        if not template:
            return None

        for key, value in update_data.items():
            if hasattr(template, key) and value is not None:
                setattr(template, key, value)

        self.db.commit()
        self.db.refresh(template)
        return template

    def delete_template(self, template_id: int, user_id: int) -> bool:
        """Delete a template."""
        template = (
            self.db.query(ReportTemplate)
            .filter(
                and_(
                    ReportTemplate.id == template_id,
                    ReportTemplate.created_by == user_id,
                    ReportTemplate.is_system == False,
                )
            )
            .first()
        )

        if not template:
            return False

        template.is_active = False
        self.db.commit()
        return True

    # Report Generation
    async def generate_report(
        self,
        user_id: int,
        export_format: ExportFormat,
        template_id: Optional[int] = None,
        source_file_ids: Optional[List[int]] = None,
        custom_config: Optional[Dict[str, Any]] = None,
        name: Optional[str] = None,
    ) -> ReportExport:
        """Generate a report based on template and data."""

        # Create export record
        export_record = ReportExport(
            name=name or f"Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            export_format=export_format,
            template_id=template_id,
            generation_config=custom_config or {},
            source_file_ids=source_file_ids or [],
            created_by=user_id,
            status=ReportStatus.PENDING,
        )

        self.db.add(export_record)
        self.db.commit()
        self.db.refresh(export_record)

        try:
            # Update status to processing
            export_record.status = ReportStatus.PROCESSING
            export_record.processing_started_at = datetime.utcnow()
            self.db.commit()

            # Get template configuration
            template_config = None
            branding_config = None

            if template_id:
                template = self.get_template(template_id, user_id)
                if template:
                    template_config = template.template_config
                    branding_config = template.branding_config

            # Gather financial data
            financial_data = await self._gather_financial_data(
                user_id, source_file_ids, custom_config
            )

            # Generate report based on format
            if export_format == ExportFormat.PDF:
                file_path = self.pdf_generator.generate_financial_report(
                    financial_data,
                    template_config,
                    branding_config,
                    f"{export_record.name}.pdf",
                )
            elif export_format == ExportFormat.EXCEL:
                file_path = self.excel_exporter.export_financial_data(
                    financial_data,
                    template_config,
                    filename=f"{export_record.name}.xlsx",
                )
            elif export_format == ExportFormat.CSV:
                # Export raw data as CSV
                raw_data = financial_data.get("raw_data", [])
                file_path = self.excel_exporter.export_raw_data_csv(
                    raw_data, filename=f"{export_record.name}.csv"
                )
            else:
                raise ValueError(f"Unsupported export format: {export_format}")

            # Update export record with success
            export_record.status = ReportStatus.COMPLETED
            export_record.processing_completed_at = datetime.utcnow()
            export_record.file_path = file_path
            export_record.file_size = os.path.getsize(file_path)
            export_record.processing_duration_seconds = int(
                (
                    export_record.processing_completed_at
                    - export_record.processing_started_at
                ).total_seconds()
            )

            # Set expiration (30 days from now)
            export_record.expires_at = datetime.utcnow() + timedelta(days=30)

        except Exception as e:
            # Update export record with failure
            export_record.status = ReportStatus.FAILED
            export_record.processing_completed_at = datetime.utcnow()
            export_record.error_message = str(e)
            if export_record.processing_started_at:
                export_record.processing_duration_seconds = int(
                    (
                        export_record.processing_completed_at
                        - export_record.processing_started_at
                    ).total_seconds()
                )

        self.db.commit()
        self.db.refresh(export_record)
        return export_record

    async def _gather_financial_data(
        self,
        user_id: int,
        source_file_ids: Optional[List[int]] = None,
        custom_config: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Gather financial data from various sources."""

        period = custom_config.get("period", "YTD") if custom_config else "YTD"
        file_id = source_file_ids[0] if source_file_ids else None

        # Get dashboard metrics
        overview_data = await self.dashboard_service.get_overview_metrics(
            user_id, period, file_id
        )
        pl_data = await self.dashboard_service.get_pl_metrics(user_id, period, file_id)
        cf_data = await self.dashboard_service.get_cash_flow_metrics(
            user_id, period, file_id
        )
        bs_data = await self.dashboard_service.get_balance_sheet_metrics(
            user_id, period, file_id
        )

        # Compile comprehensive data
        financial_data = {
            "summary": {
                "overview": "This report provides a comprehensive analysis of your financial performance.",
                "highlights": [
                    "Revenue growth analysis",
                    "Profitability trends",
                    "Cash flow assessment",
                    "Balance sheet health",
                ],
            },
            "metrics": {
                **overview_data.get("key_metrics", {}),
                **pl_data.get("metrics", {}),
                **cf_data.get("metrics", {}),
                **bs_data.get("metrics", {}),
            },
            "charts": {
                **pl_data.get("charts", {}),
                **cf_data.get("charts", {}),
                **bs_data.get("charts", {}),
            },
            "tables": {
                "profit_loss": pl_data.get("metrics", []),
                "cash_flow": cf_data.get("metrics", []),
                "balance_sheet": bs_data.get("metrics", []),
            },
            "metadata": {
                "period": period,
                "source_files": source_file_ids or [],
                "generated_by": user_id,
                "data_quality": {
                    "pl": pl_data.get("data_quality", {}),
                    "cf": cf_data.get("data_quality", {}),
                    "bs": bs_data.get("data_quality", {}),
                },
            },
        }

        return financial_data

    # Chart Export
    def export_chart(
        self,
        user_id: int,
        chart_data: Dict[str, Any],
        export_format: ExportFormat = ExportFormat.PNG,
        width: int = 800,
        height: int = 600,
        filename: Optional[str] = None,
    ) -> str:
        """Export a single chart as an image file."""

        chart_type = chart_data.get("type", "line")

        if export_format in [ExportFormat.PNG, ExportFormat.SVG]:
            return self.pdf_generator.export_chart_as_image(
                chart_data,
                chart_type,
                export_format.value.upper(),
                width,
                height,
                filename,
            )
        else:
            raise ValueError(f"Unsupported chart export format: {export_format}")

    # Export Management
    def get_exports(
        self,
        user_id: int,
        status: Optional[ReportStatus] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[ReportExport]:
        """Get user's exports."""
        query = self.db.query(ReportExport).filter(ReportExport.created_by == user_id)

        if status:
            query = query.filter(ReportExport.status == status)

        return (
            query.order_by(ReportExport.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

    def get_export(self, export_id: int, user_id: int) -> Optional[ReportExport]:
        """Get a specific export."""
        return (
            self.db.query(ReportExport)
            .filter(
                and_(
                    ReportExport.id == export_id,
                    or_(
                        ReportExport.created_by == user_id,
                        ReportExport.shared_with.contains([user_id]),
                    ),
                )
            )
            .first()
        )

    def delete_export(self, export_id: int, user_id: int) -> bool:
        """Delete an export."""
        export = (
            self.db.query(ReportExport)
            .filter(
                and_(ReportExport.id == export_id, ReportExport.created_by == user_id)
            )
            .first()
        )

        if not export:
            return False

        # Delete file if it exists
        if export.file_path and os.path.exists(export.file_path):
            try:
                os.remove(export.file_path)
            except Exception as e:
                print(f"Error deleting file {export.file_path}: {e}")

        # Delete database record
        self.db.delete(export)
        self.db.commit()
        return True

    def cleanup_expired_exports(self) -> int:
        """Clean up expired exports."""
        now = datetime.utcnow()
        expired_exports = (
            self.db.query(ReportExport)
            .filter(
                and_(
                    ReportExport.expires_at <= now,
                    ReportExport.status == ReportStatus.COMPLETED,
                )
            )
            .all()
        )

        deleted_count = 0
        for export in expired_exports:
            if self.delete_export(export.id, export.created_by):
                deleted_count += 1

        return deleted_count

    def get_export_summary(self, user_id: int) -> Dict[str, Any]:
        """Get export statistics for a user."""
        exports = (
            self.db.query(ReportExport).filter(ReportExport.created_by == user_id).all()
        )

        total_exports = len(exports)
        completed_exports = len(
            [e for e in exports if e.status == ReportStatus.COMPLETED]
        )
        failed_exports = len([e for e in exports if e.status == ReportStatus.FAILED])
        pending_exports = len(
            [
                e
                for e in exports
                if e.status in [ReportStatus.PENDING, ReportStatus.PROCESSING]
            ]
        )

        total_file_size = sum(e.file_size or 0 for e in exports if e.file_size)

        exports_by_format = {}
        for export in exports:
            format_name = export.export_format.value
            exports_by_format[format_name] = exports_by_format.get(format_name, 0) + 1

        recent_exports = sorted(exports, key=lambda x: x.created_at, reverse=True)[:10]

        return {
            "total_exports": total_exports,
            "completed_exports": completed_exports,
            "failed_exports": failed_exports,
            "pending_exports": pending_exports,
            "total_file_size_bytes": total_file_size,
            "exports_by_format": exports_by_format,
            "recent_exports": recent_exports,
        }

    # System template initialization
    def initialize_system_templates(self) -> None:
        """Initialize default system templates."""
        for report_type, config in self.default_templates.items():
            # Check if system template already exists
            existing = (
                self.db.query(ReportTemplate)
                .filter(
                    and_(
                        ReportTemplate.report_type == report_type,
                        ReportTemplate.is_system == True,
                    )
                )
                .first()
            )

            if not existing:
                # Create system template (use admin user ID = 1, or create a system user)
                system_template = ReportTemplate(
                    name=config["name"],
                    description=f"Default {report_type.value.replace('_', ' ').title()} template",
                    report_type=report_type,
                    is_system=True,
                    template_config=config,
                    created_by=1,  # Assume admin user ID = 1
                )

                self.db.add(system_template)

        self.db.commit()
