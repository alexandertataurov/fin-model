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

# Configure Celery with enhanced settings
celery_app.conf.update(
    # Serialization
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    
    # Timezone
    timezone="UTC",
    enable_utc=True,
    
    # Task tracking and limits
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    
    # Worker settings
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    worker_disable_rate_limits=False,
    worker_enable_remote_control=True,
    
    # Task acknowledgment and retry
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    task_default_retry_delay=60,  # 1 minute
    task_max_retries=3,
    
    # Result settings
    result_expires=3600,  # 1 hour
    result_backend_transport_options={'visibility_timeout': 3600},
    
    # Queue configuration
    task_default_queue="default",
    task_routes={
        "app.tasks.file_processing.*": {"queue": "file_processing"},
        "app.tasks.notifications.*": {"queue": "notifications"},
        "app.tasks.scheduled_tasks.*": {"queue": "scheduled"},
    },
    
    # Define queues
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
        "scheduled": {
            "exchange": "scheduled",
            "routing_key": "scheduled",
        },
        "high_priority": {
            "exchange": "high_priority",
            "routing_key": "high_priority",
        },
    },
    
    # Monitoring
    worker_send_task_events=True,
    task_send_sent_event=True,
    
    # Redis-specific settings
    broker_transport_options={
        'visibility_timeout': 3600,
        'fanout_prefix': True,
        'fanout_patterns': True
    },
    
    # Error handling and rate limiting
    task_annotations={
        '*': {'rate_limit': '100/m'},
        'app.tasks.file_processing.process_uploaded_file': {
            'rate_limit': '10/m',
            'time_limit': 1800,  # 30 minutes for file processing
        },
    },
)

# Task discovery
celery_app.autodiscover_tasks()

if __name__ == "__main__":
    celery_app.start()
