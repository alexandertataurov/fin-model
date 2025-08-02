"""Add missing user columns

Revision ID: 007
Revises: 006
Create Date: 2025-07-30 11:30:00.000000

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = "007"
down_revision = "006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add missing columns to users table
    conn = op.get_bind()
    
    # Helper function to safely add columns
    def safe_add_column(table_name, column_name, column_spec):
        try:
            # Check if column already exists
            result = conn.execute(text(f"""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = '{table_name}' AND column_name = '{column_name}'
            """)).fetchone()
            
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

    # Add full_name column
    full_name_added = safe_add_column(
        "users",
        "full_name",
        sa.Column(
            "full_name", sa.String(length=100), nullable=False, server_default=""
        ),
    )

    # Add is_admin column
    is_admin_added = safe_add_column(
        "users",
        "is_admin", 
        sa.Column("is_admin", sa.Boolean(), nullable=False, server_default="false"),
    )

    # Only update full_name if we just added the column
    if full_name_added:
        # Update existing users to populate full_name from first_name and last_name
        try:
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
            print("✅ Updated full_name values for existing users")
        except Exception as e:
            print(f"⚠️ Could not update full_name values: {e}")

    # Make first_name and last_name nullable (they were incorrectly set as NOT NULL in migration 001)
    try:
        op.alter_column("users", "first_name", nullable=True)
        op.alter_column("users", "last_name", nullable=True)
        print("✅ Made first_name and last_name nullable")
    except Exception as e:
        print(f"⚠️ Could not alter column nullability: {e}")


def downgrade() -> None:
    # Remove the added columns
    op.drop_column("users", "is_admin")
    op.drop_column("users", "full_name")

    # Revert first_name and last_name to NOT NULL
    op.alter_column("users", "first_name", nullable=False)
    op.alter_column("users", "last_name", nullable=False)
