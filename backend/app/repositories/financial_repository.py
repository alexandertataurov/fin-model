from typing import List, Optional, Dict, Any
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, func, desc

from app.models.financial import (
    FinancialStatement,
    Metric,
    TimeSeries,
    Calculation,
    Template,
    FileVersion,
    DataSource,
)
from app.repositories.base_repository import BaseRepository


class FinancialStatementRepository(BaseRepository[FinancialStatement]):
    """Repository for financial statements operations."""

    def __init__(self, db: Session):
        super().__init__(db, FinancialStatement)

    def get_by_unique_field(
        self, field_name: str, value: Any
    ) -> Optional[FinancialStatement]:
        """Get financial statement by unique field."""
        if hasattr(self.model, field_name):
            field = getattr(self.model, field_name)
            return self.db.query(self.model).filter(field == value).first()
        return None

    def get_by_scenario_and_type(
        self,
        scenario_id: int,
        statement_type: str,
        period_start: Optional[date] = None,
        period_end: Optional[date] = None,
    ) -> List[FinancialStatement]:
        """Get financial statements by scenario and type."""
        query = self.db.query(self.model).filter(
            and_(
                self.model.scenario_id == scenario_id,
                self.model.statement_type == statement_type,
            )
        )

        if period_start:
            query = query.filter(self.model.period_start >= period_start)
        if period_end:
            query = query.filter(self.model.period_end <= period_end)

        return query.order_by(self.model.period_start).all()

    def get_latest_version(
        self, scenario_id: int, statement_type: str
    ) -> Optional[FinancialStatement]:
        """Get the latest version of a financial statement."""
        return (
            self.db.query(self.model)
            .filter(
                and_(
                    self.model.scenario_id == scenario_id,
                    self.model.statement_type == statement_type,
                )
            )
            .order_by(desc(self.model.version))
            .first()
        )

    def get_baseline_statements(
        self, scenario_id: int
    ) -> List[FinancialStatement]:
        """Get all baseline financial statements for a scenario."""
        return (
            self.db.query(self.model)
            .filter(
                and_(
                    self.model.scenario_id == scenario_id,
                    self.model.is_baseline == True,
                )
            )
            .all()
        )


class MetricRepository(BaseRepository[Metric]):
    """Repository for financial metrics operations."""

    def __init__(self, db: Session):
        super().__init__(db, Metric)

    def get_by_unique_field(
        self, field_name: str, value: Any
    ) -> Optional[Metric]:
        """Get metric by unique field."""
        if hasattr(self.model, field_name):
            field = getattr(self.model, field_name)
            return self.db.query(self.model).filter(field == value).first()
        return None

    def get_by_scenario_and_category(
        self,
        scenario_id: int,
        metric_category: str,
        period_start: Optional[date] = None,
        period_end: Optional[date] = None,
    ) -> List[Metric]:
        """Get metrics by scenario and category."""
        query = self.db.query(self.model).filter(
            and_(
                self.model.scenario_id == scenario_id,
                self.model.metric_category == metric_category,
            )
        )

        if period_start:
            query = query.filter(self.model.period_start >= period_start)
        if period_end:
            query = query.filter(self.model.period_end <= period_end)

        return query.order_by(self.model.period_start).all()

    def get_metric_trends(
        self, scenario_id: int, metric_name: str, limit: int = 12
    ) -> List[Metric]:
        """Get metric trends over time."""
        return (
            self.db.query(self.model)
            .filter(
                and_(
                    self.model.scenario_id == scenario_id,
                    self.model.metric_name == metric_name,
                )
            )
            .order_by(desc(self.model.period_start))
            .limit(limit)
            .all()
        )

    def get_dashboard_metrics(
        self, scenario_id: int
    ) -> Dict[str, List[Metric]]:
        """Get key metrics grouped by category for dashboard display."""
        metrics = (
            self.db.query(self.model)
            .filter(self.model.scenario_id == scenario_id)
            .order_by(self.model.metric_category, self.model.period_start)
            .all()
        )

        grouped_metrics = {}
        for metric in metrics:
            if metric.metric_category not in grouped_metrics:
                grouped_metrics[metric.metric_category] = []
            grouped_metrics[metric.metric_category].append(metric)

        return grouped_metrics


