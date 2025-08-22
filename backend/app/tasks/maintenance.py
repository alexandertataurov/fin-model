"""
Maintenance tasks for database operations.
"""
from typing import Dict, Any, Optional
from celery import Task
from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import text, bindparam
from datetime import datetime, timezone
import subprocess
import os
import json
import logging

logger = logging.getLogger(__name__)


class DatabaseTask(Task):
    """Base task for database operations."""

    def __call__(self, *args, **kwargs):
        with SessionLocal() as db:
            return self.run_with_db(db, *args, **kwargs)

    def run_with_db(self, db: Session, *args, **kwargs):
        raise NotImplementedError


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.maintenance.backup_database",
)
def backup_database(self, db: Session) -> Dict[str, Any]:
    """
    Create a database backup.

    Returns:
        Dict with backup results and file path
    """
    try:
        # Update progress
        self.update_state(
            state="PROGRESS",
            meta={
                "current": 10,
                "total": 100,
                "status": "Initiating database backup...",
            },
        )

        # Create backup directory
        backup_dir = "/app/backups"
        os.makedirs(backup_dir, exist_ok=True)

        # Generate backup filename
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        backup_file = f"{backup_dir}/finvision_backup_{timestamp}.sql"

        self.update_state(
            state="PROGRESS",
            meta={
                "current": 30,
                "total": 100,
                "status": "Creating backup file...",
            },
        )

        # Get database URL from settings
        from app.core.config import settings

        db_url = settings.DATABASE_URL

        # Extract database connection details
        # Note: In production, use proper pg_dump with credentials
        cmd = [
            "pg_dump",
            "--no-owner",
            "--no-privileges",
            "--clean",
            "--if-exists",
            "--file",
            backup_file,
            db_url,
        ]

        self.update_state(
            state="PROGRESS",
            meta={
                "current": 50,
                "total": 100,
                "status": "Running pg_dump...",
            },
        )

        # Run backup command
        result = subprocess.run(
            cmd, capture_output=True, text=True, check=True, shell=False
        )

        if result.returncode != 0:
            raise Exception(f"Backup failed: {result.stderr}")

        self.update_state(
            state="PROGRESS",
            meta={
                "current": 90,
                "total": 100,
                "status": "Finalizing backup...",
            },
        )

        # Get file size
        file_size = (
            os.path.getsize(backup_file)
            if os.path.exists(backup_file)
            else 0
        )

        logger.info(
            f"Database backup completed: {backup_file} ({file_size} bytes)"
        )

        return {
            "backup_file": backup_file,
            "file_size": file_size,
            "timestamp": timestamp,
            "status": "completed",
            "message": f"Backup created successfully: {os.path.basename(backup_file)}",
        }

    except Exception as e:
        logger.error(f"Database backup failed: {str(e)}")
        self.update_state(
            state="FAILURE", meta={"error": str(e), "status": "failed"}
        )
        raise


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.maintenance.export_database",
)
def export_database(
    self, db: Session, table: Optional[str] = None, format: str = "csv"
) -> Dict[str, Any]:
    """
    Export database data to specified format.

    Args:
        table: Specific table to export (if None, export all)
        format: Export format (csv, json, sql)

    Returns:
        Dict with export results and file path
    """
    try:
        self.update_state(
            state="PROGRESS",
            meta={
                "current": 10,
                "total": 100,
                "status": "Preparing export...",
            },
        )

        # Create exports directory
        export_dir = "/app/exports"
        os.makedirs(export_dir, exist_ok=True)

        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        table_name = table or "full_database"
        export_file = (
            f"{export_dir}/{table_name}_export_{timestamp}.{format}"
        )

        self.update_state(
            state="PROGRESS",
            meta={
                "current": 30,
                "total": 100,
                "status": f"Exporting {table_name} to {format}...",
            },
        )

        if format == "csv":
            if table:
                # Export specific table to CSV
                query = f"COPY {table} TO STDOUT WITH CSV HEADER"
                with open(export_file, "w") as f:
                    stmt = text(
                        "COPY :tbl TO :path WITH CSV HEADER"
                    ).bindparams(
                        bindparam("tbl", table, literal_execute=True),
                        bindparam("path", export_file),
                    )
                    db.execute(stmt)
            else:
                # Export all tables (simplified)
                tables = [
                    "users",
                    "audit_logs",
                    "uploaded_files",
                    "financial_statements",
                ]
                for i, tbl in enumerate(tables):
                    progress = 30 + (50 * i // len(tables))
                    self.update_state(
                        state="PROGRESS",
                        meta={
                            "current": progress,
                            "total": 100,
                            "status": f"Exporting table {tbl}...",
                        },
                    )
                    tbl_file = f"{export_dir}/{tbl}_export_{timestamp}.csv"
                    stmt = text(
                        "COPY :tbl TO :path WITH CSV HEADER"
                    ).bindparams(
                        bindparam("tbl", tbl, literal_execute=True),
                        bindparam("path", tbl_file),
                    )
                    db.execute(stmt)

        elif format == "json":
            # Export to JSON format
            if table:
                rows = db.execute(
                    text("SELECT * FROM :tbl").bindparams(
                        bindparam("tbl", table, literal_execute=True)
                    )
                ).fetchall()
                data = [dict(row._mapping) for row in rows]
            else:
                # Export key tables to JSON
                data = {}
                tables = ["users", "audit_logs", "uploaded_files"]
                for tbl in tables:
                    rows = db.execute(
                        text("SELECT * FROM :tbl LIMIT 1000").bindparams(
                            bindparam("tbl", tbl, literal_execute=True)
                        )
                    ).fetchall()
                    data[tbl] = [dict(row._mapping) for row in rows]

            with open(export_file, "w") as f:
                json.dump(data, f, indent=2, default=str)

        self.update_state(
            state="PROGRESS",
            meta={
                "current": 90,
                "total": 100,
                "status": "Finalizing export...",
            },
        )

        file_size = (
            os.path.getsize(export_file)
            if os.path.exists(export_file)
            else 0
        )

        logger.info(
            f"Database export completed: {export_file} ({file_size} bytes)"
        )

        return {
            "export_file": export_file,
            "file_size": file_size,
            "table": table_name,
            "format": format,
            "timestamp": timestamp,
            "status": "completed",
            "message": f"Export created successfully: {os.path.basename(export_file)}",
        }

    except Exception as e:
        logger.error(f"Database export failed: {str(e)}")
        self.update_state(
            state="FAILURE", meta={"error": str(e), "status": "failed"}
        )
        raise


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.maintenance.reindex_database",
)
def reindex_database(self, db: Session) -> Dict[str, Any]:
    """
    Rebuild database indexes for better performance.

    Returns:
        Dict with reindex results
    """
    try:
        self.update_state(
            state="PROGRESS",
            meta={
                "current": 10,
                "total": 100,
                "status": "Starting database reindex...",
            },
        )

        # Get all tables with indexes
        tables_query = """
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        """
        tables = db.execute(text(tables_query)).fetchall()

        reindexed_tables = []
        total_tables = len(tables)

        for i, table in enumerate(tables):
            table_name = table.tablename
            progress = 20 + (70 * i // total_tables)

            self.update_state(
                state="PROGRESS",
                meta={
                    "current": progress,
                    "total": 100,
                    "status": f"Reindexing table {table_name}...",
                },
            )

            try:
                # Reindex specific table
                stmt = text("REINDEX TABLE :tbl").bindparams(
                    bindparam("tbl", table_name, literal_execute=True)
                )
                db.execute(stmt)
                reindexed_tables.append(table_name)
                logger.info(f"Reindexed table: {table_name}")
            except Exception as table_error:
                logger.warning(
                    f"Failed to reindex table {table_name}: {table_error}"
                )

        # Update statistics for better query planning
        self.update_state(
            state="PROGRESS",
            meta={
                "current": 95,
                "total": 100,
                "status": "Updating table statistics...",
            },
        )

        db.execute(text("ANALYZE"))

        logger.info(
            f"Database reindex completed. Reindexed {len(reindexed_tables)} tables"
        )

        return {
            "reindexed_tables": reindexed_tables,
            "total_tables": total_tables,
            "status": "completed",
            "message": f"Successfully reindexed {len(reindexed_tables)} out of {total_tables} tables",
        }

    except Exception as e:
        logger.error(f"Database reindex failed: {str(e)}")
        self.update_state(
            state="FAILURE", meta={"error": str(e), "status": "failed"}
        )
        raise


@celery_app.task(name="app.tasks.maintenance.get_task_status")
def get_task_status(task_id: str) -> Dict[str, Any]:
    """
    Get the status of a maintenance task.

    Args:
        task_id: Celery task ID

    Returns:
        Dict with task status information
    """
    result = celery_app.AsyncResult(task_id)

    if result.state == "PENDING":
        response = {
            "state": result.state,
            "current": 0,
            "total": 100,
            "status": "Task is waiting to be processed...",
        }
    elif result.state == "PROGRESS":
        response = {
            "state": result.state,
            "current": result.info.get("current", 0),
            "total": result.info.get("total", 100),
            "status": result.info.get("status", "Processing..."),
        }
    elif result.state == "SUCCESS":
        response = {
            "state": result.state,
            "current": 100,
            "total": 100,
            "status": "Task completed successfully",
            "result": result.info,
        }
    else:  # FAILURE
        response = {
            "state": result.state,
            "current": 0,
            "total": 100,
            "status": f"Task failed: {result.info}",
            "error": str(result.info),
        }

    return response
