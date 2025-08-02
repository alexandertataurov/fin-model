"""add_monte_carlo_simulation_tables

Revision ID: e55cf976aaaa
Revises: 93a0bb4bdb0b
Create Date: 2025-08-02 20:35:38.811770

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e55cf976aaaa'
down_revision = '93a0bb4bdb0b'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create monte_carlo_simulations table
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

    # Create scenario_parameters table for scenario-specific parameter overrides
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

    # Add scenario_type field to scenarios table
    op.add_column(
        "scenarios",
        sa.Column("scenario_type", sa.String(length=50), default="custom"),
    )

    # Add is_base_case field to scenarios table  
    op.add_column("scenarios", sa.Column("is_base_case", sa.Boolean, default=False))

    # Create indexes
    op.create_index(
        "ix_monte_carlo_simulations_scenario_id",
        "monte_carlo_simulations",
        ["scenario_id"],
    )
    op.create_index(
        "ix_monte_carlo_simulations_created_at",
        "monte_carlo_simulations",
        ["created_at"],
    )
    op.create_index(
        "ix_scenario_parameters_scenario_id", "scenario_parameters", ["scenario_id"]
    )
    op.create_index(
        "ix_scenario_parameters_parameter_id", "scenario_parameters", ["parameter_id"]
    )

    # Create unique constraint for scenario-parameter combination
    op.create_unique_constraint(
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