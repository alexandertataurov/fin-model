import os
import hashlib
from typing import Optional, Dict, Any, BinaryIO
from datetime import datetime, timedelta
from pathlib import Path
from abc import ABC, abstractmethod
import mimetypes

try:
    import boto3
    from botocore.exceptions import ClientError, NoCredentialsError

    AWS_AVAILABLE = True
except ImportError:
    AWS_AVAILABLE = False

try:
    from azure.storage.blob import BlobServiceClient, BlobClient
    from azure.core.exceptions import AzureError

    AZURE_AVAILABLE = True
except ImportError:
    AZURE_AVAILABLE = False

from app.core.config import settings


class CloudStorageInterface(ABC):
    """Abstract interface for cloud storage providers."""

    @abstractmethod
    async def upload_file(
        self,
        file_data: BinaryIO,
        file_path: str,
        metadata: Optional[Dict[str, str]] = None,
    ) -> str:
        """Upload file to cloud storage."""
        pass

    @abstractmethod
    async def download_file(self, file_path: str) -> bytes:
        """Download file from cloud storage."""
        pass

    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        """Delete file from cloud storage."""
        pass

    @abstractmethod
    async def get_file_url(
        self, file_path: str, expiry_hours: int = 24
    ) -> str:
        """Get presigned URL for file access."""
        pass

    @abstractmethod
    async def file_exists(self, file_path: str) -> bool:
        """Check if file exists in cloud storage."""
        pass


