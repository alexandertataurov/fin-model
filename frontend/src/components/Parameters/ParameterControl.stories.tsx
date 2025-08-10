import type { Meta, StoryObj } from '@storybook/react';
import { ParameterControl } from './ParameterControl';

const meta: Meta<typeof ParameterControl> = {
  title: 'Components/ParameterControl',
  component: ParameterControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Interactive control component for adjusting financial model parameters with real-time validation and feedback.',
      },
    },
  },
  argTypes: {
    parameter: {
      control: { type: 'object' },
      description: 'Parameter configuration object',
    },
    value: {
      control: { type: 'number' },
      description: 'Current parameter value',
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback when parameter value changes',
    },
    onValidation: {
      action: 'validation triggered',
      description: 'Callback for validation events',
    },
    isReadOnly: {
      control: { type: 'boolean' },
      description: 'Whether the control is read-only',
    },
    showValidation: {
      control: { type: 'boolean' },
      description: 'Show validation feedback',
    },
    error: {
      control: { type: 'text' },
      description: 'Validation error message',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockParameter = {
  id: 'discountRate',
  name: 'Discount Rate',
  type: 'number',
  value: 0.10,
  min: 0.01,
  max: 0.50,
  step: 0.01,
  unit: 'percentage',
  description: 'Discount rate used in DCF calculations',
  category: 'valuation',
  required: true,
  validation: {
    min: 0.01,
    max: 0.50,
    pattern: /^\d+(\.\d{1,2})?$/,
  },
};

export const Default: Story = {
  args: {
    parameter: mockParameter,
    value: 0.10,
    showValidation: true,
    isReadOnly: false,
  },
};

export const Loading: Story = {
  args: {
    parameter: mockParameter,
    value: 0.10,
    showValidation: false,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter control in loading state while fetching validation rules.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    parameter: null,
    value: null,
    showValidation: false,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter control with no parameter configuration.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    parameter: mockParameter,
    value: 0.60,
    showValidation: true,
    isReadOnly: false,
    error: 'Value exceeds maximum allowed discount rate of 50%.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter control showing validation error state.',
      },
    },
  },
};

export const ReadOnly: Story = {
  args: {
    parameter: mockParameter,
    value: 0.10,
    showValidation: true,
    isReadOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter control in read-only mode for display purposes.',
      },
    },
  },
};

export const WithCustomValidation: Story = {
  args: {
    parameter: {
      ...mockParameter,
      validation: {
        min: 0.05,
        max: 0.25,
        custom: (value: number) => value % 0.01 === 0 ? null : 'Value must be divisible by 0.01',
      },
    },
    value: 0.15,
    showValidation: true,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter control with custom validation rules.',
      },
    },
  },
};
