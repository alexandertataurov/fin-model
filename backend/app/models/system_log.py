from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    func,
)
from sqlalchemy.orm import relationship

from app.models.base import Base


class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
    level = Column(String(16), nullable=False, default="INFO")
    module = Column(String(64), nullable=True)
    message = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    user = relationship("User")

    def __repr__(self) -> str:  # pragma: no cover
        return (
            f"<SystemLog(id={self.id}, level={self.level}, " f"module={self.module})>"
        )
