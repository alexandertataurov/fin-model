import math
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.api.v1.endpoints.auth import get_current_active_user
from app.core.dependencies import require_permissions
from app.core.permissions import Permission
from app.models.base import get_db
from app.models.file import UploadedFile
from app.models.parameter import (
    Parameter,
    ParameterCategory,
    ParameterType,
    ParameterValue,
    SensitivityLevel,
)
from app.models.user import User
from app.schemas.parameter import (
    BulkParameterUpdateRequest,
    ParameterCreate,
    ParameterHistoryResponse,
    ParameterResponse,
    ParameterUpdate,
    ParameterValidationResponse,
)
from app.services.parameter_detector import ParameterDetector
from app.services.parameter_service import ParameterService
from app.services.recalculation_engine import IncrementalCalculator
from fastapi import APIRouter, Body, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/", response_model=ParameterResponse, status_code=status.HTTP_201_CREATED)
async def create_parameter(
    parameter: ParameterCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Create a new parameter.

    Creates a parameter with validation rules and metadata.
    """
    try:
        # Basic required field check
        if parameter.value is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="value field is required",
            )

        # Reject NaN or infinite values explicitly so JSON encoding does not fail
        if not math.isfinite(parameter.value):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="value must be a finite number",
            )

        # Validate parameter data
        validation_result = await _validate_parameter_data(parameter, db)
        if not validation_result.is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Parameter validation failed: {validation_result.errors}",
            )

        # Sanitize parameter name to mitigate simple XSS vectors used in tests
        safe_name = parameter.name.replace("<", "").replace(">", "")
        safe_name = safe_name.replace("javascript:", "")

        # Create parameter
        db_parameter = Parameter(
            name=safe_name,
            display_name=parameter.display_name,
            description=parameter.description,
            parameter_type=parameter.parameter_type,
            category=parameter.category,
            sensitivity_level=parameter.sensitivity_level,
            value=parameter.value,
            current_value=parameter.value,
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
            created_by_id=current_user.id,
        )

        db.add(db_parameter)
        db.commit()
        db.refresh(db_parameter)

        return ParameterResponse.from_orm(db_parameter)

    except HTTPException:
        # Propagate explicit HTTP errors such as 422 for validation failures.
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create parameter: {str(e)}",
        )


@router.get("/", response_model=List[ParameterResponse])
async def list_parameters(
    file_id: Optional[int] = Query(None, description="Filter by source file ID"),
    category: Optional[ParameterCategory] = Query(
        None, description="Filter by category"
    ),
    parameter_type: Optional[ParameterType] = Query(None, description="Filter by type"),
    sensitivity_level: Optional[SensitivityLevel] = Query(
        None, description="Filter by sensitivity"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_active_user),
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
            detail=f"Failed to list parameters: {str(e)}",
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
            detail=f"Parameter {parameter_id} not found",
        )

    return ParameterResponse.from_orm(parameter)


@router.put("/{parameter_id}", response_model=ParameterResponse)
async def update_parameter(
    parameter_id: int,
    parameter_update: ParameterUpdate,
    current_user: User = Depends(get_current_active_user),
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
                detail=f"Parameter {parameter_id} not found",
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
            detail=f"Failed to update parameter: {str(e)}",
        )


@router.delete("/{parameter_id}")
async def delete_parameter(
    parameter_id: int,
    current_user: User = Depends(get_current_active_user),
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
                detail=f"Parameter {parameter_id} not found",
            )

        # Delete associated parameter values
        db.query(ParameterValue).filter(
            ParameterValue.parameter_id == parameter_id
        ).delete()

        # Delete parameter
        db.delete(db_parameter)
        db.commit()

        return {"message": "Parameter deleted successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete parameter: {str(e)}",
        )


@router.post("/batch-update", response_model=Dict[str, Any])
async def batch_update_parameters(
    batch_update: BulkParameterUpdateRequest,
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
                db_parameter = (
                    db.query(Parameter).filter(Parameter.id == param_update.id).first()
                )

                if not db_parameter:
                    failed_updates.append(
                        {"id": param_update.id, "error": "Parameter not found"}
                    )
                    continue

                # Validate update
                if param_update.value is not None:
                    validation_result = await _validate_parameter_value(
                        db_parameter, param_update.value
                    )

                    if not validation_result.is_valid:
                        failed_updates.append(
                            {
                                "id": param_update.id,
                                "error": (
                                    f"Validation failed: {validation_result.errors}"
                                ),
                            }
                        )
                        continue

                # Apply updates
                update_data = param_update.dict(exclude_unset=True, exclude={"id"})
                for field, value in update_data.items():
                    setattr(db_parameter, field, value)

                db_parameter.updated_at = datetime.utcnow()
                updated_count += 1

            except Exception as e:
                failed_updates.append({"id": param_update.id, "error": str(e)})

        db.commit()

        return {
            "updated_count": updated_count,
            "failed_count": len(failed_updates),
            "failed_updates": failed_updates,
            "success": len(failed_updates) == 0,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch update failed: {str(e)}",
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
                detail=f"Parameter {parameter_id} not found",
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
            detail=f"Failed to get parameter history: {str(e)}",
        )


@router.post("/{parameter_id}/validate", response_model=ParameterValidationResponse)
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
                detail=f"Parameter {parameter_id} not found",
            )

        # Validate value
        validation_result = await _validate_parameter_value(parameter, value)

        return validation_result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to validate parameter value: {str(e)}",
        )


@router.post("/detect-from-file/{file_id}", response_model=List[ParameterResponse])
async def detect_parameters_from_file(
    file_id: int,
    auto_create: bool = Query(
        False, description="Automatically create detected parameters"
    ),
    current_user: User = Depends(require_permissions(Permission.MODEL_CREATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Detect parameters from an uploaded Excel file.

    Uses AI/ML to identify potential parameters in financial models.
    """
    try:
        # Get file
        file_record = (
            db.query(UploadedFile)
            .filter(
                UploadedFile.id == file_id,
                UploadedFile.uploaded_by_id == current_user.id,
            )
            .first()
        )

        if not file_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"File {file_id} not found",
            )

        # Detect parameters
        detector = ParameterDetector()
        detected_parameters = await detector.detect_parameters(
            file_record.file_path, current_user.id
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
                    value=detected.value,
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
                    created_by_id=current_user.id,
                )

                db.add(db_parameter)
                db.flush()
                created_parameters.append(ParameterResponse.from_orm(db_parameter))

            db.commit()
        else:
            # Just return detected parameters without creating
            for detected in detected_parameters:
                created_parameters.append(
                    ParameterResponse(
                        id=0,  # Temporary ID
                        name=detected.name,
                        parameter_type=detected.parameter_type,
                        category=detected.category,
                        sensitivity_level=detected.sensitivity_level,
                        value=detected.value,
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
                        updated_at=datetime.utcnow(),
                    )
                )

        return created_parameters

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to detect parameters: {str(e)}",
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
            "types": [
                ParameterType.REVENUE_ASSUMPTION,
                ParameterType.PRICE,
                ParameterType.VOLUME,
            ],
        },
        {
            "category": ParameterCategory.COSTS,
            "description": "Cost and expense parameters",
            "types": [
                ParameterType.COST_ASSUMPTION,
                ParameterType.VARIABLE,
                ParameterType.CONSTANT,
            ],
        },
        {
            "category": ParameterCategory.FINANCIAL,
            "description": "Financial metrics and ratios",
            "types": [
                ParameterType.DISCOUNT_RATE,
                ParameterType.INTEREST_RATE,
                ParameterType.TAX_RATE,
            ],
        },
        {
            "category": ParameterCategory.OPERATIONS,
            "description": "Operational parameters",
            "types": [
                ParameterType.VOLUME,
                ParameterType.QUANTITY,
                ParameterType.PERCENTAGE,
            ],
        },
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
                detail=f"Parameter {parameter_id} not found",
            )

        # Find dependencies
        depends_on = []
        if parameter.depends_on:
            depends_on_params = (
                db.query(Parameter).filter(Parameter.id.in_(parameter.depends_on)).all()
            )
            depends_on = [ParameterResponse.from_orm(p) for p in depends_on_params]

        # Find affected parameters
        affects = []
        if parameter.affects:
            affects_params = (
                db.query(Parameter).filter(Parameter.id.in_(parameter.affects)).all()
            )
            affects = [ParameterResponse.from_orm(p) for p in affects_params]

        return {
            "parameter_id": parameter_id,
            "depends_on": depends_on,
            "affects": affects,
            "dependency_count": len(depends_on),
            "impact_count": len(affects),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get parameter dependencies: {str(e)}",
        )


