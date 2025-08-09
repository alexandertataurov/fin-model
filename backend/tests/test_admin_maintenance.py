from fastapi.testclient import TestClient

from app.models.base import SessionLocal
from app.models.maintenance import MaintenanceSchedule
from main import app


def test_maintenance_schedules_roundtrip():
    client = TestClient(app)

    # Ensure clean slate
    with SessionLocal() as db:
        db.query(MaintenanceSchedule).delete()
        db.commit()

    # PUT schedules
    payload = {
        "items": [
            {
                "id": "daily-cleanup",
                "name": "Daily Cleanup",
                "task": "cleanup",
                "schedule": "0 2 * * *",
                "enabled": True,
            },
            {
                "id": "weekly-vacuum",
                "name": "Weekly Vacuum",
                "task": "vacuum",
                "schedule": "0 3 * * 0",
                "enabled": False,
            },
        ]
    }
    r = client.put("/api/v1/admin/maintenance/schedules", json=payload)
    assert r.status_code == 200, r.text

    # GET schedules
    r = client.get("/api/v1/admin/maintenance/schedules")
    assert r.status_code == 200
    data = r.json()
    assert "items" in data
    ids = {i["id"] for i in data["items"]}
    assert ids == {"daily-cleanup", "weekly-vacuum"}
