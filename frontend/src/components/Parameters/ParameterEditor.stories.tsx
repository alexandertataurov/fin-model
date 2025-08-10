import type { Meta, StoryObj } from '@storybook/react';
import ParameterEditor from './ParameterEditor';

const meta: Meta<typeof ParameterEditor> = {
  title: 'Components/ParameterEditor',
  component: ParameterEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Advanced parameter editor component for creating, editing, and validating financial model parameters with comprehensive validation and formatting options.',
      },
    },
  },
  argTypes: {
    parameter: {
      control: { type: 'object' },
      description: 'Parameter object to edit',
    },
    onSave: {
      action: 'parameter saved',
      description: 'Callback when parameter is saved',
    },
    onCancel: {
      action: 'editing cancelled',
      description: 'Callback when editing is cancelled',
    },
    onValidate: {
      action: 'parameter validated',
      description: 'Callback when parameter validation is triggered',
    },
    onDelete: {
      action: 'parameter deleted',
      description: 'Callback when parameter is deleted',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    isReadOnly: {
      control: { type: 'boolean' },
      description: 'Read-only mode',
    },
    showAdvanced: {
      control: { type: 'boolean' },
      description: 'Show advanced parameter options',
    },
    validationMode: {
      control: { type: 'select', options: ['live', 'onSave', 'manual'] },
      description: 'Validation mode',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockParameter = {
  id: 'revenue',
  name: 'Annual Revenue',
  value: 1500000,
  unit: 'USD',
  category: 'revenue',
  type: 'number',
  description: 'Total annual revenue for the company',
  min: 0,
  max: 10000000,
  step: 10000,
  required: true,
  validation: {
    isValid: true,
    message: '',
  },
  metadata: {
    source: 'financial_statements',
    lastUpdated: '2024-01-15T10:00:00Z',
    confidence: 0.95,
    notes: 'Based on Q4 2023 projections',
  },
  dependencies: ['growthRate', 'operatingMargin'],
  formula: null,
};

const mockComplexParameter = {
  id: 'discountRate',
  name: 'Discount Rate',
  value: 0.12,
  unit: '%',
  category: 'valuation',
  type: 'percentage',
  description: 'Weighted average cost of capital (WACC) for DCF calculations',
  min: 0.05,
  max: 0.30,
  step: 0.001,
  required: true,
  validation: {
    isValid: true,
    message: '',
  },
  metadata: {
    source: 'market_data',
    lastUpdated: '2024-01-16T14:30:00Z',
    confidence: 0.85,
    notes: 'Based on industry average and company risk profile',
  },
  dependencies: ['riskFreeRate', 'equityRiskPremium', 'beta'],
  formula: 'riskFreeRate + (equityRiskPremium * beta)',
};

export const Default: Story = {
  args: {
    parameter: mockParameter,
    isLoading: false,
    isReadOnly: false,
    showAdvanced: false,
    validationMode: 'live',
  },
};

export const Loading: Story = {
  args: {
    parameter: mockParameter,
    isLoading: true,
    isReadOnly: false,
    showAdvanced: false,
    validationMode: 'live',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter editor component in loading state while saving or validating parameter.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    parameter: null,
    isLoading: false,
    isReadOnly: false,
    showAdvanced: false,
    validationMode: 'live',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter editor component with no parameter to edit (create new mode).',
      },
    },
  },
};

export const Error: Story = {
  args: {
    parameter: mockParameter,
    isLoading: false,
    isReadOnly: false,
    showAdvanced: false,
    validationMode: 'live',
    error: 'Failed to save parameter. Please check your input and try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter editor component showing error state when save operation fails.',
      },
    },
  },
};

export const ReadOnly: Story = {
  args: {
    parameter: mockParameter,
    isLoading: false,
    isReadOnly: true,
    showAdvanced: false,
    validationMode: 'live',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter editor component in read-only mode for viewing parameter details.',
      },
    },
  },
};

export const AdvancedMode: Story = {
  args: {
    parameter: mockComplexParameter,
    isLoading: false,
    isReadOnly: false,
    showAdvanced: true,
    validationMode: 'onSave',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter editor component with advanced options showing formula dependencies and metadata.',
      },
    },
  },
};

export const WithValidationError: Story = {
  args: {
    parameter: {
      ...mockParameter,
      value: -1000,
      validation: {
        isValid: false,
        message: 'Value must be greater than 0',
      },
    },
    isLoading: false,
    isReadOnly: false,
    showAdvanced: false,
    validationMode: 'live',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter editor component showing validation error for invalid parameter value.',
      },
    },
  },
};

export const FormulaParameter: Story = {
  args: {
    parameter: {
      ...mockComplexParameter,
      value: 0.125,
      formula: 'riskFreeRate + (equityRiskPremium * beta)',
      dependencies: ['riskFreeRate', 'equityRiskPremium', 'beta'],
    },
    isLoading: false,
    isReadOnly: false,
    showAdvanced: true,
    validationMode: 'manual',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter editor component for formula-based parameters with dependencies.',
      },
    },
  },
};

export const PercentageParameter: Story = {
  args: {
    parameter: {
      id: 'growthRate',
      name: 'Growth Rate',
      value: 0.15,
      unit: '%',
      category: 'revenue',
      type: 'percentage',
      description: 'Annual revenue growth rate',
      min: -0.5,
      max: 2.0,
      step: 0.01,
      required: true,
      validation: {
        isValid: true,
        message: '',
      },
      metadata: {
        source: 'management_forecast',
        lastUpdated: '2024-01-14T09:15:00Z',
        confidence: 0.80,
        notes: 'Based on market analysis and company projections',
      },
      dependencies: [],
      formula: null,
    },
    isLoading: false,
    isReadOnly: false,
    showAdvanced: true,
    validationMode: 'live',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter editor component for percentage-type parameters with specific formatting.',
      },
    },
  },
};
