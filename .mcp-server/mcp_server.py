#!/usr/bin/env python3
"""
Simple Multi-Chat Orchestrator Server
Core message bus for AI agent coordination in Cursor.
"""

import json
import sqlite3
import time
import threading
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional
from uuid import uuid4

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Resource, Tool, TextContent


@dataclass
class Message:
    """Core message structure."""

    id: str
    ts: float
    from_agent: str
    intent: str
    body: Any


@dataclass
class Agent:
    """Agent registration info."""

    id: str
    name: str
    channels: List[str]
    registered_at: float


class SimpleMessageBus:
    """Lightweight persistent message bus with SQLite."""

    def __init__(self, db_path: str = ".mcp-server/messages.db"):
        self.db_path = db_path
        self.agents: Dict[str, Agent] = {}
        self._lock = threading.RLock()
        self._init_db()

    def _init_db(self):
        """Initialize SQLite database."""
        Path(self.db_path).parent.mkdir(exist_ok=True)
        with self._get_db() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS messages (
                    id TEXT PRIMARY KEY,
                    channel TEXT NOT NULL,
                    ts REAL NOT NULL,
                    from_agent TEXT NOT NULL,
                    intent TEXT NOT NULL,
                    body TEXT NOT NULL,
                    created_at REAL DEFAULT (unixepoch())
                );
                CREATE INDEX IF NOT EXISTS idx_channel_ts 
                    ON messages(channel, ts);
                CREATE INDEX IF NOT EXISTS idx_created_at 
                    ON messages(created_at);
            """
            )

    @contextmanager
    def _get_db(self):
        """Get database connection with automatic cleanup."""
        conn = sqlite3.connect(self.db_path, timeout=5.0)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def _cleanup_old_messages(self, hours: int = 24):
        """Remove messages older than specified hours."""
        cutoff = time.time() - (hours * 3600)
        with self._get_db() as conn:
            conn.execute(
                "DELETE FROM messages WHERE created_at < ?", (cutoff,)
            )

    def _ensure_channel_access(
        self, agent_name: str, channel: str
    ) -> bool:
        """Check if agent has access to channel."""
        for agent in self.agents.values():
            if agent.name == agent_name and channel in agent.channels:
                return True
        return False

    def register_agent(self, name: str, channels: List[str]) -> str:
        """Register an agent with channel access."""
        with self._lock:
            agent_id = str(uuid4())
            self.agents[agent_id] = Agent(
                id=agent_id,
                name=name,
                channels=channels,
                registered_at=time.time(),
            )
            return agent_id

    def post(
        self, channel: str, sender: str, body: Any, intent: str = "message"
    ) -> Dict:
        """Post a message to a channel."""
        with self._lock:
            if not self._ensure_channel_access(sender, channel):
                raise ValueError(
                    f"Agent {sender} not authorized for channel {channel}"
                )

            msg_id = str(uuid4())
            ts = time.time()
            body_json = json.dumps(body)

            with self._get_db() as conn:
                conn.execute(
                    """INSERT INTO messages 
                       (id, channel, ts, from_agent, intent, body) 
                       VALUES (?, ?, ?, ?, ?, ?)""",
                    (msg_id, channel, ts, sender, intent, body_json),
                )

                cursor = conn.execute(
                    "SELECT COUNT(*) as count FROM messages WHERE channel = ?",
                    (channel,),
                ).fetchone()["count"]

            # Cleanup old messages periodically
            if cursor % 100 == 0:
                self._cleanup_old_messages()

            return {
                "cursor": cursor,
                "msg": {
                    "id": msg_id,
                    "ts": ts,
                    "from": sender,
                    "intent": intent,
                    "body": body,
                },
            }

    def pull(self, channel: str, since: int = 0, limit: int = 50) -> Dict:
        """Pull messages from a channel."""
        limit = min(limit, 100)  # Cap limit for performance

        with self._get_db() as conn:
            rows = conn.execute(
                """SELECT id, ts, from_agent, intent, body 
                   FROM messages WHERE channel = ? 
                   ORDER BY ts LIMIT ? OFFSET ?""",
                (channel, limit, since),
            ).fetchall()

            total = conn.execute(
                "SELECT COUNT(*) as count FROM messages WHERE channel = ?",
                (channel,),
            ).fetchone()["count"]

            items = []
            for row in rows:
                items.append(
                    {
                        "id": row["id"],
                        "ts": row["ts"],
                        "from": row["from_agent"],
                        "intent": row["intent"],
                        "body": json.loads(row["body"]),
                    }
                )

            return {
                "items": items,
                "next": since + len(items),
                "total": total,
            }

    def list_channels(self) -> List[str]:
        """List all channels."""
        with self._get_db() as conn:
            rows = conn.execute(
                "SELECT DISTINCT channel FROM messages ORDER BY channel"
            ).fetchall()
            return [row["channel"] for row in rows]

    def get_channel_snapshot(self, name: str) -> Dict:
        """Get recent channel snapshot for resources."""
        with self._get_db() as conn:
            rows = conn.execute(
                """SELECT id, ts, from_agent, intent, body 
                   FROM messages WHERE channel = ? 
                   ORDER BY ts DESC LIMIT 50""",
                (name,),
            ).fetchall()

            messages = []
            for row in rows:
                messages.append(
                    {
                        "id": row["id"],
                        "ts": row["ts"],
                        "from": row["from_agent"],
                        "intent": row["intent"],
                        "body": json.loads(row["body"]),
                    }
                )

            return {
                "name": name,
                "messages": list(
                    reversed(messages)
                ),  # Chronological order
            }


# Global message bus instance
bus = SimpleMessageBus()

# MCP Server setup
app = Server("simple-orchestrator")


@app.list_tools()
async def list_tools() -> List[Tool]:
    """List available tools."""
    return [
        Tool(
            name="register_agent",
            description="Register an agent with access to specific channels",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Agent name",
                    },
                    "channels": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of channel names",
                    },
                },
                "required": ["name", "channels"],
            },
        ),
        Tool(
            name="post",
            description="Post a message to a channel",
            inputSchema={
                "type": "object",
                "properties": {
                    "channel": {
                        "type": "string",
                        "description": "Channel name",
                    },
                    "sender": {
                        "type": "string",
                        "description": "Sender agent name",
                    },
                    "body": {
                        "type": "object",
                        "description": "Message body",
                    },
                    "intent": {
                        "type": "string",
                        "description": "Message intent",
                        "default": "message",
                    },
                },
                "required": ["channel", "sender", "body"],
            },
        ),
        Tool(
            name="pull",
            description="Pull messages from a channel",
            inputSchema={
                "type": "object",
                "properties": {
                    "channel": {
                        "type": "string",
                        "description": "Channel name",
                    },
                    "since": {
                        "type": "integer",
                        "description": "Cursor position",
                        "default": 0,
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Max messages to pull",
                        "default": 50,
                    },
                },
                "required": ["channel"],
            },
        ),
        Tool(
            name="list_channels",
            description="List all available channels",
            inputSchema={"type": "object", "properties": {}},
        ),
    ]


@app.call_tool()
async def call_tool(
    name: str, arguments: Dict[str, Any]
) -> List[TextContent]:
    """Handle tool calls."""
    try:
        if name == "register_agent":
            name = arguments["name"]
            channels = arguments["channels"]
            agent_id = bus.register_agent(name, channels)
            return [
                TextContent(
                    type="text", text=json.dumps({"agent_id": agent_id})
                )
            ]

        elif name == "post":
            channel = arguments["channel"]
            sender = arguments["sender"]
            body = arguments["body"]
            intent = arguments.get("intent", "message")
            result = bus.post(channel, sender, body, intent)
            return [TextContent(type="text", text=json.dumps(result))]

        elif name == "pull":
            channel = arguments["channel"]
            since = arguments.get("since", 0)
            limit = arguments.get("limit", 50)
            result = bus.pull(channel, since, limit)
            return [TextContent(type="text", text=json.dumps(result))]

        elif name == "list_channels":
            channels = bus.list_channels()
            return [
                TextContent(
                    type="text", text=json.dumps({"channels": channels})
                )
            ]

        else:
            error_msg = f"Unknown tool: {name}"
            return [
                TextContent(
                    type="text", text=json.dumps({"error": error_msg})
                )
            ]

    except Exception as e:
        return [
            TextContent(type="text", text=json.dumps({"error": str(e)}))
        ]


@app.list_resources()
async def list_resources() -> List[Resource]:
    """List available resources."""
    channels = bus.list_channels()
    return [
        Resource(
            uri=f"chan://{name}",
            name=f"Channel {name}",
            description=f"Live snapshot of channel {name}",
            mimeType="application/json",
        )
        for name in channels
    ]


@app.read_resource()
async def read_resource(uri: str) -> str:
    """Read resource content."""
    if uri.startswith("chan://"):
        channel_name = uri[7:]  # Remove "chan://" prefix
        snapshot = bus.get_channel_snapshot(channel_name)
        return json.dumps(snapshot, indent=2)
    return json.dumps({"error": f"Unknown resource: {uri}"})


async def main():
    """Run the server."""
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream, write_stream, app.create_initialization_options()
        )


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
