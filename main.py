#!/usr/bin/env python3
"""
Railway entry point for FinVision Backend
"""

import sys
import os

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Change working directory to backend
os.chdir(backend_path)

try:
    # Auto-fix database schema if needed
    auto_fix_enabled = os.environ.get("AUTO_FIX_DATABASE", "true").lower() == "true"
    if auto_fix_enabled:
        print("🔧 Auto-fix database enabled, checking schema...")
        try:
            # Add parent directory to path for auto_fix_database import
            parent_dir = os.path.dirname(os.path.dirname(__file__))
            sys.path.insert(0, parent_dir)
            from auto_fix_database import run_auto_fix
            if not run_auto_fix():
                print("⚠️ Database auto-fix failed, but continuing startup...")
        except Exception as fix_error:
            print(f"⚠️ Database auto-fix error: {fix_error}")
            print("Continuing with startup anyway...")
    
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