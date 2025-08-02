from typing import Any, List, Optional, Dict
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc

from app.models.base import get_db
from app.models.user import User
from app.models.parameter import Scenario, ParameterValue, Parameter
from app.models.file import UploadedFile
from app.schemas.parameter import (
    ScenarioCreate,
    ScenarioUpdate,
    ScenarioResponse,
    ScenarioComparisonResponse,
    ScenarioVersionResponse,
    ParameterValueUpdate,
)
from app.api.v1.endpoints.auth import get_current_active_user
from app.core.dependencies import require_permissions
from app.core.permissions import Permission
from app.services.scenario_manager import ScenarioManager
from app.services.monte_carlo_service import MonteCarloService

router = APIRouter()


@router.post("/analyze", status_code=status.HTTP_201_CREATED)
async def analyze_scenarios(
    request: Dict[str, Any],
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """Simple placeholder scenario analysis used in tests."""
    file_id = request.get("file_id")
    scenarios = request.get("scenarios", [])
    return {"file_id": file_id, "scenarios": scenarios}


@router.post("/", response_model=ScenarioResponse, status_code=status.HTTP_201_CREATED)
async def create_scenario(
    scenario: ScenarioCreate,
    current_user: User = Depends(require_permissions(Permission.MODEL_CREATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Create a new financial modeling scenario.

    Creates a new scenario with optional parameter values.
    """
    try:
        scenario_manager = ScenarioManager(db)

        # Create scenario
        db_scenario = await scenario_manager.create_scenario(
            name=scenario.name,
            description=scenario.description,
            base_file_id=scenario.base_file_id,
            user_id=current_user.id,
            is_baseline=scenario.is_baseline,
            parent_scenario_id=scenario.parent_scenario_id,
        )

        return ScenarioResponse.from_orm(db_scenario)

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create scenario: {str(e)}",
        )


@router.get("/", response_model=List[ScenarioResponse])
async def list_scenarios(
    base_file_id: Optional[int] = Query(None, description="Filter by base file ID"),
    is_baseline: Optional[bool] = Query(None, description="Filter baseline scenarios"),
    is_template: Optional[bool] = Query(None, description="Filter template scenarios"),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    List scenarios with optional filtering.

    Returns paginated list of scenarios accessible to the current user.
    """
    try:
        # Build query
        query = db.query(Scenario).filter(Scenario.created_by_id == current_user.id)

        # Apply filters
        if base_file_id:
            query = query.filter(Scenario.base_file_id == base_file_id)
        if is_baseline is not None:
            query = query.filter(Scenario.is_baseline == is_baseline)
        if is_template is not None:
            query = query.filter(Scenario.is_template == is_template)
        if status_filter:
            query = query.filter(Scenario.status == status_filter)

        # Apply pagination and ordering
        scenarios = (
            query.order_by(desc(Scenario.created_at)).offset(skip).limit(limit).all()
        )

        return [ScenarioResponse.from_orm(scenario) for scenario in scenarios]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list scenarios: {str(e)}",
        )


@router.get("/{scenario_id}", response_model=ScenarioResponse)
async def get_scenario(
    scenario_id: int,
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific scenario by ID.

    Returns detailed scenario information including parameter values.
    """
    scenario = (
        db.query(Scenario)
        .filter(Scenario.id == scenario_id, Scenario.created_by_id == current_user.id)
        .first()
    )

    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scenario {scenario_id} not found",
        )

    return ScenarioResponse.from_orm(scenario)


@router.put("/{scenario_id}", response_model=ScenarioResponse)
async def update_scenario(
    scenario_id: int,
    scenario_update: ScenarioUpdate,
    current_user: User = Depends(require_permissions(Permission.MODEL_UPDATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Update a scenario.

    Updates scenario metadata and status.
    """
    try:
        # Get existing scenario
        db_scenario = (
            db.query(Scenario)
            .filter(
                Scenario.id == scenario_id, Scenario.created_by_id == current_user.id
            )
            .first()
        )

        if not db_scenario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scenario {scenario_id} not found",
            )

        # Update fields
        update_data = scenario_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_scenario, field, value)

        db_scenario.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(db_scenario)

        return ScenarioResponse.from_orm(db_scenario)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update scenario: {str(e)}",
        )


@router.delete("/{scenario_id}")
async def delete_scenario(
    scenario_id: int,
    current_user: User = Depends(require_permissions(Permission.MODEL_DELETE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Delete a scenario.

    Removes scenario and associated parameter values.
    """
    try:
        # Get scenario
        db_scenario = (
            db.query(Scenario)
            .filter(
                Scenario.id == scenario_id, Scenario.created_by_id == current_user.id
            )
            .first()
        )

        if not db_scenario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scenario {scenario_id} not found",
            )

        # Delete associated parameter values
        db.query(ParameterValue).filter(
            ParameterValue.scenario_id == scenario_id
        ).delete()

        # Delete scenario
        db.delete(db_scenario)
        db.commit()

        return {"message": "Scenario deleted successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete scenario: {str(e)}",
        )


@router.post("/{scenario_id}/clone", response_model=ScenarioResponse)
async def clone_scenario(
    scenario_id: int,
    name: str = Body(..., description="Name for the cloned scenario"),
    description: Optional[str] = Body(
        None, description="Description for the cloned scenario"
    ),
    current_user: User = Depends(require_permissions(Permission.MODEL_CREATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Clone an existing scenario.

    Creates a copy of the scenario with all parameter values.
    """
    try:
        scenario_manager = ScenarioManager(db)

        # Get source scenario
        source_scenario = (
            db.query(Scenario)
            .filter(
                Scenario.id == scenario_id, Scenario.created_by_id == current_user.id
            )
            .first()
        )

        if not source_scenario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Source scenario {scenario_id} not found",
            )

        # Clone scenario
        cloned_scenario = await scenario_manager.clone_scenario(
            source_scenario_id=scenario_id,
            new_name=name,
            new_description=description,
            user_id=current_user.id,
        )

        return ScenarioResponse.from_orm(cloned_scenario)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clone scenario: {str(e)}",
        )


@router.get("/{scenario_id}/parameters", response_model=List[Dict[str, Any]])
async def get_scenario_parameters(
    scenario_id: int,
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get parameter values for a specific scenario.

    Returns all parameter values associated with the scenario.
    """
    try:
        # Verify scenario exists and user has access
        scenario = (
            db.query(Scenario)
            .filter(
                Scenario.id == scenario_id, Scenario.created_by_id == current_user.id
            )
            .first()
        )

        if not scenario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scenario {scenario_id} not found",
            )

        # Get parameter values with parameter details
        parameter_values = (
            db.query(ParameterValue, Parameter)
            .join(Parameter, ParameterValue.parameter_id == Parameter.id)
            .filter(ParameterValue.scenario_id == scenario_id)
            .all()
        )

        result = []
        for param_value, parameter in parameter_values:
            result.append(
                {
                    "parameter_id": parameter.id,
                    "parameter_name": parameter.name,
                    "parameter_type": parameter.parameter_type,
                    "category": parameter.category,
                    "current_value": param_value.value,
                    "original_value": param_value.original_value,
                    "unit": parameter.unit,
                    "format_type": parameter.format_type,
                    "min_value": parameter.min_value,
                    "max_value": parameter.max_value,
                    "is_editable": parameter.is_editable,
                    "change_reason": param_value.change_reason,
                    "changed_at": param_value.changed_at.isoformat(),
                    "is_valid": param_value.is_valid,
                    "validation_errors": param_value.validation_errors,
                }
            )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get scenario parameters: {str(e)}",
        )


@router.put("/{scenario_id}/parameters/{parameter_id}")
async def update_scenario_parameter(
    scenario_id: int,
    parameter_id: int,
    parameter_update: ParameterValueUpdate,
    current_user: User = Depends(require_permissions(Permission.MODEL_UPDATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Update a parameter value in a scenario.

    Updates parameter value with validation and tracking.
    """
    try:
        scenario_manager = ScenarioManager(db)

        # Update parameter value
        updated_value = await scenario_manager.update_parameter_value(
            scenario_id=scenario_id,
            parameter_id=parameter_id,
            new_value=parameter_update.value,
            change_reason=parameter_update.change_reason,
            user_id=current_user.id,
        )

        return {
            "parameter_id": parameter_id,
            "scenario_id": scenario_id,
            "new_value": updated_value.value,
            "is_valid": updated_value.is_valid,
            "validation_errors": updated_value.validation_errors,
            "updated_at": updated_value.changed_at.isoformat(),
        }

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update parameter: {str(e)}",
        )


@router.post("/compare", response_model=ScenarioComparisonResponse)
async def compare_scenarios(
    scenario_ids: List[int] = Body(..., description="List of scenario IDs to compare"),
    metrics: Optional[List[str]] = Body(
        None, description="Specific metrics to compare"
    ),
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Compare multiple scenarios.

    Returns variance analysis and comparison metrics between scenarios.
    """
    try:
        if len(scenario_ids) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least 2 scenarios required for comparison",
            )

        if len(scenario_ids) > 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum 5 scenarios can be compared at once",
            )

        scenario_manager = ScenarioManager(db)

        # Perform comparison
        comparison_result = await scenario_manager.compare_scenarios(
            scenario_ids=scenario_ids, metrics=metrics, user_id=current_user.id
        )

        return comparison_result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compare scenarios: {str(e)}",
        )


@router.post("/{scenario_id}/calculate")
async def calculate_scenario(
    scenario_id: int,
    force_recalculate: bool = Query(False, description="Force full recalculation"),
    current_user: User = Depends(require_permissions(Permission.MODEL_EXECUTE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Trigger scenario calculation.

    Recalculates all formulas and dependent values in the scenario.
    """
    try:
        scenario_manager = ScenarioManager(db)

        # Trigger calculation
        calculation_result = await scenario_manager.calculate_scenario(
            scenario_id=scenario_id,
            user_id=current_user.id,
            force_recalculate=force_recalculate,
        )

        return {
            "scenario_id": scenario_id,
            "calculation_status": calculation_result["status"],
            "calculated_at": calculation_result["calculated_at"],
            "results_summary": calculation_result["summary"],
            "errors": calculation_result.get("errors", []),
            "warnings": calculation_result.get("warnings", []),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate scenario: {str(e)}",
        )


@router.get("/{scenario_id}/versions", response_model=List[ScenarioVersionResponse])
async def get_scenario_versions(
    scenario_id: int,
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get version history of a scenario.

    Returns all versions and changes for the scenario.
    """
    try:
        # Get scenario and its versions
        scenario = (
            db.query(Scenario)
            .filter(
                Scenario.id == scenario_id, Scenario.created_by_id == current_user.id
            )
            .first()
        )

        if not scenario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scenario {scenario_id} not found",
            )

        # Get child scenarios (versions)
        versions = (
            db.query(Scenario)
            .filter(Scenario.parent_scenario_id == scenario_id)
            .order_by(desc(Scenario.created_at))
            .all()
        )

        # Include the original scenario as version 1.0
        all_versions = [scenario] + versions

        return [ScenarioVersionResponse.from_orm(v) for v in all_versions]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get scenario versions: {str(e)}",
        )


@router.get("/templates/", response_model=List[ScenarioResponse])
async def get_scenario_templates(
    category: Optional[str] = Query(None, description="Filter by template category"),
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get available scenario templates.

    Returns predefined scenario templates for common use cases.
    """
    try:
        # Get template scenarios
        query = db.query(Scenario).filter(Scenario.is_template == True)

        if category:
            # Filter by category if specified
            query = query.filter(Scenario.description.contains(category))

        templates = query.order_by(Scenario.name).all()

        return [ScenarioResponse.from_orm(template) for template in templates]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get scenario templates: {str(e)}",
        )


@router.post("/{scenario_id}/save-as-template")
async def save_scenario_as_template(
    scenario_id: int,
    template_name: str = Body(..., description="Name for the template"),
    template_description: Optional[str] = Body(
        None, description="Description for the template"
    ),
    category: Optional[str] = Body(None, description="Template category"),
    current_user: User = Depends(require_permissions(Permission.MODEL_CREATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Save a scenario as a reusable template.

    Creates a template from an existing scenario that can be used by other users.
    """
    try:
        # Get source scenario
        source_scenario = (
            db.query(Scenario)
            .filter(
                Scenario.id == scenario_id, Scenario.created_by_id == current_user.id
            )
            .first()
        )

        if not source_scenario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scenario {scenario_id} not found",
            )

        scenario_manager = ScenarioManager(db)

        # Create template
        template = await scenario_manager.create_template_from_scenario(
            source_scenario_id=scenario_id,
            template_name=template_name,
            template_description=template_description,
            category=category,
            user_id=current_user.id,
        )

        return {
            "template_id": template.id,
            "template_name": template.name,
            "created_at": template.created_at.isoformat(),
            "message": "Scenario saved as template successfully",
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save scenario as template: {str(e)}",
        )


@router.get("/{scenario_id}/sensitivity-analysis")
async def run_sensitivity_analysis(
    scenario_id: int,
    target_parameters: List[int] = Query(
        ..., description="Parameter IDs for sensitivity analysis"
    ),
    output_metrics: Optional[List[str]] = Query(
        None, description="Output metrics to analyze"
    ),
    analysis_type: str = Query(
        "tornado", description="Type of analysis (tornado, monte_carlo)"
    ),
    current_user: User = Depends(require_permissions(Permission.MODEL_EXECUTE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Run sensitivity analysis on a scenario.

    Analyzes how changes in input parameters affect output metrics.
    """
    try:
        scenario_manager = ScenarioManager(db)

        # Run sensitivity analysis
        analysis_result = await scenario_manager.run_sensitivity_analysis(
            scenario_id=scenario_id,
            target_parameters=target_parameters,
            output_metrics=output_metrics,
            analysis_type=analysis_type,
            user_id=current_user.id,
        )

        return {
            "scenario_id": scenario_id,
            "analysis_type": analysis_type,
            "target_parameters": target_parameters,
            "results": analysis_result["results"],
            "charts": analysis_result.get("charts", {}),
            "summary": analysis_result.get("summary", {}),
            "generated_at": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to run sensitivity analysis: {str(e)}",
        )


# Monte Carlo Simulation Endpoints

@router.post("/{scenario_id}/monte-carlo/setup")
async def setup_monte_carlo_simulation(
    scenario_id: int,
    distributions: Dict[int, Dict[str, Any]] = Body(..., description="Parameter distributions"),
    output_metrics: List[str] = Body(..., description="Output metrics to track"),
    iterations: int = Body(10000, description="Number of simulation iterations"),
    correlations: Optional[Dict[str, float]] = Body(None, description="Parameter correlations"),
    name: Optional[str] = Body(None, description="Simulation name"),
    random_seed: Optional[int] = Body(None, description="Random seed for reproducibility"),
    current_user: User = Depends(require_permissions(Permission.MODEL_EXECUTE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Set up a Monte Carlo simulation configuration.
    
    Creates a simulation configuration that can be executed later.
    """
    try:
        monte_carlo_service = MonteCarloService(db)
        
        simulation_id = await monte_carlo_service.setup_simulation(
            scenario_id=scenario_id,
            distributions=distributions,
            output_metrics=output_metrics,
            iterations=iterations,
            correlations=correlations,
            user_id=current_user.id,
            name=name,
            random_seed=random_seed,
        )
        
        return {
            "simulation_id": simulation_id,
            "scenario_id": scenario_id,
            "status": "configured",
            "message": "Monte Carlo simulation configured successfully",
        }
        
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to setup Monte Carlo simulation: {str(e)}",
        )


@router.post("/{scenario_id}/monte-carlo/run")
async def run_monte_carlo_simulation(
    scenario_id: int,
    simulation_id: str = Body(..., description="Simulation configuration ID"),
    current_user: User = Depends(require_permissions(Permission.MODEL_EXECUTE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Execute a Monte Carlo simulation.
    
    Runs the Monte Carlo simulation with the specified configuration.
    """
    try:
        monte_carlo_service = MonteCarloService(db)
        
        result = await monte_carlo_service.run_monte_carlo(
            simulation_id=simulation_id,
            user_id=current_user.id,
        )
        
        return {
            "simulation_id": result.simulation_id,
            "scenario_id": scenario_id,
            "status": "completed",
            "iterations": result.iterations,
            "execution_time": result.execution_time,
            "results_summary": {
                metric: {
                    "mean": result.statistics[metric]["mean"],
                    "std_dev": result.statistics[metric]["std_dev"],
                    "percentile_5": result.statistics[metric]["percentile_5"],
                    "percentile_95": result.statistics[metric]["percentile_95"],
                }
                for metric in result.statistics.keys()
            },
            "risk_metrics": result.risk_metrics,
            "parameter_correlations": result.parameter_correlations,
        }
        
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to run Monte Carlo simulation: {str(e)}",
        )


@router.get("/monte-carlo/{simulation_id}/results")
async def get_monte_carlo_results(
    simulation_id: str,
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get Monte Carlo simulation results.
    
    Returns detailed simulation results and statistics.
    """
    try:
        monte_carlo_service = MonteCarloService(db)
        
        results = await monte_carlo_service.get_simulation_results(
            simulation_id=simulation_id,
            user_id=current_user.id,
        )
        
        return results
        
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get Monte Carlo results: {str(e)}",
        )


@router.get("/monte-carlo/{simulation_id}/statistics")
async def get_monte_carlo_statistics(
    simulation_id: str,
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get detailed Monte Carlo simulation statistics.
    
    Returns comprehensive statistical analysis of simulation results.
    """
    try:
        monte_carlo_service = MonteCarloService(db)
        
        statistics = await monte_carlo_service.get_simulation_statistics(
            simulation_id=simulation_id,
            user_id=current_user.id,
        )
        
        return statistics
        
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get Monte Carlo statistics: {str(e)}",
        )


@router.post("/monte-carlo/{simulation_id}/risk-metrics")
async def calculate_risk_metrics(
    simulation_id: str,
    confidence_levels: List[float] = Body([0.90, 0.95, 0.99], description="Confidence levels for risk metrics"),
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Calculate comprehensive risk metrics for a Monte Carlo simulation.
    
    Returns VaR, CVaR, and other risk measures at specified confidence levels.
    """
    try:
        monte_carlo_service = MonteCarloService(db)
        
        risk_metrics = await monte_carlo_service.calculate_risk_metrics(
            simulation_id=simulation_id,
            confidence_levels=confidence_levels,
            user_id=current_user.id,
        )
        
        return risk_metrics
        
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate risk metrics: {str(e)}",
        )
