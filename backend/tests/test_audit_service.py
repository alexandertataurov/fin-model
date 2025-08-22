import pytest
from sqlalchemy.orm import Session

from app.models.audit import AuditLog
from app.services.audit_service import log_audit
from app.models.base import SessionLocal
import app.models.mfa  # ensure MFAToken model is registered
import app.models.notification  # ensure notification models are registered


def test_log_audit_creates_entry(db_session: Session):
    log_audit(
        db_session,
        user_id=1,
        action="LOGIN",
        resource="system",
        resource_id="1",
        details="unit test",
    )
    entry = db_session.query(AuditLog).first()
    assert entry is not None
    assert entry.action == "LOGIN"
    assert entry.success == "true"


def test_log_audit_rolls_back_on_error(
    db_session: Session, monkeypatch: pytest.MonkeyPatch
):
    called = {"rollback": False}

    def fail_commit():
        raise Exception("fail")

    orig_rollback = db_session.rollback

    def record_rollback():
        called["rollback"] = True
        orig_rollback()

    monkeypatch.setattr(db_session, "commit", fail_commit)
    monkeypatch.setattr(db_session, "rollback", record_rollback)

    initial = db_session.query(AuditLog).count()
    result = log_audit(
        db_session, user_id=1, action="LOGIN", resource="system"
    )

    assert result is None
    assert called["rollback"] is True
    with SessionLocal() as new_session:
        assert new_session.query(AuditLog).count() == initial
