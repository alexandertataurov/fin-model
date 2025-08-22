import { apiClient } from './api';

export interface Parameter {
  id: number;
  name: string;
  value: number | string | boolean;
  data_type: 'number' | 'string' | 'boolean' | 'date';
  category: string;
  description?: string;
  unit?: string;
  min_value?: number;
  max_value?: number;
  default_value: number | string | boolean;
  is_required: boolean;
  is_calculated: boolean;
  formula?: string;
  dependencies: string[];
  model_id?: number;
  group_id?: number;
  created_at: string;
  updated_at: string;
}

export interface ParameterGroup {
  id: number;
  name: string;
  description?: string;
  parameters: Parameter[];
  model_id: number;
  created_at: string;
  updated_at: string;
}

export interface ParameterTemplate {
  id: number;
  name: string;
  description?: string;
  parameters: Partial<Parameter>[];
  category: string;
  created_at: string;
}

export interface ParameterHistory {
  id: number;
  parameter_id: number;
  old_value: any;
  new_value: any;
  changed_by: number;
  changed_at: string;
  reason?: string;
}

export interface ParameterValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ParameterDependency {
  parameter_id: number;
  depends_on: Parameter[];
  affects: Parameter[];
}

export interface ParameterImpact {
  parameter_id: number;
  affected_parameters: Array<{
    id: number;
    name: string;
    old_value: any;
    new_value: any;
    impact_percentage: number;
  }>;
  total_impact: number;
}

export interface ParameterDetection {
  detected_parameters: Array<{
    name: string;
    value: any;
    data_type: string;
    confidence: number;
    location: string;
  }>;
  suggestions: string[];
}

export interface CalculationStatus {
  status: 'idle' | 'calculating' | 'completed' | 'error';
  progress: number;
  message?: string;
  started_at?: string;
  completed_at?: string;
}

export interface BatchUpdateRequest {
  parameters: Array<{
    id: number;
    value: any;
  }>;
  trigger_recalculation?: boolean;
}

export interface ParameterCreateRequest {
  name: string;
  value: any;
  data_type: 'number' | 'string' | 'boolean' | 'date';
  category: string;
  description?: string;
  unit?: string;
  min_value?: number;
  max_value?: number;
  is_required?: boolean;
  formula?: string;
  model_id?: number;
  group_id?: number;
}

export interface ParameterUpdateRequest
  extends Partial<ParameterCreateRequest> {
  id: number;
}

export interface ParameterFilters {
  category?: string;
  data_type?: string;
  is_required?: boolean;
  is_calculated?: boolean;
  model_id?: number;
  group_id?: number;
  search?: string;
  skip?: number;
  limit?: number;
}

