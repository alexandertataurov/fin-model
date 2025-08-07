# Note: Report functionality removed in lean version
# This is a stub to prevent import errors

from typing import Dict, List, Any, Optional
from sqlalchemy.orm import Session


class ReportService:
    """Stub service for reports - functionality removed in lean version."""

    def __init__(self, db: Session):
        self.db = db

    def create_template(self, user_id: int, template_data: Dict[str, Any]):
        """Stub method - report templates not available in lean version."""
        raise NotImplementedError("Report templates not available in lean version")

    def get_templates(self, user_id: int, report_type=None, include_system=True):
        """Stub method - report templates not available in lean version."""
        return []

    def get_template(self, template_id: int, user_id: int):
        """Stub method - report templates not available in lean version."""
        return None

    def update_template(self, template_id: int, user_id: int, update_data: Dict[str, Any]):
        """Stub method - report templates not available in lean version."""
        raise NotImplementedError("Report templates not available in lean version")

    def delete_template(self, template_id: int, user_id: int) -> bool:
        """Stub method - report templates not available in lean version."""
        return False

    async def generate_report(self, user_id: int, export_format, template_id=None, 
                            source_file_ids=None, custom_config=None, name=None):
        """Stub method - report generation not available in lean version."""
        raise NotImplementedError("Report generation not available in lean version")

    def export_chart(self, user_id: int, chart_data: Dict[str, Any], 
                    export_format=None, width=800, height=600, filename=None):
        """Stub method - chart export not available in lean version."""
        raise NotImplementedError("Chart export not available in lean version")

    def get_exports(self, user_id: int, status=None, limit=50, offset=0):
        """Stub method - report exports not available in lean version."""
        return []

    def get_export(self, export_id: int, user_id: int):
        """Stub method - report exports not available in lean version."""
        return None

    def delete_export(self, export_id: int, user_id: int) -> bool:
        """Stub method - report exports not available in lean version."""
        return False

    def cleanup_expired_exports(self) -> int:
        """Stub method - report cleanup not available in lean version."""
        return 0

    def get_export_summary(self, user_id: int) -> Dict[str, Any]:
        """Stub method - report summary not available in lean version."""
        return {"total_exports": 0, "recent_exports": []}

    def initialize_system_templates(self) -> None:
        """Stub method - system templates not available in lean version."""
        pass
