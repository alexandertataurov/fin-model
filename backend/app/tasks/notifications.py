import json
from typing import Optional
from celery import Task
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.celery_app import celery_app
from app.models.base import SessionLocal
from app.models.file import UploadedFile
from app.models.user import User


class DatabaseTask(Task):
    """Base task with database session management."""

    def __call__(self, *args, **kwargs):
        with SessionLocal() as db:
            return self.run_with_db(db, *args, **kwargs)

    def run_with_db(self, db: Session, *args, **kwargs):
        raise NotImplementedError


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.notifications.send_processing_notification",
)
def send_processing_notification(
    self,
    db: Session,
    file_id: int,
    status: str,
    user_id: int,
    error_message: Optional[str] = None,
) -> dict:
    """
    Send notification about file processing completion.

    Args:
        file_id: ID of the processed file
        status: Processing status (completed, failed, etc.)
        user_id: ID of the user who uploaded the file
        error_message: Optional error message for failed processing

    Returns:
        Dict with notification status
    """
    try:
        # Get file and user information
        file_record = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
        user = db.query(User).filter(User.id == user_id).first()

        if not file_record or not user:
            return {"status": "error", "message": "File or user not found"}

        # Prepare notification data
        notification_data = {
            "file_id": file_id,
            "filename": file_record.original_filename,
            "status": status,
            "user_email": user.email,
            "user_name": f"{user.first_name} {user.last_name}",
            "processed_at": file_record.processing_completed_at.isoformat()
            if file_record.processing_completed_at
            else None,
            "error_message": error_message,
        }

        # For now, just log the notification
        # In a real implementation, you would send email, push notification, etc.
        print(
            f"NOTIFICATION: File {file_record.original_filename} processing {status} for user {user.email}"
        )

        if status == "completed":
            print(f"  ✅ File processed successfully")
        elif status == "failed":
            print(f"  ❌ Processing failed: {error_message}")

        # TODO: Implement actual notification sending (email, push, etc.)
        # await send_email_notification(notification_data)
        # await send_push_notification(notification_data)

        return {
            "status": "success",
            "message": f"Notification sent to {user.email}",
            "data": notification_data,
        }

    except Exception as e:
        return {"status": "error", "message": f"Failed to send notification: {str(e)}"}


@celery_app.task(
    bind=True, base=DatabaseTask, name="app.tasks.notifications.send_weekly_summary"
)
def send_weekly_summary(self, db: Session) -> dict:
    """
    Send weekly summary of file processing activity to all users.

    Returns:
        Dict with summary sending status
    """
    from datetime import datetime, timedelta
    from sqlalchemy import func

    try:
        # Calculate date range for the past week
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=7)

        # Get processing statistics for the past week
        stats_query = (
            db.query(
                func.count(UploadedFile.id).label("total_files"),
                func.count(UploadedFile.id)
                .filter(UploadedFile.status == "completed")
                .label("completed_files"),
                func.count(UploadedFile.id)
                .filter(UploadedFile.status == "failed")
                .label("failed_files"),
                UploadedFile.uploaded_by_id,
            )
            .filter(
                UploadedFile.created_at >= start_date,
                UploadedFile.created_at <= end_date,
            )
            .group_by(UploadedFile.uploaded_by_id)
            .all()
        )

        notifications_sent = 0

        for stats in stats_query:
            user = db.query(User).filter(User.id == stats.uploaded_by_id).first()
            if user:
                summary_data = {
                    "user_email": user.email,
                    "user_name": f"{user.first_name} {user.last_name}",
                    "period": f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
                    "total_files": stats.total_files,
                    "completed_files": stats.completed_files,
                    "failed_files": stats.failed_files,
                    "success_rate": round(
                        (stats.completed_files / stats.total_files) * 100, 1
                    )
                    if stats.total_files > 0
                    else 0,
                }

                # For now, just log the summary
                print(f"WEEKLY SUMMARY for {user.email}:")
                print(f"  📊 Total files processed: {stats.total_files}")
                print(f"  ✅ Successful: {stats.completed_files}")
                print(f"  ❌ Failed: {stats.failed_files}")
                print(f"  📈 Success rate: {summary_data['success_rate']}%")

                # TODO: Send actual email summary
                # await send_email_summary(summary_data)

                notifications_sent += 1

        return {
            "status": "success",
            "message": f"Weekly summary sent to {notifications_sent} users",
            "period": f"{start_date.isoformat()} to {end_date.isoformat()}",
        }

    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to send weekly summary: {str(e)}",
        }


@celery_app.task(name="app.tasks.notifications.send_system_alert")
def send_system_alert(alert_type: str, message: str, severity: str = "info") -> dict:
    """
    Send system alert notifications to administrators.

    Args:
        alert_type: Type of alert (error, warning, info)
        message: Alert message
        severity: Severity level (low, medium, high, critical)

    Returns:
        Dict with alert status
    """
    try:
        alert_data = {
            "type": alert_type,
            "message": message,
            "severity": severity,
            "timestamp": datetime.utcnow().isoformat(),
        }

        # For now, just log the alert
        severity_icons = {"low": "ℹ️", "medium": "⚠️", "high": "🚨", "critical": "💥"}

        icon = severity_icons.get(severity, "📢")
        print(f"{icon} SYSTEM ALERT [{severity.upper()}]: {alert_type}")
        print(f"   {message}")

        # TODO: Send to admin channels (email, Slack, etc.)

        return {"status": "success", "message": "System alert sent", "data": alert_data}

    except Exception as e:
        return {"status": "error", "message": f"Failed to send system alert: {str(e)}"}
