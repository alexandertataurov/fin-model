"""Add parameter modeling tables

Revision ID: 003
Revises: 002
Create Date: 2024-01-15 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "003"
down_revision = "002"
branch_labels = None
depends_on = None


def upgrade():
    # Create parameters table
    op.create_table(
        "parameters",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("display_name", sa.String(length=255), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("parameter_type", sa.String(length=50), nullable=False),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.Column(
            "sensitivity_level", sa.String(length=20), nullable=False
        ),
        sa.Column("current_value", sa.Float(), nullable=True),
        sa.Column("default_value", sa.Float(), nullable=True),
        sa.Column("min_value", sa.Float(), nullable=True),
        sa.Column("max_value", sa.Float(), nullable=True),
        sa.Column("unit", sa.String(length=50), nullable=True),
        sa.Column("format_type", sa.String(length=50), nullable=False),
        sa.Column("source_file_id", sa.Integer(), nullable=True),
        sa.Column("source_sheet", sa.String(length=255), nullable=True),
        sa.Column("source_cell", sa.String(length=20), nullable=True),
        sa.Column("source_range", sa.String(length=50), nullable=True),
        sa.Column("depends_on", sa.JSON(), nullable=True),
        sa.Column("affects", sa.JSON(), nullable=True),
        sa.Column("formula", sa.Text(), nullable=True),
        sa.Column("validation_rules", sa.JSON(), nullable=True),
        sa.Column("is_required", sa.Boolean(), nullable=True),
        sa.Column("is_editable", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("created_by_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["created_by_id"],
            ["users.id"],
        ),
        sa.ForeignKeyConstraint(
            ["source_file_id"],
            ["uploaded_files.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_parameters_category"),
        "parameters",
        ["category"],
        unique=False,
    )
    op.create_index(
        op.f("ix_parameters_id"), "parameters", ["id"], unique=False
    )
    op.create_index(
        op.f("ix_parameters_name"), "parameters", ["name"], unique=False
    )
    op.create_index(
        op.f("ix_parameters_parameter_type"),
        "parameters",
        ["parameter_type"],
        unique=False,
    )

    # Create scenarios table
    op.create_table(
        "scenarios",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_baseline", sa.Boolean(), nullable=True),
        sa.Column("is_template", sa.Boolean(), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=True),
        sa.Column("version", sa.String(length=50), nullable=False),
        sa.Column("parent_scenario_id", sa.Integer(), nullable=True),
        sa.Column("base_file_id", sa.Integer(), nullable=False),
        sa.Column("last_calculated_at", sa.DateTime(), nullable=True),
        sa.Column(
            "calculation_status", sa.String(length=50), nullable=True
        ),
        sa.Column("calculation_results", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("created_by_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["base_file_id"],
            ["uploaded_files.id"],
        ),
        sa.ForeignKeyConstraint(
            ["created_by_id"],
            ["users.id"],
        ),
        sa.ForeignKeyConstraint(
            ["parent_scenario_id"],
            ["scenarios.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create parameter_values table
    op.create_table(
        "parameter_values",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("parameter_id", sa.Integer(), nullable=False),
        sa.Column("scenario_id", sa.Integer(), nullable=False),
        sa.Column("value", sa.Float(), nullable=False),
        sa.Column("original_value", sa.Float(), nullable=True),
        sa.Column("change_reason", sa.String(length=255), nullable=True),
        sa.Column("changed_at", sa.DateTime(), nullable=True),
        sa.Column("changed_by_id", sa.Integer(), nullable=False),
        sa.Column("is_valid", sa.Boolean(), nullable=True),
        sa.Column("validation_errors", sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(
            ["changed_by_id"],
            ["users.id"],
        ),
        sa.ForeignKeyConstraint(
            ["parameter_id"],
            ["parameters.id"],
        ),
        sa.ForeignKeyConstraint(
            ["scenario_id"],
            ["scenarios.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create formula_nodes table
    op.create_table(
        "formula_nodes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("cell_reference", sa.String(length=50), nullable=False),
        sa.Column("formula", sa.Text(), nullable=True),
        sa.Column("value", sa.Float(), nullable=True),
        sa.Column("data_type", sa.String(length=50), nullable=True),
        sa.Column("file_id", sa.Integer(), nullable=False),
        sa.Column("sheet_name", sa.String(length=255), nullable=False),
        sa.Column("depends_on_cells", sa.JSON(), nullable=True),
        sa.Column("referenced_by_cells", sa.JSON(), nullable=True),
        sa.Column("parameter_id", sa.Integer(), nullable=True),
        sa.Column("calculation_order", sa.Integer(), nullable=True),
        sa.Column("is_circular", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["file_id"],
            ["uploaded_files.id"],
        ),
        sa.ForeignKeyConstraint(
            ["parameter_id"],
            ["parameters.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create sensitivity_analyses table
    op.create_table(
        "sensitivity_analyses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("analysis_type", sa.String(length=50), nullable=False),
        sa.Column("scenario_id", sa.Integer(), nullable=False),
        sa.Column("target_parameter_id", sa.Integer(), nullable=False),
        sa.Column("input_parameters", sa.JSON(), nullable=False),
        sa.Column("analysis_config", sa.JSON(), nullable=True),
        sa.Column("results", sa.JSON(), nullable=True),
        sa.Column("chart_data", sa.JSON(), nullable=True),
        sa.Column("summary_statistics", sa.JSON(), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("execution_time", sa.Float(), nullable=True),
        sa.Column("iterations", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.Column("created_by_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["created_by_id"],
            ["users.id"],
        ),
        sa.ForeignKeyConstraint(
            ["scenario_id"],
            ["scenarios.id"],
        ),
        sa.ForeignKeyConstraint(
            ["target_parameter_id"],
            ["parameters.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create calculation_audits table
    op.create_table(
        "calculation_audits",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("scenario_id", sa.Integer(), nullable=False),
        sa.Column(
            "calculation_type", sa.String(length=50), nullable=False
        ),
        sa.Column("triggered_by", sa.String(length=50), nullable=False),
        sa.Column("trigger_details", sa.JSON(), nullable=True),
        sa.Column("start_time", sa.DateTime(), nullable=False),
        sa.Column("end_time", sa.DateTime(), nullable=True),
        sa.Column("execution_time", sa.Float(), nullable=True),
        sa.Column("cells_calculated", sa.Integer(), nullable=True),
        sa.Column("formulas_evaluated", sa.Integer(), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("warnings", sa.JSON(), nullable=True),
        sa.Column("parameters_changed", sa.JSON(), nullable=True),
        sa.Column("cells_affected", sa.JSON(), nullable=True),
        sa.Column("created_by_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["created_by_id"],
            ["users.id"],
        ),
        sa.ForeignKeyConstraint(
            ["scenario_id"],
            ["scenarios.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Add relationships to existing tables
    # Add parameters relationship to User model
    op.execute(
        """
        ALTER TABLE users ADD COLUMN IF NOT EXISTS parameters_count INTEGER DEFAULT 0;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS scenarios_count INTEGER DEFAULT 0;
    """
    )


def downgrade():
    # Drop tables in reverse order
    op.drop_table("calculation_audits")
    op.drop_table("sensitivity_analyses")
    op.drop_table("formula_nodes")
    op.drop_table("parameter_values")
    op.drop_table("scenarios")
    op.drop_index(
        op.f("ix_parameters_parameter_type"), table_name="parameters"
    )
    op.drop_index(op.f("ix_parameters_name"), table_name="parameters")
    op.drop_index(op.f("ix_parameters_id"), table_name="parameters")
    op.drop_index(op.f("ix_parameters_category"), table_name="parameters")
    op.drop_table("parameters")

    # Remove added columns from users table
    op.execute(
        """
        ALTER TABLE users DROP COLUMN IF EXISTS parameters_count;
        ALTER TABLE users DROP COLUMN IF EXISTS scenarios_count;
    """
    )
