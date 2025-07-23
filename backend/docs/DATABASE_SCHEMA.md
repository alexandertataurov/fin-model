# Database Schema Documentation

## Overview

The FinVision platform uses a PostgreSQL database with a carefully designed schema optimized for financial data modeling, analysis, and reporting. The database implements a multi-tenant architecture with role-based access control and comprehensive audit logging.

## Architecture Principles

### 1. **Normalized Design**

- Tables are designed in 3rd Normal Form to eliminate redundancy
- Foreign key relationships ensure data integrity
- Composite indexes optimize query performance

### 2. **Repository Pattern**

- Data access abstracted through repository classes
- Consistent interface for CRUD operations
- Transaction management and error handling

### 3. **Performance Optimization**

- Advanced indexing strategy for complex queries
- Connection pooling for concurrent access
- Partitioning strategy for large time-series data

### 4. **Security & Compliance**

- Row-level security for multi-tenant data isolation
- Comprehensive audit logging
- Data encryption for sensitive information

## Core Schema Design

### User Management & Authentication

#### `users` Table

Primary table for user accounts and authentication.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features:**

- Email and username uniqueness constraints
- Password security with reset token mechanism
- Account lockout after failed attempts
- Comprehensive audit trail

#### `roles` & `user_roles` Tables

Role-based access control system.

```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name role_type UNIQUE NOT NULL,  -- ADMIN, ANALYST, VIEWER
    display_name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id),
    assigned_at TIMESTAMP DEFAULT NOW(),
    assigned_by INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role_id)
);
```

### File Management

#### `uploaded_files` Table

Tracks all uploaded files and their processing status.

