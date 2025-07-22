import json
import os
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from dataclasses import dataclass
from enum import Enum

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from fastapi import HTTPException

from app.models.base import SessionLocal
from app.models.file import UploadedFile, ProcessingLog, FileStatus
from app.models.user import User
from app.services.data_recovery import DataRecoveryService
from app.services.partial_processor import PartialProcessor
from app.services.file_service import FileService
from app.core.config import settings


class InterventionType(str, Enum):
    """Types of manual interventions."""
    FORCE_REPROCESS = "force_reprocess"
    OVERRIDE_VALIDATION = "override_validation"
    MANUAL_DATA_ENTRY = "manual_data_entry"
    STATUS_OVERRIDE = "status_override"
    EMERGENCY_RECOVERY = "emergency_recovery"
    DATA_CORRECTION = "data_correction"
    FILE_QUARANTINE = "file_quarantine"
    BATCH_OPERATION = "batch_operation"


class InterventionPriority(str, Enum):
    """Priority levels for interventions."""
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"
    EMERGENCY = "emergency"


@dataclass
class InterventionRequest:
    """Request for manual intervention."""
    intervention_type: InterventionType
    file_id: int
    user_id: int
    priority: InterventionPriority
    description: str
    requested_by: int  # Admin user ID
    requested_at: datetime
    justification: str
    parameters: Dict[str, Any]
    approval_required: bool = True


@dataclass
class InterventionResult:
    """Result of a manual intervention."""
    success: bool
    intervention_type: InterventionType
    file_id: int
    actions_taken: List[str]
    data_modified: bool
    original_status: str
    new_status: str
    warnings: List[str]
    intervention_timestamp: datetime
    performed_by: int
    audit_trail: Dict[str, Any]


