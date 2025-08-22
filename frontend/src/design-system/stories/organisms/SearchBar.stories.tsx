import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from '../../organisms/SearchBar/SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Organisms / SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'filled'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    expanded: {
      control: { type: 'boolean' },
    },
    showFilters: {
      control: { type: 'boolean' },
    },
    showResults: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultFilters = [
  { key: 'users', label: 'Users', icon: 'users', count: 12 },
  { key: 'documents', label: 'Documents', icon: 'file-text', count: 5 },
  { key: 'settings', label: 'Settings', icon: 'settings', count: 3 },
];

const defaultResults = [
  { id: '1', title: 'John Doe Profile', description: 'User profile page', icon: 'user', badge: { text: 'User', variant: 'default' } },
  { id: '2', title: 'Financial Report Q3', description: 'Quarterly financial performance', icon: 'file-text', badge: { text: 'PDF', variant: 'secondary' } },
  { id: '3', title: 'Notification Settings', description: 'Manage your notification preferences', icon: 'settings', badge: { text: 'Config', variant: 'outline' } },
];

export const Default: Story = {
  args: {
    placeholder: 'Search anything...',
    onSearch: (value, filters) => console.log(`Searching for: ${value} with filters: ${filters}`),
    onFilterChange: (filters) => console.log('Active filters:', filters),
    onResultSelect: (result) => alert(`Selected result: ${result.title}`),
  },
};

export const WithFilters: Story = {
  args: {
    placeholder: 'Search with filters...',
    showFilters: true,
    filters: defaultFilters,
    onSearch: (value, filters) => console.log(`Searching for: ${value} with filters: ${filters}`),
    onFilterChange: (filters) => console.log('Active filters:', filters),
  },
};

export const WithResults: Story = {
  args: {
    placeholder: 'Search and see results...',
    showResults: true,
    results: defaultResults,
    onSearch: (value, filters) => console.log(`Searching for: ${value} with filters: ${filters}`),
    onResultSelect: (result) => alert(`Selected result: ${result.title}`),
  },
};

export const Expanded: Story = {
  args: {
    placeholder: 'Expanded search...',
    expanded: true,
    showFilters: true,
    filters: defaultFilters,
    showResults: true,
    results: defaultResults,
    onSearch: (value, filters) => console.log(`Searching for: ${value} with filters: ${filters}`),
    onFilterChange: (filters) => console.log('Active filters:', filters),
    onResultSelect: (result) => alert(`Selected result: ${result.title}`),
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    placeholder: 'Minimal search...',
    onSearch: (value) => console.log('Search:', value),
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    placeholder: 'Outline search...',
    onSearch: (value) => console.log('Search:', value),
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Filled search...',
    onSearch: (value) => console.log('Search:', value),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small search...',
    onSearch: (value) => console.log('Search:', value),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large search...',
    onSearch: (value) => console.log('Search:', value),
  },
};

export const CustomChildren: Story = {
  args: {
    placeholder: 'Search with custom actions...',
    children: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px' }}>Custom Button 1</button>
        <button style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px' }}>Custom Button 2</button>
      </div>
    ),
  },
};