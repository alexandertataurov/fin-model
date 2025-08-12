from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
from uuid import UUID
import logging

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func

from ..models.notification import (
    Notification,
    NotificationPreferences,
    NotificationType,
    NotificationPriority,
)
from ..schemas.notification import (
    NotificationCreate,
    NotificationUpdate,
    NotificationResponse,
    NotificationPreferences as NotificationPreferencesSchema,
    NotificationPreferencesUpdate,
    NotificationStats,
)

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for managing notifications and user preferences."""

    def __init__(self, db: Session):
        self.db = db

    def get_user_notifications(
        self,
        user_id: int,
        page: int = 1,
        limit: int = 20,
        filters: Optional[List] = None,
    ) -> Tuple[List[NotificationResponse], int, int]:
        """Get user notifications with pagination."""
        query = self.db.query(Notification)

        # Apply filters
        if filters:
            for filter_condition in filters:
                query = query.filter(filter_condition)
        else:
            query = query.filter(Notification.user_id == user_id)

        # Get total count
        total_count = query.count()

        # Calculate pagination
        offset = (page - 1) * limit
        total_pages = (total_count + limit - 1) // limit

        # Get paginated results
        notifications = (
            query.order_by(desc(Notification.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )

        # Convert to response models
        notification_responses = [
            NotificationResponse.model_validate(notification)
            for notification in notifications
        ]

        return notification_responses, total_count, total_pages

    def get_notification(
        self, notification_id: UUID, user_id: int
    ) -> Optional[NotificationResponse]:
        """Get a specific notification for a user."""
        notification = (
            self.db.query(Notification)
            .filter(
                and_(
                    Notification.id == notification_id,
                    Notification.user_id == user_id,
                )
            )
            .first()
        )

        if notification:
            return NotificationResponse.model_validate(notification)
        return None

    def mark_as_read(self, notification_id: UUID, user_id: int) -> bool:
        """Mark a notification as read."""
        notification = (
            self.db.query(Notification)
            .filter(
                and_(
                    Notification.id == notification_id,
                    Notification.user_id == user_id,
                )
            )
            .first()
        )

        if notification:
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            self.db.commit()
            return True
        return False

    def dismiss_notification(self, notification_id: UUID, user_id: int) -> bool:
        """Dismiss a notification."""
        notification = (
            self.db.query(Notification)
            .filter(
                and_(
                    Notification.id == notification_id,
                    Notification.user_id == user_id,
                )
            )
            .first()
        )

        if notification:
            notification.is_dismissed = True
            notification.dismissed_at = datetime.utcnow()
            self.db.commit()
            return True
        return False

    def mark_all_as_read(self, user_id: int) -> int:
        """Mark all user notifications as read."""
        result = (
            self.db.query(Notification)
            .filter(
                and_(
                    Notification.user_id == user_id,
                    Notification.is_read.is_(False),
                )
            )
            .update(
                {
                    Notification.is_read: True,
                    Notification.read_at: datetime.utcnow(),
                }
            )
        )
        self.db.commit()
        return result

    def get_unread_count(self, user_id: int) -> int:
        """Get count of unread notifications for a user."""
        return (
            self.db.query(Notification)
            .filter(
                and_(
                    Notification.user_id == user_id,
                    Notification.is_read.is_(False),
                )
            )
            .count()
        )

    def get_user_preferences(
        self, user_id: int
    ) -> Optional[NotificationPreferencesSchema]:
        """Get user notification preferences."""
        preferences = (
            self.db.query(NotificationPreferences)
            .filter(NotificationPreferences.user_id == user_id)
            .first()
        )

        if preferences:
            return NotificationPreferencesSchema.model_validate(preferences)
        return None

    def create_default_preferences(self, user_id: int) -> NotificationPreferencesSchema:
        """Create default notification preferences for a user."""
        preferences = NotificationPreferences(
            user_id=user_id,
            email_enabled=True,
            push_enabled=True,
            in_app_enabled=True,
            quiet_hours_enabled=False,
            quiet_start_time="22:00",
            quiet_end_time="08:00",
            quiet_timezone="UTC",
            type_preferences={},
            min_priority_email=NotificationPriority.NORMAL,
            min_priority_push=NotificationPriority.HIGH,
            min_priority_in_app=NotificationPriority.LOW,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        self.db.add(preferences)
        self.db.commit()
        self.db.refresh(preferences)

        return NotificationPreferencesSchema.model_validate(preferences)

    def update_user_preferences(
        self,
        user_id: int,
        preferences_update: NotificationPreferencesUpdate,
    ) -> NotificationPreferencesSchema:
        """Update user notification preferences."""
        preferences = (
            self.db.query(NotificationPreferences)
            .filter(NotificationPreferences.user_id == user_id)
            .first()
        )

        if not preferences:
            # Create preferences if they don't exist
            return self.create_default_preferences(user_id)

        # Update fields
        update_data = preferences_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(preferences, field, value)

        preferences.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(preferences)

        return NotificationPreferencesSchema.model_validate(preferences)

    def get_user_stats(self, user_id: int) -> NotificationStats:
        """Get notification statistics for a user."""
        # Get total notifications
        total_notifications = (
            self.db.query(Notification).filter(Notification.user_id == user_id).count()
        )

        # Get unread notifications
        unread_notifications = (
            self.db.query(Notification)
            .filter(
                and_(
                    Notification.user_id == user_id,
                    Notification.is_read.is_(False),
                )
            )
            .count()
        )

        # Get notifications by type
        type_stats = (
            self.db.query(
                Notification.notification_type,
                func.count(Notification.id).label("count"),
            )
            .filter(Notification.user_id == user_id)
            .group_by(Notification.notification_type)
            .all()
        )

        # Get notifications by priority
        priority_stats = (
            self.db.query(
                Notification.priority,
                func.count(Notification.id).label("count"),
            )
            .filter(Notification.user_id == user_id)
            .group_by(Notification.priority)
            .all()
        )

        # Get recent activity (last 7 days)
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_notifications = (
            self.db.query(Notification)
            .filter(
                and_(
                    Notification.user_id == user_id,
                    Notification.created_at >= week_ago,
                )
            )
            .count()
        )

        return NotificationStats(
            total_notifications=total_notifications,
            unread_notifications=unread_notifications,
            recent_notifications=recent_notifications,
            type_distribution={
                stat.notification_type: stat.count for stat in type_stats
            },
            priority_distribution={
                stat.priority: stat.count for stat in priority_stats
            },
        )

    def get_notification_types(self) -> List[Dict[str, Any]]:
        """Get available notification types."""
        return [
            {
                "type": NotificationType.SYSTEM_UPDATE,
                "name": "System Updates",
                "description": "System maintenance and updates",
            },
            {
                "type": NotificationType.FILE_PROCESSED,
                "name": "File Processing",
                "description": "File upload and processing status",
            },
            {
                "type": NotificationType.REPORT_READY,
                "name": "Report Ready",
                "description": "Report generation completed",
            },
            {
                "type": NotificationType.ERROR_ALERT,
                "name": "Error Alerts",
                "description": "System errors and warnings",
            },
            {
                "type": NotificationType.SECURITY_ALERT,
                "name": "Security Alerts",
                "description": "Security-related notifications",
            },
        ]

    def create_notification(
        self, notification_create: NotificationCreate
    ) -> NotificationResponse:
        """Create a new notification."""
        notification = Notification(
            user_id=notification_create.user_id,
            notification_type=notification_create.notification_type,
            title=notification_create.title,
            message=notification_create.message,
            priority=notification_create.priority,
            data=notification_create.data or {},
            created_at=datetime.utcnow(),
        )

        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)

        return NotificationResponse.model_validate(notification)

    def delete_notification(self, notification_id: UUID) -> bool:
        """Delete a notification (admin only)."""
        notification = (
            self.db.query(Notification)
            .filter(Notification.id == notification_id)
            .first()
        )

        if notification:
            self.db.delete(notification)
            self.db.commit()
            return True
        return False


# Global notification service instance
notification_service = NotificationService(None)
