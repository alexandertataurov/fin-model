#!/usr/bin/env python3
"""
Fix migration state by marking migrations as complete if tables exist
"""

import os
from pathlib import Path
from alembic import command
from alembic.config import Config

def check_table_exists(table_name):
    """Check if a table exists in the database."""
    try:
        from app.core.config import settings
        from sqlalchemy import create_engine, text
        
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text(f"""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = '{table_name}'
                )
            """))
            return result.scalar()
    except Exception as e:
        print(f"❌ Error checking table {table_name}: {e}")
        return False

def fix_migration_state():
    """Fix migration state by marking migrations as complete if tables exist."""
    print("🔧 Fixing migration state...")
    
    try:
        current_dir = Path(__file__).parent
        alembic_cfg = Config(os.path.join(current_dir, "alembic.ini"))
        alembic_cfg.set_main_option("script_location", os.path.join(current_dir, "alembic"))
        
        # Check current revision
        print("📋 Current revision:")
        command.current(alembic_cfg)
        
        # Check if monte_carlo_simulations table exists
        if check_table_exists("monte_carlo_simulations"):
            print("✅ monte_carlo_simulations table exists")
            print("🔄 Marking migration e55cf976aaaa as complete...")
            command.stamp(alembic_cfg, "e55cf976aaaa")
            print("✅ Migration e55cf976aaaa marked as complete")
        
        # Check if notifications table exists
        if check_table_exists("notifications"):
            print("✅ notifications table exists")
            print("🔄 Marking migration cb40847ce093 as complete...")
            command.stamp(alembic_cfg, "cb40847ce093")
            print("✅ Migration cb40847ce093 marked as complete")
        
        # Check if advanced reporting tables exist
        if check_table_exists("report_templates"):
            print("✅ report_templates table exists")
            print("🔄 Marking migration cc29f0d3d343 as complete...")
            command.stamp(alembic_cfg, "cc29f0d3d343")
            print("✅ Migration cc29f0d3d343 marked as complete")
        
        print("\n📋 Final migration status:")
        command.current(alembic_cfg)
        
        return True
    except Exception as e:
        print(f"❌ Error fixing migration state: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Migration State Fix...")
    fix_migration_state()
    print("✅ Migration state fix complete")
