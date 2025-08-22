import os
import sys

# Ensure backend package is importable
ROOT_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Point DB to a local SQLite file for tests
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("TESTING", "1")

import pytest  # noqa: E402
from app.models.base import Base, SessionLocal, engine  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from main import app  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop all tables after tests
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(autouse=True)
def clean_db():
    yield
    with SessionLocal() as session:
        for table in reversed(Base.metadata.sorted_tables):
            session.execute(table.delete())
        session.commit()


@pytest.fixture()
def db_session() -> Session:
    with SessionLocal() as session:
        yield session


@pytest.fixture()
def client() -> TestClient:
    """Provide a fresh TestClient for each test.

    The API disables authentication when the ``TESTING`` environment variable is
    set (configured above).  Many tests rely on a ``client`` fixture being
    available globally, so we expose it here instead of redefining it in each
    module.
    """

    return TestClient(app)


@pytest.fixture()
def auth_headers() -> dict[str, str]:
    """Return default headers for authenticated requests.

    In the test environment authentication is effectively bypassed, so an empty
    dictionary is sufficient.  Having this fixture available keeps the tests
    concise and avoids errors when a test expects an ``auth_headers`` fixture.
    """

    return {}
