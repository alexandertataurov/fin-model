import json
from typing import Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.base import get_db
from app.models.user import User
from app.core.websocket import manager, handle_websocket_message
from app.core.security import verify_token

router = APIRouter()


async def get_current_user_websocket(websocket: WebSocket, token: str = None) -> User:
    """
    Get current user for WebSocket connections.
    Token should be passed as a query parameter.
    """
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        raise HTTPException(status_code=401, detail="Token required")
    
    user_id = verify_token(token)
    if user_id is None:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Get user from database
    db = next(get_db())
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if not user or not user.is_active:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        raise HTTPException(status_code=401, detail="User not found or inactive")
    
    return user


@router.websocket("/ws/files")
async def websocket_files_endpoint(
    websocket: WebSocket,
    token: str = None
):
    """
    WebSocket endpoint for real-time file processing updates.
    
    Query parameters:
    - token: JWT authentication token
    
    Messages sent by client:
    - {"type": "subscribe_file", "file_id": 123}
    - {"type": "unsubscribe_file", "file_id": 123}
    - {"type": "subscribe_task", "task_id": "abc123"}
    - {"type": "unsubscribe_task", "task_id": "abc123"}
    - {"type": "ping", "timestamp": 1234567890}
    
    Messages sent by server:
    - {"type": "connection_established", "user_id": 123}
    - {"type": "file_status_update", "file_id": 123, "data": {...}}
    - {"type": "task_progress_update", "task_id": "abc123", "data": {...}}
    - {"type": "notification", "data": {...}}
    - {"type": "error", "message": "..."}
    """
    try:
        # Authenticate user
        user = await get_current_user_websocket(websocket, token)
        
        # Connect to manager
        await manager.connect(websocket, user.id)
        
        # Handle messages
        while True:
            try:
                # Receive message from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle the message
                await handle_websocket_message(websocket, user.id, message)
                
            except WebSocketDisconnect:
                break
            except json.JSONDecodeError:
                await manager.send_to_user(user.id, {
                    "type": "error",
                    "message": "Invalid JSON format"
                })
            except Exception as e:
                await manager.send_to_user(user.id, {
                    "type": "error",
                    "message": f"Message processing error: {str(e)}"
                })
    
    except HTTPException:
        # Authentication failed - connection will be closed
        return
    except Exception as e:
        # Handle any other errors
        try:
            await websocket.close(code=status.WS_1011_INTERNAL_ERROR)
        except:
            pass
    finally:
        # Clean up connection
        try:
            if 'user' in locals():
                manager.disconnect(websocket, user.id)
        except:
            pass


@router.get("/ws/stats")
def get_websocket_stats() -> Any:
    """
    Get WebSocket connection statistics.
    """
    return {
        "connected_users": manager.get_connected_users(),
        "total_connections": manager.get_connection_count(),
        "user_count": len(manager.get_connected_users())
    } 