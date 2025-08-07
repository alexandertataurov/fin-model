#!/usr/bin/env python3
"""
Script to run database migrations on Railway deployment
"""

import os
import sys
import subprocess
from pathlib import Path

def run_migrations():
    """Run Alembic migrations."""
    print("Running database migrations...")
    
    try:
        # Run alembic upgrade head
        result = subprocess.run([
            sys.executable, "-m", "alembic", "upgrade", "head"
        ], capture_output=True, text=True, cwd=Path(__file__).parent)
        
        if result.returncode == 0:
            print("✅ Migrations completed successfully")
            print(result.stdout)
        else:
            print("❌ Migration failed:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error running migrations: {e}")
        return False
    
    return True

def check_database_connection():
    """Check if database is accessible."""
    print("Checking database connection...")
    
    try:
        from app.core.config import settings
        from sqlalchemy import create_engine, text
        
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def main():
    """Main function."""
    print("🚀 Starting deployment process...")
    
    # Check database connection
    if not check_database_connection():
        print("❌ Cannot connect to database, exiting")
        sys.exit(1)
    
    # Run migrations
    if not run_migrations():
        print("❌ Migration failed, exiting")
        sys.exit(1)
    
    print("✅ Deployment completed successfully!")

if __name__ == "__main__":
    main()
