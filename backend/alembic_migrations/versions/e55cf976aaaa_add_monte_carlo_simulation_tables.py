"""add_monte_carlo_simulation_tables

Revision ID: e55cf976aaaa
Revises: 951cd05e0ae0
Create Date: 2025-08-07 09:24:13.043727

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e55cf976aaaa"
down_revision = "951cd05e0ae0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create monte_carlo_simulations table
    try:
        op.create_table(
            "monte_carlo_simulations",
            sa.Column("id", sa.String(length=50), primary_key=True),
            sa.Column(
                "scenario_id",
                sa.Integer,
                sa.ForeignKey("scenarios.id"),
                nullable=False,
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
                "created_by_id",
                sa.Integer,
                sa.ForeignKey("users.id"),
                nullable=False,
            ),
        )
        print("✅ Created monte_carlo_simulations table")
    except Exception as e:
        print(f"⚠️ monte_carlo_simulations table already exists or error: {e}")

    # Create scenario_parameters table for scenario-specific parameter overrides
    try:
        op.create_table(
            "scenario_parameters",
            sa.Column("id", sa.String(length=50), primary_key=True),
            sa.Column(
                "scenario_id",
                sa.Integer,
                sa.ForeignKey("scenarios.id"),
                nullable=False,
            ),
            sa.Column(
                "parameter_id",
                sa.Integer,
                sa.ForeignKey("parameters.id"),
                nullable=False,
            ),
            sa.Column(
                "parameter_value",
                sa.Numeric(precision=15, scale=6),
                nullable=False,
            ),
            sa.Column("override_default", sa.Boolean, default=False),
            sa.Column("created_at", sa.DateTime, default=sa.func.now()),
            sa.Column(
                "updated_at",
                sa.DateTime,
                default=sa.func.now(),
                onupdate=sa.func.now(),
            ),
        )
        print("✅ Created scenario_parameters table")
    except Exception as e:
        print(f"⚠️ scenario_parameters table already exists or error: {e}")

    # Add scenario_type field to scenarios table
    try:
        op.add_column(
            "scenarios",
            sa.Column("scenario_type", sa.String(length=50), default="custom"),
        )
        print("✅ Added scenario_type column to scenarios table")
    except Exception as e:
        print(f"⚠️ scenario_type column already exists or error: {e}")

    # Add is_base_case field to scenarios table
    try:
        op.add_column(
            "scenarios",
            sa.Column("is_base_case", sa.Boolean, default=False),
        )
        print("✅ Added is_base_case column to scenarios table")
    except Exception as e:
        print(f"⚠️ is_base_case column already exists or error: {e}")

    # Create indexes
    try:
        op.create_index(
            "ix_monte_carlo_simulations_scenario_id",
            "monte_carlo_simulations",
            ["scenario_id"],
        )
        print("✅ Created index ix_monte_carlo_simulations_scenario_id")
    except Exception as e:
        print(
            f"⚠️ Index ix_monte_carlo_simulations_scenario_id already exists or error: {e}"
        )

    try:
        op.create_index(
            "ix_monte_carlo_simulations_created_at",
            "monte_carlo_simulations",
            ["created_at"],
        )
        print("✅ Created index ix_monte_carlo_simulations_created_at")
    except Exception as e:
        print(
            f"⚠️ Index ix_monte_carlo_simulations_created_at already exists or error: {e}"
        )

    try:
        op.create_index(
            "ix_scenario_parameters_scenario_id",
            "scenario_parameters",
            ["scenario_id"],
        )
        print("✅ Created index ix_scenario_parameters_scenario_id")
    except Exception as e:
        print(
            f"⚠️ Index ix_scenario_parameters_scenario_id already exists or error: {e}"
        )

    try:
        op.create_index(
            "ix_scenario_parameters_parameter_id",
            "scenario_parameters",
            ["parameter_id"],
        )
        print("✅ Created index ix_scenario_parameters_parameter_id")
    except Exception as e:
        print(
            f"⚠️ Index ix_scenario_parameters_parameter_id already exists or error: {e}"
        )

    # Create unique constraint for scenario-parameter combination
    try:
        op.create_unique_constraint(
            "uq_scenario_parameter",
            "scenario_parameters",
            ["scenario_id", "parameter_id"],
        )
        print("✅ Created unique constraint uq_scenario_parameter")
    except Exception as e:
        print(
            f"⚠️ Unique constraint uq_scenario_parameter already exists or error: {e}"
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
