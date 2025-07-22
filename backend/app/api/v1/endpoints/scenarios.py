from typing import Dict, List, Any, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_404_NOT_FOUND

from app.core.dependencies import get_db
from app.api.v1.endpoints.auth import get_current_active_user as get_current_user
from app.models.user import User
from app.models.parameter import Scenario, Parameter, ParameterValue
from app.models.file import UploadedFile
from app.services.scenario_manager import ScenarioManager
from app.schemas.parameter import (
    ScenarioCreate, ScenarioUpdate, ScenarioResponse,
    ScenarioComparisonRequest, ScenarioComparisonResponse,
    ParameterValueResponse
)

router = APIRouter()


@router.post("/", response_model=ScenarioResponse, status_code=HTTP_201_CREATED)
async def create_scenario(
    scenario: ScenarioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new financial modeling scenario.
    """
    scenario_manager = ScenarioManager(db)
    
    try:
        new_scenario = await scenario_manager.create_scenario(
            name=scenario.name,
            description=scenario.description,
            base_file_id=scenario.base_file_id,
            user_id=current_user.id,
            is_baseline=scenario.is_baseline,
            parent_scenario_id=scenario.parent_scenario_id
        )
        
        return ScenarioResponse.from_orm(new_scenario)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create scenario: {str(e)}")


@router.get("/", response_model=List[ScenarioResponse])
async def list_scenarios(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    base_file_id: Optional[int] = Query(None),
    is_baseline: Optional[bool] = Query(None),
    is_template: Optional[bool] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List scenarios with filtering options.
    """
    query = db.query(Scenario).filter(Scenario.created_by_id == current_user.id)
    
    # Apply filters
    if base_file_id:
        query = query.filter(Scenario.base_file_id == base_file_id)
    
    if is_baseline is not None:
        query = query.filter(Scenario.is_baseline == is_baseline)
    
    if is_template is not None:
        query = query.filter(Scenario.is_template == is_template)
    
    if status:
        query = query.filter(Scenario.status == status)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Scenario.name.ilike(search_term) |
            Scenario.description.ilike(search_term)
        )
    
    scenarios = query.order_by(Scenario.updated_at.desc()).offset(skip).limit(limit).all()
    
    return [ScenarioResponse.from_orm(scenario) for scenario in scenarios]


