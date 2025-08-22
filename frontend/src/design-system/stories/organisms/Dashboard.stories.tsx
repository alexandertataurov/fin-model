import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from '../../organisms/Dashboard/Dashboard';
import { Card } from '../../molecules/Card';

const meta: Meta<typeof Dashboard> = {
  title: 'Organisms / Dashboard',
  component: Dashboard,
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
    layout: {
      control: { type: 'select' },
      options: ['grid', 'list', 'compact'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultMetrics = [
  { id: '1', title: 'Total Revenue', value: '$1,234,567', change: '+5%', trend: 'positive', icon: 'trending-up' },
  { id: '2', title: 'New Users', value: '1,234', change: '-2%', trend: 'negative', icon: 'trending-down' },
  { id: '3', title: 'Active Projects', value: '42', change: '+0%', trend: 'neutral', icon: 'briefcase' },
  { id: '4', title: 'Support Tickets', value: '12', change: '+10%', trend: 'negative', icon: 'life-buoy' },
];

const defaultWidgets = [
  {
    id: 'widget-1',
    title: 'Sales Performance',
    content: <div style={{ height: '150px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chart Placeholder</div>,
    span: 2,
    actions: [
      { key: 'view-report', label: 'View Report', icon: 'file-text' },
      { key: 'export', label: 'Export', icon: 'download' },
    ],
  },
  {
    id: 'widget-2',
    title: 'Recent Activity',
    content: <div style={{ height: '150px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Activity List Placeholder</div>,
    span: 1,
  },
  {
    id: 'widget-3',
    title: 'Quick Stats',
    content: <div style={{ height: '150px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Stats Placeholder</div>,
    span: 1,
  },
];

const defaultFilters = [
  {
    key: 'timeframe',
    placeholder: 'Timeframe',
    options: [
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'Last Week' },
      { value: 'month', label: 'Last Month' },
    ],
  },
  {
    key: 'region',
    placeholder: 'Region',
    options: [
      { value: 'us', label: 'USA' },
      { value: 'eu', label: 'Europe' },
    ],
  },
];

const defaultActions = [
  { label: 'Add New', icon: 'plus-circle', variant: 'default' },
  { label: 'Export Data', icon: 'download', variant: 'outline' },
];

export const Default: Story = {
  args: {
    title: 'Analytics Dashboard',
    subtitle: 'Comprehensive overview of your key performance indicators.',
    metrics: defaultMetrics,
    widgets: defaultWidgets,
    filters: defaultFilters,
    actions: defaultActions,
    onMetricClick: (metric) => alert(`Metric clicked: ${metric.title}`),
    onWidgetAction: (widgetId, action) => alert(`Widget ${widgetId} action: ${action}`),
    onFilterChange: (key, value) => console.log(`Filter ${key} changed to: ${value}`),
    onActionClick: (action) => alert(`Action clicked: ${action.label}`),
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    title: 'Simple Dashboard',
    metrics: defaultMetrics.slice(0, 2),
    widgets: defaultWidgets.slice(0, 1),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    title: 'Premium Dashboard',
    subtitle: 'Enhanced view with elevated design.',
    metrics: defaultMetrics,
    widgets: defaultWidgets,
    filters: defaultFilters,
    actions: defaultActions,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Compact View',
    metrics: defaultMetrics.slice(0, 2),
    widgets: defaultWidgets.slice(0, 1),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Expanded Dashboard',
    subtitle: 'Detailed insights for in-depth analysis.',
    metrics: defaultMetrics,
    widgets: defaultWidgets,
    filters: defaultFilters,
    actions: defaultActions,
  },
};

export const NoMetrics: Story = {
  args: {
    title: 'Dashboard without Metrics',
    subtitle: 'Focus on widgets and actions.',
    widgets: defaultWidgets,
    filters: defaultFilters,
    actions: defaultActions,
  },
};

export const NoWidgets: Story = {
  args: {
    title: 'Dashboard without Widgets',
    subtitle: 'Focus on key performance indicators.',
    metrics: defaultMetrics,
    filters: defaultFilters,
    actions: defaultActions,
  },
};

export const CustomWidgetContent: Story = {
  args: {
    title: 'Custom Content Dashboard',
    widgets: [
      {
        id: 'custom-widget',
        title: 'Dynamic Content Widget',
        content: ({ filters, onAction }) => (
          <div style={{ padding: '1rem', background: '#e6ffe6', borderRadius: '8px' }}>
            <p>This content is dynamic based on filters: {JSON.stringify(filters)}</p>
            <button onClick={() => onAction('custom-action')} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Perform Custom Action
            </button>
          </div>
        ),
        span: 2,
      },
    ],
  },
};
