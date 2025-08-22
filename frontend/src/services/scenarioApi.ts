import { apiClient } from './api';

export interface Scenario {
  id: number;
  name: string;
  description?: string;
  model_id: number;
  base_scenario_id?: number;
  scenario_type: 'base' | 'stress' | 'optimistic' | 'pessimistic' | 'custom';
  status: 'draft' | 'active' | 'calculated' | 'archived';
  parameters: ScenarioParameter[];
  results?: ScenarioResults;
  version: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  calculated_at?: string;
}

export interface ScenarioParameter {
  id: number;
  scenario_id: number;
  parameter_id: number;
  parameter_name: string;
  original_value: any;
  scenario_value: any;
  override_type: 'absolute' | 'percentage' | 'formula';
  notes?: string;
}

export interface ScenarioResults {
  id: number;
  scenario_id: number;
  financial_metrics: Record<string, number>;
  risk_metrics: Record<string, number>;
  key_outputs: Record<string, any>;
  calculation_time: number;
  calculated_at: string;
}

export interface ScenarioTemplate {
  id: number;
  name: string;
  description?: string;
  category: string;
  parameter_overrides: Array<{
    parameter_name: string;
    override_type: 'absolute' | 'percentage' | 'formula';
    value: any;
  }>;
  created_at: string;
}

export interface ScenarioVersion {
  id: number;
  scenario_id: number;
  version_number: number;
  changes: Record<string, any>;
  created_by: number;
  created_at: string;
  notes?: string;
}

export interface ScenarioComparison {
  scenarios: Scenario[];
  comparison_metrics: Array<{
    metric_name: string;
    values: Record<number, number>; // scenario_id -> value
    variance: number;
    best_scenario_id: number;
    worst_scenario_id: number;
  }>;
  insights: string[];
}

export interface SensitivityAnalysis {
  scenario_id: number;
  parameter_sensitivities: Array<{
    parameter_id: number;
    parameter_name: string;
    elasticity: number;
    impact_range: {
      min_impact: number;
      max_impact: number;
    };
    sensitivity_score: number;
  }>;
  most_sensitive_parameters: number[];
  least_sensitive_parameters: number[];
}

export interface MonteCarloSetup {
  scenario_id: number;
  parameters: Array<{
    parameter_id: number;
    distribution_type:
      | 'normal'
      | 'uniform'
      | 'triangular'
      | 'lognormal'
      | 'beta';
    distribution_params: Record<string, number>;
    correlation_matrix?: number[][];
  }>;
  simulation_config: {
    iterations: number;
    confidence_levels: number[];
    random_seed?: number;
    convergence_threshold?: number;
  };
}

export interface MonteCarloSimulation {
  id: number;
  scenario_id: number;
  setup: MonteCarloSetup;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  iterations_completed: number;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
}

export interface MonteCarloResults {
  simulation_id: number;
  summary_statistics: Record<
    string,
    {
      mean: number;
      median: number;
      std_dev: number;
      min: number;
      max: number;
      percentiles: Record<string, number>;
    }
  >;
  scenario_outcomes: Array<{
    iteration: number;
    parameters: Record<string, number>;
    outputs: Record<string, number>;
  }>;
  convergence_analysis: {
    converged: boolean;
    final_error: number;
    convergence_iteration: number;
  };
}

export interface MonteCarloStatistics {
  simulation_id: number;
  parameter_statistics: Record<
    string,
    {
      distribution_fit: string;
      goodness_of_fit: number;
      outliers_count: number;
    }
  >;
  correlation_analysis: Record<string, Record<string, number>>;
  tail_analysis: {
    var_95: number;
    var_99: number;
    cvar_95: number;
    cvar_99: number;
  };
}

export interface RiskMetrics {
  simulation_id: number;
  risk_measures: {
    probability_of_loss: number;
    expected_shortfall: number;
    maximum_drawdown: number;
    sharpe_ratio: number;
    sortino_ratio: number;
  };
  scenario_probabilities: Array<{
    scenario_name: string;
    probability: number;
    expected_value: number;
  }>;
  stress_test_results: Record<string, number>;
}

export interface SimpleAnalysisRequest {
  parameters: Record<string, any>;
  scenario_type?: string;
  analysis_type?: 'quick' | 'detailed';
}

export interface ScenarioCreateRequest {
  name: string;
  description?: string;
  model_id: number;
  base_scenario_id?: number;
  scenario_type: 'base' | 'stress' | 'optimistic' | 'pessimistic' | 'custom';
  parameter_overrides?: Array<{
    parameter_id: number;
    value: any;
    override_type: 'absolute' | 'percentage' | 'formula';
    notes?: string;
  }>;
}

export interface ScenarioUpdateRequest extends Partial<ScenarioCreateRequest> {
  id: number;
}

