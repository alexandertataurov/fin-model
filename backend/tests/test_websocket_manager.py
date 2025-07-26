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
