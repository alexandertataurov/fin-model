"""
Parameter Management Service
Implements parameter detection, management, and real-time recalculation.
"""

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.models.parameter import (
    Parameter,
    ParameterGroup,
    ParameterHistory,
    ParameterType,
    ParameterCategory,
    SensitivityLevel,
    Scenario,
    ParameterValue,
    ScenarioParameter,
)
from app.models.file import UploadedFile
from app.services.formula_engine import FormulaEngine
from app.services.parameter_detector import ParameterDetector
from sqlalchemy import and_
from sqlalchemy.orm import Session


class ParameterValidationResult:
    def __init__(
        self,
        valid: bool,
        errors: List[str] = None,
        warnings: List[str] = None,
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
        model = (
            self.db.query(UploadedFile)
            .filter(UploadedFile.id == model_id)
            .first()
        )
        if not model:
            raise ValueError(f"Model {model_id} not found")

        # Use parameter detector to find potential parameters
        detected_params = self.detector.detect_from_file(model.file_path)

        parameters = []
        for param_data in detected_params:
            parameter = Parameter(
                name=param_data.get(
                    "name", f"Parameter_{len(parameters) + 1}"
                ),
                parameter_type=param_data.get(
                    "type", ParameterType.CONSTANT
                ),
                category=param_data.get(
                    "category", ParameterCategory.ASSUMPTIONS
                ),
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
            parameter_type=config.get(
                "parameter_type", ParameterType.CONSTANT
            ),
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
        parameter = (
            self.db.query(Parameter)
            .filter(Parameter.id == param_id)
            .first()
        )
        if not parameter:
            raise ValueError(f"Parameter {param_id} not found")

        # Validate the new value
        validation = self.validate_parameter_value(parameter, value)
        if not validation.valid:
            return RecalculationResult(
                success=False,
                error=f"Validation failed: {validation.errors}",
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
        return self.recalculate_model(
            parameter.source_file_id, {param_id: value}
        )

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
                self.db.query(Parameter)
                .filter(Parameter.id == param_id)
                .first()
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
                self.db.query(UploadedFile)
                .filter(UploadedFile.id == model_id)
                .first()
            )
            if not model:
                return RecalculationResult(
                    success=False, error="Model not found"
                )

            # Use formula engine for recalculation
            result = self.formula_engine.recalculate_affected_cells(
                model.file_path, changed_params
            )

            calculation_time = (
                datetime.utcnow() - start_time
            ).total_seconds()

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
            errors.append(
                f"Value {value} is below minimum {parameter.min_value}"
            )

        if parameter.max_value is not None and value > parameter.max_value:
            errors.append(
                f"Value {value} is above maximum {parameter.max_value}"
            )

        # Type-specific validation
        if parameter.parameter_type == ParameterType.PERCENTAGE:
            if not 0 <= value <= 1:
                errors.append("Percentage values must be between 0 and 1")

        # Custom validation rules
        if parameter.validation_rules:
            for rule in parameter.validation_rules:
                if not self._apply_validation_rule(rule, value):
                    errors.append(
                        rule.get("error_message", "Validation rule failed")
                    )

        return ParameterValidationResult(
            valid=len(errors) == 0, errors=errors, warnings=warnings
        )

    def get_parameter_dependencies(self, param_id: str) -> Dict[str, Any]:
        """Get parameter dependency tree."""
        parameter = (
            self.db.query(Parameter)
            .filter(Parameter.id == param_id)
            .first()
        )
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
                and_(
                    Parameter.source_file_id == model_id,
                    Parameter.id.in_(param_ids),
                )
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
            self.db.query(Parameter)
            .filter(Parameter.source_file_id == model_id)
            .all()
        )

        if not grouped:
            return {
                "parameters": [
                    self._parameter_to_dict(p) for p in parameters
                ]
            }

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
            group_params = [
                p for p in parameters if p.group_id == group.id
            ]
            grouped_params[group.id] = {
                "group": self._group_to_dict(group),
                "parameters": [
                    self._parameter_to_dict(p) for p in group_params
                ],
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

    def _infer_step_size(
        self, param_data: Dict[str, Any]
    ) -> Optional[float]:
        """Infer step size for parameter controls."""
        param_type = param_data.get("type")

        if param_type == ParameterType.PERCENTAGE:
            return 0.001
        elif param_type in [
            ParameterType.GROWTH_RATE,
            ParameterType.INTEREST_RATE,
        ]:
            return 0.01
        else:
            return None

    def _apply_validation_rule(
        self, rule: Dict[str, Any], value: float
    ) -> bool:
        """Apply custom validation rule."""
        rule_type = rule.get("type")

        if rule_type == "range":
            return rule["min"] <= value <= rule["max"]
        elif rule_type == "positive":
            return value > 0
        elif rule_type == "non_negative":
            return value >= 0

        return True

    def _build_dependency_tree(
        self, parameter: Parameter
    ) -> Dict[str, Any]:
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

    # Scenario Parameter Management Methods

    def create_scenario_parameter_override(
        self,
        scenario_id: int,
        parameter_id: int,
        value: float,
        user_id: int,
        reason: str = None,
    ) -> ScenarioParameter:
        """Create or update scenario-specific parameter override."""

        # Validate scenario exists and user has access
        scenario = (
            self.db.query(Scenario)
            .filter(
                Scenario.id == scenario_id,
                Scenario.created_by_id == user_id,
            )
            .first()
        )

        if not scenario:
            raise ValueError(
                f"Scenario {scenario_id} not found or access denied"
            )

        # Validate parameter exists
        parameter = (
            self.db.query(Parameter)
            .filter(Parameter.id == parameter_id)
            .first()
        )
        if not parameter:
            raise ValueError(f"Parameter {parameter_id} not found")

        # Validate parameter value
        validation = self.validate_parameter_value(parameter, value)
        if not validation.valid:
            raise ValueError(
                f"Parameter validation failed: {validation.errors}"
            )

        # Check if override already exists
        existing_override = (
            self.db.query(ScenarioParameter)
            .filter(
                ScenarioParameter.scenario_id == scenario_id,
                ScenarioParameter.parameter_id == parameter_id,
            )
            .first()
        )

        if existing_override:
            # Update existing override
            existing_override.parameter_value = value
            existing_override.updated_at = datetime.utcnow()
            scenario_param = existing_override
        else:
            # Create new override
            scenario_param = ScenarioParameter(
                id=str(uuid.uuid4()),
                scenario_id=scenario_id,
                parameter_id=parameter_id,
                parameter_value=value,
                override_default=True,
            )
            self.db.add(scenario_param)

        # Record change in parameter value history for the scenario
        param_value = (
            self.db.query(ParameterValue)
            .filter(
                ParameterValue.scenario_id == scenario_id,
                ParameterValue.parameter_id == parameter_id,
            )
            .first()
        )

        if param_value:
            # Update existing parameter value
            old_value = param_value.value
            param_value.value = value
            param_value.change_reason = (
                reason or "Scenario parameter override"
            )
            param_value.changed_at = datetime.utcnow()
            param_value.changed_by_id = user_id
        else:
            # Create new parameter value for scenario
            param_value = ParameterValue(
                parameter_id=parameter_id,
                scenario_id=scenario_id,
                value=value,
                original_value=parameter.current_value or parameter.value,
                change_reason=reason or "Scenario parameter override",
                changed_by_id=user_id,
            )
            self.db.add(param_value)

        self.db.commit()
        self.db.refresh(scenario_param)

        return scenario_param

    def get_scenario_parameters(
        self,
        scenario_id: int,
        user_id: int,
        include_overrides_only: bool = False,
    ) -> Dict[str, Any]:
        """Get all parameters for a scenario, including overrides."""

        # Validate scenario access
        scenario = (
            self.db.query(Scenario)
            .filter(
                Scenario.id == scenario_id,
                Scenario.created_by_id == user_id,
            )
            .first()
        )

        if not scenario:
            raise ValueError(
                f"Scenario {scenario_id} not found or access denied"
            )

        # Get scenario parameter overrides
        scenario_overrides = (
            self.db.query(ScenarioParameter)
            .filter(ScenarioParameter.scenario_id == scenario_id)
            .all()
        )

        override_map = {sp.parameter_id: sp for sp in scenario_overrides}

        if include_overrides_only:
            # Only return parameters with overrides
            parameter_ids = list(override_map.keys())
            parameters = (
                self.db.query(Parameter)
                .filter(Parameter.id.in_(parameter_ids))
                .all()
            )
        else:
            # Get all parameters for the base file
            parameters = (
                self.db.query(Parameter)
                .filter(Parameter.source_file_id == scenario.base_file_id)
                .all()
            )

        # Build result with scenario-specific values
        scenario_params = []
        for param in parameters:
            param_dict = self._parameter_to_dict(param)

            # Check for scenario override
            if param.id in override_map:
                override = override_map[param.id]
                param_dict.update(
                    {
                        "scenario_value": override.parameter_value,
                        "has_override": True,
                        "override_default": override.override_default,
                        "last_updated": override.updated_at.isoformat()
                        if override.updated_at
                        else None,
                    }
                )
            else:
                param_dict.update(
                    {
                        "scenario_value": param.current_value
                        or param.value,
                        "has_override": False,
                        "override_default": False,
                    }
                )

            scenario_params.append(param_dict)

        return {
            "scenario_id": scenario_id,
            "scenario_name": scenario.name,
            "parameters": scenario_params,
            "total_parameters": len(parameters),
            "overridden_parameters": len(override_map),
        }

    def batch_update_scenario_parameters(
        self,
        scenario_id: int,
        parameter_updates: List[Dict[str, Any]],
        user_id: int,
    ) -> Dict[str, Any]:
        """Update multiple scenario parameters in batch."""

        # Validate scenario access
        scenario = (
            self.db.query(Scenario)
            .filter(
                Scenario.id == scenario_id,
                Scenario.created_by_id == user_id,
            )
            .first()
        )

        if not scenario:
            raise ValueError(
                f"Scenario {scenario_id} not found or access denied"
            )

        updated_parameters = []
        validation_errors = []

        for update in parameter_updates:
            try:
                param_id = update["parameter_id"]
                value = update["value"]
                reason = update.get("reason", "Batch parameter update")

                scenario_param = self.create_scenario_parameter_override(
                    scenario_id=scenario_id,
                    parameter_id=param_id,
                    value=value,
                    user_id=user_id,
                    reason=reason,
                )

                updated_parameters.append(
                    {
                        "parameter_id": param_id,
                        "value": value,
                        "success": True,
                    }
                )

            except Exception as e:
                param_id = update.get("parameter_id", "unknown")
                validation_errors.append(
                    {
                        "parameter_id": param_id,
                        "error": str(e),
                        "success": False,
                    }
                )

        return {
            "scenario_id": scenario_id,
            "updated_parameters": updated_parameters,
            "validation_errors": validation_errors,
            "total_updates": len(parameter_updates),
            "successful_updates": len(updated_parameters),
            "failed_updates": len(validation_errors),
        }

    def remove_scenario_parameter_override(
        self, scenario_id: int, parameter_id: int, user_id: int
    ) -> bool:
        """Remove scenario-specific parameter override, reverting to default."""

        # Validate scenario access
        scenario = (
            self.db.query(Scenario)
            .filter(
                Scenario.id == scenario_id,
                Scenario.created_by_id == user_id,
            )
            .first()
        )

        if not scenario:
            raise ValueError(
                f"Scenario {scenario_id} not found or access denied"
            )

        # Remove scenario parameter override
        scenario_override = (
            self.db.query(ScenarioParameter)
            .filter(
                ScenarioParameter.scenario_id == scenario_id,
                ScenarioParameter.parameter_id == parameter_id,
            )
            .first()
        )

        if scenario_override:
            self.db.delete(scenario_override)

        # Update parameter value to revert to default
        param_value = (
            self.db.query(ParameterValue)
            .filter(
                ParameterValue.scenario_id == scenario_id,
                ParameterValue.parameter_id == parameter_id,
            )
            .first()
        )

        if param_value:
            # Get original parameter for default value
            parameter = (
                self.db.query(Parameter)
                .filter(Parameter.id == parameter_id)
                .first()
            )
            if parameter:
                param_value.value = (
                    parameter.current_value or parameter.value
                )
                param_value.change_reason = "Removed scenario override"
                param_value.changed_at = datetime.utcnow()
                param_value.changed_by_id = user_id

        self.db.commit()
        return True

    def copy_scenario_parameters(
        self,
        source_scenario_id: int,
        target_scenario_id: int,
        user_id: int,
        parameter_ids: Optional[List[int]] = None,
    ) -> Dict[str, Any]:
        """Copy parameter overrides from one scenario to another."""

        # Validate both scenarios
        scenarios = (
            self.db.query(Scenario)
            .filter(
                Scenario.id.in_([source_scenario_id, target_scenario_id]),
                Scenario.created_by_id == user_id,
            )
            .all()
        )

        if len(scenarios) != 2:
            raise ValueError(
                "One or both scenarios not found or access denied"
            )

        # Get source scenario parameter overrides
        source_overrides = self.db.query(ScenarioParameter).filter(
            ScenarioParameter.scenario_id == source_scenario_id
        )

        if parameter_ids:
            source_overrides = source_overrides.filter(
                ScenarioParameter.parameter_id.in_(parameter_ids)
            )

        source_overrides = source_overrides.all()

        copied_parameters = []

        for source_override in source_overrides:
            try:
                self.create_scenario_parameter_override(
                    scenario_id=target_scenario_id,
                    parameter_id=source_override.parameter_id,
                    value=source_override.parameter_value,
                    user_id=user_id,
                    reason=f"Copied from scenario {source_scenario_id}",
                )

                copied_parameters.append(
                    {
                        "parameter_id": source_override.parameter_id,
                        "value": source_override.parameter_value,
                        "success": True,
                    }
                )

            except Exception as e:
                copied_parameters.append(
                    {
                        "parameter_id": source_override.parameter_id,
                        "error": str(e),
                        "success": False,
                    }
                )

        return {
            "source_scenario_id": source_scenario_id,
            "target_scenario_id": target_scenario_id,
            "copied_parameters": copied_parameters,
            "total_copied": len(
                [p for p in copied_parameters if p["success"]]
            ),
            "total_failed": len(
                [p for p in copied_parameters if not p["success"]]
            ),
        }

    def get_scenario_parameter_differences(
        self, scenario_id_1: int, scenario_id_2: int, user_id: int
    ) -> Dict[str, Any]:
        """Compare parameter values between two scenarios."""

        # Validate both scenarios
        scenarios = (
            self.db.query(Scenario)
            .filter(
                Scenario.id.in_([scenario_id_1, scenario_id_2]),
                Scenario.created_by_id == user_id,
            )
            .all()
        )

        if len(scenarios) != 2:
            raise ValueError(
                "One or both scenarios not found or access denied"
            )

        # Get parameter values for both scenarios
        scenario_1_params = self.get_scenario_parameters(
            scenario_id_1, user_id
        )["parameters"]
        scenario_2_params = self.get_scenario_parameters(
            scenario_id_2, user_id
        )["parameters"]

        # Create parameter maps
        params_1_map = {p["id"]: p for p in scenario_1_params}
        params_2_map = {p["id"]: p for p in scenario_2_params}

        differences = []

        # Compare parameters
        all_param_ids = set(params_1_map.keys()) | set(params_2_map.keys())

        for param_id in all_param_ids:
            param_1 = params_1_map.get(param_id)
            param_2 = params_2_map.get(param_id)

            if not param_1 or not param_2:
                continue  # Skip parameters not in both scenarios

            value_1 = param_1.get("scenario_value", 0)
            value_2 = param_2.get("scenario_value", 0)

            if value_1 != value_2:
                difference = value_2 - value_1
                percent_change = (
                    (difference / value_1 * 100)
                    if value_1 != 0
                    else float("inf")
                )

                differences.append(
                    {
                        "parameter_id": param_id,
                        "parameter_name": param_1.get("name"),
                        "scenario_1_value": value_1,
                        "scenario_2_value": value_2,
                        "absolute_difference": difference,
                        "percent_change": percent_change,
                        "scenario_1_has_override": param_1.get(
                            "has_override", False
                        ),
                        "scenario_2_has_override": param_2.get(
                            "has_override", False
                        ),
                    }
                )

        return {
            "scenario_1_id": scenario_id_1,
            "scenario_2_id": scenario_id_2,
            "differences": differences,
            "total_differences": len(differences),
            "total_parameters_compared": len(all_param_ids),
        }
