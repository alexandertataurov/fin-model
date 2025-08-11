import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { ParameterTemplates } from './ParameterTemplates';

const meta: Meta<typeof ParameterTemplates> = {
  title: 'Components/ParameterTemplates',
  component: ParameterTemplates,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Template management component for creating, saving, and applying parameter sets for financial modeling scenarios.',
      },
    },
  },
  argTypes: {
    templates: {
      control: { type: 'object' },
      description: 'Array of parameter templates',
    },
    selectedTemplate: {
      control: { type: 'text' },
      description: 'Currently selected template ID',
    },
    onTemplateSelect: {
      action: 'template selected',
      description: 'Callback when template is selected',
    },
    onTemplateSave: {
      action: 'template saved',
      description: 'Callback when template is saved',
    },
    onTemplateDelete: {
      action: 'template deleted',
      description: 'Callback when template is deleted',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    showCreateForm: {
      control: { type: 'boolean' },
      description: 'Show template creation form',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockTemplates = [
  {
    id: 'startup-model',
    name: 'Startup Model',
    description: 'Standard parameters for early-stage startup valuation',
    category: 'valuation',
    parameters: {
      revenue: { value: 500000, unit: 'USD' },
      growthRate: { value: 0.25, unit: 'percentage' },
      discountRate: { value: 0.15, unit: 'percentage' },
      operatingMargin: { value: 0.10, unit: 'percentage' },
    },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    isDefault: false,
  },
  {
    id: 'mature-company',
    name: 'Mature Company',
    description: 'Conservative parameters for established companies',
    category: 'valuation',
    parameters: {
      revenue: { value: 5000000, unit: 'USD' },
      growthRate: { value: 0.08, unit: 'percentage' },
      discountRate: { value: 0.10, unit: 'percentage' },
      operatingMargin: { value: 0.20, unit: 'percentage' },
    },
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    isDefault: true,
  },
  {
    id: 'high-growth',
    name: 'High Growth',
    description: 'Aggressive parameters for high-growth scenarios',
    category: 'scenario',
    parameters: {
      revenue: { value: 2000000, unit: 'USD' },
      growthRate: { value: 0.40, unit: 'percentage' },
      discountRate: { value: 0.12, unit: 'percentage' },
      operatingMargin: { value: 0.05, unit: 'percentage' },
    },
    createdAt: '2024-01-14T10:15:00Z',
    updatedAt: '2024-01-14T10:15:00Z',
    isDefault: false,
  },
];

export const Default: Story = {
  args: {
    templates: mockTemplates,
    selectedTemplate: 'mature-company',
    isLoading: false,
    showCreateForm: false,
  },
};

export const Loading: Story = {
  args: {
    templates: [],
    selectedTemplate: null,
    isLoading: true,
    showCreateForm: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter templates component in loading state while fetching templates.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    templates: [],
    selectedTemplate: null,
    isLoading: false,
    showCreateForm: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter templates component with no templates available.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    templates: [],
    selectedTemplate: null,
    isLoading: false,
    showCreateForm: false,
    error: 'Failed to load parameter templates. Please try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter templates component showing error state when loading fails.',
      },
    },
  },
};

export const WithCreateForm: Story = {
  args: {
    templates: mockTemplates,
    selectedTemplate: 'startup-model',
    isLoading: false,
    showCreateForm: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter templates component with template creation form visible.',
      },
    },
  },
};

export const MultipleCategories: Story = {
  args: {
    templates: [
      ...mockTemplates,
      {
        id: 'sensitivity-analysis',
        name: 'Sensitivity Analysis',
        description: 'Parameters optimized for sensitivity analysis',
        category: 'analysis',
        parameters: {
          revenue: { value: 1000000, unit: 'USD' },
          growthRate: { value: 0.15, unit: 'percentage' },
          discountRate: { value: 0.11, unit: 'percentage' },
          operatingMargin: { value: 0.15, unit: 'percentage' },
        },
        createdAt: '2024-01-16T08:30:00Z',
        updatedAt: '2024-01-16T08:30:00Z',
        isDefault: false,
      },
    ],
    selectedTemplate: 'sensitivity-analysis',
    isLoading: false,
    showCreateForm: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter templates component with templates from multiple categories.',
      },
    },
  },
};
