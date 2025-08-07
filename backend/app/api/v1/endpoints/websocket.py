from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session
import json
import logging
from typing import Optional

from app.models.base import get_db
from app.core.security import verify_token
from app.services.auth_service import AuthService

logger = logging.getLogger(__name__)
router = APIRouter()


async def authenticate_websocket(websocket: WebSocket, token: Optional[str] = None):
    """Authenticate WebSocket connection using token."""
    if not token:
        await websocket.close(code=4001, reason="Authentication required")
        return None
    
    user_id = verify_token(token)
    if not user_id:
        await websocket.close(code=4001, reason="Invalid token")
        return None
    
    # Get database session
    db_gen = get_db()
    db = next(db_gen)
    
    try:
        auth_service = AuthService(db)
        user = auth_service.get_user_by_id(int(user_id))
        
        if not user or not user.is_active:
            await websocket.close(code=4001, reason="User not found or inactive")
            return None
            
        return user
    finally:
        db.close()


@router.websocket("/notifications")
async def notifications_websocket(websocket: WebSocket, token: Optional[str] = Query(None)):
    """WebSocket endpoint for real-time notifications."""
    try:
        # Accept the connection first
        await websocket.accept()
        logger.info("WebSocket connection accepted for notifications")
        
        # Authenticate user
        user = await authenticate_websocket(websocket, token)
        if not user:
            return
            
        logger.info(f"WebSocket authenticated for user {user.id}")
        
        # Send connection confirmation
        await websocket.send_text(json.dumps({
            "type": "connection_established",
            "message": "Notifications WebSocket connected",
            "user_id": user.id
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
                        "timestamp": message.get("timestamp"),
                        "user_id": user.id
                    }))
                elif message.get("type") == "heartbeat":
                    await websocket.send_text(json.dumps({
                        "type": "heartbeat_ack",
                        "timestamp": message.get("timestamp")
                    }))
                else:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": f"Unknown message type: {message.get('type')}"
                    }))
                    
            except WebSocketDisconnect:
                logger.info(f"User {user.id} disconnected from notifications WebSocket")
                break
            except Exception as e:
                logger.error(f"Error in notifications WebSocket for user {user.id}: {e}")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Internal server error"
                }))
                
    except Exception as e:
        logger.error(f"Error establishing notifications WebSocket: {e}")
        # Don't try to close if we never accepted the connection
        if websocket.client_state.name == 'CONNECTED':
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
