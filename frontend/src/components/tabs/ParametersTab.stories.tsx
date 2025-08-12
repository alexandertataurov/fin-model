import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ParametersTab } from './ParametersTab';

const meta: Meta<typeof ParametersTab> = {
  title: 'Components/ParametersTab',
  component: ParametersTab,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    parameters: {
      control: { type: 'object' },
      description: 'Financial model parameters',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    onParameterChange: {
      action: 'parameter changed',
      description: 'Callback when parameter changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    parameters: {
      discountRate: 12.5,
      growthRate: 5.2,
      terminalValue: 10.0,
      taxRate: 25.0,
      inflationRate: 2.1,
      currency: 'USD',
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <ParametersTab {...args} />,
};

export const Loading: Story = {
  args: {
    isLoading: true,
    parameters: null,
    error: null,
  },
  render: (args) => <ParametersTab {...args} />,
};

export const Empty: Story = {
  args: {
    isLoading: false,
    parameters: null,
    error: null,
  },
  render: (args) => <ParametersTab {...args} />,
};

export const Error: Story = {
  args: {
    isLoading: false,
    parameters: null,
    error: 'Failed to load parameters. Please check your connection.',
  },
  render: (args) => <ParametersTab {...args} />,
};

export const ConservativeModel: Story = {
  args: {
    parameters: {
      discountRate: 15.0,
      growthRate: 2.5,
      terminalValue: 8.0,
      taxRate: 30.0,
      inflationRate: 1.8,
      currency: 'EUR',
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <ParametersTab {...args} />,
};

export const AggressiveModel: Story = {
  args: {
    parameters: {
      discountRate: 8.0,
      growthRate: 12.0,
      terminalValue: 15.0,
      taxRate: 20.0,
      inflationRate: 3.5,
      currency: 'USD',
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <ParametersTab {...args} />,
};
