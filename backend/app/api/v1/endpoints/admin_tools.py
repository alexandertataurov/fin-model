from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from app.models.base import get_db
from app.models.user import User
from app.services.manual_intervention import (
    ManualInterventionService,
    InterventionType,
    InterventionPriority,
)
from app.services.data_recovery import DataRecoveryService
from app.services.partial_processor import PartialProcessor
from app.api.v1.endpoints.auth import get_current_active_user
from app.core.dependencies import require_permissions
from app.core.permissions import Permission

router = APIRouter()


# Request/Response Models
class InterventionRequest(BaseModel):
    intervention_type: InterventionType
    file_id: int
    priority: InterventionPriority = InterventionPriority.NORMAL
    description: str
    justification: str
    parameters: Optional[dict] = None


class RecoveryRequest(BaseModel):
    file_id: int
    recovery_action_index: int  # Index from available recovery actions


class PartialProcessRequest(BaseModel):
    file_id: int
    ignore_validation_errors: bool = False
    extract_available_data: bool = True


# Dependency functions
def get_intervention_service() -> ManualInterventionService:
    return ManualInterventionService()


def get_recovery_service() -> DataRecoveryService:
    return DataRecoveryService()


def get_partial_processor() -> PartialProcessor:
    return PartialProcessor()


# Manual Intervention Endpoints
@router.post("/interventions/request")
def request_manual_intervention(
    request: InterventionRequest,
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    intervention_service: ManualInterventionService = Depends(get_intervention_service),
) -> Any:
    """
    Request a manual intervention for a file (Admin only).
    """
    try:
        request_id = intervention_service.request_intervention(
            intervention_type=request.intervention_type,
            file_id=request.file_id,
            admin_user_id=current_user.id,
            description=request.description,
            justification=request.justification,
            priority=request.priority,
            parameters=request.parameters,
        )

        return {
            "success": True,
            "request_id": request_id,
            "message": "Intervention request submitted successfully",
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to request intervention: {str(e)}",
        )


@router.get("/interventions/pending")
def get_pending_interventions(
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    intervention_service: ManualInterventionService = Depends(get_intervention_service),
) -> Any:
    """
    Get list of pending manual interventions (Admin only).
    """
    pending = intervention_service.get_pending_interventions()

    return {
        "pending_interventions": [
            {
                "intervention_type": req.intervention_type,
                "file_id": req.file_id,
                "user_id": req.user_id,
                "priority": req.priority,
                "description": req.description,
                "requested_by": req.requested_by,
                "requested_at": req.requested_at.isoformat(),
                "approval_required": req.approval_required,
            }
            for req in pending
        ],
        "total_pending": len(pending),
    }


@router.post("/interventions/{intervention_index}/execute")
async def execute_intervention(
    intervention_index: int,
    approved: bool = Body(True, embed=True),
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    intervention_service: ManualInterventionService = Depends(get_intervention_service),
) -> Any:
    """
    Execute a pending manual intervention (Admin only).
    """
    try:
        pending = intervention_service.get_pending_interventions()

        if intervention_index >= len(pending):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Intervention not found"
            )

        intervention_request = pending[intervention_index]

        result = await intervention_service.execute_intervention(
            intervention_request=intervention_request,
            executing_admin_id=current_user.id,
            approved=approved,
        )

        return {
            "success": result.success,
            "intervention_type": result.intervention_type,
            "file_id": result.file_id,
            "actions_taken": result.actions_taken,
            "data_modified": result.data_modified,
            "status_change": f"{result.original_status} -> {result.new_status}",
            "warnings": result.warnings,
            "audit_trail": result.audit_trail,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to execute intervention: {str(e)}",
        )


@router.get("/interventions/{file_id}/history")
def get_intervention_history(
    file_id: int,
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    intervention_service: ManualInterventionService = Depends(get_intervention_service),
) -> Any:
    """
    Get intervention history for a specific file (Admin only).
    """
    history = intervention_service.get_intervention_history(file_id)

    return {
        "file_id": file_id,
        "intervention_history": history,
        "total_interventions": len(history),
    }


# Data Recovery Endpoints
@router.get("/recovery/{file_id}/options")
def get_recovery_options(
    file_id: int,
    current_user: User = Depends(get_current_active_user),
    recovery_service: DataRecoveryService = Depends(get_recovery_service),
) -> Any:
    """
    Get available recovery options for a failed file.
    """
    try:
        recovery_actions = recovery_service.analyze_recovery_options(
            file_id, current_user.id
        )

        return {
            "file_id": file_id,
            "recovery_options": [
                {
                    "index": idx,
                    "action_type": action.action_type,
                    "description": action.description,
                    "priority": action.priority,
                    "estimated_success_rate": action.estimated_success_rate,
                    "execution_time_minutes": action.execution_time_minutes,
                    "required_resources": action.required_resources,
                    "prerequisites": action.prerequisites,
                    "side_effects": action.side_effects,
                }
                for idx, action in enumerate(recovery_actions)
            ],
            "total_options": len(recovery_actions),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to analyze recovery options: {str(e)}",
        )