export const scenarioApi = {
  /**
   * Simple scenario analysis (quick calculation)
   */
  async analyzeScenario(
    data: SimpleAnalysisRequest
  ): Promise<{ results: Record<string, any>; insights: string[] }> {
    const response = await apiClient.post('/scenarios/analyze', data);
    return response.data;
  },

  /**
   * Create a new scenario
   */
  async createScenario(data: ScenarioCreateRequest): Promise<Scenario> {
    const response = await apiClient.post('/scenarios/', data);
    return response.data;
  },

  /**
   * Get scenarios with filtering
   */
  async getScenarios(filters?: {
    model_id?: number;
    scenario_type?: string;
    status?: string;
    created_by?: number;
    skip?: number;
    limit?: number;
  }): Promise<Scenario[]> {
    const response = await apiClient.get('/scenarios/', { params: filters });
    return response.data;
  },

  /**
   * Get a specific scenario
   */
  async getScenario(id: number): Promise<Scenario> {
    const response = await apiClient.get(`/scenarios/${id}`);
    return response.data;
  },

  /**
   * Update scenario
   */
  async updateScenario(
    id: number,
    data: Partial<ScenarioUpdateRequest>
  ): Promise<Scenario> {
    const response = await apiClient.put(`/scenarios/${id}`, data);
    return response.data;
  },

  /**
   * Delete scenario
   */
  async deleteScenario(id: number): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/scenarios/${id}`);
    return response.data;
  },

  /**
   * Clone scenario
   */
  async cloneScenario(id: number, newName?: string): Promise<Scenario> {
    const response = await apiClient.post(`/scenarios/${id}/clone`, {
      name: newName,
    });
    return response.data;
  },

  /**
   * Get scenario parameters
   */
  async getScenarioParameters(id: number): Promise<ScenarioParameter[]> {
    const response = await apiClient.get(`/scenarios/${id}/parameters`);
    return response.data;
  },

  /**
   * Update scenario parameter
   */
  async updateScenarioParameter(
    scenarioId: number,
    paramId: number,
    data: {
      value: any;
      override_type?: 'absolute' | 'percentage' | 'formula';
      notes?: string;
    }
  ): Promise<ScenarioParameter> {
    const response = await apiClient.put(
      `/scenarios/${scenarioId}/parameters/${paramId}`,
      data
    );
    return response.data;
  },

  /**
   * Calculate scenario
   */
  async calculateScenario(
    id: number
  ): Promise<{ calculation_id: string; status: string }> {
    const response = await apiClient.post(`/scenarios/${id}/calculate`);
    return response.data;
  },

  /**
   * Compare multiple scenarios
   */
  async compareScenarios(scenarioIds: number[]): Promise<ScenarioComparison> {
    const response = await apiClient.post('/scenarios/compare', {
      scenario_ids: scenarioIds,
    });
    return response.data;
  },

  /**
   * Get scenario versions
   */
  async getScenarioVersions(id: number): Promise<ScenarioVersion[]> {
    const response = await apiClient.get(`/scenarios/${id}/versions`);
    return response.data;
  },

  /**
   * Get sensitivity analysis
   */
  async getSensitivityAnalysis(id: number): Promise<SensitivityAnalysis> {
    const response = await apiClient.get(
      `/scenarios/${id}/sensitivity-analysis`
    );
    return response.data;
  },

  // Scenario Templates
  /**
   * Get scenario templates
   */
  async getScenarioTemplates(): Promise<ScenarioTemplate[]> {
    const response = await apiClient.get('/scenarios/templates/');
    return response.data;
  },

  /**
   * Save scenario as template
   */
  async saveAsTemplate(
    id: number,
    data: { name: string; description?: string; category: string }
  ): Promise<ScenarioTemplate> {
    const response = await apiClient.post(
      `/scenarios/${id}/save-as-template`,
      data
    );
    return response.data;
  },

  // Monte Carlo Simulation
  /**
   * Setup Monte Carlo simulation
   */
  async setupMonteCarloSimulation(
    id: number,
    setup: MonteCarloSetup
  ): Promise<MonteCarloSimulation> {
    const response = await apiClient.post(
      `/scenarios/${id}/monte-carlo/setup`,
      setup
    );
    return response.data;
  },

  /**
   * Run Monte Carlo simulation
   */
  async runMonteCarloSimulation(
    id: number
  ): Promise<{ simulation_id: number; status: string }> {
    const response = await apiClient.post(`/scenarios/${id}/monte-carlo/run`);
    return response.data;
  },

  /**
   * Get Monte Carlo results
   */
  async getMonteCarloResults(simulationId: number): Promise<MonteCarloResults> {
    const response = await apiClient.get(
      `/scenarios/monte-carlo/${simulationId}/results`
    );
    return response.data;
  },

  /**
   * Get Monte Carlo statistics
   */
  async getMonteCarloStatistics(
    simulationId: number
  ): Promise<MonteCarloStatistics> {
    const response = await apiClient.get(
      `/scenarios/monte-carlo/${simulationId}/statistics`
    );
    return response.data;
  },

  /**
   * Calculate risk metrics
   */
  async calculateRiskMetrics(simulationId: number): Promise<RiskMetrics> {
    const response = await apiClient.post(
      `/scenarios/monte-carlo/${simulationId}/risk-metrics`
    );
    return response.data;
  },
};

/**
 * Scenario utility functions
 */
export const scenarioUtils = {
  /**
   * Get scenario type color
   */
  getScenarioTypeColor(type: string): string {
    const colors: Record<string, string> = {
      base: '#6B7280',
      stress: '#EF4444',
      optimistic: '#10B981',
      pessimistic: '#F59E0B',
      custom: '#8B5CF6',
    };
    return colors[type] || '#9CA3AF';
  },

  /**
   * Get scenario status badge
   */
  getStatusBadge(status: string): { color: string; icon: string } {
    const badges: Record<string, { color: string; icon: string }> = {
      draft: { color: '#6B7280', icon: '📝' },
      active: { color: '#3B82F6', icon: '🔄' },
      calculated: { color: '#10B981', icon: '✅' },
      archived: { color: '#9CA3AF', icon: '📦' },
    };
    return badges[status] || { color: '#9CA3AF', icon: '❓' };
  },

  /**
   * Format percentage change
   */
  formatPercentageChange(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  },

  /**
   * Calculate scenario variance
   */
  calculateVariance(scenarios: Scenario[], metricName: string): number {
    const values = scenarios
      .map(s => s.results?.financial_metrics[metricName])
      .filter(v => v !== undefined) as number[];

    if (values.length < 2) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;

    return Math.sqrt(variance);
  },

  /**
   * Get distribution parameters for Monte Carlo
   */
  getDistributionParams(
    distributionType: string
  ): Record<string, { label: string; type: 'number'; default?: number }> {
    const params: Record<
      string,
      Record<string, { label: string; type: 'number'; default?: number }>
    > = {
      normal: {
        mean: { label: 'Mean', type: 'number', default: 0 },
        std: { label: 'Standard Deviation', type: 'number', default: 1 },
      },
      uniform: {
        min: { label: 'Minimum', type: 'number', default: 0 },
        max: { label: 'Maximum', type: 'number', default: 1 },
      },
      triangular: {
        min: { label: 'Minimum', type: 'number', default: 0 },
        mode: { label: 'Mode', type: 'number', default: 0.5 },
        max: { label: 'Maximum', type: 'number', default: 1 },
      },
      lognormal: {
        mu: { label: 'Mu (log scale)', type: 'number', default: 0 },
        sigma: { label: 'Sigma (log scale)', type: 'number', default: 1 },
      },
      beta: {
        alpha: { label: 'Alpha', type: 'number', default: 1 },
        beta: { label: 'Beta', type: 'number', default: 1 },
      },
    };

    return params[distributionType] || {};
  },

  /**
   * Calculate confidence intervals
   */
  calculateConfidenceInterval(
    data: number[],
    confidence: number
  ): { lower: number; upper: number } {
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    const alpha = 1 - confidence;

    const lowerIndex = Math.floor((alpha / 2) * n);
    const upperIndex = Math.ceil((1 - alpha / 2) * n) - 1;

    return {
      lower: sorted[lowerIndex],
      upper: sorted[upperIndex],
    };
  },

  /**
   * Format risk metric
   */
  formatRiskMetric(value: number, metricType: string): string {
    switch (metricType) {
      case 'probability':
        return `${(value * 100).toFixed(2)}%`;
      case 'currency':
        return value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'ratio':
        return value.toFixed(3);
      default:
        return value.toFixed(2);
    }
  },

  /**
   * Generate scenario insights
   */
  generateScenarioInsights(
    scenario: Scenario,
    comparison?: ScenarioComparison
  ): string[] {
    const insights: string[] = [];

    if (!scenario.results) {
      return ['Scenario has not been calculated yet.'];
    }

    const results = scenario.results;

    // Financial performance insights
    const revenue = results.financial_metrics['revenue'];
    const profit = results.financial_metrics['net_profit'];

    if (revenue && profit) {
      const margin = (profit / revenue) * 100;
      insights.push(`Profit margin: ${margin.toFixed(2)}%`);

      if (margin > 20) {
        insights.push('Strong profitability performance');
      } else if (margin < 5) {
        insights.push('Low profitability - consider cost optimization');
      }
    }

    // Risk insights
    const riskScore = results.risk_metrics['risk_score'];
    if (riskScore) {
      if (riskScore > 0.8) {
        insights.push(
          'High risk scenario - implement risk mitigation strategies'
        );
      } else if (riskScore < 0.3) {
        insights.push('Low risk scenario - stable performance expected');
      }
    }

    // Comparison insights
    if (comparison && comparison.scenarios.length > 1) {
      const currentScenarioMetrics = comparison.comparison_metrics.find(
        m => m.values[scenario.id] !== undefined
      );

      if (currentScenarioMetrics) {
        const currentValue = currentScenarioMetrics.values[scenario.id];
        const allValues = Object.values(currentScenarioMetrics.values);
        const maxValue = Math.max(...allValues);
        const minValue = Math.min(...allValues);

        if (currentValue === maxValue) {
          insights.push(
            `Best performing scenario for ${currentScenarioMetrics.metric_name}`
          );
        } else if (currentValue === minValue) {
          insights.push(
            `Lowest performing scenario for ${currentScenarioMetrics.metric_name}`
          );
        }
      }
    }

    return insights;
  },
};

export default scenarioApi;
