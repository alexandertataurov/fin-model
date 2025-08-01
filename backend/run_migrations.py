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
        # Get the directory where this script is located
        script_dir = os.path.dirname(os.path.abspath(__file__))

        # Create Alembic configuration
        alembic_cfg = Config(os.path.join(script_dir, "alembic.ini"))

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
