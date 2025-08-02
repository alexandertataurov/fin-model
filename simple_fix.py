#!/usr/bin/env python3
"""
Database auto-fix utility for Railway deployment
"""

import os
import sys
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.exc import SQLAlchemyError


def simple_database_fix():
    """
    Simple database fixes for Railway deployment issues
    Returns True if fixes were successful, False otherwise
    """
    try:
        # Add backend to path
        backend_path = os.path.join(os.path.dirname(__file__), "backend")
        if backend_path not in sys.path:
            sys.path.insert(0, backend_path)
        
        # Import settings after path is set
        from app.core.config import settings
        
        # Create engine
        engine = create_engine(settings.DATABASE_URL, echo=False)
        
        with engine.connect() as conn:
            # Check if we can connect
            conn.execute(text("SELECT 1"))
            print("✅ Database connection successful")
            
            # Get inspector to check existing objects
            inspector = inspect(engine)
            existing_tables = inspector.get_table_names()
            
            # Check for common migration issues
            fixes_applied = []
            
            # Fix 1: Ensure alembic_version table exists
            if 'alembic_version' not in existing_tables:
                print("🔧 Creating alembic_version table...")
                conn.execute(text("""
                    CREATE TABLE alembic_version (
                        version_num VARCHAR(32) NOT NULL,
                        CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
                    )
                """))
                conn.commit()
                fixes_applied.append("alembic_version table created")
            
            # Fix 2: Remove duplicate indexes if they exist
            try:
                # Get all indexes
                all_indexes = []
                for table_name in existing_tables:
                    try:
                        indexes = inspector.get_indexes(table_name)
                        for idx in indexes:
                            all_indexes.append((table_name, idx['name']))
                    except Exception:
                        continue
                
                # Common problematic indexes from migrations
                problematic_indexes = [
                    ('rate_limits', 'ix_rate_limits_key'),
                    ('rate_limits', 'ix_rate_limits_window_start'),
                    ('parameters', 'ix_parameters_type_category'),
                    ('financial_statements', 'ix_statements_scenario_period'),
                ]
                
                for table_name, index_name in problematic_indexes:
                    if table_name in existing_tables:
                        try:
                            # Check if index exists and drop it if needed
                            conn.execute(text(f"DROP INDEX IF EXISTS {index_name}"))
                            fixes_applied.append(f"Dropped problematic index: {index_name}")
                        except Exception:
                            pass
                
                if fixes_applied:
                    conn.commit()
                    
            except Exception as e:
                print(f"⚠️ Index cleanup warning: {e}")
            
            if fixes_applied:
                print(f"✅ Applied {len(fixes_applied)} database fixes:")
                for fix in fixes_applied:
                    print(f"  - {fix}")
                return True
            else:
                print("ℹ️ No database fixes needed")
                return True
                
    except SQLAlchemyError as e:
        print(f"❌ Database error during auto-fix: {e}")
        return False
    except Exception as e:
        print(f"❌ General error during auto-fix: {e}")
        return False


if __name__ == "__main__":
    success = simple_database_fix()
    sys.exit(0 if success else 1)