#!/usr/bin/env python3
"""
Quick fix script for the database schema issue
This can be run manually to add missing columns to the users table
"""

import sys
import os

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)
os.chdir(backend_path)

def fix_user_table():
    """Add missing columns to users table"""
    try:
        print("🔄 Fixing user table schema...")
        
        from app.models.base import SessionLocal
        from sqlalchemy import text
        
        db = SessionLocal()
        
        # Check if full_name column exists
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'full_name'
        """))
        
        if not result.fetchone():
            print("Adding full_name column...")
            db.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR(100) NOT NULL DEFAULT ''"))
            
            # Populate full_name from existing first_name and last_name
            db.execute(text("""
                UPDATE users 
                SET full_name = COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')
                WHERE full_name = ''
            """))
            
            print("✅ Added full_name column")
        else:
            print("✅ full_name column already exists")
        
        # Check if is_admin column exists
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'is_admin'
        """))
        
        if not result.fetchone():
            print("Adding is_admin column...")
            db.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE"))
            print("✅ Added is_admin column")
        else:
            print("✅ is_admin column already exists")
        
        # Make first_name and last_name nullable if they aren't already
        try:
            db.execute(text("ALTER TABLE users ALTER COLUMN first_name DROP NOT NULL"))
            db.execute(text("ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL"))
            print("✅ Made first_name and last_name nullable")
        except Exception as e:
            print(f"Note: Could not make columns nullable (they might already be): {e}")
        
        db.commit()
        db.close()
        
        print("🎉 User table schema fixed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Failed to fix user table: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_login_query():
    """Test that we can now query users without errors"""
    try:
        print("🔄 Testing user query...")
        
        from app.models.base import SessionLocal
        from app.models.user import User
        
        db = SessionLocal()
        
        # Try to query a user (this was failing before)
        user = db.query(User).filter(User.email == 'test@example.com').first()
        
        print("✅ User query successful!")
        print(f"Found user: {user is not None}")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ User query still failing: {e}")
        return False

def main():
    """Main function"""
    print("🚀 Starting database fix...")
    
    if not fix_user_table():
        print("❌ Failed to fix database")
        sys.exit(1)
    
    if not test_login_query():
        print("❌ Login query still not working")
        sys.exit(1)
    
    print("🎉 Database fix completed successfully!")
    print("✅ Login should now work!")

if __name__ == "__main__":
    main()