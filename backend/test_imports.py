#!/usr/bin/env python3
"""Test script to check imports and identify issues."""

import sys
import traceback

def test_import(module_name):
    """Test importing a module and return success status."""
    try:
        __import__(module_name)
        print(f"✓ {module_name} imported successfully")
        return True
    except Exception as e:
        print(f"✗ {module_name} failed to import: {e}")
        traceback.print_exc()
        return False

def main():
    """Test all critical imports."""
    print("Testing imports...")
    
    # Test basic Python modules
    test_import("fastapi")
    test_import("uvicorn")
    test_import("sqlalchemy")
    
    # Test app modules
    test_import("app.core.config")
    test_import("app.models.base")
    test_import("app.models.user")
    test_import("app.models.role")
    test_import("app.core.dependencies")
    test_import("app.api.v1.api")
    
    # Test main app
    test_import("app.main")
    
    print("\nImport test completed.")

if __name__ == "__main__":
    main()
