from sqlalchemy import Column, String, Text, Boolean, DateTime, Enum as SQLEnum, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
import enum

from .base import Base


class NotificationType(enum.Enum):
    """Types of notifications supported by the system"""
    REPORT_READY = "report_ready"
    FILE_PROCESSED = "file_processed"
    ERROR_ALERT = "error_alert"
    SYSTEM_UPDATE = "system_update"
    COLLABORATION_INVITE = "collaboration_invite"
    DATA_QUALITY_ISSUE = "data_quality_issue"
    SCHEDULED_REPORT = "scheduled_report"
    PARAMETER_CHANGE = "parameter_change"
    CALCULATION_COMPLETE = "calculation_complete"
    DEADLINE_REMINDER = "deadline_reminder"
    SECURITY_ALERT = "security_alert"


class NotificationPriority(enum.Enum):
    """Priority levels for notifications"""
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class NotificationStatus(enum.Enum):
    """Status of notification delivery"""
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    FAILED = "failed"
    READ = "read"
    DISMISSED = "dismissed"


class Notification(Base):
    """
    Model for storing user notifications
    
    Supports real-time notifications via WebSocket and persistent storage
    for notification history and management.
    """
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Notification content
    type = Column(SQLEnum(NotificationType), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    data = Column(JSON, default={})  # Additional context data
    
    # Notification properties
    priority = Column(SQLEnum(NotificationPriority), default=NotificationPriority.NORMAL, index=True)
    status = Column(SQLEnum(NotificationStatus), default=NotificationStatus.PENDING, index=True)
    
    # State tracking
    is_read = Column(Boolean, default=False, index=True)
    is_dismissed = Column(Boolean, default=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    sent_at = Column(DateTime)
    delivered_at = Column(DateTime)
    read_at = Column(DateTime)
    dismissed_at = Column(DateTime)
    expires_at = Column(DateTime, index=True)  # Optional expiration
    
    # Delivery tracking
    delivery_attempts = Column(String(50), default=0)
    last_delivery_attempt = Column(DateTime)
    delivery_error = Column(Text)
    
    # Relationships
    user = relationship("User", back_populates="notifications")
    
    def __repr__(self):
        return f"<Notification(id={self.id}, type={self.type.value}, user_id={self.user_id})>"
    
    @property
    def is_expired(self) -> bool:
        """Check if notification has expired"""
        if not self.expires_at:
            return False
        return datetime.utcnow() > self.expires_at
    
    @property
    def age_minutes(self) -> int:
        """Get notification age in minutes"""
        return int((datetime.utcnow() - self.created_at).total_seconds() / 60)
    
    def mark_as_read(self) -> None:
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = datetime.utcnow()
            if self.status == NotificationStatus.DELIVERED:
                self.status = NotificationStatus.READ
    
    def mark_as_dismissed(self) -> None:
        """Mark notification as dismissed"""
        if not self.is_dismissed:
            self.is_dismissed = True
            self.dismissed_at = datetime.utcnow()
            if self.status in [NotificationStatus.DELIVERED, NotificationStatus.READ]:
                self.status = NotificationStatus.DISMISSED
    
    def mark_as_sent(self) -> None:
        """Mark notification as sent"""
        self.status = NotificationStatus.SENT
        self.sent_at = datetime.utcnow()
    
    def mark_as_delivered(self) -> None:
        """Mark notification as delivered"""
        self.status = NotificationStatus.DELIVERED
        self.delivered_at = datetime.utcnow()
    
    def mark_as_failed(self, error_message: str = None) -> None:
        """Mark notification delivery as failed"""
        self.status = NotificationStatus.FAILED
        self.delivery_error = error_message
        self.last_delivery_attempt = datetime.utcnow()
        self.delivery_attempts += 1


class NotificationPreference(Base):
    """
    User preferences for notification delivery and types
    """
    __tablename__ = "notification_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    
    # Delivery preferences
    email_enabled = Column(Boolean, default=True)
    push_enabled = Column(Boolean, default=True)
    in_app_enabled = Column(Boolean, default=True)
    
    # Quiet hours
    quiet_hours_enabled = Column(Boolean, default=False)
    quiet_start_time = Column(String(5))  # HH:MM format
    quiet_end_time = Column(String(5))    # HH:MM format
    quiet_timezone = Column(String(50), default="UTC")
    
    # Type-specific preferences (JSON with notification type as key)
    type_preferences = Column(JSON, default={})
    
    # Priority thresholds
    min_priority_email = Column(SQLEnum(NotificationPriority), default=NotificationPriority.NORMAL)
    min_priority_push = Column(SQLEnum(NotificationPriority), default=NotificationPriority.HIGH)
    min_priority_in_app = Column(SQLEnum(NotificationPriority), default=NotificationPriority.LOW)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="notification_preferences")
    
    def __repr__(self):
        return f"<NotificationPreference(user_id={self.user_id})>"
    
    def is_type_enabled(self, notification_type: NotificationType) -> bool:
        """Check if a specific notification type is enabled"""
        return self.type_preferences.get(notification_type.value, True)
    
    def should_send_email(self, priority: NotificationPriority) -> bool:
        """Check if email should be sent for given priority"""
        if not self.email_enabled:
            return False
        return priority.value >= self.min_priority_email.value
    
    def should_send_push(self, priority: NotificationPriority) -> bool:
        """Check if push notification should be sent for given priority"""
        if not self.push_enabled:
            return False
        return priority.value >= self.min_priority_push.value
    
    def should_send_in_app(self, priority: NotificationPriority) -> bool:
        """Check if in-app notification should be sent for given priority"""
        if not self.in_app_enabled:
            return False
        return priority.value >= self.min_priority_in_app.value


class NotificationTemplate(Base):
    """
    Templates for generating consistent notifications
    """
    __tablename__ = "notification_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    
    # Template identification
    name = Column(String(100), nullable=False, unique=True)
    type = Column(SQLEnum(NotificationType), nullable=False, index=True)
    
    # Template content (supports placeholders)
    title_template = Column(String(255), nullable=False)
    message_template = Column(Text, nullable=False)
    
    # Template properties
    default_priority = Column(SQLEnum(NotificationPriority), default=NotificationPriority.NORMAL)
    expires_after_hours = Column(String(50))  # Hours after which notification expires
    
    # Template metadata
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<NotificationTemplate(name={self.name}, type={self.type.value})>"
    
    def render(self, context: dict) -> tuple[str, str]:
        """
        Render template with provided context
        
        Returns:
            tuple: (rendered_title, rendered_message)
        """
        title = self.title_template
        message = self.message_template
        
        # Simple placeholder replacement
        for key, value in context.items():
            placeholder = f"{{{key}}}"
            title = title.replace(placeholder, str(value))
            message = message.replace(placeholder, str(value))
        
        return title, message