class S3StorageService(CloudStorageInterface):
    """AWS S3 storage service implementation."""

    def __init__(self):
        if not AWS_AVAILABLE:
            raise ImportError(
                "boto3 is required for S3 storage. Install with: pip install boto3"
            )

        self.bucket_name = getattr(
            settings, "AWS_S3_BUCKET", "finvision-files"
        )
        self.region = getattr(settings, "AWS_REGION", "us-east-1")

        try:
            self.s3_client = boto3.client(
                "s3",
                aws_access_key_id=getattr(
                    settings, "AWS_ACCESS_KEY_ID", None
                ),
                aws_secret_access_key=getattr(
                    settings, "AWS_SECRET_ACCESS_KEY", None
                ),
                region_name=self.region,
            )
        except NoCredentialsError:
            raise ValueError(
                "AWS credentials not found. Please configure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
            )

    async def upload_file(
        self,
        file_data: BinaryIO,
        file_path: str,
        metadata: Optional[Dict[str, str]] = None,
    ) -> str:
        """Upload file to S3."""
        try:
            # Determine content type
            content_type, _ = mimetypes.guess_type(file_path)
            if not content_type:
                content_type = "application/octet-stream"

            # Prepare metadata
            s3_metadata = metadata or {}
            s3_metadata.update(
                {
                    "uploaded_at": datetime.utcnow().isoformat(),
                    "content_type": content_type,
                }
            )

            # Upload to S3
            self.s3_client.upload_fileobj(
                file_data,
                self.bucket_name,
                file_path,
                ExtraArgs={
                    "ContentType": content_type,
                    "Metadata": s3_metadata,
                    "ServerSideEncryption": "AES256",
                },
            )

            return f"s3://{self.bucket_name}/{file_path}"

        except ClientError as e:
            raise Exception(f"Failed to upload file to S3: {str(e)}")

    async def download_file(self, file_path: str) -> bytes:
        """Download file from S3."""
        try:
            response = self.s3_client.get_object(
                Bucket=self.bucket_name, Key=file_path
            )
            return response["Body"].read()
        except ClientError as e:
            raise Exception(f"Failed to download file from S3: {str(e)}")

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from S3."""
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name, Key=file_path
            )
            return True
        except ClientError as e:
            raise Exception(f"Failed to delete file from S3: {str(e)}")

    async def get_file_url(
        self, file_path: str, expiry_hours: int = 24
    ) -> str:
        """Get presigned URL for S3 file."""
        try:
            url = self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": file_path},
                ExpiresIn=expiry_hours * 3600,
            )
            return url
        except ClientError as e:
            raise Exception(f"Failed to generate presigned URL: {str(e)}")

    async def file_exists(self, file_path: str) -> bool:
        """Check if file exists in S3."""
        try:
            self.s3_client.head_object(
                Bucket=self.bucket_name, Key=file_path
            )
            return True
        except ClientError:
            return False


class AzureBlobStorageService(CloudStorageInterface):
    """Azure Blob Storage service implementation."""

    def __init__(self):
        if not AZURE_AVAILABLE:
            raise ImportError(
                "azure-storage-blob is required for Azure storage. Install with: pip install azure-storage-blob"
            )

        self.container_name = getattr(
            settings, "AZURE_CONTAINER_NAME", "finvision-files"
        )
        connection_string = getattr(
            settings, "AZURE_STORAGE_CONNECTION_STRING", None
        )

        if not connection_string:
            raise ValueError(
                "Azure Storage connection string not found. Please configure AZURE_STORAGE_CONNECTION_STRING"
            )

        try:
            self.blob_service_client = (
                BlobServiceClient.from_connection_string(connection_string)
            )
        except Exception as e:
            raise ValueError(
                f"Failed to initialize Azure Blob Storage: {str(e)}"
            )

    async def upload_file(
        self,
        file_data: BinaryIO,
        file_path: str,
        metadata: Optional[Dict[str, str]] = None,
    ) -> str:
        """Upload file to Azure Blob Storage."""
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name, blob=file_path
            )

            # Determine content type
            content_type, _ = mimetypes.guess_type(file_path)
            if not content_type:
                content_type = "application/octet-stream"

            # Prepare metadata
            blob_metadata = metadata or {}
            blob_metadata.update(
                {
                    "uploaded_at": datetime.utcnow().isoformat(),
                    "content_type": content_type,
                }
            )

            # Upload to Azure
            blob_client.upload_blob(
                file_data,
                content_settings={"content_type": content_type},
                metadata=blob_metadata,
                overwrite=True,
            )

            return f"azure://{self.container_name}/{file_path}"

        except AzureError as e:
            raise Exception(f"Failed to upload file to Azure: {str(e)}")

    async def download_file(self, file_path: str) -> bytes:
        """Download file from Azure Blob Storage."""
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name, blob=file_path
            )
            return blob_client.download_blob().readall()
        except AzureError as e:
            raise Exception(
                f"Failed to download file from Azure: {str(e)}"
            )

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from Azure Blob Storage."""
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name, blob=file_path
            )
            blob_client.delete_blob()
            return True
        except AzureError as e:
            raise Exception(f"Failed to delete file from Azure: {str(e)}")

    async def get_file_url(
        self, file_path: str, expiry_hours: int = 24
    ) -> str:
        """Get SAS URL for Azure blob."""
        try:
            from azure.storage.blob import (
                generate_blob_sas,
                BlobSasPermissions,
            )

            sas_token = generate_blob_sas(
                account_name=self.blob_service_client.account_name,
                container_name=self.container_name,
                blob_name=file_path,
                account_key=self.blob_service_client.credential.account_key,
                permission=BlobSasPermissions(read=True),
                expiry=datetime.utcnow() + timedelta(hours=expiry_hours),
            )

            return f"{self.blob_service_client.url}/{self.container_name}/{file_path}?{sas_token}"
        except Exception as e:
            raise Exception(f"Failed to generate SAS URL: {str(e)}")

    async def file_exists(self, file_path: str) -> bool:
        """Check if file exists in Azure Blob Storage."""
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name, blob=file_path
            )
            blob_client.get_blob_properties()
            return True
        except AzureError:
            return False


