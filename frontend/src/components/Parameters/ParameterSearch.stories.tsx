import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { ParameterSearch } from './ParameterSearch';

const meta: Meta<typeof ParameterSearch> = {
  title: 'Components/ParameterSearch',
  component: ParameterSearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Advanced search component for finding and filtering financial model parameters with real-time suggestions and autocomplete.',
      },
    },
  },
  argTypes: {
    searchTerm: {
      control: { type: 'text' },
      description: 'Current search term',
    },
    onSearch: {
      action: 'search triggered',
      description: 'Callback when search is performed',
    },
    onSuggestionSelect: {
      action: 'suggestion selected',
      description: 'Callback when suggestion is selected',
    },
    suggestions: {
      control: { type: 'object' },
      description: 'Search suggestions',
    },
    filters: {
      control: { type: 'object' },
      description: 'Active search filters',
    },
    onFilterChange: {
      action: 'filter changed',
      description: 'Callback when filters change',
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
      description: 'Show advanced search options',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockSuggestions = [
  { id: 'revenue', name: 'Revenue', category: 'financial', type: 'number' },
  { id: 'growthRate', name: 'Growth Rate', category: 'assumptions', type: 'percentage' },
  { id: 'discountRate', name: 'Discount Rate', category: 'valuation', type: 'percentage' },
  { id: 'operatingMargin', name: 'Operating Margin', category: 'operational', type: 'percentage' },
  { id: 'ebitda', name: 'EBITDA', category: 'financial', type: 'number' },
  { id: 'netIncome', name: 'Net Income', category: 'financial', type: 'number' },
];

const mockFilters = {
  category: 'all',
  type: 'all',
  range: { min: 0, max: 1000000 },
};

export const Default: Story = {
  args: {
    searchTerm: '',
    suggestions: [],
    filters: mockFilters,
    isLoading: false,
    showAdvanced: false,
  },
};

export const Loading: Story = {
  args: {
    searchTerm: 'revenue',
    suggestions: [],
    filters: mockFilters,
    isLoading: true,
    showAdvanced: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter search component in loading state while fetching suggestions.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    searchTerm: '',
    suggestions: [],
    filters: mockFilters,
    isLoading: false,
    showAdvanced: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter search component with no search term or suggestions.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    searchTerm: 'invalid',
    suggestions: [],
    filters: mockFilters,
    isLoading: false,
    showAdvanced: false,
    error: 'Search failed. Please try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter search component showing error state when search fails.',
      },
    },
  },
};

export const WithSuggestions: Story = {
  args: {
    searchTerm: 'rate',
    suggestions: mockSuggestions.filter(s => s.name.toLowerCase().includes('rate')),
    filters: mockFilters,
    isLoading: false,
    showAdvanced: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter search component with search suggestions displayed.',
      },
    },
  },
};

export const AdvancedSearch: Story = {
  args: {
    searchTerm: 'financial',
    suggestions: mockSuggestions.filter(s => s.category === 'financial'),
    filters: {
      category: 'financial',
      type: 'number',
      range: { min: 100000, max: 5000000 },
    },
    isLoading: false,
    showAdvanced: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter search component with advanced search options and filters.',
      },
    },
  },
};

export const FilteredResults: Story = {
  args: {
    searchTerm: 'margin',
    suggestions: mockSuggestions.filter(s => s.name.toLowerCase().includes('margin')),
    filters: {
      category: 'operational',
      type: 'percentage',
      range: { min: 0, max: 100 },
    },
    isLoading: false,
    showAdvanced: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameter search component with filtered results based on category and type.',
      },
    },
  },
};
