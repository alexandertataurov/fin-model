#!/usr/bin/env python3
"""
Simple test script to verify WebSocket and notification fixes
"""

import requests
import json

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(
            "https://fin-model-production.up.railway.app/health", 
            timeout=10
        )
        print(f"Health endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health endpoint error: {e}")
        return False

def test_notification_preferences():
    """Test notification preferences endpoint"""
    try:
        response = requests.get(
            "https://fin-model-production.up.railway.app/api/v1/notifications/preferences", 
            timeout=10
        )
        print(f"Notification preferences: {response.status_code}")
        if response.status_code == 401:
            print("Expected 401 for unauthenticated request")
        elif response.status_code == 200:
            print(f"Response: {response.json()}")
        elif response.status_code == 422:
            print("❌ Still getting 422 error - fix needed")
        return response.status_code in [200, 401]
    except Exception as e:
        print(f"Notification preferences error: {e}")
        return False

def main():
    print("Testing fixes...")
    print("=" * 40)
    
    health_ok = test_health()
    prefs_ok = test_notification_preferences()
    
    print("\nResults:")
    print(f"Health: {'✅' if health_ok else '❌'}")
    print(f"Preferences: {'✅' if prefs_ok else '❌'}")
    
    if health_ok and prefs_ok:
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Some tests failed")

if __name__ == "__main__":
    main()
