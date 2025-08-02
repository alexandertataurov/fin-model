(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_pending: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_pending]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_parameter_values_covering: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_parameter_values_covering]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_covering: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_covering]
(Background on this error at: https://sqlalche.me/e/20/2j85)
✅ Migration 006 cleanup completed. The original migration 006 should now run successfully.
Error running migrations: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: UPDATE alembic_version SET version_num='9dd5d1ac7ef0' WHERE alembic_version.version_num = '005']
(Background on this error at: https://sqlalche.me/e/20/2j85)
Traceback (most recent call last):
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1961, in \_exec_single_context
self.dialect.do_execute(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py", line 944, in do_execute
cursor.execute(statement, parameters)
psycopg2.errors.InFailedSqlTransaction: current transaction is aborted, commands ignored until end of transaction block

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
File "/app/backend/run*migrations.py", line 23, in run_migrations
command.upgrade(alembic_cfg, "head")
File "/app/.venv/lib/python3.11/site-packages/alembic/command.py", line 398, in upgrade
script.run_env()
File "/app/.venv/lib/python3.11/site-packages/alembic/script/base.py", line 579, in run_env
util.load_python_file(self.dir, "env.py")
File "/app/.venv/lib/python3.11/site-packages/alembic/util/pyfiles.py", line 93, in load_python_file
module = load_module_py(module_id, path)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/util/pyfiles.py", line 109, in load_module_py
spec.loader.exec_module(module) # type: ignore
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "<frozen importlib._bootstrap_external>", line 940, in exec_module
File "<frozen importlib._bootstrap>", line 241, in \_call_with_frames_removed
File "/app/backend/alembic/env.py", line 92, in <module>
run_migrations_online()
File "/app/backend/alembic/env.py", line 86, in run_migrations_online
context.run_migrations()
File "<string>", line 8, in run_migrations
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/environment.py", line 938, in run_migrations
self.get_context().run_migrations(\*\*kw)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 631, in run_migrations
head_maintainer.update_to_step(step)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 863, in update_to_step
self.\_update_version(from*, to\_)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 798, in \_update_version
ret = self.context.impl.\_exec(
^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/ddl/impl.py", line 200, in \_exec
return conn.execute(construct, multiparams)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1413, in execute
return meth(
^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/sql/elements.py", line 526, in \_execute_on_connection
return connection.\_execute_clauseelement(
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1635, in \_execute_clauseelement
ret = self.\_execute_context(
^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1840, in \_execute_context
return self.\_exec_single_context(
^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1980, in \_exec_single_context
self.\_handle_dbapi_exception(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 2349, in \_handle_dbapi_exception
raise sqlalchemy_exception.with_traceback(exc_info[2]) from e
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1961, in \_exec_single_context
self.dialect.do_execute(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py", line 944, in do_execute
cursor.execute(statement, parameters)
sqlalchemy.exc.InternalError: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: UPDATE alembic_version SET version_num='9dd5d1ac7ef0' WHERE alembic_version.version_num = '005']
(Background on this error at: https://sqlalche.me/e/20/2j85)
Mounting volume on: /var/lib/containers/railwayapp/bind-mounts/8aa6f4e8-0bab-4b45-a1f0-d437fe2be9f3/vol_jwqq48p4f7wl6xs0
🔧 Auto-fix database enabled, checking schema...
✅ Database connection successful
✅ Applied 2 database fixes:

- Dropped problematic index: ix_parameters_type_category
- Dropped problematic index: ix_statements_scenario_period
  ✅ Database auto-fix completed successfully!
  🚀 Running database migrations...
  Running database migrations...
  INFO [alembic.runtime.migration] Context impl PostgresqlImpl.
  INFO [alembic.runtime.migration] Will assume transactional DDL.
  INFO [alembic.runtime.migration] Running upgrade 005 -> 9dd5d1ac7ef0, fix_duplicate_indexes
  ⚠️ Could not drop index ix_metrics_name_period: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_name_period]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_category_type: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_category_type]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_scenario_category: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_scenario_category]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_value_range: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_value_range]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_type_date: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_type_date]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_scenario_type_date: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_scenario_type_date]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_frequency_actual: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_frequency_actual]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_date_range: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_date_range]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_subtype_date: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_subtype_date]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_order_active: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_order_active]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_type_scenario: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_type_scenario]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_executed_recently: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_executed_recently]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_templates_type_active: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_templates_type_active]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_templates_system_usage: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_templates_system_usage]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_versions_file_current: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_versions_file_current]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_versions_hash_lookup: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_versions_hash_lookup]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_versions_change_type: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_versions_change_type]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_action_time: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_action_time]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_user_success: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_user_success]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_resource_type: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_resource_type]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_recent: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_recent]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_ip_address: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_ip_address]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_report_templates_active: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_report_templates_active]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_report_schedules_next_run: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_report_schedules_next_run]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_report_exports_status_created: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_report_exports_status_created]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_report_exports_user_format: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_report_exports_user_format]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_parameters_search_gin: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_parameters_search_gin]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_scenarios_search_gin: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_scenarios_search_gin]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_files_search_gin: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_files_search_gin]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_templates_search_gin: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_templates_search_gin]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_users_active_only: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_users_active_only]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_files_processing: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_files_processing]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_scenarios_active: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_scenarios_active]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_pending: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_pending]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_parameter_values_covering: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_parameter_values_covering]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_covering: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_covering]
