from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, Field, field_validator, ConfigDict
from app.models.file import FileStatus, FileType


class FileUploadResponse(BaseModel):
    """Response schema for file upload."""

    id: int
    filename: Optional[str] = None
    original_filename: str
    file_size: int
    file_type: str
    status: FileStatus
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FileInfo(BaseModel):
    """Schema for file information."""

    id: int
    filename: Optional[str] = None
    original_filename: str
    file_size: int
    file_type: Optional[str] = None
    mime_type: Optional[str] = None
    status: FileStatus
    is_valid: Optional[bool] = None
    validation_errors: Optional[str] = None
    processing_started_at: Optional[datetime] = None
    processing_completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProcessingLogEntry(BaseModel):
    """Schema for processing log entries."""

    id: int
    step: str
    message: str
    level: str
    details: Optional[str] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class FileWithLogs(FileInfo):
    """File information with processing logs."""

    processing_logs: List[ProcessingLogEntry] = []


class FileListResponse(BaseModel):
    """Response schema for file listing."""

    files: List[FileInfo]
    total: int
    page: int
    page_size: int
    has_next: bool
    has_previous: bool


class FileProcessingStatus(BaseModel):
    """Schema for file processing status updates."""

    file_id: int
    status: FileStatus
    progress: Optional[int] = Field(None, ge=0, le=100)
    message: Optional[str] = None
    current_step: Optional[str] = None
    total_steps: Optional[int] = None
    errors: Optional[List[str]] = None


class FileValidationResult(BaseModel):
    """Schema for file validation results."""

    is_valid: bool
    errors: List[str] = []
    warnings: List[str] = []
    sheet_info: Optional[Dict[str, Any]] = None
    column_mapping: Optional[Dict[str, str]] = None
    row_count: Optional[int] = None


class ExcelSheetInfo(BaseModel):
    """Schema for Excel sheet information."""

    name: str
    row_count: int
    column_count: int
    columns: List[str]
    has_headers: bool
    data_range: str


class ParsedFileData(BaseModel):
    """Schema for parsed file data."""

    file_id: int
    sheets: List[ExcelSheetInfo] = []
    financial_statements: Optional[Dict[str, Any]] = None
    key_metrics: Optional[Dict[str, Any]] = None
    assumptions: Optional[Dict[str, Any]] = None
    validation_summary: FileValidationResult
    comprehensive_analysis: Optional[Dict[str, Any]] = None


class FileProcessingRequest(BaseModel):
    """Schema for file processing requests."""

    file_id: int
    processing_options: Optional[Dict[str, Any]] = None
    priority: Optional[str] = Field(
        "normal", pattern="^(low|normal|high|urgent)$"
    )


class TemplateValidationConfig(BaseModel):
    """Schema for template validation configuration."""

    template_type: str = Field(
        ..., pattern="^(pnl|balance_sheet|cash_flow|custom)$"
    )
    required_columns: List[str] = []
    optional_columns: List[str] = []
    validation_rules: Dict[str, Any] = {}
    column_mapping: Dict[str, str] = {}
