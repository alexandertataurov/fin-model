Mounting volume on: /var/lib/containers/railwayapp/bind-mounts/4abb0bb4-668a-48ff-bbc1-cd76db1acec6/vol_jwqq48p4f7wl6xs0
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
  Failed to start application: Cannot use `Query` for path param 'format'
  Traceback (most recent call last):
  File "/app/main.py", line 85, in <module>
  from main import app
  File "/app/backend/main.py", line 9, in <module>
  from app.api.v1.api import api_router
  File "/app/backend/app/api/v1/api.py", line 2, in <module>
  from app.api.v1.endpoints import (
  File "/app/backend/app/api/v1/endpoints/dashboard.py", line 682, in <module>
  @router.get("/export/{format}")
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/app/.venv/lib/python3.11/site-packages/fastapi/routing.py", line 921, in decorator
  self.add_api_route(
  File "/app/.venv/lib/python3.11/site-packages/fastapi/routing.py", line 860, in add_api_route
  route = route_class(
  ^^^^^^^^^^^^
  File "/app/.venv/lib/python3.11/site-packages/fastapi/routing.py", line 490, in **init**
  self.dependant = get_dependant(path=self.path_format, call=self.endpoint)
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/app/.venv/lib/python3.11/site-packages/fastapi/dependencies/utils.py", line 262, in get_dependant
  type_annotation, depends, param_field = analyze_param(
  ^^^^^^^^^^^^^^
  File "/app/.venv/lib/python3.11/site-packages/fastapi/dependencies/utils.py", line 418, in analyze_param
  assert isinstance(field_info, params.Path), (
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  AssertionError: Cannot use `Query` for path param 'format'
  Mounting volume on: /var/lib/containers/railwayapp/bind-mounts/4abb0bb4-668a-48ff-bbc1-cd76db1acec6/vol_jwqq48p4f7wl6xs0
