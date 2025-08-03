import io
import os
import types
import pytest

from app.services import cloud_storage


@pytest.mark.asyncio
async def test_local_storage_roundtrip(tmp_path):
    service = cloud_storage.LocalStorageService()
    service.storage_path = tmp_path

    data = io.BytesIO(b"hello")
    path = await service.upload_file(data, "nested/file.txt")
    assert os.path.exists(path)

    assert await service.file_exists("nested/file.txt")
    content = await service.download_file("nested/file.txt")
    assert content == b"hello"

    url = await service.get_file_url("nested/file.txt")
    assert "nested" in url and "file.txt" in url

    assert await service.delete_file("nested/file.txt")
    assert not await service.file_exists("nested/file.txt")


class DummyS3Client:
    def __init__(self):
        self.store = {}

    def upload_fileobj(self, fileobj, bucket, key, ExtraArgs=None):
        self.store[key] = fileobj.read()

    def get_object(self, Bucket, Key):
        return {"Body": io.BytesIO(self.store[Key])}

    def delete_object(self, Bucket, Key):
        self.store.pop(Key, None)

    def generate_presigned_url(self, client_method, Params, ExpiresIn):
        return f"https://{Params['Bucket']}.s3.amazonaws.com/{Params['Key']}"

    def head_object(self, Bucket, Key):
        if Key not in self.store:
            raise Exception("missing")


@pytest.mark.asyncio
async def test_s3_storage_roundtrip(monkeypatch):
    monkeypatch.setattr(cloud_storage, "AWS_AVAILABLE", True)
    monkeypatch.setattr(
        cloud_storage,
        "boto3",
        types.SimpleNamespace(client=lambda *args, **kwargs: DummyS3Client()),
        raising=False,
    )
    monkeypatch.setattr(cloud_storage, "ClientError", Exception, raising=False)

    service = cloud_storage.S3StorageService()
    await service.upload_file(io.BytesIO(b"data"), "f.txt")
    assert await service.file_exists("f.txt")
    assert await service.download_file("f.txt") == b"data"
    url = await service.get_file_url("f.txt")
    assert url.startswith("https://")
    assert await service.delete_file("f.txt")
    assert not await service.file_exists("f.txt")
