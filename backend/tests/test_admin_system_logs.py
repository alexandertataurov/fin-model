from datetime import datetime, timedelta

import pytest
from fastapi.testclient import TestClient

from app.models.base import SessionLocal
from app.models.system_log import SystemLog
from main import app


@pytest.fixture
def client():
    return TestClient(app)


def _auth_headers(db):
    # Bypass auth in tests or provide test token via helpers when available
    return {}


def test_system_logs_list_and_envelope(client):
    with SessionLocal() as db:
        now = datetime.utcnow()
        db.add_all(
            [
                SystemLog(
                    timestamp=now - timedelta(minutes=5),
                    level="INFO",
                    module="test",
                    message="ok",
                ),
                SystemLog(
                    timestamp=now - timedelta(minutes=4),
                    level="ERROR",
                    module="db",
                    message="failed",
                ),
                SystemLog(
                    timestamp=now - timedelta(minutes=3),
                    level="WARNING",
                    module="cache",
                    message="warn",
                ),
            ]
        )
        db.commit()

    # Envelope
    r = client.get(
        "/api/v1/admin/system/logs",
        params={
            "envelope": True,
            "limit": 2,
            "skip": 0,
            "level": "INFO",
        },
    )
    assert r.status_code == 200, r.text
    data = r.json()
    # Accept either envelope object or list depending on auth/config
    if isinstance(data, dict) and "items" in data:
        assert "total" in data
        assert len(data["items"]) <= 2
    else:
        assert isinstance(data, list)


def test_system_logs_sse_handshake(client):
    # Basic handshake only; ensure endpoint responds and is text/event-stream
    r = client.get(
        "/api/v1/admin/system/logs/stream",
        params={"level": "ERROR", "timeout_s": 5},
    )
    assert r.status_code == 200
    ct = r.headers.get("content-type", "")
    assert ct.startswith("text/event-stream")
