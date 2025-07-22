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