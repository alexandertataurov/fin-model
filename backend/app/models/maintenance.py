from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.models.base import Base


class MaintenanceSchedule(Base):
    __tablename__ = "maintenance_schedules"

    id = Column(String(64), primary_key=True)
    name = Column(String(128), nullable=False)
    task = Column(String(32), nullable=False)
    schedule = Column(String(128), nullable=False)
    enabled = Column(Boolean, nullable=False, default=True)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )
    created_at = Column(
        DateTime, server_default=func.now(), nullable=False
    )
