from typing import Dict, List, Any, Optional, Union
from datetime import datetime
from enum import Enum
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship, synonym
from sqlalchemy.ext.declarative import declarative_base

from app.models.base import Base


class ParameterType(str, Enum):
    """Types of financial parameters."""
    
    # Growth and Rate Parameters
    GROWTH_RATE = "growth_rate"
    DISCOUNT_RATE = "discount_rate"
    INFLATION_RATE = "inflation_rate"
    INTEREST_RATE = "interest_rate"
    TAX_RATE = "tax_rate"
    
    # Financial Assumptions
    REVENUE_ASSUMPTION = "revenue_assumption"
    COST_ASSUMPTION = "cost_assumption"
    MARGIN_ASSUMPTION = "margin_assumption"
    RATIO_ASSUMPTION = "ratio_assumption"
    
    # Operational Parameters
    VOLUME = "volume"
    PRICE = "price"
    QUANTITY = "quantity"
    PERCENTAGE = "percentage"
    CURRENCY = "currency"
    
    # Time-based Parameters
    PERIOD = "period"
    FREQUENCY = "frequency"
    
    # Other
    CONSTANT = "constant"
    VARIABLE = "variable"
    CALCULATED = "calculated"


class ParameterCategory(str, Enum):
    """Categories for grouping parameters."""
    
    REVENUE = "revenue"
    COSTS = "costs"
    OPERATIONS = "operations"
    FINANCIAL = "financial"
    MARKET = "market"
    REGULATORY = "regulatory"
    ASSUMPTIONS = "assumptions"
    CALCULATED = "calculated"
    CONFIDENTIAL = "confidential"
    TEST = "test"  # Used in tests


class SensitivityLevel(str, Enum):
    """Sensitivity levels for parameters."""
    
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Parameter(Base):
    """Model for financial parameters extracted from Excel."""
    
    __tablename__ = "parameters"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Information
    name = Column(String(255), nullable=False, index=True)
    display_name = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    
    # Classification
    parameter_type = Column(String(50), nullable=False, index=True, default=ParameterType.GROWTH_RATE.value)
    category = Column(String(50), nullable=False, index=True, default=ParameterCategory.ASSUMPTIONS.value)
    sensitivity_level = Column(String(20), nullable=False, default=SensitivityLevel.MEDIUM)
    
    # Value Information
    value = Column(Float, nullable=False)
    current_value = Column(Float, nullable=True)
    default_value = Column(Float, nullable=True)
    min_value = Column(Float, nullable=True)
    max_value = Column(Float, nullable=True)
    unit = Column(String(50), nullable=True)
    format_type = Column(String(50), nullable=False, default="number")  # number, percentage, currency
    
    # Excel Source Information
    source_file_id = Column(Integer, ForeignKey("uploaded_files.id"), nullable=True)
    source_sheet = Column(String(255), nullable=True)
    source_cell = Column(String(20), nullable=True)  # e.g., "A1", "B5"
    source_range = Column(String(50), nullable=True)  # e.g., "A1:B10"
    
    # Dependencies and Relationships
    depends_on = Column(JSON, nullable=True)  # List of parameter IDs this depends on
    affects = Column(JSON, nullable=True)  # List of parameter IDs this affects
    formula = Column(Text, nullable=True)  # Excel formula if this is calculated
    
    # Validation Rules
    validation_rules = Column(JSON, nullable=True)
    is_required = Column(Boolean, default=True)
    is_editable = Column(Boolean, default=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_id = synonym("created_by_id")
    data_source_id = Column(Integer, ForeignKey("data_sources.id"), nullable=True)
    
    # Relationships
    source_file = relationship("UploadedFile", back_populates="parameters")
    created_by = relationship("User", back_populates="parameters")
    parameter_values = relationship("ParameterValue", back_populates="parameter")
    data_source = relationship("DataSource", back_populates="parameters")
    

class Scenario(Base):
    """Model for financial modeling scenarios."""
    
    __tablename__ = "scenarios"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Information
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Scenario Properties
    is_baseline = Column(Boolean, default=False)
    is_template = Column(Boolean, default=False)
    status = Column(String(50), default="draft")  # draft, active, archived
    
    # Version Control
    version = Column(String(50), nullable=False, default="1.0")
    parent_scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=True)
    
    # Model Association
    base_file_id = Column(Integer, ForeignKey("uploaded_files.id"), nullable=False)
    
    # Calculation Results
    last_calculated_at = Column(DateTime, nullable=True)
    calculation_status = Column(String(50), default="pending")  # pending, calculating, completed, error
    calculation_results = Column(JSON, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    base_file = relationship("UploadedFile", back_populates="scenarios")
    created_by = relationship("User", back_populates="scenarios")
    parameter_values = relationship("ParameterValue", back_populates="scenario")
    parent_scenario = relationship("Scenario", remote_side=[id])
    child_scenarios = relationship("Scenario", back_populates="parent_scenario")
    financial_statements = relationship("FinancialStatement", back_populates="scenario")
    metrics = relationship("Metric", back_populates="scenario")
    time_series = relationship("TimeSeries", back_populates="scenario")
    calculations = relationship("Calculation", back_populates="scenario")


class ParameterValue(Base):
    """Model for parameter values in specific scenarios."""
    
    __tablename__ = "parameter_values"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # References
    parameter_id = Column(Integer, ForeignKey("parameters.id"), nullable=False)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)
    
    # Value Information
    value = Column(Float, nullable=False)
    original_value = Column(Float, nullable=True)  # Value before modification
    
    # Change Tracking
    change_reason = Column(String(255), nullable=True)
    changed_at = Column(DateTime, default=datetime.utcnow)
    changed_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Validation
    is_valid = Column(Boolean, default=True)
    validation_errors = Column(JSON, nullable=True)
    
    # Relationships
    parameter = relationship("Parameter", back_populates="parameter_values")
    scenario = relationship("Scenario", back_populates="parameter_values")
    changed_by = relationship("User")


