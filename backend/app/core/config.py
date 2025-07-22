import os
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, PostgresDsn, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Basic app settings
    PROJECT_NAME: str = "FinVision API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://user:password@localhost/finvision"
    )

    # Test database
    TEST_DATABASE_URL: str = os.getenv("TEST_DATABASE_URL", "sqlite:///./test.db")

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = []

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Set default CORS origins
        if not self.BACKEND_CORS_ORIGINS:
            cors_origins = os.getenv(
                "BACKEND_CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
            )
            if cors_origins == "*":
                self.BACKEND_CORS_ORIGINS = ["*"]
            else:
                self.BACKEND_CORS_ORIGINS = [
                    origin.strip() for origin in cors_origins.split(",")
                ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str):
            if v == "*":
                return ["*"]
            elif not v.startswith("["):
                return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # JWT
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Email settings
    SMTP_HOST: str = os.getenv("SMTP_HOST", "localhost")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_TLS: bool = os.getenv("SMTP_TLS", "true").lower() == "true"
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")

    # Frontend URL
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # File Upload Settings
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB default
    UPLOAD_FOLDER: str = os.getenv("UPLOAD_FOLDER", "uploads")
    ALLOWED_EXTENSIONS: List[str] = [".xlsx", ".xls", ".csv"]

    # Celery/Redis Settings
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379")
    CELERY_RESULT_BACKEND: str = os.getenv(
        "CELERY_RESULT_BACKEND", "redis://localhost:6379"
    )

    # Cloud Storage Settings
    STORAGE_PROVIDER: str = os.getenv("STORAGE_PROVIDER", "local")  # local, s3, azure
    AWS_S3_BUCKET: str = os.getenv("AWS_S3_BUCKET", "finvision-files")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AZURE_CONTAINER_NAME: str = os.getenv("AZURE_CONTAINER_NAME", "finvision-files")
    AZURE_STORAGE_CONNECTION_STRING: str = os.getenv(
        "AZURE_STORAGE_CONNECTION_STRING", ""
    )

    # Virus Scanning Settings
    VIRUS_SCANNERS: List[str] = os.getenv("VIRUS_SCANNERS", "basic").split(",")
    CLAMAV_HOST: str = os.getenv("CLAMAV_HOST", "localhost")
    CLAMAV_PORT: int = int(os.getenv("CLAMAV_PORT", "3310"))
    VIRUSTOTAL_API_KEY: str = os.getenv("VIRUSTOTAL_API_KEY", "")

    # File Retention Settings
    FAILED_FILES_RETENTION_DAYS: int = int(
        os.getenv("FAILED_FILES_RETENTION_DAYS", "7")
    )
    COMPLETED_FILES_RETENTION_DAYS: int = int(
        os.getenv("COMPLETED_FILES_RETENTION_DAYS", "90")
    )
    CANCELLED_FILES_RETENTION_DAYS: int = int(
        os.getenv("CANCELLED_FILES_RETENTION_DAYS", "3")
    )
    LARGE_FILES_RETENTION_DAYS: int = int(os.getenv("LARGE_FILES_RETENTION_DAYS", "30"))
    PREMIUM_FILES_RETENTION_DAYS: int = int(
        os.getenv("PREMIUM_FILES_RETENTION_DAYS", "180")
    )
    DEMO_FILES_RETENTION_DAYS: int = int(os.getenv("DEMO_FILES_RETENTION_DAYS", "1"))

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
