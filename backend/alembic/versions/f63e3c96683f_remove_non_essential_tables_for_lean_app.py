"""remove_non_essential_tables_for_lean_app

Revision ID: f63e3c96683f
Revises: cb40847ce093
Create Date: 2025-08-07 09:24:13.043727

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f63e3c96683f'
down_revision = 'cc29f0d3d343'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Remove non-essential tables for lean financial modeling app
    
    # Drop notification tables (if they exist)
    try:
        op.drop_table('notifications')
    except:
        pass
    
    # Drop collaboration tables (if they exist)  
    try:
        op.drop_table('collaboration_sessions')
    except:
        pass
        
    # Drop audit tables (if they exist)
    try:
        op.drop_table('audit_logs')
    except:
        pass
        
    # Drop chart data tables (if they exist)
    try:
        op.drop_table('chart_data')
    except:
        pass
        
    # Drop report tables (if they exist)
    try:
        op.drop_table('reports')
    except:
        pass
        
    # Drop AI insights tables (if they exist)
    try:
        op.drop_table('ai_insights')
    except:
        pass
        
    # Drop websocket connection tables (if they exist)
    try:
        op.drop_table('websocket_connections')
    except:
        pass


def downgrade() -> None:
    # Note: This is a destructive migration for the lean app
    # We don't recreate the tables as they are not needed in the lean version
    pass 