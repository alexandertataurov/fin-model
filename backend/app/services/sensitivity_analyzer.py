import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
import json
from scipy import stats
from sqlalchemy.orm import Session
import concurrent.futures
from multiprocessing import Pool

from app.models.parameter import (
    Parameter,
    ParameterValue,
    Scenario,
    SensitivityAnalysis,
)
from app.models.user import User
from app.services.formula_engine import FormulaEngine


@dataclass
class SensitivityConfig:
    """Configuration for sensitivity analysis."""

    parameter_id: int
    min_value: float
    max_value: float
    step_size: Optional[float] = None
    distribution: str = "uniform"  # uniform, normal, triangular
    mean: Optional[float] = None
    std_dev: Optional[float] = None


@dataclass
class SensitivityResult:
    """Result of sensitivity analysis for a single parameter."""

    parameter_id: int
    parameter_name: str
    base_value: float
    sensitivity_coefficient: float
    impact_range: Tuple[float, float]
    correlation: Optional[float] = None
    p_value: Optional[float] = None
    confidence_interval: Optional[Tuple[float, float]] = None


@dataclass
class MonteCarloResult:
    """Result of Monte Carlo simulation."""

    iterations: int
    target_mean: float
    target_std: float
    target_percentiles: Dict[int, float]
    confidence_intervals: Dict[int, Tuple[float, float]]
    parameter_correlations: Dict[int, float]
    scenario_outcomes: List[float]


