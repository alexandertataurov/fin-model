from typing import Any

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.orm import Session

from app.core.config import settings

# Create the declarative base
Base = declarative_base()

# Database setup with optimized connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    # Connection pool settings
    pool_size=20,  # Number of connections to maintain in pool
    max_overflow=40,  # Additional connections beyond pool_size
    pool_timeout=30,  # Timeout to get connection from pool
    pool_recycle=3600,  # Recycle connections after 1 hour
    pool_pre_ping=True,  # Verify connections before use
    # Query optimization
    echo=False,  # Set to True for SQL debugging
    echo_pool=False,  # Set to True for pool debugging
    # Connection arguments for PostgreSQL
    connect_args={
        "options": "-c timezone=utc",
        "sslmode": "prefer",
        "connect_timeout": 10,
        "application_name": "finvision_api",
    }
    if settings.DATABASE_URL.startswith("postgresql")
    else {},
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    # Session configuration
    expire_on_commit=False,  # Keep objects accessible after commit
)


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
from .file import UploadedFile, FileStatus, ProcessingLog  # noqa
from .parameter import (
    Parameter,
    ParameterType,
    SensitivityLevel,
    Scenario,
    ParameterValue,
    FormulaNode,
    SensitivityAnalysis,
    CalculationAudit,
)  # noqa
from .report import (
    ReportTemplate,
    ReportSchedule,
    ReportExport,
    ReportType,
    ExportFormat,
    ReportStatus,
)  # noqa
from .financial import (
    FinancialStatement,
    Metric,
    TimeSeries,
    Calculation,
    Template,
    FileVersion,
    DataSource,
    StatementType,
    PeriodType,
    MetricType,
    Frequency,
    CalculationType,
    TemplateType,
    ChangeType,
    SourceType,
)  # noqa
