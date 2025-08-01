import pytest
from app.services.file_cleanup import FileCleanupService


class DummyStorageManager:
    async def delete_file(self, path):
        return True


@pytest.mark.asyncio
async def test_run_scheduled_cleanup(monkeypatch):
    async def fake_cleanup_expired(self, dry_run=False):
        return {"files_deleted": 1, "storage_freed_mb": 0.5}

    async def fake_cleanup_orphans(self, dry_run=False):
        return {"orphaned_files_deleted": 2, "storage_freed_mb": 1.0}

    async def fake_cleanup_logs(self, retention_days=30, dry_run=False):
        return {"logs_deleted": 3}

    monkeypatch.setattr(
        FileCleanupService, "cleanup_expired_files", fake_cleanup_expired
    )
    monkeypatch.setattr(
        FileCleanupService, "cleanup_orphaned_files", fake_cleanup_orphans
    )
    monkeypatch.setattr(
        FileCleanupService, "cleanup_processing_logs", fake_cleanup_logs
    )
    monkeypatch.setattr(
        FileCleanupService,
        "__init__",
        lambda self: setattr(self, "storage_manager", DummyStorageManager())
        or setattr(self, "policies", []),
    )

    service = FileCleanupService()
    result = await service.run_scheduled_cleanup()
    assert result["success"] is True
    assert result["total_files_deleted"] == 3
    assert result["total_storage_freed_mb"] == 1.5
