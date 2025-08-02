"""
Parameter Management Service
Implements parameter detection, management, and real-time recalculation.
"""

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.models.file import UploadedFile
from app.models.parameter import (
    Parameter,
    ParameterCategory,
    ParameterGroup,
    ParameterHistory,
    ParameterType,
)
from app.services.formula_engine import FormulaEngine
from app.services.parameter_detector import ParameterDetector
from sqlalchemy import and_
from sqlalchemy.orm import Session


class ParameterValidationResult:
    def __init__(
        self, valid: bool, errors: List[str] = None, warnings: List[str] = None
    ):
        self.valid = valid
        self.errors = errors or []
        self.warnings = warnings or []


class RecalculationResult:
    def __init__(
        self,
        success: bool,
        affected_cells: int = 0,
        calculation_time: float = 0,
        updated_values: Dict[str, float] = None,
        error: str = None,
    ):
        self.success = success
        self.affected_cells = affected_cells
        self.calculation_time = calculation_time
        self.updated_values = updated_values or {}
        self.error = error


class ParameterService:
    """Service for managing financial model parameters."""

    def __init__(self, db: Session):
        self.db = db
        self.detector = ParameterDetector()
        self.formula_engine = FormulaEngine()

    def detect_parameters(self, model_id: str) -> List[Parameter]:
        """Detect potential parameters from a financial model."""
        model = self.db.query(UploadedFile).filter(UploadedFile.id == model_id).first()
        if not model:
            raise ValueError(f"Model {model_id} not found")

        # Use parameter detector to find potential parameters
        detected_params = self.detector.detect_from_file(model.file_path)

        parameters = []
        for param_data in detected_params:
            parameter = Parameter(
                name=param_data.get("name", f"Parameter_{len(parameters) + 1}"),
                parameter_type=param_data.get("type", ParameterType.CONSTANT),
                category=param_data.get("category", ParameterCategory.ASSUMPTIONS),
                value=param_data.get("value", 0.0),
                default_value=param_data.get("value", 0.0),
                current_value=param_data.get("value", 0.0),
                source_file_id=model_id,
                source_sheet=param_data.get("sheet"),
                source_cell=param_data.get("cell"),
                min_value=param_data.get("min_value"),
                max_value=param_data.get("max_value"),
                control_type=self._infer_control_type(param_data),
                display_format=self._infer_display_format(param_data),
                step_size=self._infer_step_size(param_data),
                created_by_id=1,  # Default user, should be passed from context
            )
            parameters.append(parameter)

        return parameters

    def create_parameter(
        self, model_id: str, config: Dict[str, Any], user_id: int
    ) -> Parameter:
        """Create a new parameter manually."""
        parameter = Parameter(
            name=config["name"],
            display_name=config.get("display_name"),
            description=config.get("description"),
            parameter_type=config.get("parameter_type", ParameterType.CONSTANT),
            category=config.get("category", ParameterCategory.ASSUMPTIONS),
            value=config["value"],
            default_value=config["value"],
            current_value=config["value"],
            min_value=config.get("min_value"),
            max_value=config.get("max_value"),
            source_file_id=model_id,
            source_cell=config.get("cell_reference"),
            control_type=config.get("control_type", "input"),
            display_format=config.get("display_format", "number"),
            step_size=config.get("step_size"),
            group_id=config.get("group_id"),
            validation_rules=config.get("validation_rules"),
            created_by_id=user_id,
        )

        self.db.add(parameter)
        self.db.commit()
        self.db.refresh(parameter)
        return parameter

    def update_parameter_value(
        self, param_id: str, value: float, user_id: int, reason: str = None
    ) -> RecalculationResult:
        """Update parameter value and trigger recalculation."""
        parameter = self.db.query(Parameter).filter(Parameter.id == param_id).first()
        if not parameter:
            raise ValueError(f"Parameter {param_id} not found")

        # Validate the new value
        validation = self.validate_parameter_value(parameter, value)
        if not validation.valid:
            return RecalculationResult(
                success=False, error=f"Validation failed: {validation.errors}"
            )

        # Record change in history
        old_value = parameter.current_value or parameter.value
        history = ParameterHistory(
            id=str(uuid.uuid4()),
            parameter_id=param_id,
            old_value=old_value,
            new_value=value,
            changed_by=user_id,
            change_reason=reason,
        )
        self.db.add(history)

        # Update parameter
        parameter.current_value = value
        parameter.updated_at = datetime.utcnow()

        self.db.commit()

        # Trigger recalculation
        return self.recalculate_model(parameter.source_file_id, {param_id: value})

    def batch_update_parameters(
        self, updates: List[Dict[str, Any]], user_id: int
    ) -> RecalculationResult:
        """Update multiple parameters in batch."""
        changed_params = {}
        model_id = None

        for update in updates:
            param_id = update["parameter_id"]
            value = update["value"]
            reason = update.get("reason")

            parameter = (
                self.db.query(Parameter).filter(Parameter.id == param_id).first()
            )
            if not parameter:
                continue

            # Validate
            validation = self.validate_parameter_value(parameter, value)
            if not validation.valid:
                continue

            # Record history
            old_value = parameter.current_value or parameter.value
            history = ParameterHistory(
                id=str(uuid.uuid4()),
                parameter_id=param_id,
                old_value=old_value,
                new_value=value,
                changed_by=user_id,
                change_reason=reason,
            )
            self.db.add(history)

            # Update parameter
            parameter.current_value = value
            parameter.updated_at = datetime.utcnow()
            changed_params[param_id] = value
            model_id = parameter.source_file_id

        self.db.commit()

        if changed_params and model_id:
            return self.recalculate_model(model_id, changed_params)

        return RecalculationResult(success=True)

    def recalculate_model(
        self, model_id: str, changed_params: Dict[str, float]
    ) -> RecalculationResult:
        """Recalculate model with changed parameters."""
        try:
            start_time = datetime.utcnow()

            # Get model file
            model = (
                self.db.query(UploadedFile).filter(UploadedFile.id == model_id).first()
            )
            if not model:
                return RecalculationResult(success=False, error="Model not found")

            # Use formula engine for recalculation
            result = self.formula_engine.recalculate_affected_cells(
                model.file_path, changed_params
            )

            calculation_time = (datetime.utcnow() - start_time).total_seconds()

            return RecalculationResult(
                success=True,
                affected_cells=len(result.get("updated_cells", {})),
                calculation_time=calculation_time,
                updated_values=result.get("updated_cells", {}),
            )

        except Exception as e:
            return RecalculationResult(success=False, error=str(e))

    def validate_parameter_value(
        self, parameter: Parameter, value: float
    ) -> ParameterValidationResult:
        """Validate parameter value against constraints."""
        errors = []
        warnings = []

        # Range validation
        if parameter.min_value is not None and value < parameter.min_value:
            errors.append(f"Value {value} is below minimum {parameter.min_value}")

        if parameter.max_value is not None and value > parameter.max_value:
            errors.append(f"Value {value} is above maximum {parameter.max_value}")

        # Type-specific validation
        if parameter.parameter_type == ParameterType.PERCENTAGE:
            if not 0 <= value <= 1:
                errors.append("Percentage values must be between 0 and 1")

        # Custom validation rules
        if parameter.validation_rules:
            for rule in parameter.validation_rules:
                if not self._apply_validation_rule(rule, value):
                    errors.append(rule.get("error_message", "Validation rule failed"))

        return ParameterValidationResult(
            valid=len(errors) == 0, errors=errors, warnings=warnings
        )

    def get_parameter_dependencies(self, param_id: str) -> Dict[str, Any]:
        """Get parameter dependency tree."""
        parameter = self.db.query(Parameter).filter(Parameter.id == param_id).first()
        if not parameter:
            return {}

        return {
            "parameter_id": param_id,
            "depends_on": parameter.depends_on or [],
            "affects": parameter.affects or [],
            "dependency_tree": self._build_dependency_tree(parameter),
        }

    def reset_parameters_to_default(
        self, model_id: str, param_ids: List[str], user_id: int
    ) -> bool:
        """Reset parameters to their default values."""
        parameters = (
            self.db.query(Parameter)
            .filter(
                and_(Parameter.source_file_id == model_id, Parameter.id.in_(param_ids))
            )
            .all()
        )

        changed_params = {}
        for parameter in parameters:
            if parameter.default_value is not None:
                # Record history
                old_value = parameter.current_value or parameter.value
                history = ParameterHistory(
                    id=str(uuid.uuid4()),
                    parameter_id=parameter.id,
                    old_value=old_value,
                    new_value=parameter.default_value,
                    changed_by=user_id,
                    change_reason="Reset to default",
                )
                self.db.add(history)

                # Update parameter
                parameter.current_value = parameter.default_value
                parameter.updated_at = datetime.utcnow()
                changed_params[str(parameter.id)] = parameter.default_value

        self.db.commit()

        if changed_params:
            result = self.recalculate_model(model_id, changed_params)
            return result.success

        return True

    def create_parameter_group(
        self, model_id: str, name: str, description: str = None
    ) -> ParameterGroup:
        """Create a new parameter group."""
        group = ParameterGroup(
            id=str(uuid.uuid4()),
            model_id=model_id,
            name=name,
            description=description,
            display_order=self._get_next_group_order(model_id),
        )

        self.db.add(group)
        self.db.commit()
        self.db.refresh(group)
        return group

    def get_model_parameters(
        self, model_id: str, grouped: bool = True
    ) -> Dict[str, Any]:
        """Get all parameters for a model, optionally grouped."""
        parameters = (
            self.db.query(Parameter).filter(Parameter.source_file_id == model_id).all()
        )

        if not grouped:
            return {"parameters": [self._parameter_to_dict(p) for p in parameters]}

        # Group parameters
        groups = (
            self.db.query(ParameterGroup)
            .filter(ParameterGroup.model_id == model_id)
            .order_by(ParameterGroup.display_order)
            .all()
        )

        grouped_params = {}
        ungrouped_params = []

        for group in groups:
            group_params = [p for p in parameters if p.group_id == group.id]
            grouped_params[group.id] = {
                "group": self._group_to_dict(group),
                "parameters": [self._parameter_to_dict(p) for p in group_params],
            }

        # Add ungrouped parameters
        for param in parameters:
            if not param.group_id:
                ungrouped_params.append(self._parameter_to_dict(param))

        return {
            "grouped_parameters": grouped_params,
            "ungrouped_parameters": ungrouped_params,
        }

    def _infer_control_type(self, param_data: Dict[str, Any]) -> str:
        """Infer appropriate control type for parameter."""
        param_type = param_data.get("type")

        if param_type == ParameterType.PERCENTAGE:
            return "slider"
        elif (
            param_data.get("min_value") is not None
            and param_data.get("max_value") is not None
        ):
            return "slider"
        else:
            return "input"

    def _infer_display_format(self, param_data: Dict[str, Any]) -> str:
        """Infer display format for parameter."""
        param_type = param_data.get("type")

        if param_type == ParameterType.PERCENTAGE:
            return "percentage"
        elif param_type == ParameterType.CURRENCY:
            return "currency"
        else:
            return "number"

    def _infer_step_size(self, param_data: Dict[str, Any]) -> Optional[float]:
        """Infer step size for parameter controls."""
        param_type = param_data.get("type")

        if param_type == ParameterType.PERCENTAGE:
            return 0.001
        elif param_type in [ParameterType.GROWTH_RATE, ParameterType.INTEREST_RATE]:
            return 0.01
        else:
            return None

    def _apply_validation_rule(self, rule: Dict[str, Any], value: float) -> bool:
        """Apply custom validation rule."""
        rule_type = rule.get("type")

        if rule_type == "range":
            return rule["min"] <= value <= rule["max"]
        elif rule_type == "positive":
            return value > 0
        elif rule_type == "non_negative":
            return value >= 0

        return True

    def _build_dependency_tree(self, parameter: Parameter) -> Dict[str, Any]:
        """Build dependency tree for parameter."""
        # Simplified implementation - would need more complex logic
        # for full dependency tracking
        return {
            "immediate_dependencies": parameter.depends_on or [],
            "immediate_dependents": parameter.affects or [],
        }

    def _get_next_group_order(self, model_id: str) -> int:
        """Get next display order for parameter group."""
        max_order = (
            self.db.query(ParameterGroup.display_order)
            .filter(ParameterGroup.model_id == model_id)
            .order_by(ParameterGroup.display_order.desc())
            .first()
        )

        return (max_order[0] + 1) if max_order and max_order[0] else 1

    def _parameter_to_dict(self, parameter: Parameter) -> Dict[str, Any]:
        """Convert parameter to dictionary."""
        return {
            "id": parameter.id,
            "name": parameter.name,
            "display_name": parameter.display_name,
            "description": parameter.description,
            "type": parameter.parameter_type,
            "category": parameter.category,
            "value": parameter.current_value or parameter.value,
            "default_value": parameter.default_value,
            "min_value": parameter.min_value,
            "max_value": parameter.max_value,
            "control_type": parameter.control_type,
            "display_format": parameter.display_format,
            "step_size": parameter.step_size,
            "group_id": parameter.group_id,
            "is_editable": parameter.is_editable,
            "source_cell": parameter.source_cell,
            "updated_at": parameter.updated_at.isoformat()
            if parameter.updated_at
            else None,
        }

    def _group_to_dict(self, group: ParameterGroup) -> Dict[str, Any]:
        """Convert parameter group to dictionary."""
        return {
            "id": group.id,
            "name": group.name,
            "description": group.description,
            "display_order": group.display_order,
            "is_expanded": group.is_expanded,
        }
