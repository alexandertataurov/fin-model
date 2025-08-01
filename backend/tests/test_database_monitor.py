from unittest.mock import MagicMock, patch
from sqlalchemy.exc import SQLAlchemyError
from app.services.database_monitor import DatabaseMonitor


def test_get_health_check_connection_error():
    mon = DatabaseMonitor()
    with patch.object(mon, "db") as db:
        db.execute.side_effect = SQLAlchemyError("fail")
        result = mon.get_health_check()
        assert result["status"] == "critical"
        assert not result["database"]["connected"]
        assert result["issues"][0]["type"] == "connection_error"
