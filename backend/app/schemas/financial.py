from datetime import datetime, date
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict

from app.models.financial import StatementType, PeriodType


class FinancialStatementBase(BaseModel):
    """Base schema for financial statements."""

    statement_type: StatementType
    period_start: date
    period_end: date
    period_type: PeriodType
    currency: str = Field(
        ..., min_length=3, max_length=3, description="ISO currency code"
    )
    notes: Optional[str] = None


class FinancialStatementCreate(FinancialStatementBase):
    """Schema for creating a financial statement."""

    scenario_id: int
    line_items: Dict[str, Any]
    raw_data: Optional[Dict[str, Any]] = None
    calculated_data: Optional[Dict[str, Any]] = None


class FinancialStatementUpdate(BaseModel):
    """Schema for updating a financial statement."""

    statement_type: Optional[StatementType] = None
    period_start: Optional[date] = None
    period_end: Optional[date] = None
    period_type: Optional[PeriodType] = None
    currency: Optional[str] = Field(None, min_length=3, max_length=3)
    line_items: Optional[Dict[str, Any]] = None
    raw_data: Optional[Dict[str, Any]] = None
    calculated_data: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None
    is_baseline: Optional[bool] = None


class FinancialStatementResponse(FinancialStatementBase):
    """Schema for financial statement responses."""

    id: int
    scenario_id: int
    line_items: Dict[str, Any]
    raw_data: Optional[Dict[str, Any]] = None
    calculated_data: Optional[Dict[str, Any]] = None
    version: int
    is_baseline: bool
    created_by_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FinancialStatementListResponse(BaseModel):
    """Schema for paginated financial statement lists."""

    statements: List[FinancialStatementResponse]
    total: int
    page: int
    page_size: int
    has_next: bool
    has_previous: bool


class ProcessingJobResponse(BaseModel):
    """Schema for processing job responses."""

    id: str
    file_id: int
    status: str
    progress: int
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None


class ExcelProcessingOptions(BaseModel):
    """Schema for Excel processing options."""

    auto_detect_statements: bool = True
    preserve_formulas: bool = True
    validate_data: bool = True
    extract_metadata: bool = True
    generate_metrics: bool = False
    template_id: Optional[int] = None


class ProcessingStatusResponse(BaseModel):
    """Schema for processing status responses."""

    task_id: str
    state: str
    current: int
    total: int
    status: str
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class FilePreviewResponse(BaseModel):
    """Schema for file preview responses."""

    file_id: int
    file_name: str
    sheets: List[Dict[str, Any]]
    preview_data: Dict[str, Any]
    detected_statements: List[Dict[str, Any]]
    metadata: Dict[str, Any]


class ValidationResultResponse(BaseModel):
    """Schema for validation results."""

    is_valid: bool
    validation_errors: List[Dict[str, Any]]
    warnings: List[Dict[str, Any]]
    summary: Dict[str, Any]


class MetricResponse(BaseModel):
    """Schema for financial metrics responses."""

    metric_name: str
    metric_category: str
    value: float
    period_start: date
    period_end: date
    currency: Optional[str] = None
    calculation_formula: Optional[str] = None
    benchmark_value: Optional[float] = None
    industry_average: Optional[float] = None


class StatementComparisonResponse(BaseModel):
    """Schema for statement comparison responses."""

    statement1_id: int
    statement2_id: int
    statement_type: StatementType
    comparison_result: Dict[str, Any]
    variance_analysis: Dict[str, Any]
    key_changes: List[Dict[str, Any]]
