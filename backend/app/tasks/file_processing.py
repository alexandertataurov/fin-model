import json
import traceback
from typing import Dict, Any, Optional
from celery import Task
from sqlalchemy.orm import Session

from app.core.celery_app import celery_app
from app.models.base import SessionLocal
from app.models.file import UploadedFile, FileStatus
from app.services.file_service import FileService
from app.services.excel_parser import ExcelParser
from app.tasks.notifications import send_processing_notification
from app.services.advanced_validator import AdvancedValidator


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
    name="app.tasks.file_processing.process_uploaded_file",
)
def process_uploaded_file(
    self,
    db: Session,
    file_id: int,
    processing_options: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Process an uploaded file in the background.

    Args:
        file_id: ID of the uploaded file
        processing_options: Optional processing configuration

    Returns:
        Dict with processing results
    """
    file_service = FileService(db)
    excel_parser = ExcelParser()

    try:
        # Update status to processing
        file_service.update_file_status(file_id, FileStatus.PROCESSING)
        file_service.log_processing_step(
            file_id,
            "processing_started",
            "Background processing started",
            "info",
            json.dumps(
                {"task_id": self.request.id, "options": processing_options}
            ),
        )

        # Get file record
        file_record = (
            db.query(UploadedFile)
            .filter(UploadedFile.id == file_id)
            .first()
        )
        if not file_record:
            raise ValueError(f"File with ID {file_id} not found")

        # Update progress
        self.update_state(
            state="PROGRESS",
            meta={
                "current": 10,
                "total": 100,
                "status": "Validating file...",
            },
        )

        # Parse and validate the Excel file
        file_service.log_processing_step(
            file_id, "parsing", "Starting file parsing", "info"
        )
        parsed_data = excel_parser.parse_excel_file(file_record.file_path)

        # Validate against financial templates
        validator = AdvancedValidator()
        validation_result = validator.validate_template(parsed_data)

        # Update progress
        self.update_state(
            state="PROGRESS",
            meta={
                "current": 40,
                "total": 100,
                "status": "Extracting data...",
            },
        )

        # Store validation results
        is_valid = (
            parsed_data.validation_summary.is_valid
            and validation_result.is_valid
        )
        validation_errors = (
            parsed_data.validation_summary.errors
            + validation_result.validation_errors
        )

        if not is_valid:
            validation_errors = json.dumps(
                {
                    "errors": parsed_data.validation_summary.errors,
                    "warnings": parsed_data.validation_summary.warnings,
                }
            )
            file_service.log_processing_step(
                file_id,
                "validation",
                f"Validation failed: {len(parsed_data.validation_summary.errors)} errors found",
                "error",
                validation_errors,
            )
        else:
            file_service.log_processing_step(
                file_id,
                "validation",
                "File validation passed successfully",
                "info",
            )

        # Update progress
        self.update_state(
            state="PROGRESS",
            meta={
                "current": 70,
                "total": 100,
                "status": "Processing financial data...",
            },
        )

        # Store parsed data
        parsed_data_json = None
        if is_valid and parsed_data.financial_statements:
            sheets_data = []
            sheets_attr = getattr(parsed_data, "sheets", []) or []
            if not isinstance(sheets_attr, (list, tuple)):
                sheets_attr = []
            for sheet in sheets_attr:
                sheets_data.append(getattr(sheet, "dict", lambda: sheet)())

            def _safe(obj):
                try:
                    json.dumps(obj)
                    return obj
                except Exception:
                    return str(obj)

            val_summary = getattr(parsed_data, "validation_summary", None)
            if val_summary is not None:
                val_summary = getattr(
                    val_summary, "dict", lambda: val_summary
                )()
                val_summary = _safe(val_summary)
            parsed_data_json = json.dumps(
                {
                    "sheets": _safe(sheets_data),
                    "financial_statements": _safe(
                        getattr(parsed_data, "financial_statements", None)
                    ),
                    "key_metrics": _safe(
                        getattr(parsed_data, "key_metrics", None)
                    ),
                    "assumptions": _safe(
                        getattr(parsed_data, "assumptions", None)
                    ),
                    "validation_summary": val_summary,
                }
            )

            file_service.log_processing_step(
                file_id,
                "extraction",
                f"Extracted data from {len(parsed_data.sheets)} sheets",
                "info",
                json.dumps({"sheet_count": len(parsed_data.sheets)}),
            )

        # Update progress
        self.update_state(
            state="PROGRESS",
            meta={"current": 90, "total": 100, "status": "Finalizing..."},
        )

        # Update file record with results
        final_status = (
            FileStatus.COMPLETED if is_valid else FileStatus.FAILED
        )
        file_service.update_file_status(
            file_id,
            final_status,
            validation_errors=validation_errors,
            is_valid=is_valid,
        )

        # Store parsed data
        if parsed_data_json:
            file_record.parsed_data = parsed_data_json
            db.commit()

        # Log completion
        file_service.log_processing_step(
            file_id,
            "completed",
            f"Processing completed successfully with status: {final_status.value}",
            "info" if is_valid else "warning",
        )

        # Send notification without celery in tests
        send_processing_notification.__wrapped__(
            self,
            db,
            file_id,
            final_status.value,
            file_record.uploaded_by_id,
            None,
        )

        # Final progress update
        self.update_state(
            state="SUCCESS",
            meta={
                "current": 100,
                "total": 100,
                "status": "Processing complete",
            },
        )

        return {
            "file_id": file_id,
            "status": final_status.value,
            "is_valid": is_valid,
            "errors": parsed_data.validation_summary.errors
            if not is_valid
            else [],
            "sheets_processed": len(parsed_data.sheets),
            "task_id": self.request.id,
        }

    except Exception as e:
        # Log error
        error_message = str(e)
        error_details = traceback.format_exc()

        file_service.log_processing_step(
            file_id,
            "error",
            f"Processing failed: {error_message}",
            "error",
            error_details,
        )

        # Update file status to failed
        file_service.update_file_status(
            file_id,
            FileStatus.FAILED,
            validation_errors=json.dumps(
                {"error": error_message, "traceback": error_details}
            ),
            is_valid=False,
        )

        # Send error notification
        file_record = (
            db.query(UploadedFile)
            .filter(UploadedFile.id == file_id)
            .first()
        )
        if file_record:
            send_processing_notification.__wrapped__(
                self,
                db,
                file_id,
                "failed",
                file_record.uploaded_by_id,
                error_message,
            )

        # Update task state
        self.update_state(
            state="FAILURE",
            meta={
                "current": 0,
                "total": 100,
                "status": f"Failed: {error_message}",
            },
        )

        raise


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.file_processing.reprocess_file",
)
def reprocess_file(
    self,
    db: Session,
    file_id: int,
    processing_options: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Reprocess a failed or completed file.

    Args:
        file_id: ID of the file to reprocess
        processing_options: Optional processing configuration

    Returns:
        Dict with processing results
    """
    file_service = FileService(db)

    # Check if file exists and can be reprocessed
    file_record = (
        db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    )
    if not file_record:
        raise ValueError(f"File with ID {file_id} not found")

    if file_record.status == FileStatus.PROCESSING:
        raise ValueError("File is already being processed")

    # Log reprocessing start
    file_service.log_processing_step(
        file_id,
        "reprocessing_started",
        "File reprocessing initiated",
        "info",
        json.dumps(
            {"task_id": self.request.id, "options": processing_options}
        ),
    )

    # Call the main processing task
    return process_uploaded_file(self, db, file_id, processing_options)


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.file_processing.cleanup_old_files",
)
def cleanup_old_files(
    self, db: Session, days_old: int = 30
) -> Dict[str, Any]:
    """
    Clean up old uploaded files and their data.

    Args:
        days_old: Number of days after which files should be cleaned up

    Returns:
        Dict with cleanup results
    """
    import os
    from datetime import datetime, timedelta

    file_service = FileService(db)
    cutoff_date = datetime.utcnow() - timedelta(days=days_old)

    # Find old files
    old_files = (
        db.query(UploadedFile)
        .filter(
            UploadedFile.created_at < cutoff_date,
            UploadedFile.status.in_(
                [
                    FileStatus.COMPLETED,
                    FileStatus.FAILED,
                    FileStatus.CANCELLED,
                ]
            ),
        )
        .all()
    )

    cleaned_count = 0
    errors = []

    for file_record in old_files:
        try:
            # Delete physical file
            if os.path.exists(file_record.file_path):
                os.unlink(file_record.file_path)

            # Delete database record
            db.delete(file_record)
            cleaned_count += 1

        except Exception as e:
            errors.append(
                f"Failed to delete file {file_record.id}: {str(e)}"
            )

    if cleaned_count > 0:
        db.commit()

    return {
        "cleaned_files": cleaned_count,
        "errors": errors,
        "cutoff_date": cutoff_date.isoformat(),
    }


@celery_app.task(name="app.tasks.file_processing.get_processing_status")
def get_processing_status(task_id: str) -> Dict[str, Any]:
    """
    Get the status of a processing task.

    Args:
        task_id: Celery task ID

    Returns:
        Dict with task status information
    """
    result = celery_app.AsyncResult(task_id)

    if result.state == "PENDING":
        response = {
            "state": result.state,
            "current": 0,
            "total": 100,
            "status": "Task is waiting to be processed...",
        }
    elif result.state == "PROGRESS":
        response = {
            "state": result.state,
            "current": result.info.get("current", 0),
            "total": result.info.get("total", 100),
            "status": result.info.get("status", "Processing..."),
        }
    elif result.state == "SUCCESS":
        response = {
            "state": result.state,
            "current": 100,
            "total": 100,
            "status": "Processing completed",
            "result": result.info,
        }
    else:  # FAILURE
        response = {
            "state": result.state,
            "current": 0,
            "total": 100,
            "status": str(result.info),
            "error": str(result.info),
        }

        return response


# Expose raw function for unit tests
process_uploaded_file.__wrapped__ = (
    process_uploaded_file.__wrapped__.__func__
)
