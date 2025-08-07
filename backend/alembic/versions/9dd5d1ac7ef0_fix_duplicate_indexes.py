"""fix_duplicate_indexes

Revision ID: 9dd5d1ac7ef0
Revises: 008
Create Date: 2025-08-02 15:01:59.385292

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision = '9dd5d1ac7ef0'
down_revision = '005'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    This migration handles the case where indexes from migration 006
    already exist in the database, preventing a clean migration.
    We'll drop any existing problematic indexes to allow migration 006 to complete.
    """
    conn = op.get_bind()
    
    # Complete list of all indexes from migration 006 that may cause conflicts
    all_indexes_to_drop = [
        # Basic indexes
        "ix_metrics_name_period",
        "ix_metrics_category_type", 
        "ix_metrics_scenario_category",
        "ix_metrics_value_range",
        "ix_timeseries_type_date",
        "ix_timeseries_scenario_type_date",
        "ix_timeseries_frequency_actual",
        "ix_timeseries_date_range",
        "ix_timeseries_subtype_date",
        "ix_calculations_order_active",
        "ix_calculations_type_scenario",
        "ix_calculations_executed_recently",
        "ix_templates_type_active",
        "ix_templates_system_usage",
        "ix_versions_file_current",
        "ix_versions_hash_lookup",
        "ix_versions_change_type",
        "ix_audit_action_time",
        "ix_audit_user_success",
        "ix_audit_resource_type",
        "ix_audit_recent",
        "ix_audit_ip_address",
        "ix_report_templates_active",
        "ix_report_schedules_next_run",
        "ix_report_exports_status_created",
        "ix_report_exports_user_format",
        # Concurrent GIN indexes
        "ix_parameters_search_gin",
        "ix_scenarios_search_gin",
        "ix_files_search_gin",
        "ix_templates_search_gin",
        # Partial indexes
        "ix_users_active_only",
        "ix_files_processing",
        "ix_scenarios_active",
        "ix_calculations_pending",
        # Covering indexes
        "ix_parameter_values_covering",
        "ix_metrics_covering"
    ]
    
    # First, drop all indexes that can be dropped normally (within transaction)
    regular_indexes = [idx for idx in all_indexes_to_drop if not idx.endswith("_gin") and idx not in [
        "ix_users_active_only", "ix_files_processing", "ix_scenarios_active", 
        "ix_calculations_pending", "ix_parameter_values_covering", "ix_metrics_covering"
    ]]
    
    for index_name in regular_indexes:
        try:
            conn.execute(text(f"DROP INDEX IF EXISTS {index_name}"))
            print(f"✅ Dropped index {index_name}")
        except Exception as e:
            print(f"⚠️ Could not drop index {index_name}: {e}")
    
    # Handle concurrent indexes separately outside transaction
    concurrent_indexes = [
        "ix_parameters_search_gin", "ix_scenarios_search_gin", "ix_files_search_gin", 
        "ix_templates_search_gin", "ix_users_active_only", "ix_files_processing", 
        "ix_scenarios_active", "ix_calculations_pending", "ix_parameter_values_covering", 
        "ix_metrics_covering"
    ]
    
    # Commit current transaction before concurrent operations
    op.get_context().impl.connection.commit()
    
    # Use autocommit mode for concurrent operations
    with op.get_context().autocommit_block():
        conn = op.get_bind()
        for index_name in concurrent_indexes:
            try:
                conn.execute(text(f"DROP INDEX CONCURRENTLY IF EXISTS {index_name}"))
                print(f"✅ Dropped index {index_name} (concurrent)")
            except Exception as e:
                try:
                    # Fallback to non-concurrent if needed
                    conn.execute(text(f"DROP INDEX IF EXISTS {index_name}"))
                    print(f"✅ Dropped index {index_name} (fallback)")
                except Exception as e2:
                    print(f"⚠️ Could not drop index {index_name}: {e2}")
    
    print("✅ Migration 006 cleanup completed. The original migration 006 should now run successfully.")


def downgrade() -> None:
    """
    This downgrade does nothing since we only cleaned up duplicate indexes
    to allow migration 006 to run. The actual indexes will be managed by
    migration 006's downgrade function.
    """
    print("⚠️ Downgrade: This migration only cleaned up duplicates. No action needed.") 