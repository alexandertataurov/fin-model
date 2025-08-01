from datetime import datetime, date
from enum import Enum
from typing import Dict, List, Any, Optional
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Text,
    Boolean,
    ForeignKey,
    JSON,
    Date,
    BigInteger,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

from app.models.base import Base


class StatementType(str, Enum):
    """Types of financial statements."""

    PROFIT_LOSS = "PROFIT_LOSS"
    BALANCE_SHEET = "BALANCE_SHEET"
    CASH_FLOW = "CASH_FLOW"
    STATEMENT_OF_EQUITY = "STATEMENT_OF_EQUITY"


class PeriodType(str, Enum):
    """Period types for financial statements."""

    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    YEARLY = "YEARLY"
    CUSTOM = "CUSTOM"


class MetricType(str, Enum):
    """Types of financial metrics."""

    RATIO = "RATIO"
    PERCENTAGE = "PERCENTAGE"
    CURRENCY = "CURRENCY"
    COUNT = "COUNT"
    DAYS = "DAYS"


class Frequency(str, Enum):
    """Data frequency for time series."""

    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    YEARLY = "YEARLY"


class CalculationType(str, Enum):
    """Types of calculations."""

    FORMULA = "FORMULA"
    AGGREGATION = "AGGREGATION"
    RATIO = "RATIO"
    TREND = "TREND"
    FORECAST = "FORECAST"


class TemplateType(str, Enum):
    """Types of file templates."""

    EXCEL = "EXCEL"
    CSV = "CSV"
    JSON = "JSON"
    CUSTOM = "CUSTOM"


class ChangeType(str, Enum):
    """Types of file changes."""

    INITIAL = "INITIAL"
    UPDATE = "UPDATE"
    CORRECTION = "CORRECTION"
    REPROCESSING = "REPROCESSING"


class SourceType(str, Enum):
    """Types of data sources."""

    FILE_UPLOAD = "FILE_UPLOAD"
    API = "API"
    DATABASE = "DATABASE"
    MANUAL_ENTRY = "MANUAL_ENTRY"
    CALCULATION = "CALCULATION"


class FinancialStatement(Base):
    """Model for financial statements (P&L, Balance Sheet, Cash Flow)."""

    __tablename__ = "financial_statements"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)
    statement_type = Column(String(50), nullable=False)  # StatementType enum

    # Period information
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    period_type = Column(String(50), nullable=False)  # PeriodType enum

    # Financial data
    currency = Column(String(3), nullable=False)  # ISO currency code
    line_items = Column(JSON, nullable=False)  # JSON structure of financial line items
    raw_data = Column(JSON, nullable=True)  # Original extracted data
    calculated_data = Column(JSON, nullable=True)  # Derived calculations

    # Version control
    version = Column(Integer, nullable=False, default=1)
    is_baseline = Column(Boolean, nullable=False, default=False)
    notes = Column(Text, nullable=True)

    # Metadata
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    scenario = relationship("Scenario", back_populates="financial_statements")
    created_by = relationship("User")


class Metric(Base):
    """Model for calculated financial ratios and KPIs."""

    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)

    # Metric identification
    metric_name = Column(String(255), nullable=False, index=True)
    metric_category = Column(
        String(100), nullable=False, index=True
    )  # profitability, liquidity, efficiency, etc.
    metric_type = Column(String(50), nullable=False)  # MetricType enum

    # Value and period
    value = Column(Float, nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    currency = Column(String(3), nullable=True)

    # Calculation details
    calculation_formula = Column(Text, nullable=True)
    benchmark_value = Column(Float, nullable=True)
    industry_average = Column(Float, nullable=True)
    calculation_metadata = Column(JSON, nullable=True)

    # Metadata
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    scenario = relationship("Scenario", back_populates="metrics")
    created_by = relationship("User")


class TimeSeries(Base):
    """Model for historical financial data tracking."""

    __tablename__ = "time_series"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)

    # Data identification
    data_type = Column(
        String(100), nullable=False, index=True
    )  # revenue, expenses, cash_flow, etc.
    data_subtype = Column(String(100), nullable=True)  # product_line, department, etc.

    # Time and value
    period_date = Column(Date, nullable=False, index=True)
    value = Column(Float, nullable=False)
    currency = Column(String(3), nullable=False)
    frequency = Column(String(50), nullable=False)  # Frequency enum

    # Data quality and source
    data_source = Column(String(100), nullable=True)
    confidence_level = Column(Float, nullable=True)  # 0.0 to 1.0
    is_actual = Column(Boolean, nullable=False, default=True)  # actual vs projected
    is_adjusted = Column(Boolean, nullable=False, default=False)
    adjustment_reason = Column(Text, nullable=True)
    data_metadata = Column(JSON, nullable=True)

    # Metadata
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    scenario = relationship("Scenario", back_populates="time_series")
    created_by = relationship("User")


