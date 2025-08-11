#!/usr/bin/env python3
"""
Startup script for Railway deployment
Runs migrations and starts the application
"""

import os
import sys
from pathlib import Path

# Ensure we're not in a numpy source directory
current_dir = Path.cwd()
if (current_dir / "numpy").exists() and (current_dir / "setup.py").exists():
    print("⚠️ Detected numpy source directory, changing to /app")
    os.chdir("/app")

from alembic import command
from alembic.config import Config


def check_database_connection():
    """Check if we can connect to the database."""
    print("🔌 Checking database connection...")

    try:
        from app.core.config import settings
        from sqlalchemy import create_engine, text

        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False


def fix_migration_state():
    """
    Fix migration state by marking migrations as complete if tables exist.
    """
    print("🔧 Checking migration state...")

    try:
        from alembic import command
        from alembic.config import Config
        from app.core.config import settings
        from sqlalchemy import create_engine, text

        engine = create_engine(settings.DATABASE_URL)
        current_dir = Path(__file__).parent
        alembic_cfg = Config(os.path.join(current_dir, "alembic.ini"))
        alembic_cfg.set_main_option(
            "script_location", os.path.join(current_dir, "alembic_migrations")
        )

        with engine.connect() as conn:
            # Check if monte_carlo_simulations table exists
            result = conn.execute(
                text(
                    """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_schema = 'public'
                    AND table_name = 'monte_carlo_simulations'
                )
            """
                )
            )
            if result.scalar():
                print("✅ monte_carlo_simulations table exists")
                print("🔄 Marking migration e55cf976aaaa as complete...")
                command.stamp(alembic_cfg, "e55cf976aaaa")
                print("✅ Migration e55cf976aaaa marked as complete")

            # Check if notifications table exists
            result = conn.execute(
                text(
                    "SELECT EXISTS (SELECT FROM information_schema.tables "
                    "WHERE table_schema='public' AND "
                    "table_name='notifications')"
                )
            )
            if result.scalar():
                print("✅ notifications table exists")
                print("🔄 Marking migration cb40847ce093 as complete...")
                command.stamp(alembic_cfg, "cb40847ce093")
                print("✅ Migration cb40847ce093 marked as complete")

            # Check if report_templates table exists
            result = conn.execute(
                text(
                    """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_schema = 'public'
                    AND table_name = 'report_templates'
                )
            """
                )
            )
            if result.scalar():
                print("✅ report_templates table exists")
                print("🔄 Marking migration cc29f0d3d343 as complete...")
                command.stamp(alembic_cfg, "cc29f0d3d343")
                print("✅ Migration cc29f0d3d343 marked as complete")

        return True
    except Exception as e:
        print(f"❌ Error checking migration state: {e}")
        return False


def run_migrations():
    """Run database migrations."""
    print("🔄 Running database migrations...")

    try:
        current_dir = Path(__file__).parent
        alembic_cfg = Config(os.path.join(current_dir, "alembic.ini"))
        alembic_cfg.set_main_option(
            "script_location", os.path.join(current_dir, "alembic_migrations")
        )

        # Check current revision
        print("📋 Current database revision:")
        command.current(alembic_cfg)

        # Check migration state first
        if not fix_migration_state():
            print("⚠️ Migration state check failed, proceeding anyway...")

        # Run migrations
        print("🔄 Upgrading to head...")
        command.upgrade(alembic_cfg, "head")

        print("✅ Migrations completed successfully")
        return True

    except Exception as e:
        print(f"❌ Migration failed: {e}")
        import traceback

        traceback.print_exc()
        return False


def ensure_system_logs_and_maintenance():
    """
    Create system_logs and maintenance_schedules if missing and stamp rev.
    """
    print("🔧 Ensuring system logs and maintenance tables...")

    try:
        from alembic import command
        from alembic.config import Config
        from app.core.config import settings
        from sqlalchemy import create_engine, text

        engine = create_engine(settings.DATABASE_URL)
        current_dir = Path(__file__).parent
        alembic_cfg = Config(os.path.join(current_dir, "alembic.ini"))
        alembic_cfg.set_main_option(
            "script_location", os.path.join(current_dir, "alembic_migrations")
        )

        with engine.connect() as conn:
            # Check and create system_logs
            sys_exists = conn.execute(
                text(
                    "SELECT EXISTS (SELECT FROM information_schema.tables "
                    "WHERE table_schema='public' AND table_name='system_logs')"
                )
            ).scalar()
            if not sys_exists:
                print("🔄 Creating table system_logs...")
                conn.execute(
                    text(
                        """
                    CREATE TABLE system_logs (
                        id INTEGER PRIMARY KEY,
                        timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
                        level VARCHAR(16) NOT NULL,
                        module VARCHAR(64),
                        message TEXT NOT NULL,
                        user_id INTEGER REFERENCES users(id)
                    );
                """
                    )
                )
                conn.execute(
                    text(
                        "CREATE INDEX IF NOT EXISTS ix_system_logs_id "
                        "ON system_logs(id)"
                    )
                )
                print("✅ system_logs created")

            # Check and create maintenance_schedules
            maint_exists = conn.execute(
                text(
                    """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_schema = 'public'
                    AND table_name = 'maintenance_schedules'
                )
            """
                )
            ).scalar()
            if not maint_exists:
                print("🔄 Creating table maintenance_schedules...")
                conn.execute(
                    text(
                        """
                    CREATE TABLE maintenance_schedules (
                        id VARCHAR(64) PRIMARY KEY,
                        name VARCHAR(128) NOT NULL,
                        task VARCHAR(32) NOT NULL,
                        schedule VARCHAR(128) NOT NULL,
                        enabled BOOLEAN NOT NULL DEFAULT TRUE,
                        updated_at TIMESTAMP DEFAULT NOW(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW()
                    );
                """
                    )
                )
                print("✅ maintenance_schedules created")

            conn.commit()

            # Stamp the historical migration if present in script
            try:
                command.stamp(alembic_cfg, "004_add_system_logs_and_maintenance")
                print("✅ Stamped revision 004_add_system_logs_and_maintenance")
            except Exception as e:
                print(f"⚠️ Could not stamp 004_add_system_logs_and_maintenance: {e}")

        return True
    except Exception as e:
        print(f"❌ Error ensuring system tables: {e}")
        return False


