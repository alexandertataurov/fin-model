import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func

from ..models.notification import (
    Notification,
    NotificationPreference,
    NotificationTemplate,
    NotificationType,
    NotificationPriority,
    NotificationStatus
)
from ..models.user import User
from ..core.websocket_manager import websocket_manager, ChannelType

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Service for managing notifications and real-time delivery
    
    Handles:
    - Creating and sending notifications
    - Managing user preferences  
    - Template-based notification generation
    - Real-time WebSocket delivery
    - Notification history and cleanup
    """

    def __init__(self, websocket_manager_instance=None):
        self.websocket_manager = websocket_manager_instance or websocket_manager

    async def create_notification(
        self,
        user_id: str,
        notification_type: NotificationType,
        title: str,
        message: str,
        data: Dict[str, Any] = None,
        priority: NotificationPriority = NotificationPriority.NORMAL,
        expires_at: datetime = None,
        db: Session = None
    ) -> Notification:
        """
        Create and send a notification
        
        Args:
            user_id: Target user ID
            notification_type: Type of notification
            title: Notification title
            message: Notification message
            data: Additional context data
            priority: Notification priority level
            expires_at: Optional expiration timestamp
            db: Database session
            
        Returns:
            Created notification object
        """
        try:
            # Create notification record
            notification = Notification(
                user_id=user_id,
                type=notification_type,
                title=title,
                message=message,
                data=data or {},
                priority=priority,
                expires_at=expires_at
            )

            db.add(notification)
            db.commit()
            db.refresh(notification)

            # Send real-time notification if user preferences allow
            await self._send_realtime_notification(notification, db)

            logger.info(f"Notification created and sent: {notification.id} for user {user_id}")
            return notification

        except Exception as e:
            logger.error(f"Error creating notification: {e}")
            db.rollback()
            raise

    async def create_from_template(
        self,
        user_id: str,
        template_name: str,
        context: Dict[str, Any],
        priority: NotificationPriority = None,
        db: Session = None
    ) -> Notification:
        """
        Create notification from template
        
        Args:
            user_id: Target user ID
            template_name: Name of notification template
            context: Context variables for template rendering
            priority: Optional priority override
            db: Database session
            
        Returns:
            Created notification object
        """
        # Get template
        template = db.query(NotificationTemplate).filter(
            NotificationTemplate.name == template_name,
            NotificationTemplate.is_active == True
        ).first()

        if not template:
            raise ValueError(f"Notification template '{template_name}' not found")

        # Render template
        title, message = template.render(context)
        
        # Calculate expiration
        expires_at = None
        if template.expires_after_hours:
            expires_at = datetime.utcnow() + timedelta(hours=int(template.expires_after_hours))

        # Use template priority or override
        notification_priority = priority or template.default_priority

        return await self.create_notification(
            user_id=user_id,
            notification_type=template.type,
            title=title,
            message=message,
            data=context,
            priority=notification_priority,
            expires_at=expires_at,
            db=db
        )

    async def _send_realtime_notification(self, notification: Notification, db: Session):
        """Send notification via WebSocket if user is online"""
        try:
            # Check user preferences
            preferences = self._get_user_preferences(str(notification.user_id), db)
            
            if not preferences.should_send_in_app(notification.priority):
                notification.status = NotificationStatus.SENT
                db.commit()
                return

            # Check if notification type is enabled
            if not preferences.is_type_enabled(notification.type):
                notification.status = NotificationStatus.SENT
                db.commit()
                return

            # Prepare WebSocket message
            message = {
                'type': 'notification',
                'data': {
                    'id': str(notification.id),
                    'type': notification.type.value,
                    'title': notification.title,
                    'message': notification.message,
                    'priority': notification.priority.value,
                    'created_at': notification.created_at.isoformat(),
                    'data': notification.data,
                    'expires_at': notification.expires_at.isoformat() if notification.expires_at else None
                }
            }

            # Send via WebSocket
            connections_reached = await self.websocket_manager.send_to_user(
                str(notification.user_id),
                message,
                ChannelType.NOTIFICATIONS
            )

            if connections_reached > 0:
                notification.mark_as_delivered()
                logger.info(f"Notification {notification.id} delivered to {connections_reached} connections")
            else:
                notification.mark_as_sent()
                logger.info(f"Notification {notification.id} sent but no active connections")

            db.commit()

        except Exception as e:
            logger.error(f"Error sending real-time notification {notification.id}: {e}")
            notification.mark_as_failed(str(e))
            db.commit()

    async def mark_as_read(self, notification_id: str, user_id: str, db: Session) -> bool:
        """
        Mark notification as read
        
        Args:
            notification_id: Notification ID
            user_id: User ID (for security)
            db: Database session
            
        Returns:
            True if successfully marked as read
        """
        try:
            notification = db.query(Notification).filter(
                Notification.id == notification_id,
                Notification.user_id == user_id
            ).first()

            if not notification:
                return False

            notification.mark_as_read()
            db.commit()

            # Send read confirmation via WebSocket
            await self._send_notification_update(notification, 'read', db)
            
            return True

        except Exception as e:
            logger.error(f"Error marking notification as read: {e}")
            return False

    async def mark_as_dismissed(self, notification_id: str, user_id: str, db: Session) -> bool:
        """
        Mark notification as dismissed
        
        Args:
            notification_id: Notification ID
            user_id: User ID (for security)
            db: Database session
            
        Returns:
            True if successfully dismissed
        """
        try:
            notification = db.query(Notification).filter(
                Notification.id == notification_id,
                Notification.user_id == user_id
            ).first()

            if not notification:
                return False

            notification.mark_as_dismissed()
            db.commit()

            # Send dismissal confirmation via WebSocket
            await self._send_notification_update(notification, 'dismissed', db)
            
            return True

        except Exception as e:
            logger.error(f"Error dismissing notification: {e}")
            return False

    async def bulk_mark_as_read(self, user_id: str, db: Session) -> int:
        """
        Mark all unread notifications as read for a user
        
        Args:
            user_id: User ID
            db: Database session
            
        Returns:
            Number of notifications marked as read
        """
        try:
            updated_count = db.query(Notification).filter(
                Notification.user_id == user_id,
                Notification.is_read == False
            ).update({
                'is_read': True,
                'read_at': datetime.utcnow(),
                'status': NotificationStatus.READ
            })
            
            db.commit()

            # Send bulk update via WebSocket
            if updated_count > 0:
                message = {
                    'type': 'notifications_bulk_read',
                    'data': {
                        'count': updated_count,
                        'timestamp': datetime.utcnow().isoformat()
                    }
                }
                
                await self.websocket_manager.send_to_user(
                    user_id,
                    message,
                    ChannelType.NOTIFICATIONS
                )

            logger.info(f"Marked {updated_count} notifications as read for user {user_id}")
            return updated_count

        except Exception as e:
            logger.error(f"Error bulk marking notifications as read: {e}")
            return 0

    async def _send_notification_update(self, notification: Notification, action: str, db: Session):
        """Send notification state update via WebSocket"""
        try:
            message = {
                'type': 'notification_update',
                'data': {
                    'id': str(notification.id),
                    'action': action,
                    'status': notification.status.value,
                    'timestamp': datetime.utcnow().isoformat()
                }
            }

            await self.websocket_manager.send_to_user(
                str(notification.user_id),
                message,
                ChannelType.NOTIFICATIONS
            )

        except Exception as e:
            logger.error(f"Error sending notification update: {e}")

    def get_notifications(
        self,
        user_id: str,
        page: int = 1,
        limit: int = 50,
        unread_only: bool = False,
        notification_type: NotificationType = None,
        priority: NotificationPriority = None,
        db: Session = None
    ) -> Dict[str, Any]:
        """
        Get paginated notifications for a user
        
        Args:
            user_id: User ID
            page: Page number (1-based)
            limit: Items per page
            unread_only: Filter to unread notifications only
            notification_type: Filter by notification type
            priority: Filter by priority level
            db: Database session
            
        Returns:
            Dictionary with notifications and pagination info
        """
        try:
            query = db.query(Notification).filter(Notification.user_id == user_id)

            # Apply filters
            if unread_only:
                query = query.filter(Notification.is_read == False)

            if notification_type:
                query = query.filter(Notification.type == notification_type)

            if priority:
                query = query.filter(Notification.priority == priority)

            # Remove expired notifications
            query = query.filter(
                or_(
                    Notification.expires_at.is_(None),
                    Notification.expires_at > datetime.utcnow()
                )
            )

            # Get total count
            total = query.count()

            # Apply pagination and ordering
            notifications = query.order_by(desc(Notification.created_at))\
                               .offset((page - 1) * limit)\
                               .limit(limit)\
                               .all()

            # Get unread count
            unread_count = db.query(Notification).filter(
                Notification.user_id == user_id,
                Notification.is_read == False,
                or_(
                    Notification.expires_at.is_(None),
                    Notification.expires_at > datetime.utcnow()
                )
            ).count()

            return {
                "notifications": notifications,
                "total": total,
                "page": page,
                "limit": limit,
                "pages": (total + limit - 1) // limit,
                "unread_count": unread_count
            }

        except Exception as e:
            logger.error(f"Error getting notifications: {e}")
            return {
                "notifications": [],
                "total": 0,
                "page": page,
                "limit": limit,
                "pages": 0,
                "unread_count": 0
            }

    def _get_user_preferences(self, user_id: str, db: Session) -> NotificationPreference:
        """Get user notification preferences, creating defaults if needed"""
        preferences = db.query(NotificationPreference).filter(
            NotificationPreference.user_id == user_id
        ).first()

        if not preferences:
            # Create default preferences
            preferences = NotificationPreference(user_id=user_id)
            db.add(preferences)
            db.commit()
            db.refresh(preferences)

        return preferences

    async def cleanup_expired_notifications(self, db: Session) -> int:
        """
        Clean up expired notifications
        
        Args:
            db: Database session
            
        Returns:
            Number of notifications cleaned up
        """
        try:
            # Delete expired notifications
            deleted_count = db.query(Notification).filter(
                Notification.expires_at <= datetime.utcnow()
            ).delete()

            db.commit()
            
            if deleted_count > 0:
                logger.info(f"Cleaned up {deleted_count} expired notifications")
            
            return deleted_count

        except Exception as e:
            logger.error(f"Error cleaning up expired notifications: {e}")
            return 0

    async def get_notification_stats(self, db: Session) -> Dict[str, Any]:
        """Get notification system statistics"""
        try:
            stats = {}
            
            # Total notifications by status
            status_counts = db.query(
                Notification.status,
                func.count(Notification.id)
            ).group_by(Notification.status).all()
            
            stats['by_status'] = {status.value: count for status, count in status_counts}
            
            # Notifications by type (last 24 hours)
            yesterday = datetime.utcnow() - timedelta(days=1)
            type_counts = db.query(
                Notification.type,
                func.count(Notification.id)
            ).filter(
                Notification.created_at >= yesterday
            ).group_by(Notification.type).all()
            
            stats['by_type_24h'] = {type_.value: count for type_, count in type_counts}
            
            # Unread counts by priority
            unread_priority = db.query(
                Notification.priority,
                func.count(Notification.id)
            ).filter(
                Notification.is_read == False
            ).group_by(Notification.priority).all()
            
            stats['unread_by_priority'] = {priority.value: count for priority, count in unread_priority}
            
            return stats

        except Exception as e:
            logger.error(f"Error getting notification stats: {e}")
            return {}


# Global notification service instance
notification_service = NotificationService()


async def get_notification_service() -> NotificationService:
    """Get the global notification service instance"""
    return notification_service