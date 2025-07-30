#!/usr/bin/env python3
"""
Auto-fix database schema on startup
This will be called from main.py to fix the database schema automatically
"""

import os
import sys

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)
os.chdir(backend_path)

def auto_fix_database():
    """Automatically fix database schema issues"""
    try:
        print("🔄 Auto-fixing database schema...")
        
        from app.models.base import SessionLocal, engine
        from sqlalchemy import text, inspect
        
        # Create a database session
        db = SessionLocal()
        inspector = inspect(engine)
        
        # Check if users table exists
        if 'users' not in inspector.get_table_names():
            print("❌ Users table doesn't exist. Need to run full migrations.")
            db.close()
            return False
        
        # Get current columns in users table
        columns = [col['name'] for col in inspector.get_columns('users')]
        print(f"Current users table columns: {sorted(columns)}")
        
        # Check and add missing columns
        fixes_applied = []
        
        # Add full_name column if missing
        if 'full_name' not in columns:
            print("Adding full_name column...")
            db.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR(100) NOT NULL DEFAULT ''"))
            
            # Populate full_name from existing data
            db.execute(text("""
                UPDATE users 
                SET full_name = TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))
                WHERE full_name = '' OR full_name IS NULL
            """))
            fixes_applied.append("full_name")
        
        # Add is_admin column if missing
        if 'is_admin' not in columns:
            print("Adding is_admin column...")
            db.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE"))
            fixes_applied.append("is_admin")
        
        # Make first_name and last_name nullable if they aren't
        try:
            # Check if columns are nullable
            first_name_col = next((col for col in inspector.get_columns('users') if col['name'] == 'first_name'), None)
            last_name_col = next((col for col in inspector.get_columns('users') if col['name'] == 'last_name'), None)
            
            if first_name_col and not first_name_col.get('nullable', True):
                db.execute(text("ALTER TABLE users ALTER COLUMN first_name DROP NOT NULL"))
                fixes_applied.append("first_name nullable")
            
            if last_name_col and not last_name_col.get('nullable', True):
                db.execute(text("ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL"))
                fixes_applied.append("last_name nullable")
                
        except Exception as e:
            print(f"Note: Could not modify column constraints: {e}")
        
        # Commit all changes
        if fixes_applied:
            db.commit()
            print(f"✅ Applied fixes: {fixes_applied}")
        else:
            print("✅ No fixes needed - schema is correct")
        
        db.close()
        
        # Test that we can now query users
        print("🔄 Testing user query...")
        db = SessionLocal()
        from app.models.user import User
        
        # This should not fail now
        test_user = db.query(User).first()
        print(f"✅ User query successful! Found {db.query(User).count()} users")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Auto-fix failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def ensure_roles_exist():
    """Ensure default roles exist in the database"""
    try:
        print("🔄 Checking roles...")
        
        from app.models.base import SessionLocal
        from app.models.role import Role, RoleType
        
        db = SessionLocal()
        
        # Check if roles exist
        role_count = db.query(Role).count()
        if role_count > 0:
            print(f"✅ Found {role_count} roles")
            db.close()
            return True
        
        print("Creating default roles...")
        
        # Create default roles
        roles_to_create = [
            Role(
                name=RoleType.ADMIN, 
                display_name="Administrator", 
                description="Full system access", 
                is_active=True
            ),
            Role(
                name=RoleType.ANALYST, 
                display_name="Financial Analyst", 
                description="Financial analysis access", 
                is_active=True
            ),
            Role(
                name=RoleType.VIEWER, 
                display_name="Viewer", 
                description="Read-only access", 
                is_active=True
            ),
        ]
        
        for role in roles_to_create:
            db.add(role)
        
        db.commit()
        print("✅ Created default roles")
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Role creation failed: {e}")
        return False

def run_auto_fix():
    """Main auto-fix function"""
    print("🚀 Starting automatic database fix...")
    
    # Fix database schema
    if not auto_fix_database():
        print("❌ Database auto-fix failed")
        return False
    
    # Ensure roles exist
    if not ensure_roles_exist():
        print("❌ Role creation failed")
        return False
    
    print("🎉 Database auto-fix completed successfully!")
    return True

if __name__ == "__main__":
    success = run_auto_fix()
    sys.exit(0 if success else 1)