export const parameterApi = {
  /**
   * Create a new parameter
   */
  async createParameter(data: ParameterCreateRequest): Promise<Parameter> {
    const response = await apiClient.post('/parameters/', data);
    return response.data;
  },

  /**
   * Get parameters with filtering options
   */
  async getParameters(filters?: ParameterFilters): Promise<Parameter[]> {
    const response = await apiClient.get('/parameters/', { params: filters });
    return response.data;
  },

  /**
   * Get a specific parameter by ID
   */
  async getParameter(id: number): Promise<Parameter> {
    const response = await apiClient.get(`/parameters/${id}`);
    return response.data;
  },

  /**
   * Update a parameter
   */
  async updateParameter(
    id: number,
    data: Partial<ParameterUpdateRequest>
  ): Promise<Parameter> {
    const response = await apiClient.put(`/parameters/${id}`, data);
    return response.data;
  },

  /**
   * Delete a parameter
   */
  async deleteParameter(id: number): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/parameters/${id}`);
    return response.data;
  },

  /**
   * Batch update multiple parameters
   */
  async batchUpdateParameters(
    data: BatchUpdateRequest
  ): Promise<{ updated_count: number; errors: any[] }> {
    const response = await apiClient.post('/parameters/batch-update', data);
    return response.data;
  },

  /**
   * Get parameter history
   */
  async getParameterHistory(id: number): Promise<ParameterHistory[]> {
    const response = await apiClient.get(`/parameters/${id}/history`);
    return response.data;
  },

  /**
   * Validate parameter value
   */
  async validateParameter(
    id: number,
    value: any
  ): Promise<ParameterValidation> {
    const response = await apiClient.post(`/parameters/${id}/validate`, {
      value,
    });
    return response.data;
  },

  /**
   * Get parameter dependencies
   */
  async getParameterDependencies(id: number): Promise<ParameterDependency> {
    const response = await apiClient.get(`/parameters/${id}/dependencies`);
    return response.data;
  },

  /**
   * Detect parameters from uploaded file
   */
  async detectParametersFromFile(fileId: number): Promise<ParameterDetection> {
    const response = await apiClient.post(
      `/parameters/detect-from-file/${fileId}`
    );
    return response.data;
  },

  /**
   * Get parameter categories
   */
  async getParameterCategories(): Promise<string[]> {
    const response = await apiClient.get('/parameters/categories/');
    return response.data;
  },

  /**
   * Update parameter value with recalculation
   */
  async updateParameterWithRecalculation(
    id: number,
    value: any
  ): Promise<{ success: boolean; calculation_triggered: boolean }> {
    const response = await apiClient.put(`/parameters/${id}/value`, { value });
    return response.data;
  },

  /**
   * Batch update parameters for a specific model with recalculation
   */
  async batchUpdateModelParameters(
    modelId: number,
    data: BatchUpdateRequest
  ): Promise<{ updated_count: number; calculation_triggered: boolean }> {
    const response = await apiClient.post(
      `/parameters/models/${modelId}/parameters/batch`,
      data
    );
    return response.data;
  },

  /**
   * Trigger recalculation for model parameters
   */
  async triggerModelRecalculation(
    modelId: number
  ): Promise<{ success: boolean; calculation_id: string }> {
    const response = await apiClient.post(
      `/parameters/models/${modelId}/recalculate`
    );
    return response.data;
  },

  /**
   * Get calculation status for model
   */
  async getModelCalculationStatus(modelId: number): Promise<CalculationStatus> {
    const response = await apiClient.get(
      `/parameters/models/${modelId}/calculation-status`
    );
    return response.data;
  },

  /**
   * Calculate parameter impact
   */
  async calculateParameterImpact(
    id: number,
    newValue: any
  ): Promise<ParameterImpact> {
    const response = await apiClient.post(`/parameters/${id}/impact`, {
      new_value: newValue,
    });
    return response.data;
  },

  /**
   * Reset parameters to default values for a model
   */
  async resetModelParameters(
    modelId: number
  ): Promise<{ reset_count: number }> {
    const response = await apiClient.post(
      `/parameters/models/${modelId}/reset-parameters`
    );
    return response.data;
  },

  // Parameter Groups API
  /**
   * Get parameter groups for a model
   */
  async getParameterGroups(modelId: number): Promise<ParameterGroup[]> {
    const response = await apiClient.get(
      `/parameters/models/${modelId}/parameter-groups`
    );
    return response.data;
  },

  /**
   * Create parameter group
   */
  async createParameterGroup(
    modelId: number,
    data: { name: string; description?: string; parameter_ids?: number[] }
  ): Promise<ParameterGroup> {
    const response = await apiClient.post(
      `/parameters/models/${modelId}/parameter-groups`,
      data
    );
    return response.data;
  },

  /**
   * Update parameter group
   */
  async updateParameterGroup(
    groupId: number,
    data: { name?: string; description?: string; parameter_ids?: number[] }
  ): Promise<ParameterGroup> {
    const response = await apiClient.put(
      `/parameters/parameter-groups/${groupId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete parameter group
   */
  async deleteParameterGroup(groupId: number): Promise<{ success: boolean }> {
    const response = await apiClient.delete(
      `/parameters/parameter-groups/${groupId}`
    );
    return response.data;
  },

  // Parameter Templates API
  /**
   * Get parameter templates
   */
  async getParameterTemplates(): Promise<ParameterTemplate[]> {
    const response = await apiClient.get('/parameters/parameter-templates');
    return response.data;
  },

  /**
   * Apply parameter template to model
   */
  async applyParameterTemplate(
    modelId: number,
    templateId: number
  ): Promise<{ applied_count: number; created_parameters: Parameter[] }> {
    const response = await apiClient.post(
      `/parameters/models/${modelId}/apply-template`,
      { template_id: templateId }
    );
    return response.data;
  },

  /**
   * Create parameter template from existing parameters
   */
  async createParameterTemplate(data: {
    name: string;
    description?: string;
    category: string;
    parameter_ids: number[];
  }): Promise<ParameterTemplate> {
    const response = await apiClient.post(
      '/parameters/parameter-templates',
      data
    );
    return response.data;
  },
};

/**
 * Parameter utility functions
 */
export const parameterUtils = {
  /**
   * Format parameter value for display
   */
  formatParameterValue(parameter: Parameter): string {
    const { value, data_type, unit } = parameter;

    switch (data_type) {
      case 'number': {
        const numValue =
          typeof value === 'number' ? value : parseFloat(value as string);
        const formatted = isNaN(numValue) ? '0' : numValue.toLocaleString();
        return unit ? `${formatted} ${unit}` : formatted;
      }

      case 'boolean':
        return value ? 'Yes' : 'No';

      case 'date':
        return new Date(value as string).toLocaleDateString();

      default:
        return String(value);
    }
  },

  /**
   * Validate parameter value based on constraints
   */
  validateParameterValue(
    parameter: Parameter,
    value: any
  ): ParameterValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if required parameter has value
    if (
      parameter.is_required &&
      (value === null || value === undefined || value === '')
    ) {
      errors.push('This parameter is required');
    }

    // Type validation
    switch (parameter.data_type) {
      case 'number': {
        const numValue =
          typeof value === 'number' ? value : parseFloat(value as string);
        if (isNaN(numValue)) {
          errors.push('Value must be a valid number');
        } else {
          if (
            parameter.min_value !== undefined &&
            numValue < parameter.min_value
          ) {
            errors.push(`Value must be at least ${parameter.min_value}`);
          }
          if (
            parameter.max_value !== undefined &&
            numValue > parameter.max_value
          ) {
            errors.push(`Value must not exceed ${parameter.max_value}`);
          }
        }
        break;
      }

      case 'boolean':
        if (
          typeof value !== 'boolean' &&
          value !== 'true' &&
          value !== 'false'
        ) {
          errors.push('Value must be true or false');
        }
        break;

      case 'date':
        if (value && isNaN(Date.parse(value as string))) {
          errors.push('Value must be a valid date');
        }
        break;
    }

    return {
      is_valid: errors.length === 0,
      errors,
      warnings,
    };
  },

  /**
   * Get parameter category color
   */
  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      Financial: '#10B981',
      Risk: '#EF4444',
      Market: '#3B82F6',
      Operational: '#F59E0B',
      Regulatory: '#8B5CF6',
      Environmental: '#06B6D4',
      Social: '#EC4899',
      Governance: '#6B7280',
    };
    return colors[category] || '#9CA3AF';
  },

  /**
   * Get data type icon
   */
  getDataTypeIcon(dataType: string): string {
    const icons: Record<string, string> = {
      number: '🔢',
      string: '📝',
      boolean: '✅',
      date: '📅',
    };
    return icons[dataType] || '❓';
  },

  /**
   * Sort parameters by dependency order
   */
  sortParametersByDependencies(parameters: Parameter[]): Parameter[] {
    const sorted: Parameter[] = [];
    const visited = new Set<number>();
    const visiting = new Set<number>();

    const visit = (param: Parameter): void => {
      if (visiting.has(param.id)) {
        // Circular dependency detected, skip
        return;
      }
      if (visited.has(param.id)) {
        return;
      }

      visiting.add(param.id);

      // Process dependencies first
      param.dependencies.forEach(depName => {
        const dep = parameters.find(p => p.name === depName);
        if (dep && !visited.has(dep.id)) {
          visit(dep);
        }
      });

      visiting.delete(param.id);
      visited.add(param.id);
      sorted.push(param);
    };

    parameters.forEach(param => {
      if (!visited.has(param.id)) {
        visit(param);
      }
    });

    return sorted;
  },

  /**
   * Build parameter dependency graph
   */
  buildDependencyGraph(parameters: Parameter[]): Map<number, number[]> {
    const graph = new Map<number, number[]>();

    parameters.forEach(param => {
      const dependencies: number[] = [];
      param.dependencies.forEach(depName => {
        const dep = parameters.find(p => p.name === depName);
        if (dep) {
          dependencies.push(dep.id);
        }
      });
      graph.set(param.id, dependencies);
    });

    return graph;
  },
};

export default parameterApi;
