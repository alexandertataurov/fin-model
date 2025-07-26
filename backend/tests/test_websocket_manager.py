import pytest
from app.core.websocket import ConnectionManager

class DummyWebSocket:
    def __init__(self):
        self.accepted = False
        self.sent = []
    async def accept(self):
        self.accepted = True
    async def send_text(self, text):
        self.sent.append(text)

@pytest.mark.asyncio
async def test_connection_manager_basic():
    manager = ConnectionManager()
    ws = DummyWebSocket()
    await manager.connect(ws, user_id=1)
    assert 1 in manager.get_connected_users()
    await manager.send_to_user(1, {"hello": "world"})
    assert ws.sent and "hello" in ws.sent[-1]
    assert manager.get_connection_count() == 1
    manager.disconnect(ws, user_id=1)
    assert manager.get_connected_users() == []
    assert manager.get_connection_count() == 0

@pytest.mark.asyncio
async def test_file_subscription_and_broadcast():
    manager = ConnectionManager()
    ws = DummyWebSocket()
    await manager.connect(ws, user_id=1)
    await manager.subscribe_to_file(1, 42)
    await manager.broadcast_file_status(42, {"state": "done"}, user_id=1)
    assert any("file_status_update" in msg for msg in ws.sent)
    await manager.unsubscribe_from_file(1, 42)
    manager.disconnect(ws, user_id=1)
