"""Add missing user columns

Revision ID: 007
Revises: 006
Create Date: 2025-07-30 11:30:00.000000

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "007"
down_revision = "006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add missing columns to users table

    # Add full_name column
    op.add_column(
        "users",
        sa.Column(
            "full_name", sa.String(length=100), nullable=False, server_default=""
        ),
    )

    # Add is_admin column
    op.add_column(
        "users",
        sa.Column("is_admin", sa.Boolean(), nullable=False, server_default="false"),
    )

    # Update existing users to populate full_name from first_name and last_name
    op.execute(
        """
        UPDATE users 
        SET full_name = COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')
        WHERE full_name = ''
    """
    )

    # Clean up any double spaces
    op.execute(
        """
        UPDATE users 
        SET full_name = TRIM(REGEXP_REPLACE(full_name, '\\s+', ' ', 'g'))
        WHERE full_name LIKE '%  %'
    """
    )
    # Make first_name and last_name nullable (they were incorrectly set as NOT NULL in migration 001)
    op.alter_column("users", "first_name", nullable=True)
    op.alter_column("users", "last_name", nullable=True)


def downgrade() -> None:
    # Remove the added columns
    op.drop_column("users", "is_admin")
    op.drop_column("users", "full_name")

    # Revert first_name and last_name to NOT NULL
    op.alter_column("users", "first_name", nullable=False)
    op.alter_column("users", "last_name", nullable=False)
