from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ....models.base import get_db
from ....models.user import User
from ....models.notification import (
    Notification,
    NotificationPreference,
    NotificationType,
    NotificationPriority,
    NotificationStatus
)
from ....api.v1.endpoints.auth import get_current_active_user
from ....services.notification_service import notification_service

router = APIRouter()


# Pydantic models for API
class NotificationResponse(BaseModel):
    id: str
    type: str
    title: str
    message: str
    priority: str
    status: str
    is_read: bool
    is_dismissed: bool
    created_at: str
    read_at: Optional[str] = None
    expires_at: Optional[str] = None
    data: Dict[str, Any] = {}

    class Config:
        from_attributes = True


class NotificationPreferenceResponse(BaseModel):
    email_enabled: bool
    push_enabled: bool
    in_app_enabled: bool
    quiet_hours_enabled: bool
    quiet_start_time: Optional[str] = None
    quiet_end_time: Optional[str] = None
    min_priority_email: str
    min_priority_push: str
    min_priority_in_app: str
    type_preferences: Dict[str, bool] = {}

    class Config:
        from_attributes = True


class NotificationPreferenceUpdate(BaseModel):
    email_enabled: Optional[bool] = None
    push_enabled: Optional[bool] = None
    in_app_enabled: Optional[bool] = None
    quiet_hours_enabled: Optional[bool] = None
    quiet_start_time: Optional[str] = None
    quiet_end_time: Optional[str] = None
    min_priority_email: Optional[str] = None
    min_priority_push: Optional[str] = None
    min_priority_in_app: Optional[str] = None
    type_preferences: Optional[Dict[str, bool]] = None


class CreateNotificationRequest(BaseModel):
    user_id: str
    type: str
    title: str
    message: str
    priority: str = "normal"
    data: Dict[str, Any] = {}
    expires_after_hours: Optional[int] = None


