import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
import uuid
import json
from scipy import stats
from sqlalchemy.orm import Session
import asyncio
import time

from app.models.parameter import (
    Parameter,
    ParameterValue,
    Scenario,
    MonteCarloSimulation,
    ScenarioParameter,
)
from app.models.user import User
from app.services.formula_engine import FormulaEngine


@dataclass
class Distribution:
    """Probability distribution definition."""
    
    type: str  # normal, uniform, triangular, lognormal
    parameters: Dict[str, float]  # Distribution-specific parameters


@dataclass
class SimulationConfig:
    """Monte Carlo simulation configuration."""
    
    scenario_id: int
    distributions: Dict[int, Distribution]  # parameter_id -> Distribution
    correlations: Optional[Dict[Tuple[int, int], float]] = None
    output_metrics: List[str] = None  # Cell references to track
    iterations: int = 10000
    random_seed: Optional[int] = None


@dataclass
class SimulationResult:
    """Monte Carlo simulation result."""
    
    simulation_id: str
    iterations: int
    results: Dict[str, List[float]]  # metric -> values
    statistics: Dict[str, Dict[str, float]]  # metric -> stats
    risk_metrics: Dict[str, float]
    execution_time: float
    parameter_correlations: Dict[int, float]


@dataclass
class RiskMetrics:
    """Risk analysis metrics."""
    
    var_95: float  # Value at Risk (95%)
    var_99: float  # Value at Risk (99%)
    cvar_95: float  # Conditional VaR (95%)
    cvar_99: float  # Conditional VaR (99%)
    probability_of_loss: float
    expected_shortfall: float