class TimeSeriesRepository(BaseRepository[TimeSeries]):
    """Repository for time series data operations."""

    def __init__(self, db: Session):
        super().__init__(db, TimeSeries)

    def get_by_unique_field(
        self, field_name: str, value: Any
    ) -> Optional[TimeSeries]:
        """Get time series by unique field."""
        if hasattr(self.model, field_name):
            field = getattr(self.model, field_name)
            return self.db.query(self.model).filter(field == value).first()
        return None

    def get_series_data(
        self,
        scenario_id: int,
        data_type: str,
        data_subtype: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        frequency: Optional[str] = None,
    ) -> List[TimeSeries]:
        """Get time series data with filtering."""
        query = self.db.query(self.model).filter(
            and_(
                self.model.scenario_id == scenario_id,
                self.model.data_type == data_type,
            )
        )

        if data_subtype:
            query = query.filter(self.model.data_subtype == data_subtype)
        if start_date:
            query = query.filter(self.model.period_date >= start_date)
        if end_date:
            query = query.filter(self.model.period_date <= end_date)
        if frequency:
            query = query.filter(self.model.frequency == frequency)

        return query.order_by(self.model.period_date).all()

    def get_aggregated_data(
        self,
        scenario_id: int,
        data_type: str,
        aggregation: str = "sum",  # sum, avg, min, max
        period_start: Optional[date] = None,
        period_end: Optional[date] = None,
    ) -> float:
        """Get aggregated time series data."""
        query = self.db.query(self.model).filter(
            and_(
                self.model.scenario_id == scenario_id,
                self.model.data_type == data_type,
            )
        )

        if period_start:
            query = query.filter(self.model.period_date >= period_start)
        if period_end:
            query = query.filter(self.model.period_date <= period_end)

        if aggregation == "sum":
            result = query.with_entities(
                func.sum(self.model.value)
            ).scalar()
        elif aggregation == "avg":
            result = query.with_entities(
                func.avg(self.model.value)
            ).scalar()
        elif aggregation == "min":
            result = query.with_entities(
                func.min(self.model.value)
            ).scalar()
        elif aggregation == "max":
            result = query.with_entities(
                func.max(self.model.value)
            ).scalar()
        else:
            result = query.with_entities(
                func.sum(self.model.value)
            ).scalar()

        return float(result) if result else 0.0

    def bulk_upsert_series(
        self,
        scenario_id: int,
        data_type: str,
        series_data: List[Dict[str, Any]],
    ) -> int:
        """Bulk upsert time series data."""
        updated_count = 0

        for data_point in series_data:
            # Check if record exists
            existing = (
                self.db.query(self.model)
                .filter(
                    and_(
                        self.model.scenario_id == scenario_id,
                        self.model.data_type == data_type,
                        self.model.period_date
                        == data_point["period_date"],
                        self.model.data_subtype
                        == data_point.get("data_subtype"),
                    )
                )
                .first()
            )

            if existing:
                # Update existing record
                for key, value in data_point.items():
                    if hasattr(existing, key):
                        setattr(existing, key, value)
                updated_count += 1
            else:
                # Create new record
                data_point.update(
                    {"scenario_id": scenario_id, "data_type": data_type}
                )
                new_record = self.model(**data_point)
                self.db.add(new_record)
                updated_count += 1

        self.db.commit()
        return updated_count


class CalculationRepository(BaseRepository[Calculation]):
    """Repository for calculation operations."""

    def __init__(self, db: Session):
        super().__init__(db, Calculation)

    def get_by_unique_field(
        self, field_name: str, value: Any
    ) -> Optional[Calculation]:
        """Get calculation by unique field."""
        if hasattr(self.model, field_name):
            field = getattr(self.model, field_name)
            return self.db.query(self.model).filter(field == value).first()
        return None

    def get_execution_order(self, scenario_id: int) -> List[Calculation]:
        """Get calculations ordered by execution order."""
        return (
            self.db.query(self.model)
            .filter(
                and_(
                    self.model.scenario_id == scenario_id,
                    self.model.is_active == True,
                )
            )
            .order_by(self.model.execution_order)
            .all()
        )

    def get_pending_calculations(
        self, scenario_id: int
    ) -> List[Calculation]:
        """Get calculations that haven't been executed yet."""
        return (
            self.db.query(self.model)
            .filter(
                and_(
                    self.model.scenario_id == scenario_id,
                    self.model.is_active == True,
                    self.model.last_executed_at.is_(None),
                )
            )
            .order_by(self.model.execution_order)
            .all()
        )

    def update_execution_stats(
        self, calculation_id: int, execution_time_ms: int
    ) -> bool:
        """Update calculation execution statistics."""
        calculation = self.get(calculation_id)
        if calculation:
            calculation.last_executed_at = datetime.utcnow()
            calculation.execution_time_ms = execution_time_ms
            self.db.commit()
            return True
        return False


