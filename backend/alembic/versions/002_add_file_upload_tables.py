"""Add file upload tables

Revision ID: 002
Revises: 001
Create Date: 2024-01-20 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None


def upgrade():
    # Create uploaded_files table
    op.create_table(
        "uploaded_files",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("original_filename", sa.String(length=255), nullable=False),
        sa.Column("file_path", sa.String(length=500), nullable=False),
        sa.Column("file_size", sa.BigInteger(), nullable=False),
        sa.Column("file_type", sa.String(length=50), nullable=False),
        sa.Column("mime_type", sa.String(length=100), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("processing_started_at", sa.DateTime(), nullable=True),
        sa.Column("processing_completed_at", sa.DateTime(), nullable=True),
        sa.Column("is_valid", sa.Boolean(), nullable=True),
        sa.Column("validation_errors", sa.Text(), nullable=True),
        sa.Column("parsed_data", sa.Text(), nullable=True),
        sa.Column("uploaded_by_id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["uploaded_by_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_uploaded_files_id"), "uploaded_files", ["id"], unique=False
    )

    # Create processing_logs table
    op.create_table(
        "processing_logs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("file_id", sa.Integer(), nullable=False),
        sa.Column("step", sa.String(length=100), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("level", sa.String(length=20), nullable=False),
        sa.Column("details", sa.Text(), nullable=True),
        sa.Column(
            "timestamp", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["file_id"],
            ["uploaded_files.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_processing_logs_id"), "processing_logs", ["id"], unique=False
    )


def downgrade():
    op.drop_index(op.f("ix_processing_logs_id"), table_name="processing_logs")
    op.drop_table("processing_logs")
    op.drop_index(op.f("ix_uploaded_files_id"), table_name="uploaded_files")
    op.drop_table("uploaded_files")