class MonteCarloService:
    """High-performance Monte Carlo simulation service."""
    
    def __init__(self, db: Session):
        self.db = db
        self.formula_engine = FormulaEngine()
    
    async def setup_simulation(
        self,
        scenario_id: int,
        distributions: Dict[int, Dict[str, Any]],
        output_metrics: List[str],
        iterations: int = 10000,
        correlations: Optional[Dict[str, float]] = None,
        user_id: int = None,
        name: str = None,
        random_seed: Optional[int] = None,
    ) -> str:
        """
        Set up a Monte Carlo simulation configuration.
        
        Args:
            scenario_id: Base scenario ID
            distributions: Parameter distributions {param_id: {type, params}}
            output_metrics: List of cell references to track
            iterations: Number of simulation iterations
            correlations: Parameter correlations {"param1_id,param2_id": correlation}
            user_id: User ID for authentication
            name: Simulation name
            random_seed: Random seed for reproducibility
            
        Returns:
            Simulation ID
        """
        # Validate scenario exists
        scenario = (
            self.db.query(Scenario)
            .filter(Scenario.id == scenario_id)
            .first()
        )
        
        if not scenario:
            raise ValueError(f"Scenario {scenario_id} not found")
        
        # Validate parameters exist
        param_ids = list(distributions.keys())
        existing_params = (
            self.db.query(Parameter.id)
            .filter(Parameter.id.in_(param_ids))
            .all()
        )
        existing_param_ids = {p.id for p in existing_params}
        
        missing_params = set(param_ids) - existing_param_ids
        if missing_params:
            raise ValueError(f"Parameters not found: {missing_params}")
        
        # Create simulation record
        simulation_id = str(uuid.uuid4())
        simulation_name = name or f"Monte Carlo - {scenario.name}"
        
        # Convert correlations format
        correlation_dict = {}
        if correlations:
            for key, value in correlations.items():
                if "," in str(key):
                    param1_id, param2_id = key.split(",")
                    correlation_dict[f"{param1_id},{param2_id}"] = float(value)
                else:
                    correlation_dict[str(key)] = float(value)
        
        simulation = MonteCarloSimulation(
            id=simulation_id,
            scenario_id=scenario_id,
            name=simulation_name,
            iterations=iterations,
            distributions=distributions,
            correlations=correlation_dict,
            output_metrics=output_metrics,
            status="configured",
            created_by_id=user_id,
        )
        
        self.db.add(simulation)
        self.db.commit()
        
        return simulation_id
    
    async def run_monte_carlo(
        self,
        simulation_id: str,
        user_id: Optional[int] = None
    ) -> SimulationResult:
        """
        Execute Monte Carlo simulation with given configuration.
        
        Args:
            simulation_id: Simulation configuration ID
            user_id: User ID for authentication
            
        Returns:
            Simulation results
        """
        # Get simulation configuration
        simulation = (
            self.db.query(MonteCarloSimulation)
            .filter(MonteCarloSimulation.id == simulation_id)
            .first()
        )
        
        if not simulation:
            raise ValueError(f"Simulation {simulation_id} not found")
        
        if user_id and simulation.created_by_id != user_id:
            raise ValueError("Unauthorized access to simulation")
        
        try:
            # Update status
            simulation.status = "running"
            self.db.commit()
            
            start_time = time.time()
            
            # Load scenario data
            scenario = simulation.scenario
            self.formula_engine.load_workbook_data(scenario.base_file.file_path)
            await self._apply_scenario_values(simulation.scenario_id)
            
            # Generate parameter samples
            parameter_samples = await self._generate_sample_matrix(simulation)
            
            # Run simulation iterations
            results = await self._execute_simulation(
                simulation, parameter_samples
            )
            
            # Calculate statistics
            statistics = self._calculate_statistics(results)
            
            # Calculate risk metrics
            risk_metrics = self._calculate_risk_metrics(results, simulation.output_metrics)
            
            # Calculate parameter correlations
            param_correlations = self._calculate_parameter_correlations(
                parameter_samples, results, simulation
            )
            
            execution_time = time.time() - start_time
            
            # Update simulation record
            simulation.results = {k: v[:1000] for k, v in results.items()}  # Store sample
            simulation.statistics = statistics
            simulation.risk_metrics = risk_metrics
            simulation.execution_time = execution_time
            simulation.status = "completed"
            simulation.completed_at = datetime.utcnow()
            
            self.db.commit()
            
            return SimulationResult(
                simulation_id=simulation_id,
                iterations=simulation.iterations,
                results=results,
                statistics=statistics,
                risk_metrics=risk_metrics,
                execution_time=execution_time,
                parameter_correlations=param_correlations,
            )
            
        except Exception as e:
            # Update simulation with error
            simulation.status = "error"
            simulation.error_message = str(e)
            simulation.completed_at = datetime.utcnow()
            self.db.commit()
            
            raise Exception(f"Monte Carlo simulation failed: {str(e)}")
    
    async def get_simulation_results(
        self,
        simulation_id: str,
        user_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """Get simulation results and statistics."""
        simulation = (
            self.db.query(MonteCarloSimulation)
            .filter(MonteCarloSimulation.id == simulation_id)
            .first()
        )
        
        if not simulation:
            raise ValueError(f"Simulation {simulation_id} not found")
        
        if user_id and simulation.created_by_id != user_id:
            raise ValueError("Unauthorized access to simulation")
        
        return {
            "simulation_id": simulation_id,
            "name": simulation.name,
            "scenario_id": simulation.scenario_id,
            "status": simulation.status,
            "iterations": simulation.iterations,
            "execution_time": simulation.execution_time,
            "results": simulation.results,
            "statistics": simulation.statistics,
            "risk_metrics": simulation.risk_metrics,
            "distributions": simulation.distributions,
            "correlations": simulation.correlations,
            "output_metrics": simulation.output_metrics,
            "created_at": simulation.created_at,
            "completed_at": simulation.completed_at,
            "error_message": simulation.error_message,
        }
    
    async def get_simulation_statistics(
        self,
        simulation_id: str,
        user_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """Get detailed statistical analysis of simulation results."""
        simulation = (
            self.db.query(MonteCarloSimulation)
            .filter(MonteCarloSimulation.id == simulation_id)
            .first()
        )
        
        if not simulation:
            raise ValueError(f"Simulation {simulation_id} not found")
        
        if not simulation.statistics:
            raise ValueError("Simulation has not been completed")
        
        # Enhanced statistics calculation
        enhanced_stats = {}
        
        for metric, stats in simulation.statistics.items():
            enhanced_stats[metric] = {
                **stats,
                "confidence_intervals": {
                    "90%": self._calculate_confidence_interval(stats, 0.90),
                    "95%": self._calculate_confidence_interval(stats, 0.95),
                    "99%": self._calculate_confidence_interval(stats, 0.99),
                },
                "distribution_moments": {
                    "skewness": stats.get("skewness", 0),
                    "kurtosis": stats.get("kurtosis", 0),
                },
            }
        
        return {
            "simulation_id": simulation_id,
            "statistics": enhanced_stats,
            "risk_metrics": simulation.risk_metrics,
            "summary": {
                "iterations": simulation.iterations,
                "execution_time": simulation.execution_time,
                "parameters_analyzed": len(simulation.distributions),
                "output_metrics": len(simulation.output_metrics),
            },
        }
    
    async def calculate_risk_metrics(
        self,
        simulation_id: str,
        confidence_levels: List[float] = [0.90, 0.95, 0.99],
        user_id: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Calculate comprehensive risk metrics."""
        simulation = (
            self.db.query(MonteCarloSimulation)
            .filter(MonteCarloSimulation.id == simulation_id)
            .first()
        )
        
        if not simulation:
            raise ValueError(f"Simulation {simulation_id} not found")
        
        if not simulation.results:
            raise ValueError("Simulation has not been completed")
        
        risk_analysis = {}
        
        for metric, values in simulation.results.items():
            if not values:
                continue
                
            values_array = np.array(values)
            
            # Calculate VaR and CVaR for each confidence level
            metric_risk = {}
            
            for confidence in confidence_levels:
                alpha = 1 - confidence
                var_threshold = np.percentile(values_array, alpha * 100)
                
                # Value at Risk
                var = var_threshold
                
                # Conditional Value at Risk (Expected Shortfall)
                tail_values = values_array[values_array <= var_threshold]
                cvar = np.mean(tail_values) if len(tail_values) > 0 else var
                
                metric_risk[f"VaR_{int(confidence*100)}"] = float(var)
                metric_risk[f"CVaR_{int(confidence*100)}"] = float(cvar)
            
            # Additional risk metrics
            mean_value = np.mean(values_array)
            median_value = np.median(values_array)
            
            metric_risk.update({
                "probability_of_loss": float(np.mean(values_array < 0)),
                "probability_below_mean": float(np.mean(values_array < mean_value)),
                "expected_shortfall": float(np.mean(values_array[values_array < median_value])),
                "maximum_loss": float(np.min(values_array)),
                "maximum_gain": float(np.max(values_array)),
                "downside_deviation": float(np.std(values_array[values_array < mean_value])),
            })
            
            risk_analysis[metric] = metric_risk
        
        # Update simulation record
        simulation.risk_metrics = risk_analysis
        self.db.commit()
        
        return {
            "simulation_id": simulation_id,
            "risk_metrics": risk_analysis,
            "confidence_levels": confidence_levels,
            "analysis_timestamp": datetime.utcnow().isoformat(),
        }
    
    # Helper methods
    
    async def _generate_sample_matrix(
        self, simulation: MonteCarloSimulation
    ) -> Dict[int, np.ndarray]:
        """
        Pre-generate all random samples for efficiency.
        """
        if simulation.correlations and len(simulation.correlations) > 0:
            # Use random seed if specified
            if hasattr(simulation, 'random_seed') and simulation.random_seed:
                np.random.seed(simulation.random_seed)
            
            return await self._generate_correlated_samples(simulation)
        else:
            return await self._generate_independent_samples(simulation)
    
    async def _generate_independent_samples(
        self, simulation: MonteCarloSimulation
    ) -> Dict[int, np.ndarray]:
        """Generate independent parameter samples."""
        samples = {}
        
        # Use random seed if specified  
        if hasattr(simulation, 'random_seed') and simulation.random_seed:
            np.random.seed(simulation.random_seed)
        
        for param_id, dist_config in simulation.distributions.items():
            dist_type = dist_config.get("type", "normal")
            
            if dist_type == "normal":
                mean = dist_config.get("mean", 0)
                std = dist_config.get("std_dev", 1)
                samples[param_id] = np.random.normal(
                    mean, std, simulation.iterations
                )
            elif dist_type == "uniform":
                min_val = dist_config.get("min", 0)
                max_val = dist_config.get("max", 1)
                samples[param_id] = np.random.uniform(
                    min_val, max_val, simulation.iterations
                )
            elif dist_type == "triangular":
                min_val = dist_config.get("min", 0)
                max_val = dist_config.get("max", 1)
                mode = dist_config.get("mode", (min_val + max_val) / 2)
                samples[param_id] = np.random.triangular(
                    min_val, mode, max_val, simulation.iterations
                )
            elif dist_type == "lognormal":
                mu = dist_config.get("mu", 0)
                sigma = dist_config.get("sigma", 1)
                samples[param_id] = np.random.lognormal(
                    mu, sigma, simulation.iterations
                )
            else:
                # Default to normal distribution
                samples[param_id] = np.random.normal(
                    0, 1, simulation.iterations
                )
        
        return samples
    
    async def _generate_correlated_samples(
        self, simulation: MonteCarloSimulation
    ) -> Dict[int, np.ndarray]:
        """Generate correlated parameter samples using multivariate normal."""
        param_ids = list(simulation.distributions.keys())
        n_params = len(param_ids)
        
        # Build correlation matrix
        correlation_matrix = np.identity(n_params)
        
        for corr_key, corr_value in simulation.correlations.items():
            if "," in corr_key:
                param1_id, param2_id = map(int, corr_key.split(","))
                
                if param1_id in param_ids and param2_id in param_ids:
                    i = param_ids.index(param1_id)
                    j = param_ids.index(param2_id)
                    correlation_matrix[i, j] = corr_value
                    correlation_matrix[j, i] = corr_value
        
        # Generate correlated standard normal samples
        correlated_samples = np.random.multivariate_normal(
            mean=np.zeros(n_params),
            cov=correlation_matrix,
            size=simulation.iterations
        )
        
        # Transform to target distributions
        samples = {}
        
        for i, param_id in enumerate(param_ids):
            dist_config = simulation.distributions[param_id]
            standard_samples = correlated_samples[:, i]
            
            # Transform using inverse CDF method
            uniform_samples = stats.norm.cdf(standard_samples)
            
            dist_type = dist_config.get("type", "normal")
            
            if dist_type == "normal":
                mean = dist_config.get("mean", 0)
                std = dist_config.get("std_dev", 1)
                samples[param_id] = stats.norm.ppf(uniform_samples, mean, std)
            elif dist_type == "uniform":
                min_val = dist_config.get("min", 0)
                max_val = dist_config.get("max", 1)
                samples[param_id] = stats.uniform.ppf(
                    uniform_samples, min_val, max_val - min_val
                )
            elif dist_type == "triangular":
                min_val = dist_config.get("min", 0)
                max_val = dist_config.get("max", 1)
                mode = dist_config.get("mode", (min_val + max_val) / 2)
                c = (mode - min_val) / (max_val - min_val)
                samples[param_id] = stats.triang.ppf(
                    uniform_samples, c, min_val, max_val - min_val
                )
            else:
                # Default to normal
                samples[param_id] = stats.norm.ppf(uniform_samples, 0, 1)
        
        return samples
    
    async def _execute_simulation(
        self,
        simulation: MonteCarloSimulation,
        parameter_samples: Dict[int, np.ndarray]
    ) -> Dict[str, List[float]]:
        """Execute the Monte Carlo simulation iterations."""
        results = {metric: [] for metric in simulation.output_metrics}
        
        # Get parameter objects for cell reference mapping
        param_objects = {}
        for param_id in parameter_samples.keys():
            param = self.db.query(Parameter).filter(Parameter.id == param_id).first()
            if param:
                param_objects[param_id] = param
        
        # Run simulation iterations
        for i in range(simulation.iterations):
            try:
                # Set parameter values for this iteration
                for param_id, samples in parameter_samples.items():
                    param = param_objects.get(param_id)
                    if param and param.source_cell and param.source_sheet:
                        cell_ref = f"{param.source_sheet}!{param.source_cell}"
                        self.formula_engine.update_cell_value(cell_ref, samples[i])
                
                # Calculate output metric values
                for metric in simulation.output_metrics:
                    try:
                        calc_result = self.formula_engine.calculate_cell(metric)
                        if calc_result.error is None:
                            results[metric].append(calc_result.value)
                        else:
                            results[metric].append(np.nan)
                    except Exception:
                        results[metric].append(np.nan)
                        
            except Exception as e:
                # Log error but continue simulation
                for metric in simulation.output_metrics:
                    results[metric].append(np.nan)
        
        # Remove NaN values and replace with interpolated values if too many
        for metric in results:
            values = np.array(results[metric])
            nan_count = np.isnan(values).sum()
            
            if nan_count > simulation.iterations * 0.1:  # More than 10% NaN
                raise ValueError(f"Too many calculation errors for metric {metric}")
            
            # Replace NaN with median of valid values
            if nan_count > 0:
                median_val = np.nanmedian(values)
                values[np.isnan(values)] = median_val
                results[metric] = values.tolist()
        
        return results
    
    def _calculate_statistics(
        self, results: Dict[str, List[float]]
    ) -> Dict[str, Dict[str, float]]:
        """Calculate comprehensive statistics for simulation results."""
        statistics = {}
        
        for metric, values in results.items():
            if not values:
                continue
                
            values_array = np.array(values)
            
            # Basic statistics
            stats_dict = {
                "count": len(values),
                "mean": float(np.mean(values_array)),
                "median": float(np.median(values_array)),
                "std_dev": float(np.std(values_array)),
                "variance": float(np.var(values_array)),
                "min": float(np.min(values_array)),
                "max": float(np.max(values_array)),
                "range": float(np.max(values_array) - np.min(values_array)),
            }
            
            # Percentiles
            percentiles = [1, 5, 10, 25, 50, 75, 90, 95, 99]
            for p in percentiles:
                stats_dict[f"percentile_{p}"] = float(np.percentile(values_array, p))
            
            # Distribution moments
            stats_dict["skewness"] = float(stats.skew(values_array))
            stats_dict["kurtosis"] = float(stats.kurtosis(values_array))
            
            # Coefficient of variation
            if stats_dict["mean"] != 0:
                stats_dict["cv"] = stats_dict["std_dev"] / abs(stats_dict["mean"])
            else:
                stats_dict["cv"] = 0
            
            statistics[metric] = stats_dict
        
        return statistics
    
    def _calculate_risk_metrics(
        self,
        results: Dict[str, List[float]],
        output_metrics: List[str]
    ) -> Dict[str, float]:
        """Calculate risk metrics across all output metrics."""
        risk_metrics = {}
        
        # Combine all results for portfolio-level risk
        all_values = []
        for values in results.values():
            all_values.extend(values)
        
        if all_values:
            all_values_array = np.array(all_values)
            
            risk_metrics.update({
                "portfolio_var_95": float(np.percentile(all_values_array, 5)),
                "portfolio_var_99": float(np.percentile(all_values_array, 1)),
                "portfolio_expected_shortfall": float(
                    np.mean(all_values_array[all_values_array <= np.percentile(all_values_array, 5)])
                ),
                "probability_of_loss": float(np.mean(all_values_array < 0)),
            })
        
        return risk_metrics
    
    def _calculate_parameter_correlations(
        self,
        parameter_samples: Dict[int, np.ndarray],
        results: Dict[str, List[float]],
        simulation: MonteCarloSimulation
    ) -> Dict[int, float]:
        """Calculate correlations between parameters and output metrics."""
        correlations = {}
        
        # Use the first output metric for correlation analysis
        if simulation.output_metrics and results:
            first_metric = simulation.output_metrics[0]
            output_values = np.array(results[first_metric])
            
            for param_id, param_samples in parameter_samples.items():
                try:
                    # Calculate correlation with first output metric
                    corr_coef = np.corrcoef(param_samples, output_values)[0, 1]
                    correlations[param_id] = float(corr_coef) if not np.isnan(corr_coef) else 0.0
                except Exception:
                    correlations[param_id] = 0.0
        
        return correlations
    
    def _calculate_confidence_interval(
        self, stats: Dict[str, float], confidence: float
    ) -> Tuple[float, float]:
        """Calculate confidence interval for given confidence level."""
        alpha = 1 - confidence
        lower_percentile = (alpha / 2) * 100
        upper_percentile = (1 - alpha / 2) * 100
        
        return (
            stats.get(f"percentile_{int(lower_percentile)}", 0),
            stats.get(f"percentile_{int(upper_percentile)}", 0),
        )
    
    async def _apply_scenario_values(self, scenario_id: int):
        """Apply scenario parameter values to the formula engine."""
        scenario_values = (
            self.db.query(ParameterValue)
            .filter(ParameterValue.scenario_id == scenario_id)
            .all()
        )
        
        for param_value in scenario_values:
            parameter = param_value.parameter
            if parameter and parameter.source_cell:
                cell_ref = f"{parameter.source_sheet}!{parameter.source_cell}"
                self.formula_engine.update_cell_value(cell_ref, param_value.value)