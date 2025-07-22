from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from .base import Base


class AuditAction(PyEnum):
    LOGIN = "login"
    LOGOUT = "logout"
    REGISTER = "register"
    PASSWORD_CHANGE = "password_change"
    PASSWORD_RESET = "password_reset"
    EMAIL_VERIFICATION = "email_verification"
    ROLE_ASSIGNED = "role_assigned"
    ROLE_REMOVED = "role_removed"
    ACCOUNT_LOCKED = "account_locked"
    ACCOUNT_UNLOCKED = "account_unlocked"
    PROFILE_UPDATED = "profile_updated"
    FAILED_LOGIN = "failed_login"
    PERMISSION_DENIED = "permission_denied"


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Can be null for anonymous actions
    action = Column(Enum(AuditAction), nullable=False)
    resource = Column(String(100), nullable=True)  # What resource was accessed
    resource_id = Column(String(100), nullable=True)  # ID of the resource
    ip_address = Column(String(45), nullable=True)  # IPv4 or IPv6
    user_agent = Column(Text, nullable=True)
    details = Column(Text, nullable=True)  # Additional context in JSON format
    success = Column(String(10), nullable=False, default="success")  # success, failure, error
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="audit_logs")

    def __repr__(self):
        return f"<AuditLog(id={self.id}, user_id={self.user_id}, action='{self.action.value}', success='{self.success}')>" 