import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { BulkParameterEdit } from './BulkParameterEdit';

const meta: Meta<typeof BulkParameterEdit> = {
  title: 'Components/BulkParameterEdit',
  component: BulkParameterEdit,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Bulk editing interface for modifying multiple financial model parameters simultaneously with validation and preview capabilities.',
      },
    },
  },
  argTypes: {
    parameters: {
      control: { type: 'object' },
      description: 'Array of parameters to edit',
    },
    selectedParameters: {
      control: { type: 'object' },
      description: 'Array of selected parameter IDs',
    },
    onBulkUpdate: {
      action: 'bulk update',
      description: 'Callback when bulk update is applied',
    },
    onSelectionChange: {
      action: 'selection changed',
      description: 'Callback when parameter selection changes',
    },
    onPreview: {
      action: 'preview requested',
      description: 'Callback when preview is requested',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    showPreview: {
      control: { type: 'boolean' },
      description: 'Show preview mode',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockParameters = [
  {
    id: 'revenue',
    name: 'Annual Revenue',
    type: 'number',
    value: 1000000,
    unit: 'USD',
    category: 'financial',
    description: 'Projected annual revenue',
  },
  {
    id: 'growthRate',
    name: 'Growth Rate',
    type: 'number',
    value: 0.15,
    unit: 'percentage',
    category: 'assumptions',
    description: 'Annual growth rate',
  },
  {
    id: 'discountRate',
    name: 'Discount Rate',
    type: 'number',
    value: 0.10,
    unit: 'percentage',
    category: 'valuation',
    description: 'Discount rate for DCF',
  },
  {
    id: 'operatingMargin',
    name: 'Operating Margin',
    type: 'number',
    value: 0.25,
    unit: 'percentage',
    category: 'operational',
    description: 'Target operating margin',
  },
];

export const Default: Story = {
  args: {
    parameters: mockParameters,
    selectedParameters: ['revenue', 'growthRate'],
    isLoading: false,
    showPreview: false,
  },
};

export const Loading: Story = {
  args: {
    parameters: mockParameters,
    selectedParameters: [],
    isLoading: true,
    showPreview: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Bulk parameter edit component in loading state while processing updates.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    parameters: [],
    selectedParameters: [],
    isLoading: false,
    showPreview: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Bulk parameter edit component with no parameters available.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    parameters: mockParameters,
    selectedParameters: ['revenue'],
    isLoading: false,
    showPreview: false,
    error: 'Failed to apply bulk update. Please check parameter values.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Bulk parameter edit component showing error state when update fails.',
      },
    },
  },
};

export const WithPreview: Story = {
  args: {
    parameters: mockParameters,
    selectedParameters: ['revenue', 'growthRate', 'discountRate'],
    isLoading: false,
    showPreview: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Bulk parameter edit component with preview mode enabled.',
      },
    },
  },
};

export const AllSelected: Story = {
  args: {
    parameters: mockParameters,
    selectedParameters: ['revenue', 'growthRate', 'discountRate', 'operatingMargin'],
    isLoading: false,
    showPreview: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Bulk parameter edit component with all parameters selected.',
      },
    },
  },
};