def create_notifications_table():
    """Create notifications table manually if it doesn't exist."""
    print("🔧 Creating notifications table...")

    try:
        from app.core.config import settings
        from sqlalchemy import create_engine, text

        engine = create_engine(settings.DATABASE_URL)

        with engine.connect() as conn:
            # Check if table exists
            result = conn.execute(
                text(
                    """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_schema = 'public'
                    AND table_name = 'notifications'
                )
            """
                )
            )

            if result.scalar():
                print("✅ notifications table already exists")
                return True

            print("🔄 Creating notifications table...")

            # Create notification types enum
            conn.execute(
                text(
                    """
                CREATE TYPE notificationtype AS ENUM (
                    'REPORT_READY', 'FILE_PROCESSED', 'ERROR_ALERT', 'SYSTEM_UPDATE',
                    'COLLABORATION_INVITE', 'DATA_QUALITY_ISSUE', 'SCHEDULED_REPORT',
                    'PARAMETER_CHANGE', 'CALCULATION_COMPLETE', 'DEADLINE_REMINDER',
                    'SECURITY_ALERT'
                )
            """
                )
            )

            # Create notification priority enum
            conn.execute(
                text(
                    """
                CREATE TYPE notificationpriority AS ENUM (
                    'LOW', 'NORMAL', 'HIGH', 'URGENT'
                )
            """
                )
            )

            # Create notification status enum
            conn.execute(
                text(
                    """
                CREATE TYPE notificationstatus AS ENUM (
                    'PENDING', 'SENT', 'DELIVERED', 'FAILED', 'READ', 'DISMISSED'
                )
            """
                )
            )

            # Create notifications table
            conn.execute(
                text(
                    """
                CREATE TABLE notifications (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id INTEGER NOT NULL REFERENCES users(id),
                    notification_type notificationtype NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    data JSON DEFAULT '{}',
                    priority notificationpriority DEFAULT 'NORMAL',
                    status notificationstatus DEFAULT 'PENDING',
                    is_read BOOLEAN DEFAULT FALSE,
                    is_dismissed BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    sent_at TIMESTAMP,
                    delivered_at TIMESTAMP,
                    read_at TIMESTAMP,
                    dismissed_at TIMESTAMP,
                    expires_at TIMESTAMP,
                    delivery_attempts INTEGER DEFAULT 0,
                    last_delivery_attempt TIMESTAMP,
                    delivery_error TEXT
                )
            """
                )
            )

            # Create notification preferences table
            conn.execute(
                text(
                    """
                CREATE TABLE notification_preferences (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
                    email_enabled BOOLEAN DEFAULT TRUE,
                    push_enabled BOOLEAN DEFAULT TRUE,
                    in_app_enabled BOOLEAN DEFAULT TRUE,
                    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
                    quiet_start_time VARCHAR(5),
                    quiet_end_time VARCHAR(5),
                    quiet_timezone VARCHAR(50) DEFAULT 'UTC',
                    type_preferences JSON DEFAULT '{}',
                    min_priority_email notificationpriority DEFAULT 'NORMAL',
                    min_priority_push notificationpriority DEFAULT 'HIGH',
                    min_priority_in_app notificationpriority DEFAULT 'LOW',
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
                )
            """
                )
            )

            # Create indexes
            conn.execute(
                text(
                    "CREATE INDEX ix_notifications_user_id " "ON notifications(user_id)"
                )
            )
            conn.execute(
                text(
                    "CREATE INDEX ix_notifications_notification_type "
                    "ON notifications(notification_type)"
                )
            )
            conn.execute(
                text(
                    "CREATE INDEX ix_notifications_priority "
                    "ON notifications(priority)"
                )
            )
            conn.execute(
                text("CREATE INDEX ix_notifications_status " "ON notifications(status)")
            )
            conn.execute(
                text(
                    "CREATE INDEX ix_notifications_is_read " "ON notifications(is_read)"
                )
            )
            conn.execute(
                text(
                    "CREATE INDEX ix_notifications_created_at "
                    "ON notifications(created_at)"
                )
            )
            conn.execute(
                text(
                    "CREATE INDEX ix_notifications_expires_at "
                    "ON notifications(expires_at)"
                )
            )

            conn.commit()
            print("✅ notifications table created successfully")
            return True

    except Exception as e:
        print(f"❌ Error creating notifications table: {e}")
        return False


