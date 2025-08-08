from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session
import json
import logging
from typing import Optional
from datetime import datetime

from app.models.base import get_db
from app.core.security import verify_token
from app.services.auth_service import AuthService

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/health")
async def health_websocket(websocket: WebSocket):
    """WebSocket health check endpoint - no authentication required."""
    try:
        await websocket.accept()
        logger.info("Health check WebSocket connected")

        # Send connection confirmation
        await websocket.send_text(
            json.dumps(
                {
                    "type": "health_check",
                    "message": "WebSocket health check successful",
                    "status": "connected",
                }
            )
        )

        # Keep connection alive for a short time
        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)

                if message.get("type") == "ping":
                    await websocket.send_text(
                        json.dumps(
                            {"type": "pong", "timestamp": message.get("timestamp")}
                        )
                    )
                else:
                    await websocket.send_text(
                        json.dumps(
                            {"type": "error", "message": "Only ping messages supported"}
                        )
                    )

            except WebSocketDisconnect:
                logger.info("Health check WebSocket disconnected")
                break
            except Exception as e:
                logger.error(f"Error in health check WebSocket: {e}")
                break

    except Exception as e:
        logger.error(f"Error establishing health check WebSocket: {e}")
        if websocket.client_state.name == "CONNECTED":
            try:
                await websocket.close()
            except Exception:
                pass


@router.websocket("/notifications")
async def notifications_websocket(
    websocket: WebSocket, token: Optional[str] = Query(None)
):
    """WebSocket endpoint for real-time notifications."""
    try:
        # Accept the connection first
        await websocket.accept()

        # Then authenticate
        if not token:
            logger.warning("WebSocket connection attempt without token")
            await websocket.close(code=4001, reason="Authentication required")
            return

        try:
            user_id = verify_token(token)
        except Exception as e:
            logger.error(f"Token verification error: {e}")
            await websocket.close(code=4001, reason="Invalid token")
            return

        if not user_id:
            logger.warning("WebSocket connection attempt with invalid token")
            await websocket.close(code=4001, reason="Invalid token")
            return

        # Get database session
        db_gen = get_db()
        db = next(db_gen)

        try:
            auth_service = AuthService(db)
            user = auth_service.get_user_by_id(int(user_id))

            if not user or not user.is_active:
                logger.warning(
                    f"WebSocket connection attempt for inactive user {user_id}"
                )
                await websocket.close(code=4001, reason="User not found or inactive")
                return

            logger.info(f"WebSocket authentication successful for user {user.id}")
        except Exception as e:
            logger.error(f"Database error during WebSocket authentication: {e}")
            await websocket.close(code=4001, reason="Database error")
            return
        finally:
            try:
                db.close()
            except Exception:
                pass

        logger.info(f"WebSocket connection accepted for user {user.id}")

        # Send connection confirmation
        await websocket.send_text(
            json.dumps(
                {
                    "type": "connection_established",
                    "message": "Notifications WebSocket connected",
                    "user_id": user.id,
                }
            )
        )

        # Keep connection alive
        while True:
            try:
                # Wait for messages from client
                data = await websocket.receive_text()
                message = json.loads(data)

                # Handle different message types
                if message.get("type") == "ping":
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "pong",
                                "timestamp": message.get("timestamp"),
                                "user_id": user.id,
                            }
                        )
                    )
                elif message.get("type") == "heartbeat":
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "heartbeat_ack",
                                "timestamp": message.get("timestamp"),
                            }
                        )
                    )
                else:
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "error",
                                "message": f"Unknown message type: {message.get('type')}",
                            }
                        )
                    )

            except WebSocketDisconnect:
                logger.info(f"User {user.id} disconnected from notifications WebSocket")
                break
            except Exception as e:
                logger.error(
                    f"Error in notifications WebSocket for user {user.id}: {e}"
                )
                await websocket.send_text(
                    json.dumps({"type": "error", "message": "Internal server error"})
                )

    except Exception as e:
        logger.error(f"Error establishing notifications WebSocket: {e}")
        # Don't try to close if we never accepted the connection
        if websocket.client_state.name == "CONNECTED":
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
        await websocket.send_text(
            json.dumps(
                {
                    "type": "connection_established",
                    "message": "Collaboration WebSocket connected",
                    "template_id": template_id,
                }
            )
        )

        # Keep connection alive
        while True:
            try:
                # Wait for messages from client
                data = await websocket.receive_text()
                message = json.loads(data)

                # Handle different message types
                if message.get("type") == "ping":
                    await websocket.send_text(
                        json.dumps(
                            {"type": "pong", "timestamp": message.get("timestamp")}
                        )
                    )
                elif message.get("type") == "user_presence":
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "user_presence_ack",
                                "data": {"status": "received"},
                            }
                        )
                    )
                else:
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "error",
                                "message": f"Unknown message type: {message.get('type')}",
                            }
                        )
                    )

            except WebSocketDisconnect:
                logger.info(
                    f"Client disconnected from collaboration WebSocket for template {template_id}"
                )
                break
            except Exception as e:
                logger.error(f"Error in collaboration WebSocket: {e}")
                await websocket.send_text(
                    json.dumps({"type": "error", "message": "Internal server error"})
                )

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
        await websocket.send_text(
            json.dumps(
                {
                    "type": "connection_established",
                    "message": "Dashboard WebSocket connected",
                    "file_id": file_id,
                }
            )
        )

        # Keep connection alive
        while True:
            try:
                # Wait for messages from client
                data = await websocket.receive_text()
                message = json.loads(data)

                # Handle different message types
                if message.get("type") == "ping":
                    await websocket.send_text(
                        json.dumps(
                            {"type": "pong", "timestamp": message.get("timestamp")}
                        )
                    )
                else:
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "error",
                                "message": f"Unknown message type: {message.get('type')}",
                            }
                        )
                    )

            except WebSocketDisconnect:
                logger.info(
                    f"Client disconnected from dashboard WebSocket for file {file_id}"
                )
                break
            except Exception as e:
                logger.error(f"Error in dashboard WebSocket: {e}")
                await websocket.send_text(
                    json.dumps({"type": "error", "message": "Internal server error"})
                )

    except Exception as e:
        logger.error(f"Error establishing dashboard WebSocket: {e}")
    finally:
        try:
            await websocket.close()
        except Exception:
            pass


