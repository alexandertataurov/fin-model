import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StatusBar } from '../../organisms/StatusBar/StatusBar';

const meta: Meta<typeof StatusBar> = {
  title: 'Organisms / StatusBar',
  component: StatusBar,
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
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultGroups = [
  {
    id: 'system-status',
    title: 'System Status',
    icon: 'activity',
    items: [
      { key: 'cpu', label: 'CPU', value: '85%', status: 'warning' },
      { key: 'memory', label: 'Memory', value: '60%', status: 'success' },
    ],
  },
  {
    id: 'network-status',
    title: 'Network',
    icon: 'wifi',
    items: [
      { key: 'latency', label: 'Latency', value: '20ms', status: 'success' },
      { key: 'throughput', label: 'Throughput', value: '100Mbps', status: 'info' },
    ],
  },
];

const defaultActions = [
  { key: 'settings', label: 'Settings', icon: 'settings' },
  { key: 'help', label: 'Help', icon: 'help-circle' },
];

export const Default: Story = {
  args: {
    groups: defaultGroups,
    progress: { value: 75, max: 100, showLabel: true, label: 'Task Progress' },
    notification: { type: 'info', message: 'New update available!', icon: 'bell' },
    actions: defaultActions,
    onActionClick: (action) => alert(`Action clicked: ${action.label}`),
    onNotificationClick: () => alert('Notification clicked!'),
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    groups: [
      { id: 'status', items: [{ key: 'online', label: 'Online', status: 'success' }] },
    ],
    actions: [
      { key: 'refresh', label: 'Refresh', icon: 'refresh-cw', variant: 'ghost' },
    ],
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    groups: defaultGroups,
    progress: { value: 50, max: 100, variant: 'elevated' },
    notification: { type: 'warning', message: 'Disk space low!', icon: 'hard-drive' },
    actions: defaultActions,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    groups: defaultGroups,
    progress: { value: 30, max: 100 },
    notification: { type: 'success', message: 'All systems normal.' },
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    groups: defaultGroups,
    progress: { value: 90, max: 100, showLabel: true, label: 'Deployment Progress' },
    notification: { type: 'error', message: 'Critical error detected!', icon: 'alert-triangle' },
    actions: defaultActions,
  },
};

export const TopPosition: Story = {
  args: {
    position: 'top',
    groups: defaultGroups,
    notification: { type: 'info', message: 'Welcome to the app!' },
  },
};

export const NoProgress: Story = {
  args: {
    groups: defaultGroups,
    notification: { type: 'info', message: 'No active tasks.' },
    actions: defaultActions,
  },
};

export const NoNotification: Story = {
  args: {
    groups: defaultGroups,
    progress: { value: 60, max: 100 },
    actions: defaultActions,
  },
};

export const NoActions: Story = {
  args: {
    groups: defaultGroups,
    progress: { value: 80, max: 100 },
    notification: { type: 'success', message: 'Backup complete.' },
  },
};

export const WithBadges: Story = {
  args: {
    groups: [
      {
        id: 'messages',
        title: 'Messages',
        icon: 'message-square',
        items: [
          { key: 'unread', label: 'Unread', value: '3', status: 'info', badge: { text: 'New', variant: 'default' } },
          { key: 'alerts', label: 'Alerts', value: '1', status: 'warning', badge: { text: 'Urgent', variant: 'destructive' } },
        ],
      },
    ],
    notification: { type: 'info', message: 'You have new messages', badge: { text: '3', variant: 'default' } },
  },
};
