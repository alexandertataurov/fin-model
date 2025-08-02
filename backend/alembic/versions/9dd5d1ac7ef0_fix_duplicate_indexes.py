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
down_revision = '008'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    This migration handles the case where some indexes from migration 006
    may already exist in the database, preventing a clean migration.
    We'll drop any existing indexes that might cause conflicts and then
    ensure they're created properly.
    """
    conn = op.get_bind()
    
    # List of potentially problematic indexes from migration 006
    indexes_to_fix = [
        "ix_metrics_name_period",
        "ix_metrics_category_type", 
        "ix_metrics_scenario_category",
        "ix_metrics_value_range",
        "ix_timeseries_type_date",
        "ix_timeseries_scenario_type_date",
        "ix_timeseries_frequency_actual",
        "ix_timeseries_date_range",
        "ix_timeseries_subtype_date"
    ]
    
    # Drop indexes if they exist (to clean up any partial state)
    for index_name in indexes_to_fix:
        try:
            conn.execute(text(f"DROP INDEX IF EXISTS {index_name}"))
        except Exception as e:
            print(f"⚠️ Could not drop index {index_name}: {e}")
    
    # Helper function to safely create indexes
    def safe_create_index(index_name, table_name, columns, unique=False, expression=None):
        try:
            if not conn.execute(text(f"SELECT to_regclass('{index_name}')")).scalar():
                if expression:
                    conn.execute(text(f"CREATE INDEX {index_name} ON {table_name} {expression}"))
                else:
                    op.create_index(index_name, table_name, columns, unique=unique)
        except Exception as e:
            print(f"⚠️ Skipping index {index_name}: {e}")
    
    # Recreate the essential indexes
    safe_create_index("ix_metrics_name_period", "metrics", ["metric_name", "period_start", "period_end"])
    safe_create_index("ix_metrics_category_type", "metrics", ["metric_category", "metric_type"])
    safe_create_index("ix_metrics_scenario_category", "metrics", ["scenario_id", "metric_category"])
    safe_create_index("ix_metrics_value_range", "metrics", ["value"])
    
    safe_create_index("ix_timeseries_type_date", "time_series", ["data_type", "period_date"])
    safe_create_index("ix_timeseries_scenario_type_date", "time_series", ["scenario_id", "data_type", "period_date"])
    safe_create_index("ix_timeseries_frequency_actual", "time_series", ["frequency", "is_actual"])
    safe_create_index("ix_timeseries_date_range", "time_series", None, expression="(period_date DESC)")
    safe_create_index("ix_timeseries_subtype_date", "time_series", ["data_subtype", "period_date"])


def downgrade() -> None:
    """
    Remove the indexes we created in upgrade
    """
    indexes_to_remove = [
        "ix_metrics_name_period",
        "ix_metrics_category_type", 
        "ix_metrics_scenario_category",
        "ix_metrics_value_range",
        "ix_timeseries_type_date",
        "ix_timeseries_scenario_type_date",
        "ix_timeseries_frequency_actual",
        "ix_timeseries_date_range",
        "ix_timeseries_subtype_date"
    ]
    
    for index_name in indexes_to_remove:
        try:
            op.drop_index(index_name)
        except Exception as e:
            print(f"⚠️ Could not drop index {index_name}: {e}") 