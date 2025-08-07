#!/usr/bin/env python3
"""
Startup script for Railway deployment
Runs migrations and starts the application
"""

import os
import sys
import subprocess
from pathlib import Path

def run_migrations():
    """Run database migrations."""
    print("🔄 Running database migrations...")
    
    try:
        # Run alembic upgrade head
        result = subprocess.run([
            sys.executable, "-m", "alembic", "upgrade", "head"
        ], capture_output=True, text=True, cwd=Path(__file__).parent)
        
        if result.returncode == 0:
            print("✅ Migrations completed successfully")
            return True
        else:
            print(f"❌ Migration failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Error running migrations: {e}")
        return False

def start_app():
    """Start the FastAPI application."""
    print("🚀 Starting FastAPI application...")
    
    try:
        # Import and run the app
        from main import app
        import uvicorn
        
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=int(os.getenv("PORT", "8000")),
            log_level="info"
        )
    except Exception as e:
        print(f"❌ Error starting application: {e}")
        sys.exit(1)

def main():
    """Main startup function."""
    print("🚀 Starting FinVision API...")
    
    # Run migrations first
    if not run_migrations():
        print("⚠️ Migration failed, but continuing with startup...")
    
    # Start the application
    start_app()

if __name__ == "__main__":
    main()
