from app.core.celery_app import celery_app
from fastapi import APIRouter

router = APIRouter()


@router.get("/{task_id}")
def get_task_status(task_id: str):
    """Return status and result of a background task."""
    task = celery_app.AsyncResult(task_id)
    response = {"task_id": task_id, "status": task.status}
    if task.successful():
        response["result"] = task.result
    elif task.failed():
        response["error"] = str(task.result)
    return response
