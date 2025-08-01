# Task 05: Scenario Modeling & Analysis
**Phase**: 2 - Core Features  
**Complexity**: ⭐⭐⭐ HIGH  
**Estimated Time**: 2 weeks (80 hours)  
**Dependencies**: Task 04 (Parameter Management)

---

## Overview

Implement comprehensive scenario modeling capabilities including multi-scenario management, sensitivity analysis, Monte Carlo simulation, and scenario comparison tools. This enables users to perform sophisticated financial analysis and risk assessment.

**Current State**: No scenario modeling capabilities  
**Target State**: Advanced scenario analysis with Monte Carlo simulation and sensitivity tools

---

## Acceptance Criteria

### Multi-Scenario Management
- [ ] Support unlimited scenarios per model (Base, Optimistic, Pessimistic, Custom)
- [ ] Parameter changes reflect across all scenarios instantly
- [ ] Scenario cloning and template creation
- [ ] Scenario comparison with side-by-side views
- [ ] Scenario naming, descriptions, and tagging
- [ ] Import/export scenario configurations

### Sensitivity Analysis
- [ ] One-way data tables with visual heat maps
- [ ] Two-way data tables for parameter interactions
- [ ] Tornado charts for parameter impact ranking
- [ ] Break-even analysis for key metrics
- [ ] Real-time sensitivity updates when parameters change
- [ ] Custom sensitivity ranges and step sizes

### Monte Carlo Simulation
- [ ] 10,000+ iterations completed in <5 seconds
- [ ] Multiple probability distributions (Normal, Uniform, Triangular)
- [ ] Statistical output analysis (mean, median, percentiles)
- [ ] Risk metrics (VaR, CVaR, probability of success)
- [ ] Correlation between input variables
- [ ] Interactive results visualization

---

## Technical Specifications

### Backend Services

#### Scenario Management Service
```python
class ScenarioService:
    def create_scenario(model_id: str, name: str, base_scenario_id: str = None) -> Scenario
    def clone_scenario(scenario_id: str, new_name: str) -> Scenario
    def compare_scenarios(scenario_ids: List[str]) -> ScenarioComparison
    def get_scenario_parameters(scenario_id: str) -> List[ScenarioParameter]
    def update_scenario_parameter(scenario_id: str, param_id: str, value: float) -> bool
    def delete_scenario(scenario_id: str) -> bool

class SensitivityAnalysisService:
    def run_one_way_sensitivity(scenario_id: str, param_id: str, 
                               value_range: Range, output_cells: List[str]) -> SensitivityResult
    def run_two_way_sensitivity(scenario_id: str, param1_id: str, param2_id: str,
                               ranges: Tuple[Range, Range], output_cell: str) -> SensitivityMatrix
    def generate_tornado_chart(scenario_id: str, param_ids: List[str], 
                             output_cell: str, variation_pct: float) -> TornadoData
    def calculate_breakeven(scenario_id: str, target_cell: str, 
                          variable_param: str, target_value: float) -> float

class MonteCarloService:
    def setup_simulation(scenario_id: str, distributions: Dict[str, Distribution],
                        iterations: int, output_metrics: List[str]) -> SimulationConfig
    def run_monte_carlo(config: SimulationConfig) -> SimulationResult
    def get_simulation_statistics(result: SimulationResult) -> StatisticalSummary
    def calculate_risk_metrics(result: SimulationResult, 
                             confidence_levels: List[float]) -> RiskMetrics
```