```sql
CREATE TABLE uploaded_files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'uploaded',  -- uploaded, processing, completed, failed
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    is_valid BOOLEAN,
    validation_errors TEXT,
    parsed_data TEXT,  -- JSON string
    uploaded_by_id INTEGER REFERENCES users(id),
    template_id INTEGER REFERENCES templates(id),
    data_source_id INTEGER REFERENCES data_sources(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `file_versions` Table

Version control for uploaded files.

```sql
CREATE TABLE file_versions (
    id SERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES uploaded_files(id),
    version_number INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_hash VARCHAR(64) NOT NULL,  -- SHA-256
    change_description TEXT,
    change_type change_type NOT NULL,  -- INITIAL, UPDATE, CORRECTION, REPROCESSING
    processing_metadata JSON,
    is_current BOOLEAN DEFAULT FALSE,
    created_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(file_id, version_number)
);
```

### Financial Modeling

#### `scenarios` Table

Financial modeling scenarios for what-if analysis.

```sql
CREATE TABLE scenarios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_baseline BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'draft',  -- draft, active, archived
    version VARCHAR(50) DEFAULT '1.0',
    parent_scenario_id INTEGER REFERENCES scenarios(id),
    base_file_id INTEGER REFERENCES uploaded_files(id),
    last_calculated_at TIMESTAMP,
    calculation_status VARCHAR(50) DEFAULT 'pending',
    calculation_results JSON,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by_id INTEGER REFERENCES users(id)
);
```

#### `parameters` Table

Configurable financial parameters extracted from Excel files.

```sql
CREATE TABLE parameters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    description TEXT,
    parameter_type VARCHAR(50) NOT NULL,  -- growth_rate, discount_rate, etc.
    category VARCHAR(50) NOT NULL,
    sensitivity_level VARCHAR(20) DEFAULT 'MEDIUM',
    current_value FLOAT,
    default_value FLOAT,
    min_value FLOAT,
    max_value FLOAT,
    unit VARCHAR(50),
    format_type VARCHAR(50) DEFAULT 'number',
    source_file_id INTEGER REFERENCES uploaded_files(id),
    source_sheet VARCHAR(255),
    source_cell VARCHAR(20),
    source_range VARCHAR(50),
    depends_on JSON,  -- Array of parameter IDs
    affects JSON,     -- Array of parameter IDs
    formula TEXT,     -- Excel formula
    validation_rules JSON,
    is_required BOOLEAN DEFAULT TRUE,
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by_id INTEGER REFERENCES users(id),
    data_source_id INTEGER REFERENCES data_sources(id)
);
```

### Financial Data

#### `financial_statements` Table

Core financial statements (P&L, Balance Sheet, Cash Flow).

```sql
CREATE TABLE financial_statements (
    id SERIAL PRIMARY KEY,
    scenario_id INTEGER REFERENCES scenarios(id),
    statement_type statement_type NOT NULL,  -- PROFIT_LOSS, BALANCE_SHEET, CASH_FLOW
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    period_type period_type NOT NULL,  -- MONTHLY, QUARTERLY, YEARLY
    currency VARCHAR(3) NOT NULL,  -- ISO currency code
    line_items JSON NOT NULL,      -- Financial line items structure
    raw_data JSON,                 -- Original extracted data
    calculated_data JSON,          -- Derived calculations
    version INTEGER DEFAULT 1,
    is_baseline BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `metrics` Table

Calculated financial ratios and KPIs.

```sql
CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    scenario_id INTEGER REFERENCES scenarios(id),
    metric_name VARCHAR(255) NOT NULL,
    metric_category VARCHAR(100) NOT NULL,  -- profitability, liquidity, efficiency
    metric_type metric_type NOT NULL,       -- RATIO, PERCENTAGE, CURRENCY, COUNT, DAYS
    value FLOAT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    currency VARCHAR(3),
    calculation_formula TEXT,
    benchmark_value FLOAT,
    industry_average FLOAT,
    calculation_metadata JSON,
    created_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `time_series` Table

Historical financial data for trend analysis.

```sql
CREATE TABLE time_series (
    id SERIAL PRIMARY KEY,
    scenario_id INTEGER REFERENCES scenarios(id),
    data_type VARCHAR(100) NOT NULL,     -- revenue, expenses, cash_flow
    data_subtype VARCHAR(100),           -- product_line, department
    period_date DATE NOT NULL,
    value FLOAT NOT NULL,
    currency VARCHAR(3) NOT NULL,
    frequency frequency NOT NULL,        -- DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY
    data_source VARCHAR(100),
    confidence_level FLOAT,              -- 0.0 to 1.0
    is_actual BOOLEAN DEFAULT TRUE,      -- actual vs projected
    is_adjusted BOOLEAN DEFAULT FALSE,
    adjustment_reason TEXT,
    data_metadata JSON,
    created_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Calculation Engine

#### `calculations` Table

Formula dependencies and calculation chains.

```sql
CREATE TABLE calculations (
    id SERIAL PRIMARY KEY,
    scenario_id INTEGER REFERENCES scenarios(id),
    calculation_name VARCHAR(255) NOT NULL,
    calculation_type calculation_type NOT NULL,  -- FORMULA, AGGREGATION, RATIO, TREND
    formula TEXT NOT NULL,
    input_parameters JSON NOT NULL,      -- Array of parameter IDs
    output_parameters JSON NOT NULL,     -- Array of parameter IDs
    dependencies JSON,                   -- Array of calculation IDs
    execution_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    error_handling JSON,
    validation_rules JSON,
    last_executed_at TIMESTAMP,
    execution_time_ms INTEGER,
    created_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Template System

#### `templates` Table

Excel template definitions for data mapping.

```sql
CREATE TABLE templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_type template_type NOT NULL,  -- EXCEL, CSV, JSON, CUSTOM
    file_structure JSON NOT NULL,          -- Expected file structure
    mapping_rules JSON NOT NULL,           -- Data to database mapping
    validation_rules JSON,
    transformation_rules JSON,
    sample_file_path VARCHAR(500),
    version VARCHAR(50) DEFAULT '1.0',
    is_system_template BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Data Lineage

#### `data_sources` Table

Track data sources and lineage.

```sql
CREATE TABLE data_sources (
    id SERIAL PRIMARY KEY,
    source_name VARCHAR(255) NOT NULL,
    source_type source_type NOT NULL,    -- FILE_UPLOAD, API, DATABASE, MANUAL_ENTRY
    source_identifier VARCHAR(500) NOT NULL,
    data_lineage JSON,                   -- Transformation chain
    quality_metrics JSON,               -- Data quality scores
    refresh_frequency VARCHAR(50),
    last_updated TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    connection_config JSON,
    validation_config JSON,
    created_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Audit & Security

#### `audit_logs` Table

Comprehensive audit trail for security and compliance.

```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action audit_action NOT NULL,       -- LOGIN, LOGOUT, CREATE, UPDATE, DELETE
    resource VARCHAR(100),              -- Table or resource name
    resource_id VARCHAR(100),           -- ID of affected resource
    ip_address VARCHAR(45),             -- IPv4 or IPv6
    user_agent TEXT,
    details TEXT,                       -- JSON context
    success VARCHAR(10) DEFAULT 'success',  -- success, failure, error
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Performance Optimization

### Indexing Strategy

#### Primary Indexes

- All primary keys have automatic indexes
- Foreign keys have explicit indexes for join performance
- Unique constraints have implicit indexes

#### Composite Indexes

```sql
-- Financial statements by scenario and period
CREATE INDEX ix_statements_scenario_period ON financial_statements
(scenario_id, statement_type, period_start);

-- Time series data lookup
CREATE INDEX ix_timeseries_scenario_type_date ON time_series
(scenario_id, data_type, period_date);

-- Parameters by type and category
CREATE INDEX ix_parameters_type_category ON parameters
(parameter_type, category);

-- Metrics by scenario and category
CREATE INDEX ix_metrics_scenario_category ON metrics
(scenario_id, metric_category);
```

#### Full-Text Search Indexes

```sql
-- Parameter search
CREATE INDEX ix_parameters_search_gin ON parameters
USING gin(to_tsvector('english',
    COALESCE(name, '') || ' ' ||
    COALESCE(display_name, '') || ' ' ||
    COALESCE(description, '')
));

-- File search
CREATE INDEX ix_files_search_gin ON uploaded_files
USING gin(to_tsvector('english',
    COALESCE(filename, '') || ' ' ||
    COALESCE(original_filename, '')
));
```

#### Partial Indexes

```sql
-- Active users only
CREATE INDEX ix_users_active_only ON users (id) WHERE is_active = true;

-- Processing files
CREATE INDEX ix_files_processing ON uploaded_files (id, created_at)
WHERE status IN ('processing', 'uploaded');

-- Active scenarios
CREATE INDEX ix_scenarios_active ON scenarios (id, updated_at)
WHERE status = 'active';
```

### Connection Pooling Configuration

```python
engine = create_engine(
    DATABASE_URL,
    pool_size=20,                    # Base connections
    max_overflow=40,                 # Additional connections
    pool_timeout=30,                 # Connection timeout
    pool_recycle=3600,              # Recycle after 1 hour
    pool_pre_ping=True,             # Verify before use
    connect_args={
        "options": "-c timezone=utc",
        "sslmode": "prefer",
        "connect_timeout": 10,
        "application_name": "finvision_api"
    }
)
```

## Repository Pattern Implementation

### Base Repository

The `BaseRepository` class provides a generic interface for data access:

```python
class BaseRepository(Generic[ModelType], ABC):
    def __init__(self, db: Session, model: Type[ModelType]):
        self.db = db
        self.model = model

    def get(self, id: int) -> Optional[ModelType]
    def get_multi(self, skip: int = 0, limit: int = 100,
                  filters: Optional[Dict] = None) -> List[ModelType]
    def create(self, obj_in: Dict[str, Any]) -> ModelType
    def update(self, id: int, obj_in: Dict[str, Any]) -> Optional[ModelType]
    def delete(self, id: int) -> bool
    def count(self, filters: Optional[Dict] = None) -> int
    def search(self, search_term: str, search_fields: List[str]) -> List[ModelType]
```

### Specialized Repositories

#### Financial Statement Repository

```python
class FinancialStatementRepository(BaseRepository[FinancialStatement]):
    def get_by_scenario_and_type(self, scenario_id: int, statement_type: str) -> List[FinancialStatement]
    def get_latest_version(self, scenario_id: int, statement_type: str) -> Optional[FinancialStatement]
    def get_baseline_statements(self, scenario_id: int) -> List[FinancialStatement]
```

#### Time Series Repository

```python
class TimeSeriesRepository(BaseRepository[TimeSeries]):
    def get_series_data(self, scenario_id: int, data_type: str,
                       start_date: Optional[date] = None) -> List[TimeSeries]
    def get_aggregated_data(self, scenario_id: int, data_type: str,
                           aggregation: str = 'sum') -> float
    def bulk_upsert_series(self, scenario_id: int, data_type: str,
                          series_data: List[Dict]) -> int
```

## Usage Examples

### Creating a Financial Scenario

```python
# Create repository instances
scenario_repo = ScenarioRepository(db)
param_repo = ParameterRepository(db)
statement_repo = FinancialStatementRepository(db)

# Create new scenario
scenario_data = {
    "name": "Q4 2024 Forecast",
    "description": "Conservative growth scenario",
    "base_file_id": file_id,
    "created_by_id": user_id
}
scenario = scenario_repo.create(scenario_data)

# Add parameters
parameters = [
    {
        "name": "revenue_growth_rate",
        "parameter_type": "growth_rate",
        "current_value": 0.15,
        "scenario_id": scenario.id
    }
]
param_repo.bulk_create(parameters)

# Generate financial statement
statement_data = {
    "scenario_id": scenario.id,
    "statement_type": "PROFIT_LOSS",
    "period_start": date(2024, 10, 1),
    "period_end": date(2024, 12, 31),
    "period_type": "QUARTERLY",
    "currency": "USD",
    "line_items": {...}  # Financial data
}
statement = statement_repo.create(statement_data)
```

### Querying Time Series Data

```python
# Get repository
ts_repo = TimeSeriesRepository(db)

# Get revenue trend for last 12 months
revenue_data = ts_repo.get_series_data(
    scenario_id=scenario.id,
    data_type="revenue",
    start_date=date(2023, 1, 1),
    frequency="MONTHLY"
)

# Get total revenue for Q4
q4_revenue = ts_repo.get_aggregated_data(
    scenario_id=scenario.id,
    data_type="revenue",
    aggregation="sum",
    period_start=date(2024, 10, 1),
    period_end=date(2024, 12, 31)
)
```

### Complex Filtering

```python
# Advanced filtering with repository
scenarios = scenario_repo.get_multi(
    filters={
        "status": "active",
        "created_at": {"gte": datetime(2024, 1, 1)},
        "created_by_id": {"in": [1, 2, 3]}
    },
    order_by="updated_at",
    order_desc=True
)

# Search across multiple fields
results = param_repo.search(
    search_term="growth rate",
    search_fields=["name", "display_name", "description"]
)
```

## Monitoring & Maintenance

### Health Checks

```python
from app.services.database_monitor import db_monitor

# Get comprehensive health status
health = db_monitor.get_health_check()

# Monitor query performance
performance = db_monitor.get_query_performance(limit=10)

# Check table sizes
table_info = db_monitor.get_table_sizes()
```

### Database Maintenance

```sql
-- Analyze table statistics
ANALYZE;

-- Vacuum tables to reclaim space
VACUUM (ANALYZE, VERBOSE);

-- Reindex for performance
REINDEX INDEX CONCURRENTLY ix_timeseries_scenario_type_date;
```

## Best Practices

### 1. **Transaction Management**

- Use repository methods for automatic transaction handling
- Implement proper rollback for errors
- Keep transactions short and focused

### 2. **Query Optimization**

- Use repository filtering instead of loading all data
- Leverage composite indexes for complex queries
- Use pagination for large result sets

### 3. **Data Integrity**

- Always use foreign key constraints
- Implement validation at both application and database levels
- Use database-level defaults and constraints

### 4. **Security**

- Never concatenate user input in SQL queries
- Use parameterized queries through SQLAlchemy ORM
- Implement proper access controls at repository level

### 5. **Performance**

- Monitor query performance regularly
- Use appropriate indexes for query patterns
- Consider partitioning for large time-series tables

## Migration Strategy

### Adding New Tables

1. Create migration file with proper foreign keys
2. Add corresponding SQLAlchemy model
3. Create repository class
4. Update base imports
5. Add API endpoints if needed

### Schema Changes

1. Always use Alembic migrations
2. Test migrations on copy of production data
3. Plan rollback strategy
4. Update documentation

This comprehensive schema provides a robust foundation for the FinVision platform's financial modeling and analysis capabilities.
