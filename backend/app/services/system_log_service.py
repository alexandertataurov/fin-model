"""
System Log Service
Provides centralized logging and retrieval of system logs.
"""

import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.system_log import SystemLog

logger = logging.getLogger(__name__)


class SystemLogService:
    """Service for managing system logs."""

    def __init__(self, db: Session):
        self.db = db

    def create_log(
        self,
        level: str,
        message: str,
        module: Optional[str] = None,
        user_id: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None,
    ) -> SystemLog:
        """Create a new system log entry."""
        try:
            log_entry = SystemLog(
                level=level,
                message=message,
                module=module,
                user_id=user_id,
                details=details or {},
                timestamp=datetime.utcnow(),
            )
            self.db.add(log_entry)
            self.db.commit()
            return log_entry
        except Exception as e:
            logger.error(f"Failed to create system log: {e}")
            self.db.rollback()
            raise

    def get_logs(
        self,
        level: str = "ERROR",
        limit: int = 100,
        skip: int = 0,
        from_ts: Optional[datetime] = None,
        to_ts: Optional[datetime] = None,
        search: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Retrieve system logs with filters."""
        try:
            query = self.db.query(SystemLog)

            # Apply level filter
            if level != "DEBUG":
                level_order = {
                    "INFO": 1,
                    "WARNING": 2,
                    "ERROR": 3,
                    "CRITICAL": 4,
                }
                min_level = level_order.get(level, 1)
                query = query.filter(
                    SystemLog.level.in_(
                        [
                            lvl
                            for lvl, v in level_order.items()
                            if v >= min_level
                        ]
                    )
                )

            # Apply timestamp filters
            if from_ts:
                query = query.filter(SystemLog.timestamp >= from_ts)
            if to_ts:
                query = query.filter(SystemLog.timestamp <= to_ts)

            # Apply search filter
            if search:
                like = f"%{search}%"
                query = query.filter(
                    (SystemLog.message.ilike(like))
                    | (SystemLog.module.ilike(like))
                )

            # Apply pagination and ordering
            logs = (
                query.order_by(desc(SystemLog.timestamp))
                .offset(skip)
                .limit(limit)
                .all()
            )

            # Format response
            items = [
                {
                    "timestamp": log.timestamp,
                    "level": log.level,
                    "message": log.message,
                    "module": log.module or "",
                    "user_id": log.user_id,
                    "details": log.details or {},
                }
                for log in logs
            ]

            return items

        except Exception as e:
            logger.error(f"Failed to retrieve system logs: {e}")
            return []

    def get_log_count(self, level: str = "ERROR") -> int:
        """Get count of logs for a specific level."""
        try:
            query = self.db.query(SystemLog)
            if level != "DEBUG":
                level_order = {
                    "INFO": 1,
                    "WARNING": 2,
                    "ERROR": 3,
                    "CRITICAL": 4,
                }
                min_level = level_order.get(level, 1)
                query = query.filter(
                    SystemLog.level.in_(
                        [
                            lvl
                            for lvl, v in level_order.items()
                            if v >= min_level
                        ]
                    )
                )
            return query.count()
        except Exception as e:
            logger.error(f"Failed to get log count: {e}")
            return 0

    def cleanup_old_logs(self, days: int = 30) -> int:
        """Clean up logs older than specified days."""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            deleted = (
                self.db.query(SystemLog)
                .filter(SystemLog.timestamp < cutoff_date)
                .delete()
            )
            self.db.commit()
            return deleted
        except Exception as e:
            logger.error(f"Failed to cleanup old logs: {e}")
            self.db.rollback()
            return 0
