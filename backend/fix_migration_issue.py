#!/usr/bin/env python3
"""
Script to fix migration issues by marking problematic migrations as completed.
This is useful when tables already exist but migrations are failing.
"""

import os
import sys
from sqlalchemy import create_engine, text


def get_database_url():
    """Get database URL from environment or config"""
    # Try environment variables first
    db_url = os.getenv('DATABASE_URL')
    if db_url:
        return db_url
    
    # Try to read from config file
    try:
        from app.core.config import settings
        return settings.DATABASE_URL
    except ImportError:
        print("Error: Could not determine database URL")
        sys.exit(1)

def mark_migration_completed(migration_id):
    """Mark a migration as completed in the alembic_version table"""
    db_url = get_database_url()
    engine = create_engine(db_url)
    
    with engine.connect() as conn:
        # Check if alembic_version table exists
        result = conn.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'alembic_version'
            );
        """))
        
        if not result.scalar():
            print("Creating alembic_version table...")
            conn.execute(text("""
                CREATE TABLE alembic_version (
                    version_num VARCHAR(32) NOT NULL,
                    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
                );
            """))
            conn.commit()
        
        # Check if migration is already marked as completed
        result = conn.execute(text("""
            SELECT version_num FROM alembic_version WHERE version_num = :migration_id;
        """), {"migration_id": migration_id})
        
        if result.fetchone():
            print(f"Migration {migration_id} is already marked as completed.")
            return
        
        # Mark migration as completed
        conn.execute(text("""
            INSERT INTO alembic_version (version_num) VALUES (:migration_id);
        """), {"migration_id": migration_id})
        conn.commit()
        print(f"Successfully marked migration {migration_id} as completed.")

def main():
    """Main function to fix migration issues"""
    if len(sys.argv) != 2:
        print("Usage: python fix_migration_issue.py <migration_id>")
        print("Example: python fix_migration_issue.py cc29f0d3d343")
        sys.exit(1)
    
    migration_id = sys.argv[1]
    print(f"Fixing migration issue for: {migration_id}")
    
    try:
        mark_migration_completed(migration_id)
        print("Migration issue fixed successfully!")
    except Exception as e:
        print(f"Error fixing migration: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 