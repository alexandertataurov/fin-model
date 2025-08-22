import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterPanel } from '../../organisms/FilterPanel/FilterPanel';

const meta: Meta<typeof FilterPanel> = {
  title: 'Organisms / FilterPanel',
  component: FilterPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'elevated'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    searchable: {
      control: { type: 'boolean' },
    },
    collapsible: {
      control: { type: 'boolean' },
    },
    collapsed: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultGroups = [
  {
    id: 'status',
    title: 'Status',
    icon: 'check-circle',
    filters: [
      { key: 'active', label: 'Active', type: 'checkbox', count: 12 },
      { key: 'pending', label: 'Pending', type: 'checkbox', count: 5 },
      { key: 'archived', label: 'Archived', type: 'checkbox', count: 20 },
    ],
  },
  {
    id: 'type',
    title: 'Type',
    icon: 'tag',
    filters: [
      { key: 'userType', label: 'User Type', type: 'select', placeholder: 'Select type', options: [
        { value: 'admin', label: 'Admin' },
        { value: 'editor', label: 'Editor' },
        { value: 'viewer', label: 'Viewer' },
      ]},
      { key: 'category', label: 'Category', type: 'select', placeholder: 'Select category', options: [
        { value: 'finance', label: 'Finance' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'sales', label: 'Sales' },
      ]},
    ],
  },
  {
    id: 'date',
    title: 'Date Range',
    icon: 'calendar',
    filters: [
      { key: 'startDate', label: 'Start Date', type: 'date', placeholder: 'Select start date' },
      { key: 'endDate', label: 'End Date', type: 'date', placeholder: 'Select end date' },
    ],
  },
];

export const Default: Story = {
  args: {
    title: 'Advanced Filters',
    subtitle: 'Refine your search results.',
    groups: defaultGroups,
    searchable: true,
    collapsible: true,
    onFilterChange: (key, value) => console.log(`Filter ${key} changed to: ${value}`),
    onClearAll: () => alert('All filters cleared!'),
    onCollapse: (collapsed) => console.log('Panel collapsed:', collapsed),
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    title: 'Quick Filters',
    groups: defaultGroups.slice(0, 1),
    collapsible: false,
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    title: 'Elevated Filters',
    groups: defaultGroups,
    searchable: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Compact Filters',
    groups: defaultGroups.slice(0, 1),
    searchable: true,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Extensive Filters',
    groups: defaultGroups,
    searchable: true,
  },
};

export const Collapsed: Story = {
  args: {
    title: 'Collapsed Panel',
    groups: defaultGroups,
    collapsed: true,
    collapsible: true,
  },
};

export const NoSearch: Story = {
  args: {
    title: 'Filters (No Search)',
    groups: defaultGroups,
    searchable: false,
  },
};

export const NoCollapse: Story = {
  args: {
    title: 'Filters (Always Open)',
    groups: defaultGroups,
    collapsible: false,
  },
};

export const WithActiveFilters: Story = {
  args: {
    title: 'Filters with Active State',
    groups: defaultGroups,
    searchable: true,
    collapsible: true,
  },
  render: (args) => {
    const [activeFilters, setActiveFilters] = React.useState({
      active: true,
      userType: 'admin',
    });

    const handleFilterChange = (key: string, value: any) => {
      setActiveFilters((prev) => {
        const newFilters = { ...prev, [key]: value };
        if (value === false || value === null || value === '') {
          delete newFilters[key];
        }
        return newFilters;
      });
      args.onFilterChange?.(key, value);
    };

    const handleClearAll = () => {
      setActiveFilters({});
      args.onClearAll?.();
    };

    return (
      <FilterPanel
        {...args}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
  },
};
