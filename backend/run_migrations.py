#!/usr/bin/env python3
"""
Database migration script for Railway deployment
"""

import sys
import os
from alembic.config import Config
from alembic import command


def run_migrations():
    """Run database migrations using Alembic"""
    try:
        # Get the directory where this script is located (backend directory)
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Ensure we're in the backend directory
        os.chdir(script_dir)
        print(f"Changed working directory to: {script_dir}")

        # Create Alembic configuration
        alembic_ini_path = os.path.join(script_dir, "alembic.ini")
        print(f"Using alembic.ini at: {alembic_ini_path}")
        
        if not os.path.exists(alembic_ini_path):
            raise FileNotFoundError(f"alembic.ini not found at {alembic_ini_path}")
            
        alembic_cfg = Config(alembic_ini_path)
        
        # Verify alembic directory exists
        alembic_dir = os.path.join(script_dir, "alembic")
        print(f"Checking alembic directory at: {alembic_dir}")
        
        if not os.path.exists(alembic_dir):
            raise FileNotFoundError(f"Alembic directory not found at {alembic_dir}")

        # Run the upgrade command
        print("Running database migrations...")
        command.upgrade(alembic_cfg, "head")
        print("Database migrations completed successfully!")

    except Exception as e:
        print(f"Error running migrations: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    run_migrations()
