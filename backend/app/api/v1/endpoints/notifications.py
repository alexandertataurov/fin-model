from typing import Any, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
    NotificationPreferences as NotificationPreferencesSchema,
    NotificationPreferencesUpdate,
    NotificationStats,
    NotificationListResponse,
)
from app.services.notification_service import NotificationService

router = APIRouter()


@router.get("/", response_model=NotificationListResponse)
def get_notifications(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    unread_only: bool = Query(False),
    notification_type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """Get user notifications with pagination."""
    notification_service = NotificationService(db)
    
    # Build query filters
    filters = [Notification.user_id == current_user.id]
    
    if unread_only:
        filters.append(Notification.is_read.is_(False))
    
    if notification_type:
        filters.append(Notification.notification_type == notification_type)
    
    # Get notifications with pagination
    notifications, total_count, total_pages = notification_service.get_user_notifications(
        user_id=current_user.id,
        page=page,
        limit=limit,
        filters=filters
    )
    
    # Get unread count
    unread_count = notification_service.get_unread_count(current_user.id)
    
    return NotificationListResponse(
        notifications=notifications,
        pagination={
            "page": page,
            "limit": limit,
            "total": total_count,
            "pages": total_pages
        },
        unread_count=unread_count
    )


@router.get("/{notification_id}", response_model=NotificationResponse)
def get_notification(
    notification_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """Get a specific notification."""
    notification_service = NotificationService(db)
    
    notification = notification_service.get_notification(notification_id, current_user.id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return notification


@router.post("/{notification_id}/read")
def mark_as_read(
    notification_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """Mark a notification as read."""
    notification_service = NotificationService(db)
    
    success = notification_service.mark_as_read(notification_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return {"message": "Notification marked as read"}


@router.post("/{notification_id}/dismiss")
def dismiss_notification(
    notification_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """Dismiss a notification."""
    notification_service = NotificationService(db)
    
    success = notification_service.dismiss_notification(notification_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return {"message": "Notification dismissed"}


@router.post("/mark-all-read")
def mark_all_as_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """Mark all user notifications as read."""
    notification_service = NotificationService(db)
    
    count = notification_service.mark_all_as_read(current_user.id)
    
    return {
        "message": f"Marked {count} notifications as read",
        "count": count
    }


@router.get("/preferences", response_model=NotificationPreferencesSchema)
def get_notification_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """Get user notification preferences."""
    notification_service = NotificationService(db)
    
    preferences = notification_service.get_user_preferences(current_user.id)
    if not preferences:
        # Create default preferences if none exist
        preferences = notification_service.create_default_preferences(current_user.id)
    
    return preferences


@router.put("/preferences", response_model=NotificationPreferencesSchema)
def update_notification_preferences(
    preferences_update: NotificationPreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """Update user notification preferences."""
    notification_service = NotificationService(db)
    
    preferences = notification_service.update_user_preferences(
        current_user.id, preferences_update
    )
    
    return preferences


@router.get("/stats", response_model=NotificationStats)
def get_notification_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """Get notification statistics for the user."""
    notification_service = NotificationService(db)
    
    stats = notification_service.get_user_stats(current_user.id)
    
    return stats


@router.get("/types")
def get_notification_types(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """Get available notification types."""
    notification_service = NotificationService(db)
    
    types = notification_service.get_notification_types()
    
    return {"types": types}


# Admin endpoints
@router.post("/admin/create", response_model=NotificationResponse)
def create_notification_admin(
    notification_create: NotificationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """Create a notification (Admin only)."""
    # Check if user has admin permissions
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    notification_service = NotificationService(db)
    
    notification = notification_service.create_notification(notification_create)
    
    return notification


@router.delete("/admin/{notification_id}")
def delete_notification_admin(
    notification_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """Delete a notification (Admin only)."""
    # Check if user has admin permissions
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    notification_service = NotificationService(db)
    
    success = notification_service.delete_notification(notification_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return {"message": "Notification deleted"}