class Calculation(Base):
    """Model for formula dependencies and calculation chains."""

    __tablename__ = "calculations"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)

    # Calculation definition
    calculation_name = Column(String(255), nullable=False, index=True)
    calculation_type = Column(String(50), nullable=False)  # CalculationType enum
    formula = Column(Text, nullable=False)

    # Dependencies and outputs
    input_parameters = Column(
        JSON, nullable=False
    )  # Array of parameter IDs and constants
    output_parameters = Column(
        JSON, nullable=False
    )  # Array of parameter IDs this calculation produces
    dependencies = Column(
        JSON, nullable=True
    )  # Array of calculation IDs this depends on
    execution_order = Column(Integer, nullable=False, index=True)

    # Configuration
    is_active = Column(Boolean, nullable=False, default=True)
    error_handling = Column(JSON, nullable=True)
    validation_rules = Column(JSON, nullable=True)

    # Execution tracking
    last_executed_at = Column(DateTime, nullable=True)
    execution_time_ms = Column(Integer, nullable=True)

    # Metadata
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    scenario = relationship("Scenario", back_populates="calculations")
    created_by = relationship("User")


class Template(Base):
    """Model for Excel template definitions and mappings."""

    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)

    # Template identification
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    template_type = Column(String(50), nullable=False, index=True)  # TemplateType enum

    # Template structure
    file_structure = Column(JSON, nullable=False)  # Defines expected file structure
    mapping_rules = Column(JSON, nullable=False)  # How to map file data to database
    validation_rules = Column(JSON, nullable=True)
    transformation_rules = Column(JSON, nullable=True)

    # Template metadata
    sample_file_path = Column(String(500), nullable=True)
    version = Column(String(50), nullable=False, default="1.0")
    is_system_template = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    usage_count = Column(Integer, nullable=False, default=0)

    # Metadata
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    created_by = relationship("User")
    uploaded_files = relationship("UploadedFile", back_populates="template")


class FileVersion(Base):
    """Model for file history tracking and versioning."""

    __tablename__ = "file_versions"

    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("uploaded_files.id"), nullable=False)

    # Version information
    version_number = Column(Integer, nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    file_hash = Column(String(64), nullable=False, index=True)  # SHA-256 hash

    # Change tracking
    change_description = Column(Text, nullable=True)
    change_type = Column(String(50), nullable=False)  # ChangeType enum
    processing_metadata = Column(JSON, nullable=True)
    is_current = Column(Boolean, nullable=False, default=False, index=True)

    # Metadata
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    # Relationships
    uploaded_file = relationship("UploadedFile", back_populates="versions")
    created_by = relationship("User")

    __table_args__ = (
        UniqueConstraint("file_id", "version_number", name="unique_file_version"),
    )


class DataSource(Base):
    """Model for data lineage and source tracking."""

    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)

    # Source identification
    source_name = Column(String(255), nullable=False, index=True)
    source_type = Column(String(50), nullable=False, index=True)  # SourceType enum
    source_identifier = Column(
        String(500), nullable=False
    )  # file ID, API endpoint, etc.

    # Data quality and lineage
    data_lineage = Column(JSON, nullable=True)  # Track data transformation chain
    quality_metrics = Column(JSON, nullable=True)  # Data quality scores

    # Update and connection info
    refresh_frequency = Column(String(50), nullable=True)
    last_updated = Column(DateTime, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    connection_config = Column(JSON, nullable=True)
    validation_config = Column(JSON, nullable=True)

    # Metadata
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    created_by = relationship("User")
    uploaded_files = relationship("UploadedFile", back_populates="data_source")
    parameters = relationship("Parameter", back_populates="data_source")