class FormulaNode(Base):
    """Model for formula dependency tracking."""
    
    __tablename__ = "formula_nodes"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Node Information
    cell_reference = Column(String(50), nullable=False)  # e.g., "Sheet1!A1"
    formula = Column(Text, nullable=True)
    value = Column(Float, nullable=True)
    data_type = Column(String(50), default="number")  # number, text, boolean, error
    
    # File Association
    file_id = Column(Integer, ForeignKey("uploaded_files.id"), nullable=False)
    sheet_name = Column(String(255), nullable=False)
    
    # Dependencies
    depends_on_cells = Column(JSON, nullable=True)  # List of cell references
    referenced_by_cells = Column(JSON, nullable=True)  # List of cell references
    
    # Parameter Association
    parameter_id = Column(Integer, ForeignKey("parameters.id"), nullable=True)
    
    # Calculation Properties
    calculation_order = Column(Integer, nullable=True)
    is_circular = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    file = relationship("UploadedFile")
    parameter = relationship("Parameter")


class SensitivityAnalysis(Base):
    """Model for sensitivity analysis results."""
    
    __tablename__ = "sensitivity_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Analysis Information
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    analysis_type = Column(String(50), nullable=False)  # tornado, spider, monte_carlo
    
    # References
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)
    target_parameter_id = Column(Integer, ForeignKey("parameters.id"), nullable=False)
    
    # Analysis Configuration
    input_parameters = Column(JSON, nullable=False)  # List of parameter IDs and ranges
    analysis_config = Column(JSON, nullable=True)  # Additional configuration
    
    # Results
    results = Column(JSON, nullable=True)
    chart_data = Column(JSON, nullable=True)
    summary_statistics = Column(JSON, nullable=True)
    
    # Status
    status = Column(String(50), default="pending")  # pending, running, completed, error
    error_message = Column(Text, nullable=True)
    
    # Performance
    execution_time = Column(Float, nullable=True)
    iterations = Column(Integer, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    scenario = relationship("Scenario")
    target_parameter = relationship("Parameter")
    created_by = relationship("User")


class CalculationAudit(Base):
    """Model for tracking calculation history and performance."""
    
    __tablename__ = "calculation_audits"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Calculation Information
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)
    calculation_type = Column(String(50), nullable=False)  # full, incremental, parameter_change
    
    # Trigger Information
    triggered_by = Column(String(50), nullable=False)  # user, system, scheduled
    trigger_details = Column(JSON, nullable=True)
    
    # Performance Metrics
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)
    execution_time = Column(Float, nullable=True)  # seconds
    cells_calculated = Column(Integer, nullable=True)
    formulas_evaluated = Column(Integer, nullable=True)
    
    # Results
    status = Column(String(50), nullable=False)  # success, error, cancelled
    error_message = Column(Text, nullable=True)
    warnings = Column(JSON, nullable=True)
    
    # Changes Made
    parameters_changed = Column(JSON, nullable=True)
    cells_affected = Column(JSON, nullable=True)
    
    # Metadata
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    scenario = relationship("Scenario")
    created_by = relationship("User") 