#### Data Models
```python
class Scenario(Base):
    __tablename__ = "scenarios"
    
    id = Column(String, primary_key=True)
    model_id = Column(String, ForeignKey("financial_models.id"))
    name = Column(String, nullable=False)
    description = Column(Text)
    scenario_type = Column(String)  # base, optimistic, pessimistic, custom
    is_base_case = Column(Boolean, default=False)
    created_from = Column(String, ForeignKey("scenarios.id"))  # For cloning
    created_by = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class ScenarioParameter(Base):
    __tablename__ = "scenario_parameters"
    
    id = Column(String, primary_key=True)
    scenario_id = Column(String, ForeignKey("scenarios.id"))
    parameter_id = Column(String, ForeignKey("parameters.id"))
    parameter_value = Column(Numeric(precision=15, scale=6))
    override_default = Column(Boolean, default=False)

class SensitivityAnalysis(Base):
    __tablename__ = "sensitivity_analyses"
    
    id = Column(String, primary_key=True)
    scenario_id = Column(String, ForeignKey("scenarios.id"))
    analysis_type = Column(String)  # one_way, two_way, tornado
    input_parameters = Column(JSON)  # Parameter configurations
    output_cells = Column(JSON)      # Target cells to analyze
    results = Column(JSON)           # Analysis results
    created_at = Column(DateTime, default=func.now())

class MonteCarloSimulation(Base):
    __tablename__ = "monte_carlo_simulations"
    
    id = Column(String, primary_key=True)
    scenario_id = Column(String, ForeignKey("scenarios.id"))
    iterations = Column(Integer, nullable=False)
    distributions = Column(JSON)     # Parameter distributions
    results = Column(JSON)           # Simulation results
    statistics = Column(JSON)        # Statistical summary
    risk_metrics = Column(JSON)      # Risk calculations
    execution_time = Column(Float)   # Performance tracking
    created_at = Column(DateTime, default=func.now())
```

### API Endpoints

#### Scenario Management
```python
# Scenario CRUD
GET    /api/v1/models/{model_id}/scenarios        # List scenarios
POST   /api/v1/models/{model_id}/scenarios        # Create scenario
GET    /api/v1/scenarios/{scenario_id}            # Get scenario details
PUT    /api/v1/scenarios/{scenario_id}            # Update scenario
DELETE /api/v1/scenarios/{scenario_id}            # Delete scenario
POST   /api/v1/scenarios/{scenario_id}/clone      # Clone scenario

# Scenario comparison
POST   /api/v1/scenarios/compare                  # Compare multiple scenarios
GET    /api/v1/scenarios/{scenario_id}/parameters # Get scenario parameters
PUT    /api/v1/scenarios/{scenario_id}/parameters # Update scenario parameters

# Sensitivity analysis
POST   /api/v1/scenarios/{scenario_id}/sensitivity/one-way    # One-way analysis
POST   /api/v1/scenarios/{scenario_id}/sensitivity/two-way    # Two-way analysis
POST   /api/v1/scenarios/{scenario_id}/sensitivity/tornado    # Tornado chart
POST   /api/v1/scenarios/{scenario_id}/breakeven              # Break-even analysis

# Monte Carlo simulation
POST   /api/v1/scenarios/{scenario_id}/monte-carlo/setup      # Setup simulation
POST   /api/v1/scenarios/{scenario_id}/monte-carlo/run        # Run simulation
GET    /api/v1/monte-carlo/{simulation_id}/results            # Get results
GET    /api/v1/monte-carlo/{simulation_id}/statistics         # Get statistics
```

### Frontend Components

#### Scenario Management Components
```typescript
// Core scenario components
- ScenarioManager.tsx         // Main scenario management interface
- ScenarioSelector.tsx        // Scenario selection dropdown
- ScenarioComparison.tsx      // Side-by-side scenario comparison
- ScenarioCreator.tsx         // New scenario creation modal
- ScenarioSettings.tsx        // Scenario configuration

// Analysis components  
- SensitivityAnalyzer.tsx     // Sensitivity analysis interface
- SensitivityTable.tsx        // Data table visualization
- TornadoChart.tsx           // Tornado chart component
- MonteCarloRunner.tsx       // Monte Carlo simulation interface
- SimulationResults.tsx      // Results visualization and statistics

// Visualization components
- HeatMap.tsx                # Sensitivity heat map
- DistributionChart.tsx      # Probability distribution charts
- StatisticsPanel.tsx        # Statistical summary display
- RiskMetricsCard.tsx        # Risk metrics visualization
```

---

## Implementation Steps

### Week 1: Scenario Management & Sensitivity Analysis

#### Days 1-2: Core Scenario System
- [ ] Implement scenario database models and migrations
- [ ] Build scenario CRUD operations and API endpoints
- [ ] Create scenario parameter management system
- [ ] Add scenario cloning and comparison logic
- [ ] Implement scenario-based recalculation

#### Days 3-4: Sensitivity Analysis Engine
- [ ] Develop one-way and two-way sensitivity analysis
- [ ] Implement tornado chart data generation
- [ ] Add break-even analysis calculations
- [ ] Create sensitivity result visualization data
- [ ] Build performance optimization for large analyses

#### Day 5: Monte Carlo Foundation
- [ ] Design Monte Carlo simulation architecture
- [ ] Implement probability distribution classes
- [ ] Create simulation configuration system
- [ ] Add basic simulation execution engine
- [ ] Test simulation performance and accuracy

