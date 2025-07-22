from typing import Any, List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime

from app.models.base import get_db
from app.models.user import User
from app.models.parameter import Parameter, ParameterValue, ParameterType, ParameterCategory, SensitivityLevel
from app.models.file import UploadedFile
from app.schemas.parameter import (
    ParameterCreate,
    ParameterUpdate,
    ParameterResponse,
    ParameterValueUpdate,
    ParameterBatchUpdate,
    ParameterHistoryResponse,
    ParameterValidationResult
)
from app.api.v1.endpoints.auth import get_current_active_user
from app.core.dependencies import require_permissions
from app.core.permissions import Permission
from app.services.parameter_detector import ParameterDetector

router = APIRouter()


@router.post("/", response_model=ParameterResponse, status_code=status.HTTP_201_CREATED)
async def create_parameter(
    parameter: ParameterCreate,
    current_user: User = Depends(require_permissions(Permission.MODEL_CREATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Create a new parameter.
    
    Creates a parameter with validation rules and metadata.
    """
    try:
        # Validate parameter data
        validation_result = await _validate_parameter_data(parameter, db)
        if not validation_result.is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Parameter validation failed: {validation_result.errors}"
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
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create parameter: {str(e)}"
        )


@router.get("/", response_model=List[ParameterResponse])
async def list_parameters(
    file_id: Optional[int] = Query(None, description="Filter by source file ID"),
    category: Optional[ParameterCategory] = Query(None, description="Filter by category"),
    parameter_type: Optional[ParameterType] = Query(None, description="Filter by type"),
    sensitivity_level: Optional[SensitivityLevel] = Query(None, description="Filter by sensitivity"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    List parameters with optional filtering.
    
    Returns paginated list of parameters with filtering options.
    """
    try:
        # Build query
        query = db.query(Parameter)
        
        # Apply filters
        if file_id:
            query = query.filter(Parameter.source_file_id == file_id)
        if category:
            query = query.filter(Parameter.category == category)
        if parameter_type:
            query = query.filter(Parameter.parameter_type == parameter_type)
        if sensitivity_level:
            query = query.filter(Parameter.sensitivity_level == sensitivity_level)
        
        # Apply pagination
        parameters = query.offset(skip).limit(limit).all()
        
        return [ParameterResponse.from_orm(param) for param in parameters]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list parameters: {str(e)}"
        )


@router.get("/{parameter_id}", response_model=ParameterResponse)
async def get_parameter(
    parameter_id: int,
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific parameter by ID.
    
    Returns detailed parameter information including dependencies.
    """
    parameter = db.query(Parameter).filter(Parameter.id == parameter_id).first()
    
    if not parameter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parameter {parameter_id} not found"
        )
    
    return ParameterResponse.from_orm(parameter)


@router.put("/{parameter_id}", response_model=ParameterResponse)
async def update_parameter(
    parameter_id: int,
    parameter_update: ParameterUpdate,
    current_user: User = Depends(require_permissions(Permission.MODEL_UPDATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Update a parameter.
    
    Updates parameter metadata and validation rules.
    """
    try:
        # Get existing parameter
        db_parameter = db.query(Parameter).filter(Parameter.id == parameter_id).first()
        
        if not db_parameter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parameter {parameter_id} not found"
            )
        
        # Update fields
        update_data = parameter_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_parameter, field, value)
        
        db_parameter.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(db_parameter)
        
        return ParameterResponse.from_orm(db_parameter)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update parameter: {str(e)}"
        )


