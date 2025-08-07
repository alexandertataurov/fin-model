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
        from sqlalchemy import create_engine
        
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            conn.execute("SELECT 1")
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
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
        print("❌ Migration failed, exiting")
        sys.exit(1)
    
    # Start the application
    start_app()


if __name__ == "__main__":
    main()
