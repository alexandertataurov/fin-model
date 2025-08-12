import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FinancialDashboard from './FinancialDashboard';

const meta: Meta<typeof FinancialDashboard> = {
  title: 'Components/Dashboard/FinancialDashboard',
  component: FinancialDashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main financial dashboard component with comprehensive financial metrics and charts.',
      },
    },
  },
  argTypes: {
    refreshInterval: {
      control: { type: 'number', min: 1000, max: 60000 },
      description: 'Refresh interval in milliseconds',
    },
    showRealTimeData: {
      control: { type: 'boolean' },
      description: 'Whether to show real-time data updates',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    refreshInterval: 5000,
    showRealTimeData: true,
  },
};

export const StaticMode: Story = {
  args: {
    refreshInterval: 0,
    showRealTimeData: false,
  },
};

export const FastRefresh: Story = {
  args: {
    refreshInterval: 1000,
    showRealTimeData: true,
  },
};
