#!/usr/bin/env python3
"""
Check database state and migration status
"""

import os
import sys
from pathlib import Path
from alembic import command
from alembic.config import Config

def check_database_tables():
    """Check what tables exist in the database."""
    print("🔍 Checking database tables...")
    
    try:
        from app.core.config import settings
        from sqlalchemy import create_engine, text
        
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result]
            
            print(f"📋 Found {len(tables)} tables:")
            for table in tables:
                print(f"   - {table}")
            
            return tables
    except Exception as e:
        print(f"❌ Error checking database tables: {e}")
        return []

def check_migration_status():
    """Check current migration status."""
    print("\n🔍 Checking migration status...")
    
    try:
        current_dir = Path(__file__).parent
        alembic_cfg = Config(os.path.join(current_dir, "alembic.ini"))
        alembic_cfg.set_main_option("script_location", os.path.join(current_dir, "alembic"))
        
        print("📋 Current database revision:")
        command.current(alembic_cfg)
        
        return True
    except Exception as e:
        print(f"❌ Error checking migration status: {e}")
        return False

def main():
    """Main function."""
    print("🚀 Database State Check...")
    
    tables = check_database_tables()
    check_migration_status()
    
    # Check for specific tables that might cause issues
    problematic_tables = ['monte_carlo_simulations', 'scenario_parameters', 'notifications']
    existing_problematic = [t for t in problematic_tables if t in tables]
    
    if existing_problematic:
        print(f"\n⚠️ Found potentially problematic tables: {existing_problematic}")
        print("These tables exist but might not be tracked by Alembic")
    
    print("\n✅ Database state check complete")

if __name__ == "__main__":
    main()
