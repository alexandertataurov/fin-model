from app.core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

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


# Import all models so SQLAlchemy registers them
from .audit import AuditLog  # noqa: E402
from .file import FileStatus, ProcessingLog, UploadedFile  # noqa: E402
from .financial import (  # noqa: E402
    Calculation,
    CalculationType,
    ChangeType,
    DataSource,
    FileVersion,
    FinancialStatement,
    Frequency,
    Metric,
    MetricType,
    PeriodType,
    SourceType,
    StatementType,
    Template,
    TemplateType,
    TimeSeries,
)
from .maintenance import MaintenanceSchedule  # noqa: E402
from .mfa import MFAToken  # noqa: E402
from .notification import (
    Notification,
    NotificationPreferences,
)  # noqa: E402
from .parameter import (  # noqa: E402
    CalculationAudit,
    FormulaNode,
    Parameter,
    ParameterType,
    ParameterValue,
    Scenario,
    SensitivityAnalysis,
    SensitivityLevel,
)
from .role import Role, RoleType, UserRole  # noqa: E402
from .system_log import SystemLog  # noqa: E402
from .user import User  # noqa: E402

__all__ = [
    "AuditLog",
    "FileStatus",
    "ProcessingLog",
    "UploadedFile",
    "Calculation",
    "CalculationType",
    "ChangeType",
    "DataSource",
    "FileVersion",
    "FinancialStatement",
    "Frequency",
    "Metric",
    "MetricType",
    "PeriodType",
    "SourceType",
    "StatementType",
    "Template",
    "TemplateType",
    "TimeSeries",
    "MaintenanceSchedule",
    "MFAToken",
    "Notification",
    "NotificationPreferences",
    "CalculationAudit",
    "FormulaNode",
    "Parameter",
    "ParameterType",
    "ParameterValue",
    "Scenario",
    "SensitivityAnalysis",
    "SensitivityLevel",
    "Role",
    "RoleType",
    "UserRole",
    "SystemLog",
    "User",
]
