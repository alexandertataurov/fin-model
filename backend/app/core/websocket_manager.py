from typing import Dict, List, Set, Optional, Any
import json
import asyncio
from datetime import datetime
from fastapi import WebSocket
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class ChannelType(Enum):
    DASHBOARD = "dashboard"
    COLLABORATION = "collaboration"
    NOTIFICATIONS = "notifications"
    FINANCIAL_DATA = "financial_data"
    REPORTS = "reports"
    PARAMETERS = "parameters"


class ConnectionMetadata:
    def __init__(
        self,
        user_id: str,
        channel: ChannelType,
        channel_id: str = "global",
        client_info: Dict[str, Any] = None,
    ):
        self.user_id = user_id
        self.channel = channel
        self.channel_id = channel_id
        self.client_info = client_info or {}
        self.connected_at = datetime.utcnow()
        self.last_activity = datetime.utcnow()


class WebSocketManager:
    """Enhanced WebSocket manager with channel support and connection management"""

    def __init__(self):
        # Connection pools by channel type and channel ID
        self.channels: Dict[ChannelType, Dict[str, Set[WebSocket]]] = {
            channel: {} for channel in ChannelType
        }

        # User connection mapping for direct messaging
        self.user_connections: Dict[str, Set[WebSocket]] = {}

        # Connection metadata storage
        self.connection_metadata: Dict[WebSocket, ConnectionMetadata] = {}

        # Connection statistics
        self.stats = {
            "total_connections": 0,
            "active_connections": 0,
            "messages_sent": 0,
            "connection_errors": 0,
        }

    async def connect(
        self,
        websocket: WebSocket,
        user_id: str,
        channel: ChannelType,
        channel_id: str = "global",
        client_info: Dict[str, Any] = None,
    ) -> bool:
        """
        Connect a WebSocket to a specific channel

        Args:
            websocket: WebSocket connection
            user_id: User identifier
            channel: Channel type
            channel_id: Specific channel identifier
            client_info: Additional client information

        Returns:
            bool: True if connection successful
        """
        try:
            await websocket.accept()

            # Create connection metadata
            metadata = ConnectionMetadata(user_id, channel, channel_id, client_info)
            self.connection_metadata[websocket] = metadata

            # Add to channel
            if channel_id not in self.channels[channel]:
                self.channels[channel][channel_id] = set()
            self.channels[channel][channel_id].add(websocket)

            # Add to user connections
            if user_id not in self.user_connections:
                self.user_connections[user_id] = set()
            self.user_connections[user_id].add(websocket)

            # Update statistics
            self.stats["total_connections"] += 1
            self.stats["active_connections"] += 1

            logger.info(f"User {user_id} connected to {channel.value}:{channel_id}")

            # Send connection confirmation
            await self._send_to_websocket(
                websocket,
                {
                    "type": "connection_established",
                    "data": {
                        "channel": channel.value,
                        "channel_id": channel_id,
                        "connected_at": metadata.connected_at.isoformat(),
                    },
                },
            )

            return True

        except Exception as e:
            logger.error(f"Failed to connect WebSocket for user {user_id}: {e}")
            self.stats["connection_errors"] += 1
            return False

    async def disconnect(self, websocket: WebSocket) -> None:
        """
        Disconnect a WebSocket and clean up resources

        Args:
            websocket: WebSocket connection to disconnect
        """
        if websocket not in self.connection_metadata:
            return

        metadata = self.connection_metadata[websocket]
        user_id = metadata.user_id
        channel = metadata.channel
        channel_id = metadata.channel_id

        try:
            # Remove from channel
            if channel_id in self.channels[channel]:
                self.channels[channel][channel_id].discard(websocket)
                if not self.channels[channel][channel_id]:
                    del self.channels[channel][channel_id]

            # Remove from user connections
            if user_id in self.user_connections:
                self.user_connections[user_id].discard(websocket)
                if not self.user_connections[user_id]:
                    del self.user_connections[user_id]

            # Remove metadata
            del self.connection_metadata[websocket]

            # Update statistics
            self.stats["active_connections"] = max(
                0, self.stats["active_connections"] - 1
            )

            logger.info(
                f"User {user_id} disconnected from {channel.value}:{channel_id}"
            )

        except Exception as e:
            logger.error(f"Error during disconnect for user {user_id}: {e}")

    async def broadcast_to_channel(
        self,
        channel: ChannelType,
        channel_id: str,
        message: Dict[str, Any],
        exclude_user: Optional[str] = None,
        exclude_websocket: Optional[WebSocket] = None,
    ) -> int:
        """
        Broadcast message to all connections in a channel

        Args:
            channel: Channel type
            channel_id: Specific channel identifier
            message: Message to broadcast
            exclude_user: User ID to exclude from broadcast
            exclude_websocket: Specific WebSocket to exclude

        Returns:
            int: Number of successful sends
        """
        if channel_id not in self.channels[channel]:
            return 0

        connections = self.channels[channel][channel_id].copy()
        successful_sends = 0
        failed_connections = []

        for connection in connections:
            try:
                # Check exclusions
                metadata = self.connection_metadata.get(connection)
                if not metadata:
                    continue

                if exclude_user and metadata.user_id == exclude_user:
                    continue

                if exclude_websocket and connection == exclude_websocket:
                    continue

                await self._send_to_websocket(connection, message)
                successful_sends += 1

                # Update last activity
                metadata.last_activity = datetime.utcnow()

            except Exception as e:
                logger.error(f"Error sending message to connection: {e}")
                failed_connections.append(connection)

        # Clean up failed connections
        for failed_connection in failed_connections:
            await self.disconnect(failed_connection)

        self.stats["messages_sent"] += successful_sends
        return successful_sends

    async def send_to_user(
        self,
        user_id: str,
        message: Dict[str, Any],
        channel_filter: Optional[ChannelType] = None,
    ) -> int:
        """
        Send message to all connections of a specific user

        Args:
            user_id: Target user ID
            message: Message to send
            channel_filter: Optional channel type filter

        Returns:
            int: Number of successful sends
        """
        if user_id not in self.user_connections:
            return 0

        connections = self.user_connections[user_id].copy()
        successful_sends = 0
        failed_connections = []

        for connection in connections:
            try:
                # Apply channel filter if specified
                if channel_filter:
                    metadata = self.connection_metadata.get(connection)
                    if not metadata or metadata.channel != channel_filter:
                        continue

                await self._send_to_websocket(connection, message)
                successful_sends += 1

                # Update last activity
                if connection in self.connection_metadata:
                    self.connection_metadata[
                        connection
                    ].last_activity = datetime.utcnow()

            except Exception as e:
                logger.error(f"Error sending message to user {user_id}: {e}")
                failed_connections.append(connection)

        # Clean up failed connections
        for failed_connection in failed_connections:
            await self.disconnect(failed_connection)

        self.stats["messages_sent"] += successful_sends
        return successful_sends

    async def send_to_websocket(
        self, websocket: WebSocket, message: Dict[str, Any]
    ) -> bool:
        """
        Send message to a specific WebSocket connection

        Args:
            websocket: Target WebSocket
            message: Message to send

        Returns:
            bool: True if message sent successfully
        """
        try:
            await self._send_to_websocket(websocket, message)

            # Update last activity
            if websocket in self.connection_metadata:
                self.connection_metadata[websocket].last_activity = datetime.utcnow()

            self.stats["messages_sent"] += 1
            return True

        except Exception as e:
            logger.error(f"Error sending message to WebSocket: {e}")
            await self.disconnect(websocket)
            return False

    async def _send_to_websocket(
        self, websocket: WebSocket, message: Dict[str, Any]
    ) -> None:
        """Internal method to send message to WebSocket"""
        message_with_timestamp = {
            **message,
            "timestamp": datetime.utcnow().isoformat(),
        }
        await websocket.send_text(json.dumps(message_with_timestamp))

    def get_channel_connections(self, channel: ChannelType, channel_id: str) -> int:
        """Get number of connections in a specific channel"""
        if channel_id in self.channels[channel]:
            return len(self.channels[channel][channel_id])
        return 0

    def get_user_connections_count(self, user_id: str) -> int:
        """Get number of connections for a specific user"""
        if user_id in self.user_connections:
            return len(self.user_connections[user_id])
        return 0

    def get_connection_info(self, websocket: WebSocket) -> Optional[ConnectionMetadata]:
        """Get connection metadata for a WebSocket"""
        return self.connection_metadata.get(websocket)

    def get_stats(self) -> Dict[str, Any]:
        """Get connection statistics"""
        return {
            **self.stats,
            "channels": {
                channel.value: {
                    channel_id: len(connections)
                    for channel_id, connections in channel_data.items()
                }
                for channel, channel_data in self.channels.items()
            },
            "users_online": len(self.user_connections),
        }

    async def ping_all_connections(self) -> None:
        """Send ping to all connections to check health"""
        ping_message = {"type": "ping", "data": {}}

        for channel in ChannelType:
            for channel_id in list(self.channels[channel].keys()):
                await self.broadcast_to_channel(channel, channel_id, ping_message)

    async def cleanup_stale_connections(self, max_idle_minutes: int = 30) -> int:
        """Clean up connections that have been idle for too long"""
        cutoff_time = datetime.utcnow().timestamp() - (max_idle_minutes * 60)
        stale_connections = []

        for websocket, metadata in self.connection_metadata.items():
            if metadata.last_activity.timestamp() < cutoff_time:
                stale_connections.append(websocket)

        for websocket in stale_connections:
            await self.disconnect(websocket)

        return len(stale_connections)


# Global WebSocket manager instance
websocket_manager = WebSocketManager()


async def get_websocket_stats() -> Dict[str, Any]:
    """Get WebSocket manager statistics"""
    return websocket_manager.get_stats()