@router.post("/recovery/execute")
async def execute_recovery(
    request: RecoveryRequest,
    current_user: User = Depends(get_current_active_user),
    recovery_service: DataRecoveryService = Depends(get_recovery_service),
) -> Any:
    """
    Execute a specific recovery action.
    """
    try:
        # Get available recovery actions
        recovery_actions = recovery_service.analyze_recovery_options(
            request.file_id, current_user.id
        )

        if request.recovery_action_index >= len(recovery_actions):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recovery action not found",
            )

        selected_action = recovery_actions[request.recovery_action_index]

        # Execute recovery
        result = await recovery_service.execute_recovery(
            file_id=request.file_id,
            user_id=current_user.id,
            recovery_action=selected_action,
        )

        return {
            "success": result.success,
            "recovery_type": result.recovery_type,
            "file_id": result.file_id,
            "actions_taken": result.actions_taken,
            "files_recovered": result.files_recovered,
            "data_integrity_score": result.data_integrity_score,
            "warnings": result.warnings,
            "next_steps": result.next_steps,
            "recovered_data": result.recovered_data,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to execute recovery: {str(e)}",
        )


# Partial Processing Endpoints
@router.post("/partial-processing/analyze")
def analyze_partial_processing(
    request: PartialProcessRequest,
    current_user: User = Depends(get_current_active_user),
    partial_processor: PartialProcessor = Depends(get_partial_processor),
    db: Session = Depends(get_db),
) -> Any:
    """
    Analyze what data can be extracted through partial processing.
    """
    try:
        from app.models.file import UploadedFile
        from sqlalchemy import and_

        # Get file record
        file_record = (
            db.query(UploadedFile)
            .filter(
                and_(
                    UploadedFile.id == request.file_id,
                    UploadedFile.uploaded_by_id == current_user.id,
                )
            )
            .first()
        )

        if not file_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
            )

        # Create fake validation result for analysis
        validation_result = type(
            "obj",
            (object,),
            {
                "is_valid": False,
                "errors": ["File requires partial processing"],
                "warnings": [],
            },
        )()

        # Analyze partial processing potential
        result = partial_processor.process_with_issues(
            file_record.file_path, validation_result
        )

        return {
            "file_id": request.file_id,
            "can_partial_process": result.success,
            "estimated_completion": result.completion_percentage,
            "extractable_sheets": result.sheets_processed,
            "problematic_sheets": result.sheets_failed,
            "issues_identified": [
                {
                    "type": issue.issue_type,
                    "severity": issue.severity,
                    "location": issue.location,
                    "description": issue.description,
                    "recoverable": issue.recoverable,
                    "suggested_fix": issue.suggested_fix,
                }
                for issue in result.issues_encountered
            ],
            "recommendations": result.recommendations,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to analyze partial processing: {str(e)}",
        )


@router.post("/partial-processing/execute")
def execute_partial_processing(
    request: PartialProcessRequest,
    current_user: User = Depends(get_current_active_user),
    partial_processor: PartialProcessor = Depends(get_partial_processor),
    db: Session = Depends(get_db),
) -> Any:
    """
    Execute partial processing to extract available data.
    """
    try:
        from app.models.file import UploadedFile, FileStatus
        from app.services.file_service import FileService
        from sqlalchemy import and_
        import json

        # Get file record
        file_record = (
            db.query(UploadedFile)
            .filter(
                and_(
                    UploadedFile.id == request.file_id,
                    UploadedFile.uploaded_by_id == current_user.id,
                )
            )
            .first()
        )

        if not file_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
            )

        # Create validation result
        validation_result = type(
            "obj",
            (object,),
            {
                "is_valid": False,
                "errors": json.loads(file_record.validation_errors).get("errors", [])
                if file_record.validation_errors
                else [],
                "warnings": json.loads(file_record.validation_errors).get(
                    "warnings", []
                )
                if file_record.validation_errors
                else [],
            },
        )()

        # Execute partial processing
        result = partial_processor.process_with_issues(
            file_record.file_path, validation_result
        )

        if result.success and result.extracted_data:
            # Update file record with partial data
            file_record.parsed_data = json.dumps(result.extracted_data)
            file_record.status = FileStatus.COMPLETED
            file_record.is_valid = result.completion_percentage > 50

            # Update validation errors with partial processing info
            partial_info = {
                "partial_processing": True,
                "completion_percentage": result.completion_percentage,
                "extracted_sheets": result.sheets_processed,
                "failed_sheets": result.sheets_failed,
                "recovery_actions": result.recovery_actions_taken,
                "original_errors": validation_result.errors,
            }

            file_record.validation_errors = json.dumps(partial_info)

            # Log partial processing
            file_service = FileService(db)
            file_service.log_processing_step(
                file_record.id,
                "partial_processing",
                f"Partial processing completed: {result.completion_percentage:.1f}% data extracted",
                "info",
                json.dumps(
                    {
                        "completion_percentage": result.completion_percentage,
                        "sheets_processed": result.sheets_processed,
                        "issues_count": len(result.issues_encountered),
                    }
                ),
            )

            db.commit()

            return {
                "success": True,
                "file_id": request.file_id,
                "completion_percentage": result.completion_percentage,
                "extracted_data": result.extracted_data,
                "sheets_processed": result.sheets_processed,
                "sheets_failed": result.sheets_failed,
                "issues_encountered": len(result.issues_encountered),
                "warnings": [issue.description for issue in result.issues_encountered],
                "recommendations": result.recommendations,
                "data_updated": True,
            }
        else:
            return {
                "success": False,
                "file_id": request.file_id,
                "message": "Partial processing failed to extract meaningful data",
                "issues": [issue.description for issue in result.issues_encountered],
                "recommendations": result.recommendations,
                "data_updated": False,
            }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to execute partial processing: {str(e)}",
        )


