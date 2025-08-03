"""add_advanced_reporting_collaboration_tables

Revision ID: cc29f0d3d343
Revises: 951cd05e0ae0
Create Date: 2025-08-03 11:20:25.038328

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cc29f0d3d343'
down_revision = '951cd05e0ae0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create report_templates table
    op.create_table('report_templates',
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

    # Create report_collaborations table
    op.create_table('report_collaborations',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('report_template_id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('permission', sa.Enum('VIEW', 'EDIT', 'ADMIN', name='collaborationpermission'), nullable=False),
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

    # Create report_edits table
    op.create_table('report_edits',
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

    # Create ai_insights table
    op.create_table('ai_insights',
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

    # Create report_element_suggestions table
    op.create_table('report_element_suggestions',
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

    # Create collaboration_sessions table
    op.create_table('collaboration_sessions',
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

    # Create indexes for better performance
    op.create_index('ix_report_templates_created_by', 'report_templates', ['created_by'])
    op.create_index('ix_report_collaborations_template_id', 'report_collaborations', ['report_template_id'])
    op.create_index('ix_report_collaborations_user_id', 'report_collaborations', ['user_id'])
    op.create_index('ix_report_edits_template_id', 'report_edits', ['report_template_id'])
    op.create_index('ix_report_edits_timestamp', 'report_edits', ['timestamp'])
    op.create_index('ix_ai_insights_template_id', 'ai_insights', ['report_template_id'])
    op.create_index('ix_ai_insights_created_at', 'ai_insights', ['created_at'])
    op.create_index('ix_collaboration_sessions_template_id', 'collaboration_sessions', ['report_template_id'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_collaboration_sessions_template_id')
    op.drop_index('ix_ai_insights_created_at')
    op.drop_index('ix_ai_insights_template_id')
    op.drop_index('ix_report_edits_timestamp')
    op.drop_index('ix_report_edits_template_id')
    op.drop_index('ix_report_collaborations_user_id')
    op.drop_index('ix_report_collaborations_template_id')
    op.drop_index('ix_report_templates_created_by')

    # Drop tables
    op.drop_table('collaboration_sessions')
    op.drop_table('report_element_suggestions')
    op.drop_table('ai_insights')
    op.drop_table('report_edits')
    op.drop_table('report_collaborations')
    op.drop_table('report_templates')

    # Drop enum
    op.execute('DROP TYPE IF EXISTS collaborationpermission') 