#!/usr/bin/env python3
"""
Test script to verify WebSocket authentication is working
"""
import asyncio
import websockets
import json
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.core.security import create_access_token


async def test_websocket_auth():
    """Test WebSocket connection with authentication."""
    print("Testing WebSocket Authentication...")
    
    # Create a test token (this would normally come from login)
    test_user_id = 1
    token = create_access_token(subject=test_user_id)
    print(f"Generated test token: {token[:50]}...")
    
    # Test connection without token (should fail)
    print("\n1. Testing connection without token (should fail)...")
    try:
        async with websockets.connect("ws://localhost:8000/ws/notifications") as websocket:
            print("❌ Connection without token succeeded (unexpected)")
    except Exception as e:
        print(f"✅ Connection without token failed as expected: {e}")
    
    # Test connection with token (should succeed)
    print("\n2. Testing connection with token (should succeed)...")
    try:
        uri = f"ws://localhost:8000/ws/notifications?token={token}"
        async with websockets.connect(uri) as websocket:
            print("✅ Connection with token succeeded")
            
            # Wait for connection confirmation
            message = await websocket.recv()
            data = json.loads(message)
            print(f"✅ Received confirmation: {data}")
            
            # Send a ping
            ping_message = json.dumps({"type": "ping", "timestamp": "2025-08-07T12:00:00Z"})
            await websocket.send(ping_message)
            
            # Wait for pong
            response = await websocket.recv()
            pong_data = json.loads(response)
            print(f"✅ Received pong: {pong_data}")
            
    except Exception as e:
        print(f"❌ Connection with token failed: {e}")
    
    print("\nWebSocket authentication test completed!")


if __name__ == "__main__":
    print("Starting WebSocket Authentication Test")
    print("Note: This test requires the backend server to be running on localhost:8000")
    print("=" * 60)
    
    asyncio.run(test_websocket_auth())