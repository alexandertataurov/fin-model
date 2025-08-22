from datetime import date, datetime, timezone

from app.api.v1.endpoints.admin import router as admin_router
from app.models.audit import AuditLog
from app.models.base import SessionLocal, engine
from app.models.file import FileStatus, UploadedFile
from app.models.financial import FinancialStatement
from app.models.mfa import MFAToken
from app.models.notification import Notification  # noqa: F401
from app.models.parameter import Scenario
from app.models.user import User
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import event

app = FastAPI()
app.include_router(admin_router, prefix="/api/v1/admin")
client = TestClient(app)

# Ensure MFAToken model is registered for SQLAlchemy mappings
_ = MFAToken


def _seed_data():
    with SessionLocal() as db:
        u1 = User(
            email="u1@example.com",
            username="u1",
            full_name="User One",
            hashed_password="x",
            is_active=True,
            is_admin=False,
            is_verified=True,
            last_login=datetime.now(timezone.utc),
        )
        u2 = User(
            email="u2@example.com",
            username="u2",
            full_name="User Two",
            hashed_password="x",
            is_active=True,
            is_admin=False,
            is_verified=True,
            last_login=datetime.now(timezone.utc),
        )
        db.add_all([u1, u2])
        db.commit()
        db.refresh(u1)
        db.refresh(u2)

        f1 = UploadedFile(
            original_filename="f1.csv",
            file_size=10,
            file_type="csv",
            user_id=u1.id,
            status=FileStatus.COMPLETED.value,
        )
        f2 = UploadedFile(
            original_filename="f2.csv",
            file_size=10,
            file_type="csv",
            user_id=u1.id,
            status=FileStatus.COMPLETED.value,
        )
        f3 = UploadedFile(
            original_filename="f3.csv",
            file_size=10,
            file_type="csv",
            user_id=u2.id,
            status=FileStatus.COMPLETED.value,
        )
        db.add_all([f1, f2, f3])
        db.commit()
        db.refresh(f1)

        scenario = Scenario(
            name="s1", base_file_id=f1.id, created_by_id=u1.id
        )
        db.add(scenario)
        db.commit()
        db.refresh(scenario)

        fs = FinancialStatement(
            scenario_id=scenario.id,
            statement_type="pl",
            period_start=date(2020, 1, 1),
            period_end=date(2020, 12, 31),
            period_type="annual",
            currency="USD",
            line_items={},
            created_by_id=u1.id,
        )
        db.add(fs)
        db.commit()

        logs = [
            AuditLog(user_id=u1.id, action="LOGIN", success="true"),
            AuditLog(user_id=u1.id, action="LOGIN", success="true"),
            AuditLog(user_id=u1.id, action="LOGIN", success="true"),
            AuditLog(user_id=u2.id, action="LOGIN", success="true"),
        ]
        db.add_all(logs)
        db.commit()

        return u1.id, u2.id


def test_user_activity_counts_and_query_efficiency():
    u1_id, u2_id = _seed_data()
    statements = []

    def before_cursor_execute(
        conn, cursor, statement, parameters, context, executemany
    ):
        if statement.lstrip().lower().startswith("select"):
            statements.append(statement)

    event.listen(engine, "before_cursor_execute", before_cursor_execute)
    try:
        resp = client.get("/api/v1/admin/users/activity-list")
    finally:
        event.remove(
            engine, "before_cursor_execute", before_cursor_execute
        )

    assert resp.status_code == 200
    data = {row["user_id"]: row for row in resp.json()}

    assert data[u1_id]["files_uploaded"] == 2
    assert data[u1_id]["models_created"] == 1
    assert data[u1_id]["login_count"] == 3
    assert data[u2_id]["files_uploaded"] == 1
    assert data[u2_id]["models_created"] == 0
    assert data[u2_id]["login_count"] == 1

    selects = [
        s for s in statements if s.lstrip().lower().startswith("select")
    ]
    assert len(selects) == 1