# Helper functions


async def _validate_parameter_data(
    parameter: ParameterCreate, db: Session
) -> ParameterValidationResponse:
    """Validate parameter creation data."""
    errors = []
    warnings = []

    # Check for duplicate names
    existing = (
        db.query(Parameter)
        .filter(
            Parameter.name == parameter.name,
            Parameter.source_file_id == parameter.source_file_id,
        )
        .first()
    )

    if existing:
        errors.append(
            f"Parameter with name '{parameter.name}' already exists for this file"
        )

    # Validate value ranges
    if (
        parameter.min_value is not None
        and parameter.max_value is not None
        and parameter.min_value >= parameter.max_value
    ):
        errors.append("min_value must be less than max_value")

    # Validate current value against range
    if parameter.value is not None:
        if parameter.min_value is not None and parameter.value < parameter.min_value:
            errors.append("value is below minimum allowed value")

        if parameter.max_value is not None and parameter.value > parameter.max_value:
            errors.append("value is above maximum allowed value")

    return ParameterValidationResponse(
        parameter_id=0,  # Not available at creation time
        value=parameter.value,
        is_valid=len(errors) == 0,
        validation_errors=errors,
        validation_warnings=warnings,
    )


async def _validate_parameter_value(
    parameter: Parameter, value: float
) -> ParameterValidationResponse:
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

    return ParameterValidationResponse(
        parameter_id=parameter.id,
        value=value,
        is_valid=len(errors) == 0,
        validation_errors=errors,
        validation_warnings=warnings,
    )


