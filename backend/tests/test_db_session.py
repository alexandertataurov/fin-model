from app.models.base import get_db


def test_get_db_yields_session(monkeypatch):
    events = []

    class DummySession:
        def __init__(self):
            events.append("created")

        def close(self):
            events.append("closed")

    monkeypatch.setattr("app.models.base.SessionLocal", lambda: DummySession())
    gen = get_db()
    next(gen)
    assert events == ["created"]
    gen.close()
    assert events == ["created", "closed"]
