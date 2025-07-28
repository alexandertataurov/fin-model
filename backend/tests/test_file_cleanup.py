from datetime import datetime, timedelta
from types import SimpleNamespace
from app.services.file_cleanup import FileRetentionPolicy
from app.models.file import UploadedFile, FileStatus


def make_file(status=FileStatus.COMPLETED, days=10, size=10*1024*1024):
    return SimpleNamespace(
        status=status,
        file_type='demo',
        file_size=size,
        created_at=datetime.utcnow() - timedelta(days=days),
        file_path='x'
    )


def test_policy_applies_and_expired():
    policy = FileRetentionPolicy(name='demo', description='d', retention_days=5,
                                 applies_to_status=[FileStatus.COMPLETED],
                                 applies_to_file_types=['demo'],
                                 size_threshold_mb=5)
    file_rec = make_file()
    assert policy.applies_to_file(file_rec)
    assert policy.is_file_expired(file_rec)


def test_policy_non_applicable():
    policy = FileRetentionPolicy(name='demo', description='d', retention_days=5)
    file_rec = make_file(status=FileStatus.FAILED)
    assert policy.applies_to_file(file_rec)
    file_rec.created_at = datetime.utcnow()
    assert not policy.is_file_expired(file_rec)
