import asyncio
import websockets
import json

async def test_health():
    try:
        uri = "wss://fin-model-production.up.railway.app/ws/health"
        async with websockets.connect(uri) as websocket:
            print("✅ Health WebSocket connected")
            
            # Send ping
            await websocket.send(json.dumps({"type": "ping", "timestamp": "test"}))
            
            # Get response
            response = await websocket.recv()
            print(f"✅ Response: {response}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_health())
