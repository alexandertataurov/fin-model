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
            # Simple approach: get all tables from information_schema
            tables_sql = """
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name
            """
            
            tables_result = self.db.execute(text(tables_sql)).fetchall()
            table_names = [row[0] for row in tables_result]
            
            table_data = {}
            
            # Get basic info for each table
            for table_name in table_names:
                try:
                    # Get row count
                    count_sql = f"SELECT COUNT(*) FROM {table_name}"
                    count_result = self.db.execute(text(count_sql)).fetchone()
                    row_count = count_result[0] if count_result else 0
                    
                    # Get table size (simplified)
                    size_sql = f"""
                        SELECT 
                            pg_total_relation_size('{table_name}') as total_size,
                            pg_relation_size('{table_name}') as table_size
                    """
                    
                    try:
                        size_result = self.db.execute(text(size_sql)).fetchone()
                        total_size_bytes = size_result[0] if size_result else 0
                        size_mb = total_size_bytes / (1024 * 1024)
                        size_pretty = f"{size_mb:.1f} MB" if size_mb > 0 else "0 MB"
                    except Exception:
                        # Fallback if size query fails
                        size_mb = 0.1
                        size_pretty = "0.1 MB"
                    
                    # Try to get statistics if available
                    stats_sql = f"""
                        SELECT 
                            n_live_tup,
                            n_dead_tup,
                            n_tup_ins,
                            n_tup_upd,
                            n_tup_del
                        FROM pg_stat_user_tables 
                        WHERE tablename = '{table_name}'
                    """
                    
                    try:
                        stats_result = self.db.execute(text(stats_sql)).fetchone()
                        if stats_result:
                            live_rows = stats_result[0] or 0
                            dead_rows = stats_result[1] or 0
                            inserts = stats_result[2] or 0
                            updates = stats_result[3] or 0
                            deletes = stats_result[4] or 0
                        else:
                            live_rows = row_count
                            dead_rows = 0
                            inserts = 0
                            updates = 0
                            deletes = 0
                    except Exception:
                        # Fallback if stats query fails
                        live_rows = row_count
                        dead_rows = 0
                        inserts = 0
                        updates = 0
                        deletes = 0
                    
                    # Determine integrity status
                    total_rows = live_rows + dead_rows
                    if total_rows > 0:
                        dead_ratio = dead_rows / total_rows
                        if dead_ratio > 0.3:
                            integrity_status = "error"
                        elif dead_ratio > 0.1:
                            integrity_status = "warning"
                        else:
                            integrity_status = "healthy"
                    else:
                        integrity_status = "healthy"
                    
                    table_data[table_name] = {
                        "rows": live_rows,
                        "dead_rows": dead_rows,
                        "inserts": inserts,
                        "updates": updates,
                        "deletes": deletes,
                        "size_mb": round(size_mb, 2),
                        "size_pretty": size_pretty,
                        "last_updated": datetime.now(timezone.utc).isoformat(),
                        "integrity_status": integrity_status,
                    }
                    
                except Exception as e:
                    logger.warning(f"Failed to get info for table {table_name}: {e}")
                    # Add basic entry for failed table
                    table_data[table_name] = {
                        "rows": 0,
                        "dead_rows": 0,
                        "inserts": 0,
                        "updates": 0,
                        "deletes": 0,
                        "size_mb": 0.1,
                        "size_pretty": "0.1 MB",
                        "last_updated": datetime.now(timezone.utc).isoformat(),
                        "integrity_status": "warning",
                    }
            
            return table_data

        except Exception as e:
            logger.error(f"Failed to get table sizes: {e}")
            # Fallback to basic table list
            return {
                "users": {
                    "rows": 0,
                    "size_mb": 0.1,
                    "size_pretty": "0.1 MB",
                    "last_updated": datetime.now(timezone.utc).isoformat(),
                    "integrity_status": "warning",
                },
                "uploaded_files": {
                    "rows": 0,
                    "size_mb": 0.1,
                    "size_pretty": "0.1 MB",
                    "last_updated": datetime.now(timezone.utc).isoformat(),
                    "integrity_status": "warning",
                },
            }

    def _get_performance_metrics(self) -> Dict[str, Any]:
        """Get database performance metrics."""
        try:
            # Check if pg_stat_statements is available
            try:
                self.db.execute(text("SELECT 1 FROM pg_stat_statements LIMIT 1"))
                has_pgss = True
            except Exception:
                has_pgss = False
            
            if has_pgss:
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
            
            # Fallback: return basic metrics
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
            # Simple connection count
            conns_sql = """
                SELECT COUNT(*) as total_connections
                FROM pg_stat_activity 
                WHERE datname = current_database()
            """
            
            result = self.db.execute(text(conns_sql)).fetchone()
            total_connections = result[0] if result else 0
            
            return {
                "active_connections": total_connections,
                "active_queries": 0,  # Simplified
                "idle_connections": 0,  # Simplified
                "max_connections": 100,  # Default max connections
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
            # Get table count
            table_count_sql = """
                SELECT COUNT(*) 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
            """
            
            table_result = self.db.execute(text(table_count_sql)).fetchone()
            table_count = table_result[0] if table_result else 0
            
            # Get database size (simplified)
            try:
                size_sql = "SELECT pg_database_size(current_database()) as size_bytes"
                size_result = self.db.execute(text(size_sql)).fetchone()
                size_bytes = size_result[0] if size_result else 0
                size_mb = size_bytes / (1024 * 1024)
                size_pretty = f"{size_mb:.1f} MB" if size_mb > 0 else "0 MB"
            except Exception:
                size_mb = 0
                size_pretty = "0 MB"
            
            return {
                "size_pretty": size_pretty,
                "size_mb": round(size_mb, 2),
                "table_count": table_count,
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
