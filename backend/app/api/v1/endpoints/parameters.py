from typing import Dict, List, Any, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_404_NOT_FOUND

from app.core.dependencies import get_db
from app.api.v1.endpoints.auth import get_current_active_user as get_current_user
from app.models.user import User
from app.models.parameter import Parameter, ParameterValue, Scenario, ParameterType, ParameterCategory
from app.models.file import UploadedFile
from app.services.parameter_detector import ParameterDetector
from app.services.formula_engine import FormulaEngine
from app.schemas.parameter import (
    ParameterCreate, ParameterUpdate, ParameterResponse,
    ParameterValueCreate, ParameterValueUpdate, ParameterValueResponse,
    ScenarioCreate, ScenarioUpdate, ScenarioResponse,
    ParameterDetectionRequest, ParameterDetectionResponse,
    ParameterValidationRequest, ParameterValidationResponse,
    BulkParameterUpdateRequest, BulkParameterUpdateResponse
)

router = APIRouter()


@router.post("/detect", response_model=ParameterDetectionResponse)
async def detect_parameters(
    request: ParameterDetectionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Detect parameters from an uploaded Excel file.
    """
    # Get the uploaded file
    file = db.query(UploadedFile).filter(
        UploadedFile.id == request.file_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not file:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    try:
        detector = ParameterDetector()
        detected_params = await detector.detect_parameters(
            file.file_path, 
            current_user.id
        )
        
        # Convert to response format
        parameters = []
        for param in detected_params:
            parameters.append({
                "cell_reference": param.cell_reference,
                "sheet_name": param.sheet_name,
                "name": param.name,
                "value": param.value,
                "parameter_type": param.parameter_type,
                "category": param.category,
                "sensitivity_level": param.sensitivity_level,
                "description": param.description,
                "unit": param.unit,
                "format_type": param.format_type,
                "confidence_score": param.confidence_score,
                "validation_rules": param.validation_rules
            })
        
        return ParameterDetectionResponse(
            file_id=request.file_id,
            parameters_detected=len(parameters),
            parameters=parameters,
            detection_summary={
                "total_parameters": len(parameters),
                "by_category": {},
                "by_type": {},
                "high_confidence": len([p for p in detected_params if p.confidence_score > 0.8])
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Parameter detection failed: {str(e)}"
        )


@router.post("/", response_model=ParameterResponse, status_code=HTTP_201_CREATED)
async def create_parameter(
    parameter: ParameterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new parameter.
    """
    # Validate source file exists if provided
    if parameter.source_file_id:
        file = db.query(UploadedFile).filter(
            UploadedFile.id == parameter.source_file_id,
            UploadedFile.user_id == current_user.id
        ).first()
        if not file:
            raise HTTPException(
                status_code=HTTP_404_NOT_FOUND,
                detail="Source file not found"
            )
    
    # Create parameter
    db_parameter = Parameter(
        name=parameter.name,
        display_name=parameter.display_name,
        description=parameter.description,
        parameter_type=parameter.parameter_type,
        category=parameter.category,
        sensitivity_level=parameter.sensitivity_level,
        current_value=parameter.current_value,
        default_value=parameter.default_value,
        min_value=parameter.min_value,
        max_value=parameter.max_value,
        unit=parameter.unit,
        format_type=parameter.format_type,
        source_file_id=parameter.source_file_id,
        source_sheet=parameter.source_sheet,
        source_cell=parameter.source_cell,
        source_range=parameter.source_range,
        depends_on=parameter.depends_on,
        affects=parameter.affects,
        formula=parameter.formula,
        validation_rules=parameter.validation_rules,
        is_required=parameter.is_required,
        is_editable=parameter.is_editable,
        created_by_id=current_user.id
    )
    
    db.add(db_parameter)
    db.commit()
    db.refresh(db_parameter)
    
    return ParameterResponse.from_orm(db_parameter)


@router.get("/", response_model=List[ParameterResponse])
async def list_parameters(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[ParameterCategory] = Query(None),
    parameter_type: Optional[ParameterType] = Query(None),
    source_file_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List parameters with filtering options.
    """
    query = db.query(Parameter).filter(Parameter.created_by_id == current_user.id)
    
    # Apply filters
    if category:
        query = query.filter(Parameter.category == category)
    
    if parameter_type:
        query = query.filter(Parameter.parameter_type == parameter_type)
    
    if source_file_id:
        query = query.filter(Parameter.source_file_id == source_file_id)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Parameter.name.ilike(search_term) |
            Parameter.display_name.ilike(search_term) |
            Parameter.description.ilike(search_term)
        )
    
    parameters = query.offset(skip).limit(limit).all()
    
    return [ParameterResponse.from_orm(param) for param in parameters]


@router.get("/{parameter_id}", response_model=ParameterResponse)
async def get_parameter(
    parameter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific parameter by ID.
    """
    parameter = db.query(Parameter).filter(
        Parameter.id == parameter_id,
        Parameter.created_by_id == current_user.id
    ).first()
    
    if not parameter:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Parameter not found"
        )
    
    return ParameterResponse.from_orm(parameter)


@router.put("/{parameter_id}", response_model=ParameterResponse)
async def update_parameter(
    parameter_id: int,
    parameter_update: ParameterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a parameter.
    """
    parameter = db.query(Parameter).filter(
        Parameter.id == parameter_id,
        Parameter.created_by_id == current_user.id
    ).first()
    
    if not parameter:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Parameter not found"
        )
    
    # Update fields
    update_data = parameter_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(parameter, field, value)
    
    parameter.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(parameter)
    
    return ParameterResponse.from_orm(parameter)


@router.delete("/{parameter_id}")
async def delete_parameter(
    parameter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a parameter.
    """
    parameter = db.query(Parameter).filter(
        Parameter.id == parameter_id,
        Parameter.created_by_id == current_user.id
    ).first()
    
    if not parameter:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Parameter not found"
        )
    
    db.delete(parameter)
    db.commit()
    
    return {"message": "Parameter deleted successfully"}


@router.post("/validate", response_model=ParameterValidationResponse)
async def validate_parameter_value(
    request: ParameterValidationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Validate a parameter value against its rules.
    """
    parameter = db.query(Parameter).filter(
        Parameter.id == request.parameter_id,
        Parameter.created_by_id == current_user.id
    ).first()
    
    if not parameter:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Parameter not found"
        )
    
    validation_errors = []
    
    # Check data type
    if parameter.validation_rules and "data_type" in parameter.validation_rules:
        expected_type = parameter.validation_rules["data_type"]
        if expected_type == "float" and not isinstance(request.value, (int, float)):
            try:
                float(request.value)
            except (ValueError, TypeError):
                validation_errors.append("Value must be a number")
    
    # Check range constraints
    if isinstance(request.value, (int, float)):
        if parameter.min_value is not None and request.value < parameter.min_value:
            validation_errors.append(f"Value must be >= {parameter.min_value}")
        
        if parameter.max_value is not None and request.value > parameter.max_value:
            validation_errors.append(f"Value must be <= {parameter.max_value}")
    
    # Check required constraint
    if parameter.is_required and request.value is None:
        validation_errors.append("Parameter is required")
    
    # Check custom validation rules
    if parameter.validation_rules:
        custom_errors = await _apply_custom_validation_rules(
            request.value, 
            parameter.validation_rules
        )
        validation_errors.extend(custom_errors)
    
    return ParameterValidationResponse(
        parameter_id=request.parameter_id,
        value=request.value,
        is_valid=len(validation_errors) == 0,
        validation_errors=validation_errors,
        suggested_value=await _suggest_corrected_value(request.value, parameter) if validation_errors else None
    )


@router.post("/bulk-update", response_model=BulkParameterUpdateResponse)
async def bulk_update_parameters(
    request: BulkParameterUpdateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Bulk update parameter values.
    """
    results = []
    errors = []
    
    for update in request.updates:
        try:
            parameter = db.query(Parameter).filter(
                Parameter.id == update.parameter_id,
                Parameter.created_by_id == current_user.id
            ).first()
            
            if not parameter:
                errors.append({
                    "parameter_id": update.parameter_id,
                    "error": "Parameter not found"
                })
                continue
            
            # Validate the new value
            validation_request = ParameterValidationRequest(
                parameter_id=update.parameter_id,
                value=update.new_value
            )
            validation_result = await validate_parameter_value(
                validation_request, db, current_user
            )
            
            if not validation_result.is_valid:
                errors.append({
                    "parameter_id": update.parameter_id,
                    "error": f"Validation failed: {', '.join(validation_result.validation_errors)}"
                })
                continue
            
            # Update the parameter
            old_value = parameter.current_value
            parameter.current_value = update.new_value
            parameter.updated_at = datetime.utcnow()
            
            db.commit()
            
            results.append({
                "parameter_id": update.parameter_id,
                "old_value": old_value,
                "new_value": update.new_value,
                "change_reason": update.change_reason
            })
            
        except Exception as e:
            errors.append({
                "parameter_id": update.parameter_id,
                "error": str(e)
            })
    
    # If this is a scenario update, recalculate affected formulas
    if request.scenario_id:
        background_tasks.add_task(
            _recalculate_scenario_formulas,
            request.scenario_id,
            [update.parameter_id for update in request.updates],
            db
        )
    
    return BulkParameterUpdateResponse(
        updated_count=len(results),
        error_count=len(errors),
        results=results,
        errors=errors,
        calculation_triggered=request.scenario_id is not None
    )


@router.get("/{parameter_id}/dependencies")
async def get_parameter_dependencies(
    parameter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get dependency information for a parameter.
    """
    parameter = db.query(Parameter).filter(
        Parameter.id == parameter_id,
        Parameter.created_by_id == current_user.id
    ).first()
    
    if not parameter:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Parameter not found"
        )
    
    # Get dependencies from the parameter
    dependencies = []
    if parameter.depends_on:
        dep_params = db.query(Parameter).filter(
            Parameter.id.in_(parameter.depends_on)
        ).all()
        dependencies = [{"id": p.id, "name": p.name} for p in dep_params]
    
    # Get parameters that depend on this one
    dependents = []
    if parameter.affects:
        dep_params = db.query(Parameter).filter(
            Parameter.id.in_(parameter.affects)
        ).all()
        dependents = [{"id": p.id, "name": p.name} for p in dep_params]
    
    return {
        "parameter_id": parameter_id,
        "dependencies": dependencies,
        "dependents": dependents,
        "dependency_count": len(dependencies),
        "dependent_count": len(dependents),
        "has_circular_reference": await _check_circular_reference(parameter, db)
    }


@router.get("/{parameter_id}/history")
async def get_parameter_history(
    parameter_id: int,
    scenario_id: Optional[int] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get parameter value history.
    """
    parameter = db.query(Parameter).filter(
        Parameter.id == parameter_id,
        Parameter.created_by_id == current_user.id
    ).first()
    
    if not parameter:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Parameter not found"
        )
    
    query = db.query(ParameterValue).filter(
        ParameterValue.parameter_id == parameter_id
    )
    
    if scenario_id:
        query = query.filter(ParameterValue.scenario_id == scenario_id)
    
    history = query.order_by(ParameterValue.changed_at.desc()).limit(limit).all()
    
    return {
        "parameter_id": parameter_id,
        "scenario_id": scenario_id,
        "history": [
            {
                "id": entry.id,
                "value": entry.value,
                "original_value": entry.original_value,
                "change_reason": entry.change_reason,
                "changed_at": entry.changed_at,
                "changed_by": entry.changed_by.username if entry.changed_by else None
            }
            for entry in history
        ]
    }


# Helper functions

async def _apply_custom_validation_rules(value: Any, rules: Dict[str, Any]) -> List[str]:
    """
    Apply custom validation rules to a parameter value.
    """
    errors = []
    
    # Add custom validation logic here
    # For example, checking for specific business rules
    
    return errors


async def _suggest_corrected_value(value: Any, parameter: Parameter) -> Optional[Any]:
    """
    Suggest a corrected value if validation fails.
    """
    if not isinstance(value, (int, float)):
        return None
    
    # If value is out of range, suggest the nearest boundary
    if parameter.min_value is not None and value < parameter.min_value:
        return parameter.min_value
    
    if parameter.max_value is not None and value > parameter.max_value:
        return parameter.max_value
    
    return None


async def _check_circular_reference(parameter: Parameter, db: Session) -> bool:
    """
    Check if parameter has circular references.
    """
    # Simple circular reference check
    # In a full implementation, you'd use the formula engine
    if not parameter.depends_on or not parameter.affects:
        return False
    
    return bool(set(parameter.depends_on) & set(parameter.affects))


async def _recalculate_scenario_formulas(
    scenario_id: int, 
    changed_parameter_ids: List[int], 
    db: Session
):
    """
    Background task to recalculate scenario formulas after parameter changes.
    """
    try:
        # This would use the formula engine to recalculate
        # For now, just update the scenario's last_calculated_at
        scenario = db.query(Scenario).filter(Scenario.id == scenario_id).first()
        if scenario:
            scenario.last_calculated_at = datetime.utcnow()
            scenario.calculation_status = "completed"
            db.commit()
    except Exception as e:
        print(f"Failed to recalculate scenario {scenario_id}: {str(e)}")


@router.post("/import", response_model=Dict[str, Any])
async def import_parameters(
    file_id: int,
    auto_detect: bool = Query(True, description="Automatically detect parameters"),
    preserve_existing: bool = Query(True, description="Preserve existing parameters"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Import parameters from an Excel file.
    """
    # Get the uploaded file
    file = db.query(UploadedFile).filter(
        UploadedFile.id == file_id,
        UploadedFile.user_id == current_user.id
    ).first()
    
    if not file:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    try:
        imported_count = 0
        skipped_count = 0
        errors = []
        
        if auto_detect:
            # Use parameter detection
            detector = ParameterDetector()
            detected_params = await detector.detect_parameters(
                file.file_path, 
                current_user.id
            )
            
            for param in detected_params:
                try:
                    # Check if parameter already exists
                    existing = db.query(Parameter).filter(
                        Parameter.source_file_id == file_id,
                        Parameter.source_cell == param.cell_reference.split('!')[-1],
                        Parameter.created_by_id == current_user.id
                    ).first()
                    
                    if existing and preserve_existing:
                        skipped_count += 1
                        continue
                    
                    # Create or update parameter
                    if existing:
                        # Update existing
                        existing.current_value = param.value
                        existing.updated_at = datetime.utcnow()
                    else:
                        # Create new
                        db_parameter = Parameter(
                            name=param.name,
                            description=param.description,
                            parameter_type=param.parameter_type,
                            category=param.category,
                            sensitivity_level=param.sensitivity_level,
                            current_value=param.value,
                            default_value=param.value,
                            min_value=param.min_value,
                            max_value=param.max_value,
                            unit=param.unit,
                            format_type=param.format_type,
                            source_file_id=file_id,
                            source_sheet=param.sheet_name,
                            source_cell=param.cell_reference.split('!')[-1],
                            formula=param.formula,
                            validation_rules=param.validation_rules,
                            created_by_id=current_user.id
                        )
                        db.add(db_parameter)
                    
                    imported_count += 1
                    
                except Exception as e:
                    errors.append({
                        "parameter": param.name,
                        "error": str(e)
                    })
        
        db.commit()
        
        return {
            "file_id": file_id,
            "imported_count": imported_count,
            "skipped_count": skipped_count,
            "error_count": len(errors),
            "errors": errors,
            "message": f"Successfully imported {imported_count} parameters"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Parameter import failed: {str(e)}"
        ) 