import pytest
from app.services.dashboard_metrics import DashboardMetricsService


def test_demo_overview_metrics():
    service = DashboardMetricsService(db=None)
    data = service._get_demo_overview_metrics()
    assert "key_metrics" in data
    assert "summary" in data


def test_demo_pl_metrics():
    service = DashboardMetricsService(db=None)
    data = service._get_demo_pl_metrics()
    assert data["metrics"]
    assert "charts" in data
    assert "data_quality" in data


def test_demo_trends_and_kpis():
    service = DashboardMetricsService(db=None)
    trends = service._get_demo_trends("revenue")
    assert "time_series" in trends
    kpis = service._get_demo_kpis()
    assert any(k["name"] == "ROE" for k in kpis["kpis"])

