"""Add advanced indexes for performance optimization

Revision ID: 006
Revises: 005
Create Date: 2024-12-20 11:00:00.000000

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = "006"
down_revision = "005"
branch_labels = None
depends_on = None


def upgrade():
    # Advanced indexes for users table
    conn = op.get_bind()
    inspector = inspect(conn)
    existing_indexes = [ix["name"] for ix in inspector.get_indexes("users")]

    if "ix_users_last_login" not in existing_indexes:
        op.create_index("ix_users_last_login", "users", ["last_login"], unique=False)
    op.create_index(
        "ix_users_created_date", "users", [sa.text("DATE(created_at)")], unique=False
    )
    op.create_index(
        "ix_users_active_verified", "users", ["is_active", "is_verified"], unique=False
    )

    # Advanced indexes for uploaded_files table
    op.create_index(
        "ix_files_status_created",
        "uploaded_files",
        ["status", "created_at"],
        unique=False,
    )
    op.create_index(
        "ix_files_size_type", "uploaded_files", ["file_size", "file_type"], unique=False
    )
    op.create_index(
        "ix_files_processing_times",
        "uploaded_files",
        ["processing_started_at", "processing_completed_at"],
        unique=False,
    )
    op.create_index(
        "ix_files_user_status",
        "uploaded_files",
        ["uploaded_by_id", "status"],
        unique=False,
    )

    # Advanced indexes for parameters table
    op.create_index(
        "ix_parameters_type_category",
        "parameters",
        ["parameter_type", "category"],
        unique=False,
    )
    op.create_index(
        "ix_parameters_sensitivity_editable",
        "parameters",
        ["sensitivity_level", "is_editable"],
        unique=False,
    )
    op.create_index(
        "ix_parameters_file_sheet",
        "parameters",
        ["source_file_id", "source_sheet"],
        unique=False,
    )
    op.create_index(
        "ix_parameters_updated_recently",
        "parameters",
        [sa.text("updated_at DESC")],
        unique=False,
    )

    # Advanced indexes for scenarios table
    op.create_index(
        "ix_scenarios_status_baseline",
        "scenarios",
        ["status", "is_baseline"],
        unique=False,
    )
    op.create_index(
        "ix_scenarios_file_created",
        "scenarios",
        ["base_file_id", "created_at"],
        unique=False,
    )
    op.create_index(
        "ix_scenarios_calculation_status",
        "scenarios",
        ["calculation_status", "last_calculated_at"],
        unique=False,
    )
    op.create_index(
        "ix_scenarios_user_active",
        "scenarios",
        ["created_by_id", "status"],
        unique=False,
    )

    # Advanced indexes for financial_statements table
    op.create_index(
        "ix_statements_period_range",
        "financial_statements",
        ["period_start", "period_end", "statement_type"],
        unique=False,
    )
    op.create_index(
        "ix_statements_scenario_type",
        "financial_statements",
        ["scenario_id", "statement_type", "period_start"],
        unique=False,
    )
    op.create_index(
        "ix_statements_currency_period",
        "financial_statements",
        ["currency", "period_type"],
        unique=False,
    )
    op.create_index(
        "ix_statements_baseline_version",
        "financial_statements",
        ["is_baseline", "version"],
        unique=False,
    )

    # Advanced indexes for metrics table
    op.create_index(
        "ix_metrics_name_period",
        "metrics",
        ["metric_name", "period_start", "period_end"],
        unique=False,
    )
    op.create_index(
        "ix_metrics_category_type",
        "metrics",
        ["metric_category", "metric_type"],
        unique=False,
    )
    op.create_index(
        "ix_metrics_scenario_category",
        "metrics",
        ["scenario_id", "metric_category"],
        unique=False,
    )
    op.create_index("ix_metrics_value_range", "metrics", ["value"], unique=False)

    # Advanced indexes for time_series table (critical for performance)
    op.create_index(
        "ix_timeseries_type_date",
        "time_series",
        ["data_type", "period_date"],
        unique=False,
    )
    op.create_index(
        "ix_timeseries_scenario_type_date",
        "time_series",
        ["scenario_id", "data_type", "period_date"],
        unique=False,
    )
    op.create_index(
        "ix_timeseries_frequency_actual",
        "time_series",
        ["frequency", "is_actual"],
        unique=False,
    )
    op.create_index(
        "ix_timeseries_date_range",
        "time_series",
        [sa.text("period_date DESC")],
        unique=False,
    )
    op.create_index(
        "ix_timeseries_subtype_date",
        "time_series",
        ["data_subtype", "period_date"],
        unique=False,
    )

    # Advanced indexes for calculations table
    op.create_index(
        "ix_calculations_order_active",
        "calculations",
        ["execution_order", "is_active"],
        unique=False,
    )
    op.create_index(
        "ix_calculations_type_scenario",
        "calculations",
        ["calculation_type", "scenario_id"],
        unique=False,
    )
    op.create_index(
        "ix_calculations_executed_recently",
        "calculations",
        [sa.text("last_executed_at DESC NULLS LAST")],
        unique=False,
    )

    # Advanced indexes for templates table
    op.create_index(
        "ix_templates_type_active",
        "templates",
        ["template_type", "is_active"],
        unique=False,
    )
    op.create_index(
        "ix_templates_system_usage",
        "templates",
        ["is_system_template", "usage_count"],
        unique=False,
    )

    # Advanced indexes for file_versions table
    op.create_index(
        "ix_versions_file_current",
        "file_versions",
        ["file_id", "is_current"],
        unique=False,
    )
    op.create_index(
        "ix_versions_hash_lookup", "file_versions", ["file_hash"], unique=False
    )
    op.create_index(
        "ix_versions_change_type",
        "file_versions",
        ["change_type", "created_at"],
        unique=False,
    )

    # Advanced indexes for audit_logs table (for security and monitoring)
    op.create_index(
        "ix_audit_action_time", "audit_logs", ["action", "created_at"], unique=False
    )
    op.create_index(
        "ix_audit_user_success",
        "audit_logs",
        ["user_id", "success", "created_at"],
        unique=False,
    )
    op.create_index(
        "ix_audit_resource_type",
        "audit_logs",
        ["resource", "resource_id"],
        unique=False,
    )
    op.create_index(
        "ix_audit_recent", "audit_logs", [sa.text("created_at DESC")], unique=False
    )
    op.create_index("ix_audit_ip_address", "audit_logs", ["ip_address"], unique=False)

    # Advanced indexes for reports
    op.create_index(
        "ix_report_templates_active",
        "report_templates",
        ["is_active", "report_type"],
        unique=False,
    )
    op.create_index(
        "ix_report_schedules_next_run",
        "report_schedules",
        ["next_run_at", "is_active"],
        unique=False,
    )
    op.create_index(
        "ix_report_exports_status_created",
        "report_exports",
        ["status", "created_at"],
        unique=False,
    )
    op.create_index(
        "ix_report_exports_user_format",
        "report_exports",
        ["created_by", "export_format"],
        unique=False,
    )

    # Full-text search indexes (PostgreSQL specific)
    # Create GIN indexes for better text search on key fields

    with op.get_context().autocommit_block():
        op.execute(
            """
            CREATE INDEX CONCURRENTLY ix_parameters_search_gin
            ON parameters USING gin(to_tsvector('english',
                COALESCE(name, '') || ' ' ||
                COALESCE(display_name, '') || ' ' ||
                COALESCE(description, '')
            ))
        """
        )

        op.execute(
            """
            CREATE INDEX CONCURRENTLY ix_scenarios_search_gin
            ON scenarios USING gin(to_tsvector('english',
                COALESCE(name, '') || ' ' ||
                COALESCE(description, '')
            ))
        """
        )

        op.execute(
            """
            CREATE INDEX CONCURRENTLY ix_files_search_gin
            ON uploaded_files USING gin(to_tsvector('english',
                COALESCE(filename, '') || ' ' ||
                COALESCE(original_filename, '')
            ))
        """
        )

        op.execute(
            """
            CREATE INDEX CONCURRENTLY ix_templates_search_gin
            ON templates USING gin(to_tsvector('english',
                COALESCE(name, '') || ' ' ||
                COALESCE(description, '')
            ))
        """
        )

        # Partial indexes for common filtered queries
        op.execute(
            (
                "CREATE INDEX CONCURRENTLY ix_users_active_only ON users (id) "
                "WHERE is_active = true"
            )
        )
        op.execute(
            (
                "CREATE INDEX CONCURRENTLY ix_files_processing ON uploaded_files "
                "(id, created_at) WHERE status IN ('processing', 'uploaded')"
            )
        )
        op.execute(
            (
                "CREATE INDEX CONCURRENTLY ix_scenarios_active ON scenarios (id, "
                "updated_at) WHERE status = 'active'"
            )
        )
        op.execute(
            (
                "CREATE INDEX CONCURRENTLY ix_calculations_pending ON calculations "
                "(execution_order) WHERE is_active = true AND last_executed_at IS NULL"
            )
        )

        # Covering indexes for common join patterns
        op.execute(
            """
            CREATE INDEX CONCURRENTLY ix_parameter_values_covering
            ON parameter_values (scenario_id, parameter_id)
            INCLUDE (value, changed_at, is_valid)
        """
        )

        op.execute(
            """
            CREATE INDEX CONCURRENTLY ix_metrics_covering
            ON metrics (scenario_id, metric_category)
            INCLUDE (metric_name, value, period_start, period_end)
        """
        )


def downgrade():
    # Drop covering and partial indexes
    with op.get_context().autocommit_block():
        op.execute("DROP INDEX CONCURRENTLY IF EXISTS ix_metrics_covering")
        op.execute("DROP INDEX CONCURRENTLY IF EXISTS ix_parameter_values_covering")

        # Drop partial indexes
        op.execute("DROP INDEX CONCURRENTLY IF EXISTS ix_calculations_pending")
        op.execute("DROP INDEX CONCURRENTLY IF EXISTS ix_scenarios_active")
        op.execute("DROP INDEX CONCURRENTLY IF EXISTS ix_files_processing")
        op.execute("DROP INDEX CONCURRENTLY IF EXISTS ix_users_active_only")

        # Drop full-text search indexes
        op.execute("DROP INDEX CONCURRENTLY IF EXISTS ix_templates_search_gin")
        op.execute("DROP INDEX CONCURRENTLY IF EXISTS ix_files_search_gin")
        op.execute("DROP INDEX CONCURRENTLY IF EXISTS ix_scenarios_search_gin")
        op.execute("DROP INDEX CONCURRENTLY IF EXISTS ix_parameters_search_gin")

    # Drop report indexes
    op.drop_index("ix_report_exports_user_format", table_name="report_exports")
    op.drop_index("ix_report_exports_status_created", table_name="report_exports")
    op.drop_index("ix_report_schedules_next_run", table_name="report_schedules")
    op.drop_index("ix_report_templates_active", table_name="report_templates")

    # Drop audit indexes
    op.drop_index("ix_audit_ip_address", table_name="audit_logs")
    op.drop_index("ix_audit_recent", table_name="audit_logs")
    op.drop_index("ix_audit_resource_type", table_name="audit_logs")
    op.drop_index("ix_audit_user_success", table_name="audit_logs")
    op.drop_index("ix_audit_action_time", table_name="audit_logs")

    # Drop file version indexes
    op.drop_index("ix_versions_change_type", table_name="file_versions")
    op.drop_index("ix_versions_hash_lookup", table_name="file_versions")
    op.drop_index("ix_versions_file_current", table_name="file_versions")

    # Drop template indexes
    op.drop_index("ix_templates_system_usage", table_name="templates")
    op.drop_index("ix_templates_type_active", table_name="templates")

    # Drop calculation indexes
    op.drop_index("ix_calculations_executed_recently", table_name="calculations")
    op.drop_index("ix_calculations_type_scenario", table_name="calculations")
    op.drop_index("ix_calculations_order_active", table_name="calculations")

    # Drop time series indexes
    op.drop_index("ix_timeseries_subtype_date", table_name="time_series")
    op.drop_index("ix_timeseries_date_range", table_name="time_series")
    op.drop_index("ix_timeseries_frequency_actual", table_name="time_series")
    op.drop_index("ix_timeseries_scenario_type_date", table_name="time_series")
    op.drop_index("ix_timeseries_type_date", table_name="time_series")

    # Drop metrics indexes
    op.drop_index("ix_metrics_value_range", table_name="metrics")
    op.drop_index("ix_metrics_scenario_category", table_name="metrics")
    op.drop_index("ix_metrics_category_type", table_name="metrics")
    op.drop_index("ix_metrics_name_period", table_name="metrics")

    # Drop financial statement indexes
    op.drop_index("ix_statements_baseline_version", table_name="financial_statements")
    op.drop_index("ix_statements_currency_period", table_name="financial_statements")
    op.drop_index("ix_statements_scenario_type", table_name="financial_statements")
    op.drop_index("ix_statements_period_range", table_name="financial_statements")

    # Drop scenario indexes
    op.drop_index("ix_scenarios_user_active", table_name="scenarios")
    op.drop_index("ix_scenarios_calculation_status", table_name="scenarios")
    op.drop_index("ix_scenarios_file_created", table_name="scenarios")
    op.drop_index("ix_scenarios_status_baseline", table_name="scenarios")

    # Drop parameter indexes
    op.drop_index("ix_parameters_updated_recently", table_name="parameters")
    op.drop_index("ix_parameters_file_sheet", table_name="parameters")
    op.drop_index("ix_parameters_sensitivity_editable", table_name="parameters")
    op.drop_index("ix_parameters_type_category", table_name="parameters")

    # Drop file indexes
    op.drop_index("ix_files_user_status", table_name="uploaded_files")
    op.drop_index("ix_files_processing_times", table_name="uploaded_files")
    op.drop_index("ix_files_size_type", table_name="uploaded_files")
    op.drop_index("ix_files_status_created", table_name="uploaded_files")

    # Drop user indexes
    op.drop_index("ix_users_active_verified", table_name="users")
    op.drop_index("ix_users_created_date", table_name="users")
    op.drop_index("ix_users_last_login", table_name="users")
