import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { ParameterExport } from './ParameterExport';

const meta: Meta<typeof ParameterExport> = {
  title: 'Components/ParameterExport',
  component: ParameterExport,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Component for exporting financial model parameters to various formats including Excel, CSV, and JSON.',
      },
    },
  },
  argTypes: {
    parameters: {
      control: { type: 'object' },
      description: 'Parameters to export',
    },
    format: {
      control: { type: 'select' },
      options: ['excel', 'csv', 'json'],
      description: 'Export format',
    },
    includeMetadata: {
      control: { type: 'boolean' },
      description: 'Include parameter metadata in export',
    },
    onExport: {
      action: 'export triggered',
      description: 'Callback when export is triggered',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockParameters = {
  revenue: {
    value: 1000000,
    unit: 'USD',
    description: 'Annual revenue',
    category: 'financial',
  },
  growthRate: {
    value: 0.15,
    unit: 'percentage',
    description: 'Annual growth rate',
    category: 'assumptions',
  },
  discountRate: {
    value: 0.10,
    unit: 'percentage',
    description: 'Discount rate for DCF',
    category: 'valuation',
  },
};

export const Default: Story = {
  args: {
    parameters: mockParameters,
    format: 'excel',
    includeMetadata: true,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    parameters: mockParameters,
    format: 'csv',
    includeMetadata: false,
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Export component in loading state while processing export request.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    parameters: {},
    format: 'json',
    includeMetadata: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Export component with no parameters to export.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    parameters: mockParameters,
    format: 'excel',
    includeMetadata: true,
    isLoading: false,
    error: 'Failed to export parameters. Please try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Export component showing error state when export fails.',
      },
    },
  },
};

export const CSVFormat: Story = {
  args: {
    parameters: mockParameters,
    format: 'csv',
    includeMetadata: false,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Export parameters in CSV format without metadata.',
      },
    },
  },
};

export const JSONFormat: Story = {
  args: {
    parameters: mockParameters,
    format: 'json',
    includeMetadata: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Export parameters in JSON format with full metadata included.',
      },
    },
  },
};