### Week 2: Advanced Analytics & User Interface

#### Days 1-2: Monte Carlo Implementation
- [ ] Complete Monte Carlo simulation engine
- [ ] Add statistical analysis and risk metrics
- [ ] Implement correlation handling
- [ ] Create simulation result storage and retrieval
- [ ] Optimize for 10,000+ iteration performance

#### Days 3-4: Frontend Interface Development
- [ ] Build scenario management interface
- [ ] Create sensitivity analysis components
- [ ] Implement Monte Carlo simulation UI
- [ ] Add scenario comparison visualizations
- [ ] Create results dashboard and reporting

#### Day 5: Integration & Testing
- [ ] Integrate all scenario components with main application
- [ ] Add real-time updates and progress tracking
- [ ] Implement error handling and validation
- [ ] Performance testing and optimization
- [ ] User acceptance testing

---

## Algorithm Specifications

### Monte Carlo Simulation Engine
```python
class MonteCarloEngine:
    """
    High-performance Monte Carlo simulation
    """
    
    def run_simulation(self, config: SimulationConfig) -> SimulationResult:
        """
        Execute Monte Carlo simulation with given configuration
        """
        # Pre-generate all random samples for performance
        samples = self.generate_sample_matrix(config)
        
        # Initialize result storage
        results = {metric: [] for metric in config.output_metrics}
        
        # Run simulation iterations
        for i in range(config.iterations):
            # Set parameter values for this iteration
            param_values = {}
            for param_id, distribution in config.distributions.items():
                param_values[param_id] = samples[param_id][i]
            
            # Recalculate model with sampled parameters
            calc_result = self.calculate_scenario(config.scenario_id, param_values)
            
            # Store output metric values
            for metric in config.output_metrics:
                results[metric].append(calc_result.get_cell_value(metric))
        
        return SimulationResult(
            iterations=config.iterations,
            results=results,
            execution_time=time.time() - start_time
        )
    
    def generate_sample_matrix(self, config: SimulationConfig) -> Dict[str, np.ndarray]:
        """
        Pre-generate all random samples for efficiency
        """
        samples = {}
        
        for param_id, distribution in config.distributions.items():
            if distribution.type == "normal":
                samples[param_id] = np.random.normal(
                    distribution.mean, 
                    distribution.std, 
                    config.iterations
                )
            elif distribution.type == "uniform":
                samples[param_id] = np.random.uniform(
                    distribution.min, 
                    distribution.max, 
                    config.iterations
                )
            elif distribution.type == "triangular":
                samples[param_id] = np.random.triangular(
                    distribution.min, 
                    distribution.mode, 
                    distribution.max, 
                    config.iterations
                )
        
        # Apply correlations if specified
        if config.correlations:
            samples = self.apply_correlations(samples, config.correlations)
        
        return samples
```

### Sensitivity Analysis Algorithm
```python
class SensitivityAnalyzer:
    """
    Comprehensive sensitivity analysis tools
    """
    
    def one_way_sensitivity(self, scenario_id: str, param_id: str, 
                           value_range: Range, output_cells: List[str]) -> SensitivityResult:
        """
        Perform one-way sensitivity analysis
        """
        base_scenario = self.get_scenario(scenario_id)
        base_param_value = base_scenario.get_parameter_value(param_id)
        
        # Generate parameter values to test
        test_values = np.linspace(value_range.min, value_range.max, value_range.steps)
        
        results = {}
        for output_cell in output_cells:
            results[output_cell] = []
        
        # Calculate outputs for each parameter value
        for test_value in test_values:
            # Update parameter and recalculate
            updated_params = {param_id: test_value}
            calc_result = self.calculate_scenario(scenario_id, updated_params)
            
            # Store results for each output cell
            for output_cell in output_cells:
                output_value = calc_result.get_cell_value(output_cell)
                results[output_cell].append(output_value)
        
        # Calculate sensitivity metrics
        sensitivity_metrics = self.calculate_sensitivity_metrics(
            test_values, results, base_param_value
        )
        
        return SensitivityResult(
            parameter_values=test_values,
            output_results=results,
            sensitivity_metrics=sensitivity_metrics
        )
    
    def tornado_analysis(self, scenario_id: str, param_ids: List[str], 
                        output_cell: str, variation_pct: float) -> TornadoData:
        """
        Generate tornado chart data showing parameter impact ranking
        """
        base_scenario = self.get_scenario(scenario_id)
        base_output = self.calculate_scenario(scenario_id, {}).get_cell_value(output_cell)
        
        tornado_data = []
        
        for param_id in param_ids:
            base_param_value = base_scenario.get_parameter_value(param_id)
            
            # Calculate high and low variations
            high_value = base_param_value * (1 + variation_pct)
            low_value = base_param_value * (1 - variation_pct)
            
            # Calculate outputs for variations
            high_output = self.calculate_scenario(
                scenario_id, {param_id: high_value}
            ).get_cell_value(output_cell)
            
            low_output = self.calculate_scenario(
                scenario_id, {param_id: low_value}
            ).get_cell_value(output_cell)
            
            # Calculate impact
            impact = abs(high_output - low_output)
            
            tornado_data.append({
                'parameter': param_id,
                'low_output': low_output,
                'high_output': high_output,
                'impact': impact,
                'impact_pct': impact / base_output if base_output != 0 else 0
            })
        
        # Sort by impact (descending)
        tornado_data.sort(key=lambda x: x['impact'], reverse=True)
        
        return TornadoData(
            base_output=base_output,
            parameters=tornado_data
        )
```