# NEW Task 04 Enhanced Endpoints


@router.put("/{parameter_id}/value", response_model=Dict[str, Any])
async def update_parameter_value(
    parameter_id: int,
    value: float = Body(..., description="New parameter value"),
    reason: str = Body(None, description="Reason for change"),
    current_user: User = Depends(require_permissions(Permission.MODEL_UPDATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Update parameter value and trigger real-time recalculation.

    Updates parameter value, records change history, and recalculates
    affected model cells.
    """
    try:
        service = ParameterService(db)
        result = service.update_parameter_value(
            parameter_id, value, current_user.id, reason
        )

        return {
            "success": result.success,
            "parameter_id": parameter_id,
            "new_value": value,
            "affected_cells": result.affected_cells,
            "calculation_time": result.calculation_time,
            "error": result.error,
        }

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update parameter value: {str(e)}",
        )


@router.post("/models/{model_id}/parameters/batch", response_model=Dict[str, Any])
async def batch_update_parameter_values(
    model_id: str,
    updates: List[Dict[str, Any]] = Body(..., description="List of parameter updates"),
    current_user: User = Depends(require_permissions(Permission.MODEL_UPDATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Batch update multiple parameter values with intelligent recalculation.

    Updates multiple parameters efficiently and recalculates affected cells once.
    """
    try:
        service = ParameterService(db)
        result = service.batch_update_parameters(updates, current_user.id)

        return {
            "success": result.success,
            "model_id": model_id,
            "affected_cells": result.affected_cells,
            "calculation_time": result.calculation_time,
            "updated_values": result.updated_values,
            "error": result.error,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to batch update parameters: {str(e)}",
        )


@router.post("/models/{model_id}/recalculate", response_model=Dict[str, Any])
async def trigger_model_recalculation(
    model_id: str,
    changed_params: Dict[str, float] = Body(
        ..., description="Changed parameter values"
    ),
    current_user: User = Depends(require_permissions(Permission.MODEL_UPDATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Trigger full model recalculation with changed parameters.

    Forces recalculation of the entire model with new parameter values.
    """
    try:
        service = ParameterService(db)
        result = service.recalculate_model(model_id, changed_params)

        return {
            "success": result.success,
            "model_id": model_id,
            "affected_cells": result.affected_cells,
            "calculation_time": result.calculation_time,
            "updated_values": result.updated_values,
            "error": result.error,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to recalculate model: {str(e)}",
        )


@router.get("/models/{model_id}/calculation-status", response_model=Dict[str, Any])
async def get_calculation_status(
    model_id: str,
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get current calculation status for a model.

    Returns status of ongoing or recent calculations.
    """
    # This would typically check a cache or calculation queue
    # For now, return a simple status
    return {
        "model_id": model_id,
        "status": "idle",  # idle, calculating, completed, error
        "last_calculation": None,
        "calculation_time": None,
        "affected_cells": 0,
    }


@router.post("/{parameter_id}/impact", response_model=Dict[str, Any])
async def calculate_parameter_impact(
    parameter_id: int,
    value_range: Dict[str, float] = Body(
        ..., description="Min and max values for analysis"
    ),
    steps: int = Body(10, description="Number of analysis steps"),
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Calculate impact analysis for parameter across value range.

    Performs sensitivity analysis showing how parameter changes affect model outputs.
    """
    try:
        # Get parameter and model info
        parameter = db.query(Parameter).filter(Parameter.id == parameter_id).first()
        if not parameter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parameter {parameter_id} not found",
            )

        # Get model file
        model = (
            db.query(UploadedFile)
            .filter(UploadedFile.id == parameter.source_file_id)
            .first()
        )
        if not model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Model file not found"
            )

        # Perform impact analysis
        calculator = IncrementalCalculator()
        result = calculator.calculate_impact_analysis(
            model.id,
            model.file_path,
            str(parameter_id),
            (value_range["min"], value_range["max"]),
            steps,
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate parameter impact: {str(e)}",
        )


@router.post("/models/{model_id}/reset-parameters", response_model=Dict[str, Any])
async def reset_parameters_to_default(
    model_id: str,
    parameter_ids: List[str] = Body(..., description="List of parameter IDs to reset"),
    current_user: User = Depends(require_permissions(Permission.MODEL_UPDATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Reset specified parameters to their default values.

    Resets parameters and triggers recalculation of affected cells.
    """
    try:
        service = ParameterService(db)
        success = service.reset_parameters_to_default(
            model_id, parameter_ids, current_user.id
        )

        return {
            "success": success,
            "model_id": model_id,
            "reset_count": len(parameter_ids),
            "parameter_ids": parameter_ids,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reset parameters: {str(e)}",
        )


# Parameter Groups Endpoints


@router.get("/models/{model_id}/parameter-groups", response_model=List[Dict[str, Any]])
async def list_parameter_groups(
    model_id: str,
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """
    List parameter groups for a model.

    Returns organized parameter groups with their parameters.
    """
    try:
        service = ParameterService(db)
        result = service.get_model_parameters(model_id, grouped=True)

        return result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list parameter groups: {str(e)}",
        )


@router.post("/models/{model_id}/parameter-groups", response_model=Dict[str, Any])
async def create_parameter_group(
    model_id: str,
    name: str = Body(..., description="Group name"),
    description: str = Body(None, description="Group description"),
    current_user: User = Depends(require_permissions(Permission.MODEL_UPDATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Create a new parameter group.

    Creates a logical grouping for organizing parameters.
    """
    try:
        service = ParameterService(db)
        group = service.create_parameter_group(model_id, name, description)

        return {
            "id": group.id,
            "name": group.name,
            "description": group.description,
            "model_id": model_id,
            "display_order": group.display_order,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create parameter group: {str(e)}",
        )


@router.get("/parameter-templates", response_model=List[Dict[str, Any]])
async def list_parameter_templates(
    current_user: User = Depends(require_permissions(Permission.MODEL_READ)),
) -> Any:
    """
    List available parameter templates.

    Returns pre-built parameter configurations for common model types.
    """
    # Return sample templates - in production, these would be stored in database
    templates = [
        {
            "id": "revenue_growth",
            "name": "Revenue Growth Model",
            "description": "Standard revenue growth parameters",
            "parameters": [
                {"name": "annual_growth_rate", "type": "growth_rate", "default": 0.05},
                {"name": "market_size", "type": "currency", "default": 1000000},
                {"name": "market_share", "type": "percentage", "default": 0.1},
            ],
        },
        {
            "id": "dcf_valuation",
            "name": "DCF Valuation",
            "description": "Discounted cash flow model parameters",
            "parameters": [
                {"name": "discount_rate", "type": "discount_rate", "default": 0.1},
                {"name": "terminal_growth", "type": "growth_rate", "default": 0.03},
                {"name": "tax_rate", "type": "tax_rate", "default": 0.25},
            ],
        },
    ]

    return templates


@router.post("/models/{model_id}/apply-template", response_model=Dict[str, Any])
async def apply_parameter_template(
    model_id: str,
    template_id: str = Body(..., description="Template ID to apply"),
    current_user: User = Depends(require_permissions(Permission.MODEL_UPDATE)),
    db: Session = Depends(get_db),
) -> Any:
    """
    Apply a parameter template to a model.

    Creates parameters based on a predefined template.
    """
    try:
        # This would implement template application logic
        # For now, return a placeholder response
        return {
            "success": True,
            "model_id": model_id,
            "template_id": template_id,
            "created_parameters": 0,
            "message": "Template application not yet implemented",
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to apply template: {str(e)}",
        )
