import json
import asyncio
from typing import Dict, List, Set, Any
from fastapi import WebSocket, WebSocketDisconnect
import logging

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manages WebSocket connections for real-time updates."""

    def __init__(self):
        # Store active connections by user ID
        self.active_connections: Dict[int, Set[WebSocket]] = {}
        # Store file subscriptions (user_id -> set of file_ids)
        self.file_subscriptions: Dict[int, Set[int]] = {}
        # Store task subscriptions (user_id -> set of task_ids)
        self.task_subscriptions: Dict[int, Set[str]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        """Accept a new WebSocket connection."""
        await websocket.accept()

        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
            self.file_subscriptions[user_id] = set()
            self.task_subscriptions[user_id] = set()

        self.active_connections[user_id].add(websocket)
        logger.info(f"User {user_id} connected via WebSocket")

        # Send connection confirmation
        await self.send_to_user(
            user_id,
            {
                "type": "connection_established",
                "message": "WebSocket connection established",
                "user_id": user_id,
            },
        )

    def disconnect(self, websocket: WebSocket, user_id: int):
        """Remove a WebSocket connection."""
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)

            # Clean up empty sets
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
                del self.file_subscriptions[user_id]
                del self.task_subscriptions[user_id]

        logger.info(f"User {user_id} disconnected from WebSocket")

    async def send_to_user(self, user_id: int, data: Dict[str, Any]):
        """Send data to all connections for a specific user."""
        if user_id not in self.active_connections:
            return

        message = json.dumps(data)
        disconnected_websockets = []

        for websocket in self.active_connections[user_id].copy():
            try:
                await websocket.send_text(message)
            except Exception as e:
                logger.warning(
                    f"Failed to send message to user {user_id}: {e}"
                )
                disconnected_websockets.append(websocket)

        # Clean up disconnected websockets
        for websocket in disconnected_websockets:
            self.active_connections[user_id].discard(websocket)

    async def subscribe_to_file(self, user_id: int, file_id: int):
        """Subscribe a user to file status updates."""
        if user_id in self.file_subscriptions:
            self.file_subscriptions[user_id].add(file_id)
            await self.send_to_user(
                user_id,
                {
                    "type": "file_subscription",
                    "file_id": file_id,
                    "message": f"Subscribed to file {file_id} updates",
                },
            )

    async def unsubscribe_from_file(self, user_id: int, file_id: int):
        """Unsubscribe a user from file status updates."""
        if user_id in self.file_subscriptions:
            self.file_subscriptions[user_id].discard(file_id)
            await self.send_to_user(
                user_id,
                {
                    "type": "file_unsubscription",
                    "file_id": file_id,
                    "message": f"Unsubscribed from file {file_id} updates",
                },
            )

    async def subscribe_to_task(self, user_id: int, task_id: str):
        """Subscribe a user to task status updates."""
        if user_id in self.task_subscriptions:
            self.task_subscriptions[user_id].add(task_id)
            await self.send_to_user(
                user_id,
                {
                    "type": "task_subscription",
                    "task_id": task_id,
                    "message": f"Subscribed to task {task_id} updates",
                },
            )

    async def unsubscribe_from_task(self, user_id: int, task_id: str):
        """Unsubscribe a user from task status updates."""
        if user_id in self.task_subscriptions:
            self.task_subscriptions[user_id].discard(task_id)
            await self.send_to_user(
                user_id,
                {
                    "type": "task_unsubscription",
                    "task_id": task_id,
                    "message": f"Unsubscribed from task {task_id} updates",
                },
            )

    async def broadcast_file_status(
        self, file_id: int, status_data: Dict[str, Any], user_id: int
    ):
        """Broadcast file status update to subscribed users."""
        # Only send to the user who owns the file
        if (
            user_id in self.file_subscriptions
            and file_id in self.file_subscriptions[user_id]
        ):
            await self.send_to_user(
                user_id,
                {
                    "type": "file_status_update",
                    "file_id": file_id,
                    "data": status_data,
                },
            )

    async def broadcast_task_progress(
        self, task_id: str, progress_data: Dict[str, Any], user_id: int
    ):
        """Broadcast task progress update to subscribed users."""
        if (
            user_id in self.task_subscriptions
            and task_id in self.task_subscriptions[user_id]
        ):
            await self.send_to_user(
                user_id,
                {
                    "type": "task_progress_update",
                    "task_id": task_id,
                    "data": progress_data,
                },
            )

    async def send_notification(
        self, user_id: int, notification: Dict[str, Any]
    ):
        """Send a notification to a specific user."""
        await self.send_to_user(
            user_id, {"type": "notification", "data": notification}
        )

    async def broadcast_system_message(
        self, message: str, message_type: str = "info"
    ):
        """Broadcast a system message to all connected users."""
        data = {
            "type": "system_message",
            "message": message,
            "message_type": message_type,
        }

        for user_id in self.active_connections:
            await self.send_to_user(user_id, data)

    def get_connected_users(self) -> List[int]:
        """Get list of currently connected user IDs."""
        return list(self.active_connections.keys())

    def get_connection_count(self) -> int:
        """Get total number of active connections."""
        return sum(
            len(connections)
            for connections in self.active_connections.values()
        )


# Global connection manager instance
manager = ConnectionManager()


async def handle_websocket_message(
    websocket: WebSocket, user_id: int, message: Dict[str, Any]
):
    """Handle incoming WebSocket messages from clients."""
    message_type = message.get("type")

    try:
        if message_type == "subscribe_file":
            file_id = message.get("file_id")
            if file_id:
                await manager.subscribe_to_file(user_id, file_id)

        elif message_type == "unsubscribe_file":
            file_id = message.get("file_id")
            if file_id:
                await manager.unsubscribe_from_file(user_id, file_id)

        elif message_type == "subscribe_task":
            task_id = message.get("task_id")
            if task_id:
                await manager.subscribe_to_task(user_id, task_id)

        elif message_type == "unsubscribe_task":
            task_id = message.get("task_id")
            if task_id:
                await manager.unsubscribe_from_task(user_id, task_id)

        elif message_type == "ping":
            await manager.send_to_user(
                user_id,
                {"type": "pong", "timestamp": message.get("timestamp")},
            )

        else:
            await manager.send_to_user(
                user_id,
                {
                    "type": "error",
                    "message": f"Unknown message type: {message_type}",
                },
            )

    except Exception as e:
        logger.error(f"Error handling WebSocket message: {e}")
        await manager.send_to_user(
            user_id,
            {
                "type": "error",
                "message": f"Failed to process message: {str(e)}",
            },
        )
