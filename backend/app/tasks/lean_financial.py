from typing import Any, Dict, List, Optional

from app.core.celery_app import celery_app
from app.models.base import SessionLocal
from app.services.lean_financial_engine import LeanFinancialEngine
from app.services.lean_parameter_manager import LeanParameterManager
from celery import Task
from sqlalchemy.orm import Session


class DatabaseTask(Task):
    """Base task with database session management."""

    def __call__(self, *args, **kwargs):
        with SessionLocal() as db:
            return self.run_with_db(db, *args, **kwargs)

    def run_with_db(self, db: Session, *args, **kwargs):
        raise NotImplementedError


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.lean_financial.calculate_comprehensive_model",
)
def calculate_comprehensive_model_task(
    self,
    db: Session,
    parameters: Dict[str, float],
    base_revenue: float = 1_000_000,
) -> Dict[str, Any]:
    """Calculate the comprehensive financial model in the background."""
    param_manager = LeanParameterManager(db)
    engine = LeanFinancialEngine(db)

    is_valid, errors = param_manager.validate_parameters(parameters)
    if not is_valid:
        return {"success": False, "errors": errors}

    core_parameters = param_manager.create_core_parameters_from_dict(parameters)
    result = engine.calculate_comprehensive_model(core_parameters, base_revenue)

    return {
        "success": True,
        "data": {
            "profit_loss": result["profit_loss"].__dict__,
            "balance_sheet": result["balance_sheet"].__dict__,
            "cash_flow": result["cash_flow"].__dict__,
            "dcf_valuation": result["dcf_valuation"].__dict__,
            "parameters": result["parameters"].__dict__,
            "calculation_timestamp": result["calculation_timestamp"],
            "model_version": result["model_version"],
        },
    }


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.lean_financial.create_sensitivity_analysis",
)
def create_sensitivity_analysis_task(
    self,
    db: Session,
    base_parameters: Dict[str, float],
    sensitivity_parameters: Optional[List[str]] = None,
    variation_percent: float = 0.20,
) -> Dict[str, Any]:
    """Generate a sensitivity analysis in the background."""
    param_manager = LeanParameterManager(db)
    analysis = param_manager.create_sensitivity_analysis(
        base_parameters,
        sensitivity_parameters,
        variation_percent,
    )
    return {"success": True, "data": analysis}