class SensitivityAnalyzer:
    """Service for sensitivity analysis and Monte Carlo simulation."""

    def __init__(self, db: Session):
        self.db = db
        self.formula_engine = FormulaEngine()

    async def run_tornado_analysis(
        self,
        scenario_id: int,
        target_parameter_id: int,
        input_parameters: List[SensitivityConfig],
        user_id: int,
        confidence_level: float = 0.95,
    ) -> Dict[str, Any]:
        """
        Run tornado chart analysis showing parameter impact ranking.
        """
        # Get base scenario
        scenario = (
            self.db.query(Scenario)
            .filter(
                Scenario.id == scenario_id,
                Scenario.created_by_id == user_id,
            )
            .first()
        )

        if not scenario:
            raise ValueError("Scenario not found")

        # Get target parameter
        target_param = (
            self.db.query(Parameter)
            .filter(Parameter.id == target_parameter_id)
            .first()
        )

        if not target_param:
            raise ValueError("Target parameter not found")

        # Load workbook and apply base scenario values
        self.formula_engine.load_workbook_data(scenario.base_file.file_path)
        await self._apply_scenario_values(scenario_id)

        # Calculate base value
        base_result = self.formula_engine.calculate_cell(
            f"{target_param.source_sheet}!{target_param.source_cell}"
        )
        base_value = base_result.value if base_result.error is None else 0

        # Analyze each input parameter
        sensitivity_results = []

        for config in input_parameters:
            param = (
                self.db.query(Parameter)
                .filter(Parameter.id == config.parameter_id)
                .first()
            )

            if not param:
                continue

            # Calculate sensitivity for this parameter
            result = await self._calculate_parameter_sensitivity(
                param, config, target_param, base_value, scenario_id
            )
            sensitivity_results.append(result)

        # Sort by absolute sensitivity coefficient
        sensitivity_results.sort(
            key=lambda x: abs(x.sensitivity_coefficient), reverse=True
        )

        # Generate chart data
        chart_data = await self._generate_tornado_chart_data(
            sensitivity_results
        )

        # Create analysis record
        analysis = SensitivityAnalysis(
            name=f"Tornado Analysis - {target_param.name}",
            analysis_type="tornado",
            scenario_id=scenario_id,
            target_parameter_id=target_parameter_id,
            input_parameters=[
                {
                    "parameter_id": config.parameter_id,
                    "min_value": config.min_value,
                    "max_value": config.max_value,
                    "distribution": config.distribution,
                }
                for config in input_parameters
            ],
            results=[
                {
                    "parameter_id": result.parameter_id,
                    "parameter_name": result.parameter_name,
                    "sensitivity_coefficient": result.sensitivity_coefficient,
                    "impact_range": list(result.impact_range),
                    "correlation": result.correlation,
                }
                for result in sensitivity_results
            ],
            chart_data=chart_data,
            summary_statistics={
                "total_parameters": len(sensitivity_results),
                "highest_impact": sensitivity_results[0].parameter_name
                if sensitivity_results
                else None,
                "total_variance_explained": sum(
                    abs(r.sensitivity_coefficient)
                    for r in sensitivity_results[:5]
                ),
            },
            status="completed",
            created_by_id=user_id,
        )

        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)

        return {
            "analysis_id": analysis.id,
            "scenario_id": scenario_id,
            "target_parameter_id": target_parameter_id,
            "analysis_type": "tornado",
            "results": [
                {
                    "parameter_id": result.parameter_id,
                    "parameter_name": result.parameter_name,
                    "sensitivity_coefficient": result.sensitivity_coefficient,
                    "impact_range": result.impact_range,
                    "correlation": result.correlation,
                }
                for result in sensitivity_results
            ],
            "chart_data": chart_data,
            "summary_statistics": analysis.summary_statistics,
            "execution_time": 0,  # Would be calculated in real implementation
            "status": "completed",
        }

    async def run_monte_carlo_simulation(
        self,
        scenario_id: int,
        target_parameter_id: int,
        input_parameters: List[SensitivityConfig],
        user_id: int,
        iterations: int = 1000,
        confidence_level: float = 0.95,
        random_seed: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Run Monte Carlo simulation for uncertainty analysis.
        """
        if random_seed:
            np.random.seed(random_seed)

        # Get base scenario and target parameter
        scenario = (
            self.db.query(Scenario)
            .filter(
                Scenario.id == scenario_id,
                Scenario.created_by_id == user_id,
            )
            .first()
        )

        if not scenario:
            raise ValueError("Scenario not found")

        target_param = (
            self.db.query(Parameter)
            .filter(Parameter.id == target_parameter_id)
            .first()
        )

        if not target_param:
            raise ValueError("Target parameter not found")

        # Generate parameter samples
        parameter_samples = await self._generate_parameter_samples(
            input_parameters, iterations
        )

        # Run simulations
        outcomes = []
        parameter_correlations = {}

        # Load base scenario
        self.formula_engine.load_workbook_data(scenario.base_file.file_path)
        await self._apply_scenario_values(scenario_id)

        for i in range(iterations):
            # Apply parameter values for this iteration
            for j, config in enumerate(input_parameters):
                param = (
                    self.db.query(Parameter)
                    .filter(Parameter.id == config.parameter_id)
                    .first()
                )

                if param and param.source_cell:
                    cell_ref = f"{param.source_sheet}!{param.source_cell}"
                    sample_value = parameter_samples[j][i]
                    self.formula_engine.update_cell_value(
                        cell_ref, sample_value
                    )

            # Calculate target value
            target_cell_ref = (
                f"{target_param.source_sheet}!{target_param.source_cell}"
            )
            result = self.formula_engine.calculate_cell(target_cell_ref)

            if result.error is None:
                outcomes.append(result.value)
            else:
                outcomes.append(np.nan)

        # Remove NaN values
        valid_outcomes = [x for x in outcomes if not np.isnan(x)]

        if len(valid_outcomes) < iterations * 0.5:
            raise ValueError(
                "Too many calculation errors in Monte Carlo simulation"
            )

        # Calculate statistics
        outcomes_array = np.array(valid_outcomes)

        # Calculate percentiles
        percentiles = {}
        for p in [1, 5, 10, 25, 50, 75, 90, 95, 99]:
            percentiles[p] = float(np.percentile(outcomes_array, p))

        # Calculate confidence intervals
        confidence_intervals = {}
        alpha = 1 - confidence_level
        lower_percentile = (alpha / 2) * 100
        upper_percentile = (1 - alpha / 2) * 100

        confidence_intervals[int(confidence_level * 100)] = (
            float(np.percentile(outcomes_array, lower_percentile)),
            float(np.percentile(outcomes_array, upper_percentile)),
        )

        # Calculate parameter correlations
        for j, config in enumerate(input_parameters):
            param_values = parameter_samples[j][: len(valid_outcomes)]
            correlation = np.corrcoef(param_values, valid_outcomes)[0, 1]
            parameter_correlations[config.parameter_id] = (
                float(correlation) if not np.isnan(correlation) else 0.0
            )

        # Generate chart data
        chart_data = await self._generate_monte_carlo_chart_data(
            outcomes_array, parameter_samples, input_parameters
        )

        # Create analysis record
        analysis = SensitivityAnalysis(
            name=f"Monte Carlo Analysis - {target_param.name}",
            analysis_type="monte_carlo",
            scenario_id=scenario_id,
            target_parameter_id=target_parameter_id,
            input_parameters=[
                {
                    "parameter_id": config.parameter_id,
                    "min_value": config.min_value,
                    "max_value": config.max_value,
                    "distribution": config.distribution,
                }
                for config in input_parameters
            ],
            results=[
                {
                    "parameter_id": config.parameter_id,
                    "correlation": parameter_correlations.get(
                        config.parameter_id, 0
                    ),
                }
                for config in input_parameters
            ],
            chart_data=chart_data,
            summary_statistics={
                "iterations": len(valid_outcomes),
                "target_mean": float(np.mean(outcomes_array)),
                "target_std": float(np.std(outcomes_array)),
                "target_min": float(np.min(outcomes_array)),
                "target_max": float(np.max(outcomes_array)),
                "percentiles": percentiles,
                "confidence_intervals": confidence_intervals,
                "parameter_correlations": parameter_correlations,
            },
            iterations=len(valid_outcomes),
            status="completed",
            created_by_id=user_id,
        )

        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)

        return {
            "analysis_id": analysis.id,
            "scenario_id": scenario_id,
            "target_parameter_id": target_parameter_id,
            "analysis_type": "monte_carlo",
            "results": {
                "iterations": len(valid_outcomes),
                "target_mean": float(np.mean(outcomes_array)),
                "target_std": float(np.std(outcomes_array)),
                "percentiles": percentiles,
                "confidence_intervals": confidence_intervals,
                "parameter_correlations": parameter_correlations,
            },
            "chart_data": chart_data,
            "summary_statistics": analysis.summary_statistics,
            "execution_time": 0,  # Would be calculated in real implementation
            "status": "completed",
        }

    async def run_spider_analysis(
        self,
        scenario_id: int,
        target_parameter_id: int,
        input_parameters: List[SensitivityConfig],
        user_id: int,
        variation_percentages: List[float] = [
            -30,
            -20,
            -10,
            0,
            10,
            20,
            30,
        ],
    ) -> Dict[str, Any]:
        """
        Run spider chart analysis showing parameter variation effects.
        """
        # Get base scenario and target parameter
        scenario = (
            self.db.query(Scenario)
            .filter(
                Scenario.id == scenario_id,
                Scenario.created_by_id == user_id,
            )
            .first()
        )

        if not scenario:
            raise ValueError("Scenario not found")

        target_param = (
            self.db.query(Parameter)
            .filter(Parameter.id == target_parameter_id)
            .first()
        )

        if not target_param:
            raise ValueError("Target parameter not found")

        # Load workbook and apply base scenario values
        self.formula_engine.load_workbook_data(scenario.base_file.file_path)
        await self._apply_scenario_values(scenario_id)

        # Calculate base value
        base_result = self.formula_engine.calculate_cell(
            f"{target_param.source_sheet}!{target_param.source_cell}"
        )
        base_value = base_result.value if base_result.error is None else 0

        # Analyze each parameter across variation range
        spider_results = {}

        for config in input_parameters:
            param = (
                self.db.query(Parameter)
                .filter(Parameter.id == config.parameter_id)
                .first()
            )

            if not param:
                continue

            # Get base parameter value
            base_param_value = await self._get_parameter_value(
                param, scenario_id
            )

            # Calculate target values for each variation
            variation_results = {}

            for variation_pct in variation_percentages:
                # Calculate new parameter value
                new_param_value = base_param_value * (1 + variation_pct / 100)

                # Apply the new value
                cell_ref = f"{param.source_sheet}!{param.source_cell}"
                self.formula_engine.update_cell_value(cell_ref, new_param_value)

                # Calculate target value
                target_result = self.formula_engine.calculate_cell(
                    f"{target_param.source_sheet}!{target_param.source_cell}"
                )

                if target_result.error is None:
                    # Calculate percentage change in target
                    target_change_pct = (
                        ((target_result.value - base_value) / base_value * 100)
                        if base_value != 0
                        else 0
                    )
                    variation_results[variation_pct] = target_change_pct
                else:
                    variation_results[variation_pct] = 0

                # Reset parameter value
                self.formula_engine.update_cell_value(
                    cell_ref, base_param_value
                )

            spider_results[config.parameter_id] = {
                "parameter_name": param.display_name or param.name,
                "variation_results": variation_results,
            }

        # Generate chart data
        chart_data = await self._generate_spider_chart_data(
            spider_results, variation_percentages
        )

        # Create analysis record
        analysis = SensitivityAnalysis(
            name=f"Spider Analysis - {target_param.name}",
            analysis_type="spider",
            scenario_id=scenario_id,
            target_parameter_id=target_parameter_id,
            input_parameters=[
                {
                    "parameter_id": config.parameter_id,
                    "min_value": config.min_value,
                    "max_value": config.max_value,
                }
                for config in input_parameters
            ],
            results=[
                {
                    "parameter_id": param_id,
                    "parameter_name": data["parameter_name"],
                    "variation_results": data["variation_results"],
                }
                for param_id, data in spider_results.items()
            ],
            chart_data=chart_data,
            summary_statistics={
                "variation_percentages": variation_percentages,
                "parameter_count": len(spider_results),
                "max_sensitivity": max(
                    max(abs(v) for v in data["variation_results"].values())
                    for data in spider_results.values()
                )
                if spider_results
                else 0,
            },
            status="completed",
            created_by_id=user_id,
        )

        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)

        return {
            "analysis_id": analysis.id,
            "scenario_id": scenario_id,
            "target_parameter_id": target_parameter_id,
            "analysis_type": "spider",
            "results": [
                {
                    "parameter_id": param_id,
                    "parameter_name": data["parameter_name"],
                    "variation_results": data["variation_results"],
                }
                for param_id, data in spider_results.items()
            ],
            "chart_data": chart_data,
            "summary_statistics": analysis.summary_statistics,
            "execution_time": 0,
            "status": "completed",
        }

    # Helper methods

    async def _calculate_parameter_sensitivity(
        self,
        parameter: Parameter,
        config: SensitivityConfig,
        target_param: Parameter,
        base_value: float,
        scenario_id: int,
    ) -> SensitivityResult:
        """
        Calculate sensitivity coefficient for a single parameter.
        """
        # Get base parameter value
        base_param_value = await self._get_parameter_value(
            parameter, scenario_id
        )

        # Calculate at min and max values
        cell_ref = f"{parameter.source_sheet}!{parameter.source_cell}"
        target_cell_ref = (
            f"{target_param.source_sheet}!{target_param.source_cell}"
        )

        # Min value calculation
        self.formula_engine.update_cell_value(cell_ref, config.min_value)
        min_result = self.formula_engine.calculate_cell(target_cell_ref)
        min_target_value = (
            min_result.value if min_result.error is None else base_value
        )

        # Max value calculation
        self.formula_engine.update_cell_value(cell_ref, config.max_value)
        max_result = self.formula_engine.calculate_cell(target_cell_ref)
        max_target_value = (
            max_result.value if max_result.error is None else base_value
        )

        # Reset to base value
        self.formula_engine.update_cell_value(cell_ref, base_param_value)

        # Calculate sensitivity coefficient
        param_range = config.max_value - config.min_value
        target_range = max_target_value - min_target_value

        sensitivity_coefficient = (
            (target_range / param_range) if param_range != 0 else 0
        )

        # Calculate correlation (simplified)
        correlation = self._calculate_correlation(
            [config.min_value, base_param_value, config.max_value],
            [min_target_value, base_value, max_target_value],
        )

        return SensitivityResult(
            parameter_id=parameter.id,
            parameter_name=parameter.display_name or parameter.name,
            base_value=base_param_value,
            sensitivity_coefficient=sensitivity_coefficient,
            impact_range=(min_target_value, max_target_value),
            correlation=correlation,
        )

    async def _generate_parameter_samples(
        self, configs: List[SensitivityConfig], iterations: int
    ) -> List[np.ndarray]:
        """
        Generate parameter samples for Monte Carlo simulation.
        """
        samples = []

        for config in configs:
            if config.distribution == "uniform":
                sample = np.random.uniform(
                    config.min_value, config.max_value, iterations
                )
            elif config.distribution == "normal":
                mean = config.mean or (config.min_value + config.max_value) / 2
                std_dev = (
                    config.std_dev or (config.max_value - config.min_value) / 6
                )
                sample = np.random.normal(mean, std_dev, iterations)
                # Clip to bounds
                sample = np.clip(sample, config.min_value, config.max_value)
            elif config.distribution == "triangular":
                mode = config.mean or (config.min_value + config.max_value) / 2
                sample = np.random.triangular(
                    config.min_value, mode, config.max_value, iterations
                )
            else:
                # Default to uniform
                sample = np.random.uniform(
                    config.min_value, config.max_value, iterations
                )

            samples.append(sample)

        return samples

    async def _apply_scenario_values(self, scenario_id: int):
        """
        Apply scenario parameter values to the formula engine.
        """
        scenario_values = (
            self.db.query(ParameterValue)
            .filter(ParameterValue.scenario_id == scenario_id)
            .all()
        )

        for param_value in scenario_values:
            parameter = param_value.parameter
            if parameter and parameter.source_cell:
                cell_ref = f"{parameter.source_sheet}!{parameter.source_cell}"
                self.formula_engine.update_cell_value(
                    cell_ref, param_value.value
                )

    async def _get_parameter_value(
        self, parameter: Parameter, scenario_id: int
    ) -> float:
        """
        Get parameter value for a specific scenario.
        """
        param_value = (
            self.db.query(ParameterValue)
            .filter(
                ParameterValue.parameter_id == parameter.id,
                ParameterValue.scenario_id == scenario_id,
            )
            .first()
        )

        if param_value:
            return param_value.value
        else:
            return parameter.current_value or parameter.default_value or 0

    def _calculate_correlation(
        self, x_values: List[float], y_values: List[float]
    ) -> float:
        """
        Calculate correlation coefficient between two sets of values.
        """
        if len(x_values) != len(y_values) or len(x_values) < 2:
            return 0.0

        try:
            correlation = np.corrcoef(x_values, y_values)[0, 1]
            return float(correlation) if not np.isnan(correlation) else 0.0
        except:
            return 0.0

    async def _generate_tornado_chart_data(
        self, sensitivity_results: List[SensitivityResult]
    ) -> Dict[str, Any]:
        """
        Generate chart data for tornado chart visualization.
        """
        return {
            "type": "tornado",
            "data": [
                {
                    "parameter": result.parameter_name,
                    "low_impact": result.impact_range[0],
                    "high_impact": result.impact_range[1],
                    "sensitivity": result.sensitivity_coefficient,
                    "rank": i + 1,
                }
                for i, result in enumerate(sensitivity_results)
            ],
            "layout": {
                "title": "Parameter Sensitivity (Tornado Chart)",
                "xaxis": {"title": "Impact on Target"},
                "yaxis": {"title": "Parameters"},
            },
        }

    async def _generate_monte_carlo_chart_data(
        self,
        outcomes: np.ndarray,
        parameter_samples: List[np.ndarray],
        configs: List[SensitivityConfig],
    ) -> Dict[str, Any]:
        """
        Generate chart data for Monte Carlo visualization.
        """
        # Histogram data
        hist, bin_edges = np.histogram(outcomes, bins=50)

        return {
            "type": "monte_carlo",
            "histogram": {
                "values": hist.tolist(),
                "bin_edges": bin_edges.tolist(),
                "title": "Distribution of Target Parameter",
            },
            "scatter_plots": [
                {
                    "parameter_id": config.parameter_id,
                    "x_values": parameter_samples[i][: len(outcomes)].tolist(),
                    "y_values": outcomes.tolist(),
                    "title": f"Parameter vs Target",
                }
                for i, config in enumerate(configs)
            ],
            "summary_stats": {
                "mean": float(np.mean(outcomes)),
                "std": float(np.std(outcomes)),
                "min": float(np.min(outcomes)),
                "max": float(np.max(outcomes)),
            },
        }

    async def _generate_spider_chart_data(
        self,
        spider_results: Dict[int, Dict],
        variation_percentages: List[float],
    ) -> Dict[str, Any]:
        """
        Generate chart data for spider chart visualization.
        """
        return {
            "type": "spider",
            "data": [
                {
                    "parameter": data["parameter_name"],
                    "variations": [
                        {
                            "variation_pct": var_pct,
                            "target_change_pct": data["variation_results"].get(
                                var_pct, 0
                            ),
                        }
                        for var_pct in variation_percentages
                    ],
                }
                for param_id, data in spider_results.items()
            ],
            "layout": {
                "title": "Parameter Variation Effects (Spider Chart)",
                "xaxis": {"title": "Parameter Variation (%)"},
                "yaxis": {"title": "Target Change (%)"},
            },
        }
