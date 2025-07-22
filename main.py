#!/usr/bin/env python3
"""
Railway entry point for FinVision Backend

This file exists in the root directory to help Railway detect this as a Python project.
The actual FastAPI application is in the backend/ directory.
"""

import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import and expose the FastAPI app
from backend.main import app

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 