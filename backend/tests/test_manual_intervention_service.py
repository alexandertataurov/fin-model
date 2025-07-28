from unittest.mock import MagicMock, patch
from app.services.manual_intervention import ManualInterventionService, InterventionType, InterventionPriority


def test_requires_approval_high_risk():
    svc = ManualInterventionService()
    assert svc._requires_approval(InterventionType.MANUAL_DATA_ENTRY, InterventionPriority.NORMAL)
    assert svc._requires_approval(InterventionType.STATUS_OVERRIDE, InterventionPriority.EMERGENCY)


def test_validate_admin_permissions_true():
    svc = ManualInterventionService()
    user = MagicMock(is_active=True, is_admin=True)
    with patch('app.services.manual_intervention.SessionLocal') as session:
        session.return_value.__enter__.return_value.query.return_value.filter.return_value.first.return_value = user
        assert svc._validate_admin_permissions(1)


def test_validate_admin_permissions_false():
    svc = ManualInterventionService()
    with patch('app.services.manual_intervention.SessionLocal') as session:
        session.return_value.__enter__.return_value.query.return_value.filter.return_value.first.return_value = None
        assert not svc._validate_admin_permissions(2)
