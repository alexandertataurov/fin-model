"""Add report tables

Revision ID: 004
Revises: 003
Create Date: 2024-12-19 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "004"
down_revision = "003"
branch_labels = None
depends_on = None


def upgrade():
    # Create report_templates table
    op.create_table(
        "report_templates",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "report_type",
            sa.Enum(
                "FINANCIAL_SUMMARY",
                "PROFIT_LOSS",
                "BALANCE_SHEET",
                "CASH_FLOW",
                "CUSTOM",
                name="reporttype",
            ),
            nullable=False,
        ),
        sa.Column("is_system", sa.Boolean(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("template_config", sa.JSON(), nullable=True),
        sa.Column("branding_config", sa.JSON(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["created_by"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_report_templates_id"),
        "report_templates",
        ["id"],
        unique=False,
    )

    # Create report_schedules table
    op.create_table(
        "report_schedules",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "cron_expression", sa.String(length=100), nullable=False
        ),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("template_id", sa.Integer(), nullable=False),
        sa.Column(
            "export_format",
            sa.Enum(
                "PDF",
                "EXCEL",
                "CSV",
                "PNG",
                "SVG",
                "JSON",
                name="exportformat",
            ),
            nullable=True,
        ),
        sa.Column("report_config", sa.JSON(), nullable=True),
        sa.Column("email_recipients", sa.JSON(), nullable=True),
        sa.Column("delivery_config", sa.JSON(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column(
            "last_run_at", sa.DateTime(timezone=True), nullable=True
        ),
        sa.Column(
            "next_run_at", sa.DateTime(timezone=True), nullable=True
        ),
        sa.Column("run_count", sa.Integer(), nullable=True),
        sa.Column("failure_count", sa.Integer(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["created_by"],
            ["users.id"],
        ),
        sa.ForeignKeyConstraint(
            ["template_id"],
            ["report_templates.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_report_schedules_id"),
        "report_schedules",
        ["id"],
        unique=False,
    )

    # Create report_exports table
    op.create_table(
        "report_exports",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column(
            "export_format",
            sa.Enum(
                "PDF",
                "EXCEL",
                "CSV",
                "PNG",
                "SVG",
                "JSON",
                name="exportformat",
            ),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.Enum(
                "PENDING",
                "PROCESSING",
                "COMPLETED",
                "FAILED",
                "CANCELLED",
                name="reportstatus",
            ),
            nullable=True,
        ),
        sa.Column("file_path", sa.String(length=500), nullable=True),
        sa.Column("file_size", sa.Integer(), nullable=True),
        sa.Column("file_url", sa.String(length=500), nullable=True),
        sa.Column("template_id", sa.Integer(), nullable=True),
        sa.Column("schedule_id", sa.Integer(), nullable=True),
        sa.Column("generation_config", sa.JSON(), nullable=True),
        sa.Column("source_file_ids", sa.JSON(), nullable=True),
        sa.Column(
            "data_period_start", sa.DateTime(timezone=True), nullable=True
        ),
        sa.Column(
            "data_period_end", sa.DateTime(timezone=True), nullable=True
        ),
        sa.Column(
            "processing_started_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "processing_completed_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "processing_duration_seconds", sa.Integer(), nullable=True
        ),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column("is_shared", sa.Boolean(), nullable=True),
        sa.Column("shared_with", sa.JSON(), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["created_by"],
            ["users.id"],
        ),
        sa.ForeignKeyConstraint(
            ["schedule_id"],
            ["report_schedules.id"],
        ),
        sa.ForeignKeyConstraint(
            ["template_id"],
            ["report_templates.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_report_exports_id"),
        "report_exports",
        ["id"],
        unique=False,
    )

    # Create indexes for better performance
    op.create_index(
        "ix_report_templates_type",
        "report_templates",
        ["report_type"],
        unique=False,
    )
    op.create_index(
        "ix_report_templates_created_by",
        "report_templates",
        ["created_by"],
        unique=False,
    )
    op.create_index(
        "ix_report_schedules_template_id",
        "report_schedules",
        ["template_id"],
        unique=False,
    )
    op.create_index(
        "ix_report_schedules_created_by",
        "report_schedules",
        ["created_by"],
        unique=False,
    )
    op.create_index(
        "ix_report_exports_status",
        "report_exports",
        ["status"],
        unique=False,
    )
    op.create_index(
        "ix_report_exports_created_by",
        "report_exports",
        ["created_by"],
        unique=False,
    )
    op.create_index(
        "ix_report_exports_template_id",
        "report_exports",
        ["template_id"],
        unique=False,
    )
    op.create_index(
        "ix_report_exports_expires_at",
        "report_exports",
        ["expires_at"],
        unique=False,
    )


def downgrade():
    # Drop indexes
    op.drop_index(
        "ix_report_exports_expires_at", table_name="report_exports"
    )
    op.drop_index(
        "ix_report_exports_template_id", table_name="report_exports"
    )
    op.drop_index(
        "ix_report_exports_created_by", table_name="report_exports"
    )
    op.drop_index("ix_report_exports_status", table_name="report_exports")
    op.drop_index(
        "ix_report_schedules_created_by", table_name="report_schedules"
    )
    op.drop_index(
        "ix_report_schedules_template_id", table_name="report_schedules"
    )
    op.drop_index(
        "ix_report_templates_created_by", table_name="report_templates"
    )
    op.drop_index(
        "ix_report_templates_type", table_name="report_templates"
    )

    # Drop tables
    op.drop_index(
        op.f("ix_report_exports_id"), table_name="report_exports"
    )
    op.drop_table("report_exports")
    op.drop_index(
        op.f("ix_report_schedules_id"), table_name="report_schedules"
    )
    op.drop_table("report_schedules")
    op.drop_index(
        op.f("ix_report_templates_id"), table_name="report_templates"
    )
    op.drop_table("report_templates")

    # Drop enums
    op.execute("DROP TYPE IF EXISTS reportstatus")
    op.execute("DROP TYPE IF EXISTS exportformat")
    op.execute("DROP TYPE IF EXISTS reporttype")
