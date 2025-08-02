"""add_parameter_groups_and_history

Revision ID: 93a0bb4bdb0b
Revises: 008
Create Date: 2025-08-02 15:40:57.310820

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "93a0bb4bdb0b"
down_revision = "008"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create parameter_groups table
    op.create_table(
        "parameter_groups",
        sa.Column("id", sa.String(length=50), primary_key=True),
        sa.Column(
            "model_id", sa.Integer, sa.ForeignKey("uploaded_files.id"), nullable=False
        ),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("display_order", sa.Integer, nullable=True),
        sa.Column("is_expanded", sa.Boolean, default=True),
        sa.Column("created_at", sa.DateTime, default=sa.func.now()),
        sa.Column(
            "updated_at", sa.DateTime, default=sa.func.now(), onupdate=sa.func.now()
        ),
    )

    # Create parameter_history table
    op.create_table(
        "parameter_history",
        sa.Column("id", sa.String(length=50), primary_key=True),
        sa.Column(
            "parameter_id", sa.Integer, sa.ForeignKey("parameters.id"), nullable=False
        ),
        sa.Column("old_value", sa.Numeric(precision=15, scale=6), nullable=True),
        sa.Column("new_value", sa.Numeric(precision=15, scale=6), nullable=False),
        sa.Column("changed_by", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("changed_at", sa.DateTime, default=sa.func.now()),
        sa.Column("change_reason", sa.String(length=255), nullable=True),
    )

    # Add group_id to parameters table
    op.add_column(
        "parameters",
        sa.Column(
            "group_id",
            sa.String(length=50),
            sa.ForeignKey("parameter_groups.id"),
            nullable=True,
        ),
    )

    # Add control type and UI fields to parameters
    op.add_column(
        "parameters", sa.Column("control_type", sa.String(length=50), default="input")
    )
    op.add_column(
        "parameters",
        sa.Column("step_size", sa.Numeric(precision=15, scale=6), nullable=True),
    )
    op.add_column(
        "parameters",
        sa.Column("display_format", sa.String(length=50), default="number"),
    )

    # Create indexes
    op.create_index("ix_parameter_groups_model_id", "parameter_groups", ["model_id"])
    op.create_index(
        "ix_parameter_history_parameter_id", "parameter_history", ["parameter_id"]
    )
    op.create_index(
        "ix_parameter_history_changed_at", "parameter_history", ["changed_at"]
    )
    op.create_index("ix_parameters_group_id", "parameters", ["group_id"])


def downgrade() -> None:
    # Remove indexes
    op.drop_index("ix_parameters_group_id", "parameters")
    op.drop_index("ix_parameter_history_changed_at", "parameter_history")
    op.drop_index("ix_parameter_history_parameter_id", "parameter_history")
    op.drop_index("ix_parameter_groups_model_id", "parameter_groups")

    # Remove columns from parameters
    op.drop_column("parameters", "display_format")
    op.drop_column("parameters", "step_size")
    op.drop_column("parameters", "control_type")
    op.drop_column("parameters", "group_id")

    # Drop tables
    op.drop_table("parameter_history")
    op.drop_table("parameter_groups")
