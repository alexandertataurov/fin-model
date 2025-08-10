import type { Meta, StoryObj } from '@storybook/react';
import { ParameterHistory } from './ParameterHistory';

const meta: Meta<typeof ParameterHistory> = {
  title: 'Components/ParameterHistory',
  component: ParameterHistory,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'History tracking component for parameter changes with version control, comparison, and rollback capabilities.',
      },
    },
  },
  argTypes: {
    history: {
      control: { type: 'object' },
      description: 'Array of parameter change history entries',
    },
    selectedVersion: {
      control: { type: 'text' },
      description: 'Currently selected version ID',
    },
    onVersionSelect: {
      action: 'version selected',
      description: 'Callback when version is selected',
    },
    onVersionRestore: {
      action: 'version restored',
      description: 'Callback when version is restored',
    },
    onVersionCompare: {
      action: 'version compare',
      description: 'Callback when version comparison is requested',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    showDetails: {
      control: { type: 'boolean' },
      description: 'Show detailed change information',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockHistory = [
  {
    id: 'v1.0.3',
    version: '1.0.3',
    timestamp: '2024-01-16T15:30:00Z',
    author: 'john.doe@company.com',
    description: 'Updated discount rate based on market analysis',
    changes: {
      discountRate: { from: 0.10, to: 0.12 },
      growthRate: { from: 0.15, to: 0.18 },
    },
    parameters: {
      revenue: 1000000,
      growthRate: 0.18,
      discountRate: 0.12,
      operatingMargin: 0.25,
    },
    isCurrent: true,
  },
  {
    id: 'v1.0.2',
    version: '1.0.2',
    timestamp: '2024-01-14T10:15:00Z',
    author: 'jane.smith@company.com',
    description: 'Adjusted revenue projections for Q4',
    changes: {
      revenue: { from: 850000, to: 1000000 },
      operatingMargin: { from: 0.20, to: 0.25 },
    },
    parameters: {
      revenue: 1000000,
      growthRate: 0.15,
      discountRate: 0.10,
      operatingMargin: 0.25,
    },
    isCurrent: false,
  },
  {
    id: 'v1.0.1',
    version: '1.0.1',
    timestamp: '2024-01-12T09:45:00Z',
    author: 'mike.wilson@company.com',
    description: 'Initial parameter setup',
    changes: {},
    parameters: {
      revenue: 850000,
      growthRate: 0.15,
      discountRate: 0.10,
      operatingMargin: 0.20,
    },
    isCurrent: false,
  },
];

export const Default: Story = {
  args: {
    history: mockHistory,
    selectedVersion: 'v1.0.3',
    isLoading: false,
    showDetails: true,
  },
};

export const Loading: Story = {
  args: {
    history: [],
    selectedVersion: null,
    isLoading: true,
    showDetails: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter history component in loading state while fetching history data.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    history: [],
    selectedVersion: null,
    isLoading: false,
    showDetails: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter history component with no history entries available.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    history: [],
    selectedVersion: null,
    isLoading: false,
    showDetails: false,
    error: 'Failed to load parameter history. Please check your connection.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter history component showing error state when loading fails.',
      },
    },
  },
};

export const CompactView: Story = {
  args: {
    history: mockHistory,
    selectedVersion: 'v1.0.2',
    isLoading: false,
    showDetails: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter history component in compact view without detailed change information.',
      },
    },
  },
};

export const WithMultipleChanges: Story = {
  args: {
    history: [
      ...mockHistory,
      {
        id: 'v1.0.4',
        version: '1.0.4',
        timestamp: '2024-01-17T11:20:00Z',
        author: 'sarah.jones@company.com',
        description: 'Comprehensive parameter review and update',
        changes: {
          revenue: { from: 1000000, to: 1200000 },
          growthRate: { from: 0.18, to: 0.20 },
          discountRate: { from: 0.12, to: 0.11 },
          operatingMargin: { from: 0.25, to: 0.28 },
        },
        parameters: {
          revenue: 1200000,
          growthRate: 0.20,
          discountRate: 0.11,
          operatingMargin: 0.28,
        },
        isCurrent: false,
      },
    ],
    selectedVersion: 'v1.0.4',
    isLoading: false,
    showDetails: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter history component with multiple parameter changes in a single version.',
      },
    },
  },
};
