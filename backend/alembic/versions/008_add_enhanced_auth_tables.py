"""Add enhanced authentication tables

Revision ID: 008
Revises: 007
Create Date: 2025-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision = "008"
down_revision = "007"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add missing columns to users table with safety checks
    conn = op.get_bind()

    # Helper function to safely add columns
    def safe_add_column(table_name, column_name, column_spec):
        try:
            # Check if column already exists
            result = conn.execute(
                text(
                    f"""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = '{table_name}' AND column_name = '{column_name}'
            """
                )
            ).fetchone()

            if not result:
                op.add_column(table_name, column_spec)
                print(f"✅ Added column {column_name} to {table_name}")
                return True
            else:
                print(f"⚠️ Column {column_name} already exists in {table_name}")
                return False
        except Exception as e:
            print(f"⚠️ Could not add column {column_name}: {e}")
            return False

    # Add columns with safety checks
    safe_add_column(
        "users",
        "full_name",
        sa.Column(
            "full_name",
            sa.String(length=100),
            nullable=False,
            server_default="",
        ),
    )
    safe_add_column(
        "users",
        "email_verified_at",
        sa.Column("email_verified_at", sa.DateTime(), nullable=True),
    )
    safe_add_column(
        "users",
        "verification_token_expires",
        sa.Column("verification_token_expires", sa.DateTime(), nullable=True),
    )
    safe_add_column(
        "users",
        "login_attempts",
        sa.Column(
            "login_attempts",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
    )
    safe_add_column(
        "users",
        "locked_until",
        sa.Column("locked_until", sa.DateTime(), nullable=True),
    )

    # Helper function to safely create tables
    def safe_create_table(table_name, table_definition_func):
        try:
            # Check if table already exists
            result = conn.execute(
                text(
                    f"""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_name = '{table_name}'
            """
                )
            ).fetchone()

            if not result:
                table_definition_func()
                print(f"✅ Created table {table_name}")
                return True
            else:
                print(f"⚠️ Table {table_name} already exists")
                return False
        except Exception as e:
            print(f"⚠️ Could not create table {table_name}: {e}")
            return False

    # Create user_sessions table for refresh token management
    def create_user_sessions_table():
        op.create_table(
            "user_sessions",
            sa.Column("id", sa.String(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("refresh_token", sa.String(length=255), nullable=False),
            sa.Column("expires_at", sa.DateTime(), nullable=False),
            sa.Column(
                "created_at",
                sa.DateTime(),
                server_default=sa.text("now()"),
                nullable=False,
            ),
            sa.Column(
                "last_used_at",
                sa.DateTime(),
                server_default=sa.text("now()"),
                nullable=False,
            ),
            sa.Column("ip_address", sa.String(length=45), nullable=True),
            sa.Column("user_agent", sa.Text(), nullable=True),
            sa.ForeignKeyConstraint(
                ["user_id"], ["users.id"], ondelete="CASCADE"
            ),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("refresh_token"),
        )

    safe_create_table("user_sessions", create_user_sessions_table)

    # Create rate_limiting table for tracking authentication attempts
    def create_rate_limits_table():
        op.create_table(
            "rate_limits",
            sa.Column("id", sa.String(), nullable=False),
            sa.Column("key", sa.String(length=255), nullable=False),
            sa.Column("attempts", sa.Integer(), nullable=False, default=0),
            sa.Column("window_start", sa.DateTime(), nullable=False),
            sa.Column("blocked_until", sa.DateTime(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(),
                server_default=sa.text("now()"),
                nullable=False,
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(),
                server_default=sa.text("now()"),
                nullable=False,
            ),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("key"),
        )

    safe_create_table("rate_limits", create_rate_limits_table)

    # Safely create indexes with existence check
    def safe_create_index(index_name, table_name, columns, unique=False):
        try:
            result = conn.execute(
                text(f"SELECT to_regclass('{index_name}')")
            ).scalar()
            if result is None:
                op.create_index(index_name, table_name, columns, unique=unique)
                print(f"✅ Created index {index_name}")
            else:
                print(f"⚠️ Skipping index {index_name}: already exists")
        except Exception as e:
            print(f"⚠️ Skipping index {index_name}: {e}")

    safe_create_index("ix_rate_limits_key", "rate_limits", ["key"])
    safe_create_index(
        "ix_rate_limits_window_start", "rate_limits", ["window_start"]
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
