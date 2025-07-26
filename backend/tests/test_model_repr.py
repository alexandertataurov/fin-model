from app.models.role import Role, RoleType, UserRole
from app.models.file import UploadedFile, FileStatus, ProcessingLog
from app.models.audit import AuditLog, AuditAction
from app.models.user import User


def test_role_repr():
    role = Role(id=1, name=RoleType.ADMIN, display_name="Admin")
    assert "Role" in repr(role)


def test_userrole_repr():
    ur = UserRole(user_id=1, role_id=2)
    assert "UserRole" in repr(ur)


def test_uploadedfile_repr():
    file = UploadedFile(
        id=1,
        filename="file.xlsx",
        stored_filename="s",
        original_filename="o",
        file_path="/tmp/o",
        file_size=10,
        user_id=1,
        status=FileStatus.UPLOADED,
    )
    assert "UploadedFile" in repr(file)


def test_processinglog_repr():
    log = ProcessingLog(id=1, file_id=1, step="parse", message="ok", level="info")
    assert "ProcessingLog" in repr(log)


def test_auditlog_repr():
    log = AuditLog(id=1, user_id=1, action=AuditAction.LOGIN, success="success")
    assert "AuditLog" in repr(log)


def test_user_repr_and_is_locked():
    user = User(id=1, email="a@b.com", username="ab")
    assert "User" in repr(user)
    user.account_locked_until = None
    assert user.is_locked is False
    from datetime import datetime, timedelta
    user.account_locked_until = datetime.utcnow() + timedelta(minutes=5)
    assert user.is_locked is True
