import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { MonteCarloRunner } from './MonteCarloRunner';

const meta: Meta<typeof MonteCarloRunner> = {
  title: 'Components/MonteCarloRunner',
  component: MonteCarloRunner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Monte Carlo simulation runner for financial modeling with configurable parameters and real-time results visualization.',
      },
    },
  },
  argTypes: {
    iterations: {
      control: { type: 'number', min: 100, max: 10000, step: 100 },
      description: 'Number of simulation iterations',
    },
    parameters: {
      control: { type: 'object' },
      description: 'Input parameters for simulation',
    },
    onSimulationComplete: {
      action: 'simulation complete',
      description: 'Callback when simulation completes',
    },
    onProgressUpdate: {
      action: 'progress update',
      description: 'Callback for progress updates',
    },
    isRunning: {
      control: { type: 'boolean' },
      description: 'Whether simulation is currently running',
    },
    results: {
      control: { type: 'object' },
      description: 'Simulation results',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message if simulation fails',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockParameters = {
  revenue: {
    mean: 1000000,
    stdDev: 100000,
    distribution: 'normal',
  },
  costOfGoods: {
    mean: 600000,
    stdDev: 50000,
    distribution: 'normal',
  },
  operatingExpenses: {
    mean: 200000,
    stdDev: 20000,
    distribution: 'normal',
  },
  discountRate: {
    mean: 0.10,
    stdDev: 0.02,
    distribution: 'normal',
  },
};

const mockResults = {
  iterations: 1000,
  completed: 1000,
  meanNPV: 2500000,
  medianNPV: 2450000,
  stdDevNPV: 500000,
  percentiles: {
    p10: 1800000,
    p25: 2100000,
    p50: 2450000,
    p75: 2800000,
    p90: 3200000,
  },
  confidenceInterval: {
    lower: 1500000,
    upper: 3500000,
    confidence: 0.95,
  },
};

export const Default: Story = {
  args: {
    iterations: 1000,
    parameters: mockParameters,
    isRunning: false,
    results: mockResults,
  },
};

export const Running: Story = {
  args: {
    iterations: 5000,
    parameters: mockParameters,
    isRunning: true,
    results: {
      ...mockResults,
      completed: 2500,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Monte Carlo simulation currently running with progress tracking.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    iterations: 1000,
    parameters: mockParameters,
    isRunning: false,
    results: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component in loading state before simulation starts.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    iterations: 1000,
    parameters: {},
    isRunning: false,
    results: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component with no parameters configured for simulation.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    iterations: 1000,
    parameters: mockParameters,
    isRunning: false,
    results: null,
    error: 'Simulation failed: Invalid parameter distribution specified.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Component showing error state when simulation fails.',
      },
    },
  },
};

export const HighIterations: Story = {
  args: {
    iterations: 10000,
    parameters: mockParameters,
    isRunning: false,
    results: {
      ...mockResults,
      iterations: 10000,
      completed: 10000,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'High-iteration simulation with more precise results.',
      },
    },
  },
};