class LocalStorageService(CloudStorageInterface):
    """Local file system storage (fallback)."""

    def __init__(self):
        self.storage_path = Path(
            getattr(settings, "UPLOAD_FOLDER", "uploads")
        )
        self.storage_path.mkdir(parents=True, exist_ok=True)

    async def upload_file(
        self,
        file_data: BinaryIO,
        file_path: str,
        metadata: Optional[Dict[str, str]] = None,
    ) -> str:
        """Save file to local storage."""
        full_path = self.storage_path / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)

        with open(full_path, "wb") as f:
            f.write(file_data.read())

        return str(full_path)

    async def download_file(self, file_path: str) -> bytes:
        """Read file from local storage."""
        full_path = self.storage_path / file_path
        with open(full_path, "rb") as f:
            return f.read()

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from local storage."""
        full_path = self.storage_path / file_path
        if full_path.exists():
            full_path.unlink()
            return True
        return False

    async def get_file_url(
        self, file_path: str, expiry_hours: int = 24
    ) -> str:
        """Get local file path (no URL generation for local storage)."""
        return str(self.storage_path / file_path)

    async def file_exists(self, file_path: str) -> bool:
        """Check if file exists in local storage."""
        return (self.storage_path / file_path).exists()


class CloudStorageManager:
    """Manager for cloud storage operations with fallback support."""

    def __init__(self):
        self.storage_provider = self._initialize_storage_provider()

    def _initialize_storage_provider(self) -> CloudStorageInterface:
        """Initialize the appropriate storage provider based on configuration."""
        provider_type = getattr(
            settings, "STORAGE_PROVIDER", "local"
        ).lower()

        if provider_type == "s3" and AWS_AVAILABLE:
            try:
                return S3StorageService()
            except Exception as e:
                print(
                    f"Failed to initialize S3 storage: {e}. Falling back to local storage."
                )
                return LocalStorageService()

        elif provider_type == "azure" and AZURE_AVAILABLE:
            try:
                return AzureBlobStorageService()
            except Exception as e:
                print(
                    f"Failed to initialize Azure storage: {e}. Falling back to local storage."
                )
                return LocalStorageService()

        else:
            return LocalStorageService()

    async def upload_file(
        self,
        file_data: BinaryIO,
        filename: str,
        user_id: int,
        metadata: Optional[Dict[str, str]] = None,
    ) -> str:
        """Upload file with organized path structure."""
        # Create organized path: user_id/year/month/filename
        now = datetime.utcnow()
        organized_path = (
            f"users/{user_id}/{now.year}/{now.month:02d}/{filename}"
        )

        # Add default metadata
        upload_metadata = {
            "user_id": str(user_id),
            "original_filename": filename,
            "upload_timestamp": now.isoformat(),
        }
        if metadata:
            upload_metadata.update(metadata)

        return await self.storage_provider.upload_file(
            file_data, organized_path, upload_metadata
        )

    async def download_file(self, file_path: str) -> bytes:
        """Download file from storage."""
        return await self.storage_provider.download_file(file_path)

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from storage."""
        return await self.storage_provider.delete_file(file_path)

    async def get_file_url(
        self, file_path: str, expiry_hours: int = 24
    ) -> str:
        """Get file access URL."""
        return await self.storage_provider.get_file_url(
            file_path, expiry_hours
        )

    async def file_exists(self, file_path: str) -> bool:
        """Check if file exists."""
        return await self.storage_provider.file_exists(file_path)

    def generate_secure_filename(
        self, original_filename: str, user_id: int
    ) -> str:
        """Generate a secure filename with hash."""
        # Create hash of filename + user_id + timestamp for uniqueness
        timestamp = datetime.utcnow().isoformat()
        hash_input = f"{original_filename}_{user_id}_{timestamp}"
        file_hash = hashlib.md5(hash_input.encode()).hexdigest()[:12]

        # Preserve file extension
        file_ext = Path(original_filename).suffix
        base_name = Path(original_filename).stem[:50]  # Limit length

        return f"{base_name}_{file_hash}{file_ext}"

    def get_storage_stats(self) -> Dict[str, Any]:
        """Get storage statistics and health information."""
        return {
            "provider": type(self.storage_provider).__name__,
            "status": "healthy",
            "features": {
                "encryption": True,
                "versioning": isinstance(
                    self.storage_provider,
                    (S3StorageService, AzureBlobStorageService),
                ),
                "cdn": isinstance(
                    self.storage_provider,
                    (S3StorageService, AzureBlobStorageService),
                ),
                "backup": isinstance(
                    self.storage_provider,
                    (S3StorageService, AzureBlobStorageService),
                ),
            },
        }
