import os
import sys

# Ensure backend package is importable
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Point DB to a local SQLite file for tests
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("TESTING", "1")

import pytest
from sqlalchemy.orm import Session

from app.models.base import Base, engine, SessionLocal


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop all tables after tests
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db_session() -> Session:
    with SessionLocal() as session:
        yield session

