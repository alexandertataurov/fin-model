"""add system logs and maintenance tables

Revision ID: d6c6cf259427
Revises: 3cc867c9122a
Create Date: 2025-08-09 16:21:48.319877

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d6c6cf259427"
down_revision = "3cc867c9122a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    from sqlalchemy import text

    bind = op.get_bind()

    # Check if system_logs table exists
    result = bind.execute(
        text(
            "SELECT EXISTS (SELECT FROM information_schema.tables "
            "WHERE table_schema='public' AND table_name='system_logs')"
        )
    )
    if not result.scalar():
        # system_logs table
        op.create_table(
            "system_logs",
            sa.Column(
                "id", sa.Integer(), primary_key=True, nullable=False
            ),
            sa.Column(
                "timestamp",
                sa.DateTime(),
                server_default=sa.text("now()"),
                nullable=False,
            ),
            sa.Column("level", sa.String(length=16), nullable=False),
            sa.Column("module", sa.String(length=64), nullable=True),
            sa.Column("message", sa.Text(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=True),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        )
        op.create_index(
            op.f("ix_system_logs_id"), "system_logs", ["id"], unique=False
        )

    # Check if maintenance_schedules table exists
    result = bind.execute(
        text(
            "SELECT EXISTS (SELECT FROM information_schema.tables "
            "WHERE table_schema='public' AND table_name='maintenance_schedules')"
        )
    )
    if not result.scalar():
        # maintenance_schedules table
        op.create_table(
            "maintenance_schedules",
            sa.Column(
                "id",
                sa.String(length=64),
                primary_key=True,
                nullable=False,
            ),
            sa.Column("name", sa.String(length=128), nullable=False),
            sa.Column("task", sa.String(length=32), nullable=False),
            sa.Column("schedule", sa.String(length=128), nullable=False),
            sa.Column(
                "enabled",
                sa.Boolean(),
                nullable=False,
                server_default=sa.text("true"),
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(),
                server_default=sa.text("now()"),
                nullable=True,
            ),
            sa.Column(
                "created_at",
                sa.DateTime(),
                server_default=sa.text("now()"),
                nullable=False,
            ),
        )


def downgrade() -> None:
    op.drop_index(op.f("ix_system_logs_id"), table_name="system_logs")
    op.drop_table("system_logs")
    op.drop_table("maintenance_schedules")
