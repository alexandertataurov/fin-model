from typing import Dict, List, Any, Optional, Union, Tuple
from datetime import datetime
from pydantic import BaseModel, Field, field_validator, ConfigDict
from enum import Enum

from app.models.parameter import (
    ParameterType,
    ParameterCategory,
    SensitivityLevel,
)


# Base Parameter Schemas
class ParameterBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    display_name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    parameter_type: ParameterType = ParameterType.GROWTH_RATE
    category: ParameterCategory = ParameterCategory.ASSUMPTIONS
    sensitivity_level: SensitivityLevel = SensitivityLevel.MEDIUM
    value: Optional[float] = None
    default_value: Optional[float] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    unit: Optional[str] = Field(None, max_length=50)
    format_type: str = Field("number", max_length=50)
    source_sheet: Optional[str] = Field(None, max_length=255)
    source_cell: Optional[str] = Field(None, max_length=20)
    source_range: Optional[str] = Field(None, max_length=50)
    depends_on: Optional[List[str]] = None
    affects: Optional[List[str]] = None
    formula: Optional[str] = None
    validation_rules: Optional[Dict[str, Any]] = None
    is_required: bool = True
    is_editable: bool = True

    @field_validator("min_value", "max_value")
    @classmethod
    def validate_range(cls, v, values):
        min_val = values.get("min_value") if isinstance(values, dict) else None
        if v is not None and min_val is not None and v < min_val:
            raise ValueError("max_value must be greater than min_value")
        return v


class ParameterCreate(ParameterBase):
    source_file_id: Optional[int] = None


class ParameterUpdate(BaseModel):
    display_name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    sensitivity_level: Optional[SensitivityLevel] = None
    value: Optional[float] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    unit: Optional[str] = Field(None, max_length=50)
    validation_rules: Optional[Dict[str, Any]] = None
    is_required: Optional[bool] = None
    is_editable: Optional[bool] = None


class ParameterResponse(ParameterBase):
    id: int
    source_file_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    created_by_id: int

    model_config = ConfigDict(from_attributes=True)


# Parameter Value Schemas
class ParameterValueBase(BaseModel):
    value: float
    change_reason: Optional[str] = Field(None, max_length=255)


class ParameterValueCreate(ParameterValueBase):
    parameter_id: int
    scenario_id: int


class ParameterValueUpdate(BaseModel):
    value: Optional[float] = None
    change_reason: Optional[str] = Field(None, max_length=255)


class ParameterValueResponse(ParameterValueBase):
    id: int
    parameter_id: int
    scenario_id: int
    original_value: Optional[float] = None
    changed_at: datetime
    changed_by_id: int
    is_valid: bool = True
    validation_errors: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True)


# Scenario Schemas
class ScenarioBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    is_baseline: bool = False
    is_template: bool = False
    version: str = Field("1.0", max_length=50)


class ScenarioCreate(ScenarioBase):
    base_file_id: int
    parent_scenario_id: Optional[int] = None


class ScenarioUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    is_baseline: Optional[bool] = None
    is_template: Optional[bool] = None
    status: Optional[str] = None


class ScenarioResponse(ScenarioBase):
    id: int
    base_file_id: int
    parent_scenario_id: Optional[int] = None
    status: str
    last_calculated_at: Optional[datetime] = None
    calculation_status: str
    calculation_results: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    created_by_id: int

    model_config = ConfigDict(from_attributes=True)


class ScenarioVersionResponse(BaseModel):
    id: int
    name: str
    version: str
    description: Optional[str] = None
    created_at: datetime
    created_by_id: int
    is_current: bool = False

    model_config = ConfigDict(from_attributes=True)


# Parameter Detection Schemas
class DetectedParameterInfo(BaseModel):
    cell_reference: str
    sheet_name: str
    name: str
    value: Optional[float]
    parameter_type: ParameterType
    category: ParameterCategory
    sensitivity_level: SensitivityLevel
    description: Optional[str]
    unit: Optional[str]
    format_type: str
    confidence_score: float
    validation_rules: Optional[Dict[str, Any]] = None


class ParameterDetectionRequest(BaseModel):
    file_id: int
    detection_settings: Optional[Dict[str, Any]] = None


class ParameterDetectionResponse(BaseModel):
    file_id: int
    parameters_detected: int
    parameters: List[DetectedParameterInfo]
    detection_summary: Dict[str, Any]


# Parameter Validation Schemas
class ParameterValidationRequest(BaseModel):
    parameter_id: int
    value: Any
    context: Optional[Dict[str, Any]] = None


class ParameterValidationResponse(BaseModel):
    parameter_id: int
    value: Any
    is_valid: bool
    validation_errors: List[str] = []
    suggested_value: Optional[Any] = None
    validation_warnings: List[str] = []


# Bulk Update Schemas
class ParameterUpdateItem(BaseModel):
    parameter_id: int
    new_value: float
    change_reason: Optional[str] = None


class BulkParameterUpdateRequest(BaseModel):
    updates: List[ParameterUpdateItem]
    scenario_id: Optional[int] = None
    recalculate_formulas: bool = True
    validate_before_update: bool = True


class BulkParameterUpdateResponse(BaseModel):
    updated_count: int
    error_count: int
    results: List[Dict[str, Any]]
    errors: List[Dict[str, Any]]
    calculation_triggered: bool = False


# Formula and Dependency Schemas
class FormulaDependency(BaseModel):
    cell_reference: str
    parameter_id: Optional[int] = None
    dependency_type: str  # "direct", "indirect", "circular"
    depth: int = 0


