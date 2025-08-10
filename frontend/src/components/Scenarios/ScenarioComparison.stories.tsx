import type { Meta, StoryObj } from '@storybook/react';
import { ScenarioComparison } from './ScenarioComparison';

const meta: Meta<typeof ScenarioComparison> = {
  title: 'Components/ScenarioComparison',
  component: ScenarioComparison,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Component for comparing multiple financial scenarios side-by-side with key metrics and visualizations.',
      },
    },
  },
  argTypes: {
    scenarios: {
      control: { type: 'object' },
      description: 'Array of scenarios to compare',
    },
    selectedScenarios: {
      control: { type: 'object' },
      description: 'Array of selected scenario IDs',
    },
    onScenarioSelect: {
      action: 'scenario selected',
      description: 'Callback when scenario selection changes',
    },
    onScenarioCompare: {
      action: 'scenarios compared',
      description: 'Callback when scenarios are compared',
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
    showMetrics: {
      control: { type: 'boolean' },
      description: 'Show key metrics table',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockScenarios = [
  {
    id: 'base-case',
    name: 'Base Case',
    description: 'Conservative growth assumptions',
    metrics: {
      revenue: 1500000,
      ebitda: 300000,
      valuation: 2000000,
      irr: 0.15,
      paybackPeriod: 4.2,
    },
    parameters: {
      growthRate: 0.10,
      discountRate: 0.12,
      operatingMargin: 0.20,
    },
    color: '#3b82f6',
  },
  {
    id: 'optimistic',
    name: 'Optimistic',
    description: 'High growth scenario',
    metrics: {
      revenue: 2500000,
      ebitda: 500000,
      valuation: 3500000,
      irr: 0.25,
      paybackPeriod: 3.1,
    },
    parameters: {
      growthRate: 0.20,
      discountRate: 0.10,
      operatingMargin: 0.25,
    },
    color: '#10b981',
  },
  {
    id: 'pessimistic',
    name: 'Pessimistic',
    description: 'Low growth scenario',
    metrics: {
      revenue: 1000000,
      ebitda: 150000,
      valuation: 1200000,
      irr: 0.08,
      paybackPeriod: 6.5,
    },
    parameters: {
      growthRate: 0.05,
      discountRate: 0.15,
      operatingMargin: 0.15,
    },
    color: '#ef4444',
  },
];

export const Default: Story = {
  args: {
    scenarios: mockScenarios,
    selectedScenarios: ['base-case', 'optimistic'],
    isLoading: false,
    showCharts: true,
    showMetrics: true,
  },
};

export const Loading: Story = {
  args: {
    scenarios: [],
    selectedScenarios: [],
    isLoading: true,
    showCharts: true,
    showMetrics: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario comparison component in loading state while fetching scenario data.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    scenarios: [],
    selectedScenarios: [],
    isLoading: false,
    showCharts: true,
    showMetrics: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario comparison component with no scenarios available.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    scenarios: [],
    selectedScenarios: [],
    isLoading: false,
    showCharts: true,
    showMetrics: true,
    error: 'Failed to load scenario comparison data. Please try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario comparison component showing error state when loading fails.',
      },
    },
  },
};

export const AllScenarios: Story = {
  args: {
    scenarios: mockScenarios,
    selectedScenarios: ['base-case', 'optimistic', 'pessimistic'],
    isLoading: false,
    showCharts: true,
    showMetrics: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario comparison component showing all three scenarios (base, optimistic, pessimistic).',
      },
    },
  },
};

export const MetricsOnly: Story = {
  args: {
    scenarios: mockScenarios,
    selectedScenarios: ['base-case', 'optimistic'],
    isLoading: false,
    showCharts: false,
    showMetrics: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario comparison component showing only metrics table without charts.',
      },
    },
  },
};

export const ChartsOnly: Story = {
  args: {
    scenarios: mockScenarios,
    selectedScenarios: ['base-case', 'optimistic'],
    isLoading: false,
    showCharts: true,
    showMetrics: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario comparison component showing only chart visualizations without metrics table.',
      },
    },
  },
};
