import type { Meta, StoryObj } from '@storybook/react';
import { ParameterGroup } from './ParameterGroup';

const meta: Meta<typeof ParameterGroup> = {
  title: 'Components/ParameterGroup',
  component: ParameterGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Parameter group component for organizing and managing related financial model parameters with collapsible sections and bulk operations.',
      },
    },
  },
  argTypes: {
    group: {
      control: { type: 'object' },
      description: 'Parameter group configuration',
    },
    parameters: {
      control: { type: 'object' },
      description: 'Array of parameters in the group',
    },
    isExpanded: {
      control: { type: 'boolean' },
      description: 'Whether the group is expanded',
    },
    onToggle: {
      action: 'group toggled',
      description: 'Callback when group expansion is toggled',
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
      description: 'Callback when new parameter is added to group',
    },
    onBulkEdit: {
      action: 'bulk edit',
      description: 'Callback when bulk edit is triggered',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    showActions: {
      control: { type: 'boolean' },
      description: 'Show group action buttons',
    },
    allowCollapse: {
      control: { type: 'boolean' },
      description: 'Allow group to be collapsed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockGroup = {
  id: 'revenue-parameters',
  name: 'Revenue Parameters',
  description: 'Parameters related to revenue modeling and forecasting',
  category: 'revenue',
  icon: 'trending-up',
  color: 'blue',
  isRequired: true,
  validation: {
    isValid: true,
    message: '',
  },
};

const mockParameters = [
  {
    id: 'annualRevenue',
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
    id: 'revenuePerCustomer',
    name: 'Revenue Per Customer',
    value: 2500,
    unit: 'USD',
    category: 'revenue',
    type: 'number',
    description: 'Average revenue per customer',
    min: 0,
    max: 50000,
    step: 100,
    required: false,
    validation: {
      isValid: true,
      message: '',
    },
  },
];

export const Default: Story = {
  args: {
    group: mockGroup,
    parameters: mockParameters,
    isExpanded: true,
    isLoading: false,
    showActions: true,
    allowCollapse: true,
  },
};

export const Loading: Story = {
  args: {
    group: mockGroup,
    parameters: [],
    isExpanded: true,
    isLoading: true,
    showActions: true,
    allowCollapse: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter group component in loading state while fetching parameters.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    group: mockGroup,
    parameters: [],
    isExpanded: true,
    isLoading: false,
    showActions: true,
    allowCollapse: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter group component with no parameters in the group.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    group: mockGroup,
    parameters: [],
    isExpanded: true,
    isLoading: false,
    showActions: true,
    allowCollapse: true,
    error: 'Failed to load parameters. Please check your connection and try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter group component showing error state when loading fails.',
      },
    },
  },
};

export const Collapsed: Story = {
  args: {
    group: mockGroup,
    parameters: mockParameters,
    isExpanded: false,
    isLoading: false,
    showActions: true,
    allowCollapse: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter group component in collapsed state showing only the group header.',
      },
    },
  },
};

export const CostParameters: Story = {
  args: {
    group: {
      ...mockGroup,
      id: 'cost-parameters',
      name: 'Cost Parameters',
      description: 'Parameters related to cost structure and margins',
      category: 'costs',
      icon: 'dollar-sign',
      color: 'red',
    },
    parameters: [
      {
        id: 'operatingCosts',
        name: 'Operating Costs',
        value: 800000,
        unit: 'USD',
        category: 'costs',
        type: 'number',
        description: 'Total operating costs',
        min: 0,
        max: 5000000,
        step: 10000,
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
        id: 'fixedCosts',
        name: 'Fixed Costs',
        value: 300000,
        unit: 'USD',
        category: 'costs',
        type: 'number',
        description: 'Fixed operating costs',
        min: 0,
        max: 2000000,
        step: 10000,
        required: false,
        validation: {
          isValid: true,
          message: '',
        },
      },
    ],
    isExpanded: true,
    isLoading: false,
    showActions: true,
    allowCollapse: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter group component for cost-related parameters with different styling.',
      },
    },
  },
};

export const WithoutActions: Story = {
  args: {
    group: mockGroup,
    parameters: mockParameters,
    isExpanded: true,
    isLoading: false,
    showActions: false,
    allowCollapse: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter group component without action buttons for read-only mode.',
      },
    },
  },
};

export const NonCollapsible: Story = {
  args: {
    group: mockGroup,
    parameters: mockParameters,
    isExpanded: true,
    isLoading: false,
    showActions: true,
    allowCollapse: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter group component that cannot be collapsed, always showing all parameters.',
      },
    },
  },
};

export const WithValidationErrors: Story = {
  args: {
    group: {
      ...mockGroup,
      validation: {
        isValid: false,
        message: 'Some parameters have validation errors',
      },
    },
    parameters: [
      ...mockParameters,
      {
        id: 'invalidParam',
        name: 'Invalid Parameter',
        value: -1000,
        unit: 'USD',
        category: 'revenue',
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
    isExpanded: true,
    isLoading: false,
    showActions: true,
    allowCollapse: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter group component showing validation errors for parameters.',
      },
    },
  },
};