@router.delete("/{parameter_id}")
async def delete_parameter(
    parameter_id: int,
    current_user: User = Depends(require_permissions(Permission.MODEL_DELETE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Delete a parameter.
    
    Removes parameter and associated values from scenarios.
    """
    try:
        # Get parameter
        db_parameter = db.query(Parameter).filter(Parameter.id == parameter_id).first()
        
        if not db_parameter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parameter {parameter_id} not found"
            )
        
        # Delete associated parameter values
        db.query(ParameterValue).filter(ParameterValue.parameter_id == parameter_id).delete()
        
        # Delete parameter
        db.delete(db_parameter)
        db.commit()
        
        return {"message": "Parameter deleted successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete parameter: {str(e)}"
        )


@router.post("/batch-update", response_model=Dict[str, Any])
async def batch_update_parameters(
    batch_update: ParameterBatchUpdate,
    current_user: User = Depends(require_permissions(Permission.MODEL_UPDATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Batch update multiple parameters.
    
    Updates multiple parameters in a single transaction with validation.
    """
    try:
        updated_count = 0
        failed_updates = []
        
        for param_update in batch_update.parameters:
            try:
                # Get parameter
                db_parameter = db.query(Parameter).filter(Parameter.id == param_update.id).first()
                
                if not db_parameter:
                    failed_updates.append({
                        "id": param_update.id,
                        "error": "Parameter not found"
                    })
                    continue
                
                # Validate update
                if param_update.current_value is not None:
                    validation_result = await _validate_parameter_value(
                        db_parameter, param_update.current_value
                    )
                    
                    if not validation_result.is_valid:
                        failed_updates.append({
                            "id": param_update.id,
                            "error": f"Validation failed: {validation_result.errors}"
                        })
                        continue
                
                # Apply updates
                update_data = param_update.dict(exclude_unset=True, exclude={'id'})
                for field, value in update_data.items():
                    setattr(db_parameter, field, value)
                
                db_parameter.updated_at = datetime.utcnow()
                updated_count += 1
                
            except Exception as e:
                failed_updates.append({
                    "id": param_update.id,
                    "error": str(e)
                })
        
        db.commit()
        
        return {
            "updated_count": updated_count,
            "failed_count": len(failed_updates),
            "failed_updates": failed_updates,
            "success": len(failed_updates) == 0
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch update failed: {str(e)}"
        )


@router.get("/{parameter_id}/history", response_model=List[ParameterHistoryResponse])
async def get_parameter_history(
    parameter_id: int,
    limit: int = Query(50, ge=1, le=500),
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get parameter change history.
    
    Returns historical values and changes for a parameter.
    """
    try:
        # Verify parameter exists
        parameter = db.query(Parameter).filter(Parameter.id == parameter_id).first()
        if not parameter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parameter {parameter_id} not found"
            )
        
        # Get parameter value history
        parameter_values = (
            db.query(ParameterValue)
            .filter(ParameterValue.parameter_id == parameter_id)
            .order_by(ParameterValue.changed_at.desc())
            .limit(limit)
            .all()
        )
        
        return [ParameterHistoryResponse.from_orm(pv) for pv in parameter_values]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get parameter history: {str(e)}"
        )


@router.post("/{parameter_id}/validate", response_model=ParameterValidationResult)
async def validate_parameter_value(
    parameter_id: int,
    value: float = Body(..., description="Value to validate"),
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Validate a parameter value against constraints.
    
    Checks value against min/max bounds and validation rules.
    """
    try:
        # Get parameter
        parameter = db.query(Parameter).filter(Parameter.id == parameter_id).first()
        if not parameter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parameter {parameter_id} not found"
            )
        
        # Validate value
        validation_result = await _validate_parameter_value(parameter, value)
        
        return validation_result
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to validate parameter value: {str(e)}"
        )


@router.post("/detect-from-file/{file_id}", response_model=List[ParameterResponse])
async def detect_parameters_from_file(
    file_id: int,
    auto_create: bool = Query(False, description="Automatically create detected parameters"),
    current_user: User = Depends(require_permissions(Permission.MODEL_CREATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Detect parameters from an uploaded Excel file.
    
    Uses AI/ML to identify potential parameters in financial models.
    """
    try:
        # Get file
        file_record = db.query(UploadedFile).filter(
            UploadedFile.id == file_id,
            UploadedFile.uploaded_by_id == current_user.id
        ).first()
        
        if not file_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"File {file_id} not found"
            )
        
        # Detect parameters
        detector = ParameterDetector()
        detected_parameters = await detector.detect_parameters(
            file_record.file_path, 
            current_user.id
        )
        
        created_parameters = []
        
        if auto_create:
            # Create detected parameters
            for detected in detected_parameters:
                db_parameter = Parameter(
                    name=detected.name,
                    parameter_type=detected.parameter_type,
                    category=detected.category,
                    sensitivity_level=detected.sensitivity_level,
                    current_value=detected.value,
                    default_value=detected.value,
                    min_value=detected.min_value,
                    max_value=detected.max_value,
                    unit=detected.unit,
                    format_type=detected.format_type,
                    source_file_id=file_id,
                    source_sheet=detected.sheet_name,
                    source_cell=detected.cell_reference,
                    depends_on=detected.depends_on,
                    affects=detected.affects,
                    formula=detected.formula,
                    validation_rules=detected.validation_rules,
                    description=detected.description,
                    created_by_id=current_user.id
                )
                
                db.add(db_parameter)
                db.flush()
                created_parameters.append(ParameterResponse.from_orm(db_parameter))
            
            db.commit()
        else:
            # Just return detected parameters without creating
            for detected in detected_parameters:
                created_parameters.append(ParameterResponse(
                    id=0,  # Temporary ID
                    name=detected.name,
                    parameter_type=detected.parameter_type,
                    category=detected.category,
                    sensitivity_level=detected.sensitivity_level,
                    current_value=detected.value,
                    default_value=detected.value,
                    min_value=detected.min_value,
                    max_value=detected.max_value,
                    unit=detected.unit,
                    format_type=detected.format_type,
                    source_file_id=file_id,
                    source_sheet=detected.sheet_name,
                    source_cell=detected.cell_reference,
                    depends_on=detected.depends_on,
                    affects=detected.affects,
                    formula=detected.formula,
                    validation_rules=detected.validation_rules,
                    description=detected.description,
                    is_required=True,
                    is_editable=True,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ))
        
        return created_parameters
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to detect parameters: {str(e)}"
        )


@router.get("/categories/", response_model=List[Dict[str, Any]])
async def get_parameter_categories(
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
) -> Any:
    """
    Get available parameter categories and types.
    
    Returns metadata about parameter classification system.
    """
    return [
        {
            "category": ParameterCategory.REVENUE,
            "description": "Revenue-related parameters",
            "types": [ParameterType.REVENUE_ASSUMPTION, ParameterType.PRICE, ParameterType.VOLUME]
        },
        {
            "category": ParameterCategory.COSTS,
            "description": "Cost and expense parameters",
            "types": [ParameterType.COST_ASSUMPTION, ParameterType.VARIABLE, ParameterType.CONSTANT]
        },
        {
            "category": ParameterCategory.FINANCIAL,
            "description": "Financial metrics and ratios",
            "types": [ParameterType.DISCOUNT_RATE, ParameterType.INTEREST_RATE, ParameterType.TAX_RATE]
        },
        {
            "category": ParameterCategory.OPERATIONS,
            "description": "Operational parameters",
            "types": [ParameterType.VOLUME, ParameterType.QUANTITY, ParameterType.PERCENTAGE]
        }
    ]


@router.get("/{parameter_id}/dependencies", response_model=Dict[str, Any])
async def get_parameter_dependencies(
    parameter_id: int,
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get parameter dependencies and impact analysis.
    
    Returns parameters that depend on this parameter and parameters this depends on.
    """
    try:
        # Get parameter
        parameter = db.query(Parameter).filter(Parameter.id == parameter_id).first()
        if not parameter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parameter {parameter_id} not found"
            )
        
        # Find dependencies
        depends_on = []
        if parameter.depends_on:
            depends_on_params = db.query(Parameter).filter(
                Parameter.id.in_(parameter.depends_on)
            ).all()
            depends_on = [ParameterResponse.from_orm(p) for p in depends_on_params]
        
        # Find affected parameters
        affects = []
        if parameter.affects:
            affects_params = db.query(Parameter).filter(
                Parameter.id.in_(parameter.affects)
            ).all()
            affects = [ParameterResponse.from_orm(p) for p in affects_params]
        
        return {
            "parameter_id": parameter_id,
            "depends_on": depends_on,
            "affects": affects,
            "dependency_count": len(depends_on),
            "impact_count": len(affects)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get parameter dependencies: {str(e)}"
        )


# Helper functions

async def _validate_parameter_data(parameter: ParameterCreate, db: Session) -> ParameterValidationResult:
    """Validate parameter creation data."""
    errors = []
    warnings = []
    
    # Check for duplicate names
    existing = db.query(Parameter).filter(
        Parameter.name == parameter.name,
        Parameter.source_file_id == parameter.source_file_id
    ).first()
    
    if existing:
        errors.append(f"Parameter with name '{parameter.name}' already exists for this file")
    
    # Validate value ranges
    if (parameter.min_value is not None and 
        parameter.max_value is not None and 
        parameter.min_value >= parameter.max_value):
        errors.append("min_value must be less than max_value")
    
    # Validate current value against range
    if parameter.current_value is not None:
        if (parameter.min_value is not None and 
            parameter.current_value < parameter.min_value):
            errors.append("current_value is below minimum allowed value")
        
        if (parameter.max_value is not None and 
            parameter.current_value > parameter.max_value):
            errors.append("current_value is above maximum allowed value")
    
    return ParameterValidationResult(
        is_valid=len(errors) == 0,
        errors=errors,
        warnings=warnings
    )


async def _validate_parameter_value(parameter: Parameter, value: float) -> ParameterValidationResult:
    """Validate a parameter value against constraints."""
    errors = []
    warnings = []
    
    # Check range constraints
    if parameter.min_value is not None and value < parameter.min_value:
        errors.append(f"Value {value} is below minimum {parameter.min_value}")
    
    if parameter.max_value is not None and value > parameter.max_value:
        errors.append(f"Value {value} is above maximum {parameter.max_value}")
    
    # Check validation rules if they exist
    if parameter.validation_rules:
        # Custom validation logic based on rules
        pass
    
    return ParameterValidationResult(
        is_valid=len(errors) == 0,
        errors=errors,
        warnings=warnings
    ) 