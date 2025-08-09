"""
Maintenance Service
Provides centralized management of maintenance schedules.
"""

import logging
from datetime import datetime, timezone
from typing import List, Optional

from app.models.maintenance import MaintenanceSchedule
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


class MaintenanceService:
    """Service for managing maintenance schedules."""

    def __init__(self, db: Session):
        self.db = db

    def get_all_schedules(self) -> List[MaintenanceSchedule]:
        """Get all maintenance schedules."""
        try:
            return (
                self.db.query(MaintenanceSchedule)
                .order_by(MaintenanceSchedule.id)
                .all()
            )
        except Exception as e:
            logger.error(f"Failed to get maintenance schedules: {e}")
            return []

    def get_schedule_by_id(self, schedule_id: int) -> Optional[MaintenanceSchedule]:
        """Get a specific maintenance schedule by ID."""
        try:
            return (
                self.db.query(MaintenanceSchedule)
                .filter(MaintenanceSchedule.id == schedule_id)
                .first()
            )
        except Exception as e:
            logger.error(f"Failed to get maintenance schedule {schedule_id}: {e}")
            return None

    def create_schedule(
        self,
        name: str,
        task: str,
        schedule: str,
        enabled: bool = True,
        created_by: int = None,
    ) -> MaintenanceSchedule:
        """Create a new maintenance schedule."""
        try:
            schedule_obj = MaintenanceSchedule(
                name=name,
                task=task,
                schedule=schedule,
                enabled=enabled,
                created_by=created_by,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            self.db.add(schedule_obj)
            self.db.commit()
            return schedule_obj
        except Exception as e:
            logger.error(f"Failed to create maintenance schedule: {e}")
            self.db.rollback()
            raise

    def update_schedule(
        self,
        schedule_id: int,
        name: str = None,
        task: str = None,
        schedule: str = None,
        enabled: bool = None,
    ) -> Optional[MaintenanceSchedule]:
        """Update an existing maintenance schedule."""
        try:
            schedule_obj = self.get_schedule_by_id(schedule_id)
            if not schedule_obj:
                return None

            if name is not None:
                schedule_obj.name = name
            if task is not None:
                schedule_obj.task = task
            if schedule is not None:
                schedule_obj.schedule = schedule
            if enabled is not None:
                schedule_obj.enabled = enabled

            schedule_obj.updated_at = datetime.now(timezone.utc)
            self.db.commit()
            return schedule_obj
        except Exception as e:
            logger.error(f"Failed to update maintenance schedule {schedule_id}: {e}")
            self.db.rollback()
            return None

    def delete_schedule(self, schedule_id: int) -> bool:
        """Delete a maintenance schedule."""
        try:
            schedule_obj = self.get_schedule_by_id(schedule_id)
            if not schedule_obj:
                return False

            self.db.delete(schedule_obj)
            self.db.commit()
            return True
        except Exception as e:
            logger.error(f"Failed to delete maintenance schedule {schedule_id}: {e}")
            self.db.rollback()
            return False

    def get_enabled_schedules(self) -> List[MaintenanceSchedule]:
        """Get all enabled maintenance schedules."""
        try:
            return (
                self.db.query(MaintenanceSchedule)
                .filter(MaintenanceSchedule.enabled.is_(True))
                .all()
            )
        except Exception as e:
            logger.error(f"Failed to get enabled maintenance schedules: {e}")
            return []

    def validate_task(self, task: str) -> bool:
        """Validate that a task is allowed."""
        allowed_tasks = {"cleanup", "vacuum", "archive", "reindex", "backup"}
        return task in allowed_tasks

    def upsert_schedule(
        self,
        *,
        id: str,
        name: str,
        task: str,
        schedule: str,
        enabled: bool,
    ) -> MaintenanceSchedule:
        """Create or update a maintenance schedule."""
        try:
            schedule_obj = self.db.get(MaintenanceSchedule, id)
            if schedule_obj:
                schedule_obj.name = name
                schedule_obj.task = task
                schedule_obj.schedule = schedule
                schedule_obj.enabled = enabled
                schedule_obj.updated_at = datetime.now(timezone.utc)
            else:
                schedule_obj = MaintenanceSchedule(
                    id=id,
                    name=name,
                    task=task,
                    schedule=schedule,
                    enabled=enabled,
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc),
                )
                self.db.add(schedule_obj)

            self.db.commit()
            return schedule_obj
        except Exception as e:
            logger.error(f"Failed to upsert maintenance schedule {id}: {e}")
            self.db.rollback()
            raise

    def remove_missing(self, keep_ids: set[str]) -> None:
        """Delete schedules not present in the provided set of IDs."""
        try:
            (
                self.db.query(MaintenanceSchedule)
                .filter(~MaintenanceSchedule.id.in_(keep_ids))
                .delete(synchronize_session=False)
            )
            self.db.commit()
        except Exception as e:
            logger.error(f"Failed to remove missing maintenance schedules: {e}")
            self.db.rollback()