(Background on this error at: https://sqlalche.me/e/20/2j85)
✅ Migration 006 cleanup completed. The original migration 006 should now run successfully.
Error running migrations: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: UPDATE alembic_version SET version_num='9dd5d1ac7ef0' WHERE alembic_version.version_num = '005']
(Background on this error at: https://sqlalche.me/e/20/2j85)
Traceback (most recent call last):
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1961, in \_exec_single_context
self.dialect.do_execute(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py", line 944, in do_execute
cursor.execute(statement, parameters)
psycopg2.errors.InFailedSqlTransaction: current transaction is aborted, commands ignored until end of transaction block

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
File "/app/backend/run*migrations.py", line 23, in run_migrations
command.upgrade(alembic_cfg, "head")
File "/app/.venv/lib/python3.11/site-packages/alembic/command.py", line 398, in upgrade
script.run_env()
File "/app/.venv/lib/python3.11/site-packages/alembic/script/base.py", line 579, in run_env
util.load_python_file(self.dir, "env.py")
File "/app/.venv/lib/python3.11/site-packages/alembic/util/pyfiles.py", line 93, in load_python_file
module = load_module_py(module_id, path)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/util/pyfiles.py", line 109, in load_module_py
spec.loader.exec_module(module) # type: ignore
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "<frozen importlib._bootstrap_external>", line 940, in exec_module
File "<frozen importlib._bootstrap>", line 241, in \_call_with_frames_removed
File "/app/backend/alembic/env.py", line 92, in <module>
run_migrations_online()
File "/app/backend/alembic/env.py", line 86, in run_migrations_online
context.run_migrations()
File "<string>", line 8, in run_migrations
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/environment.py", line 938, in run_migrations
self.get_context().run_migrations(\*\*kw)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 631, in run_migrations
head_maintainer.update_to_step(step)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 863, in update_to_step
self.\_update_version(from*, to\_)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 798, in \_update_version
ret = self.context.impl.\_exec(
^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/ddl/impl.py", line 200, in \_exec
return conn.execute(construct, multiparams)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1413, in execute
return meth(
^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/sql/elements.py", line 526, in \_execute_on_connection
return connection.\_execute_clauseelement(
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1635, in \_execute_clauseelement
ret = self.\_execute_context(
^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1840, in \_execute_context
return self.\_exec_single_context(
^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1980, in \_exec_single_context
self.\_handle_dbapi_exception(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 2349, in \_handle_dbapi_exception
raise sqlalchemy_exception.with_traceback(exc_info[2]) from e
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1961, in \_exec_single_context
self.dialect.do_execute(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py", line 944, in do_execute
cursor.execute(statement, parameters)
sqlalchemy.exc.InternalError: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: UPDATE alembic_version SET version_num='9dd5d1ac7ef0' WHERE alembic_version.version_num = '005']
(Background on this error at: https://sqlalche.me/e/20/2j85)
Mounting volume on: /var/lib/containers/railwayapp/bind-mounts/8aa6f4e8-0bab-4b45-a1f0-d437fe2be9f3/vol_jwqq48p4f7wl6xs0
🔧 Auto-fix database enabled, checking schema...
✅ Database connection successful
✅ Applied 2 database fixes:

- Dropped problematic index: ix_parameters_type_category
- Dropped problematic index: ix_statements_scenario_period
  ✅ Database auto-fix completed successfully!
  🚀 Running database migrations...
  Running database migrations...
  INFO [alembic.runtime.migration] Context impl PostgresqlImpl.
  INFO [alembic.runtime.migration] Will assume transactional DDL.
  INFO [alembic.runtime.migration] Running upgrade 005 -> 9dd5d1ac7ef0, fix_duplicate_indexes
  ⚠️ Could not drop index ix_metrics_name_period: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_name_period]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_category_type: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_category_type]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_scenario_category: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_scenario_category]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_value_range: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_value_range]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_type_date: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_type_date]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_scenario_type_date: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_scenario_type_date]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_frequency_actual: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_frequency_actual]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_date_range: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_date_range]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_subtype_date: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_subtype_date]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_order_active: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_order_active]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_type_scenario: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_type_scenario]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_executed_recently: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_executed_recently]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_templates_type_active: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_templates_type_active]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_templates_system_usage: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_templates_system_usage]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_versions_file_current: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_versions_file_current]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_versions_hash_lookup: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_versions_hash_lookup]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_versions_change_type: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_versions_change_type]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_action_time: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_action_time]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_user_success: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_user_success]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_resource_type: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_resource_type]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_recent: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_recent]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_ip_address: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_ip_address]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_report_templates_active: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_report_templates_active]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_report_schedules_next_run: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_report_schedules_next_run]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_report_exports_status_created: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_report_exports_status_created]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_report_exports_user_format: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_report_exports_user_format]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_parameters_search_gin: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_parameters_search_gin]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_scenarios_search_gin: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_scenarios_search_gin]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_files_search_gin: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_files_search_gin]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_templates_search_gin: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_templates_search_gin]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_users_active_only: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_users_active_only]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_files_processing: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_files_processing]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_scenarios_active: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_scenarios_active]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_pending: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_pending]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_parameter_values_covering: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_parameter_values_covering]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_covering: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_covering]
