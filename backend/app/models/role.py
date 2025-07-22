from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Enum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from .base import Base


class RoleType(PyEnum):
    ADMIN = "admin"
    ANALYST = "analyst"
    VIEWER = "viewer"


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Enum(RoleType), unique=True, nullable=False)
    display_name = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    user_roles = relationship(
        "UserRole", back_populates="role", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Role(id={self.id}, name='{self.name.value}', display_name='{self.display_name}')>"


class UserRole(Base):
    __tablename__ = "user_roles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    assigned_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="user_roles", foreign_keys=[user_id])
    role = relationship("Role", back_populates="user_roles")
    assigned_by_user = relationship("User", foreign_keys=[assigned_by])

    def __repr__(self):
        return f"<UserRole(user_id={self.user_id}, role_id={self.role_id})>"
