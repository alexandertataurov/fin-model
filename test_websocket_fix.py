#!/usr/bin/env python3
"""
Test script to verify WebSocket connection and notification preferences fixes
"""

import asyncio
import websockets
import json
import requests
import sys

# Configuration
BASE_URL = "https://fin-model-production.up.railway.app"
WS_URL = "wss://fin-model-production.up.railway.app"

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        print(f"✅ Health endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"   Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health endpoint failed: {e}")
        return False

def test_notification_preferences():
    """Test notification preferences endpoint"""
    try:
        # Test without authentication (should return 401 or handle gracefully)
        response = requests.get(f"{BASE_URL}/api/v1/notifications/preferences", timeout=10)
        print(f"✅ Notification preferences endpoint: {response.status_code}")
        if response.status_code == 401:
            print("   Expected 401 for unauthenticated request")
        elif response.status_code == 200:
            print(f"   Response: {response.json()}")
        return response.status_code in [200, 401]
    except Exception as e:
        print(f"❌ Notification preferences failed: {e}")
        return False

async def test_websocket_health():
    """Test WebSocket health endpoint"""
    try:
        uri = f"{WS_URL}/ws/health"
        print(f"Testing WebSocket health: {uri}")
        
        async with websockets.connect(uri) as websocket:
            # Send a test message
            await websocket.send(json.dumps({"type": "ping", "timestamp": "test"}))
            
            # Wait for response
            response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            data = json.loads(response)
            
            print(f"✅ WebSocket health: {data}")
            return True
            
    except Exception as e:
        print(f"❌ WebSocket health failed: {e}")
        return False

async def test_websocket_notifications():
    """Test WebSocket notifications endpoint (without auth)"""
    try:
        uri = f"{WS_URL}/ws/notifications"
        print(f"Testing WebSocket notifications: {uri}")
        
        async with websockets.connect(uri) as websocket:
            # Should receive authentication error
            response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            print(f"✅ WebSocket notifications: {response}")
            return True
            
    except websockets.exceptions.ConnectionClosed as e:
        if e.code == 4001:
            print("✅ WebSocket notifications: Expected authentication error (4001)")
            return True
        else:
            print(f"❌ WebSocket notifications failed: {e}")
            return False
    except Exception as e:
        print(f"❌ WebSocket notifications failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("🔍 Testing WebSocket and Notification Fixes")
    print("=" * 50)
    
    # Test HTTP endpoints
    print("\n📡 Testing HTTP Endpoints:")
    health_ok = test_health_endpoint()
    prefs_ok = test_notification_preferences()
    
    # Test WebSocket endpoints
    print("\n🔌 Testing WebSocket Endpoints:")
    ws_health_ok = await test_websocket_health()
    ws_notif_ok = await test_websocket_notifications()
    
    # Summary
    print("\n📊 Test Summary:")
    print(f"Health endpoint: {'✅' if health_ok else '❌'}")
    print(f"Notification preferences: {'✅' if prefs_ok else '❌'}")
    print(f"WebSocket health: {'✅' if ws_health_ok else '❌'}")
    print(f"WebSocket notifications: {'✅' if ws_notif_ok else '❌'}")
    
    all_passed = health_ok and prefs_ok and ws_health_ok and ws_notif_ok
    print(f"\nOverall: {'✅ All tests passed' if all_passed else '❌ Some tests failed'}")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
