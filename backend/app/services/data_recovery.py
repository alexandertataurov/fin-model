import os
import json
import shutil
import hashlib
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from pathlib import Path
from dataclasses import dataclass
from enum import Enum
import zipfile
import tempfile

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.models.base import SessionLocal
from app.models.file import UploadedFile, ProcessingLog, FileStatus
from app.models.user import User
from app.services.cloud_storage import CloudStorageManager
from app.services.partial_processor import PartialProcessor
from app.core.config import settings


class RecoveryType(str, Enum):
    """Types of data recovery operations."""

    FILE_CORRUPTION = "file_corruption"
    PROCESSING_FAILURE = "processing_failure"
    STORAGE_FAILURE = "storage_failure"
    DATA_LOSS = "data_loss"
    BACKUP_RESTORE = "backup_restore"
    VERSION_ROLLBACK = "version_rollback"


class RecoveryStatus(str, Enum):
    """Status of recovery operations."""

    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    SUCCESSFUL = "successful"
    PARTIAL = "partial"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class RecoveryAction:
    """Represents a recovery action that can be taken."""

    action_type: RecoveryType
    description: str
    priority: int  # 1=highest, 5=lowest
    estimated_success_rate: float  # 0-1
    required_resources: List[str]
    prerequisites: List[str]
    side_effects: List[str]
    execution_time_minutes: int


@dataclass
class RecoveryResult:
    """Result of a recovery operation."""

    success: bool
    recovery_type: RecoveryType
    recovered_data: Optional[Dict[str, Any]]
    actions_taken: List[str]
    files_recovered: List[str]
    data_integrity_score: float  # 0-1
    recovery_timestamp: datetime
    warnings: List[str]
    next_steps: List[str]


