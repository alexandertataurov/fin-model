"""add_enhanced_authentication_features

Revision ID: 951cd05e0ae0
Revises: e55cf976aaaa
Create Date: 2025-08-03 02:32:46.119181

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '951cd05e0ae0'
down_revision = 'e55cf976aaaa'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create MFA tokens table
    op.create_table(
        'mfa_tokens',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('secret_key', sa.String(length=255), nullable=False),
        sa.Column('backup_codes', sa.JSON(), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('last_used', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create OAuth accounts table
    op.create_table(
        'oauth_accounts',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('provider', sa.String(length=50), nullable=False),
        sa.Column('provider_id', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('display_name', sa.String(length=255), nullable=True),
        sa.Column('profile_picture', sa.String(length=500), nullable=True),
        sa.Column('access_token', sa.String(length=500), nullable=True),
        sa.Column('refresh_token', sa.String(length=500), nullable=True),
        sa.Column('token_expires_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create WebAuthn credentials table
    op.create_table(
        'webauthn_credentials',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('credential_id', sa.String(length=500), nullable=False),
        sa.Column('public_key', sa.String(length=1000), nullable=False),
        sa.Column('sign_count', sa.Integer(), nullable=False),
        sa.Column('device_name', sa.String(length=255), nullable=True),
        sa.Column('device_type', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('last_used', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('credential_id')
    )
    
    # Create MFA challenges table
    op.create_table(
        'mfa_challenges',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('challenge_type', sa.String(length=50), nullable=False),
        sa.Column('challenge_data', sa.JSON(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for better performance
    op.create_index('ix_mfa_tokens_user_id', 'mfa_tokens', ['user_id'])
    op.create_index('ix_oauth_accounts_user_id', 'oauth_accounts', ['user_id'])
    op.create_index('ix_oauth_accounts_provider', 'oauth_accounts', ['provider', 'provider_id'])
    op.create_index('ix_webauthn_credentials_user_id', 'webauthn_credentials', ['user_id'])
    op.create_index('ix_mfa_challenges_user_id', 'mfa_challenges', ['user_id'])
    op.create_index('ix_mfa_challenges_expires_at', 'mfa_challenges', ['expires_at'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_mfa_challenges_expires_at', table_name='mfa_challenges')
    op.drop_index('ix_mfa_challenges_user_id', table_name='mfa_challenges')
    op.drop_index('ix_webauthn_credentials_user_id', table_name='webauthn_credentials')
    op.drop_index('ix_oauth_accounts_provider', table_name='oauth_accounts')
    op.drop_index('ix_oauth_accounts_user_id', table_name='oauth_accounts')
    op.drop_index('ix_mfa_tokens_user_id', table_name='mfa_tokens')
    
    # Drop tables
    op.drop_table('mfa_challenges')
    op.drop_table('webauthn_credentials')
    op.drop_table('oauth_accounts')
    op.drop_table('mfa_tokens') 