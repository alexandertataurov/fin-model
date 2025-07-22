from typing import Any

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.orm import Session

from app.core.config import settings

# Create the declarative base
Base = declarative_base()

# Database setup
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Import all models to ensure they are registered with SQLAlchemy
from .user import User  # noqa
from .role import Role, UserRole, RoleType  # noqa
from .audit import AuditLog, AuditAction  # noqa
