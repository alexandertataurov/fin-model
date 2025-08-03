from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, validator
from app.models.report import ReportType, ExportFormat, ReportStatus


# Base schemas
class ReportTemplateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    report_type: ReportType
    is_active: bool = True
    template_config: Optional[Dict[str, Any]] = None
    branding_config: Optional[Dict[str, Any]] = None


class ReportTemplateCreate(ReportTemplateBase):
    pass


class ReportTemplateUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    is_active: Optional[bool] = None
    template_config: Optional[Dict[str, Any]] = None
    branding_config: Optional[Dict[str, Any]] = None


class ReportTemplate(ReportTemplateBase):
    id: int
    is_system: bool
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Schedule schemas
class ReportScheduleBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    cron_expression: str = Field(..., min_length=1, max_length=100)
    is_active: bool = True
    template_id: int
    export_format: ExportFormat = ExportFormat.PDF
    report_config: Optional[Dict[str, Any]] = None
    email_recipients: Optional[List[str]] = None
    delivery_config: Optional[Dict[str, Any]] = None

    @validator("email_recipients")
    def validate_emails(cls, v):
        if v:
            import re

            email_regex = re.compile(
                r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            )
            for email in v:
                if not email_regex.match(email):
                    raise ValueError(f"Invalid email address: {email}")
        return v


class ReportScheduleCreate(ReportScheduleBase):
    pass


class ReportScheduleUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    cron_expression: Optional[str] = Field(None, min_length=1, max_length=100)
    is_active: Optional[bool] = None
    export_format: Optional[ExportFormat] = None
    report_config: Optional[Dict[str, Any]] = None
    email_recipients: Optional[List[str]] = None
    delivery_config: Optional[Dict[str, Any]] = None


class ReportSchedule(ReportScheduleBase):
    id: int
    created_by: int
    last_run_at: Optional[datetime] = None
    next_run_at: Optional[datetime] = None
    run_count: int
    failure_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Export schemas
class ReportExportBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    export_format: ExportFormat
    template_id: Optional[int] = None
    generation_config: Optional[Dict[str, Any]] = None
    source_file_ids: Optional[List[int]] = None
    data_period_start: Optional[datetime] = None
    data_period_end: Optional[datetime] = None


class ReportExportCreate(ReportExportBase):
    pass


class ReportExportUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    status: Optional[ReportStatus] = None
    is_shared: Optional[bool] = None
    shared_with: Optional[List[int]] = None
    expires_at: Optional[datetime] = None


class ReportExport(ReportExportBase):
    id: int
    status: ReportStatus
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    file_url: Optional[str] = None
    schedule_id: Optional[int] = None
    processing_started_at: Optional[datetime] = None
    processing_completed_at: Optional[datetime] = None
    processing_duration_seconds: Optional[int] = None
    error_message: Optional[str] = None
    created_by: int
    is_shared: bool
    shared_with: Optional[List[int]] = None
    expires_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Specialized request schemas
class GenerateReportRequest(BaseModel):
    template_id: Optional[int] = None
    export_format: ExportFormat = ExportFormat.PDF
    name: Optional[str] = None
    # Tests send `file_ids`; support that alias for backward compatibility.
    source_file_ids: Optional[List[int]] = Field(default=None, alias="file_ids")
    data_period_start: Optional[datetime] = None
    data_period_end: Optional[datetime] = None
    custom_config: Optional[Dict[str, Any]] = None

    class Config:
        populate_by_name = True


class ChartExportRequest(BaseModel):
    chart_type: str = Field(..., description="Type of chart to export")
    chart_data: Dict[str, Any] = Field(..., description="Chart data and configuration")
    export_format: ExportFormat = Field(
        ..., description="Export format (PNG, SVG, PDF)"
    )
    width: Optional[int] = Field(800, ge=100, le=4000, description="Width in pixels")
    height: Optional[int] = Field(600, ge=100, le=4000, description="Height in pixels")
    title: Optional[str] = None
    filename: Optional[str] = None


class DataExportRequest(BaseModel):
    export_format: ExportFormat = Field(..., description="Export format")
    source_file_ids: Optional[List[int]] = None
    date_range: Optional[Dict[str, datetime]] = None
    filters: Optional[Dict[str, Any]] = None
    include_raw_data: bool = True
    include_calculations: bool = True
    include_metadata: bool = False


# Response schemas
class ReportGenerationStatus(BaseModel):
    export_id: int
    status: ReportStatus
    progress_percentage: Optional[int] = Field(None, ge=0, le=100)
    estimated_completion: Optional[datetime] = None
    current_step: Optional[str] = None
    error_message: Optional[str] = None


class ExportSummary(BaseModel):
    total_exports: int
    completed_exports: int
    failed_exports: int
    pending_exports: int
    total_file_size_bytes: int
    exports_by_format: Dict[str, int]
    recent_exports: List[ReportExport]
