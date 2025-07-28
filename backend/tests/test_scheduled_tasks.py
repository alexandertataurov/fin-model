import types
from datetime import datetime

import pytest

import app.tasks.scheduled_tasks as st

class DummyCleanupService:
    def __init__(self):
        pass
    async def run_scheduled_cleanup(self):
        return {"total_files_deleted": 2, "total_storage_freed_mb": 1.2}
    def get_cleanup_statistics(self):
        return {"reclaimable_storage_mb": 50, "eligible_for_cleanup": 5, "storage_used_mb": 500}

class DummySend:
    def __init__(self):
        self.calls = []
    def delay(self, *args):
        self.calls.append(args)

class DummySession:
    def execute(self, q):
        return 1

class DummySessionLocal:
    def __enter__(self):
        return DummySession()
    def __exit__(self, exc_type, exc, tb):
        pass

class DummyCloud:
    def get_storage_stats(self):
        return {"used": 10}

class DummyScanner:
    def get_scanner_status(self):
        return {"available": ["basic"]}

class DummyAnalytics:
    def __init__(self, db):
        pass
    def get_dashboard_summary(self, days):
        return {"days": days}
    def get_processing_overview(self, days):
        return {"overview": days}
    def get_performance_metrics(self, days):
        return {"perf": days}

@pytest.fixture(autouse=True)
def patch_deps(monkeypatch):
    dummy_send = DummySend()
    class DummyFileService:
        def __init__(self, *args, **kwargs):
            pass

        def cleanup_expired_files(self):
            return {"total_files_deleted": 2, "total_storage_freed_mb": 1.2}

    monkeypatch.setattr(st, "FileService", DummyFileService)
    monkeypatch.setattr(st, "FileCleanupService", DummyCleanupService)
    monkeypatch.setattr(st, "send_system_alert", dummy_send)
    monkeypatch.setattr(st, "SessionLocal", lambda: DummySessionLocal())
    import sys
    sys.modules['app.services.cloud_storage'] = types.SimpleNamespace(CloudStorageManager=DummyCloud)
    sys.modules['app.services.virus_scanner'] = types.SimpleNamespace(VirusScanManager=DummyScanner)
    sys.modules['app.services.analytics_service'] = types.SimpleNamespace(AnalyticsService=DummyAnalytics)
    return dummy_send


def test_cleanup_expired_files(patch_deps):
    result = st.cleanup_expired_files()
    assert result["total_files_deleted"] == 2
    assert patch_deps.calls  # notification sent


def test_generate_cleanup_report(patch_deps):
    report = st.generate_cleanup_report()
    assert report["statistics"]["reclaimable_storage_mb"] == 50


def test_health_check(patch_deps):
    status = st.health_check()
    assert status["overall_status"] == "healthy"
    assert "database" in status["services"]


def test_update_analytics_cache(patch_deps):
    res = st.update_analytics_cache()
    assert res["success"] is True
