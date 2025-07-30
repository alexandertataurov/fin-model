#!/usr/bin/env python3
"""
Simple database fix that can be run manually
"""

import os
import sys

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)
os.chdir(backend_path)

def simple_database_fix():
    """Simple database fix using raw SQL"""
    try:
        print("🔄 Running simple database fix...")
        
        # Import database connection
        from app.core.config import settings
        import psycopg2
        
        # Connect directly to database
        conn = psycopg2.connect(settings.DATABASE_URL)
        cur = conn.cursor()
        
        print("✅ Connected to database")
        
        # Check current schema
        cur.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY column_name
        """)
        
        columns = [row[0] for row in cur.fetchall()]
        print(f"Current columns: {sorted(columns)}")
        
        # Add missing columns
        if 'full_name' not in columns:
            print("Adding full_name column...")
            cur.execute("ALTER TABLE users ADD COLUMN full_name VARCHAR(100) NOT NULL DEFAULT ''")
            
            # Populate full_name
            cur.execute("""
                UPDATE users 
                SET full_name = TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))
                WHERE full_name = '' OR full_name IS NULL
            """)
            print("✅ Added and populated full_name column")
        
        if 'is_admin' not in columns:
            print("Adding is_admin column...")
            cur.execute("ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE")
            print("✅ Added is_admin column")
        
        # Make first_name and last_name nullable
        try:
            cur.execute("ALTER TABLE users ALTER COLUMN first_name DROP NOT NULL")
            cur.execute("ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL")
            print("✅ Made name columns nullable")
        except Exception as e:
            print(f"Note: Could not modify constraints: {e}")
        
        # Commit changes
        conn.commit()
        
        # Verify the fix
        cur.execute("SELECT COUNT(*) FROM users")
        user_count = cur.fetchone()[0]
        print(f"✅ Database fix complete. Found {user_count} users.")
        
        cur.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Database fix failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = simple_database_fix()
    if success:
        print("🎉 Simple database fix completed!")
    else:
        print("❌ Simple database fix failed!")
    sys.exit(0 if success else 1)