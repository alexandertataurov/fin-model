"""add_advanced_reporting_collaboration_tables

Revision ID: cc29f0d3d343
Revises: 951cd05e0ae0
Create Date: 2025-08-03 11:20:25.038328

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = 'cc29f0d3d343'
down_revision = '951cd05e0ae0'
branch_labels = None
depends_on = None


def table_exists(table_name):
    """Check if a table exists in the database"""
    inspector = inspect(op.get_bind())
    return table_name in inspector.get_table_names()


def upgrade() -> None:
    # Create report_templates table only if it doesn't exist
    if not table_exists('report_templates'):
        op.create_table(
            'report_templates',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('name', sa.String(), nullable=False),
            sa.Column('description', sa.String(), nullable=True),
            sa.Column('elements', sa.JSON(), nullable=True),
            sa.Column('layout', sa.JSON(), nullable=True),
            sa.Column('created_by', sa.UUID(), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.Column('last_modified', sa.DateTime(), nullable=True),
            sa.Column('version', sa.Integer(), nullable=True),
            sa.Column('is_published', sa.Boolean(), nullable=True),
            sa.Column('is_archived', sa.Boolean(), nullable=True),
            sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )

    # Create report_collaborations table only if it doesn't exist
    if not table_exists('report_collaborations'):
        op.create_table(
            'report_collaborations',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('report_template_id', sa.UUID(), nullable=False),
            sa.Column('user_id', sa.UUID(), nullable=False),
            sa.Column(
                'permission',
                sa.Enum('VIEW', 'EDIT', 'ADMIN', name='collaborationpermission'),
                nullable=False
            ),
            sa.Column('invited_by', sa.UUID(), nullable=False),
            sa.Column('invited_at', sa.DateTime(), nullable=True),
            sa.Column('accepted_at', sa.DateTime(), nullable=True),
            sa.Column('is_active', sa.Boolean(), nullable=True),
            sa.Column('last_seen', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['invited_by'], ['users.id'], ),
            sa.ForeignKeyConstraint(['report_template_id'], ['report_templates.id'], ),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )

    # Create report_edits table only if it doesn't exist
    if not table_exists('report_edits'):
        op.create_table(
            'report_edits',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('report_template_id', sa.UUID(), nullable=False),
            sa.Column('user_id', sa.UUID(), nullable=False),
            sa.Column('edit_type', sa.String(), nullable=False),
            sa.Column('element_id', sa.String(), nullable=True),
            sa.Column('changes', sa.JSON(), nullable=False),
            sa.Column('timestamp', sa.DateTime(), nullable=True),
            sa.Column('session_id', sa.String(), nullable=True),
            sa.ForeignKeyConstraint(['report_template_id'], ['report_templates.id'], ),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )

    # Create ai_insights table only if it doesn't exist
    if not table_exists('ai_insights'):
        op.create_table(
            'ai_insights',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('report_template_id', sa.UUID(), nullable=True),
            sa.Column('user_id', sa.UUID(), nullable=False),
            sa.Column('insight_type', sa.String(), nullable=False),
            sa.Column('input_data', sa.JSON(), nullable=False),
            sa.Column('ai_response', sa.JSON(), nullable=False),
            sa.Column('confidence_score', sa.Float(), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.Column('model_version', sa.String(), nullable=True),
            sa.Column('processing_time_ms', sa.Integer(), nullable=True),
            sa.Column('feedback_rating', sa.Integer(), nullable=True),
            sa.Column('feedback_comment', sa.String(), nullable=True),
            sa.ForeignKeyConstraint(['report_template_id'], ['report_templates.id'], ),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )

    # Create report_element_suggestions table only if it doesn't exist
    if not table_exists('report_element_suggestions'):
        op.create_table(
            'report_element_suggestions',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('report_template_id', sa.UUID(), nullable=True),
            sa.Column('user_id', sa.UUID(), nullable=False),
            sa.Column('element_type', sa.String(), nullable=False),
            sa.Column('element_subtype', sa.String(), nullable=True),
            sa.Column('title', sa.String(), nullable=False),
            sa.Column('description', sa.String(), nullable=True),
            sa.Column('confidence', sa.Float(), nullable=False),
            sa.Column('data_mapping', sa.JSON(), nullable=True),
            sa.Column('suggested_config', sa.JSON(), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.Column('is_accepted', sa.Boolean(), nullable=True),
            sa.Column('accepted_at', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['report_template_id'], ['report_templates.id'], ),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )

    # Create collaboration_sessions table only if it doesn't exist
    if not table_exists('collaboration_sessions'):
        op.create_table(
            'collaboration_sessions',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('report_template_id', sa.UUID(), nullable=False),
            sa.Column('user_id', sa.UUID(), nullable=False),
            sa.Column('session_start', sa.DateTime(), nullable=True),
            sa.Column('last_activity', sa.DateTime(), nullable=True),
            sa.Column('session_end', sa.DateTime(), nullable=True),
            sa.Column('websocket_id', sa.String(), nullable=True),
            sa.Column('client_info', sa.JSON(), nullable=True),
            sa.ForeignKeyConstraint(['report_template_id'], ['report_templates.id'], ),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )

    # Create indexes for better performance (only if they don't exist)
    inspector = inspect(op.get_bind())
    
    if not any(idx['name'] == 'ix_report_templates_created_by' for idx in inspector.get_indexes('report_templates')):
        op.create_index('ix_report_templates_created_by', 'report_templates', ['created_by'])
    
    if table_exists('report_collaborations') and not any(idx['name'] == 'ix_report_collaborations_template_id' for idx in inspector.get_indexes('report_collaborations')):
        op.create_index('ix_report_collaborations_template_id', 'report_collaborations', ['report_template_id'])
    
    if table_exists('report_collaborations') and not any(idx['name'] == 'ix_report_collaborations_user_id' for idx in inspector.get_indexes('report_collaborations')):
        op.create_index('ix_report_collaborations_user_id', 'report_collaborations', ['user_id'])
    
    if table_exists('report_edits') and not any(idx['name'] == 'ix_report_edits_template_id' for idx in inspector.get_indexes('report_edits')):
        op.create_index('ix_report_edits_template_id', 'report_edits', ['report_template_id'])
    
    if table_exists('report_edits') and not any(idx['name'] == 'ix_report_edits_timestamp' for idx in inspector.get_indexes('report_edits')):
        op.create_index('ix_report_edits_timestamp', 'report_edits', ['timestamp'])
    
    if table_exists('ai_insights') and not any(idx['name'] == 'ix_ai_insights_template_id' for idx in inspector.get_indexes('ai_insights')):
        op.create_index('ix_ai_insights_template_id', 'ai_insights', ['report_template_id'])
    
    if table_exists('ai_insights') and not any(idx['name'] == 'ix_ai_insights_created_at' for idx in inspector.get_indexes('ai_insights')):
        op.create_index('ix_ai_insights_created_at', 'ai_insights', ['created_at'])
    
    if table_exists('collaboration_sessions') and not any(idx['name'] == 'ix_collaboration_sessions_template_id' for idx in inspector.get_indexes('collaboration_sessions')):
        op.create_index('ix_collaboration_sessions_template_id', 'collaboration_sessions', ['report_template_id'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_collaboration_sessions_template_id', table_name='collaboration_sessions')
    op.drop_index('ix_ai_insights_created_at', table_name='ai_insights')
    op.drop_index('ix_ai_insights_template_id', table_name='ai_insights')
    op.drop_index('ix_report_edits_timestamp', table_name='report_edits')
    op.drop_index('ix_report_edits_template_id', table_name='report_edits')
    op.drop_index('ix_report_collaborations_user_id', table_name='report_collaborations')
    op.drop_index('ix_report_collaborations_template_id', table_name='report_collaborations')
    op.drop_index('ix_report_templates_created_by', table_name='report_templates')

    # Drop tables
    op.drop_table('collaboration_sessions')
    op.drop_table('report_element_suggestions')
    op.drop_table('ai_insights')
    op.drop_table('report_edits')
    op.drop_table('report_collaborations')
    # Don't drop report_templates as it was created in a previous migration

    # Drop enum
    op.execute('DROP TYPE IF EXISTS collaborationpermission') 