class FormulaAnalysisRequest(BaseModel):
    file_id: int
    sheet_name: Optional[str] = None
    cell_reference: Optional[str] = None


class FormulaAnalysisResponse(BaseModel):
    file_id: int
    total_formulas: int
    dependencies: List[FormulaDependency]
    circular_references: List[List[str]]
    calculation_order: List[str]
    analysis_summary: Dict[str, Any]


# Scenario Comparison Schemas
class ScenarioComparisonRequest(BaseModel):
    base_scenario_id: int
    compare_scenario_ids: List[int]
    parameter_filters: Optional[List[int]] = None
    comparison_type: str = Field("variance", pattern="^(variance|absolute|percentage)$")


class ParameterComparison(BaseModel):
    parameter_id: int
    parameter_name: str
    base_value: Optional[float]
    comparison_values: Dict[int, Optional[float]]  # scenario_id -> value
    variance: Dict[int, Optional[float]]  # scenario_id -> variance
    percentage_change: Dict[int, Optional[float]]  # scenario_id -> % change


class ScenarioComparisonResponse(BaseModel):
    base_scenario_id: int
    comparison_scenarios: List[int]
    parameter_comparisons: List[ParameterComparison]
    summary_statistics: Dict[str, Any]
    comparison_charts: Optional[Dict[str, Any]] = None


# Sensitivity Analysis Schemas
class SensitivityParameterConfig(BaseModel):
    parameter_id: int
    min_value: float
    max_value: float
    step_size: Optional[float] = None
    distribution: str = Field("uniform", pattern="^(uniform|normal|triangular)$")


class SensitivityAnalysisRequest(BaseModel):
    scenario_id: int
    target_parameter_id: int  # The output parameter to analyze
    input_parameters: List[SensitivityParameterConfig]
    analysis_type: str = Field("tornado", pattern="^(tornado|spider|monte_carlo)$")
    iterations: Optional[int] = Field(1000, ge=100, le=10000)
    confidence_level: Optional[float] = Field(0.95, ge=0.01, le=0.99)


class SensitivityResult(BaseModel):
    parameter_id: int
    parameter_name: str
    sensitivity_coefficient: float
    impact_range: Tuple[float, float]
    correlation: Optional[float] = None


class SensitivityAnalysisResponse(BaseModel):
    analysis_id: int
    scenario_id: int
    target_parameter_id: int
    analysis_type: str
    results: List[SensitivityResult]
    chart_data: Dict[str, Any]
    summary_statistics: Dict[str, Any]
    execution_time: float
    status: str


# Export/Import Schemas
class ParameterExportRequest(BaseModel):
    file_id: Optional[int] = None
    scenario_id: Optional[int] = None
    parameter_ids: Optional[List[int]] = None
    export_format: str = Field("excel", pattern="^(excel|csv|json)$")
    include_values: bool = True
    include_formulas: bool = True
    include_metadata: bool = True


class ParameterExportResponse(BaseModel):
    export_id: str
    file_url: str
    export_format: str
    parameter_count: int
    file_size: int
    expires_at: datetime


class ParameterImportRequest(BaseModel):
    file_id: int
    import_mode: str = Field("merge", pattern="^(merge|replace|append)$")
    auto_detect_parameters: bool = True
    validate_before_import: bool = True
    create_scenario: bool = False
    scenario_name: Optional[str] = None


class ParameterImportResponse(BaseModel):
    import_id: str
    file_id: int
    imported_count: int
    skipped_count: int
    error_count: int
    created_scenario_id: Optional[int] = None
    import_summary: Dict[str, Any]
    errors: List[Dict[str, str]] = []


# Template Schemas
class ParameterTemplate(BaseModel):
    name: str
    description: Optional[str] = None
    category: ParameterCategory
    parameters: List[ParameterCreate]
    default_scenario: Optional[ScenarioCreate] = None


class ParameterTemplateResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: ParameterCategory
    parameter_count: int
    usage_count: int
    created_at: datetime
    created_by_id: int

    model_config = ConfigDict(from_attributes=True)


# Search and Filter Schemas
class ParameterSearchRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    sort_by: str = Field(
        "name", pattern="^(name|created_at|updated_at|sensitivity_level)$"
    )
    sort_order: str = Field("asc", pattern="^(asc|desc)$")
    limit: int = Field(50, ge=1, le=200)
    offset: int = Field(0, ge=0)


class ParameterSearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[ParameterResponse]
    facets: Dict[str, Dict[str, int]]  # category -> {value: count}
    search_time: float


# Audit and History Schemas
class ParameterAuditLog(BaseModel):
    id: int
    parameter_id: int
    action: str  # "created", "updated", "deleted", "value_changed"
    old_value: Optional[Dict[str, Any]] = None
    new_value: Optional[Dict[str, Any]] = None
    changed_by_id: int
    changed_at: datetime
    change_reason: Optional[str] = None
    ip_address: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ParameterHistoryResponse(BaseModel):
    parameter_id: int
    total_changes: int
    history: List[ParameterAuditLog]
    timeline_summary: Dict[str, Any]


# Statistics and Analytics Schemas
class ParameterStatistics(BaseModel):
    total_parameters: int
    by_category: Dict[ParameterCategory, int]
    by_type: Dict[ParameterType, int]
    by_sensitivity: Dict[SensitivityLevel, int]
    most_changed_parameters: List[Dict[str, Any]]
    dependency_statistics: Dict[str, int]


class ParameterAnalyticsResponse(BaseModel):
    file_id: Optional[int] = None
    scenario_id: Optional[int] = None
    statistics: ParameterStatistics
    trends: Dict[str, Any]
    recommendations: List[str]
    data_quality_score: float