---

## Performance Requirements

### Simulation Performance
- Monte Carlo with 10,000 iterations: <5 seconds
- Sensitivity analysis: <3 seconds for 100 data points
- Scenario switching: <500ms
- Real-time parameter updates: <1 second

### Memory Efficiency
- Support simulations with 1M+ data points
- Efficient memory usage for large sensitivity tables
- Garbage collection for completed simulations

### Scalability
- Support 50+ scenarios per model
- Handle 1,000+ parameters in sensitivity analysis
- Concurrent simulations for multiple users

---

## Testing Requirements

### Backend Testing
```python
# Scenario management tests
test_scenario_creation_and_cloning()
test_scenario_parameter_updates()
test_scenario_comparison_accuracy()

# Sensitivity analysis tests  
test_one_way_sensitivity_calculations()
test_two_way_sensitivity_matrix()
test_tornado_chart_ranking()
test_breakeven_analysis_convergence()

# Monte Carlo tests
test_monte_carlo_statistical_accuracy()
test_distribution_sampling_correctness()
test_correlation_implementation()
test_risk_metrics_calculations()
test_simulation_performance()
```

### Frontend Testing
```typescript
// Component tests
describe('ScenarioManager', () => {
  it('creates and manages multiple scenarios')
  it('handles scenario parameter updates')
  it('compares scenarios side-by-side')
})

describe('MonteCarloRunner', () => {
  it('configures simulation parameters')
  it('displays simulation progress')
  it('visualizes results correctly')
})

// Integration tests
describe('Scenario Analysis Integration', () => {
  it('performs end-to-end sensitivity analysis')
  it('runs complete Monte Carlo simulation')
  it('handles large datasets efficiently')
})
```

---

## User Experience Features

### Intuitive Workflow
- Guided scenario creation wizard
- Template scenarios for common use cases
- Drag-and-drop parameter configuration
- One-click analysis execution

### Rich Visualizations
- Interactive sensitivity heat maps
- Animated Monte Carlo convergence
- Real-time tornado chart updates
- Statistical distribution overlays

### Performance Feedback
- Progress bars for long-running analyses
- Real-time iteration counters
- Performance optimization suggestions

---

## Deliverables

### Code Deliverables
- [ ] Scenario management service and APIs
- [ ] Sensitivity analysis engine
- [ ] Monte Carlo simulation system
- [ ] Frontend scenario analysis components
- [ ] Comprehensive test suites

### Documentation
- [ ] Scenario modeling methodology guide
- [ ] Sensitivity analysis interpretation guide
- [ ] Monte Carlo simulation best practices
- [ ] API documentation for scenario endpoints
- [ ] Performance tuning guide

### Templates & Examples
- [ ] Standard scenario templates
- [ ] Sensitivity analysis templates
- [ ] Monte Carlo configuration examples
- [ ] Industry-specific scenarios

---

**Success Criteria**: Users can create multiple scenarios, perform sophisticated sensitivity analysis, and run Monte Carlo simulations with professional-grade accuracy and performance.

**Definition of Done**: All acceptance criteria met, performance benchmarks achieved, statistical accuracy validated, deployed to staging environment.