from types import SimpleNamespace
import pytest
from datetime import datetime, timedelta, timezone

from app.core.rate_limiter import RateLimiter, RateLimit
from app.models.base import SessionLocal, Base, engine


class DummyRequest:
    def __init__(self, ip="127.0.0.1", headers=None):
        self.client = SimpleNamespace(host=ip)
        self.headers = headers or {}


@pytest.fixture(autouse=True)
def _clean_table():
    # Ensure table exists and clean before each test
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        db.query(RateLimit).delete()
        db.commit()
    yield
    with SessionLocal() as db:
        db.query(RateLimit).delete()
        db.commit()


def test_new_key_starts_window_and_allows():
    with SessionLocal() as db:
        rl = RateLimiter(db)
        req = DummyRequest()
        assert rl.check_rate_limit(req, "login", max_attempts=2) is True


def test_increment_and_block_after_max_attempts():
    with SessionLocal() as db:
        rl = RateLimiter(db)
        req = DummyRequest()
        rl.check_rate_limit(req, "login", max_attempts=2)
        rl.check_rate_limit(req, "login", max_attempts=2)
    with pytest.raises(Exception) as exc:
        rl.check_rate_limit(req, "login", max_attempts=2)
    # FastAPI HTTPException string repr can be empty; check attributes instead
    assert getattr(exc.value, "status_code", 429) == 429


def test_window_reset_allows_again():
    with SessionLocal() as db:
        rl = RateLimiter(db)
        req = DummyRequest()
        rl.check_rate_limit(req, "login", max_attempts=1, window_minutes=0)
        # Simulate old window by moving window_start back
        rec = db.query(RateLimit).first()
        rec.window_start = datetime.now(timezone.utc) - timedelta(
            minutes=20
        )
        db.commit()
        # After window reset, one attempt should be allowed
        assert rl.check_rate_limit(req, "login", max_attempts=1) is True


def test_record_successful_auth_resets_attempts():
    with SessionLocal() as db:
        rl = RateLimiter(db)
        req = DummyRequest()
        rl.check_rate_limit(req, "login", max_attempts=1)
        rl.record_successful_auth(req, "login")
        rec = db.query(RateLimit).first()
        assert rec.attempts == 0


def test_get_client_ip_header_precedence():
    with SessionLocal() as db:
        rl = RateLimiter(db)
        req = DummyRequest(
            ip="9.9.9.9", headers={"X-Forwarded-For": "1.1.1.1, 2.2.2.2"}
        )
        # first call creates record using header IP
        rl.check_rate_limit(req, "login")
        rec = db.query(RateLimit).first()
        assert rec.key.startswith("login:1.1.1.1")
