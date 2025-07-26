"""Add financial data tables

Revision ID: 005
Revises: 004
Create Date: 2024-12-20 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '005'
down_revision = '004'
branch_labels = None
depends_on = None


def upgrade():
    # Create financial_statements table
    op.create_table('financial_statements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('scenario_id', sa.Integer(), nullable=False),
        sa.Column('statement_type', sa.Enum('PROFIT_LOSS', 'BALANCE_SHEET', 'CASH_FLOW', 'STATEMENT_OF_EQUITY', name='statementtype'), nullable=False),
        sa.Column('period_start', sa.Date(), nullable=False),
        sa.Column('period_end', sa.Date(), nullable=False),
        sa.Column('period_type', sa.Enum('MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM', name='periodtype'), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),  # ISO currency code
        sa.Column('line_items', sa.JSON(), nullable=False),  # JSON structure of financial line items
        sa.Column('raw_data', sa.JSON(), nullable=True),  # Original extracted data
        sa.Column('calculated_data', sa.JSON(), nullable=True),  # Derived calculations
        sa.Column('version', sa.Integer(), nullable=False, default=1),
        sa.Column('is_baseline', sa.Boolean(), nullable=False, default=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_by_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['created_by_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['scenario_id'], ['scenarios.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_financial_statements_scenario', 'financial_statements', ['scenario_id'], unique=False)
    op.create_index('ix_financial_statements_type', 'financial_statements', ['statement_type'], unique=False)
    op.create_index('ix_financial_statements_period', 'financial_statements', ['period_start', 'period_end'], unique=False)

    # Create metrics table
    op.create_table('metrics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('scenario_id', sa.Integer(), nullable=False),
        sa.Column('metric_name', sa.String(length=255), nullable=False),
        sa.Column('metric_category', sa.String(length=100), nullable=False),  # profitability, liquidity, efficiency, etc.
        sa.Column('metric_type', sa.Enum('RATIO', 'PERCENTAGE', 'CURRENCY', 'COUNT', 'DAYS', name='metrictype'), nullable=False),
        sa.Column('value', sa.Float(), nullable=False),
        sa.Column('period_start', sa.Date(), nullable=False),
        sa.Column('period_end', sa.Date(), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=True),
        sa.Column('calculation_formula', sa.Text(), nullable=True),
        sa.Column('benchmark_value', sa.Float(), nullable=True),
        sa.Column('industry_average', sa.Float(), nullable=True),
        sa.Column('calculation_metadata', sa.JSON(), nullable=True),
        sa.Column('created_by_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['created_by_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['scenario_id'], ['scenarios.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_metrics_scenario', 'metrics', ['scenario_id'], unique=False)
    op.create_index('ix_metrics_name', 'metrics', ['metric_name'], unique=False)
    op.create_index('ix_metrics_category', 'metrics', ['metric_category'], unique=False)
    op.create_index('ix_metrics_period', 'metrics', ['period_start', 'period_end'], unique=False)

    # Create time_series table
    op.create_table('time_series',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('scenario_id', sa.Integer(), nullable=False),
        sa.Column('data_type', sa.String(length=100), nullable=False),  # revenue, expenses, cash_flow, etc.
        sa.Column('data_subtype', sa.String(length=100), nullable=True),  # product_line, department, etc.
        sa.Column('period_date', sa.Date(), nullable=False),
        sa.Column('value', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('frequency', sa.Enum('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', name='frequency'), nullable=False),
        sa.Column('data_source', sa.String(length=100), nullable=True),
        sa.Column('confidence_level', sa.Float(), nullable=True),  # 0.0 to 1.0
        sa.Column('is_actual', sa.Boolean(), nullable=False, default=True),  # actual vs projected
        sa.Column('is_adjusted', sa.Boolean(), nullable=False, default=False),
        sa.Column('adjustment_reason', sa.Text(), nullable=True),
        sa.Column('data_metadata', sa.JSON(), nullable=True),
        sa.Column('created_by_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['created_by_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['scenario_id'], ['scenarios.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_time_series_scenario', 'time_series', ['scenario_id'], unique=False)
    op.create_index('ix_time_series_type', 'time_series', ['data_type'], unique=False)
    op.create_index('ix_time_series_date', 'time_series', ['period_date'], unique=False)
    op.create_index('ix_time_series_composite', 'time_series', ['scenario_id', 'data_type', 'period_date'], unique=False)

    # Create calculations table
    op.create_table('calculations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('scenario_id', sa.Integer(), nullable=False),
        sa.Column('calculation_name', sa.String(length=255), nullable=False),
        sa.Column('calculation_type', sa.Enum('FORMULA', 'AGGREGATION', 'RATIO', 'TREND', 'FORECAST', name='calculationtype'), nullable=False),
        sa.Column('formula', sa.Text(), nullable=False),
        sa.Column('input_parameters', sa.JSON(), nullable=False),  # Array of parameter IDs and constants
        sa.Column('output_parameters', sa.JSON(), nullable=False),  # Array of parameter IDs this calculation produces
        sa.Column('dependencies', sa.JSON(), nullable=True),  # Array of calculation IDs this depends on
        sa.Column('execution_order', sa.Integer(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('error_handling', sa.JSON(), nullable=True),
        sa.Column('validation_rules', sa.JSON(), nullable=True),
        sa.Column('last_executed_at', sa.DateTime(), nullable=True),
        sa.Column('execution_time_ms', sa.Integer(), nullable=True),
        sa.Column('created_by_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['created_by_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['scenario_id'], ['scenarios.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_calculations_scenario', 'calculations', ['scenario_id'], unique=False)
    op.create_index('ix_calculations_order', 'calculations', ['execution_order'], unique=False)
    op.create_index('ix_calculations_name', 'calculations', ['calculation_name'], unique=False)

    # Create templates table
    op.create_table('templates',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('template_type', sa.Enum('EXCEL', 'CSV', 'JSON', 'CUSTOM', name='templatetype'), nullable=False),
        sa.Column('file_structure', sa.JSON(), nullable=False),  # Defines expected file structure
        sa.Column('mapping_rules', sa.JSON(), nullable=False),  # How to map file data to database
        sa.Column('validation_rules', sa.JSON(), nullable=True),
        sa.Column('transformation_rules', sa.JSON(), nullable=True),
        sa.Column('sample_file_path', sa.String(length=500), nullable=True),
        sa.Column('version', sa.String(length=50), nullable=False, default='1.0'),
        sa.Column('is_system_template', sa.Boolean(), nullable=False, default=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('usage_count', sa.Integer(), nullable=False, default=0),
        sa.Column('created_by_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['created_by_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_templates_type', 'templates', ['template_type'], unique=False)
    op.create_index('ix_templates_name', 'templates', ['name'], unique=False)

    # Create file_versions table
    op.create_table('file_versions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('file_id', sa.Integer(), nullable=False),
        sa.Column('version_number', sa.Integer(), nullable=False),
        sa.Column('file_path', sa.String(length=500), nullable=False),
        sa.Column('file_size', sa.BigInteger(), nullable=False),
        sa.Column('file_hash', sa.String(length=64), nullable=False),  # SHA-256 hash
        sa.Column('change_description', sa.Text(), nullable=True),
        sa.Column('change_type', sa.Enum('INITIAL', 'UPDATE', 'CORRECTION', 'REPROCESSING', name='changetype'), nullable=False),
        sa.Column('processing_metadata', sa.JSON(), nullable=True),
        sa.Column('is_current', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_by_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['created_by_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['file_id'], ['uploaded_files.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('file_id', 'version_number', name='unique_file_version')
    )
    op.create_index('ix_file_versions_file', 'file_versions', ['file_id'], unique=False)
    op.create_index('ix_file_versions_current', 'file_versions', ['is_current'], unique=False)
    op.create_index('ix_file_versions_hash', 'file_versions', ['file_hash'], unique=False)

    # Create data_sources table
    op.create_table('data_sources',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('source_name', sa.String(length=255), nullable=False),
        sa.Column('source_type', sa.Enum('FILE_UPLOAD', 'API', 'DATABASE', 'MANUAL_ENTRY', 'CALCULATION', name='sourcetype'), nullable=False),
        sa.Column('source_identifier', sa.String(length=500), nullable=False),  # file ID, API endpoint, etc.
        sa.Column('data_lineage', sa.JSON(), nullable=True),  # Track data transformation chain
        sa.Column('quality_metrics', sa.JSON(), nullable=True),  # Data quality scores
        sa.Column('refresh_frequency', sa.String(length=50), nullable=True),
        sa.Column('last_updated', sa.DateTime(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('connection_config', sa.JSON(), nullable=True),
        sa.Column('validation_config', sa.JSON(), nullable=True),
        sa.Column('created_by_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['created_by_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_data_sources_type', 'data_sources', ['source_type'], unique=False)
    op.create_index('ix_data_sources_name', 'data_sources', ['source_name'], unique=False)

    # Add relationships to existing tables by adding new columns
    op.add_column('uploaded_files', sa.Column('template_id', sa.Integer(), nullable=True))
    op.add_column('uploaded_files', sa.Column('data_source_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_uploaded_files_template', 'uploaded_files', 'templates', ['template_id'], ['id'])
    op.create_foreign_key('fk_uploaded_files_data_source', 'uploaded_files', 'data_sources', ['data_source_id'], ['id'])

    op.add_column('parameters', sa.Column('data_source_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_parameters_data_source', 'parameters', 'data_sources', ['data_source_id'], ['id'])


def downgrade():
    # Remove foreign keys and columns first
    op.drop_constraint('fk_parameters_data_source', 'parameters', type_='foreignkey')
    op.drop_column('parameters', 'data_source_id')
    
    op.drop_constraint('fk_uploaded_files_data_source', 'uploaded_files', type_='foreignkey')
    op.drop_constraint('fk_uploaded_files_template', 'uploaded_files', type_='foreignkey')
    op.drop_column('uploaded_files', 'data_source_id')
    op.drop_column('uploaded_files', 'template_id')

    # Drop tables in reverse order
    op.drop_index('ix_data_sources_name', table_name='data_sources')
    op.drop_index('ix_data_sources_type', table_name='data_sources')
    op.drop_table('data_sources')

    op.drop_index('ix_file_versions_hash', table_name='file_versions')
    op.drop_index('ix_file_versions_current', table_name='file_versions')
    op.drop_index('ix_file_versions_file', table_name='file_versions')
    op.drop_table('file_versions')

    op.drop_index('ix_templates_name', table_name='templates')
    op.drop_index('ix_templates_type', table_name='templates')
    op.drop_table('templates')

    op.drop_index('ix_calculations_name', table_name='calculations')
    op.drop_index('ix_calculations_order', table_name='calculations')
    op.drop_index('ix_calculations_scenario', table_name='calculations')
    op.drop_table('calculations')

    op.drop_index('ix_time_series_composite', table_name='time_series')
    op.drop_index('ix_time_series_date', table_name='time_series')
    op.drop_index('ix_time_series_type', table_name='time_series')
    op.drop_index('ix_time_series_scenario', table_name='time_series')
    op.drop_table('time_series')

    op.drop_index('ix_metrics_period', table_name='metrics')
    op.drop_index('ix_metrics_category', table_name='metrics')
    op.drop_index('ix_metrics_name', table_name='metrics')
    op.drop_index('ix_metrics_scenario', table_name='metrics')
    op.drop_table('metrics')

    op.drop_index('ix_financial_statements_period', table_name='financial_statements')
    op.drop_index('ix_financial_statements_type', table_name='financial_statements')
    op.drop_index('ix_financial_statements_scenario', table_name='financial_statements')
    op.drop_table('financial_statements')

    # Drop custom types
    op.execute('DROP TYPE IF EXISTS sourcetype')
    op.execute('DROP TYPE IF EXISTS changetype')
    op.execute('DROP TYPE IF EXISTS templatetype')
    op.execute('DROP TYPE IF EXISTS calculationtype')
    op.execute('DROP TYPE IF EXISTS frequency')
    op.execute('DROP TYPE IF EXISTS metrictype')
    op.execute('DROP TYPE IF EXISTS periodtype')
    op.execute('DROP TYPE IF EXISTS statementtype') 