@router.websocket("/")
async def root_websocket(websocket: WebSocket):
    """Root WebSocket endpoint for basic connections."""
    await websocket.accept()
    logger.info("Root WebSocket connection accepted")

    try:
        # Send connection confirmation
        await websocket.send_text(
            json.dumps(
                {
                    "type": "connection_established",
                    "message": "Root WebSocket connected",
                    "info": "Use specific endpoints like /ws/notifications for full functionality",
                }
            )
        )

        # Keep connection alive
        while True:
            try:
                # Wait for messages from client
                data = await websocket.receive_text()
                message = json.loads(data)

                # Handle different message types
                if message.get("type") == "ping":
                    await websocket.send_text(
                        json.dumps(
                            {"type": "pong", "timestamp": message.get("timestamp")}
                        )
                    )
                else:
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "info",
                                "message": "This is a basic WebSocket endpoint. For authenticated features, use /ws/notifications",
                            }
                        )
                    )

            except WebSocketDisconnect:
                logger.info("Client disconnected from root WebSocket")
                break
            except Exception as e:
                logger.error(f"Error in root WebSocket: {e}")
                await websocket.send_text(
                    json.dumps({"type": "error", "message": "Internal server error"})
                )

    except Exception as e:
        logger.error(f"Error establishing root WebSocket: {e}")
    finally:
        try:
            await websocket.close()
        except Exception:
            pass


@router.websocket("/test")
async def test_websocket(websocket: WebSocket):
    """Test WebSocket endpoint - no authentication required."""
    try:
        await websocket.accept()
        logger.info("Test WebSocket connected")

        # Send connection confirmation
        await websocket.send_text(
            json.dumps(
                {
                    "type": "test_connection",
                    "message": "Test WebSocket connected successfully",
                    "status": "connected",
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )
        )

        # Keep connection alive for a short time
        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)

                if message.get("type") == "ping":
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "pong",
                                "timestamp": message.get("timestamp"),
                                "echo": "pong",
                            }
                        )
                    )
                elif message.get("type") == "echo":
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "echo_response",
                                "message": message.get("message", ""),
                                "timestamp": datetime.utcnow().isoformat(),
                            }
                        )
                    )
                else:
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "error",
                                "message": "Unknown message type",
                                "received": message.get("type"),
                            }
                        )
                    )

            except WebSocketDisconnect:
                logger.info("Test WebSocket disconnected")
                break
            except Exception as e:
                logger.error(f"Error in test WebSocket: {e}")
                break

    except Exception as e:
        logger.error(f"Error establishing test WebSocket: {e}")
        if websocket.client_state.name == "CONNECTED":
            try:
                await websocket.close()
            except Exception:
                pass
