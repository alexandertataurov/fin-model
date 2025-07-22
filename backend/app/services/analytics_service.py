from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_

from app.models.file import UploadedFile, ProcessingLog, FileStatus
from app.models.user import User


class AnalyticsService:
    """Service for generating analytics and metrics for the dashboard."""

    def __init__(self, db: Session):
        self.db = db

    def get_processing_overview(self, days: int = 30) -> Dict[str, Any]:
        """
        Get overall processing statistics for the specified time period.

        Args:
            days: Number of days to look back

        Returns:
            Dict containing processing overview metrics
        """
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)

        # Basic file statistics
        total_files = (
            self.db.query(func.count(UploadedFile.id))
            .filter(UploadedFile.created_at >= start_date)
            .scalar()
        )

        completed_files = (
            self.db.query(func.count(UploadedFile.id))
            .filter(
                and_(
                    UploadedFile.created_at >= start_date,
                    UploadedFile.status == FileStatus.COMPLETED,
                )
            )
            .scalar()
        )

        failed_files = (
            self.db.query(func.count(UploadedFile.id))
            .filter(
                and_(
                    UploadedFile.created_at >= start_date,
                    UploadedFile.status == FileStatus.FAILED,
                )
            )
            .scalar()
        )

        processing_files = (
            self.db.query(func.count(UploadedFile.id))
            .filter(
                and_(
                    UploadedFile.created_at >= start_date,
                    UploadedFile.status == FileStatus.PROCESSING,
                )
            )
            .scalar()
        )

        # Calculate success rate
        success_rate = (completed_files / total_files * 100) if total_files > 0 else 0

        # Average processing time for completed files
        avg_processing_time = (
            self.db.query(
                func.avg(
                    func.extract("epoch", UploadedFile.processing_completed_at)
                    - func.extract("epoch", UploadedFile.processing_started_at)
                )
            )
            .filter(
                and_(
                    UploadedFile.created_at >= start_date,
                    UploadedFile.status == FileStatus.COMPLETED,
                    UploadedFile.processing_started_at.isnot(None),
                    UploadedFile.processing_completed_at.isnot(None),
                )
            )
            .scalar()
        )

        # Convert to minutes
        avg_processing_minutes = (
            round(avg_processing_time / 60, 2) if avg_processing_time else 0
        )

        # Total file size processed
        total_size = (
            self.db.query(func.sum(UploadedFile.file_size))
            .filter(UploadedFile.created_at >= start_date)
            .scalar()
            or 0
        )

        return {
            "period": f"{days} days",
            "total_files": total_files,
            "completed_files": completed_files,
            "failed_files": failed_files,
            "processing_files": processing_files,
            "success_rate": round(success_rate, 1),
            "average_processing_time_minutes": avg_processing_minutes,
            "total_size_mb": round(total_size / (1024 * 1024), 2),
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
        }

    def get_daily_processing_stats(self, days: int = 30) -> List[Dict[str, Any]]:
        """
        Get daily processing statistics for the specified time period.

        Args:
            days: Number of days to look back

        Returns:
            List of daily statistics
        """
        end_date = datetime.utcnow().date()
        start_date = end_date - timedelta(days=days)

        # Query daily statistics
        daily_stats = (
            self.db.query(
                func.date(UploadedFile.created_at).label("date"),
                func.count(UploadedFile.id).label("total_files"),
                func.count(UploadedFile.id)
                .filter(UploadedFile.status == FileStatus.COMPLETED)
                .label("completed"),
                func.count(UploadedFile.id)
                .filter(UploadedFile.status == FileStatus.FAILED)
                .label("failed"),
                func.sum(UploadedFile.file_size).label("total_size"),
            )
            .filter(func.date(UploadedFile.created_at) >= start_date)
            .group_by(func.date(UploadedFile.created_at))
            .order_by(func.date(UploadedFile.created_at))
            .all()
        )

        return [
            {
                "date": stat.date.isoformat(),
                "total_files": stat.total_files,
                "completed_files": stat.completed or 0,
                "failed_files": stat.failed or 0,
                "success_rate": round((stat.completed or 0) / stat.total_files * 100, 1)
                if stat.total_files > 0
                else 0,
                "total_size_mb": round((stat.total_size or 0) / (1024 * 1024), 2),
            }
            for stat in daily_stats
        ]

    def get_file_type_distribution(self, days: int = 30) -> Dict[str, Any]:
        """
        Get distribution of file types processed.

        Args:
            days: Number of days to look back

        Returns:
            Dict containing file type distribution
        """
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)

        file_types = (
            self.db.query(
                UploadedFile.file_type,
                func.count(UploadedFile.id).label("count"),
                func.avg(UploadedFile.file_size).label("avg_size"),
            )
            .filter(UploadedFile.created_at >= start_date)
            .group_by(UploadedFile.file_type)
            .all()
        )

        total_files = sum(ft.count for ft in file_types)

        return {
            "distribution": [
                {
                    "file_type": ft.file_type,
                    "count": ft.count,
                    "percentage": round(ft.count / total_files * 100, 1)
                    if total_files > 0
                    else 0,
                    "average_size_mb": round((ft.avg_size or 0) / (1024 * 1024), 2),
                }
                for ft in file_types
            ],
            "total_files": total_files,
        }

    def get_user_activity_stats(
        self, days: int = 30, limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Get user activity statistics.

        Args:
            days: Number of days to look back
            limit: Maximum number of users to return

        Returns:
            List of user activity statistics
        """
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)

        user_stats = (
            self.db.query(
                User.id,
                User.username,
                User.email,
                func.count(UploadedFile.id).label("total_uploads"),
                func.count(UploadedFile.id)
                .filter(UploadedFile.status == FileStatus.COMPLETED)
                .label("successful_uploads"),
                func.sum(UploadedFile.file_size).label("total_size"),
                func.max(UploadedFile.created_at).label("last_upload"),
            )
            .join(UploadedFile, User.id == UploadedFile.uploaded_by_id)
            .filter(UploadedFile.created_at >= start_date)
            .group_by(User.id, User.username, User.email)
            .order_by(func.count(UploadedFile.id).desc())
            .limit(limit)
            .all()
        )

        return [
            {
                "user_id": stat.id,
                "username": stat.username,
                "email": stat.email,
                "total_uploads": stat.total_uploads,
                "successful_uploads": stat.successful_uploads or 0,
                "success_rate": round(
                    (stat.successful_uploads or 0) / stat.total_uploads * 100, 1
                )
                if stat.total_uploads > 0
                else 0,
                "total_size_mb": round((stat.total_size or 0) / (1024 * 1024), 2),
                "last_upload": stat.last_upload.isoformat()
                if stat.last_upload
                else None,
            }
            for stat in user_stats
        ]

    def get_error_analysis(self, days: int = 30) -> Dict[str, Any]:
        """
        Analyze common errors and issues.

        Args:
            days: Number of days to look back

        Returns:
            Dict containing error analysis
        """
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)

        # Get failed files
        failed_files = (
            self.db.query(UploadedFile)
            .filter(
                and_(
                    UploadedFile.created_at >= start_date,
                    UploadedFile.status == FileStatus.FAILED,
                )
            )
            .all()
        )

        # Analyze common error patterns
        error_categories = {}
        validation_errors = {}

        for file in failed_files:
            if file.validation_errors:
                import json

                try:
                    errors = json.loads(file.validation_errors)
                    if isinstance(errors, dict):
                        if "errors" in errors:
                            for error in errors["errors"]:
                                error_key = self._categorize_error(error)
                                error_categories[error_key] = (
                                    error_categories.get(error_key, 0) + 1
                                )
                        if "error" in errors:
                            error_key = self._categorize_error(errors["error"])
                            error_categories[error_key] = (
                                error_categories.get(error_key, 0) + 1
                            )
                except:
                    pass

        # Get processing log errors
        error_logs = (
            self.db.query(ProcessingLog)
            .filter(
                and_(
                    ProcessingLog.timestamp >= start_date,
                    ProcessingLog.level == "error",
                )
            )
            .all()
        )

        log_error_categories = {}
        for log in error_logs:
            error_key = self._categorize_error(log.message)
            log_error_categories[error_key] = log_error_categories.get(error_key, 0) + 1

        return {
            "total_failed_files": len(failed_files),
            "validation_error_categories": [
                {"category": category, "count": count}
                for category, count in sorted(
                    error_categories.items(), key=lambda x: x[1], reverse=True
                )
            ],
            "processing_error_categories": [
                {"category": category, "count": count}
                for category, count in sorted(
                    log_error_categories.items(), key=lambda x: x[1], reverse=True
                )
            ],
            "period": f"{days} days",
        }

    def get_performance_metrics(self, days: int = 30) -> Dict[str, Any]:
        """
        Get system performance metrics.

        Args:
            days: Number of days to look back

        Returns:
            Dict containing performance metrics
        """
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)

        # Processing time distribution
        processing_times = (
            self.db.query(
                func.extract("epoch", UploadedFile.processing_completed_at)
                - func.extract("epoch", UploadedFile.processing_started_at)
            )
            .filter(
                and_(
                    UploadedFile.created_at >= start_date,
                    UploadedFile.status == FileStatus.COMPLETED,
                    UploadedFile.processing_started_at.isnot(None),
                    UploadedFile.processing_completed_at.isnot(None),
                )
            )
            .all()
        )

        times_minutes = [t[0] / 60 for t in processing_times if t[0]]

        if times_minutes:
            avg_time = sum(times_minutes) / len(times_minutes)
            min_time = min(times_minutes)
            max_time = max(times_minutes)

            # Calculate percentiles
            times_sorted = sorted(times_minutes)
            p50 = times_sorted[len(times_sorted) // 2] if times_sorted else 0
            p95 = times_sorted[int(len(times_sorted) * 0.95)] if times_sorted else 0
        else:
            avg_time = min_time = max_time = p50 = p95 = 0

        # File size vs processing time correlation
        size_time_data = (
            self.db.query(
                UploadedFile.file_size,
                func.extract("epoch", UploadedFile.processing_completed_at)
                - func.extract("epoch", UploadedFile.processing_started_at),
            )
            .filter(
                and_(
                    UploadedFile.created_at >= start_date,
                    UploadedFile.status == FileStatus.COMPLETED,
                    UploadedFile.processing_started_at.isnot(None),
                    UploadedFile.processing_completed_at.isnot(None),
                )
            )
            .all()
        )

        # Calculate throughput (files per hour)
        total_hours = (end_date - start_date).total_seconds() / 3600
        completed_count = len(times_minutes)
        throughput = completed_count / total_hours if total_hours > 0 else 0

        return {
            "processing_time_stats": {
                "average_minutes": round(avg_time, 2),
                "min_minutes": round(min_time, 2),
                "max_minutes": round(max_time, 2),
                "p50_minutes": round(p50, 2),
                "p95_minutes": round(p95, 2),
            },
            "throughput_files_per_hour": round(throughput, 2),
            "total_processed": completed_count,
            "period_hours": round(total_hours, 1),
        }

    def get_dashboard_summary(self, days: int = 7) -> Dict[str, Any]:
        """
        Get a comprehensive dashboard summary.

        Args:
            days: Number of days to look back

        Returns:
            Dict containing dashboard summary data
        """
        overview = self.get_processing_overview(days)
        daily_stats = self.get_daily_processing_stats(days)
        file_types = self.get_file_type_distribution(days)
        user_activity = self.get_user_activity_stats(days, limit=5)
        errors = self.get_error_analysis(days)
        performance = self.get_performance_metrics(days)

        return {
            "overview": overview,
            "daily_trends": daily_stats[-7:],  # Last 7 days
            "file_type_distribution": file_types,
            "top_users": user_activity,
            "error_summary": {
                "total_errors": errors["total_failed_files"],
                "top_error_categories": errors["validation_error_categories"][:3],
            },
            "performance_summary": {
                "avg_processing_time": performance["processing_time_stats"][
                    "average_minutes"
                ],
                "throughput": performance["throughput_files_per_hour"],
            },
            "generated_at": datetime.utcnow().isoformat(),
            "period_days": days,
        }

    def _categorize_error(self, error_message: str) -> str:
        """
        Categorize an error message into a general category.

        Args:
            error_message: The error message to categorize

        Returns:
            Error category string
        """
        error_lower = error_message.lower()

        if any(
            keyword in error_lower for keyword in ["file not found", "path", "missing"]
        ):
            return "File Access Error"
        elif any(
            keyword in error_lower for keyword in ["format", "excel", "csv", "corrupt"]
        ):
            return "File Format Error"
        elif any(keyword in error_lower for keyword in ["size", "large", "limit"]):
            return "File Size Error"
        elif any(
            keyword in error_lower
            for keyword in ["validation", "template", "structure"]
        ):
            return "Validation Error"
        elif any(
            keyword in error_lower
            for keyword in ["permission", "access", "unauthorized"]
        ):
            return "Permission Error"
        elif any(keyword in error_lower for keyword in ["timeout", "time", "slow"]):
            return "Performance Error"
        elif any(
            keyword in error_lower for keyword in ["memory", "resource", "capacity"]
        ):
            return "Resource Error"
        else:
            return "Other Error"
