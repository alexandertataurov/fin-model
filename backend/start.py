#!/usr/bin/env python3
"""
Startup script for Railway deployment
Runs migrations and starts the application
"""

import os
import sys
from pathlib import Path
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
    """Fix migration state by marking migrations as complete if tables exist."""
    print("🔧 Checking migration state...")
    
    try:
        from app.core.config import settings
        from sqlalchemy import create_engine, text
        from alembic import command
        from alembic.config import Config
        
        engine = create_engine(settings.DATABASE_URL)
        current_dir = Path(__file__).parent
        alembic_cfg = Config(os.path.join(current_dir, "alembic.ini"))
        alembic_cfg.set_main_option("script_location", os.path.join(current_dir, "alembic"))
        
        with engine.connect() as conn:
            # Check if monte_carlo_simulations table exists
            result = conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'monte_carlo_simulations'
                )
            """))
            if result.scalar():
                print("✅ monte_carlo_simulations table exists")
                print("🔄 Marking migration e55cf976aaaa as complete...")
                command.stamp(alembic_cfg, "e55cf976aaaa")
                print("✅ Migration e55cf976aaaa marked as complete")
            
            # Check if notifications table exists
            result = conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'notifications'
                )
            """))
            if result.scalar():
                print("✅ notifications table exists")
                print("🔄 Marking migration cb40847ce093 as complete...")
                command.stamp(alembic_cfg, "cb40847ce093")
                print("✅ Migration cb40847ce093 marked as complete")
            
            # Check if report_templates table exists
            result = conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'report_templates'
                )
            """))
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
        alembic_cfg.set_main_option("script_location", os.path.join(current_dir, "alembic"))
        
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


def start_app():
    """Start the FastAPI application."""
    print("🚀 Starting FastAPI application...")
    
    try:
        from main import app
        import uvicorn
        
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=int(os.getenv("PORT", "8000")),
            log_level="info"
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
    
    # Run migrations
    if not run_migrations():
        print("⚠️ Migration failed, but continuing with startup...")
        print("⚠️ Database might already be in the correct state")
    
    # Start the application
    start_app()


if __name__ == "__main__":
    main()
