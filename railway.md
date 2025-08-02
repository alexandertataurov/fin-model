Mounting volume on: /var/lib/containers/railwayapp/bind-mounts/978dddc6-ea45-4f9a-9e73-2e1c519b41cf/vol_jwqq48p4f7wl6xs0
🔧 Auto-fix database enabled, checking schema...
✅ Database connection successful
✅ Applied 4 database fixes:

- Dropped problematic index: ix_rate_limits_key
- Dropped problematic index: ix_rate_limits_window_start
- Dropped problematic index: ix_parameters_type_category
- Dropped problematic index: ix_statements_scenario_period
  ✅ Database auto-fix completed successfully!
  🚀 Running database migrations...
  Running database migrations...
  INFO [alembic.runtime.migration] Context impl PostgresqlImpl.
  INFO [alembic.runtime.migration] Will assume transactional DDL.
  Database migrations completed successfully!
  ✅ Database migrations completed!
  🔎 Ensuring indexes (attempt 1)
  ✅ Index check completed
  /app/.venv/lib/python3.11/site-packages/pydantic/\_internal/\_config.py:373: UserWarning: Valid config keys have changed in V2:

* 'orm_mode' has been renamed to 'from_attributes'
  warnings.warn(message, UserWarning)
  Failed to start application: name 'Path' is not defined
  Traceback (most recent call last):
  File "/app/main.py", line 85, in <module>
  from main import app
  File "/app/backend/main.py", line 9, in <module>
  from app.api.v1.api import api_router
  File "/app/backend/app/api/v1/api.py", line 2, in <module>
  from app.api.v1.endpoints import (
  File "/app/backend/app/api/v1/endpoints/dashboard.py", line 684, in <module>
  format: str = Path(..., description="Export format (pdf, excel, json)"),
  ^^^^
  NameError: name 'Path' is not defined