class DataRecoveryService:
    """Service for recovering from data loss and corruption scenarios."""

    def __init__(self):
        self.storage_manager = CloudStorageManager()
        self.partial_processor = PartialProcessor()
        self.backup_retention_days = getattr(settings, "BACKUP_RETENTION_DAYS", 30)
        self.recovery_temp_dir = Path(tempfile.gettempdir()) / "finvision_recovery"
        self.recovery_temp_dir.mkdir(exist_ok=True)

    def analyze_recovery_options(
        self, file_id: int, user_id: int
    ) -> List[RecoveryAction]:
        """
        Analyze available recovery options for a failed file.

        Args:
            file_id: ID of the failed file
            user_id: ID of the user who owns the file

        Returns:
            List of possible recovery actions, ordered by priority
        """
        recovery_actions = []

        with SessionLocal() as db:
            file_record = (
                db.query(UploadedFile)
                .filter(
                    and_(
                        UploadedFile.id == file_id,
                        UploadedFile.uploaded_by_id == user_id,
                    )
                )
                .first()
            )

            if not file_record:
                return recovery_actions

            # Check file corruption recovery options
            if file_record.status == FileStatus.FAILED:
                recovery_actions.extend(
                    self._analyze_corruption_recovery(file_record, db)
                )

            # Check backup recovery options
            backup_actions = self._analyze_backup_recovery(file_record, db)
            recovery_actions.extend(backup_actions)

            # Check partial processing options
            if file_record.validation_errors:
                partial_actions = self._analyze_partial_processing_recovery(
                    file_record, db
                )
                recovery_actions.extend(partial_actions)

            # Check storage recovery options
            storage_actions = self._analyze_storage_recovery(file_record, db)
            recovery_actions.extend(storage_actions)

            # Sort by priority (lower number = higher priority)
            recovery_actions.sort(key=lambda x: x.priority)

        return recovery_actions

    def _analyze_corruption_recovery(
        self, file_record: UploadedFile, db: Session
    ) -> List[RecoveryAction]:
        """Analyze file corruption recovery options."""
        actions = []

        # Check if file exists physically
        file_exists = os.path.exists(file_record.file_path)

        if file_exists:
            actions.append(
                RecoveryAction(
                    action_type=RecoveryType.FILE_CORRUPTION,
                    description="Attempt partial data extraction from corrupted file",
                    priority=2,
                    estimated_success_rate=0.7,
                    required_resources=["file_path", "processing_engine"],
                    prerequisites=["file_accessible"],
                    side_effects=["may_lose_some_data"],
                    execution_time_minutes=10,
                )
            )

            actions.append(
                RecoveryAction(
                    action_type=RecoveryType.FILE_CORRUPTION,
                    description="Try alternative Excel parsing libraries",
                    priority=3,
                    estimated_success_rate=0.5,
                    required_resources=["alternative_parsers"],
                    prerequisites=["file_accessible"],
                    side_effects=["different_data_interpretation"],
                    execution_time_minutes=15,
                )
            )

        return actions

    def _analyze_backup_recovery(
        self, file_record: UploadedFile, db: Session
    ) -> List[RecoveryAction]:
        """Analyze backup recovery options."""
        actions = []

        # Check for file backups
        backup_files = self._find_file_backups(file_record)

        if backup_files:
            actions.append(
                RecoveryAction(
                    action_type=RecoveryType.BACKUP_RESTORE,
                    description=f"Restore from backup ({len(backup_files)} versions available)",
                    priority=1,
                    estimated_success_rate=0.9,
                    required_resources=["backup_storage"],
                    prerequisites=["backup_exists"],
                    side_effects=["may_lose_recent_changes"],
                    execution_time_minutes=5,
                )
            )

        # Check for processing logs that might contain extracted data
        processing_logs = (
            db.query(ProcessingLog)
            .filter(ProcessingLog.file_id == file_record.id)
            .all()
        )

        if processing_logs:
            # Look for logs that might contain partial data
            data_logs = [
                log
                for log in processing_logs
                if log.details and "data" in log.details.lower()
            ]

            if data_logs:
                actions.append(
                    RecoveryAction(
                        action_type=RecoveryType.DATA_LOSS,
                        description="Recover partial data from processing logs",
                        priority=2,
                        estimated_success_rate=0.6,
                        required_resources=["processing_logs"],
                        prerequisites=["logs_exist"],
                        side_effects=["incomplete_dataset"],
                        execution_time_minutes=8,
                    )
                )

        return actions

    def _analyze_partial_processing_recovery(
        self, file_record: UploadedFile, db: Session
    ) -> List[RecoveryAction]:
        """Analyze partial processing recovery options."""
        actions = []

        if file_record.validation_errors:
            validation_errors = (
                json.loads(file_record.validation_errors)
                if isinstance(file_record.validation_errors, str)
                else file_record.validation_errors
            )

            # Count different types of errors
            if isinstance(validation_errors, dict):
                errors = validation_errors.get("errors", [])
                warnings = validation_errors.get("warnings", [])

                if len(warnings) > len(errors):
                    # More warnings than errors - good candidate for partial processing
                    actions.append(
                        RecoveryAction(
                            action_type=RecoveryType.PROCESSING_FAILURE,
                            description="Process file ignoring non-critical validation errors",
                            priority=1,
                            estimated_success_rate=0.8,
                            required_resources=["partial_processor"],
                            prerequisites=["validation_results"],
                            side_effects=["reduced_data_quality"],
                            execution_time_minutes=12,
                        )
                    )

                if len(errors) < 5:
                    # Few errors - might be fixable
                    actions.append(
                        RecoveryAction(
                            action_type=RecoveryType.PROCESSING_FAILURE,
                            description="Attempt automatic error correction and reprocessing",
                            priority=2,
                            estimated_success_rate=0.6,
                            required_resources=["auto_fix_engine"],
                            prerequisites=["error_analysis"],
                            side_effects=["modified_data_structure"],
                            execution_time_minutes=15,
                        )
                    )

        return actions

    def _analyze_storage_recovery(
        self, file_record: UploadedFile, db: Session
    ) -> List[RecoveryAction]:
        """Analyze storage-related recovery options."""
        actions = []

        # Check if file exists in storage
        file_exists = (
            os.path.exists(file_record.file_path) if file_record.file_path else False
        )

        if not file_exists:
            actions.append(
                RecoveryAction(
                    action_type=RecoveryType.STORAGE_FAILURE,
                    description="Attempt to recover file from cloud storage backup",
                    priority=2,
                    estimated_success_rate=0.7,
                    required_resources=["cloud_storage_access"],
                    prerequisites=["cloud_backup_exists"],
                    side_effects=["network_dependency"],
                    execution_time_minutes=10,
                )
            )

            # Check for temporary files
            temp_files = self._find_temp_files(file_record)
            if temp_files:
                actions.append(
                    RecoveryAction(
                        action_type=RecoveryType.STORAGE_FAILURE,
                        description="Recover from temporary processing files",
                        priority=3,
                        estimated_success_rate=0.5,
                        required_resources=["temp_storage_access"],
                        prerequisites=["temp_files_exist"],
                        side_effects=["incomplete_processing_state"],
                        execution_time_minutes=5,
                    )
                )

        return actions

    async def execute_recovery(
        self, file_id: int, user_id: int, recovery_action: RecoveryAction
    ) -> RecoveryResult:
        """
        Execute a specific recovery action.

        Args:
            file_id: ID of the file to recover
            user_id: ID of the user who owns the file
            recovery_action: The recovery action to execute

        Returns:
            RecoveryResult with the outcome of the recovery attempt
        """
        start_time = datetime.utcnow()

        with SessionLocal() as db:
            file_record = (
                db.query(UploadedFile)
                .filter(
                    and_(
                        UploadedFile.id == file_id,
                        UploadedFile.uploaded_by_id == user_id,
                    )
                )
                .first()
            )

            if not file_record:
                return RecoveryResult(
                    success=False,
                    recovery_type=recovery_action.action_type,
                    recovered_data=None,
                    actions_taken=["file_lookup_failed"],
                    files_recovered=[],
                    data_integrity_score=0.0,
                    recovery_timestamp=start_time,
                    warnings=["File not found or access denied"],
                    next_steps=["Verify file ID and user permissions"],
                )

            # Execute recovery based on type
            if recovery_action.action_type == RecoveryType.BACKUP_RESTORE:
                return await self._execute_backup_restore(
                    file_record, recovery_action, db
                )
            elif recovery_action.action_type == RecoveryType.FILE_CORRUPTION:
                return await self._execute_corruption_recovery(
                    file_record, recovery_action, db
                )
            elif recovery_action.action_type == RecoveryType.PROCESSING_FAILURE:
                return await self._execute_processing_recovery(
                    file_record, recovery_action, db
                )
            elif recovery_action.action_type == RecoveryType.STORAGE_FAILURE:
                return await self._execute_storage_recovery(
                    file_record, recovery_action, db
                )
            elif recovery_action.action_type == RecoveryType.DATA_LOSS:
                return await self._execute_data_recovery(
                    file_record, recovery_action, db
                )
            else:
                return RecoveryResult(
                    success=False,
                    recovery_type=recovery_action.action_type,
                    recovered_data=None,
                    actions_taken=["unsupported_recovery_type"],
                    files_recovered=[],
                    data_integrity_score=0.0,
                    recovery_timestamp=start_time,
                    warnings=[
                        f"Recovery type {recovery_action.action_type} not implemented"
                    ],
                    next_steps=["Contact support for manual recovery"],
                )

    async def _execute_backup_restore(
        self, file_record: UploadedFile, action: RecoveryAction, db: Session
    ) -> RecoveryResult:
        """Execute backup restore recovery."""
        actions_taken = []
        recovered_files = []
        warnings = []

        try:
            # Find backup files
            backup_files = self._find_file_backups(file_record)

            if not backup_files:
                return RecoveryResult(
                    success=False,
                    recovery_type=RecoveryType.BACKUP_RESTORE,
                    recovered_data=None,
                    actions_taken=["backup_search_failed"],
                    files_recovered=[],
                    data_integrity_score=0.0,
                    recovery_timestamp=datetime.utcnow(),
                    warnings=["No backup files found"],
                    next_steps=["Try alternative recovery methods"],
                )

            # Use the most recent backup
            latest_backup = max(backup_files, key=lambda x: x["timestamp"])
            actions_taken.append(f"Selected backup from {latest_backup['timestamp']}")

            # Restore the backup
            restored_path = await self._restore_backup_file(latest_backup, file_record)

            if restored_path:
                actions_taken.append("Backup file restored successfully")
                recovered_files.append(restored_path)

                # Update file record
                file_record.file_path = restored_path
                file_record.status = FileStatus.UPLOADED
                file_record.validation_errors = None
                db.commit()

                actions_taken.append("Database record updated")

                return RecoveryResult(
                    success=True,
                    recovery_type=RecoveryType.BACKUP_RESTORE,
                    recovered_data={"restored_file_path": restored_path},
                    actions_taken=actions_taken,
                    files_recovered=recovered_files,
                    data_integrity_score=0.95,  # High integrity for backup restore
                    recovery_timestamp=datetime.utcnow(),
                    warnings=warnings,
                    next_steps=["Reprocess the restored file", "Verify data integrity"],
                )
            else:
                warnings.append("Backup restore failed")

        except Exception as e:
            warnings.append(f"Backup restore error: {str(e)}")

        return RecoveryResult(
            success=False,
            recovery_type=RecoveryType.BACKUP_RESTORE,
            recovered_data=None,
            actions_taken=actions_taken,
            files_recovered=recovered_files,
            data_integrity_score=0.0,
            recovery_timestamp=datetime.utcnow(),
            warnings=warnings,
            next_steps=["Try partial processing recovery", "Contact support"],
        )

    async def _execute_corruption_recovery(
        self, file_record: UploadedFile, action: RecoveryAction, db: Session
    ) -> RecoveryResult:
        """Execute file corruption recovery."""
        actions_taken = []
        warnings = []

        try:
            # Attempt partial processing
            actions_taken.append("Starting partial processing recovery")

            # Create a fake validation result for partial processing
            fake_validation = type(
                "obj",
                (object,),
                {
                    "is_valid": False,
                    "errors": ["File corruption detected"],
                    "warnings": [],
                },
            )()

            partial_result = self.partial_processor.process_with_issues(
                file_record.file_path, fake_validation
            )

            actions_taken.append(
                f"Partial processing completed: {partial_result.completion_percentage:.1f}%"
            )

            if partial_result.success and partial_result.extracted_data:
                # Update file record with partial data
                file_record.parsed_data = json.dumps(partial_result.extracted_data)
                file_record.status = FileStatus.COMPLETED
                file_record.is_valid = partial_result.completion_percentage > 50

                # Store recovery information
                recovery_info = {
                    "recovery_type": "partial_processing",
                    "completion_percentage": partial_result.completion_percentage,
                    "issues_count": len(partial_result.issues_encountered),
                    "sheets_recovered": partial_result.sheets_processed,
                }

                file_record.validation_errors = json.dumps(
                    {
                        "recovery_info": recovery_info,
                        "original_errors": json.loads(file_record.validation_errors)
                        if file_record.validation_errors
                        else [],
                    }
                )

                db.commit()
                actions_taken.append("File record updated with recovered data")

                return RecoveryResult(
                    success=True,
                    recovery_type=RecoveryType.FILE_CORRUPTION,
                    recovered_data=partial_result.extracted_data,
                    actions_taken=actions_taken,
                    files_recovered=[file_record.file_path],
                    data_integrity_score=partial_result.completion_percentage / 100,
                    recovery_timestamp=datetime.utcnow(),
                    warnings=warnings
                    + [i.description for i in partial_result.issues_encountered],
                    next_steps=partial_result.recommendations,
                )
            else:
                warnings.append("Partial processing failed to extract meaningful data")

        except Exception as e:
            warnings.append(f"Corruption recovery error: {str(e)}")
            actions_taken.append(f"Recovery failed with error: {str(e)}")

        return RecoveryResult(
            success=False,
            recovery_type=RecoveryType.FILE_CORRUPTION,
            recovered_data=None,
            actions_taken=actions_taken,
            files_recovered=[],
            data_integrity_score=0.0,
            recovery_timestamp=datetime.utcnow(),
            warnings=warnings,
            next_steps=["Try backup restore", "Contact support for manual recovery"],
        )

    # Additional recovery methods would be implemented here...

    def _find_file_backups(self, file_record: UploadedFile) -> List[Dict[str, Any]]:
        """Find backup files for the given file record."""
        backups = []

        # Look for backup files in storage
        backup_pattern = f"{file_record.original_filename}.backup.*"
        backup_dir = Path(file_record.file_path).parent / "backups"

        if backup_dir.exists():
            for backup_file in backup_dir.glob(backup_pattern):
                if backup_file.is_file():
                    backups.append(
                        {
                            "path": str(backup_file),
                            "timestamp": datetime.fromtimestamp(
                                backup_file.stat().st_mtime
                            ),
                            "size": backup_file.stat().st_size,
                        }
                    )

        return backups

    def _find_temp_files(self, file_record: UploadedFile) -> List[str]:
        """Find temporary files related to the file record."""
        temp_files = []

        # Look in recovery temp directory
        temp_pattern = f"*{file_record.id}*"

        for temp_file in self.recovery_temp_dir.glob(temp_pattern):
            if temp_file.is_file():
                temp_files.append(str(temp_file))

        return temp_files

    async def _restore_backup_file(
        self, backup_info: Dict[str, Any], file_record: UploadedFile
    ) -> Optional[str]:
        """Restore a backup file."""
        try:
            backup_path = backup_info["path"]

            if os.path.exists(backup_path):
                # Copy backup to original location
                restored_path = file_record.file_path + ".restored"
                shutil.copy2(backup_path, restored_path)
                return restored_path

        except Exception as e:
            print(f"Backup restore failed: {e}")

        return None

    # Placeholder methods for other recovery types
    async def _execute_processing_recovery(
        self, file_record: UploadedFile, action: RecoveryAction, db: Session
    ) -> RecoveryResult:
        """Execute processing failure recovery."""
        # Implementation would go here
        return RecoveryResult(
            success=False,
            recovery_type=RecoveryType.PROCESSING_FAILURE,
            recovered_data=None,
            actions_taken=["not_implemented"],
            files_recovered=[],
            data_integrity_score=0.0,
            recovery_timestamp=datetime.utcnow(),
            warnings=["Processing recovery not yet implemented"],
            next_steps=["Use partial processing instead"],
        )

    async def _execute_storage_recovery(
        self, file_record: UploadedFile, action: RecoveryAction, db: Session
    ) -> RecoveryResult:
        """Execute storage failure recovery."""
        # Implementation would go here
        return RecoveryResult(
            success=False,
            recovery_type=RecoveryType.STORAGE_FAILURE,
            recovered_data=None,
            actions_taken=["not_implemented"],
            files_recovered=[],
            data_integrity_score=0.0,
            recovery_timestamp=datetime.utcnow(),
            warnings=["Storage recovery not yet implemented"],
            next_steps=["Contact system administrator"],
        )

    async def _execute_data_recovery(
        self, file_record: UploadedFile, action: RecoveryAction, db: Session
    ) -> RecoveryResult:
        """Execute data loss recovery."""
        # Implementation would go here
        return RecoveryResult(
            success=False,
            recovery_type=RecoveryType.DATA_LOSS,
            recovered_data=None,
            actions_taken=["not_implemented"],
            files_recovered=[],
            data_integrity_score=0.0,
            recovery_timestamp=datetime.utcnow(),
            warnings=["Data recovery not yet implemented"],
            next_steps=["Try backup restore"],
        )
