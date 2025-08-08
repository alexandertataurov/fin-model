import { apiClient } from './api';

export type StatementType =
  | 'profit_loss'
  | 'balance_sheet'
  | 'cash_flow'
  | 'dcf_valuation';

export interface ParameterCategoriesResponse {
  success: boolean;
  data: Record<
    string,
    {
      name: string;
      description: string;
      display_order: number;
      parameters: Array<{
        name: string;
        key: string;
        parameter_type: string;
        default_value: number;
        min_value?: number;
        max_value?: number;
        description?: string;
        sensitivity_level: string;
        unit?: string;
        dependencies: string[];
      }>;
    }
  >;
  total_categories: number;
}

export interface ParameterTemplatesResponse {
  success: boolean;
  data: Record<string, Record<string, number>>; // templateKey -> parameters dict
  template_count: number;
}

export interface CalculateComprehensiveResponse<T = any> {
  success: boolean;
  data: {
    profit_loss: T;
    balance_sheet: T;
    cash_flow: T;
    dcf_valuation: T;
    parameters: Record<string, any>;
    calculation_timestamp: string;
    model_version: string;
  };
}

export const leanFinancialApi = {
  async getParameterCategories(): Promise<ParameterCategoriesResponse> {
    const res = await apiClient.get('/lean-financial/parameters/categories');
    return res.data;
  },

  async getParameterCategory(category: string) {
    const res = await apiClient.get(
      `/lean-financial/parameters/category/${encodeURIComponent(category)}`
    );
    return res.data;
  },

  async getParameterTemplates(): Promise<ParameterTemplatesResponse> {
    const res = await apiClient.get('/lean-financial/parameters/templates');
    return res.data;
  },

  async calculateComprehensive(
    parameters: Record<string, number>,
    baseRevenue?: number
  ): Promise<CalculateComprehensiveResponse> {
    const res = await apiClient.post(
      '/lean-financial/calculate/comprehensive',
      {
        parameters,
        base_revenue: baseRevenue,
      }
    );
    return res.data;
  },

  async calculateStatement(
    statement: StatementType,
    parameters: Record<string, number>,
    baseRevenue?: number
  ) {
    const res = await apiClient.post(
      `/lean-financial/calculate/statement/${statement}`,
      {
        parameters,
        base_revenue: baseRevenue,
      }
    );
    return res.data;
  },

  async createScenario(
    scenarioName: string,
    parameters: Record<string, number>,
    baseRevenue?: number
  ) {
    const res = await apiClient.post('/lean-financial/scenarios/create', {
      scenario_name: scenarioName,
      parameters,
      base_revenue: baseRevenue,
    });
    return res.data;
  },

  async compareScenarios(
    scenarios: Array<{
      scenario_name: string;
      parameters: Record<string, number>;
      base_revenue?: number;
    }>
  ) {
    const res = await apiClient.post(
      '/lean-financial/scenarios/compare',
      scenarios
    );
    return res.data;
  },

  async validateParameters(parameters: Record<string, number>) {
    const res = await apiClient.post(
      '/lean-financial/parameters/validate',
      parameters
    );
    return res.data;
  },

  async health() {
    const res = await apiClient.get('/lean-financial/health');
    return res.data;
  },
};

export default leanFinancialApi;
