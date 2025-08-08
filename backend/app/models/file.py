from datetime import datetime
from enum import Enum
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text,
    BigInteger,
    Boolean,
)
from sqlalchemy.orm import relationship, synonym
from sqlalchemy.sql import func

from app.models.base import Base


class FileStatus(str, Enum):
    """File processing status enum."""

    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class FileType(str, Enum):
    """Supported file types."""

    EXCEL = "excel"
    CSV = "csv"


class UploadedFile(Base):
    """Model for uploaded files metadata."""

    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=True)
    stored_filename = Column(String(255), unique=True, nullable=True)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    file_size = Column(BigInteger, nullable=False)
    file_type = Column(String(50), nullable=True)
    mime_type = Column(String(100), nullable=True)
    upload_date = Column(DateTime, default=datetime.utcnow)

    # Processing status
    # Persist the enum's string value to the database
    status = Column(String(50), default=FileStatus.UPLOADED.value, nullable=False)
    processing_status = synonym("status")
    processing_started_at = Column(DateTime, nullable=True)
    processing_completed_at = Column(DateTime, nullable=True)

    # Validation and parsing results
    is_valid = Column(Boolean, default=None, nullable=True)
    validation_errors = Column(Text, nullable=True)
    parsed_data = Column(Text, nullable=True)  # JSON string of parsed data

    # Foreign Keys
    # Connect each file to its owning user. This satisfies the User.uploaded_files
    # back-populated relationship required in tests.
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    # Older parts of the codebase reference ``uploaded_by_id``. Provide a
    # synonym so both attribute names work without affecting the ORM mapping.
    uploaded_by_id = synonym("user_id")
    template_id = Column(Integer, ForeignKey("templates.id"), nullable=True)
    data_source_id = Column(Integer, ForeignKey("data_sources.id"), nullable=True)

    # Relationships
    user = relationship("User", back_populates="uploaded_files")
    parameters = relationship("Parameter", back_populates="source_file")
    scenarios = relationship("Scenario", back_populates="base_file")
    template = relationship("Template", back_populates="uploaded_files")
    data_source = relationship("DataSource", back_populates="uploaded_files")
    versions = relationship("FileVersion", back_populates="uploaded_file")

    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    def __repr__(self):
        return f"<UploadedFile(id={self.id}, filename='{self.filename}', status='{self.status}')>"


class ProcessingLog(Base):
    """Model for tracking file processing logs."""

    __tablename__ = "processing_logs"

    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("uploaded_files.id"), nullable=False)

    # Log details
    step = Column(String(100), nullable=False)  # validation, parsing, extraction, etc.
    message = Column(Text, nullable=False)
    level = Column(String(20), default="info", nullable=False)  # info, warning, error
    details = Column(Text, nullable=True)  # JSON string with additional details

    # Timing
    timestamp = Column(DateTime, default=func.now(), nullable=False)

    # Relationships
    file = relationship("UploadedFile", backref="processing_logs")

    def __repr__(self):
        return f"<ProcessingLog(id={self.id}, file_id={self.file_id}, step='{self.step}', level='{self.level}')>"