class ManualInterventionService:
    """Service for handling manual interventions by administrators."""
    
    def __init__(self):
        self.recovery_service = DataRecoveryService()
        self.partial_processor = PartialProcessor()
        self.pending_interventions: List[InterventionRequest] = []
    
    def request_intervention(
        self, 
        intervention_type: InterventionType,
        file_id: int,
        admin_user_id: int,
        description: str,
        justification: str,
        priority: InterventionPriority = InterventionPriority.NORMAL,
        parameters: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Request a manual intervention for a file.
        
        Args:
            intervention_type: Type of intervention needed
            file_id: ID of the file requiring intervention
            admin_user_id: ID of the admin requesting the intervention
            description: Description of the issue
            justification: Justification for the intervention
            priority: Priority level
            parameters: Additional parameters for the intervention
            
        Returns:
            Intervention request ID
        """
        # Validate admin permissions
        if not self._validate_admin_permissions(admin_user_id):
            raise HTTPException(status_code=403, detail="Insufficient permissions for intervention request")
        
        # Validate file exists
        with SessionLocal() as db:
            file_record = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
            if not file_record:
                raise HTTPException(status_code=404, detail="File not found")
            
            # Create intervention request
            intervention_request = InterventionRequest(
                intervention_type=intervention_type,
                file_id=file_id,
                user_id=file_record.uploaded_by_id,
                priority=priority,
                description=description,
                requested_by=admin_user_id,
                requested_at=datetime.utcnow(),
                justification=justification,
                parameters=parameters or {},
                approval_required=self._requires_approval(intervention_type, priority)
            )
            
            # Log intervention request
            self._log_intervention_request(db, intervention_request)
            
            # Generate request ID
            request_id = f"INT-{file_id}-{int(datetime.utcnow().timestamp())}"
            
            # Store request
            self.pending_interventions.append(intervention_request)
            
            return request_id
    
    async def execute_intervention(
        self,
        intervention_request: InterventionRequest,
        executing_admin_id: int,
        approved: bool = True
    ) -> InterventionResult:
        """
        Execute a manual intervention.
        
        Args:
            intervention_request: The intervention to execute
            executing_admin_id: ID of the admin executing the intervention
            approved: Whether the intervention is approved (for approval-required interventions)
            
        Returns:
            InterventionResult with the outcome
        """
        if not self._validate_admin_permissions(executing_admin_id):
            raise HTTPException(status_code=403, detail="Insufficient permissions for intervention execution")
        
        if intervention_request.approval_required and not approved:
            raise HTTPException(status_code=403, detail="Intervention requires approval")
        
        with SessionLocal() as db:
            file_record = db.query(UploadedFile).filter(
                UploadedFile.id == intervention_request.file_id
            ).first()
            
            if not file_record:
                raise HTTPException(status_code=404, detail="File not found")
            
            original_status = file_record.status
            
            # Execute intervention based on type
            if intervention_request.intervention_type == InterventionType.FORCE_REPROCESS:
                result = await self._execute_force_reprocess(file_record, intervention_request, executing_admin_id, db)
            elif intervention_request.intervention_type == InterventionType.OVERRIDE_VALIDATION:
                result = await self._execute_override_validation(file_record, intervention_request, executing_admin_id, db)
            elif intervention_request.intervention_type == InterventionType.MANUAL_DATA_ENTRY:
                result = await self._execute_manual_data_entry(file_record, intervention_request, executing_admin_id, db)
            elif intervention_request.intervention_type == InterventionType.STATUS_OVERRIDE:
                result = await self._execute_status_override(file_record, intervention_request, executing_admin_id, db)
            elif intervention_request.intervention_type == InterventionType.EMERGENCY_RECOVERY:
                result = await self._execute_emergency_recovery(file_record, intervention_request, executing_admin_id, db)
            elif intervention_request.intervention_type == InterventionType.DATA_CORRECTION:
                result = await self._execute_data_correction(file_record, intervention_request, executing_admin_id, db)
            elif intervention_request.intervention_type == InterventionType.FILE_QUARANTINE:
                result = await self._execute_file_quarantine(file_record, intervention_request, executing_admin_id, db)
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported intervention type: {intervention_request.intervention_type}")
            
            # Log intervention execution
            self._log_intervention_execution(db, intervention_request, result, executing_admin_id)
            
            return result
    
    async def _execute_force_reprocess(
        self, 
        file_record: UploadedFile, 
        request: InterventionRequest, 
        admin_id: int, 
        db: Session
    ) -> InterventionResult:
        """Execute force reprocess intervention."""
        actions_taken = []
        warnings = []
        
        try:
            # Reset file status
            original_status = file_record.status
            file_record.status = FileStatus.UPLOADED
            file_record.processing_started_at = None
            file_record.processing_completed_at = None
            file_record.validation_errors = None
            file_record.is_valid = None
            
            actions_taken.append("Reset file status to UPLOADED")
            
            # Clear existing parsed data if requested
            if request.parameters.get("clear_parsed_data", False):
                file_record.parsed_data = None
                actions_taken.append("Cleared existing parsed data")
            
            # Trigger reprocessing
            from app.tasks.file_processing import process_uploaded_file
            
            # Queue background processing
            task = process_uploaded_file.delay(
                file_record.id, 
                request.parameters.get("processing_options", {})
            )
            
            actions_taken.append(f"Queued reprocessing task: {task.id}")
            
            # Log intervention
            file_service = FileService(db)
            file_service.log_processing_step(
                file_record.id,
                "manual_intervention",
                f"Force reprocess requested by admin {admin_id}",
                "info",
                json.dumps({
                    "intervention_type": request.intervention_type,
                    "justification": request.justification,
                    "task_id": task.id
                })
            )
            
            db.commit()
            
            return InterventionResult(
                success=True,
                intervention_type=request.intervention_type,
                file_id=file_record.id,
                actions_taken=actions_taken,
                data_modified=True,
                original_status=original_status,
                new_status=file_record.status,
                warnings=warnings,
                intervention_timestamp=datetime.utcnow(),
                performed_by=admin_id,
                audit_trail={
                    "task_id": task.id,
                    "parameters": request.parameters
                }
            )
            
        except Exception as e:
            db.rollback()
            warnings.append(f"Force reprocess failed: {str(e)}")
            
            return InterventionResult(
                success=False,
                intervention_type=request.intervention_type,
                file_id=file_record.id,
                actions_taken=actions_taken,
                data_modified=False,
                original_status=file_record.status,
                new_status=file_record.status,
                warnings=warnings,
                intervention_timestamp=datetime.utcnow(),
                performed_by=admin_id,
                audit_trail={"error": str(e)}
            )
    
    async def _execute_override_validation(
        self, 
        file_record: UploadedFile, 
        request: InterventionRequest, 
        admin_id: int, 
        db: Session
    ) -> InterventionResult:
        """Execute validation override intervention."""
        actions_taken = []
        warnings = []
        
        try:
            original_status = file_record.status
            
            # Override validation
            override_reason = request.parameters.get("override_reason", "Admin override")
            file_record.is_valid = True
            file_record.status = FileStatus.COMPLETED
            
            # Preserve original validation errors but mark as overridden
            if file_record.validation_errors:
                original_errors = json.loads(file_record.validation_errors) if isinstance(file_record.validation_errors, str) else file_record.validation_errors
                
                override_info = {
                    "overridden": True,
                    "override_reason": override_reason,
                    "override_by": admin_id,
                    "override_timestamp": datetime.utcnow().isoformat(),
                    "original_errors": original_errors
                }
                
                file_record.validation_errors = json.dumps(override_info)
                actions_taken.append("Marked validation errors as overridden")
            
            actions_taken.append("Set file as valid and completed")
            
            # Log intervention
            file_service = FileService(db)
            file_service.log_processing_step(
                file_record.id,
                "validation_override",
                f"Validation overridden by admin {admin_id}: {override_reason}",
                "warning",
                json.dumps(request.parameters)
            )
            
            warnings.append("Validation was overridden - review data quality manually")
            
            db.commit()
            
            return InterventionResult(
                success=True,
                intervention_type=request.intervention_type,
                file_id=file_record.id,
                actions_taken=actions_taken,
                data_modified=True,
                original_status=original_status,
                new_status=file_record.status,
                warnings=warnings,
                intervention_timestamp=datetime.utcnow(),
                performed_by=admin_id,
                audit_trail={
                    "override_reason": override_reason,
                    "original_errors_preserved": bool(file_record.validation_errors)
                }
            )
            
        except Exception as e:
            db.rollback()
            warnings.append(f"Validation override failed: {str(e)}")
            
            return InterventionResult(
                success=False,
                intervention_type=request.intervention_type,
                file_id=file_record.id,
                actions_taken=actions_taken,
                data_modified=False,
                original_status=file_record.status,
                new_status=file_record.status,
                warnings=warnings,
                intervention_timestamp=datetime.utcnow(),
                performed_by=admin_id,
                audit_trail={"error": str(e)}
            )
    
    async def _execute_manual_data_entry(
        self, 
        file_record: UploadedFile, 
        request: InterventionRequest, 
        admin_id: int, 
        db: Session
    ) -> InterventionResult:
        """Execute manual data entry intervention."""
        actions_taken = []
        warnings = []
        
        try:
            manual_data = request.parameters.get("manual_data", {})
            
            if not manual_data:
                raise ValueError("No manual data provided")
            
            # Get existing parsed data or create new
            existing_data = {}
            if file_record.parsed_data:
                existing_data = json.loads(file_record.parsed_data) if isinstance(file_record.parsed_data, str) else file_record.parsed_data
            
            # Merge manual data
            merged_data = existing_data.copy()
            merged_data.update(manual_data)
            
            # Add manual entry metadata
            merged_data["manual_intervention"] = {
                "performed_by": admin_id,
                "timestamp": datetime.utcnow().isoformat(),
                "manual_fields": list(manual_data.keys()),
                "justification": request.justification
            }
            
            file_record.parsed_data = json.dumps(merged_data)
            file_record.status = FileStatus.COMPLETED
            file_record.is_valid = True
            
            actions_taken.append(f"Added manual data for {len(manual_data)} fields")
            actions_taken.append("Updated file status to completed")
            
            # Log intervention
            file_service = FileService(db)
            file_service.log_processing_step(
                file_record.id,
                "manual_data_entry",
                f"Manual data entry by admin {admin_id}",
                "info",
                json.dumps({
                    "fields_added": list(manual_data.keys()),
                    "justification": request.justification
                })
            )
            
            warnings.append("File contains manually entered data - verify accuracy")
            
            db.commit()
            
            return InterventionResult(
                success=True,
                intervention_type=request.intervention_type,
                file_id=file_record.id,
                actions_taken=actions_taken,
                data_modified=True,
                original_status=file_record.status,
                new_status=FileStatus.COMPLETED,
                warnings=warnings,
                intervention_timestamp=datetime.utcnow(),
                performed_by=admin_id,
                audit_trail={
                    "manual_fields": list(manual_data.keys()),
                    "data_size": len(json.dumps(manual_data))
                }
            )
            
        except Exception as e:
            db.rollback()
            warnings.append(f"Manual data entry failed: {str(e)}")
            
            return InterventionResult(
                success=False,
                intervention_type=request.intervention_type,
                file_id=file_record.id,
                actions_taken=actions_taken,
                data_modified=False,
                original_status=file_record.status,
                new_status=file_record.status,
                warnings=warnings,
                intervention_timestamp=datetime.utcnow(),
                performed_by=admin_id,
                audit_trail={"error": str(e)}
            )
    
    async def _execute_status_override(
        self, 
        file_record: UploadedFile, 
        request: InterventionRequest, 
        admin_id: int, 
        db: Session
    ) -> InterventionResult:
        """Execute status override intervention."""
        actions_taken = []
        warnings = []
        
        try:
            original_status = file_record.status
            new_status = request.parameters.get("new_status")
            
            if not new_status:
                raise ValueError("No new status specified")
            
            # Validate new status
            try:
                new_status_enum = FileStatus(new_status)
            except ValueError:
                raise ValueError(f"Invalid status: {new_status}")
            
            file_record.status = new_status_enum
            
            # Update related fields based on new status
            if new_status_enum == FileStatus.COMPLETED:
                file_record.processing_completed_at = datetime.utcnow()
                if file_record.is_valid is None:
                    file_record.is_valid = True
            elif new_status_enum == FileStatus.FAILED:
                file_record.processing_completed_at = datetime.utcnow()
                file_record.is_valid = False
            elif new_status_enum == FileStatus.PROCESSING:
                file_record.processing_started_at = datetime.utcnow()
                file_record.processing_completed_at = None
            
            actions_taken.append(f"Changed status from {original_status} to {new_status}")
            
            # Log intervention
            file_service = FileService(db)
            file_service.log_processing_step(
                file_record.id,
                "status_override",
                f"Status overridden by admin {admin_id}: {original_status} -> {new_status}",
                "warning",
                json.dumps({
                    "original_status": original_status,
                    "new_status": new_status,
                    "justification": request.justification
                })
            )
            
            warnings.append("Status was manually overridden - verify file state")
            
            db.commit()
            
            return InterventionResult(
                success=True,
                intervention_type=request.intervention_type,
                file_id=file_record.id,
                actions_taken=actions_taken,
                data_modified=True,
                original_status=original_status,
                new_status=new_status,
                warnings=warnings,
                intervention_timestamp=datetime.utcnow(),
                performed_by=admin_id,
                audit_trail={
                    "status_change": f"{original_status} -> {new_status}"
                }
            )
            
        except Exception as e:
            db.rollback()
            warnings.append(f"Status override failed: {str(e)}")
            
            return InterventionResult(
                success=False,
                intervention_type=request.intervention_type,
                file_id=file_record.id,
                actions_taken=actions_taken,
                data_modified=False,
                original_status=file_record.status,
                new_status=file_record.status,
                warnings=warnings,
                intervention_timestamp=datetime.utcnow(),
                performed_by=admin_id,
                audit_trail={"error": str(e)}
            )
    
    # Additional intervention methods would be implemented here...
    
    async def _execute_emergency_recovery(self, file_record: UploadedFile, request: InterventionRequest, admin_id: int, db: Session) -> InterventionResult:
        """Execute emergency recovery intervention."""
        # Placeholder - would integrate with data recovery service
        return InterventionResult(
            success=False,
            intervention_type=request.intervention_type,
            file_id=file_record.id,
            actions_taken=["emergency_recovery_not_implemented"],
            data_modified=False,
            original_status=file_record.status,
            new_status=file_record.status,
            warnings=["Emergency recovery not yet implemented"],
            intervention_timestamp=datetime.utcnow(),
            performed_by=admin_id,
            audit_trail={}
        )
    
    async def _execute_data_correction(self, file_record: UploadedFile, request: InterventionRequest, admin_id: int, db: Session) -> InterventionResult:
        """Execute data correction intervention."""
        # Implementation would go here
        return InterventionResult(
            success=False,
            intervention_type=request.intervention_type,
            file_id=file_record.id,
            actions_taken=["data_correction_not_implemented"],
            data_modified=False,
            original_status=file_record.status,
            new_status=file_record.status,
            warnings=["Data correction not yet implemented"],
            intervention_timestamp=datetime.utcnow(),
            performed_by=admin_id,
            audit_trail={}
        )
    
    async def _execute_file_quarantine(self, file_record: UploadedFile, request: InterventionRequest, admin_id: int, db: Session) -> InterventionResult:
        """Execute file quarantine intervention."""
        # Implementation would go here
        return InterventionResult(
            success=False,
            intervention_type=request.intervention_type,
            file_id=file_record.id,
            actions_taken=["file_quarantine_not_implemented"],
            data_modified=False,
            original_status=file_record.status,
            new_status=file_record.status,
            warnings=["File quarantine not yet implemented"],
            intervention_timestamp=datetime.utcnow(),
            performed_by=admin_id,
            audit_trail={}
        )
    
    def _validate_admin_permissions(self, admin_user_id: int) -> bool:
        """Validate that user has admin permissions for interventions."""
        with SessionLocal() as db:
            user = db.query(User).filter(User.id == admin_user_id).first()
            if not user:
                return False
            
            # Check if user has admin role
            # This would depend on your role system implementation
            return user.is_active and hasattr(user, 'is_admin') and user.is_admin
    
    def _requires_approval(self, intervention_type: InterventionType, priority: InterventionPriority) -> bool:
        """Check if intervention requires approval."""
        high_risk_interventions = [
            InterventionType.OVERRIDE_VALIDATION,
            InterventionType.MANUAL_DATA_ENTRY,
            InterventionType.EMERGENCY_RECOVERY
        ]
        
        return (
            intervention_type in high_risk_interventions or 
            priority in [InterventionPriority.URGENT, InterventionPriority.EMERGENCY]
        )
    
    def _log_intervention_request(self, db: Session, request: InterventionRequest):
        """Log intervention request for audit trail."""
        file_service = FileService(db)
        file_service.log_processing_step(
            request.file_id,
            "intervention_requested",
            f"Manual intervention requested: {request.intervention_type}",
            "info",
            json.dumps({
                "intervention_type": request.intervention_type,
                "priority": request.priority,
                "requested_by": request.requested_by,
                "justification": request.justification,
                "parameters": request.parameters
            })
        )
    
    def _log_intervention_execution(self, db: Session, request: InterventionRequest, result: InterventionResult, admin_id: int):
        """Log intervention execution for audit trail."""
        file_service = FileService(db)
        file_service.log_processing_step(
            request.file_id,
            "intervention_executed",
            f"Manual intervention executed: {request.intervention_type} - {'Success' if result.success else 'Failed'}",
            "info" if result.success else "error",
            json.dumps({
                "intervention_type": request.intervention_type,
                "success": result.success,
                "actions_taken": result.actions_taken,
                "executed_by": admin_id,
                "warnings": result.warnings,
                "audit_trail": result.audit_trail
            })
        )
    
    def get_intervention_history(self, file_id: int) -> List[Dict[str, Any]]:
        """Get intervention history for a file."""
        with SessionLocal() as db:
            logs = db.query(ProcessingLog).filter(
                and_(
                    ProcessingLog.file_id == file_id,
                    ProcessingLog.step.in_(['intervention_requested', 'intervention_executed'])
                )
            ).order_by(ProcessingLog.timestamp.desc()).all()
            
            return [
                {
                    "timestamp": log.timestamp.isoformat(),
                    "step": log.step,
                    "message": log.message,
                    "level": log.level,
                    "details": json.loads(log.details) if log.details else None
                }
                for log in logs
            ]
    
    def get_pending_interventions(self) -> List[InterventionRequest]:
        """Get list of pending interventions."""
        return self.pending_interventions.copy() 