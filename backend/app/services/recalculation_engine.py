"""
Real-time Recalculation Engine
Handles efficient recalculation of financial models when parameters change.
"""

import time
from typing import Dict, List, Set, Any, Optional, Tuple
from dataclasses import dataclass
from collections import defaultdict, deque
import networkx as nx

from app.services.formula_engine import FormulaEngine


@dataclass
class RecalculationResult:
    success: bool
    affected_cells: int
    calculation_time: float
    updated_values: Dict[str, float]
    error: Optional[str] = None
    warnings: List[str] = None


@dataclass
class DependencyGraph:
    nodes: Set[str]
    edges: List[Tuple[str, str]]
    calculation_order: List[str]


class IncrementalCalculator:
    """Efficient recalculation using dependency graphs."""
    
    def __init__(self):
        self.formula_engine = FormulaEngine()
        self._dependency_cache = {}
        self._calculation_cache = {}
    
    def recalculate_from_parameters(self, model_id: str, file_path: str, 
                                  changed_params: Dict[str, float]) -> RecalculationResult:
        """Recalculate only affected parts of the model."""
        start_time = time.time()
        
        try:
            # Get or build dependency graph
            graph = self._get_dependency_graph(model_id, file_path)
            
            # Find all cells affected by parameter changes
            affected_cells = self._find_affected_cells(graph, changed_params.keys())
            
            # Sort by dependency order (topological sort)
            calc_order = self._get_calculation_order(graph, affected_cells)
            
            # Recalculate in dependency order
            updated_values = {}
            for cell_ref in calc_order:
                try:
                    new_value = self._calculate_cell_value(file_path, cell_ref, updated_values)
                    updated_values[cell_ref] = new_value
                except Exception as e:
                    return RecalculationResult(
                        success=False,
                        affected_cells=0,
                        calculation_time=time.time() - start_time,
                        updated_values={},
                        error=f"Error calculating {cell_ref}: {str(e)}"
                    )
            
            calculation_time = time.time() - start_time
            
            return RecalculationResult(
                success=True,
                affected_cells=len(affected_cells),
                calculation_time=calculation_time,
                updated_values=updated_values
            )
            
        except Exception as e:
            return RecalculationResult(
                success=False,
                affected_cells=0,
                calculation_time=time.time() - start_time,
                updated_values={},
                error=str(e)
            )
    
    def calculate_impact_analysis(self, model_id: str, file_path: str, 
                                param_id: str, value_range: Tuple[float, float], 
                                steps: int = 10) -> Dict[str, Any]:
        """Calculate impact analysis for parameter across value range."""
        min_val, max_val = value_range
        step_size = (max_val - min_val) / steps
        
        results = []
        base_result = None
        
        for i in range(steps + 1):
            value = min_val + (i * step_size)
            changed_params = {param_id: value}
            
            calc_result = self.recalculate_from_parameters(model_id, file_path, changed_params)
            
            if calc_result.success:
                if i == 0:  # Base case
                    base_result = calc_result.updated_values.copy()
                
                # Calculate changes from base
                changes = {}
                if base_result:
                    for cell, new_val in calc_result.updated_values.items():
                        base_val = base_result.get(cell, 0)
                        if base_val != 0:
                            changes[cell] = ((new_val - base_val) / base_val) * 100
                        else:
                            changes[cell] = new_val
                
                results.append({
                    'parameter_value': value,
                    'cell_values': calc_result.updated_values,
                    'percentage_changes': changes
                })
        
        return {
            'parameter_id': param_id,
            'value_range': value_range,
            'results': results,
            'summary': self._calculate_sensitivity_summary(results)
        }
    
    def get_calculation_dependencies(self, file_path: str, cell_refs: List[str]) -> DependencyGraph:
        """Get dependency graph for specific cells."""
        try:
            # Use formula engine to parse dependencies
            dependencies = self.formula_engine.analyze_dependencies(file_path, cell_refs)
            
            nodes = set()
            edges = []
            
            for cell, deps in dependencies.items():
                nodes.add(cell)
                for dep in deps:
                    nodes.add(dep)
                    edges.append((dep, cell))  # dep -> cell
            
            # Calculate topological order
            graph = nx.DiGraph()
            graph.add_nodes_from(nodes)
            graph.add_edges_from(edges)
            
            try:
                calculation_order = list(nx.topological_sort(graph))
            except nx.NetworkXError:
                # Handle circular dependencies
                calculation_order = list(nodes)
            
            return DependencyGraph(
                nodes=nodes,
                edges=edges,
                calculation_order=calculation_order
            )
            
        except Exception as e:
            # Fallback to simple ordering
            return DependencyGraph(
                nodes=set(cell_refs),
                edges=[],
                calculation_order=cell_refs
            )
    
    def validate_circular_references(self, file_path: str) -> Dict[str, Any]:
        """Detect circular references in the model."""
        try:
            # Get all formulas and dependencies
            all_formulas = self.formula_engine.get_all_formulas(file_path)
            
            graph = nx.DiGraph()
            for cell, formula_info in all_formulas.items():
                dependencies = formula_info.get('dependencies', [])
                for dep in dependencies:
                    graph.add_edge(dep, cell)
            
            # Find cycles
            try:
                cycles = list(nx.simple_cycles(graph))
                return {
                    'has_circular_references': len(cycles) > 0,
                    'circular_chains': cycles,
                    'affected_cells': set().union(*cycles) if cycles else set()
                }
            except nx.NetworkXError:
                return {
                    'has_circular_references': False,
                    'circular_chains': [],
                    'affected_cells': set()
                }
                
        except Exception as e:
            return {
                'has_circular_references': False,
                'circular_chains': [],
                'affected_cells': set(),
                'error': str(e)
            }
    
    def _get_dependency_graph(self, model_id: str, file_path: str) -> DependencyGraph:
        """Get or build dependency graph for model."""
        if model_id in self._dependency_cache:
            return self._dependency_cache[model_id]
        
        # Build new dependency graph
        try:
            all_formulas = self.formula_engine.get_all_formulas(file_path)
            graph = self._build_dependency_graph(all_formulas)
            self._dependency_cache[model_id] = graph
            return graph
        except Exception:
            # Return empty graph if analysis fails
            return DependencyGraph(nodes=set(), edges=[], calculation_order=[])
    
    def _build_dependency_graph(self, formulas: Dict[str, Any]) -> DependencyGraph:
        """Build dependency graph from formula analysis."""
        nodes = set()
        edges = []
        
        for cell, formula_info in formulas.items():
            nodes.add(cell)
            dependencies = formula_info.get('dependencies', [])
            for dep in dependencies:
                nodes.add(dep)
                edges.append((dep, cell))
        
        # Create NetworkX graph for topological sorting
        graph = nx.DiGraph()
        graph.add_nodes_from(nodes)
        graph.add_edges_from(edges)
        
        try:
            calculation_order = list(nx.topological_sort(graph))
        except nx.NetworkXError:
            # Handle circular dependencies by using a simple ordering
            calculation_order = list(nodes)
        
        return DependencyGraph(
            nodes=nodes,
            edges=edges,
            calculation_order=calculation_order
        )
    
    def _find_affected_cells(self, graph: DependencyGraph, changed_cells: List[str]) -> Set[str]:
        """Find all cells affected by changes to specific cells."""
        affected = set(changed_cells)
        
        # Create adjacency list for efficient traversal
        adjacency = defaultdict(list)
        for source, target in graph.edges:
            adjacency[source].append(target)
        
        # BFS to find all downstream dependencies
        queue = deque(changed_cells)
        while queue:
            current = queue.popleft()
            for dependent in adjacency[current]:
                if dependent not in affected:
                    affected.add(dependent)
                    queue.append(dependent)
        
        return affected
    
    def _get_calculation_order(self, graph: DependencyGraph, affected_cells: Set[str]) -> List[str]:
        """Get calculation order for affected cells."""
        # Filter calculation order to only include affected cells
        return [cell for cell in graph.calculation_order if cell in affected_cells]
    
    def _calculate_cell_value(self, file_path: str, cell_ref: str, 
                            updated_values: Dict[str, float]) -> float:
        """Calculate value for a specific cell."""
        # Use formula engine with updated parameter values
        return self.formula_engine.calculate_cell(file_path, cell_ref, updated_values)
    
    def _calculate_sensitivity_summary(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate sensitivity analysis summary statistics."""
        if not results:
            return {}
        
        # Find the most sensitive cells
        max_sensitivity = {}
        min_sensitivity = {}
        
        for result in results:
            for cell, change in result.get('percentage_changes', {}).items():
                if cell not in max_sensitivity:
                    max_sensitivity[cell] = change
                    min_sensitivity[cell] = change
                else:
                    max_sensitivity[cell] = max(max_sensitivity[cell], abs(change))
                    min_sensitivity[cell] = min(min_sensitivity[cell], abs(change))
        
        # Sort by sensitivity
        sensitive_cells = sorted(max_sensitivity.items(), key=lambda x: x[1], reverse=True)
        
        return {
            'most_sensitive_cells': sensitive_cells[:10],  # Top 10
            'total_affected_cells': len(max_sensitivity),
            'max_sensitivity': max(max_sensitivity.values()) if max_sensitivity else 0,
            'min_sensitivity': min(min_sensitivity.values()) if min_sensitivity else 0
        }
    
    def clear_cache(self, model_id: str = None):
        """Clear calculation cache for model or all models."""
        if model_id:
            self._dependency_cache.pop(model_id, None)
            self._calculation_cache.pop(model_id, None)
        else:
            self._dependency_cache.clear()
            self._calculation_cache.clear()


class ParameterValidator:
    """Validate parameter values against constraints."""
    
    def validate_parameter_value(self, parameter: Dict[str, Any], value: float) -> Dict[str, Any]:
        """Comprehensive parameter validation."""
        errors = []
        warnings = []
        
        # Range validation
        min_val = parameter.get('min_value')
        max_val = parameter.get('max_value')
        
        if min_val is not None and value < min_val:
            errors.append(f"Value {value} is below minimum {min_val}")
        
        if max_val is not None and value > max_val:
            errors.append(f"Value {value} is above maximum {max_val}")
        
        # Type-specific validation
        param_type = parameter.get('parameter_type')
        if param_type == 'percentage':
            if not 0 <= value <= 1:
                errors.append("Percentage values must be between 0 and 1")
        elif param_type == 'positive':
            if value <= 0:
                errors.append("Value must be positive")
        elif param_type == 'non_negative':
            if value < 0:
                errors.append("Value must be non-negative")
        
        # Custom validation rules
        validation_rules = parameter.get('validation_rules', [])
        for rule in validation_rules:
            if not self._apply_validation_rule(rule, value):
                errors.append(rule.get('error_message', 'Validation rule failed'))
        
        # Business logic warnings
        if param_type in ['growth_rate', 'interest_rate'] and abs(value) > 1:
            warnings.append("Value seems unusually high for a rate parameter")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
    
    def _apply_validation_rule(self, rule: Dict[str, Any], value: float) -> bool:
        """Apply custom validation rule."""
        rule_type = rule.get('type')
        
        if rule_type == 'range':
            return rule['min'] <= value <= rule['max']
        elif rule_type == 'positive':
            return value > 0
        elif rule_type == 'non_negative':
            return value >= 0
        elif rule_type == 'custom':
            # Evaluate custom expression (simplified)
            expression = rule.get('expression', 'True')
            try:
                # Replace 'value' in expression with actual value
                expression = expression.replace('value', str(value))
                return eval(expression)  # In production, use a safer evaluator
            except:
                return True  # Default to valid if expression fails
        
        return True