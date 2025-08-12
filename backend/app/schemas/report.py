# Note: Report schemas removed in lean version
# This file is commented out to prevent import errors

# from pydantic import BaseModel, Field
# from typing import Optional, List, Dict, Any
# from app.models.report import ReportType, ExportFormat, ReportStatus
# from datetime import datetime

# class ReportTemplateCreate(BaseModel):
#     name: str = Field(..., description="Template name")
#     description: Optional[str] = Field(None, description="Template description")
#     report_type: ReportType = Field(..., description="Type of report")
#     template_config: Dict[str, Any] = Field(default_factory=dict)
#     branding_config: Dict[str, Any] = Field(default_factory=dict)

# class ReportTemplateUpdate(BaseModel):
#     name: Optional[str] = None
#     description: Optional[str] = None
#     template_config: Optional[Dict[str, Any]] = None
#     branding_config: Optional[Dict[str, Any]] = None

# class ReportTemplateResponse(BaseModel):
#     id: int
#     name: str
#     description: Optional[str]
#     report_type: ReportType
#     template_config: Dict[str, Any]
#     branding_config: Dict[str, Any]
#     created_by: int
#     created_at: datetime
#     is_system: bool = False
#     is_active: bool = True

#     class Config:
#         from_attributes = True

# class ReportExportRequest(BaseModel):
#     export_format: ExportFormat = Field(..., description="Export format")
#     template_id: Optional[int] = Field(None, description="Template ID")
#     source_file_ids: Optional[List[int]] = Field(None, description="Source file IDs")
#     custom_config: Optional[Dict[str, Any]] = Field(None, description="Custom configuration")
#     name: Optional[str] = Field(None, description="Report name")

# class ReportExportResponse(BaseModel):
#     id: int
#     name: str
#     export_format: ExportFormat
#     status: ReportStatus
#     template_id: Optional[int]
#     file_path: Optional[str]
#     file_size: Optional[int]
#     created_by: int
#     created_at: datetime
#     processing_started_at: Optional[datetime]
#     processing_completed_at: Optional[datetime]
#     processing_duration_seconds: Optional[int]
#     expires_at: Optional[datetime]
#     error_message: Optional[str]

#     class Config:
#         from_attributes = True
