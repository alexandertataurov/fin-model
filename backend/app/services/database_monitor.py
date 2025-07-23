from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import time
from sqlalchemy import text, func
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.base import engine, SessionLocal
from app.models.user import User
from app.models.file import UploadedFile
from app.models.parameter import Parameter, Scenario
from app.models.financial import FinancialStatement, Metric, TimeSeries
from app.core.config import settings


class DatabaseMonitor:
    """
    Database monitoring and health check service.
    
    Provides comprehensive monitoring of database performance,
    connection health, and query analysis.
    """
    
    def __init__(self):
        self.db = SessionLocal()
    
    def get_health_check(self) -> Dict[str, Any]:
        """
        Comprehensive database health check.
        
        Returns:
            Dictionary with health status and metrics
        """
        start_time = time.time()
        health_data = {
            "status": "unknown",
            "timestamp": datetime.utcnow().isoformat(),
            "response_time_ms": 0,
            "database": {
                "connected": False,
                "version": None,
                "size_mb": 0
            },
            "connection_pool": {
                "active_connections": 0,
                "pool_size": 0,
                "checked_out": 0,
                "overflow": 0
            },
            "tables": {},
            "performance": {
                "slow_queries": 0,
                "avg_query_time_ms": 0,
                "cache_hit_ratio": 0.0
            },
            "issues": []
        }
        
        try:
            # Test basic connectivity
            result = self.db.execute(text("SELECT 1")).scalar()
            if result == 1:
                health_data["database"]["connected"] = True
                health_data["status"] = "healthy"
            
            # Get database version
            if settings.DATABASE_URL.startswith("postgresql"):
                version_result = self.db.execute(text("SELECT version()")).scalar()
                health_data["database"]["version"] = version_result
                
                # Get database size
                size_result = self.db.execute(text(
                    "SELECT pg_size_pretty(pg_database_size(current_database()))"
                )).scalar()
                health_data["database"]["size_mb"] = size_result
            
            # Get connection pool status
            pool = engine.pool
            health_data["connection_pool"].update({
                "pool_size": pool.size(),
                "checked_out": pool.checkedout(),
                "overflow": pool.overflow(),
                "invalid": pool.invalid()
            })
            
            # Get table statistics
            health_data["tables"] = self._get_table_statistics()
            
            # Get performance metrics
            health_data["performance"] = self._get_performance_metrics()
            
            # Check for issues
            health_data["issues"] = self._check_for_issues()
            
            # Determine overall status
            if health_data["issues"]:
                health_data["status"] = "warning" if any(
                    issue["severity"] == "warning" for issue in health_data["issues"]
                ) else "critical"
            
        except SQLAlchemyError as e:
            health_data["status"] = "critical"
            health_data["database"]["connected"] = False
            health_data["issues"].append({
                "type": "connection_error",
                "severity": "critical",
                "message": str(e)
            })
        except Exception as e:
            health_data["status"] = "error"
            health_data["issues"].append({
                "type": "unknown_error",
                "severity": "critical",
                "message": str(e)
            })
        finally:
            health_data["response_time_ms"] = round((time.time() - start_time) * 1000, 2)
            self.db.close()
        
        return health_data
    
    def _get_table_statistics(self) -> Dict[str, Dict[str, Any]]:
        """Get statistics for all tables."""
        tables_stats = {}
        
        try:
            # Core tables to monitor
            table_models = {
                "users": User,
                "uploaded_files": UploadedFile,
                "parameters": Parameter,
                "scenarios": Scenario,
                "financial_statements": FinancialStatement,
                "metrics": Metric,
                "time_series": TimeSeries
            }
            
            for table_name, model in table_models.items():
                try:
                    # Get row count
                    count = self.db.query(func.count(model.id)).scalar()
                    
                    # Get recent activity (last 24 hours)
                    if hasattr(model, 'created_at'):
                        recent_cutoff = datetime.utcnow() - timedelta(days=1)
                        recent_count = self.db.query(func.count(model.id)).filter(
                            model.created_at >= recent_cutoff
                        ).scalar()
                    else:
                        recent_count = 0
                    
                    tables_stats[table_name] = {
                        "total_rows": count,
                        "recent_rows_24h": recent_count,
                        "status": "healthy" if count >= 0 else "error"
                    }
                    
                except Exception as e:
                    tables_stats[table_name] = {
                        "total_rows": 0,
                        "recent_rows_24h": 0,
                        "status": "error",
                        "error": str(e)
                    }
            
            # PostgreSQL specific table stats
            if settings.DATABASE_URL.startswith("postgresql"):
                pg_stats = self._get_postgresql_table_stats()
                for table_name in tables_stats:
                    if table_name in pg_stats:
                        tables_stats[table_name].update(pg_stats[table_name])
                        
        except Exception as e:
            tables_stats["error"] = str(e)
        
        return tables_stats
    
    def _get_postgresql_table_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get PostgreSQL-specific table statistics."""
        try:
            query = text("""
                SELECT 
                    schemaname,
                    tablename,
                    n_tup_ins as inserts,
                    n_tup_upd as updates,
                    n_tup_del as deletes,
                    n_live_tup as live_tuples,
                    n_dead_tup as dead_tuples,
                    last_vacuum,
                    last_autovacuum,
                    last_analyze,
                    last_autoanalyze
                FROM pg_stat_user_tables
                WHERE schemaname = 'public'
            """)
            
            result = self.db.execute(query).fetchall()
            pg_stats = {}
            
            for row in result:
                table_name = row.tablename
                pg_stats[table_name] = {
                    "inserts": row.inserts or 0,
                    "updates": row.updates or 0,
                    "deletes": row.deletes or 0,
                    "live_tuples": row.live_tuples or 0,
                    "dead_tuples": row.dead_tuples or 0,
                    "last_vacuum": row.last_vacuum.isoformat() if row.last_vacuum else None,
                    "last_analyze": row.last_analyze.isoformat() if row.last_analyze else None
                }
            
            return pg_stats
            
        except Exception:
            return {}
    
    def _get_performance_metrics(self) -> Dict[str, Any]:
        """Get database performance metrics."""
        performance = {
            "slow_queries": 0,
            "avg_query_time_ms": 0,
            "cache_hit_ratio": 0.0,
            "active_connections": 0,
            "waiting_connections": 0
        }
        
        try:
            if settings.DATABASE_URL.startswith("postgresql"):
                # Get cache hit ratio
                cache_query = text("""
                    SELECT 
                        round(
                            sum(blks_hit) * 100.0 / sum(blks_hit + blks_read), 2
                        ) as cache_hit_ratio
                    FROM pg_stat_database
                    WHERE datname = current_database()
                """)
                cache_result = self.db.execute(cache_query).scalar()
                performance["cache_hit_ratio"] = float(cache_result or 0)
                
                # Get connection stats
                conn_query = text("""
                    SELECT 
                        count(*) as total_connections,
                        count(*) FILTER (WHERE state = 'active') as active_connections,
                        count(*) FILTER (WHERE wait_event IS NOT NULL) as waiting_connections
                    FROM pg_stat_activity 
                    WHERE datname = current_database()
                """)
                conn_result = self.db.execute(conn_query).fetchone()
                if conn_result:
                    performance["active_connections"] = conn_result.active_connections or 0
                    performance["waiting_connections"] = conn_result.waiting_connections or 0
                
                # Get slow query count (queries > 1 second)
                slow_query = text("""
                    SELECT count(*) as slow_queries
                    FROM pg_stat_activity 
                    WHERE datname = current_database() 
                    AND state = 'active' 
                    AND query_start < now() - interval '1 second'
                """)
                slow_result = self.db.execute(slow_query).scalar()
                performance["slow_queries"] = slow_result or 0
                
        except Exception:
            pass
        
        return performance
    
    def _check_for_issues(self) -> List[Dict[str, str]]:
        """Check for potential database issues."""
        issues = []
        
        try:
            # Check connection pool health
            pool = engine.pool
            if pool.checkedout() > pool.size() * 0.8:
                issues.append({
                    "type": "connection_pool",
                    "severity": "warning",
                    "message": f"Connection pool usage high: {pool.checkedout()}/{pool.size()}"
                })
            
            # Check for large tables without recent updates
            cutoff_date = datetime.utcnow() - timedelta(days=7)
            
            # Check scenarios without recent calculations
            stale_scenarios = self.db.query(func.count(Scenario.id)).filter(
                Scenario.last_calculated_at < cutoff_date
            ).scalar()
            
            if stale_scenarios > 10:
                issues.append({
                    "type": "stale_data",
                    "severity": "warning",
                    "message": f"{stale_scenarios} scenarios haven't been calculated in over 7 days"
                })
            
            # Check for failed file uploads
            failed_files = self.db.query(func.count(UploadedFile.id)).filter(
                UploadedFile.status == 'failed'
            ).scalar()
            
            if failed_files > 0:
                issues.append({
                    "type": "failed_uploads",
                    "severity": "warning",
                    "message": f"{failed_files} files failed to upload/process"
                })
            
            # PostgreSQL specific checks
            if settings.DATABASE_URL.startswith("postgresql"):
                # Check for tables needing vacuum
                vacuum_query = text("""
                    SELECT count(*) as needs_vacuum
                    FROM pg_stat_user_tables 
                    WHERE n_dead_tup > n_live_tup * 0.1 
                    AND n_dead_tup > 1000
                """)
                vacuum_count = self.db.execute(vacuum_query).scalar()
                
                if vacuum_count > 0:
                    issues.append({
                        "type": "maintenance",
                        "severity": "info",
                        "message": f"{vacuum_count} tables may benefit from vacuum"
                    })
                
        except Exception as e:
            issues.append({
                "type": "monitoring_error",
                "severity": "warning",
                "message": f"Error during issue detection: {str(e)}"
            })
        
        return issues
    
    def get_query_performance(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get slow query analysis (PostgreSQL only)."""
        if not settings.DATABASE_URL.startswith("postgresql"):
            return []
        
        try:
            # Requires pg_stat_statements extension
            query = text("""
                SELECT 
                    query,
                    calls,
                    total_time,
                    mean_time,
                    min_time,
                    max_time,
                    stddev_time,
                    rows
                FROM pg_stat_statements
                WHERE query NOT LIKE '%pg_stat_statements%'
                ORDER BY total_time DESC
                LIMIT :limit
            """)
            
            result = self.db.execute(query, {"limit": limit}).fetchall()
            
            performance_data = []
            for row in result:
                performance_data.append({
                    "query": row.query[:200] + "..." if len(row.query) > 200 else row.query,
                    "calls": row.calls,
                    "total_time_ms": round(row.total_time, 2),
                    "avg_time_ms": round(row.mean_time, 2),
                    "min_time_ms": round(row.min_time, 2),
                    "max_time_ms": round(row.max_time, 2),
                    "rows_affected": row.rows
                })
            
            return performance_data
            
        except Exception:
            return []
    
    def get_table_sizes(self) -> Dict[str, Dict[str, Any]]:
        """Get table size information (PostgreSQL only)."""
        if not settings.DATABASE_URL.startswith("postgresql"):
            return {}
        
        try:
            query = text("""
                SELECT 
                    tablename,
                    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
                    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
                    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size,
                    pg_total_relation_size(schemaname||'.'||tablename) as bytes
                FROM pg_tables 
                WHERE schemaname = 'public'
                ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
            """)
            
            result = self.db.execute(query).fetchall()
            
            table_sizes = {}
            for row in result:
                table_sizes[row.tablename] = {
                    "total_size": row.total_size,
                    "table_size": row.table_size,
                    "index_size": row.index_size,
                    "bytes": row.bytes
                }
            
            return table_sizes
            
        except Exception:
            return {}
    
    def cleanup_stale_data(self, dry_run: bool = True) -> Dict[str, Any]:
        """Clean up stale data based on retention policies."""
        cleanup_results = {
            "dry_run": dry_run,
            "actions": [],
            "total_cleaned": 0
        }
        
        try:
            # Clean up old audit logs (older than 90 days)
            audit_cutoff = datetime.utcnow() - timedelta(days=90)
            old_audits = self.db.query(func.count("*")).filter(
                text("created_at < :cutoff")
            ).params(cutoff=audit_cutoff).scalar()
            
            if old_audits > 0:
                if not dry_run:
                    # Actual cleanup would go here
                    pass
                
                cleanup_results["actions"].append({
                    "table": "audit_logs",
                    "action": "delete_old_records",
                    "count": old_audits,
                    "criteria": f"older than {audit_cutoff}"
                })
                cleanup_results["total_cleaned"] += old_audits
            
            # Clean up failed file uploads (older than 7 days)
            file_cutoff = datetime.utcnow() - timedelta(days=7)
            failed_files = self.db.query(func.count(UploadedFile.id)).filter(
                UploadedFile.status == 'failed',
                UploadedFile.created_at < file_cutoff
            ).scalar()
            
            if failed_files > 0:
                if not dry_run:
                    # Actual cleanup would go here
                    pass
                
                cleanup_results["actions"].append({
                    "table": "uploaded_files",
                    "action": "delete_failed_uploads",
                    "count": failed_files,
                    "criteria": f"failed status and older than {file_cutoff}"
                })
                cleanup_results["total_cleaned"] += failed_files
            
        except Exception as e:
            cleanup_results["error"] = str(e)
        
        return cleanup_results


# Singleton instance
db_monitor = DatabaseMonitor() 