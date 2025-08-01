#!/usr/bin/env python3
"""
Railway entry point for FinVision Backend
"""

import sys
import os

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), "backend")
sys.path.insert(0, backend_path)

# Change working directory to backend
os.chdir(backend_path)

try:
    # Auto-fix database schema if needed
    auto_fix_enabled = os.environ.get("AUTO_FIX_DATABASE", "true").lower() == "true"
    if auto_fix_enabled:
        print("🔧 Auto-fix database enabled, checking schema...")
        try:
            # Try simple fix first
            parent_dir = os.path.dirname(os.path.dirname(__file__))
            sys.path.insert(0, parent_dir)

            # Import and run simple fix
            from simple_fix import simple_database_fix

            if simple_database_fix():
                print("✅ Database auto-fix completed successfully!")
            else:
                print("⚠️ Database auto-fix failed, but continuing startup...")

        except Exception as fix_error:
            print(f"⚠️ Database auto-fix error: {fix_error}")
            import traceback

            traceback.print_exc()
            print("Continuing with startup anyway...")

    # Automatically run Alembic migrations unless disabled
    auto_migrate = os.environ.get("AUTO_MIGRATE_DATABASE", "true").lower() == "true"
    if auto_migrate:
        try:
            from run_migrations import run_migrations

            print("🚀 Running database migrations...")
            run_migrations()
            print("✅ Database migrations completed!")
        except Exception as migrate_error:
            print(f"⚠️ Migration error: {migrate_error}")
            import traceback

            traceback.print_exc()
            print("Continuing with startup despite migration errors...")

    # Import the FastAPI app
    from main import app

    if __name__ == "__main__":
        import uvicorn

        port = int(os.environ.get("PORT", 8000))
        print(f"Starting FinVision API on port {port}")
        uvicorn.run(app, host="0.0.0.0", port=port)

except Exception as e:
    print(f"Failed to start application: {e}")
    import traceback

    traceback.print_exc()
    sys.exit(1)
