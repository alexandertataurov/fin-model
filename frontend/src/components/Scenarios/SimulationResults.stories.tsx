import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { SimulationResults } from './SimulationResults';

const meta: Meta<typeof SimulationResults> = {
  title: 'Components/SimulationResults',
  component: SimulationResults,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Comprehensive display component for Monte Carlo simulation results with statistical analysis, charts, and export capabilities.',
      },
    },
  },
  argTypes: {
    results: {
      control: { type: 'object' },
      description: 'Simulation results data',
    },
    scenario: {
      control: { type: 'object' },
      description: 'Scenario configuration',
    },
    onExport: {
      action: 'export requested',
      description: 'Callback when export is requested',
    },
    onScenarioChange: {
      action: 'scenario changed',
      description: 'Callback when scenario changes',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    showCharts: {
      control: { type: 'boolean' },
      description: 'Show chart visualizations',
    },
    showStatistics: {
      control: { type: 'boolean' },
      description: 'Show statistical summary',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockResults = {
  iterations: 10000,
  completed: 10000,
  meanNPV: 2500000,
  medianNPV: 2450000,
  stdDevNPV: 500000,
  minNPV: 1200000,
  maxNPV: 4200000,
  percentiles: {
    p5: 1600000,
    p10: 1800000,
    p25: 2100000,
    p50: 2450000,
    p75: 2800000,
    p90: 3200000,
    p95: 3500000,
  },
  confidenceInterval: {
    lower: 1500000,
    upper: 3500000,
    confidence: 0.95,
  },
  distribution: {
    bins: [1200000, 1400000, 1600000, 1800000, 2000000, 2200000, 2400000, 2600000, 2800000, 3000000, 3200000, 3400000, 3600000, 3800000, 4000000, 4200000],
    frequencies: [50, 150, 300, 500, 800, 1200, 1500, 1400, 1200, 900, 600, 400, 250, 150, 80, 40],
  },
  parameters: {
    revenue: { mean: 1000000, stdDev: 100000 },
    costOfGoods: { mean: 600000, stdDev: 50000 },
    operatingExpenses: { mean: 200000, stdDev: 20000 },
    discountRate: { mean: 0.10, stdDev: 0.02 },
  },
};

const mockScenario = {
  id: 'base-case',
  name: 'Base Case Scenario',
  description: 'Standard market conditions with moderate growth',
  parameters: {
    revenue: { mean: 1000000, stdDev: 100000 },
    costOfGoods: { mean: 600000, stdDev: 50000 },
    operatingExpenses: { mean: 200000, stdDev: 20000 },
    discountRate: { mean: 0.10, stdDev: 0.02 },
  },
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

export const Default: Story = {
  args: {
    results: mockResults,
    scenario: mockScenario,
    isLoading: false,
    showCharts: true,
    showStatistics: true,
  },
};

export const Loading: Story = {
  args: {
    results: null,
    scenario: mockScenario,
    isLoading: true,
    showCharts: true,
    showStatistics: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Simulation results component in loading state while processing simulation.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    results: null,
    scenario: null,
    isLoading: false,
    showCharts: false,
    showStatistics: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Simulation results component with no data to display.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    results: null,
    scenario: mockScenario,
    isLoading: false,
    showCharts: false,
    showStatistics: false,
    error: 'Simulation failed due to invalid parameter configuration.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Simulation results component showing error state when simulation fails.',
      },
    },
  },
};

export const ChartsOnly: Story = {
  args: {
    results: mockResults,
    scenario: mockScenario,
    isLoading: false,
    showCharts: true,
    showStatistics: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Simulation results component showing only chart visualizations.',
      },
    },
  },
};

export const StatisticsOnly: Story = {
  args: {
    results: mockResults,
    scenario: mockScenario,
    isLoading: false,
    showCharts: false,
    showStatistics: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Simulation results component showing only statistical summary.',
      },
    },
  },
};

export const HighIterations: Story = {
  args: {
    results: {
      ...mockResults,
      iterations: 50000,
      completed: 50000,
    },
    scenario: mockScenario,
    isLoading: false,
    showCharts: true,
    showStatistics: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Simulation results from high-iteration simulation with more precise results.',
      },
    },
  },
};
