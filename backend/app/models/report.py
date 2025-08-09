"""
Report Models
Defines the data models for report templates, schedules, and exports.
"""

from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    JSON,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import relationship
from app.models.base import Base


class ReportTemplate(Base):
    """Report template configuration."""

    __tablename__ = "report_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    report_type = Column(String(50), nullable=False, index=True)
    template_config = Column(JSON, default=dict)
    branding_config = Column(JSON, default=dict)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_system = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    schedules = relationship("ReportSchedule", back_populates="template")
    exports = relationship("ReportExport", back_populates="template")


class ReportSchedule(Base):
    """Scheduled report generation."""

    __tablename__ = "report_schedules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    template_id = Column(
        Integer, ForeignKey("report_templates.id"), nullable=False, index=True
    )
    schedule = Column(String(100), nullable=False)  # Cron expression
    enabled = Column(Boolean, default=True)
    next_run = Column(DateTime, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    template = relationship("ReportTemplate", back_populates="schedules")
    exports = relationship("ReportExport", back_populates="schedule")


class ReportExport(Base):
    """Report export instances."""

    __tablename__ = "report_exports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    export_format = Column(String(20), nullable=False)  # pdf, excel, csv
    status = Column(
        String(20), default="pending", index=True
    )  # pending, processing, completed, failed
    template_id = Column(
        Integer, ForeignKey("report_templates.id"), nullable=True, index=True
    )
    schedule_id = Column(
        Integer, ForeignKey("report_schedules.id"), nullable=True, index=True
    )
    file_path = Column(String(500))
    file_size = Column(Integer)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    processing_started_at = Column(DateTime)
    processing_completed_at = Column(DateTime)
    processing_duration_seconds = Column(Integer)
    expires_at = Column(DateTime, index=True)
    error_message = Column(Text)
    custom_config = Column(JSON, default=dict)

    # Relationships
    template = relationship("ReportTemplate", back_populates="exports")
    schedule = relationship("ReportSchedule", back_populates="exports")
