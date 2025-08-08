from datetime import datetime
from typing import Optional, Dict, Any
from uuid import uuid4
from enum import Enum

from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    DateTime,
    Integer,
    JSON,
    ForeignKey,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base


class NotificationType(str, Enum):
    """Notification types enum."""

    SYSTEM_UPDATE = "SYSTEM_UPDATE"
    FILE_PROCESSED = "FILE_PROCESSED"
    REPORT_READY = "REPORT_READY"
    ERROR_ALERT = "ERROR_ALERT"
    SECURITY_ALERT = "SECURITY_ALERT"
    COLLABORATION_INVITE = "COLLABORATION_INVITE"
    DATA_QUALITY_ISSUE = "DATA_QUALITY_ISSUE"
    SCHEDULED_REPORT = "SCHEDULED_REPORT"
    PARAMETER_CHANGE = "PARAMETER_CHANGE"
    CALCULATION_COMPLETE = "CALCULATION_COMPLETE"
    DEADLINE_REMINDER = "DEADLINE_REMINDER"


class NotificationPriority(str, Enum):
    """Notification priority enum."""

    LOW = "LOW"
    NORMAL = "NORMAL"
    HIGH = "HIGH"
    URGENT = "URGENT"


class NotificationStatus(str, Enum):
    """Notification status enum."""

    PENDING = "PENDING"
    SENT = "SENT"
    DELIVERED = "DELIVERED"
    FAILED = "FAILED"
    READ = "READ"
    DISMISSED = "DISMISSED"


class Notification(Base):
    """Notification model."""

    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    notification_type = Column(String(50), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    data = Column(JSON, default={})
    priority = Column(String(20), default=NotificationPriority.NORMAL, index=True)
    status = Column(String(20), default=NotificationStatus.PENDING, index=True)
    is_read = Column(Boolean, default=False, index=True)
    is_dismissed = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    sent_at = Column(DateTime)
    delivered_at = Column(DateTime)
    read_at = Column(DateTime)
    dismissed_at = Column(DateTime)
    expires_at = Column(DateTime, index=True)
    delivery_attempts = Column(Integer, default=0)
    last_delivery_attempt = Column(DateTime)
    delivery_error = Column(Text)

    # Relationships
    user = relationship("User", back_populates="notifications")

    def __repr__(self):
        return f"<Notification(id={self.id}, type='{self.notification_type}', user_id='{self.user_id}')>"


class NotificationPreferences(Base):
    """Notification preferences model."""

    __tablename__ = "notification_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    email_enabled = Column(Boolean, default=True)
    push_enabled = Column(Boolean, default=True)
    in_app_enabled = Column(Boolean, default=True)
    quiet_hours_enabled = Column(Boolean, default=False)
    quiet_start_time = Column(String(5))  # Format: "HH:MM"
    quiet_end_time = Column(String(5))  # Format: "HH:MM"
    quiet_timezone = Column(String(50), default="UTC")
    type_preferences = Column(JSON, default={})
    min_priority_email = Column(String(20), default=NotificationPriority.NORMAL)
    min_priority_push = Column(String(20), default=NotificationPriority.HIGH)
    min_priority_in_app = Column(String(20), default=NotificationPriority.LOW)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    user = relationship("User", back_populates="notification_preferences")

    def __repr__(self):
        return f"<NotificationPreferences(user_id='{self.user_id}')>"


class NotificationTemplate(Base):
    """Notification template model."""

    __tablename__ = "notification_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(100), nullable=False, unique=True)
    notification_type = Column(String(50), nullable=False, index=True)
    title_template = Column(String(255), nullable=False)
    message_template = Column(Text, nullable=False)
    default_priority = Column(String(20), default=NotificationPriority.NORMAL)
    expires_after_hours = Column(Integer)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self):
        return f"<NotificationTemplate(name='{self.name}', type='{self.notification_type}')>"


# Create indexes for performance
Index("ix_notifications_user_created", Notification.user_id, Notification.created_at)
Index("ix_notifications_user_unread", Notification.user_id, Notification.is_read)
Index("ix_notifications_user_priority", Notification.user_id, Notification.priority)
Index("ix_notifications_expires_status", Notification.expires_at, Notification.status)
