"""add_notification_tables

Revision ID: cb40847ce093
Revises: cc29f0d3d343
Create Date: 2025-08-03 11:53:11.071500

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision = "cb40847ce093"
down_revision = "e55cf976aaaa"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create notification types enum
    notification_type_enum = sa.Enum(
        "REPORT_READY",
        "FILE_PROCESSED",
        "ERROR_ALERT",
        "SYSTEM_UPDATE",
        "COLLABORATION_INVITE",
        "DATA_QUALITY_ISSUE",
        "SCHEDULED_REPORT",
        "PARAMETER_CHANGE",
        "CALCULATION_COMPLETE",
        "DEADLINE_REMINDER",
        "SECURITY_ALERT",
        name="notificationtype",
    )
    notification_type_enum.create(op.get_bind())

    # Create notification priority enum
    notification_priority_enum = sa.Enum(
        "LOW", "NORMAL", "HIGH", "URGENT", name="notificationpriority"
    )
    notification_priority_enum.create(op.get_bind())

    # Create notification status enum
    notification_status_enum = sa.Enum(
        "PENDING",
        "SENT",
        "DELIVERED",
        "FAILED",
        "READ",
        "DISMISSED",
        name="notificationstatus",
    )
    notification_status_enum.create(op.get_bind())

    # Create notifications table
    op.create_table(
        "notifications",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "type", notification_type_enum, nullable=False, index=True
        ),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column("data", sa.JSON, default={}),
        sa.Column(
            "priority",
            notification_priority_enum,
            default="NORMAL",
            index=True,
        ),
        sa.Column(
            "status",
            notification_status_enum,
            default="PENDING",
            index=True,
        ),
        sa.Column("is_read", sa.Boolean, default=False, index=True),
        sa.Column("is_dismissed", sa.Boolean, default=False, index=True),
        sa.Column("created_at", sa.DateTime, nullable=False, index=True),
        sa.Column("sent_at", sa.DateTime),
        sa.Column("delivered_at", sa.DateTime),
        sa.Column("read_at", sa.DateTime),
        sa.Column("dismissed_at", sa.DateTime),
        sa.Column("expires_at", sa.DateTime, index=True),
        sa.Column("delivery_attempts", sa.Integer, default=0),
        sa.Column("last_delivery_attempt", sa.DateTime),
        sa.Column("delivery_error", sa.Text),
    )

    # Create notification preferences table
    op.create_table(
        "notification_preferences",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id"),
            nullable=False,
            unique=True,
        ),
        sa.Column("email_enabled", sa.Boolean, default=True),
        sa.Column("push_enabled", sa.Boolean, default=True),
        sa.Column("in_app_enabled", sa.Boolean, default=True),
        sa.Column("quiet_hours_enabled", sa.Boolean, default=False),
        sa.Column("quiet_start_time", sa.String(5)),
        sa.Column("quiet_end_time", sa.String(5)),
        sa.Column("quiet_timezone", sa.String(50), default="UTC"),
        sa.Column("type_preferences", sa.JSON, default={}),
        sa.Column(
            "min_priority_email",
            notification_priority_enum,
            default="NORMAL",
        ),
        sa.Column(
            "min_priority_push", notification_priority_enum, default="HIGH"
        ),
        sa.Column(
            "min_priority_in_app",
            notification_priority_enum,
            default="LOW",
        ),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Create notification templates table
    op.create_table(
        "notification_templates",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False, unique=True),
        sa.Column(
            "type", notification_type_enum, nullable=False, index=True
        ),
        sa.Column("title_template", sa.String(255), nullable=False),
        sa.Column("message_template", sa.Text, nullable=False),
        sa.Column(
            "default_priority",
            notification_priority_enum,
            default="NORMAL",
        ),
        sa.Column("expires_after_hours", sa.Integer),
        sa.Column("description", sa.Text),
        sa.Column("is_active", sa.Boolean, default=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.Column("updated_at", sa.DateTime, nullable=False),
    )

    # Create indexes for performance
    op.create_index(
        "ix_notifications_user_created",
        "notifications",
        ["user_id", "created_at"],
    )
    op.create_index(
        "ix_notifications_user_unread",
        "notifications",
        ["user_id", "is_read"],
    )
    op.create_index(
        "ix_notifications_user_priority",
        "notifications",
        ["user_id", "priority"],
    )
    op.create_index(
        "ix_notifications_expires_status",
        "notifications",
        ["expires_at", "status"],
    )


def downgrade() -> None:
    # Drop indexes
    op.drop_index("ix_notifications_expires_status")
    op.drop_index("ix_notifications_user_priority")
    op.drop_index("ix_notifications_user_unread")
    op.drop_index("ix_notifications_user_created")

    # Drop tables
    op.drop_table("notification_templates")
    op.drop_table("notification_preferences")
    op.drop_table("notifications")

    # Drop enums
    sa.Enum(name="notificationstatus").drop(op.get_bind())
    sa.Enum(name="notificationpriority").drop(op.get_bind())
    sa.Enum(name="notificationtype").drop(op.get_bind())
