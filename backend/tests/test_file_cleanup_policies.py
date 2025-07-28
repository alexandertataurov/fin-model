from app.services.file_cleanup import FileCleanupService


def test_default_policies_loaded():
    service = FileCleanupService.__new__(FileCleanupService)
    service.db_session = None
    service.file_service = None
    policies = FileCleanupService._load_retention_policies(service)
    assert any(p.name == "failed_files" for p in policies)
