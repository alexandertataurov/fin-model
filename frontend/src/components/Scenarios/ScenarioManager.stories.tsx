import type { Meta, StoryObj } from '@storybook/react';
import { ScenarioManager } from './ScenarioManager';

const meta: Meta<typeof ScenarioManager> = {
  title: 'Components/Scenarios/ScenarioManager',
  component: ScenarioManager,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Comprehensive scenario management component for creating, editing, and organizing financial modeling scenarios with parameter sets.',
      },
    },
  },
  argTypes: {
    scenarios: {
      control: { type: 'object' },
      description: 'Array of financial scenarios',
    },
    selectedScenario: {
      control: { type: 'text' },
      description: 'Currently selected scenario ID',
    },
    onScenarioSelect: {
      action: 'scenario selected',
      description: 'Callback when scenario is selected',
    },
    onScenarioCreate: {
      action: 'scenario created',
      description: 'Callback when new scenario is created',
    },
    onScenarioUpdate: {
      action: 'scenario updated',
      description: 'Callback when scenario is updated',
    },
    onScenarioDelete: {
      action: 'scenario deleted',
      description: 'Callback when scenario is deleted',
    },
    onScenarioDuplicate: {
      action: 'scenario duplicated',
      description: 'Callback when scenario is duplicated',
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
      description: 'Show scenario creation form',
    },
    showAdvancedOptions: {
      control: { type: 'boolean' },
      description: 'Show advanced scenario options',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockScenarios = [
  {
    id: 'base-case-2024',
    name: 'Base Case 2024',
    description: 'Conservative growth scenario with current market conditions',
    category: 'valuation',
    parameters: {
      revenue: 1500000,
      growthRate: 0.10,
      discountRate: 0.12,
      operatingMargin: 0.20,
      taxRate: 0.25,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    isDefault: true,
    tags: ['conservative', 'current-market'],
  },
  {
    id: 'optimistic-growth',
    name: 'Optimistic Growth',
    description: 'High growth scenario with favorable market conditions',
    category: 'valuation',
    parameters: {
      revenue: 2000000,
      growthRate: 0.20,
      discountRate: 0.10,
      operatingMargin: 0.25,
      taxRate: 0.22,
    },
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    isDefault: false,
    tags: ['optimistic', 'high-growth'],
  },
  {
    id: 'pessimistic-market',
    name: 'Pessimistic Market',
    description: 'Low growth scenario with challenging market conditions',
    category: 'valuation',
    parameters: {
      revenue: 1000000,
      growthRate: 0.05,
      discountRate: 0.15,
      operatingMargin: 0.15,
      taxRate: 0.28,
    },
    createdAt: '2024-01-13T11:30:00Z',
    updatedAt: '2024-01-14T13:20:00Z',
    isDefault: false,
    tags: ['pessimistic', 'low-growth'],
  },
  {
    id: 'acquisition-scenario',
    name: 'Acquisition Scenario',
    description: 'Scenario modeling potential acquisition impact',
    category: 'strategic',
    parameters: {
      revenue: 2500000,
      growthRate: 0.15,
      discountRate: 0.11,
      operatingMargin: 0.22,
      taxRate: 0.24,
    },
    createdAt: '2024-01-12T08:45:00Z',
    updatedAt: '2024-01-13T15:10:00Z',
    isDefault: false,
    tags: ['acquisition', 'strategic'],
  },
];

export const Default: Story = {
  args: {
    scenarios: mockScenarios,
    selectedScenario: 'base-case-2024',
    isLoading: false,
    showCreateForm: false,
    showAdvancedOptions: false,
  },
};

export const Loading: Story = {
  args: {
    scenarios: [],
    selectedScenario: null,
    isLoading: true,
    showCreateForm: false,
    showAdvancedOptions: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario manager component in loading state while fetching scenarios.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    scenarios: [],
    selectedScenario: null,
    isLoading: false,
    showCreateForm: false,
    showAdvancedOptions: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario manager component with no scenarios available.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    scenarios: [],
    selectedScenario: null,
    isLoading: false,
    showCreateForm: false,
    showAdvancedOptions: false,
    error: 'Failed to load scenarios. Please check your connection and try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario manager component showing error state when loading fails.',
      },
    },
  },
};

export const WithCreateForm: Story = {
  args: {
    scenarios: mockScenarios,
    selectedScenario: 'optimistic-growth',
    isLoading: false,
    showCreateForm: true,
    showAdvancedOptions: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario manager component with scenario creation form visible.',
      },
    },
  },
};

export const AdvancedOptions: Story = {
  args: {
    scenarios: mockScenarios,
    selectedScenario: 'acquisition-scenario',
    isLoading: false,
    showCreateForm: false,
    showAdvancedOptions: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario manager component with advanced options and configuration visible.',
      },
    },
  },
};

export const MultipleCategories: Story = {
  args: {
    scenarios: [
      ...mockScenarios,
      {
        id: 'sensitivity-analysis',
        name: 'Sensitivity Analysis',
        description: 'Comprehensive sensitivity analysis scenario',
        category: 'analysis',
        parameters: {
          revenue: 1800000,
          growthRate: 0.12,
          discountRate: 0.13,
          operatingMargin: 0.21,
          taxRate: 0.25,
        },
        createdAt: '2024-01-11T10:20:00Z',
        updatedAt: '2024-01-12T12:15:00Z',
        isDefault: false,
        tags: ['sensitivity', 'analysis'],
      },
    ],
    selectedScenario: 'sensitivity-analysis',
    isLoading: false,
    showCreateForm: false,
    showAdvancedOptions: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario manager component with scenarios from multiple categories (valuation, strategic, analysis).',
      },
    },
  },
};
