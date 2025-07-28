import pytest
from unittest.mock import patch, MagicMock
from app.services.file_service import FileService

class DummyDB:
    pass


def test_file_service_cleanup_calls_cleanup_service():
    service = FileService(DummyDB())
    with patch('app.services.file_cleanup.FileCleanupService') as mock_cls:
        mock_instance = mock_cls.return_value

        async def fake_cleanup(dry_run=False):
            return {'files_deleted': 1}

        mock_instance.cleanup_expired_files.side_effect = fake_cleanup
        result = service.cleanup_expired_files()
        mock_instance.cleanup_expired_files.assert_called_once_with(dry_run=False)
        assert result == {'files_deleted': 1}

