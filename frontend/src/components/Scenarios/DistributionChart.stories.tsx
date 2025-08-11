import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { DistributionChart } from './DistributionChart';

const meta: Meta<typeof DistributionChart> = {
  title: 'Components/DistributionChart',
  component: DistributionChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Chart component for displaying probability distributions and statistical data from Monte Carlo simulations.',
      },
    },
  },
  argTypes: {
    data: {
      control: { type: 'object' },
      description: 'Distribution data points',
    },
    title: {
      control: { type: 'text' },
      description: 'Chart title',
    },
    xAxisLabel: {
      control: { type: 'text' },
      description: 'X-axis label',
    },
    yAxisLabel: {
      control: { type: 'text' },
      description: 'Y-axis label',
    },
    showStatistics: {
      control: { type: 'boolean' },
      description: 'Show statistical information',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    height: {
      control: { type: 'number' },
      description: 'Chart height in pixels',
    },
    width: {
      control: { type: 'number' },
      description: 'Chart width in pixels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockDistributionData = [
  { value: 1000000, frequency: 5 },
  { value: 1200000, frequency: 12 },
  { value: 1400000, frequency: 25 },
  { value: 1600000, frequency: 45 },
  { value: 1800000, frequency: 60 },
  { value: 2000000, frequency: 75 },
  { value: 2200000, frequency: 60 },
  { value: 2400000, frequency: 45 },
  { value: 2600000, frequency: 25 },
  { value: 2800000, frequency: 12 },
  { value: 3000000, frequency: 5 },
];

const mockRevenueData = [
  { value: 500000, frequency: 3 },
  { value: 750000, frequency: 15 },
  { value: 1000000, frequency: 35 },
  { value: 1250000, frequency: 55 },
  { value: 1500000, frequency: 70 },
  { value: 1750000, frequency: 55 },
  { value: 2000000, frequency: 35 },
  { value: 2250000, frequency: 15 },
  { value: 2500000, frequency: 3 },
];

export const Default: Story = {
  args: {
    data: mockDistributionData,
    title: 'Company Valuation Distribution',
    xAxisLabel: 'Valuation (USD)',
    yAxisLabel: 'Frequency',
    showStatistics: true,
    isLoading: false,
    height: 400,
    width: 600,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    title: 'Loading Distribution...',
    xAxisLabel: 'Value',
    yAxisLabel: 'Frequency',
    showStatistics: false,
    isLoading: true,
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Distribution chart component in loading state while processing simulation data.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    data: [],
    title: 'No Data Available',
    xAxisLabel: 'Value',
    yAxisLabel: 'Frequency',
    showStatistics: false,
    isLoading: false,
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Distribution chart component with no data to display.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    data: [],
    title: 'Error Loading Data',
    xAxisLabel: 'Value',
    yAxisLabel: 'Frequency',
    showStatistics: false,
    isLoading: false,
    error: 'Failed to load distribution data. Please try again.',
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Distribution chart component showing error state when data loading fails.',
      },
    },
  },
};

export const RevenueDistribution: Story = {
  args: {
    data: mockRevenueData,
    title: 'Revenue Forecast Distribution',
    xAxisLabel: 'Revenue (USD)',
    yAxisLabel: 'Probability',
    showStatistics: true,
    isLoading: false,
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Distribution chart showing revenue forecast probability distribution.',
      },
    },
  },
};

export const CompactView: Story = {
  args: {
    data: mockDistributionData,
    title: 'Valuation Distribution',
    xAxisLabel: 'Value',
    yAxisLabel: 'Freq',
    showStatistics: false,
    isLoading: false,
    height: 300,
    width: 400,
  },
  parameters: {
    docs: {
      description: {
        story: 'Distribution chart in compact view without statistical information.',
      },
    },
  },
};
