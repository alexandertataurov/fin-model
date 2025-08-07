#!/usr/bin/env python3
"""
Test WebSocket connectivity to the deployed application
"""

import asyncio
import websockets
import json
import sys

async def test_websocket_health():
    """Test the health check WebSocket endpoint."""
    print("Testing WebSocket health check...")
    
    try:
        uri = "wss://fin-model-production.up.railway.app/ws/health"
        async with websockets.connect(uri) as websocket:
            print("✅ Health check WebSocket connected successfully")
            
            # Send a ping message
            ping_message = json.dumps({
                "type": "ping",
                "timestamp": "2024-01-01T00:00:00Z"
            })
            await websocket.send(ping_message)
            
            # Wait for response
            response = await websocket.recv()
            data = json.loads(response)
            print(f"✅ Received response: {data}")
            
    except Exception as e:
        print(f"❌ Health check WebSocket failed: {e}")
        return False
    
    return True

async def test_websocket_notifications_no_auth():
    """Test notifications WebSocket without authentication."""
    print("\nTesting notifications WebSocket without authentication...")
    
    try:
        uri = "wss://fin-model-production.up.railway.app/ws/notifications"
        async with websockets.connect(uri) as websocket:
            print("❌ Should not connect without authentication")
            return False
            
    except websockets.exceptions.ConnectionClosed as e:
        if e.code == 4001:
            print("✅ Correctly rejected connection without authentication")
            return True
        else:
            print(f"❌ Unexpected close code: {e.code}")
            return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

async def main():
    """Run all WebSocket tests."""
    print("WebSocket Connectivity Test")
    print("=" * 40)
    
    # Test health endpoint
    health_ok = await test_websocket_health()
    
    # Test notifications without auth
    auth_ok = await test_websocket_notifications_no_auth()
    
    print("\n" + "=" * 40)
    print("Test Results:")
    print(f"Health Check: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"Auth Check: {'✅ PASS' if auth_ok else '❌ FAIL'}")
    
    if health_ok and auth_ok:
        print("\n🎉 All tests passed! WebSocket connectivity is working.")
        sys.exit(0)
    else:
        print("\n💥 Some tests failed. Check the deployment.")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
