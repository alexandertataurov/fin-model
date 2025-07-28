import pytest
import os
import tempfile
import asyncio
from typing import AsyncGenerator, Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.models.base import Base, get_db
from app.core.config import settings
from app.models.user import User
from app.models.role import Role
from app.core.security import get_password_hash
from main import app
import factory
from faker import Faker

fake = Faker()

# Test database configuration
TEST_DATABASE_URL = "sqlite:///./test.db"
TEST_ASYNC_DATABASE_URL = "sqlite+aiosqlite:///./test.db"


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
def test_db():
    """Create a temporary database for each test function."""
    # Create a temporary file for the test database
    fd, db_path = tempfile.mkstemp(suffix=".db")
    os.close(fd)

    # Create engine and sessionmaker
    engine = create_engine(
        f"sqlite:///{db_path}", 
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Create tables
    Base.metadata.create_all(bind=engine)

    yield TestingSessionLocal, engine

    # Cleanup
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    if os.path.exists(db_path):
        os.unlink(db_path)


@pytest.fixture(scope="function")
async def async_test_db():
    """Create a temporary async database for each test function."""
    fd, db_path = tempfile.mkstemp(suffix=".db")
    os.close(fd)

    # Create async engine
    engine = create_async_engine(
        f"sqlite+aiosqlite:///{db_path}",
        poolclass=StaticPool,
        connect_args={"check_same_thread": False}
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    yield async_session, engine

    # Cleanup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()
    if os.path.exists(db_path):
        os.unlink(db_path)


@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client with isolated database."""
    TestingSessionLocal, engine = test_db

    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    # Override the dependency
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    # Clean up the override
    if get_db in app.dependency_overrides:
        del app.dependency_overrides[get_db]


@pytest.fixture
def test_user_data():
    """Generate test user data."""
    first_name = fake.first_name()
    last_name = fake.last_name()
    return {
        "username": fake.user_name(),
        "email": fake.email(),
        "password": "testpassword123",
        "first_name": first_name,
        "last_name": last_name,
        "full_name": f"{first_name} {last_name}",
        "is_active": True,
    }


@pytest.fixture
def test_admin_data():
    """Generate test admin user data."""
    return {
        "username": "admin_test",
        "email": "admin@test.com",
        "password": "adminpassword123",
        "full_name": "Test Admin",
        "is_active": True,
        "is_admin": True,
    }


@pytest.fixture
def db_session(test_db):
    """Get database session for tests."""
    TestingSessionLocal, engine = test_db
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
async def async_db_session(async_test_db):
    """Get async database session for tests."""
    async_session_factory, engine = async_test_db
    async with async_session_factory() as session:
        yield session


@pytest.fixture
def authenticated_client(client, db_session, test_user_data):
    """Create an authenticated test client."""
    # Create user in database
    hashed_password = get_password_hash(test_user_data["password"])
    user = User(
        username=test_user_data["username"],
        email=test_user_data["email"],
        hashed_password=hashed_password,
        first_name=test_user_data["first_name"],
        last_name=test_user_data["last_name"],
        is_active=test_user_data["is_active"]
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Login and get token
    login_data = {
        "username": test_user_data["username"],
        "password": test_user_data["password"]
    }
    response = client.post("/api/v1/auth/login", data=login_data)
    token = response.json()["access_token"]
    
    # Set authorization header
    client.headers = {"Authorization": f"Bearer {token}"}
    
    return client, user


@pytest.fixture
def admin_client(client, db_session, test_admin_data):
    """Create an authenticated admin test client."""
    # Create admin user in database
    hashed_password = get_password_hash(test_admin_data["password"])
    admin_user = User(
        username=test_admin_data["username"],
        email=test_admin_data["email"],
        hashed_password=hashed_password,
        full_name=test_admin_data["full_name"],
        is_active=test_admin_data["is_active"],
        is_admin=test_admin_data.get("is_admin", True)
    )
    db_session.add(admin_user)
    db_session.commit()
    db_session.refresh(admin_user)

    # Login and get token
    login_data = {
        "username": test_admin_data["username"],
        "password": test_admin_data["password"]
    }
    response = client.post("/api/v1/auth/login", data=login_data)
    token = response.json()["access_token"]
    
    # Set authorization header
    client.headers = {"Authorization": f"Bearer {token}"}
    
    return client, admin_user


# Factory classes for test data generation
class UserFactory(factory.Factory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    hashed_password = factory.LazyFunction(
        lambda: get_password_hash("testpassword")
    )
    is_active = True


class AdminUserFactory(UserFactory):
    username = factory.Sequence(lambda n: f"admin{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")


@pytest.fixture
def sample_excel_file():
    """Create a sample Excel file for testing."""
    import pandas as pd
    import tempfile
    import os
    
    # Create sample financial data
    data = {
        'Account': ['Revenue', 'COGS', 'Gross Profit', 'Operating Expenses', 'EBITDA'],
        'Q1_2023': [1000000, -600000, 400000, -250000, 150000],
        'Q2_2023': [1200000, -720000, 480000, -280000, 200000],
        'Q3_2023': [1100000, -660000, 440000, -270000, 170000],
        'Q4_2023': [1300000, -780000, 520000, -300000, 220000]
    }
    
    df = pd.DataFrame(data)
    
    # Create temporary file
    fd, file_path = tempfile.mkstemp(suffix='.xlsx')
    os.close(fd)
    
    # Write Excel file
    df.to_excel(file_path, index=False)
    
    yield file_path
    
    # Cleanup
    if os.path.exists(file_path):
        os.unlink(file_path)


@pytest.fixture
def mock_celery_task(mocker):
    """Mock Celery task execution for testing."""
    return mocker.patch('app.tasks.file_processing.process_file_task.delay')


# Test markers and utilities
pytestmark = pytest.mark.asyncio 