@router.get("/{scenario_id}", response_model=ScenarioResponse)
async def get_scenario(
    scenario_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific scenario by ID.
    """
    scenario = db.query(Scenario).filter(
        Scenario.id == scenario_id,
        Scenario.created_by_id == current_user.id
    ).first()
    
    if not scenario:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Scenario not found"
        )
    
    return ScenarioResponse.from_orm(scenario)


@router.put("/{scenario_id}", response_model=ScenarioResponse)
async def update_scenario(
    scenario_id: int,
    scenario_update: ScenarioUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a scenario.
    """
    scenario_manager = ScenarioManager(db)
    
    try:
        updated_scenario = await scenario_manager.update_scenario(
            scenario_id=scenario_id,
            user_id=current_user.id,
            **scenario_update.dict(exclude_unset=True)
        )
        
        return ScenarioResponse.from_orm(updated_scenario)
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update scenario: {str(e)}")


@router.delete("/{scenario_id}")
async def delete_scenario(
    scenario_id: int,
    force: bool = Query(False, description="Force delete even if scenario has children"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a scenario.
    """
    scenario_manager = ScenarioManager(db)
    
    try:
        success = await scenario_manager.delete_scenario(
            scenario_id=scenario_id,
            user_id=current_user.id,
            force=force
        )
        
        if success:
            return {"message": "Scenario deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete scenario")
            
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete scenario: {str(e)}")


@router.post("/clone")
async def clone_scenario(
    source_scenario_id: int,
    new_name: str,
    new_description: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Clone an existing scenario.
    """
    scenario_manager = ScenarioManager(db)
    
    result = await scenario_manager.clone_scenario(
        source_scenario_id=source_scenario_id,
        new_name=new_name,
        new_description=new_description,
        user_id=current_user.id
    )
    
    if not result.success:
        raise HTTPException(status_code=400, detail=result.error_message)
    
    return {
        "message": "Scenario cloned successfully",
        "original_scenario_id": result.original_scenario_id,
        "new_scenario_id": result.new_scenario_id,
        "parameters_copied": result.parameters_copied
    }


@router.post("/{scenario_id}/calculate")
async def calculate_scenario(
    scenario_id: int,
    force_recalculation: bool = Query(False, description="Force recalculation even if up to date"),
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calculate all formulas for a scenario.
    """
    scenario_manager = ScenarioManager(db)
    
    try:
        result = await scenario_manager.calculate_scenario(
            scenario_id=scenario_id,
            user_id=current_user.id,
            force_recalculation=force_recalculation
        )
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scenario calculation failed: {str(e)}")


@router.post("/compare", response_model=List[ScenarioComparisonResponse])
async def compare_scenarios(
    request: ScenarioComparisonRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Compare multiple scenarios against a base scenario.
    """
    scenario_manager = ScenarioManager(db)
    
    try:
        comparisons = await scenario_manager.compare_scenarios(
            base_scenario_id=request.base_scenario_id,
            compare_scenario_ids=request.compare_scenario_ids,
            user_id=current_user.id,
            parameter_filters=request.parameter_filters
        )
        
        # Convert to response format
        results = []
        for comparison in comparisons:
            results.append(ScenarioComparisonResponse(
                base_scenario_id=comparison.base_scenario_id,
                comparison_scenarios=[comparison.compare_scenario_id],
                parameter_comparisons=[
                    {
                        "parameter_id": diff["parameter_id"],
                        "parameter_name": f"Parameter {diff['parameter_id']}",  # Would need to join with Parameter table
                        "base_value": diff["base_value"],
                        "comparison_values": {comparison.compare_scenario_id: diff["compare_value"]},
                        "variance": {comparison.compare_scenario_id: diff["variance"]},
                        "percentage_change": {comparison.compare_scenario_id: diff["percentage_change"]}
                    }
                    for diff in comparison.parameter_differences
                ],
                summary_statistics=comparison.summary_statistics
            ))
        
        return results
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scenario comparison failed: {str(e)}")


@router.get("/{scenario_id}/parameters", response_model=List[ParameterValueResponse])
async def get_scenario_parameters(
    scenario_id: int,
    parameter_type: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get parameter values for a specific scenario.
    """
    # Verify scenario exists and belongs to user
    scenario = db.query(Scenario).filter(
        Scenario.id == scenario_id,
        Scenario.created_by_id == current_user.id
    ).first()
    
    if not scenario:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Scenario not found"
        )
    
    # Get parameter values
    query = db.query(ParameterValue).filter(
        ParameterValue.scenario_id == scenario_id
    ).join(Parameter)
    
    if parameter_type:
        query = query.filter(Parameter.parameter_type == parameter_type)
    
    if category:
        query = query.filter(Parameter.category == category)
    
    parameter_values = query.all()
    
    return [ParameterValueResponse.from_orm(pv) for pv in parameter_values]


@router.get("/{scenario_id}/history")
async def get_scenario_history(
    scenario_id: int,
    include_calculations: bool = Query(True, description="Include calculation history"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get complete history of a scenario.
    """
    scenario_manager = ScenarioManager(db)
    
    try:
        history = await scenario_manager.get_scenario_history(
            scenario_id=scenario_id,
            user_id=current_user.id,
            include_calculations=include_calculations
        )
        
        return history
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get scenario history: {str(e)}")


@router.post("/templates")
async def create_scenario_template(
    name: str,
    description: str,
    source_scenario_id: int,
    parameter_subset: Optional[List[int]] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a reusable scenario template.
    """
    scenario_manager = ScenarioManager(db)
    
    try:
        template = await scenario_manager.create_scenario_template(
            name=name,
            description=description,
            source_scenario_id=source_scenario_id,
            user_id=current_user.id,
            parameter_subset=parameter_subset
        )
        
        return ScenarioResponse.from_orm(template)
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create template: {str(e)}")


@router.post("/{scenario_id}/apply-template")
async def apply_template(
    scenario_id: int,
    template_id: int,
    overwrite_existing: bool = Query(False, description="Overwrite existing parameter values"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Apply a scenario template to an existing scenario.
    """
    scenario_manager = ScenarioManager(db)
    
    try:
        result = await scenario_manager.apply_template(
            template_id=template_id,
            target_scenario_id=scenario_id,
            user_id=current_user.id,
            overwrite_existing=overwrite_existing
        )
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to apply template: {str(e)}")


@router.get("/statistics")
async def get_scenario_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get comprehensive statistics about user's scenarios.
    """
    scenario_manager = ScenarioManager(db)
    
    try:
        stats = await scenario_manager.get_scenario_statistics(current_user.id)
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get statistics: {str(e)}")


@router.get("/{scenario_id}/dependencies")
async def get_scenario_dependencies(
    scenario_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get dependency information for a scenario's parameters.
    """
    # Verify scenario exists and belongs to user
    scenario = db.query(Scenario).filter(
        Scenario.id == scenario_id,
        Scenario.created_by_id == current_user.id
    ).first()
    
    if not scenario:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Scenario not found"
        )
    
    # Get parameters with dependencies
    parameters = db.query(Parameter).join(ParameterValue).filter(
        ParameterValue.scenario_id == scenario_id
    ).all()
    
    dependencies = []
    for param in parameters:
        if param.depends_on or param.affects:
            dependencies.append({
                "parameter_id": param.id,
                "parameter_name": param.display_name or param.name,
                "depends_on": param.depends_on or [],
                "affects": param.affects or [],
                "dependency_count": len(param.depends_on or []),
                "dependent_count": len(param.affects or [])
            })
    
    return {
        "scenario_id": scenario_id,
        "parameter_dependencies": dependencies,
        "total_parameters": len(parameters),
        "parameters_with_dependencies": len(dependencies),
        "summary": {
            "max_dependencies": max((len(param.depends_on or []) for param in parameters), default=0),
            "max_dependents": max((len(param.affects or []) for param in parameters), default=0),
            "total_dependencies": sum(len(param.depends_on or []) for param in parameters),
            "total_dependents": sum(len(param.affects or []) for param in parameters)
        }
    }


@router.post("/{scenario_id}/export")
async def export_scenario(
    scenario_id: int,
    export_format: str = Query("excel", pattern="^(excel|json|csv)$"),
    include_calculations: bool = Query(True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Export scenario data and results.
    """
    # Verify scenario exists and belongs to user
    scenario = db.query(Scenario).filter(
        Scenario.id == scenario_id,
        Scenario.created_by_id == current_user.id
    ).first()
    
    if not scenario:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Scenario not found"
        )
    
    # For now, return basic export info
    # In a full implementation, this would generate and return download URLs
    return {
        "scenario_id": scenario_id,
        "export_format": export_format,
        "download_url": f"/api/v1/scenarios/{scenario_id}/download/{export_format}",
        "expires_at": datetime.utcnow().isoformat(),
        "message": "Export functionality not fully implemented yet"
    } 