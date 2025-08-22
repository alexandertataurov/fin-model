from datetime import datetime, timedelta
from celery import Task
from celery.schedules import crontab
from sqlalchemy.orm import Session

import asyncio
from app.core.celery_app import celery_app
from app.models.base import SessionLocal
from app.services.file_cleanup import FileCleanupService
from app.services.file_service import FileService
from app.tasks.notifications import send_system_alert


class DatabaseTask(Task):
    """Base task with database session management."""

    def __call__(self, *args, **kwargs):
        with SessionLocal() as db:
            return self.run_with_db(db, *args, **kwargs)

    def run_with_db(self, db: Session, *args, **kwargs):
        raise NotImplementedError


@celery_app.task(name="app.tasks.scheduled_tasks.cleanup_expired_files")
def cleanup_expired_files(task=None, db_session: Session | None = None):
    """Clean up expired files synchronously for tests."""
    try:
        if db_session is None and isinstance(task, Session):
            db_session = task
            task = None

        if db_session is None:
            with SessionLocal() as session:
                service = FileService(session)
                results = service.cleanup_expired_files()
        else:
            service = FileService(db_session)
            results = service.cleanup_expired_files()

        # Send notification if significant cleanup occurred
        if results.get("total_files_deleted", 0) > 0:
            message = (
                f"File cleanup completed: {results['total_files_deleted']} files deleted, "
                f"{results['total_storage_freed_mb']:.2f} MB freed"
            )
            send_system_alert.delay("file_cleanup", message, "info")

        results_dict = {
            "success": True,
            "total_files_deleted": results.get("total_files_deleted")
            or results.get("files_deleted", 0),
            "total_storage_freed_mb": results.get("total_storage_freed_mb")
            or results.get("storage_freed_mb", 0),
            "error": None,
        }
        return results_dict

    except Exception as e:
        error_msg = f"Scheduled file cleanup failed: {str(e)}"
        send_system_alert.delay("file_cleanup_error", error_msg, "high")
        return {"success": False, "error": str(e)}


@celery_app.task(
    bind=True, name="app.tasks.scheduled_tasks.generate_cleanup_report"
)
def generate_cleanup_report(self):
    """Generate a report on cleanup statistics."""
    try:
        cleanup_service = FileCleanupService()
        stats = cleanup_service.get_cleanup_statistics()

        # Generate report summary
        report = {
            "generated_at": datetime.utcnow().isoformat(),
            "statistics": stats,
            "recommendations": [],
        }

        # Add recommendations based on statistics
        if stats["reclaimable_storage_mb"] > 1000:  # More than 1GB
            report["recommendations"].append(
                f"Consider running cleanup - {stats['reclaimable_storage_mb']:.2f} MB can be reclaimed"
            )

        if stats["eligible_for_cleanup"] > 100:
            report["recommendations"].append(
                f"{stats['eligible_for_cleanup']} files are eligible for cleanup"
            )

        # Send alert if storage usage is high
        if stats["storage_used_mb"] > 10000:  # More than 10GB
            send_system_alert.delay(
                "high_storage_usage",
                f"Storage usage is high: {stats['storage_used_mb']:.2f} MB",
                "medium",
            )

        return report

    except Exception as e:
        error_msg = f"Cleanup report generation failed: {str(e)}"
        send_system_alert.delay(
            "report_generation_error", error_msg, "medium"
        )
        raise


@celery_app.task(bind=True, name="app.tasks.scheduled_tasks.health_check")
def health_check(self):
    """Perform system health checks."""
    try:
        health_status = {
            "timestamp": datetime.utcnow().isoformat(),
            "services": {},
            "overall_status": "healthy",
        }

        # Check database connectivity
        try:
            with SessionLocal() as db:
                db.execute("SELECT 1")
            health_status["services"]["database"] = "healthy"
        except Exception as e:
            health_status["services"]["database"] = f"unhealthy: {str(e)}"
            health_status["overall_status"] = "degraded"

        # Check storage service
        try:
            from app.services.cloud_storage import CloudStorageManager

            storage_manager = CloudStorageManager()
            storage_stats = storage_manager.get_storage_stats()
            health_status["services"]["storage"] = storage_stats
        except Exception as e:
            health_status["services"]["storage"] = f"unhealthy: {str(e)}"
            health_status["overall_status"] = "degraded"

        # Check virus scanner
        try:
            from app.services.virus_scanner import VirusScanManager

            scanner_manager = VirusScanManager()
            scanner_status = scanner_manager.get_scanner_status()
            health_status["services"]["virus_scanner"] = scanner_status
        except Exception as e:
            health_status["services"][
                "virus_scanner"
            ] = f"unhealthy: {str(e)}"
            # Virus scanner issues are not critical for overall health

        # Send alert if system is unhealthy
        if health_status["overall_status"] != "healthy":
            send_system_alert.delay(
                "system_health_degraded",
                f"System health is {health_status['overall_status']}",
                "high",
            )

        return health_status

    except Exception as e:
        error_msg = f"Health check failed: {str(e)}"
        send_system_alert.delay(
            "health_check_error", error_msg, "critical"
        )
        raise


@celery_app.task(
    bind=True, name="app.tasks.scheduled_tasks.update_analytics_cache"
)
def update_analytics_cache(self):
    """Update cached analytics data for faster dashboard loading."""
    try:
        from app.services.analytics_service import AnalyticsService

        with SessionLocal() as db:
            analytics_service = AnalyticsService(db)

            # Generate and cache key analytics
            cache_data = {
                "updated_at": datetime.utcnow().isoformat(),
                "dashboard_summary_7d": analytics_service.get_dashboard_summary(
                    7
                ),
                "dashboard_summary_30d": analytics_service.get_dashboard_summary(
                    30
                ),
                "processing_overview": analytics_service.get_processing_overview(
                    30
                ),
                "performance_metrics": analytics_service.get_performance_metrics(
                    30
                ),
            }

            # Store in Redis cache for faster retrieval
            import json
            from app.core.celery_app import redis_client

            redis_client.setex(
                "analytics_cache", 3600, json.dumps(cache_data)
            )

            return {
                "success": True,
                "cache_updated_at": cache_data["updated_at"],
                "cached_datasets": len(cache_data) - 1,
            }

    except Exception as e:
        error_msg = f"Analytics cache update failed: {str(e)}"
        send_system_alert.delay(
            "analytics_cache_error", error_msg, "medium"
        )
        raise


# Configure periodic tasks
celery_app.conf.beat_schedule = {
    # Clean up expired files daily at 2 AM
    "cleanup-expired-files": {
        "task": "app.tasks.scheduled_tasks.cleanup_expired_files",
        "schedule": crontab(hour=2, minute=0),
    },
    # Generate cleanup report weekly on Sunday at 1 AM
    "generate-cleanup-report": {
        "task": "app.tasks.scheduled_tasks.generate_cleanup_report",
        "schedule": crontab(hour=1, minute=0, day_of_week=0),
    },
    # Health check every 30 minutes
    "health-check": {
        "task": "app.tasks.scheduled_tasks.health_check",
        "schedule": crontab(minute="*/30"),
    },
    # Update analytics cache every hour
    "update-analytics-cache": {
        "task": "app.tasks.scheduled_tasks.update_analytics_cache",
        "schedule": crontab(minute=0),
    },
}
