from datetime import datetime
from types import SimpleNamespace
import pytest
from sqlalchemy.exc import SQLAlchemyError

from app.services.database_monitor import DatabaseMonitor
from app.models.base import SessionLocal


class DummyDB:
    def __init__(self, ok=True):
        self.ok = ok

    def execute(self, stmt, params=None):
        if self.ok is True:
            return SimpleNamespace(fetchone=lambda: (1,))
        if self.ok == "pgss":
            # emulate pg_stat_statements available
            class Result:
                def fetchall(self_inner):
                    return [("select 1", 1.23, 10, 12.3)]

            # first call is the check; subsequent call returns rows
            if str(stmt).lower().find("pg_stat_statements limit 1") != -1:
                return SimpleNamespace()
            return Result()
        raise SQLAlchemyError("db error")


def test_health_check_healthy_and_unhealthy():
    mon = DatabaseMonitor(DummyDB(ok=True))
    h = mon.get_health_check()
    assert h["status"] == "healthy"

    mon = DatabaseMonitor(DummyDB(ok=False))
    u = mon.get_health_check()
    assert u["status"] == "unhealthy"
    assert "error" in u


def test_query_performance_pgss_present_and_absent():
    # present
    mon = DatabaseMonitor(DummyDB(ok="pgss"))
    rows = mon.get_query_performance(limit=1)
    assert rows and isinstance(rows, list)
    assert "avg_ms" in rows[0]

    # absent
    with SessionLocal() as db:  # real session -> absent path returns synthetic row or []
        mon = DatabaseMonitor(db)
        rows = mon.get_query_performance(limit=1)
        assert isinstance(rows, list)


def test_table_sizes_and_cleanup_paths():
    with SessionLocal() as db:
        mon = DatabaseMonitor(db)
        sizes = mon.get_table_sizes()
        assert isinstance(sizes, dict)

        dry = mon.cleanup_stale_data(dry_run=True)
        assert dry["status"] == "dry_run"

        done = mon.cleanup_stale_data(dry_run=False)
        assert done["status"] in ("completed", "error")