# System Health and Monitoring Endpoints
@router.get("/system/health")
def get_system_health(
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
) -> Any:
    """
    Get comprehensive system health status (Admin only).
    """
    try:
        from app.services.cloud_storage import CloudStorageManager
        from app.services.virus_scanner import VirusScanManager

        health_status = {
            "timestamp": datetime.utcnow().isoformat(),
            "overall_status": "healthy",
            "services": {},
        }

        # Check storage service
        try:
            storage_manager = CloudStorageManager()
            storage_stats = storage_manager.get_storage_stats()
            health_status["services"]["storage"] = {
                "status": "healthy",
                "details": storage_stats,
            }
        except Exception as e:
            health_status["services"]["storage"] = {
                "status": "unhealthy",
                "error": str(e),
            }
            health_status["overall_status"] = "degraded"

        # Check virus scanner
        try:
            scanner_manager = VirusScanManager()
            scanner_status = scanner_manager.get_scanner_status()
            health_status["services"]["virus_scanner"] = {
                "status": "healthy",
                "details": scanner_status,
            }
        except Exception as e:
            health_status["services"]["virus_scanner"] = {
                "status": "unhealthy",
                "error": str(e),
            }
            # Virus scanner issues are not critical

        # Check database
        try:
            db = next(get_db())
            db.execute("SELECT 1")
            health_status["services"]["database"] = {"status": "healthy"}
        except Exception as e:
            health_status["services"]["database"] = {
                "status": "unhealthy",
                "error": str(e),
            }
            health_status["overall_status"] = "degraded"

        return health_status

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get system health: {str(e)}",
        )


@router.get("/system/stats")
def get_system_stats(
    current_user: User = Depends(require_permissions(Permission.ADMIN_ACCESS)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get comprehensive system statistics (Admin only).
    """
    try:
        from app.models.file import UploadedFile
        from app.services.file_cleanup import FileCleanupService
        from sqlalchemy import func

        # File statistics
        file_stats = db.query(
            func.count(UploadedFile.id).label("total_files"),
            func.sum(UploadedFile.file_size).label("total_size"),
            func.count(UploadedFile.id)
            .filter(UploadedFile.status == "completed")
            .label("completed_files"),
            func.count(UploadedFile.id)
            .filter(UploadedFile.status == "failed")
            .label("failed_files"),
            func.count(UploadedFile.id)
            .filter(UploadedFile.status == "processing")
            .label("processing_files"),
        ).first()

        # Cleanup statistics
        cleanup_service = FileCleanupService()
        cleanup_stats = cleanup_service.get_cleanup_statistics()

        return {
            "timestamp": datetime.utcnow().isoformat(),
            "file_statistics": {
                "total_files": file_stats.total_files or 0,
                "total_size_mb": round((file_stats.total_size or 0) / (1024 * 1024), 2),
                "completed_files": file_stats.completed_files or 0,
                "failed_files": file_stats.failed_files or 0,
                "processing_files": file_stats.processing_files or 0,
                "success_rate": round(
                    (file_stats.completed_files or 0)
                    / max(file_stats.total_files or 1, 1)
                    * 100,
                    1,
                ),
            },
            "cleanup_statistics": cleanup_stats,
            "system_info": {
                "intervention_service": "active",
                "recovery_service": "active",
                "partial_processor": "active",
            },
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get system stats: {str(e)}",
        )
