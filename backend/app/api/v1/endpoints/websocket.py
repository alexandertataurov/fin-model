import json
from typing import Any, Dict
from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    Depends,
    HTTPException,
    status,
    Query,
)
from sqlalchemy.orm import Session
import jwt
from datetime import datetime

from app.models.base import get_db
from app.models.user import User
from app.core.websocket_manager import websocket_manager, ChannelType
from app.core.security import verify_token
from app.core.config import settings
from app.services.realtime_triggers import realtime_service

router = APIRouter()


async def get_current_user_ws(websocket: WebSocket, token: str = Query(...)) -> User:
    """
    Get current user from WebSocket query parameters
    """
    try:
        from app.core.security import ALGORITHM
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            await websocket.close(code=4001, reason="Invalid token")
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user from database
        db = next(get_db())
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user or not user.is_active:
            await websocket.close(code=4001, reason="User not found or inactive")
            raise HTTPException(status_code=401, detail="User not found or inactive")
            
        return user
        
    except jwt.JWTError:
        await websocket.close(code=4001, reason="Invalid token")
        raise HTTPException(status_code=401, detail="Invalid token")


@router.websocket("/dashboard/{file_id}")
async def dashboard_websocket(
    websocket: WebSocket,
    file_id: int,
    current_user: User = Depends(get_current_user_ws)
):
    """WebSocket endpoint for real-time dashboard updates"""
    client_info = {
        'endpoint': 'dashboard',
        'file_id': file_id,
        'connected_at': datetime.utcnow().isoformat()
    }
    
    await websocket_manager.connect(
        websocket,
        str(current_user.id),
        ChannelType.DASHBOARD,
        f"file_{file_id}",
        client_info
    )

    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            message = json.loads(data)

            await handle_dashboard_message(current_user.id, file_id, message)

    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket)
    except Exception as e:
        await websocket_manager.send_to_websocket(websocket, {
            'type': 'error',
            'data': {'message': f'Error processing message: {str(e)}'}
        })
        await websocket_manager.disconnect(websocket)


@router.websocket("/notifications")
async def notifications_websocket(
    websocket: WebSocket,
    current_user: User = Depends(get_current_user_ws)
):
    """WebSocket endpoint for real-time notifications"""
    client_info = {
        'endpoint': 'notifications',
        'connected_at': datetime.utcnow().isoformat()
    }
    
    await websocket_manager.connect(
        websocket,
        str(current_user.id),
        ChannelType.NOTIFICATIONS,
        "global",
        client_info
    )

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            await handle_notification_message(current_user.id, message)
            
    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket)
    except Exception as e:
        await websocket_manager.send_to_websocket(websocket, {
            'type': 'error',
            'data': {'message': f'Error processing message: {str(e)}'}
        })
        await websocket_manager.disconnect(websocket)


@router.websocket("/financial-data/{file_id}")
async def financial_data_websocket(
    websocket: WebSocket,
    file_id: int,
    current_user: User = Depends(get_current_user_ws)
):
    """WebSocket endpoint for real-time financial data updates"""
    client_info = {
        'endpoint': 'financial_data',
        'file_id': file_id,
        'connected_at': datetime.utcnow().isoformat()
    }
    
    await websocket_manager.connect(
        websocket,
        str(current_user.id),
        ChannelType.FINANCIAL_DATA,
        f"file_{file_id}",
        client_info
    )

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            await handle_financial_data_message(current_user.id, file_id, message)

    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket)
    except Exception as e:
        await websocket_manager.send_to_websocket(websocket, {
            'type': 'error',
            'data': {'message': f'Error processing message: {str(e)}'}
        })
        await websocket_manager.disconnect(websocket)


@router.websocket("/parameters/{file_id}")
async def parameters_websocket(
    websocket: WebSocket,
    file_id: int,
    current_user: User = Depends(get_current_user_ws)
):
    """WebSocket endpoint for real-time parameter updates"""
    client_info = {
        'endpoint': 'parameters',
        'file_id': file_id,
        'connected_at': datetime.utcnow().isoformat()
    }
    
    await websocket_manager.connect(
        websocket,
        str(current_user.id),
        ChannelType.PARAMETERS,
        f"file_{file_id}",
        client_info
    )

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            await handle_parameter_message(current_user.id, file_id, message)

    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket)
    except Exception as e:
        await websocket_manager.send_to_websocket(websocket, {
            'type': 'error',
            'data': {'message': f'Error processing message: {str(e)}'}
        })
        await websocket_manager.disconnect(websocket)


