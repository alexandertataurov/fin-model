from fastapi import APIRouter, WebSocket, WebSocketDisconnect, WebSocketState
import json
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/notifications")
async def notifications_websocket(websocket: WebSocket):
    """WebSocket endpoint for real-time notifications."""
    try:
        # Accept the connection first
        await websocket.accept()
        logger.info("WebSocket connection accepted for notifications")
        
        # Send connection confirmation
        await websocket.send_text(json.dumps({
            "type": "connection_established",
            "message": "Notifications WebSocket connected"
        }))
        
        # Keep connection alive
        while True:
            try:
                # Wait for messages from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle different message types
                if message.get("type") == "ping":
                    await websocket.send_text(json.dumps({
                        "type": "pong",
                        "timestamp": message.get("timestamp")
                    }))
                elif message.get("type") == "auth":
                    # Handle authentication if needed
                    await websocket.send_text(json.dumps({
                        "type": "auth_success",
                        "message": "Authentication successful"
                    }))
                else:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": f"Unknown message type: {message.get('type')}"
                    }))
                    
            except WebSocketDisconnect:
                logger.info("Client disconnected from notifications WebSocket")
                break
            except Exception as e:
                logger.error(f"Error in notifications WebSocket: {e}")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Internal server error"
                }))
                
    except Exception as e:
        logger.error(f"Error establishing notifications WebSocket: {e}")
        # Don't try to close if we never accepted the connection
        if websocket.client_state == WebSocketState.CONNECTED:
            try:
                await websocket.close()
            except Exception:
                pass


@router.websocket("/collaboration/ws/template/{template_id}")
async def collaboration_websocket(websocket: WebSocket, template_id: str):
    """WebSocket endpoint for real-time collaboration."""
    await websocket.accept()
    
    try:
        # Send connection confirmation
        await websocket.send_text(json.dumps({
            "type": "connection_established",
            "message": "Collaboration WebSocket connected",
            "template_id": template_id
        }))
        
        # Keep connection alive
        while True:
            try:
                # Wait for messages from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle different message types
                if message.get("type") == "ping":
                    await websocket.send_text(json.dumps({
                        "type": "pong",
                        "timestamp": message.get("timestamp")
                    }))
                elif message.get("type") == "user_presence":
                    await websocket.send_text(json.dumps({
                        "type": "user_presence_ack",
                        "data": {"status": "received"}
                    }))
                else:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": f"Unknown message type: {message.get('type')}"
                    }))
                    
            except WebSocketDisconnect:
                logger.info(f"Client disconnected from collaboration WebSocket for template {template_id}")
                break
            except Exception as e:
                logger.error(f"Error in collaboration WebSocket: {e}")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Internal server error"
                }))
                
    except Exception as e:
        logger.error(f"Error establishing collaboration WebSocket: {e}")
    finally:
        try:
            await websocket.close()
        except Exception:
            pass


@router.websocket("/dashboard/{file_id}")
async def dashboard_websocket(websocket: WebSocket, file_id: str):
    """WebSocket endpoint for real-time dashboard updates."""
    await websocket.accept()
    
    try:
        # Send connection confirmation
        await websocket.send_text(json.dumps({
            "type": "connection_established",
            "message": "Dashboard WebSocket connected",
            "file_id": file_id
        }))
        
        # Keep connection alive
        while True:
            try:
                # Wait for messages from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle different message types
                if message.get("type") == "ping":
                    await websocket.send_text(json.dumps({
                        "type": "pong",
                        "timestamp": message.get("timestamp")
                    }))
                else:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": f"Unknown message type: {message.get('type')}"
                    }))
                    
            except WebSocketDisconnect:
                logger.info(f"Client disconnected from dashboard WebSocket for file {file_id}")
                break
            except Exception as e:
                logger.error(f"Error in dashboard WebSocket: {e}")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Internal server error"
                }))
                
    except Exception as e:
        logger.error(f"Error establishing dashboard WebSocket: {e}")
    finally:
        try:
            await websocket.close()
        except Exception:
            pass
