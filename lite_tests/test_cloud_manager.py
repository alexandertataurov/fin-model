import sys
import types

# Provide minimal stubs to satisfy imports
mock_file = types.ModuleType('app.models.file')
class UploadedFile:
    id = 0
    uploaded_by_id = 0
    parsed_data = None
    status = ""
class FileStatus(str):
    COMPLETED = 'completed'
mock_user = types.ModuleType("app.models.user")
class User: pass
mock_user.User = User
sys.modules.setdefault("app.models.user", mock_user)
mock_parser = types.ModuleType("app.services.excel_parser")
class ParsedData: pass
class SheetInfo: pass
class CellInfo: pass
class DataType: TEXT="text"; NUMBER="number"
class SheetType: PROFIT_LOSS="profit_loss"
mock_parser.ParsedData=ParsedData
mock_parser.SheetInfo=SheetInfo
mock_parser.CellInfo=CellInfo
mock_parser.DataType=DataType
mock_parser.SheetType=SheetType
sys.modules.setdefault("app.services.excel_parser", mock_parser)
mock_file.UploadedFile = UploadedFile
mock_file.FileStatus = FileStatus
import os
sys.modules.setdefault('app.models.file', mock_file)
# Stub pandas which is heavy
sys.modules.setdefault('pandas', types.ModuleType('pandas'))

import io
import pytest
from app.services import cloud_storage
from app.services.dashboard_metrics import DashboardMetricsService


@pytest.mark.asyncio
async def test_cloud_storage_manager_filename_and_stats(tmp_path, monkeypatch):
    monkeypatch.setenv('STORAGE_PROVIDER', 'local')
    manager = cloud_storage.CloudStorageManager()
    manager.storage_provider.storage_path = tmp_path
    name = manager.generate_secure_filename('report.xlsx', user_id=1)
    saved = await manager.upload_file(io.BytesIO(b"data"), name, user_id=1)
    rel = os.path.relpath(saved, manager.storage_provider.storage_path)
    assert await manager.file_exists(rel)
    assert await manager.download_file(rel) == b"data"


class DummyQuery:
    def __init__(self, single=None, multiple=None):
        self.single = single
        self.multiple = multiple or []
    def filter(self, *args, **kwargs):
        return self
    def order_by(self, *args, **kwargs):
        return self
    def first(self):
        return self.single
    def all(self):
        return self.multiple

class DummyDB:
    def __init__(self, single=None, multiple=None):
        self.single = single
        self.multiple = multiple or []
    def query(self, *args, **kwargs):
        return DummyQuery(self.single, self.multiple)


@pytest.mark.asyncio
async def test_dashboard_refresh_cache_variants():
    file = types.SimpleNamespace(parsed_data='{}', uploaded_by_id=1, status='completed')
    service = DashboardMetricsService(DummyDB(single=file))
    result = await service.refresh_cache(user_id=1, file_id=1)
    assert result['files_processed'] == 1
    assert result['metrics_updated'] == 10

    files = [types.SimpleNamespace(parsed_data='{}', uploaded_by_id=1, status='completed') for _ in range(2)]
    service2 = DashboardMetricsService(DummyDB(multiple=files))
    result2 = await service2.refresh_cache(user_id=1)
    assert result2['files_processed'] == 2
    assert result2['metrics_updated'] == 20

    file_none = types.SimpleNamespace(parsed_data=None, uploaded_by_id=1, status='completed')
    service3 = DashboardMetricsService(DummyDB(single=file_none))
    result3 = await service3.refresh_cache(user_id=1, file_id=1)
    assert result3['files_processed'] == 0
    assert result3['metrics_updated'] == 0
