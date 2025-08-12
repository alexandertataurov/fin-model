"""
Report Service
Provides centralized management of report templates, schedules, and exports.
"""

import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.report import ReportTemplate, ReportSchedule, ReportExport

logger = logging.getLogger(__name__)


class ReportService:
    """Service for managing reports."""

    def __init__(self, db: Session):
        self.db = db

    def get_all_templates(self) -> List[ReportTemplate]:
        """Get all report templates."""
        try:
            return (
                self.db.query(ReportTemplate)
                .filter(ReportTemplate.is_active == True)
                .all()
            )
        except Exception as e:
            logger.error(f"Failed to get report templates: {e}")
            return []

    def get_template_by_id(self, template_id: int) -> Optional[ReportTemplate]:
        """Get a specific report template by ID."""
        try:
            return (
                self.db.query(ReportTemplate)
                .filter(
                    ReportTemplate.id == template_id, ReportTemplate.is_active == True
                )
                .first()
            )
        except Exception as e:
            logger.error(f"Failed to get report template {template_id}: {e}")
            return None

    def create_template(
        self,
        name: str,
        report_type: str,
        template_config: Dict[str, Any],
        branding_config: Dict[str, Any] = None,
        created_by: int = None,
    ) -> ReportTemplate:
        """Create a new report template."""
        try:
            template = ReportTemplate(
                name=name,
                report_type=report_type,
                template_config=template_config,
                branding_config=branding_config or {},
                created_by=created_by,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            self.db.add(template)
            self.db.commit()
            return template
        except Exception as e:
            logger.error(f"Failed to create report template: {e}")
            self.db.rollback()
            raise

    def get_all_schedules(self) -> List[ReportSchedule]:
        """Get all report schedules."""
        try:
            return (
                self.db.query(ReportSchedule)
                .filter(ReportSchedule.enabled == True)
                .all()
            )
        except Exception as e:
            logger.error(f"Failed to get report schedules: {e}")
            return []

    def get_schedule_by_id(self, schedule_id: int) -> Optional[ReportSchedule]:
        """Get a specific report schedule by ID."""
        try:
            return (
                self.db.query(ReportSchedule)
                .filter(
                    ReportSchedule.id == schedule_id, ReportSchedule.enabled == True
                )
                .first()
            )
        except Exception as e:
            logger.error(f"Failed to get report schedule {schedule_id}: {e}")
            return None

    def create_schedule(
        self,
        name: str,
        template_id: int,
        schedule: str,
        enabled: bool = True,
        created_by: int = None,
    ) -> ReportSchedule:
        """Create a new report schedule."""
        try:
            schedule_obj = ReportSchedule(
                name=name,
                template_id=template_id,
                schedule=schedule,
                enabled=enabled,
                created_by=created_by,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            self.db.add(schedule_obj)
            self.db.commit()
            return schedule_obj
        except Exception as e:
            logger.error(f"Failed to create report schedule: {e}")
            self.db.rollback()
            raise

    def get_all_exports(self, limit: int = 100) -> List[ReportExport]:
        """Get recent report exports."""
        try:
            return (
                self.db.query(ReportExport)
                .order_by(ReportExport.created_at.desc())
                .limit(limit)
                .all()
            )
        except Exception as e:
            logger.error(f"Failed to get report exports: {e}")
            return []

    def create_export(
        self,
        name: str,
        export_format: str,
        template_id: int = None,
        schedule_id: int = None,
        created_by: int = None,
        custom_config: Dict[str, Any] = None,
    ) -> ReportExport:
        """Create a new report export."""
        try:
            export = ReportExport(
                name=name,
                export_format=export_format,
                template_id=template_id,
                schedule_id=schedule_id,
                status="pending",
                created_by=created_by,
                created_at=datetime.utcnow(),
                custom_config=custom_config or {},
            )
            self.db.add(export)
            self.db.commit()
            return export
        except Exception as e:
            logger.error(f"Failed to create report export: {e}")
            self.db.rollback()
            raise

    def update_export_status(
        self,
        export_id: int,
        status: str,
        file_path: str = None,
        file_size: int = None,
        error_message: str = None,
    ) -> Optional[ReportExport]:
        """Update the status of a report export."""
        try:
            export = (
                self.db.query(ReportExport).filter(ReportExport.id == export_id).first()
            )
            if not export:
                return None

            export.status = status
            if file_path:
                export.file_path = file_path
            if file_size:
                export.file_size = file_size
            if error_message:
                export.error_message = error_message

            if status == "processing":
                export.processing_started_at = datetime.utcnow()
            elif status in ["completed", "failed"]:
                export.processing_completed_at = datetime.utcnow()
                if export.processing_started_at:
                    duration = (
                        export.processing_completed_at - export.processing_started_at
                    ).total_seconds()
                    export.processing_duration_seconds = int(duration)

            self.db.commit()
            return export
        except Exception as e:
            logger.error(f"Failed to update export status {export_id}: {e}")
            self.db.rollback()
            return None

    def get_export_by_id(self, export_id: int) -> Optional[ReportExport]:
        """Get a specific report export by ID."""
        try:
            return (
                self.db.query(ReportExport).filter(ReportExport.id == export_id).first()
            )
        except Exception as e:
            logger.error(f"Failed to get report export {export_id}: {e}")
            return None
