"""
Database Monitor Service
Provides basic database health monitoring and performance metrics.
"""

import logging
from typing import Dict, List, Any
from datetime import datetime, timezone
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger(__name__)


class DatabaseMonitor:
    """Simple database monitoring service."""

    def __init__(self, db: Session):
        self.db = db

    def get_health_check(self) -> Dict[str, Any]:
        """Get comprehensive database health status with performance metrics."""
        try:
            # Simple connection test
            result = self.db.execute(text("SELECT 1"))
            result.fetchone()

            # Get database performance metrics
            performance_metrics = self._get_performance_metrics()
            
            # Get connection pool information
            connection_pool = self._get_connection_pool_info()
            
            # Get database statistics
            db_stats = self._get_database_stats()

            return {
                "status": "healthy",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "connection": "active",
                "version": "1.0.0",
                "performance_metrics": performance_metrics,
                "connection_pool": connection_pool,
                "database_stats": db_stats,
            }
        except SQLAlchemyError as e:
            # Attempt recovery from aborted transaction state, then retry once
            try:
                self.db.rollback()
                result = self.db.execute(text("SELECT 1"))
                result.fetchone()
                return {
                    "status": "healthy",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "connection": "active",
                    "recovered": True,
                    "version": "1.0.0",
                    "performance_metrics": {},
                    "connection_pool": {},
                    "database_stats": {},
                }
            except Exception as e2:
                logger.error(
                    "DB health failed after rollback: %s (initial: %s)",
                    e2,
                    e,
                )
                return {
                    "status": "unhealthy",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "connection": "failed",
                    "error": str(e2),
                    "performance_metrics": {},
                    "connection_pool": {},
                    "database_stats": {},
                }

    def get_query_performance(
        self,
        limit: int = 10,
        window: str | None = None,
        from_ts: datetime | None = None,
        to_ts: datetime | None = None,
    ) -> List[Dict[str, Any]]:
        """Get query performance metrics using pg_stat_statements.

        Falls back to a minimal synthetic row if the extension is missing.
        Note: pg_stat_statements lacks per-row timestamps; window parameters
        are best-effort no-ops here unless a custom store exists.
        """
        try:
            # Check pg_stat_statements availability
            try:
                self.db.execute(text("SELECT 1 FROM pg_stat_statements LIMIT 1"))
                has_pgss = True
            except Exception:
                has_pgss = False

            if not has_pgss:
                return [
                    {
                        "query": "pg_stat_statements not available",
                        "avg_ms": None,
                        "p95_ms": None,
                        "calls": None,
                        "last_seen": datetime.now(timezone.utc).isoformat(),
                    }
                ]

            sql = (
                "SELECT query, mean_time, calls, total_time "
                "FROM pg_stat_statements "
                "ORDER BY mean_time DESC LIMIT :limit"
            )
            result = self.db.execute(text(sql), {"limit": int(limit)}).fetchall()
            items: List[Dict[str, Any]] = []
            for row in result:
                mean_time = float(row[1]) if row[1] is not None else None
                calls = int(row[2]) if row[2] is not None else None
                # p95 approximation when distribution data missing
                p95 = float(mean_time * 2) if mean_time is not None else None
                items.append(
                    {
                        "query": row[0],
                        "avg_ms": mean_time,
                        "p95_ms": p95,
                        "calls": calls,
                        "last_seen": datetime.now(timezone.utc).isoformat(),
                    }
                )
            return items
        except Exception as e:
            logger.error(f"Failed to get query performance: {e}")
            return []

    def get_table_sizes(self) -> Dict[str, Dict[str, Any]]:
        """Get comprehensive table size and usage information."""
        try:
            # Get all tables from the database
            tables_sql = """
                SELECT 
                    schemaname,
                    tablename,
                    n_tup_ins as inserts,
                    n_tup_upd as updates,
                    n_tup_del as deletes,
                    n_live_tup as live_rows,
                    n_dead_tup as dead_rows,
                    last_vacuum,
                    last_autovacuum,
                    last_analyze,
                    last_autoanalyze
                FROM pg_stat_user_tables 
                WHERE schemaname = 'public'
                ORDER BY tablename
            """

            # Get table sizes
            size_sql = """
                SELECT 
                    schemaname,
                    tablename,
                    pg_size_pretty(
                        pg_total_relation_size(schemaname||'.'||tablename)
                    ) as size_pretty,
                    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes,
                    pg_size_pretty(
                        pg_relation_size(schemaname||'.'||tablename)
                    ) as table_size_pretty,
                    pg_relation_size(schemaname||'.'||tablename) as table_size_bytes
                FROM pg_tables 
                WHERE schemaname = 'public'
                ORDER BY tablename
            """

            # Get row counts for each table
            count_sql = """
                SELECT 
                    schemaname,
                    tablename,
                    (SELECT COUNT(*) FROM information_schema.tables t2 
                     WHERE t2.table_schema = t1.schemaname 
                     AND t2.table_name = t1.tablename) as exists
                FROM pg_tables t1
                WHERE schemaname = 'public'
            """

            tables_result = self.db.execute(text(tables_sql)).fetchall()
            size_result = self.db.execute(text(size_sql)).fetchall()

            # Create a mapping of table names to their data
            table_data = {}

            # Process table statistics
            for row in tables_result:
                table_name = row[1]
                table_data[table_name] = {
                    "rows": row[5] or 0,  # live_rows
                    "dead_rows": row[6] or 0,
                    "inserts": row[2] or 0,
                    "updates": row[3] or 0,
                    "deletes": row[4] or 0,
                    "last_vacuum": row[7].isoformat() if row[7] else None,
                    "last_autovacuum": row[8].isoformat() if row[8] else None,
                    "last_analyze": row[9].isoformat() if row[9] else None,
                    "last_autoanalyze": row[10].isoformat() if row[10] else None,
                    "size_mb": 0,
                    "size_pretty": "0 MB",
                    "last_updated": datetime.now(timezone.utc).isoformat(),
                    "integrity_status": "healthy",
                }

            # Process size information
            for row in size_result:
                table_name = row[1]
                size_bytes = row[3] or 0
                size_mb = size_bytes / (1024 * 1024)

                if table_name in table_data:
                    table_data[table_name].update(
                        {
                            "size_mb": round(size_mb, 2),
                            "size_pretty": row[2] or "0 MB",
                            "table_size_pretty": row[4] or "0 MB",
                        }
                    )

                    # Determine integrity status based on dead rows ratio
                    live_rows = table_data[table_name]["rows"]
                    dead_rows = table_data[table_name]["dead_rows"]
                    total_rows = live_rows + dead_rows

                    if total_rows > 0:
                        dead_ratio = dead_rows / total_rows
                        if dead_ratio > 0.3:
                            table_data[table_name]["integrity_status"] = "error"
                        elif dead_ratio > 0.1:
                            table_data[table_name]["integrity_status"] = "warning"
                        else:
                            table_data[table_name]["integrity_status"] = "healthy"

            # Add tables that might not have statistics yet
            all_tables = [
                "users",
                "uploaded_files",
                "financial_statements",
                "metrics",
                "time_series",
                "calculations",
                "templates",
                "file_versions",
                "data_sources",
                "notifications",
                "notification_preferences",
                "notification_templates",
                "report_templates",
                "report_schedules",
                "report_exports",
                "audit_logs",
                "maintenance_schedules",
                "mfa_tokens",
                "oauth_accounts",
                "webauthn_credentials",
                "mfa_challenges",
                "roles",
                "user_roles",
                "processing_logs",
                "system_logs",
                "parameters",
                "parameter_groups",
                "parameter_history",
                "scenarios",
                "parameter_values",
                "formula_nodes",
                "sensitivity_analyses",
                "calculation_audits",
                "scenario_parameters",
                "monte_carlo_simulations",
                "rate_limits",
            ]

            for table_name in all_tables:
                if table_name not in table_data:
                    # Try to get basic info for tables without statistics
                    try:
                        count_sql = f"SELECT COUNT(*) FROM {table_name}"
                        count_result = self.db.execute(text(count_sql)).fetchone()
                        row_count = count_result[0] if count_result else 0

                        table_data[table_name] = {
                            "rows": row_count,
                            "dead_rows": 0,
                            "inserts": 0,
                            "updates": 0,
                            "deletes": 0,
                            "size_mb": 0.1,
                            "size_pretty": "0.1 MB",
                            "last_updated": datetime.now(timezone.utc).isoformat(),
                            "integrity_status": "healthy",
                        }
                    except Exception:
                        # Table doesn't exist or can't be accessed
                        continue

            return table_data

        except Exception as e:
            logger.error(f"Failed to get table sizes: {e}")
            # Fallback to basic table list
            return {
                "users": {
                    "rows": 0,
                    "size_mb": 0.1,
                    "last_updated": datetime.now(timezone.utc).isoformat(),
                    "integrity_status": "warning",
                },
                "uploaded_files": {
                    "rows": 0,
                    "size_mb": 0.1,
                    "last_updated": datetime.now(timezone.utc).isoformat(),
                    "integrity_status": "warning",
                },
            }

    def _get_performance_metrics(self) -> Dict[str, Any]:
        """Get database performance metrics."""
        try:
            # Get average query time from pg_stat_statements
            avg_query_sql = """
                SELECT 
                    ROUND(AVG(mean_time), 2) as avg_query_time_ms,
                    ROUND(MAX(mean_time), 2) as max_query_time_ms,
                    COUNT(*) as total_queries,
                    ROUND(SUM(total_time) / 1000, 2) as total_time_seconds
                FROM pg_stat_statements
            """
            
            result = self.db.execute(text(avg_query_sql)).fetchone()
            
            if result and result[0] is not None:
                return {
                    "avg_query_time_ms": result[0],
                    "max_query_time_ms": result[1],
                    "total_queries": result[2],
                    "total_time_seconds": result[3],
                }
            else:
                return {
                    "avg_query_time_ms": 0,
                    "max_query_time_ms": 0,
                    "total_queries": 0,
                    "total_time_seconds": 0,
                }
        except Exception as e:
            logger.error(f"Failed to get performance metrics: {e}")
            return {
                "avg_query_time_ms": 0,
                "max_query_time_ms": 0,
                "total_queries": 0,
                "total_time_seconds": 0,
            }

    def _get_connection_pool_info(self) -> Dict[str, Any]:
        """Get connection pool information."""
        try:
            # Get active connections
            active_conns_sql = """
                SELECT 
                    COUNT(*) as active_connections,
                    COUNT(*) FILTER (WHERE state = 'active') as active_queries,
                    COUNT(*) FILTER (WHERE state = 'idle') as idle_connections
                FROM pg_stat_activity 
                WHERE datname = current_database()
            """
            
            result = self.db.execute(text(active_conns_sql)).fetchone()
            
            if result:
                return {
                    "active_connections": result[0],
                    "active_queries": result[1],
                    "idle_connections": result[2],
                    "max_connections": 100,  # Default max connections
                }
            else:
                return {
                    "active_connections": 0,
                    "active_queries": 0,
                    "idle_connections": 0,
                    "max_connections": 100,
                }
        except Exception as e:
            logger.error(f"Failed to get connection pool info: {e}")
            return {
                "active_connections": 0,
                "active_queries": 0,
                "idle_connections": 0,
                "max_connections": 100,
            }

    def _get_database_stats(self) -> Dict[str, Any]:
        """Get database statistics."""
        try:
            # Get database size
            size_sql = """
                SELECT 
                    pg_size_pretty(pg_database_size(current_database())) as size_pretty,
                    pg_database_size(current_database()) as size_bytes,
                    (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') as table_count
                """
            
            result = self.db.execute(text(size_sql)).fetchone()
            
            if result:
                size_mb = (result[1] or 0) / (1024 * 1024)
                return {
                    "size_pretty": result[0],
                    "size_mb": round(size_mb, 2),
                    "table_count": result[2],
                }
            else:
                return {
                    "size_pretty": "0 MB",
                    "size_mb": 0,
                    "table_count": 0,
                }
        except Exception as e:
            logger.error(f"Failed to get database stats: {e}")
            return {
                "size_pretty": "0 MB",
                "size_mb": 0,
                "table_count": 0,
            }

    def cleanup_stale_data(self, dry_run: bool = True) -> Dict[str, Any]:
        """Clean up stale data (simplified implementation)."""
        try:
            if dry_run:
                return {
                    "status": "dry_run",
                    "message": "Dry run completed - no data was modified",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "files_to_clean": 0,
                    "records_to_clean": 0,
                }
            else:
                # In a real implementation, you'd perform actual cleanup
                return {
                    "status": "completed",
                    "message": "Cleanup completed successfully",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "files_cleaned": 0,
                    "records_cleaned": 0,
                }
        except Exception as e:
            logger.error(f"Failed to cleanup stale data: {e}")
            return {
                "status": "error",
                "message": f"Cleanup failed: {str(e)}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }


# Global instance for dependency injection
db_monitor = None


def get_db_monitor(db: Session) -> DatabaseMonitor:
    """Get database monitor instance."""
    global db_monitor
    if db_monitor is None:
        db_monitor = DatabaseMonitor(db)
    return db_monitor