async def handle_dashboard_message(user_id: str, file_id: int, message: Dict[str, Any]):
    """Handle dashboard-specific WebSocket messages"""
    message_type = message.get('type')
    
    if message_type == 'ping':
        # Respond with pong
        await websocket_manager.send_to_user(user_id, {'type': 'pong'})
    
    elif message_type == 'subscribe_metrics':
        # Handle metric subscription requests
        await websocket_manager.send_to_user(user_id, {
            'type': 'subscription_confirmed',
            'data': {
                'subscribed_to': 'metrics',
                'file_id': file_id
            }
        })
    
    elif message_type == 'subscribe_chart':
        # Handle chart subscription requests
        chart_type = message.get('data', {}).get('chart_type')
        await websocket_manager.send_to_user(user_id, {
            'type': 'subscription_confirmed',
            'data': {
                'subscribed_to': 'chart',
                'chart_type': chart_type,
                'file_id': file_id
            }
        })


async def handle_notification_message(user_id: str, message: Dict[str, Any]):
    """Handle notification-specific WebSocket messages"""
    message_type = message.get('type')
    
    if message_type == 'mark_read':
        # Handle notification read status
        notification_id = message.get('data', {}).get('notification_id')
        # This would typically update the database
        await websocket_manager.send_to_user(user_id, {
            'type': 'notification_read',
            'data': {'notification_id': notification_id}
        })


async def handle_financial_data_message(user_id: str, file_id: int, message: Dict[str, Any]):
    """Handle financial data-specific WebSocket messages"""
    message_type = message.get('type')
    
    if message_type == 'request_latest_data':
        # Send latest financial data
        await websocket_manager.send_to_user(user_id, {
            'type': 'latest_data_response',
            'data': {
                'file_id': file_id,
                'message': 'Latest data would be sent here'
            }
        })


async def handle_parameter_message(user_id: str, file_id: int, message: Dict[str, Any]):
    """Handle parameter-specific WebSocket messages"""
    message_type = message.get('type')
    
    if message_type == 'parameter_change_preview':
        # Handle parameter change preview requests
        parameter_data = message.get('data', {})
        await websocket_manager.send_to_user(user_id, {
            'type': 'parameter_preview_result',
            'data': {
                'file_id': file_id,
                'parameter_id': parameter_data.get('parameter_id'),
                'preview_results': 'Preview calculation results would be here'
            }
        })


@router.get("/ws/stats")
async def get_websocket_stats() -> Any:
    """Get comprehensive WebSocket connection statistics"""
    return await websocket_manager.get_stats()


@router.post("/ws/broadcast/{channel_type}/{channel_id}")
async def broadcast_message(
    channel_type: str,
    channel_id: str,
    message: Dict[str, Any],
    current_user: User = Depends(get_current_user_ws),
    db: Session = Depends(get_db)
):
    """Broadcast a message to a specific channel"""
    try:
        # Validate channel type
        channel = ChannelType(channel_type)
        
        # Send the message
        sent_count = await websocket_manager.broadcast_to_channel(
            channel,
            channel_id,
            message
        )
        
        return {
            "success": True,
            "channel": channel_type,
            "channel_id": channel_id,
            "recipients": sent_count
        }
        
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid channel type: {channel_type}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to broadcast message: {str(e)}"
        )


@router.post("/ws/send-user/{user_id}")
async def send_user_message(
    user_id: str,
    message: Dict[str, Any],
    current_user: User = Depends(get_current_user_ws),
    db: Session = Depends(get_db)
):
    """Send a message to a specific user"""
    try:
        sent_count = await websocket_manager.send_to_user(user_id, message)
        
        return {
            "success": True,
            "target_user": user_id,
            "connections_reached": sent_count
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send message: {str(e)}"
        )


@router.get("/ws/channels")
async def get_active_channels():
    """Get information about active channels"""
    stats = await websocket_manager.get_stats()
    
    return {
        "channels": stats.get("channels", {}),
        "total_users_online": stats.get("users_online", 0),
        "active_connections": stats.get("active_connections", 0)
    }


@router.post("/ws/cleanup")
async def cleanup_stale_connections(
    max_idle_minutes: int = 30,
    current_user: User = Depends(get_current_user_ws)
):
    """Clean up stale WebSocket connections"""
    cleaned_count = await websocket_manager.cleanup_stale_connections(max_idle_minutes)
    
    return {
        "success": True,
        "cleaned_connections": cleaned_count,
        "max_idle_minutes": max_idle_minutes
    }
