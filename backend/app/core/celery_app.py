from celery import Celery
from app.core.config import settings

# Create Celery app
celery_app = Celery(
    "finvision",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.tasks.file_processing",
        "app.tasks.notifications",
        "app.tasks.scheduled_tasks",
    ],
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    result_expires=3600,  # 1 hour
    task_routes={
        "app.tasks.file_processing.*": {"queue": "file_processing"},
        "app.tasks.notifications.*": {"queue": "notifications"},
    },
    task_default_queue="default",
    task_queues={
        "default": {
            "exchange": "default",
            "routing_key": "default",
        },
        "file_processing": {
            "exchange": "file_processing",
            "routing_key": "file_processing",
        },
        "notifications": {
            "exchange": "notifications",
            "routing_key": "notifications",
        },
    },
)

# Task discovery
celery_app.autodiscover_tasks()

if __name__ == "__main__":
    celery_app.start()
