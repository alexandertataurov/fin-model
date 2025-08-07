from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field

from ..models.notification import NotificationType, NotificationPriority


class NotificationBase(BaseModel):
    """Base notification schema."""
    title: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1, max_length=1000)
    notification_type: NotificationType
    priority: NotificationPriority = NotificationPriority.NORMAL
    data: Optional[Dict[str, Any]] = Field(default_factory=dict)


class NotificationCreate(NotificationBase):
    """Schema for creating a notification."""
    user_id: int


class NotificationUpdate(BaseModel):
    """Schema for updating a notification."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    message: Optional[str] = Field(None, min_length=1, max_length=1000)
    notification_type: Optional[NotificationType] = None
    priority: Optional[NotificationPriority] = None
    data: Optional[Dict[str, Any]] = None
    is_read: Optional[bool] = None
    is_dismissed: Optional[bool] = None


class NotificationResponse(NotificationBase):
    """Schema for notification response."""
    id: UUID
    user_id: int
    is_read: bool
    is_dismissed: bool
    created_at: datetime
    read_at: Optional[datetime] = None
    dismissed_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class NotificationListResponse(BaseModel):
    """Schema for paginated notification list response."""
    notifications: list[NotificationResponse]
    pagination: Dict[str, Any]
    unread_count: int


class NotificationPreferencesBase(BaseModel):
    """Base notification preferences schema."""
    email_enabled: bool = True
    push_enabled: bool = True
    in_app_enabled: bool = True
    quiet_hours_enabled: bool = False
    quiet_start_time: Optional[str] = Field(None, pattern=r"^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    quiet_end_time: Optional[str] = Field(None, pattern=r"^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    quiet_timezone: str = "UTC"
    type_preferences: Dict[str, bool] = Field(default_factory=dict)
    min_priority_email: NotificationPriority = NotificationPriority.NORMAL
    min_priority_push: NotificationPriority = NotificationPriority.HIGH
    min_priority_in_app: NotificationPriority = NotificationPriority.LOW


class NotificationPreferences(NotificationPreferencesBase):
    """Schema for notification preferences."""
    id: UUID
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class NotificationPreferencesUpdate(BaseModel):
    """Schema for updating notification preferences."""
    email_enabled: Optional[bool] = None
    push_enabled: Optional[bool] = None
    in_app_enabled: Optional[bool] = None
    quiet_hours_enabled: Optional[bool] = None
    quiet_start_time: Optional[str] = Field(None, pattern=r"^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    quiet_end_time: Optional[str] = Field(None, pattern=r"^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    quiet_timezone: Optional[str] = None
    type_preferences: Optional[Dict[str, bool]] = None
    min_priority_email: Optional[NotificationPriority] = None
    min_priority_push: Optional[NotificationPriority] = None
    min_priority_in_app: Optional[NotificationPriority] = None


class NotificationStats(BaseModel):
    """Schema for notification statistics."""
    total_notifications: int
    unread_notifications: int
    recent_notifications: int
    type_distribution: Dict[str, int]
    priority_distribution: Dict[str, int]
