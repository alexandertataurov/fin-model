"""add_monte_carlo_simulation_tables

Revision ID: e55cf976aaaa
Revises: 951cd05e0ae0
Create Date: 2025-08-07 09:24:13.043727

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e55cf976aaaa'
down_revision = '951cd05e0ae0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Helper function to safely create tables
    def safe_create_table(table_name, table_definition_func):
        try:
            # Check if table already exists
            inspector = sa.inspect(op.get_bind())
            if table_name not in inspector.get_table_names():
                table_definition_func()
                print(f"✅ Created table {table_name}")
            else:
                print(f"⚠️ Table {table_name} already exists, skipping")
        except Exception as e:
            print(f"⚠️ Could not create table {table_name}: {e}")

    # Helper function to safely add columns
    def safe_add_column(table_name, column_name, column_spec):
        try:
            inspector = sa.inspect(op.get_bind())
            existing_columns = [col['name'] for col in inspector.get_columns(table_name)]
            if column_name not in existing_columns:
                op.add_column(table_name, column_spec)
                print(f"✅ Added column {column_name} to {table_name}")
            else:
                print(f"⚠️ Column {column_name} already exists in {table_name}")
        except Exception as e:
            print(f"⚠️ Could not add column {column_name}: {e}")

    # Create monte_carlo_simulations table
    def create_monte_carlo_table():
        op.create_table(
            "monte_carlo_simulations",
            sa.Column("id", sa.String(length=50), primary_key=True),
            sa.Column(
                "scenario_id", sa.Integer, sa.ForeignKey("scenarios.id"), nullable=False
            ),
            sa.Column("name", sa.String(length=255), nullable=False),
            sa.Column("description", sa.Text, nullable=True),
            sa.Column("iterations", sa.Integer, nullable=False),
            sa.Column("distributions", sa.JSON, nullable=False),
            sa.Column("correlations", sa.JSON, nullable=True),
            sa.Column("output_metrics", sa.JSON, nullable=False),
            sa.Column("results", sa.JSON, nullable=True),
            sa.Column("statistics", sa.JSON, nullable=True),
            sa.Column("risk_metrics", sa.JSON, nullable=True),
            sa.Column("execution_time", sa.Float, nullable=True),
            sa.Column("status", sa.String(length=50), default="pending"),
            sa.Column("error_message", sa.Text, nullable=True),
            sa.Column("created_at", sa.DateTime, default=sa.func.now()),
            sa.Column("completed_at", sa.DateTime, nullable=True),
            sa.Column(
                "created_by_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False
            ),
        )
    
    safe_create_table("monte_carlo_simulations", create_monte_carlo_table)

    # Create scenario_parameters table for scenario-specific parameter overrides
    def create_scenario_parameters_table():
        op.create_table(
            "scenario_parameters",
            sa.Column("id", sa.String(length=50), primary_key=True),
            sa.Column(
                "scenario_id", sa.Integer, sa.ForeignKey("scenarios.id"), nullable=False
            ),
            sa.Column(
                "parameter_id", sa.Integer, sa.ForeignKey("parameters.id"), nullable=False
            ),
            sa.Column("parameter_value", sa.Numeric(precision=15, scale=6), nullable=False),
            sa.Column("override_default", sa.Boolean, default=False),
            sa.Column("created_at", sa.DateTime, default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime, default=sa.func.now(), onupdate=sa.func.now()),
        )
    
    safe_create_table("scenario_parameters", create_scenario_parameters_table)

    # Add scenario_type field to scenarios table
    safe_add_column(
        "scenarios",
        "scenario_type",
        sa.Column("scenario_type", sa.String(length=50), default="custom"),
    )

    # Add is_base_case field to scenarios table  
    safe_add_column("scenarios", "is_base_case", sa.Column("is_base_case", sa.Boolean, default=False))

    # Create indexes safely
    def safe_create_index(index_name, table_name, columns, unique=False):
        try:
            inspector = sa.inspect(op.get_bind())
            existing_indexes = [idx['name'] for idx in inspector.get_indexes(table_name)]
            if index_name not in existing_indexes:
                op.create_index(index_name, table_name, columns, unique=unique)
                print(f"✅ Created index {index_name}")
            else:
                print(f"⚠️ Index {index_name} already exists")
        except Exception as e:
            print(f"⚠️ Could not create index {index_name}: {e}")

    safe_create_index(
        "ix_monte_carlo_simulations_scenario_id",
        "monte_carlo_simulations",
        ["scenario_id"],
    )
    safe_create_index(
        "ix_monte_carlo_simulations_created_at",
        "monte_carlo_simulations",
        ["created_at"],
    )
    safe_create_index(
        "ix_scenario_parameters_scenario_id", "scenario_parameters", ["scenario_id"]
    )
    safe_create_index(
        "ix_scenario_parameters_parameter_id", "scenario_parameters", ["parameter_id"]
    )

    # Create unique constraint safely
    def safe_create_unique_constraint(constraint_name, table_name, columns):
        try:
            inspector = sa.inspect(op.get_bind())
            existing_constraints = [con['name'] for con in inspector.get_unique_constraints(table_name)]
            if constraint_name not in existing_constraints:
                op.create_unique_constraint(constraint_name, table_name, columns)
                print(f"✅ Created unique constraint {constraint_name}")
            else:
                print(f"⚠️ Unique constraint {constraint_name} already exists")
        except Exception as e:
            print(f"⚠️ Could not create unique constraint {constraint_name}: {e}")

    safe_create_unique_constraint(
        "uq_scenario_parameter",
        "scenario_parameters",
        ["scenario_id", "parameter_id"],
    )


def downgrade() -> None:
    # Remove unique constraint
    op.drop_constraint("uq_scenario_parameter", "scenario_parameters")

    # Remove indexes
    op.drop_index("ix_scenario_parameters_parameter_id", "scenario_parameters")
    op.drop_index("ix_scenario_parameters_scenario_id", "scenario_parameters")
    op.drop_index("ix_monte_carlo_simulations_created_at", "monte_carlo_simulations")
    op.drop_index("ix_monte_carlo_simulations_scenario_id", "monte_carlo_simulations")

    # Remove columns from scenarios
    op.drop_column("scenarios", "is_base_case")
    op.drop_column("scenarios", "scenario_type")

    # Drop tables
    op.drop_table("scenario_parameters")
    op.drop_table("monte_carlo_simulations") 