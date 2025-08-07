#!/usr/bin/env python3
"""
Railway entry point for FinVision Backend

Simplified startup that avoids any database operations during initialization
to ensure fast Railway deployments.
"""

import sys
import os

print("🚀 Starting FinVision API...")

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), "backend")
sys.path.insert(0, backend_path)

try:
    # Import the FastAPI app immediately without any blocking operations
    from app.main import app

    if __name__ == "__main__":
        import uvicorn

        port = int(os.environ.get("PORT", 8000))
        print(f"🌐 Starting server on port {port}")
        uvicorn.run(
            app, 
            host="0.0.0.0", 
            port=port,
            timeout_graceful_shutdown=30,
            timeout_keep_alive=30
        )

except Exception as e:
    print(f"❌ Failed to start application: {e}")
    import traceback

    traceback.print_exc()
    sys.exit(1)
