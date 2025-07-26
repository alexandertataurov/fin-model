from datetime import datetime, timedelta
from types import SimpleNamespace
from app.services.file_cleanup import FileRetentionPolicy
from app.models.file import FileStatus


def make_file(created_at, file_type="excel", status=FileStatus.COMPLETED, size=1024*1024):
    return SimpleNamespace(file_size=size, file_type=file_type, status=status, created_at=created_at)


def test_policy_applies_by_status():
    policy = FileRetentionPolicy("p", "d", 1, applies_to_status=[FileStatus.COMPLETED])
    file = make_file(datetime.utcnow() - timedelta(days=2))
    assert policy.applies_to_file(file)
    file.status = FileStatus.FAILED
    assert not policy.applies_to_file(file)


def test_policy_size_and_user_tier():
    policy = FileRetentionPolicy("p", "d", 1, size_threshold_mb=2, user_tier_specific="premium")
    file = make_file(datetime.utcnow(), size=3*1024*1024)
    user = SimpleNamespace(tier="premium")
    assert policy.applies_to_file(file, user)
    user.tier = "basic"
    assert not policy.applies_to_file(file, user)
    file.file_size = 1*1024*1024
    assert not policy.applies_to_file(file, user)


def test_is_file_expired():
    policy = FileRetentionPolicy("p", "d", 1)
    old_file = make_file(datetime.utcnow() - timedelta(days=2))
    new_file = make_file(datetime.utcnow())
    assert policy.is_file_expired(old_file)
    assert not policy.is_file_expired(new_file)
