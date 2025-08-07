#!/usr/bin/env python3
"""
Simple migration script for Railway deployment
"""

import os
import sys
from alembic import command
from alembic.config import Config

def main():
    print("🚀 Running migrations on Railway...")
    
    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Create Alembic configuration
    alembic_cfg = Config(os.path.join(current_dir, "alembic.ini"))
    alembic_cfg.set_main_option("script_location", os.path.join(current_dir, "alembic"))
    
    try:
        # Run the migration
        command.upgrade(alembic_cfg, "head")
        print("✅ Migrations completed successfully!")
        return 0
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
