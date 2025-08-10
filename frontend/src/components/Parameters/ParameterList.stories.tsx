import type { Meta, StoryObj } from '@storybook/react';
import ParameterList from './ParameterList';

const meta: Meta<typeof ParameterList> = {
  title: 'Components/ParameterList',
  component: ParameterList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'List component for displaying and managing financial model parameters with search, filtering, and editing capabilities.',
      },
    },
  },
  argTypes: {
    parameters: {
      control: { type: 'object' },
      description: 'Array of parameters to display',
    },
    onParameterChange: {
      action: 'parameter changed',
      description: 'Callback when parameter value changes',
    },
    onParameterDelete: {
      action: 'parameter deleted',
      description: 'Callback when parameter is deleted',
    },
    searchTerm: {
      control: { type: 'text' },
      description: 'Search term for filtering parameters',
    },
    selectedCategory: {
      control: { type: 'select' },
      options: ['all', 'financial', 'assumptions', 'valuation', 'operational'],
      description: 'Selected category filter',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    showAdvanced: {
      control: { type: 'boolean' },
      description: 'Show advanced parameter options',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockParameters = [
  {
    id: 'revenue',
    name: 'Annual Revenue',
    value: 1000000,
    unit: 'USD',
    category: 'financial',
    description: 'Projected annual revenue',
    type: 'number',
    min: 0,
    max: 10000000,
    step: 10000,
  },
  {
    id: 'growthRate',
    name: 'Growth Rate',
    value: 0.15,
    unit: 'percentage',
    category: 'assumptions',
    description: 'Annual growth rate',
    type: 'number',
    min: -0.5,
    max: 1.0,
    step: 0.01,
  },
  {
    id: 'discountRate',
    name: 'Discount Rate',
    value: 0.10,
    unit: 'percentage',
    category: 'valuation',
    description: 'Discount rate for DCF analysis',
    type: 'number',
    min: 0.01,
    max: 0.50,
    step: 0.01,
  },
  {
    id: 'operatingMargin',
    name: 'Operating Margin',
    value: 0.25,
    unit: 'percentage',
    category: 'operational',
    description: 'Target operating margin',
    type: 'number',
    min: 0,
    max: 1,
    step: 0.01,
  },
];

export const Default: Story = {
  args: {
    parameters: mockParameters,
    searchTerm: '',
    selectedCategory: 'all',
    isLoading: false,
    showAdvanced: false,
  },
};

export const Loading: Story = {
  args: {
    parameters: [],
    searchTerm: '',
    selectedCategory: 'all',
    isLoading: true,
    showAdvanced: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter list in loading state while fetching data.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    parameters: [],
    searchTerm: '',
    selectedCategory: 'all',
    isLoading: false,
    showAdvanced: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter list with no parameters to display.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    parameters: [],
    searchTerm: '',
    selectedCategory: 'all',
    isLoading: false,
    showAdvanced: false,
    error: 'Failed to load parameters. Please try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter list showing error state when data loading fails.',
      },
    },
  },
};

export const WithSearch: Story = {
  args: {
    parameters: mockParameters,
    searchTerm: 'revenue',
    selectedCategory: 'all',
    isLoading: false,
    showAdvanced: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter list with search term filtering results.',
      },
    },
  },
};

export const FilteredByCategory: Story = {
  args: {
    parameters: mockParameters,
    searchTerm: '',
    selectedCategory: 'financial',
    isLoading: false,
    showAdvanced: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter list filtered by financial category.',
      },
    },
  },
};

export const AdvancedMode: Story = {
  args: {
    parameters: mockParameters,
    searchTerm: '',
    selectedCategory: 'all',
    isLoading: false,
    showAdvanced: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter list with advanced options and detailed parameter information.',
      },
    },
  },
};