def fix_database_schema():
    """Fix database schema issues by adding missing columns and fixing inconsistencies."""
    print("🔧 Fixing database schema issues...")

    try:
        from app.core.config import settings
        from sqlalchemy import create_engine, text

        engine = create_engine(settings.DATABASE_URL)

        with engine.connect() as conn:
            # Reset any aborted transactions first
            try:
                conn.execute(text("ROLLBACK"))
                print("✅ Reset any aborted transactions")
            except Exception:
                pass  # Ignore if no transaction to rollback
            # Fix uploaded_files table - add missing stored_filename column
            try:
                result = conn.execute(
                    text(
                        """
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name = 'uploaded_files' 
                        AND column_name = 'stored_filename'
                    """
                    )
                )

                if not result.fetchone():
                    print("🔄 Adding stored_filename column to uploaded_files...")
                    conn.execute(
                        text(
                            """
                        ALTER TABLE uploaded_files 
                        ADD COLUMN stored_filename VARCHAR(255)
                    """
                        )
                    )
                    conn.commit()
                    print("✅ Added stored_filename column to uploaded_files")
                else:
                    print("✅ stored_filename column already exists in uploaded_files")

            except Exception as e:
                print(f"⚠️ uploaded_files schema fix warning: {e}")

            # Fix notification schema issues
            try:
                result = conn.execute(
                    text(
                        """
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name = 'notifications' 
                        AND column_name = 'type'
                    """
                    )
                )

                if result.fetchone():
                    # Rename 'type' to 'notification_type'
                    conn.execute(
                        text(
                            """
                        DO $$
                        BEGIN
                            IF EXISTS (
                                SELECT 1 FROM information_schema.columns 
                                WHERE table_name = 'notifications' AND column_name = 'type'
                            ) THEN
                                ALTER TABLE notifications RENAME COLUMN type TO notification_type;
                            END IF;
                        END $$;
                    """
                        )
                    )
                    conn.commit()
                    print("✅ Renamed 'type' column to 'notification_type'")

            except Exception as e:
                print(f"⚠️ Notification schema fix warning: {e}")

            # Fix any other potential schema issues
            try:
                # Check for common missing columns and add them
                missing_columns = [
                    ("uploaded_files", "processing_started_at", "TIMESTAMP"),
                    ("uploaded_files", "processing_completed_at", "TIMESTAMP"),
                    ("uploaded_files", "is_valid", "BOOLEAN DEFAULT TRUE"),
                    ("uploaded_files", "validation_errors", "TEXT"),
                    ("uploaded_files", "parsed_data", "JSON"),
                ]

                for table, column, column_type in missing_columns:
                    result = conn.execute(
                        text(
                            f"""
                            SELECT column_name 
                            FROM information_schema.columns 
                            WHERE table_name = '{table}' 
                            AND column_name = '{column}'
                        """
                        )
                    )

                    if not result.fetchone():
                        print(f"🔄 Adding {column} column to {table}...")
                        conn.execute(
                            text(
                                f"ALTER TABLE {table} ADD COLUMN {column} {column_type}"
                            )
                        )
                        conn.commit()
                        print(f"✅ Added {column} column to {table}")

            except Exception as e:
                print(f"⚠️ Additional schema fixes warning: {e}")

            print("✅ Database schema fixes completed")
            return True

    except Exception as e:
        print(f"❌ Error fixing database schema: {e}")
        return False


def start_app():
    """Start the FastAPI application."""
    print("🚀 Starting FastAPI application...")

    try:
        import uvicorn

        from backend.main import app

        uvicorn.run(
            app,
            host="0.0.0.0",
            port=int(os.getenv("PORT", "8000")),
            log_level="info",
        )
    except Exception as e:
        print(f"❌ Error starting application: {e}")
        sys.exit(1)


def main():
    """Main startup function."""
    print("🚀 Starting FinVision API...")

    # Check database connection first
    if not check_database_connection():
        print("❌ Cannot connect to database, exiting")
        sys.exit(1)

    # Create notifications table if it doesn't exist
    create_notifications_table()

    # Ensure system logs and maintenance tables exist
    ensure_system_logs_and_maintenance()

    # Fix database schema issues
    fix_database_schema()

    # Run migrations
    if not run_migrations():
        print("⚠️ Migration failed, but continuing with startup...")
        print("⚠️ Database might already be in the correct state")

    # Start the application
    start_app()


if __name__ == "__main__":
    main()
