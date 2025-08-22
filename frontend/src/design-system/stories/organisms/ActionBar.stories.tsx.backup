import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ActionBar } from '../../organisms/ActionBar/ActionBar';
import { Icon } from '../../atoms/Icon';

const meta: Meta<typeof ActionBar> = {
  title: 'Organisms / ActionBar',
  component: ActionBar,
  parameters: {
    layout: 'fullscreen',
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
    sticky: {
      control: { type: 'boolean' },
    },
    searchable: {
      control: { type: 'boolean' },
    },
    filterable: {
      control: { type: 'boolean' },
    },
    bulkActions: {
      control: { type: 'boolean' },
    },
    selectedCount: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultGroups = [
  {
    id: 'actions',
    title: 'Actions',
    icon: 'zap',
    actions: [
      { key: 'add', label: 'Add New', icon: 'plus-circle', variant: 'default' },
      { key: 'edit', label: 'Edit', icon: 'edit', variant: 'secondary' },
      { key: 'delete', label: 'Delete', icon: 'trash-2', variant: 'destructive' },
    ],
  },
  {
    id: 'views',
    title: 'Views',
    icon: 'eye',
    actions: [
      { key: 'table', label: 'Table View', icon: 'table' },
      { key: 'card', label: 'Card View', icon: 'layout-grid' },
    ],
  },
];

const defaultFilters = [
  {
    key: 'status',
    placeholder: 'Filter by Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
  {
    key: 'type',
    placeholder: 'Filter by Type',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
    ],
  },
];

export const Default: Story = {
  args: {
    title: 'Dashboard Overview',
    subtitle: 'Manage your financial data and insights.',
    groups: defaultGroups,
    searchable: true,
    filterable: true,
    filters: defaultFilters,
    onActionClick: (action) => alert(`Action clicked: ${action.label}`),
    onSearch: (term) => console.log('Search:', term),
    onFilterChange: (key, value) => console.log(`Filter ${key} changed to: ${value}`),
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    groups: [
      {
        id: 'quick-actions',
        actions: [
          { key: 'refresh', label: 'Refresh', icon: 'refresh-cw', variant: 'ghost' },
          { key: 'export', label: 'Export', icon: 'download', variant: 'ghost' },
        ],
      },
    ],
    searchable: true,
    onActionClick: (action) => alert(`Action clicked: ${action.label}`),
    onSearch: (term) => console.log('Search:', term),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    title: 'Project Management',
    subtitle: 'Overview of all active projects.',
    groups: defaultGroups,
    searchable: true,
    filterable: true,
    filters: defaultFilters,
    sticky: true,
    onActionClick: (action) => alert(`Action clicked: ${action.label}`),
    onSearch: (term) => console.log('Search:', term),
    onFilterChange: (key, value) => console.log(`Filter ${key} changed to: ${value}`),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Compact Actions',
    groups: defaultGroups,
    searchable: true,
    onActionClick: (action) => alert(`Action clicked: ${action.label}`),
    onSearch: (term) => console.log('Search:', term),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Extensive Controls',
    subtitle: 'Detailed management options for large datasets.',
    groups: defaultGroups,
    searchable: true,
    filterable: true,
    filters: defaultFilters,
    onActionClick: (action) => alert(`Action clicked: ${action.label}`),
    onSearch: (term) => console.log('Search:', term),
    onFilterChange: (key, value) => console.log(`Filter ${key} changed to: ${value}`),
  },
};

export const WithBulkActions: Story = {
  args: {
    title: 'User Management',
    subtitle: 'Select users to perform bulk operations.',
    groups: [
      {
        id: 'user-actions',
        title: 'User Actions',
        actions: [
          { key: 'activate', label: 'Activate', icon: 'check', bulkAction: true },
          { key: 'deactivate', label: 'Deactivate', icon: 'x', bulkAction: true },
          { key: 'reset-password', label: 'Reset Password', icon: 'key', bulkAction: true },
        ],
      },
    ],
    bulkActions: true,
    selectedCount: 3,
    onBulkAction: (action) => alert(`Bulk action: ${action.label} on ${3} items`),
  },
};

export const WithBadges: Story = {
  args: {
    title: 'Notification Center',
    groups: [
      {
        id: 'notifications',
        title: 'Notifications',
        actions: [
          { key: 'unread', label: 'Unread', icon: 'bell', badge: { text: '5', variant: 'destructive' } },
          { key: 'all', label: 'All', icon: 'list', badge: { text: '12', variant: 'secondary' } },
        ],
      },
    ],
    onActionClick: (action) => alert(`Action clicked: ${action.label}`),
  },
};

export const CustomChildren: Story = {
  args: {
    title: 'Custom Content',
    children: (
      <div style={{ marginLeft: 'auto', marginRight: 'auto', padding: '0 1rem' }}>
        <p>This is custom content in the center section.</p>
      </div>
    ),
  },
};
