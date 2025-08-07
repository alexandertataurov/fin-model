from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    JSON,
    ForeignKey,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship, synonym
from sqlalchemy.sql import func
import enum
from app.models.base import Base


class ReportType(enum.Enum):
    """Types of reports that can be generated."""

    FINANCIAL_SUMMARY = "financial_summary"
    PROFIT_LOSS = "profit_loss"
    BALANCE_SHEET = "balance_sheet"
    CASH_FLOW = "cash_flow"
    CUSTOM = "custom"


class ExportFormat(enum.Enum):
    """Supported export formats."""

    PDF = "pdf"
    EXCEL = "excel"
    CSV = "csv"
    PNG = "png"
    SVG = "svg"
    JSON = "json"


class ReportStatus(enum.Enum):
    """Status of report generation."""

    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ReportTemplate(Base):
    """Report template definition."""

    __tablename__ = "report_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    title = synonym("name")
    description = Column(Text)
    report_type = Column(SQLEnum(ReportType), nullable=False)
    is_system = Column(Boolean, default=False)  # System templates vs user-created
    is_active = Column(Boolean, default=True)

    # Template configuration
    template_config = Column(JSON)  # Layout, sections, styling configuration
    branding_config = Column(JSON)  # Logo, colors, company info

    # Ownership
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_id = synonym("created_by")

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    creator = relationship("User", back_populates="report_templates")
    reports = relationship("ReportExport", back_populates="template")
    collaborations = relationship("ReportCollaboration", back_populates="template")
    edits = relationship("ReportEdit", back_populates="template")
    ai_insights = relationship("AIInsight", back_populates="template")


class ReportSchedule(Base):
    """Scheduled report generation."""

    __tablename__ = "report_schedules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)

    # Schedule configuration
    cron_expression = Column(String(100), nullable=False)  # Cron-like schedule
    is_active = Column(Boolean, default=True)

    # Report configuration
    template_id = Column(Integer, ForeignKey("report_templates.id"), nullable=False)
    export_format = Column(SQLEnum(ExportFormat), default=ExportFormat.PDF)
    report_config = Column(JSON)  # Dynamic data filters, parameters

    # Delivery configuration
    email_recipients = Column(JSON)  # List of email addresses
    delivery_config = Column(JSON)  # Email subject, body template, etc.

    # Ownership
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Status tracking
    last_run_at = Column(DateTime(timezone=True))
    next_run_at = Column(DateTime(timezone=True))
    run_count = Column(Integer, default=0)
    failure_count = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    template = relationship("ReportTemplate")
    creator = relationship("User", back_populates="report_schedules")
    exports = relationship("ReportExport", back_populates="schedule")


class ReportExport(Base):
    """Individual report generation/export record."""

    __tablename__ = "report_exports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    title = synonym("name")
    export_format = Column(SQLEnum(ExportFormat), nullable=False)
    status = Column(SQLEnum(ReportStatus), default=ReportStatus.PENDING)

    # File information
    file_path = Column(String(500))  # Path to generated file
    file_size = Column(Integer)  # File size in bytes
    file_url = Column(String(500))  # Public URL for download (if applicable)

    # Generation configuration
    template_id = Column(Integer, ForeignKey("report_templates.id"))
    schedule_id = Column(Integer, ForeignKey("report_schedules.id"), nullable=True)
    generation_config = Column(JSON)  # Parameters used for generation

    # Source data information
    source_file_ids = Column(JSON)  # List of file IDs used as data source
    data_period_start = Column(DateTime(timezone=True))
    data_period_end = Column(DateTime(timezone=True))

    # Processing information
    processing_started_at = Column(DateTime(timezone=True))
    processing_completed_at = Column(DateTime(timezone=True))
    processing_duration_seconds = Column(Integer)
    error_message = Column(Text)

    # Ownership and sharing
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_id = synonym("created_by")
    is_shared = Column(Boolean, default=False)
    shared_with = Column(JSON)  # List of user IDs with access

    # Expiration
    expires_at = Column(DateTime(timezone=True))

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    template = relationship("ReportTemplate", back_populates="reports")
    schedule = relationship("ReportSchedule", back_populates="exports")
    creator = relationship("User", back_populates="report_exports")