class TemplateRepository(BaseRepository[Template]):
    """Repository for template operations."""

    def __init__(self, db: Session):
        super().__init__(db, Template)

    def get_by_unique_field(
        self, field_name: str, value: Any
    ) -> Optional[Template]:
        """Get template by unique field."""
        if hasattr(self.model, field_name):
            field = getattr(self.model, field_name)
            return self.db.query(self.model).filter(field == value).first()
        return None

    def get_active_templates(
        self, template_type: Optional[str] = None
    ) -> List[Template]:
        """Get active templates, optionally filtered by type."""
        query = self.db.query(self.model).filter(
            self.model.is_active == True
        )

        if template_type:
            query = query.filter(self.model.template_type == template_type)

        return query.order_by(self.model.name).all()

    def get_system_templates(self) -> List[Template]:
        """Get system-defined templates."""
        return (
            self.db.query(self.model)
            .filter(
                and_(
                    self.model.is_system_template == True,
                    self.model.is_active == True,
                )
            )
            .order_by(self.model.name)
            .all()
        )

    def increment_usage_count(self, template_id: int) -> bool:
        """Increment template usage count."""
        template = self.get(template_id)
        if template:
            template.usage_count += 1
            self.db.commit()
            return True
        return False


class FileVersionRepository(BaseRepository[FileVersion]):
    """Repository for file version operations."""

    def __init__(self, db: Session):
        super().__init__(db, FileVersion)

    def get_by_unique_field(
        self, field_name: str, value: Any
    ) -> Optional[FileVersion]:
        """Get file version by unique field."""
        if hasattr(self.model, field_name):
            field = getattr(self.model, field_name)
            return self.db.query(self.model).filter(field == value).first()
        return None

    def get_file_versions(self, file_id: int) -> List[FileVersion]:
        """Get all versions of a file."""
        return (
            self.db.query(self.model)
            .filter(self.model.file_id == file_id)
            .order_by(desc(self.model.version_number))
            .all()
        )

    def get_current_version(self, file_id: int) -> Optional[FileVersion]:
        """Get current version of a file."""
        return (
            self.db.query(self.model)
            .filter(
                and_(
                    self.model.file_id == file_id,
                    self.model.is_current == True,
                )
            )
            .first()
        )

    def set_current_version(
        self, file_id: int, version_number: int
    ) -> bool:
        """Set a specific version as current."""
        # First, unset all current versions for this file
        self.db.query(self.model).filter(
            self.model.file_id == file_id
        ).update({"is_current": False})

        # Set the specified version as current
        result = (
            self.db.query(self.model)
            .filter(
                and_(
                    self.model.file_id == file_id,
                    self.model.version_number == version_number,
                )
            )
            .update({"is_current": True})
        )

        self.db.commit()
        return result > 0

    def get_by_hash(self, file_hash: str) -> Optional[FileVersion]:
        """Get file version by hash (for deduplication)."""
        return (
            self.db.query(self.model)
            .filter(self.model.file_hash == file_hash)
            .first()
        )


class DataSourceRepository(BaseRepository[DataSource]):
    """Repository for data source operations."""

    def __init__(self, db: Session):
        super().__init__(db, DataSource)

    def get_by_unique_field(
        self, field_name: str, value: Any
    ) -> Optional[DataSource]:
        """Get data source by unique field."""
        if hasattr(self.model, field_name):
            field = getattr(self.model, field_name)
            return self.db.query(self.model).filter(field == value).first()
        return None

    def get_by_type(self, source_type: str) -> List[DataSource]:
        """Get data sources by type."""
        return (
            self.db.query(self.model)
            .filter(
                and_(
                    self.model.source_type == source_type,
                    self.model.is_active == True,
                )
            )
            .order_by(self.model.source_name)
            .all()
        )

    def get_stale_sources(self, hours: int = 24) -> List[DataSource]:
        """Get data sources that haven't been updated recently."""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        return (
            self.db.query(self.model)
            .filter(
                and_(
                    self.model.is_active == True,
                    self.model.last_updated < cutoff_time,
                )
            )
            .all()
        )

    def update_quality_metrics(
        self, source_id: int, quality_metrics: Dict[str, Any]
    ) -> bool:
        """Update data quality metrics for a source."""
        source = self.get(source_id)
        if source:
            source.quality_metrics = quality_metrics
            source.last_updated = datetime.utcnow()
            self.db.commit()
            return True
        return False
