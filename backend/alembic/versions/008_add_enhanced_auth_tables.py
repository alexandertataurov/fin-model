"""Add enhanced authentication tables

Revision ID: 008
Revises: 007
Create Date: 2025-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "008"
down_revision = "007"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add missing columns to users table
    op.add_column(
        "users",
        sa.Column("full_name", sa.String(length=100), nullable=False, default=""),
    )
    op.add_column("users", sa.Column("email_verified_at", sa.DateTime(), nullable=True))
    op.add_column(
        "users", sa.Column("verification_token_expires", sa.DateTime(), nullable=True)
    )
    op.add_column(
        "users", sa.Column("login_attempts", sa.Integer(), nullable=False, default=0)
    )
    op.add_column("users", sa.Column("locked_until", sa.DateTime(), nullable=True))

    # Create user_sessions table for refresh token management
    op.create_table(
        "user_sessions",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("refresh_token", sa.String(length=255), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column(
            "last_used_at",
            sa.DateTime(),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("ip_address", sa.String(length=45), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("refresh_token"),
    )

    # Create rate_limiting table for tracking authentication attempts
    op.create_table(
        "rate_limits",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("key", sa.String(length=255), nullable=False),
        sa.Column("attempts", sa.Integer(), nullable=False, default=0),
        sa.Column("window_start", sa.DateTime(), nullable=False),
        sa.Column("blocked_until", sa.DateTime(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("key"),
    )
    op.create_index(op.f("ix_rate_limits_key"), "rate_limits", ["key"], unique=False)
    op.create_index(
        op.f("ix_rate_limits_window_start"),
        "rate_limits",
        ["window_start"],
        unique=False,
    )


def downgrade() -> None:
    # Drop new tables
    op.drop_index(op.f("ix_rate_limits_window_start"), table_name="rate_limits")
    op.drop_index(op.f("ix_rate_limits_key"), table_name="rate_limits")
    op.drop_table("rate_limits")
    op.drop_table("user_sessions")

    # Remove added columns from users table
    op.drop_column("users", "locked_until")
    op.drop_column("users", "login_attempts")
    op.drop_column("users", "verification_token_expires")
    op.drop_column("users", "email_verified_at")
    op.drop_column("users", "full_name")
