import os
import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from pathlib import Path
import logging

from app.models.base import SessionLocal
from app.models.file import UploadedFile, ProcessingLog, FileStatus
from app.models.user import User
from app.services.cloud_storage import CloudStorageManager
from app.core.config import settings

logger = logging.getLogger(__name__)


class FileRetentionPolicy:
    """Defines file retention policies based on various criteria."""

    def __init__(
        self,
        name: str,
        description: str,
        retention_days: int,
        applies_to_status: List[FileStatus] = None,
        applies_to_file_types: List[str] = None,
        user_tier_specific: Optional[str] = None,
        size_threshold_mb: Optional[float] = None,
        auto_cleanup: bool = True,
    ):
        self.name = name
        self.description = description
        self.retention_days = retention_days
        self.applies_to_status = applies_to_status or []
        self.applies_to_file_types = applies_to_file_types or []
        self.user_tier_specific = user_tier_specific
        self.size_threshold_mb = size_threshold_mb
        self.auto_cleanup = auto_cleanup

    def applies_to_file(self, file_record: UploadedFile, user: User = None) -> bool:
        """Check if this policy applies to a specific file."""
        # Check status
        if self.applies_to_status and file_record.status not in self.applies_to_status:
            return False

        # Check file type
        if (
            self.applies_to_file_types
            and file_record.file_type not in self.applies_to_file_types
        ):
            return False

        # Check user tier (if user provided)
        if self.user_tier_specific and user:
            user_tier = getattr(user, "tier", "basic")
            if user_tier != self.user_tier_specific:
                return False

        # Check size threshold
        if self.size_threshold_mb:
            file_size_mb = file_record.file_size / (1024 * 1024)
            if file_size_mb < self.size_threshold_mb:
                return False

        return True

    def is_file_expired(self, file_record: UploadedFile) -> bool:
        """Check if a file has exceeded its retention period."""
        cutoff_date = datetime.utcnow() - timedelta(days=self.retention_days)
        return file_record.created_at < cutoff_date