(Background on this error at: https://sqlalche.me/e/20/2j85)
✅ Migration 006 cleanup completed. The original migration 006 should now run successfully.
Error running migrations: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: UPDATE alembic_version SET version_num='9dd5d1ac7ef0' WHERE alembic_version.version_num = '005']
(Background on this error at: https://sqlalche.me/e/20/2j85)
Traceback (most recent call last):
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1961, in \_exec_single_context
self.dialect.do_execute(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py", line 944, in do_execute
cursor.execute(statement, parameters)
psycopg2.errors.InFailedSqlTransaction: current transaction is aborted, commands ignored until end of transaction block

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
File "/app/backend/run*migrations.py", line 23, in run_migrations
command.upgrade(alembic_cfg, "head")
File "/app/.venv/lib/python3.11/site-packages/alembic/command.py", line 398, in upgrade
script.run_env()
File "/app/.venv/lib/python3.11/site-packages/alembic/script/base.py", line 579, in run_env
util.load_python_file(self.dir, "env.py")
File "/app/.venv/lib/python3.11/site-packages/alembic/util/pyfiles.py", line 93, in load_python_file
module = load_module_py(module_id, path)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/util/pyfiles.py", line 109, in load_module_py
spec.loader.exec_module(module) # type: ignore
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "<frozen importlib._bootstrap_external>", line 940, in exec_module
File "<frozen importlib._bootstrap>", line 241, in \_call_with_frames_removed
File "/app/backend/alembic/env.py", line 92, in <module>
run_migrations_online()
File "/app/backend/alembic/env.py", line 86, in run_migrations_online
context.run_migrations()
File "<string>", line 8, in run_migrations
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/environment.py", line 938, in run_migrations
self.get_context().run_migrations(\*\*kw)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 631, in run_migrations
head_maintainer.update_to_step(step)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 863, in update_to_step
self.\_update_version(from*, to\_)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 798, in \_update_version
ret = self.context.impl.\_exec(
^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/ddl/impl.py", line 200, in \_exec
return conn.execute(construct, multiparams)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1413, in execute
return meth(
^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/sql/elements.py", line 526, in \_execute_on_connection
return connection.\_execute_clauseelement(
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1635, in \_execute_clauseelement
ret = self.\_execute_context(
^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1840, in \_execute_context
return self.\_exec_single_context(
^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1980, in \_exec_single_context
self.\_handle_dbapi_exception(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 2349, in \_handle_dbapi_exception
raise sqlalchemy_exception.with_traceback(exc_info[2]) from e
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1961, in \_exec_single_context
self.dialect.do_execute(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py", line 944, in do_execute
cursor.execute(statement, parameters)
sqlalchemy.exc.InternalError: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: UPDATE alembic_version SET version_num='9dd5d1ac7ef0' WHERE alembic_version.version_num = '005']
(Background on this error at: https://sqlalche.me/e/20/2j85)
Mounting volume on: /var/lib/containers/railwayapp/bind-mounts/8aa6f4e8-0bab-4b45-a1f0-d437fe2be9f3/vol_jwqq48p4f7wl6xs0
🔧 Auto-fix database enabled, checking schema...
✅ Database connection successful
✅ Applied 2 database fixes:

- Dropped problematic index: ix_parameters_type_category
- Dropped problematic index: ix_statements_scenario_period
  ✅ Database auto-fix completed successfully!
  🚀 Running database migrations...
  Running database migrations...
  INFO [alembic.runtime.migration] Context impl PostgresqlImpl.
  INFO [alembic.runtime.migration] Will assume transactional DDL.
  INFO [alembic.runtime.migration] Running upgrade 005 -> 9dd5d1ac7ef0, fix_duplicate_indexes
  ⚠️ Could not drop index ix_metrics_name_period: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_name_period]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_category_type: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_category_type]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_scenario_category: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_scenario_category]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_value_range: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_value_range]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_type_date: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_type_date]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_scenario_type_date: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_scenario_type_date]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_frequency_actual: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_frequency_actual]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_date_range: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_date_range]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_timeseries_subtype_date: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_timeseries_subtype_date]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_order_active: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_order_active]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_type_scenario: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_type_scenario]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_executed_recently: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_executed_recently]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_templates_type_active: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_templates_type_active]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_templates_system_usage: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_templates_system_usage]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_versions_file_current: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_versions_file_current]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_versions_hash_lookup: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_versions_hash_lookup]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_versions_change_type: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_versions_change_type]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_action_time: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_action_time]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_user_success: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_user_success]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_resource_type: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_resource_type]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_recent: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_recent]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_audit_ip_address: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_audit_ip_address]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_report_templates_active: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_report_templates_active]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_report_schedules_next_run: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_report_schedules_next_run]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_report_exports_status_created: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_report_exports_status_created]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_report_exports_user_format: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_report_exports_user_format]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_parameters_search_gin: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_parameters_search_gin]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_scenarios_search_gin: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_scenarios_search_gin]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_files_search_gin: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_files_search_gin]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_templates_search_gin: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_templates_search_gin]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_users_active_only: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_users_active_only]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_files_processing: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_files_processing]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_scenarios_active: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_scenarios_active]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_calculations_pending: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_calculations_pending]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_parameter_values_covering: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_parameter_values_covering]
