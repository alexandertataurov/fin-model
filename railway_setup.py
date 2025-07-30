#!/usr/bin/env python3
"""
Railway setup script to run migrations and create initial data
"""

import sys
import os
import subprocess

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

def run_migrations():
    """Run database migrations using alembic"""
    try:
        print("🔄 Running database migrations...")
        
        # Change to backend directory
        original_dir = os.getcwd()
        os.chdir(backend_path)
        
        # Run alembic upgrade
        result = subprocess.run(['alembic', 'upgrade', 'head'], 
                              capture_output=True, text=True, check=False)
        
        # Change back to original directory
        os.chdir(original_dir)
        
        if result.returncode == 0:
            print("✅ Database migrations completed successfully!")
            if result.stdout:
                print(f"Migration output: {result.stdout}")
            return True
        else:
            print(f"❌ Migration failed with return code {result.returncode}")
            if result.stderr:
                print(f"Error output: {result.stderr}")
            if result.stdout:
                print(f"Standard output: {result.stdout}")
            return False
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_database_connection():
    """Test database connection"""
    try:
        print("🔄 Testing database connection...")
        os.chdir(backend_path)
        
        from app.models.base import SessionLocal
        
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        print("✅ Database connection successful!")
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def create_initial_roles():
    """Create initial roles in the database"""
    try:
        print("🔄 Creating initial roles...")
        os.chdir(backend_path)
        
        from app.models.base import SessionLocal
        from app.models.role import Role, RoleType
        
        db = SessionLocal()
        
        # Check if roles already exist
        existing_roles = db.query(Role).count()
        if existing_roles > 0:
            print("✅ Roles already exist, skipping creation")
            db.close()
            return True
        
        # Create default roles
        roles_to_create = [
            Role(name=RoleType.ADMIN, display_name="Administrator", description="Full system access", is_active=True),
            Role(name=RoleType.ANALYST, display_name="Financial Analyst", description="Financial analysis access", is_active=True),
            Role(name=RoleType.VIEWER, display_name="Viewer", description="Read-only access", is_active=True),
        ]
        
        for role in roles_to_create:
            db.add(role)
        
        db.commit()
        print("✅ Initial roles created successfully!")
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Failed to create roles: {e}")
        import traceback
        traceback.print_exc()
        return False

def verify_user_table():
    """Verify that the user table has all required columns"""
    try:
        print("🔄 Verifying user table schema...")
        os.chdir(backend_path)
        
        from app.models.base import SessionLocal
        
        db = SessionLocal()
        
        # Try to query a user with all expected columns
        result = db.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY column_name
        """)
        
        columns = [row[0] for row in result.fetchall()]
        required_columns = [
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'hashed_password', 'is_admin', 'is_active', 'is_verified',
            'verification_token', 'password_reset_token', 'password_reset_expires',
            'last_login', 'failed_login_attempts', 'account_locked_until',
            'created_at', 'updated_at'
        ]
        
        missing_columns = [col for col in required_columns if col not in columns]
        
        if missing_columns:
            print(f"❌ Missing columns in users table: {missing_columns}")
            db.close()
            return False
        
        print("✅ User table schema is correct!")
        print(f"Found columns: {sorted(columns)}")
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Failed to verify user table: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main setup function"""
    print("🚀 Starting Railway setup...")
    
    # Test database connection first
    if not test_database_connection():
        print("❌ Setup failed: Cannot connect to database")
        sys.exit(1)
    
    # Run migrations
    if not run_migrations():
        print("❌ Setup failed: Migration error")
        sys.exit(1)
    
    # Verify user table schema
    if not verify_user_table():
        print("❌ Setup failed: User table schema verification failed")
        sys.exit(1)
    
    # Create initial roles
    if not create_initial_roles():
        print("❌ Setup failed: Role creation error")
        sys.exit(1)
    
    print("🎉 Railway setup completed successfully!")
    print("✅ Database is ready for the application")

if __name__ == "__main__":
    main()