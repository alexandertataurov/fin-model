import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { ParameterPanel } from './ParameterPanel';

const meta: Meta<typeof ParameterPanel> = {
  title: 'Components/ParameterPanel',
  component: ParameterPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Parameter panel component for displaying and managing financial model parameters with grouping, validation, and editing capabilities.',
      },
    },
  },
  argTypes: {
    parameters: {
      control: { type: 'object' },
      description: 'Array of financial model parameters',
    },
    selectedParameter: {
      control: { type: 'text' },
      description: 'Currently selected parameter ID',
    },
    onParameterSelect: {
      action: 'parameter selected',
      description: 'Callback when parameter is selected',
    },
    onParameterChange: {
      action: 'parameter changed',
      description: 'Callback when parameter value changes',
    },
    onParameterDelete: {
      action: 'parameter deleted',
      description: 'Callback when parameter is deleted',
    },
    onParameterAdd: {
      action: 'parameter added',
      description: 'Callback when new parameter is added',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    showAdvanced: {
      control: { type: 'boolean' },
      description: 'Show advanced parameter options',
    },
    groupBy: {
      control: { type: 'select', options: ['category', 'type', 'none'] },
      description: 'Grouping method for parameters',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockParameters = [
  {
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
  },
  {
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
  },
  {
    id: 'operatingMargin',
    name: 'Operating Margin',
    value: 0.25,
    unit: '%',
    category: 'costs',
    type: 'percentage',
    description: 'Operating margin as percentage of revenue',
    min: 0,
    max: 1,
    step: 0.01,
    required: true,
    validation: {
      isValid: true,
      message: '',
    },
  },
  {
    id: 'discountRate',
    name: 'Discount Rate',
    value: 0.12,
    unit: '%',
    category: 'valuation',
    type: 'percentage',
    description: 'Discount rate for DCF calculations',
    min: 0.05,
    max: 0.30,
    step: 0.01,
    required: true,
    validation: {
      isValid: true,
      message: '',
    },
  },
];

export const Default: Story = {
  args: {
    parameters: mockParameters,
    selectedParameter: 'revenue',
    isLoading: false,
    showAdvanced: false,
    groupBy: 'category',
  },
};

export const Loading: Story = {
  args: {
    parameters: [],
    selectedParameter: null,
    isLoading: true,
    showAdvanced: false,
    groupBy: 'category',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter panel component in loading state while fetching parameters.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    parameters: [],
    selectedParameter: null,
    isLoading: false,
    showAdvanced: false,
    groupBy: 'category',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter panel component with no parameters available.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    parameters: [],
    selectedParameter: null,
    isLoading: false,
    showAdvanced: false,
    groupBy: 'category',
    error: 'Failed to load parameters. Please check your connection and try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter panel component showing error state when loading fails.',
      },
    },
  },
};

export const AdvancedMode: Story = {
  args: {
    parameters: mockParameters,
    selectedParameter: 'discountRate',
    isLoading: false,
    showAdvanced: true,
    groupBy: 'type',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter panel component with advanced options and configuration visible.',
      },
    },
  },
};

export const GroupedByType: Story = {
  args: {
    parameters: mockParameters,
    selectedParameter: 'growthRate',
    isLoading: false,
    showAdvanced: false,
    groupBy: 'type',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter panel component with parameters grouped by type (number, percentage, etc.).',
      },
    },
  },
};

export const WithValidationErrors: Story = {
  args: {
    parameters: [
      ...mockParameters,
      {
        id: 'invalidParam',
        name: 'Invalid Parameter',
        value: -1000,
        unit: 'USD',
        category: 'costs',
        type: 'number',
        description: 'Parameter with validation error',
        min: 0,
        max: 10000,
        step: 100,
        required: true,
        validation: {
          isValid: false,
          message: 'Value must be greater than 0',
        },
      },
    ],
    selectedParameter: 'invalidParam',
    isLoading: false,
    showAdvanced: false,
    groupBy: 'category',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter panel component showing validation errors for parameters.',
      },
    },
  },
};
