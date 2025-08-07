"""fix_notification_type_column_name

Revision ID: 3cc867c9122a
Revises: cc29f0d3d343
Create Date: 2025-08-07 18:05:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3cc867c9122a'
down_revision = 'cc29f0d3d343'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Rename the 'type' column to 'notification_type' in notifications table
    op.alter_column('notifications', 'type', new_column_name='notification_type')
    
    # Rename the 'type' column to 'notification_type' in notification_templates table
    op.alter_column('notification_templates', 'type', new_column_name='notification_type')


def downgrade() -> None:
    # Rename back to 'type' in notifications table
    op.alter_column('notifications', 'notification_type', new_column_name='type')
    
    # Rename back to 'type' in notification_templates table
    op.alter_column('notification_templates', 'notification_type', new_column_name='type') 