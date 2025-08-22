from __future__ import annotations

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    func,
)
from sqlalchemy.orm import relationship

from app.models.base import Base


# Keep enum values and SQL name aligned with existing migration
AUDIT_ACTIONS = (
    "LOGIN",
    "LOGOUT",
    "REGISTER",
    "PASSWORD_CHANGE",
    "PASSWORD_RESET",
    "EMAIL_VERIFICATION",
    "ROLE_ASSIGNED",
    "ROLE_REMOVED",
    "ACCOUNT_LOCKED",
    "ACCOUNT_UNLOCKED",
    "PROFILE_UPDATED",
    "FAILED_LOGIN",
    "PERMISSION_DENIED",
)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(
        SAEnum(*AUDIT_ACTIONS, name="auditaction"), nullable=False
    )
    resource = Column(String(100), nullable=True)
    resource_id = Column(String(100), nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    details = Column(Text, nullable=True)
    success = Column(String(10), nullable=False, default="true")
    created_at = Column(
        DateTime, server_default=func.now(), nullable=False
    )

    # Relationships
    user = relationship("User")

    def __repr__(self) -> str:  # pragma: no cover - debugging aid
        return (
            f"<AuditLog(id={self.id}, user_id={self.user_id}, "
            f"action='{self.action}', resource='{self.resource}', "
            f"resource_id='{self.resource_id}', success='{self.success}')>"
        )