class FileCleanupService:
    """Service for managing file cleanup and retention policies."""

    def __init__(self):
        self.storage_manager = CloudStorageManager()
        self.policies = self._load_retention_policies()

    def _load_retention_policies(self) -> List[FileRetentionPolicy]:
        """Load file retention policies from configuration."""
        default_policies = [
            # Failed files - shorter retention
            FileRetentionPolicy(
                name="failed_files",
                description="Failed processing files",
                retention_days=getattr(settings, "FAILED_FILES_RETENTION_DAYS", 7),
                applies_to_status=[FileStatus.FAILED],
                auto_cleanup=True,
            ),
            # Completed files - longer retention
            FileRetentionPolicy(
                name="completed_files",
                description="Successfully processed files",
                retention_days=getattr(settings, "COMPLETED_FILES_RETENTION_DAYS", 90),
                applies_to_status=[FileStatus.COMPLETED],
                auto_cleanup=True,
            ),
            # Cancelled files - short retention
            FileRetentionPolicy(
                name="cancelled_files",
                description="Cancelled processing files",
                retention_days=getattr(settings, "CANCELLED_FILES_RETENTION_DAYS", 3),
                applies_to_status=[FileStatus.CANCELLED],
                auto_cleanup=True,
            ),
            # Large files - shorter retention regardless of status
            FileRetentionPolicy(
                name="large_files",
                description="Files larger than 25MB",
                retention_days=getattr(settings, "LARGE_FILES_RETENTION_DAYS", 30),
                size_threshold_mb=25.0,
                auto_cleanup=True,
            ),
            # Premium user files - longer retention
            FileRetentionPolicy(
                name="premium_user_files",
                description="Files from premium users",
                retention_days=getattr(settings, "PREMIUM_FILES_RETENTION_DAYS", 180),
                user_tier_specific="premium",
                auto_cleanup=False,  # Manual cleanup for premium users
            ),
            # Test/demo files - very short retention
            FileRetentionPolicy(
                name="demo_files",
                description="Demo and test files",
                retention_days=getattr(settings, "DEMO_FILES_RETENTION_DAYS", 1),
                applies_to_file_types=["demo", "test"],
                auto_cleanup=True,
            ),
        ]

        return default_policies

    async def cleanup_expired_files(self, dry_run: bool = False) -> Dict[str, Any]:
        """
        Clean up files that have exceeded their retention period.

        Args:
            dry_run: If True, only identify files for cleanup without deleting

        Returns:
            Dict containing cleanup results
        """
        cleanup_results = {
            "files_processed": 0,
            "files_deleted": 0,
            "storage_freed_mb": 0,
            "policies_applied": {},
            "errors": [],
            "dry_run": dry_run,
            "cleanup_timestamp": datetime.utcnow().isoformat(),
        }

        with SessionLocal() as db:
            try:
                for policy in self.policies:
                    if not policy.auto_cleanup:
                        continue

                    policy_results = await self._apply_cleanup_policy(
                        db, policy, dry_run
                    )
                    cleanup_results["policies_applied"][policy.name] = policy_results
                    cleanup_results["files_processed"] += policy_results[
                        "files_identified"
                    ]
                    cleanup_results["files_deleted"] += policy_results["files_deleted"]
                    cleanup_results["storage_freed_mb"] += policy_results[
                        "storage_freed_mb"
                    ]
                    cleanup_results["errors"].extend(policy_results["errors"])

                logger.info(
                    f"Cleanup completed: {cleanup_results['files_deleted']} files deleted, "
                    f"{cleanup_results['storage_freed_mb']:.2f} MB freed"
                )

            except Exception as e:
                error_msg = f"Cleanup process failed: {str(e)}"
                logger.error(error_msg)
                cleanup_results["errors"].append(error_msg)

        return cleanup_results

    async def _apply_cleanup_policy(
        self, db: Session, policy: FileRetentionPolicy, dry_run: bool
    ) -> Dict[str, Any]:
        """Apply a specific cleanup policy."""
        policy_results = {
            "policy_name": policy.name,
            "files_identified": 0,
            "files_deleted": 0,
            "storage_freed_mb": 0,
            "errors": [],
        }

        try:
            # Find files that match this policy
            cutoff_date = datetime.utcnow() - timedelta(days=policy.retention_days)

            query = db.query(UploadedFile).filter(UploadedFile.created_at < cutoff_date)

            # Apply status filter
            if policy.applies_to_status:
                query = query.filter(UploadedFile.status.in_(policy.applies_to_status))

            # Apply file type filter
            if policy.applies_to_file_types:
                query = query.filter(
                    UploadedFile.file_type.in_(policy.applies_to_file_types)
                )

            # Apply size filter
            if policy.size_threshold_mb:
                size_bytes = policy.size_threshold_mb * 1024 * 1024
                query = query.filter(UploadedFile.file_size >= size_bytes)

            files_to_cleanup = query.all()
            policy_results["files_identified"] = len(files_to_cleanup)

            for file_record in files_to_cleanup:
                try:
                    # Additional user-specific checks
                    user = (
                        db.query(User)
                        .filter(User.id == file_record.uploaded_by_id)
                        .first()
                    )
                    if not policy.applies_to_file(file_record, user):
                        continue

                    if not dry_run:
                        # Delete physical file
                        file_deleted = await self._delete_physical_file(file_record)

                        if file_deleted:
                            # Delete database record
                            db.delete(file_record)

                            policy_results["files_deleted"] += 1
                            policy_results[
                                "storage_freed_mb"
                            ] += file_record.file_size / (1024 * 1024)

                            logger.debug(
                                f"Deleted file {file_record.original_filename} (Policy: {policy.name})"
                            )
                    else:
                        # Dry run - just count
                        policy_results["files_deleted"] += 1
                        policy_results["storage_freed_mb"] += file_record.file_size / (
                            1024 * 1024
                        )

                except Exception as e:
                    error_msg = f"Failed to delete file {file_record.id}: {str(e)}"
                    policy_results["errors"].append(error_msg)
                    logger.error(error_msg)

            if not dry_run and policy_results["files_deleted"] > 0:
                db.commit()

        except Exception as e:
            error_msg = f"Policy {policy.name} failed: {str(e)}"
            policy_results["errors"].append(error_msg)
            logger.error(error_msg)
            db.rollback()

        return policy_results

    async def _delete_physical_file(self, file_record: UploadedFile) -> bool:
        """Delete the physical file from storage."""
        try:
            # Try to delete from cloud storage first
            if file_record.file_path.startswith(("s3://", "azure://")):
                # Extract path from cloud storage URL
                storage_path = file_record.file_path.split("://", 1)[1]
                if "/" in storage_path:
                    storage_path = storage_path.split("/", 1)[1]

                return await self.storage_manager.delete_file(storage_path)
            else:
                # Delete from local storage
                if os.path.exists(file_record.file_path):
                    os.unlink(file_record.file_path)
                    return True
                return False

        except Exception as e:
            logger.error(f"Failed to delete physical file {file_record.file_path}: {e}")
            return False

    async def cleanup_orphaned_files(self, dry_run: bool = False) -> Dict[str, Any]:
        """
        Clean up orphaned files (files in storage without database records).

        Args:
            dry_run: If True, only identify orphaned files without deleting

        Returns:
            Dict containing cleanup results
        """
        results = {
            "orphaned_files_found": 0,
            "orphaned_files_deleted": 0,
            "storage_freed_mb": 0,
            "errors": [],
            "dry_run": dry_run,
        }

        try:
            # For local storage, scan the upload directory
            upload_folder = Path(getattr(settings, "UPLOAD_FOLDER", "uploads"))
            if upload_folder.exists():
                results.update(
                    await self._cleanup_local_orphans(upload_folder, dry_run)
                )

            # For cloud storage, this would require listing all objects and comparing
            # with database records (implementation depends on specific cloud provider)

        except Exception as e:
            error_msg = f"Orphaned file cleanup failed: {str(e)}"
            results["errors"].append(error_msg)
            logger.error(error_msg)

        return results

    async def _cleanup_local_orphans(
        self, upload_folder: Path, dry_run: bool
    ) -> Dict[str, Any]:
        """Clean up orphaned files in local storage."""
        results = {
            "orphaned_files_found": 0,
            "orphaned_files_deleted": 0,
            "storage_freed_mb": 0,
            "errors": [],
        }

        with SessionLocal() as db:
            # Get all file paths from database
            db_file_paths = set(
                record.file_path for record in db.query(UploadedFile.file_path).all()
            )

            # Scan upload folder
            for file_path in upload_folder.rglob("*"):
                if file_path.is_file():
                    full_path = str(file_path)

                    # Check if file exists in database
                    if full_path not in db_file_paths:
                        results["orphaned_files_found"] += 1
                        file_size_mb = file_path.stat().st_size / (1024 * 1024)

                        if not dry_run:
                            try:
                                file_path.unlink()
                                results["orphaned_files_deleted"] += 1
                                results["storage_freed_mb"] += file_size_mb
                                logger.debug(f"Deleted orphaned file: {full_path}")
                            except Exception as e:
                                error_msg = f"Failed to delete orphaned file {full_path}: {str(e)}"
                                results["errors"].append(error_msg)
                        else:
                            results["orphaned_files_deleted"] += 1
                            results["storage_freed_mb"] += file_size_mb

        return results

    async def cleanup_processing_logs(
        self, retention_days: int = 30, dry_run: bool = False
    ) -> Dict[str, Any]:
        """
        Clean up old processing logs.

        Args:
            retention_days: Number of days to retain logs
            dry_run: If True, only count logs without deleting

        Returns:
            Dict containing cleanup results
        """
        results = {"logs_identified": 0, "logs_deleted": 0, "dry_run": dry_run}

        with SessionLocal() as db:
            try:
                cutoff_date = datetime.utcnow() - timedelta(days=retention_days)

                # Find old logs
                old_logs = (
                    db.query(ProcessingLog)
                    .filter(ProcessingLog.timestamp < cutoff_date)
                    .all()
                )

                results["logs_identified"] = len(old_logs)

                if not dry_run:
                    # Delete old logs
                    for log in old_logs:
                        db.delete(log)

                    db.commit()
                    results["logs_deleted"] = len(old_logs)
                else:
                    results["logs_deleted"] = len(old_logs)

                logger.info(f"Cleaned up {results['logs_deleted']} processing logs")

            except Exception as e:
                error_msg = f"Log cleanup failed: {str(e)}"
                logger.error(error_msg)
                db.rollback()
                results["errors"] = [error_msg]

        return results

    def get_cleanup_statistics(self) -> Dict[str, Any]:
        """Get statistics about files eligible for cleanup."""
        stats = {
            "total_files": 0,
            "eligible_for_cleanup": 0,
            "storage_used_mb": 0,
            "reclaimable_storage_mb": 0,
            "policies": {},
        }

        with SessionLocal() as db:
            # Total files and storage
            total_query = db.query(
                func.count(UploadedFile.id), func.sum(UploadedFile.file_size)
            ).first()

            stats["total_files"] = total_query[0] or 0
            stats["storage_used_mb"] = (total_query[1] or 0) / (1024 * 1024)

            # Check each policy
            for policy in self.policies:
                cutoff_date = datetime.utcnow() - timedelta(days=policy.retention_days)

                query = db.query(
                    func.count(UploadedFile.id), func.sum(UploadedFile.file_size)
                ).filter(UploadedFile.created_at < cutoff_date)

                if policy.applies_to_status:
                    query = query.filter(
                        UploadedFile.status.in_(policy.applies_to_status)
                    )

                if policy.applies_to_file_types:
                    query = query.filter(
                        UploadedFile.file_type.in_(policy.applies_to_file_types)
                    )

                result = query.first()

                policy_stats = {
                    "eligible_files": result[0] or 0,
                    "reclaimable_mb": (result[1] or 0) / (1024 * 1024),
                    "auto_cleanup": policy.auto_cleanup,
                    "retention_days": policy.retention_days,
                }

                stats["policies"][policy.name] = policy_stats

                if policy.auto_cleanup:
                    stats["eligible_for_cleanup"] += policy_stats["eligible_files"]
                    stats["reclaimable_storage_mb"] += policy_stats["reclaimable_mb"]

        return stats

    async def run_scheduled_cleanup(self) -> Dict[str, Any]:
        """Run the scheduled cleanup process."""
        logger.info("Starting scheduled file cleanup")

        try:
            # Cleanup expired files
            file_cleanup = await self.cleanup_expired_files(dry_run=False)

            # Cleanup orphaned files
            orphan_cleanup = await self.cleanup_orphaned_files(dry_run=False)

            # Cleanup old logs
            log_cleanup = await self.cleanup_processing_logs(
                retention_days=30, dry_run=False
            )

            # Combine results
            combined_results = {
                "cleanup_timestamp": datetime.utcnow().isoformat(),
                "file_cleanup": file_cleanup,
                "orphan_cleanup": orphan_cleanup,
                "log_cleanup": log_cleanup,
                "total_files_deleted": (
                    file_cleanup["files_deleted"]
                    + orphan_cleanup["orphaned_files_deleted"]
                ),
                "total_storage_freed_mb": (
                    file_cleanup["storage_freed_mb"]
                    + orphan_cleanup["storage_freed_mb"]
                ),
                "success": True,
            }

            logger.info(
                f"Scheduled cleanup completed successfully: "
                f"{combined_results['total_files_deleted']} files deleted, "
                f"{combined_results['total_storage_freed_mb']:.2f} MB freed"
            )

            return combined_results

        except Exception as e:
            error_msg = f"Scheduled cleanup failed: {str(e)}"
            logger.error(error_msg)
            return {
                "cleanup_timestamp": datetime.utcnow().isoformat(),
                "success": False,
                "error": error_msg,
            }