(Background on this error at: https://sqlalche.me/e/20/2j85)
⚠️ Could not drop index ix_metrics_covering: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: DROP INDEX IF EXISTS ix_metrics_covering]
(Background on this error at: https://sqlalche.me/e/20/2j85)
✅ Migration 006 cleanup completed. The original migration 006 should now run successfully.
Error running migrations: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: UPDATE alembic_version SET version_num='9dd5d1ac7ef0' WHERE alembic_version.version_num = '005']
(Background on this error at: https://sqlalche.me/e/20/2j85)
Traceback (most recent call last):
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1961, in \_exec_single_context
self.dialect.do_execute(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py", line 944, in do_execute
cursor.execute(statement, parameters)
psycopg2.errors.InFailedSqlTransaction: current transaction is aborted, commands ignored until end of transaction block

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
File "/app/backend/run*migrations.py", line 23, in run_migrations
command.upgrade(alembic_cfg, "head")
File "/app/.venv/lib/python3.11/site-packages/alembic/command.py", line 398, in upgrade
script.run_env()
File "/app/.venv/lib/python3.11/site-packages/alembic/script/base.py", line 579, in run_env
util.load_python_file(self.dir, "env.py")
File "/app/.venv/lib/python3.11/site-packages/alembic/util/pyfiles.py", line 93, in load_python_file
module = load_module_py(module_id, path)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/util/pyfiles.py", line 109, in load_module_py
spec.loader.exec_module(module) # type: ignore
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "<frozen importlib._bootstrap_external>", line 940, in exec_module
File "<frozen importlib._bootstrap>", line 241, in \_call_with_frames_removed
File "/app/backend/alembic/env.py", line 92, in <module>
run_migrations_online()
File "/app/backend/alembic/env.py", line 86, in run_migrations_online
context.run_migrations()
File "<string>", line 8, in run_migrations
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/environment.py", line 938, in run_migrations
self.get_context().run_migrations(\*\*kw)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 631, in run_migrations
head_maintainer.update_to_step(step)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 863, in update_to_step
self.\_update_version(from*, to\_)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 798, in \_update_version
ret = self.context.impl.\_exec(
^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/ddl/impl.py", line 200, in \_exec
return conn.execute(construct, multiparams)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1413, in execute
return meth(
^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/sql/elements.py", line 526, in \_execute_on_connection
return connection.\_execute_clauseelement(
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1635, in \_execute_clauseelement
ret = self.\_execute_context(
^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1840, in \_execute_context
return self.\_exec_single_context(
^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1980, in \_exec_single_context
self.\_handle_dbapi_exception(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 2349, in \_handle_dbapi_exception
raise sqlalchemy_exception.with_traceback(exc_info[2]) from e
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1961, in \_exec_single_context
self.dialect.do_execute(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py", line 944, in do_execute
cursor.execute(statement, parameters)
sqlalchemy.exc.InternalError: (psycopg2.errors.InFailedSqlTransaction) current transaction is aborted, commands ignored until end of transaction block

[SQL: UPDATE alembic_version SET version_num='9dd5d1ac7ef0' WHERE alembic_version.version_num = '005']
(Background on this error at: https://sqlalche.me/e/20/2j85)
(.venv) PS C:\Python Dev Folder\fin-model\fin-model> railway logs --service fin-model
No deployments found
(.venv) PS C:\Python Dev Folder\fin-model\fin-model> railway logs --service fin-model
No deployments found
(.venv) PS C:\Python Dev Folder\fin-model\fin-model> railway logs --service fin-model
No deployments found
(.venv) PS C:\Python Dev Folder\fin-model\fin-model> railway logs --service fin-model
No deployments found
(.venv) PS C:\Python Dev Folder\fin-model\fin-model> railway logs --service fin-model
No deployments found
(.venv) PS C:\Python Dev Folder\fin-model\fin-model> railway logs --service fin-model
No deployments found
(.venv) PS C:\Python Dev Folder\fin-model\fin-model> railway logs --service fin-model
No deployments found
(.venv) PS C:\Python Dev Folder\fin-model\fin-model> railway logs --service fin-model
No deployments found
(.venv) PS C:\Python Dev Folder\fin-model\fin-model> railway logs --service fin-model
No deployments found
(.venv) PS C:\Python Dev Folder\fin-model\fin-model> railway logs --service fin-model
No deployments found
(.venv) PS C:\Python Dev Folder\fin-model\fin-model> railway logs --service fin-model
No deployments found
(.venv) PS C:\Python Dev Folder\fin-model\fin-model> railway logs --service fin-model
Mounting volume on: /var/lib/containers/railwayapp/bind-mounts/21a28cd9-4682-4828-8ae7-e953d982afaf/vol_jwqq48p4f7wl6xs0
Starting Container
🔧 Auto-fix database enabled, checking schema...
✅ Database connection successful
✅ Applied 2 database fixes:

- Dropped problematic index: ix_parameters_type_category
- Dropped problematic index: ix_statements_scenario_period
  ✅ Database auto-fix completed successfully!
  🚀 Running database migrations...
  Running database migrations...
  INFO [alembic.runtime.migration] Context impl PostgresqlImpl.
  INFO [alembic.runtime.migration] Will assume transactional DDL.
  INFO [alembic.runtime.migration] Running upgrade 005 -> 9dd5d1ac7ef0, fix_duplicate_indexes
  ✅ Dropped index ix_metrics_name_period
  ✅ Dropped index ix_metrics_category_type
  ✅ Dropped index ix_metrics_scenario_category
  ✅ Dropped index ix_metrics_value_range
  ✅ Dropped index ix_timeseries_type_date
  ✅ Dropped index ix_timeseries_scenario_type_date
  ✅ Dropped index ix_timeseries_frequency_actual
  ✅ Dropped index ix_timeseries_date_range
  ✅ Dropped index ix_timeseries_subtype_date
  ✅ Dropped index ix_calculations_order_active
  ✅ Dropped index ix_calculations_type_scenario
  ✅ Dropped index ix_calculations_executed_recently
  ✅ Dropped index ix_templates_type_active
  ✅ Dropped index ix_templates_system_usage
  ✅ Dropped index ix_versions_file_current
  ✅ Dropped index ix_versions_hash_lookup
  ✅ Dropped index ix_versions_change_type
  ✅ Dropped index ix_audit_action_time
  ✅ Dropped index ix_audit_user_success
  ✅ Dropped index ix_audit_resource_type
  ✅ Dropped index ix_audit_recent
  ✅ Dropped index ix_audit_ip_address
  ✅ Dropped index ix_report_templates_active
  ✅ Dropped index ix_report_schedules_next_run
  ✅ Dropped index ix_report_exports_status_created
  ✅ Dropped index ix_report_exports_user_format
  ✅ Dropped index ix_parameters_search_gin
  ✅ Dropped index ix_scenarios_search_gin
  ✅ Dropped index ix_files_search_gin
  ✅ Dropped index ix_templates_search_gin
  ✅ Dropped index ix_users_active_only
  ✅ Dropped index ix_files_processing
  ✅ Dropped index ix_scenarios_active
  ✅ Dropped index ix_calculations_pending
  ✅ Dropped index ix_parameter_values_covering
  ✅ Dropped index ix_metrics_covering
  ✅ Migration 006 cleanup completed. The original migration 006 should now run successfully.
  INFO [alembic.runtime.migration] Running upgrade 9dd5d1ac7ef0 -> 006, Add advanced indexes for performance optimization
  INFO [alembic.runtime.migration] Running upgrade 006 -> 007, Add missing user columns
  Error running migrations: (psycopg2.errors.DuplicateColumn) column "full_name" of relation "users" already exists

[SQL: ALTER TABLE users ADD COLUMN full_name VARCHAR(100) DEFAULT '' NOT NULL]
(Background on this error at: https://sqlalche.me/e/20/f405)
Traceback (most recent call last):
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1961, in \_exec_single_context
self.dialect.do_execute(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py", line 944, in do_execute
cursor.execute(statement, parameters)
psycopg2.errors.DuplicateColumn: column "full_name" of relation "users" already exists

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
File "/app/backend/run_migrations.py", line 23, in run_migrations
command.upgrade(alembic_cfg, "head")
File "/app/.venv/lib/python3.11/site-packages/alembic/command.py", line 398, in upgrade
script.run_env()
File "/app/.venv/lib/python3.11/site-packages/alembic/script/base.py", line 579, in run_env
util.load_python_file(self.dir, "env.py")
File "/app/.venv/lib/python3.11/site-packages/alembic/util/pyfiles.py", line 93, in load_python_file
module = load_module_py(module_id, path)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/util/pyfiles.py", line 109, in load_module_py
spec.loader.exec_module(module) # type: ignore
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "<frozen importlib._bootstrap_external>", line 940, in exec_module
File "<frozen importlib._bootstrap>", line 241, in \_call_with_frames_removed
File "/app/backend/alembic/env.py", line 92, in <module>
run_migrations_online()
File "/app/backend/alembic/env.py", line 86, in run_migrations_online
context.run_migrations()
File "<string>", line 8, in run_migrations
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/environment.py", line 938, in run_migrations
self.get_context().run_migrations(**kw)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 624, in run_migrations
step.migration_fn(**kw)
File "/app/backend/alembic/versions/007_add_missing_user_columns.py", line 23, in upgrade
op.add_column(
File "<string>", line 8, in add_column
File "<string>", line 3, in add_column
File "/app/.venv/lib/python3.11/site-packages/alembic/operations/ops.py", line 2126, in add_column
return operations.invoke(op)
^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/operations/base.py", line 393, in invoke
return fn(self, operation)
^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/operations/toimpl.py", line 168, in add_column
operations.impl.add_column(table_name, column, schema=schema, \*\*kw)
File "/app/.venv/lib/python3.11/site-packages/alembic/ddl/impl.py", line 327, in add_column
self.\_exec(base.AddColumn(table_name, column, schema=schema))
File "/app/.venv/lib/python3.11/site-packages/alembic/ddl/impl.py", line 200, in \_exec
return conn.execute(construct, multiparams)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1413, in execute
return meth(
^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/sql/ddl.py", line 187, in \_execute_on_connection
return connection.\_execute_ddl(
^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1524, in \_execute_ddl
ret = self.\_execute_context(
^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1840, in \_execute_context
return self.\_exec_single_context(
^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1980, in \_exec_single_context
self.\_handle_dbapi_exception(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 2349, in \_handle_dbapi_exception
raise sqlalchemy_exception.with_traceback(exc_info[2]) from e
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1961, in \_exec_single_context
self.dialect.do_execute(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py", line 944, in do_execute
cursor.execute(statement, parameters)
sqlalchemy.exc.ProgrammingError: (psycopg2.errors.DuplicateColumn) column "full_name" of relation "users" already exists

[SQL: ALTER TABLE users ADD COLUMN full_name VARCHAR(100) DEFAULT '' NOT NULL]
(Background on this error at: https://sqlalche.me/e/20/f405)
Mounting volume on: /var/lib/containers/railwayapp/bind-mounts/21a28cd9-4682-4828-8ae7-e953d982afaf/vol_jwqq48p4f7wl6xs0
🔧 Auto-fix database enabled, checking schema...
✅ Database connection successful
✅ Applied 2 database fixes:

- Dropped problematic index: ix_parameters_type_category
- Dropped problematic index: ix_statements_scenario_period
  ✅ Database auto-fix completed successfully!
  🚀 Running database migrations...
  Running database migrations...
  INFO [alembic.runtime.migration] Context impl PostgresqlImpl.
  INFO [alembic.runtime.migration] Will assume transactional DDL.
  INFO [alembic.runtime.migration] Running upgrade 9dd5d1ac7ef0 -> 006, Add advanced indexes for performance optimization
  Error running migrations: (psycopg2.errors.DuplicateTable) relation "ix_parameters_search_gin" already exists

[SQL:
CREATE INDEX CONCURRENTLY ix_parameters_search_gin
ON parameters USING gin(to_tsvector('english',
COALESCE(name, '') || ' ' ||
COALESCE(display_name, '') || ' ' ||
COALESCE(description, '')
))
]
(Background on this error at: https://sqlalche.me/e/20/f405)
Traceback (most recent call last):
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1961, in \_exec_single_context
self.dialect.do_execute(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py", line 944, in do_execute
cursor.execute(statement, parameters)
psycopg2.errors.DuplicateTable: relation "ix_parameters_search_gin" already exists

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
File "/app/backend/run_migrations.py", line 23, in run_migrations
command.upgrade(alembic_cfg, "head")
File "/app/.venv/lib/python3.11/site-packages/alembic/command.py", line 398, in upgrade
script.run_env()
File "/app/.venv/lib/python3.11/site-packages/alembic/script/base.py", line 579, in run_env
util.load_python_file(self.dir, "env.py")
File "/app/.venv/lib/python3.11/site-packages/alembic/util/pyfiles.py", line 93, in load_python_file
module = load_module_py(module_id, path)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/util/pyfiles.py", line 109, in load_module_py
spec.loader.exec_module(module) # type: ignore
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "<frozen importlib._bootstrap_external>", line 940, in exec_module
File "<frozen importlib._bootstrap>", line 241, in \_call_with_frames_removed
File "/app/backend/alembic/env.py", line 92, in <module>
run_migrations_online()
File "/app/backend/alembic/env.py", line 86, in run_migrations_online
context.run_migrations()
File "<string>", line 8, in run_migrations
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/environment.py", line 938, in run_migrations
self.get_context().run_migrations(**kw)
File "/app/.venv/lib/python3.11/site-packages/alembic/runtime/migration.py", line 624, in run_migrations
step.migration_fn(**kw)
File "/app/backend/alembic/versions/006_add_advanced_indexes.py", line 111, in upgrade
op.execute(
File "<string>", line 8, in execute
File "<string>", line 3, in execute
File "/app/.venv/lib/python3.11/site-packages/alembic/operations/ops.py", line 2521, in execute
return operations.invoke(op)
^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/operations/base.py", line 393, in invoke
return fn(self, operation)
^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/alembic/operations/toimpl.py", line 221, in execute_sql
operations.migration_context.impl.execute(
File "/app/.venv/lib/python3.11/site-packages/alembic/ddl/impl.py", line 207, in execute
self.\_exec(sql, execution_options)
File "/app/.venv/lib/python3.11/site-packages/alembic/ddl/impl.py", line 200, in \_exec
return conn.execute(construct, multiparams)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1413, in execute
return meth(
^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/sql/elements.py", line 526, in \_execute_on_connection
return connection.\_execute_clauseelement(
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1635, in \_execute_clauseelement
ret = self.\_execute_context(
^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1840, in \_execute_context
return self.\_exec_single_context(
^^^^^^^^^^^^^^^^^^^^^^^^^^
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1980, in \_exec_single_context
self.\_handle_dbapi_exception(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 2349, in \_handle_dbapi_exception
raise sqlalchemy_exception.with_traceback(exc_info[2]) from e
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py", line 1961, in \_exec_single_context
self.dialect.do_execute(
File "/app/.venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py", line 944, in do_execute
cursor.execute(statement, parameters)
sqlalchemy.exc.ProgrammingError: (psycopg2.errors.DuplicateTable) relation "ix_parameters_search_gin" already exists

[SQL:
CREATE INDEX CONCURRENTLY ix_parameters_search_gin
ON parameters USING gin(to_tsvector('english',
COALESCE(name, '') || ' ' ||
COALESCE(display_name, '') || ' ' ||
COALESCE(description, '')
))
]
(Background on this error at: https://sqlalche.me/e/20/f405)