@router.get("/", response_model=Dict[str, Any])
async def get_notifications(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=100, description="Items per page"),
    unread_only: bool = Query(False, description="Filter to unread notifications only"),
    type_filter: Optional[str] = Query(None, description="Filter by notification type"),
    priority_filter: Optional[str] = Query(None, description="Filter by priority level"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user notifications with pagination and filtering
    
    Returns paginated list of notifications for the current user with various
    filtering options and metadata about unread counts.
    """
    try:
        # Validate enum values
        notification_type = None
        if type_filter:
            try:
                notification_type = NotificationType(type_filter)
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid notification type: {type_filter}"
                )

        priority = None
        if priority_filter:
            try:
                priority = NotificationPriority(priority_filter)
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid priority: {priority_filter}"
                )

        # Get notifications using service
        result = notification_service.get_notifications(
            user_id=str(current_user.id),
            page=page,
            limit=limit,
            unread_only=unread_only,
            notification_type=notification_type,
            priority=priority,
            db=db
        )

        # Convert notifications to response format
        notifications_data = []
        for notification in result["notifications"]:
            notifications_data.append({
                "id": str(notification.id),
                "type": notification.type.value,
                "title": notification.title,
                "message": notification.message,
                "priority": notification.priority.value,
                "status": notification.status.value,
                "is_read": notification.is_read,
                "is_dismissed": notification.is_dismissed,
                "created_at": notification.created_at.isoformat(),
                "read_at": notification.read_at.isoformat() if notification.read_at else None,
                "expires_at": notification.expires_at.isoformat() if notification.expires_at else None,
                "data": notification.data
            })

        return {
            "notifications": notifications_data,
            "pagination": {
                "total": result["total"],
                "page": result["page"],
                "limit": result["limit"],
                "pages": result["pages"]
            },
            "unread_count": result["unread_count"]
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving notifications: {str(e)}"
        )


@router.post("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Mark a specific notification as read
    
    Updates the notification status and sends real-time confirmation
    to connected WebSocket clients.
    """
    success = await notification_service.mark_as_read(
        notification_id=notification_id,
        user_id=str(current_user.id),
        db=db
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Notification not found or access denied"
        )

    return {"status": "success", "message": "Notification marked as read"}


@router.post("/{notification_id}/dismiss")
async def dismiss_notification(
    notification_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Dismiss a specific notification
    
    Marks the notification as dismissed and removes it from the active
    notification list in real-time.
    """
    success = await notification_service.mark_as_dismissed(
        notification_id=notification_id,
        user_id=str(current_user.id),
        db=db
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Notification not found or access denied"
        )

    return {"status": "success", "message": "Notification dismissed"}


@router.post("/mark-all-read")
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Mark all notifications as read for the current user
    
    Bulk operation that marks all unread notifications as read and
    sends real-time update to connected clients.
    """
    updated_count = await notification_service.bulk_mark_as_read(
        user_id=str(current_user.id),
        db=db
    )

    return {
        "status": "success",
        "message": f"Marked {updated_count} notifications as read",
        "count": updated_count
    }


@router.get("/preferences", response_model=NotificationPreferenceResponse)
async def get_notification_preferences(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user notification preferences
    
    Returns the user's notification delivery preferences including
    channel settings, quiet hours, and type-specific preferences.
    """
    preferences = notification_service._get_user_preferences(str(current_user.id), db)

    return NotificationPreferenceResponse(
        email_enabled=preferences.email_enabled,
        push_enabled=preferences.push_enabled,
        in_app_enabled=preferences.in_app_enabled,
        quiet_hours_enabled=preferences.quiet_hours_enabled,
        quiet_start_time=preferences.quiet_start_time,
        quiet_end_time=preferences.quiet_end_time,
        min_priority_email=preferences.min_priority_email.value,
        min_priority_push=preferences.min_priority_push.value,
        min_priority_in_app=preferences.min_priority_in_app.value,
        type_preferences=preferences.type_preferences
    )


@router.put("/preferences")
async def update_notification_preferences(
    preferences_update: NotificationPreferenceUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update user notification preferences
    
    Allows users to customize their notification delivery settings
    including channels, priorities, and type-specific preferences.
    """
    try:
        preferences = notification_service._get_user_preferences(str(current_user.id), db)

        # Update fields if provided
        if preferences_update.email_enabled is not None:
            preferences.email_enabled = preferences_update.email_enabled

        if preferences_update.push_enabled is not None:
            preferences.push_enabled = preferences_update.push_enabled

        if preferences_update.in_app_enabled is not None:
            preferences.in_app_enabled = preferences_update.in_app_enabled

        if preferences_update.quiet_hours_enabled is not None:
            preferences.quiet_hours_enabled = preferences_update.quiet_hours_enabled

        if preferences_update.quiet_start_time is not None:
            preferences.quiet_start_time = preferences_update.quiet_start_time

        if preferences_update.quiet_end_time is not None:
            preferences.quiet_end_time = preferences_update.quiet_end_time

        # Update priority thresholds
        if preferences_update.min_priority_email:
            try:
                preferences.min_priority_email = NotificationPriority(preferences_update.min_priority_email)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid email priority")

        if preferences_update.min_priority_push:
            try:
                preferences.min_priority_push = NotificationPriority(preferences_update.min_priority_push)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid push priority")

        if preferences_update.min_priority_in_app:
            try:
                preferences.min_priority_in_app = NotificationPriority(preferences_update.min_priority_in_app)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid in-app priority")

        # Update type preferences
        if preferences_update.type_preferences:
            current_prefs = preferences.type_preferences or {}
            current_prefs.update(preferences_update.type_preferences)
            preferences.type_preferences = current_prefs

        db.commit()

        return {"status": "success", "message": "Notification preferences updated"}

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating preferences: {str(e)}"
        )


@router.get("/stats")
async def get_notification_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get notification statistics
    
    Returns system-wide notification statistics for admin users
    or user-specific stats for regular users.
    """
    # For now, return basic stats - could be enhanced with user-specific filtering
    stats = await notification_service.get_notification_stats(db)
    
    # Add user-specific unread count
    unread_count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()
    
    stats['user_unread_count'] = unread_count
    
    return stats


@router.get("/types")
async def get_notification_types():
    """
    Get available notification types
    
    Returns list of all supported notification types for use
    in filtering and preference management.
    """
    return {
        "types": [{"value": type_.value, "label": type_.value.replace("_", " ").title()} 
                 for type_ in NotificationType],
        "priorities": [{"value": priority.value, "label": priority.value.title()} 
                      for priority in NotificationPriority]
    }


# Admin endpoints (if user is admin)
@router.post("/admin/create")
async def create_notification_admin(
    request: CreateNotificationRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create notification (admin only)
    
    Allows administrators to create notifications for any user.
    Useful for system announcements and administrative alerts.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can create notifications for other users"
        )

    try:
        # Validate notification type and priority
        notification_type = NotificationType(request.type)
        priority = NotificationPriority(request.priority)

        # Calculate expiration if provided
        expires_at = None
        if request.expires_after_hours:
            from datetime import datetime, timedelta
            expires_at = datetime.utcnow() + timedelta(hours=request.expires_after_hours)

        # Create notification
        notification = await notification_service.create_notification(
            user_id=request.user_id,
            notification_type=notification_type,
            title=request.title,
            message=request.message,
            data=request.data,
            priority=priority,
            expires_at=expires_at,
            db=db
        )

        return {
            "status": "success",
            "message": "Notification created successfully",
            "notification_id": str(notification.id)
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating notification: {str(e)}"
        )