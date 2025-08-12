import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { TornadoChart } from './TornadoChart';

const meta: Meta<typeof TornadoChart> = {
  title: 'Components/TornadoChart',
  component: TornadoChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Tornado chart component for sensitivity analysis showing the impact of parameter changes on financial model outputs.',
      },
    },
  },
  argTypes: {
    data: {
      control: { type: 'object' },
      description: 'Sensitivity analysis data',
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
    showValues: {
      control: { type: 'boolean' },
      description: 'Show numerical values on bars',
    },
    showBaseline: {
      control: { type: 'boolean' },
      description: 'Show baseline reference line',
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

const mockTornadoData = [
  {
    parameter: 'Discount Rate',
    lowValue: -25,
    highValue: 35,
    baseline: 0,
    impact: 30,
  },
  {
    parameter: 'Growth Rate',
    lowValue: -20,
    highValue: 28,
    baseline: 0,
    impact: 24,
  },
  {
    parameter: 'Operating Margin',
    lowValue: -15,
    highValue: 22,
    baseline: 0,
    impact: 18.5,
  },
  {
    parameter: 'Revenue',
    lowValue: -12,
    highValue: 18,
    baseline: 0,
    impact: 15,
  },
  {
    parameter: 'Tax Rate',
    lowValue: -8,
    highValue: 12,
    baseline: 0,
    impact: 10,
  },
];

const mockValuationData = [
  {
    parameter: 'EBITDA Multiple',
    lowValue: -40,
    highValue: 50,
    baseline: 0,
    impact: 45,
  },
  {
    parameter: 'Revenue Growth',
    lowValue: -30,
    highValue: 40,
    baseline: 0,
    impact: 35,
  },
  {
    parameter: 'Operating Costs',
    lowValue: -25,
    highValue: 30,
    baseline: 0,
    impact: 27.5,
  },
  {
    parameter: 'Market Size',
    lowValue: -20,
    highValue: 25,
    baseline: 0,
    impact: 22.5,
  },
];

export const Default: Story = {
  args: {
    data: mockTornadoData,
    title: 'Sensitivity Analysis - Company Valuation',
    xAxisLabel: 'Impact on Valuation (%)',
    yAxisLabel: 'Parameters',
    showValues: true,
    showBaseline: true,
    isLoading: false,
    height: 400,
    width: 600,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    title: 'Loading Sensitivity Analysis...',
    xAxisLabel: 'Impact (%)',
    yAxisLabel: 'Parameters',
    showValues: false,
    showBaseline: false,
    isLoading: true,
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tornado chart component in loading state while processing sensitivity analysis.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    data: [],
    title: 'No Sensitivity Data Available',
    xAxisLabel: 'Impact (%)',
    yAxisLabel: 'Parameters',
    showValues: false,
    showBaseline: false,
    isLoading: false,
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tornado chart component with no sensitivity analysis data to display.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    data: [],
    title: 'Error Loading Data',
    xAxisLabel: 'Impact (%)',
    yAxisLabel: 'Parameters',
    showValues: false,
    showBaseline: false,
    isLoading: false,
    error: 'Failed to load sensitivity analysis data. Please try again.',
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tornado chart component showing error state when data loading fails.',
      },
    },
  },
};

export const ValuationSensitivity: Story = {
  args: {
    data: mockValuationData,
    title: 'Valuation Sensitivity Analysis',
    xAxisLabel: 'Impact on Valuation (%)',
    yAxisLabel: 'Key Drivers',
    showValues: true,
    showBaseline: true,
    isLoading: false,
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tornado chart showing sensitivity analysis for company valuation drivers.',
      },
    },
  },
};

export const CompactView: Story = {
  args: {
    data: mockTornadoData.slice(0, 3),
    title: 'Top 3 Sensitivities',
    xAxisLabel: 'Impact (%)',
    yAxisLabel: 'Parameters',
    showValues: false,
    showBaseline: true,
    isLoading: false,
    height: 300,
    width: 500,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tornado chart in compact view showing only the top 3 most sensitive parameters.',
      },
    },
  },
};
