from unittest.mock import MagicMock
import asyncio
from app.services.dashboard_metrics import DashboardMetricsService


def test_refresh_cache_counts_files():
    db = MagicMock()
    db.query.return_value.filter.return_value.all.return_value = [1,2,3]
    service = DashboardMetricsService(db)
    result = asyncio.run(service.refresh_cache(user_id=1))
    assert result['files_processed'] == 3
    assert result['metrics_updated'] == 30
