import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NotificationCenter } from '../../organisms/NotificationCenter/NotificationCenter';

const meta: Meta<typeof NotificationCenter> = {
  title: 'Organisms / NotificationCenter',
  component: NotificationCenter,
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
    expanded: {
      control: { type: 'boolean' },
    },
    searchable: {
      control: { type: 'boolean' },
    },
    filterable: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultGroups = [
  {
    id: 'today',
    title: 'Today',
    icon: 'sun',
    notifications: [
      {
        id: '1',
        title: 'New message from John',
        message: 'Hey, check out the new project updates!',
        type: 'info',
        priority: 'normal',
        read: false,
        time: '10 min ago',
        actions: [
          { key: 'view', label: 'View', icon: 'eye' },
          { key: 'mark-read', label: 'Mark as Read', icon: 'check' },
        ],
      },
      {
        id: '2',
        title: 'Payment received',
        message: 'Your payment of $500 has been successfully processed.',
        type: 'success',
        priority: 'low',
        read: false,
        time: '1 hour ago',
      },
    ],
  },
  {
    id: 'yesterday',
    title: 'Yesterday',
    icon: 'cloud',
    notifications: [
      {
        id: '3',
        title: 'System update available',
        message: 'A new system update is ready to be installed.',
        type: 'warning',
        priority: 'medium',
        read: true,
        time: 'Yesterday, 3:00 PM',
        actions: [
          { key: 'install', label: 'Install Now', icon: 'download' },
        ],
      },
      {
        id: '4',
        title: 'Login attempt from new device',
        message: 'Someone tried to log in from an unrecognized device.',
        type: 'error',
        priority: 'high',
        read: false,
        time: 'Yesterday, 9:00 AM',
        actions: [
          { key: 'secure', label: 'Secure Account', icon: 'lock' },
        ],
      },
    ],
  },
];

export const Default: Story = {
  args: {
    title: 'Notifications',
    subtitle: 'Stay updated with your recent activities.',
    groups: defaultGroups,
    expanded: true,
    searchable: true,
    filterable: true,
    onNotificationClick: (notification) => alert(`Notification clicked: ${notification.title}`),
    onNotificationAction: (notification, action) => alert(`Action ${action} on notification: ${notification.title}`),
    onMarkAllRead: () => alert('All notifications marked as read!'),
    onClearAll: () => alert('All notifications cleared!'),
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    title: 'Notifications',
    groups: defaultGroups.slice(0, 1),
    expanded: true,
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    title: 'Notifications',
    groups: defaultGroups,
    expanded: true,
    searchable: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Notifications',
    groups: defaultGroups,
    expanded: true,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Notifications',
    groups: defaultGroups,
    expanded: true,
  },
};

export const Collapsed: Story = {
  args: {
    title: 'Notifications',
    groups: defaultGroups,
    expanded: false,
  },
};

export const NoSearchAndFilter: Story = {
  args: {
    title: 'Notifications',
    groups: defaultGroups,
    expanded: true,
    searchable: false,
    filterable: false,
  },
};

export const EmptyState: Story = {
  args: {
    title: 'Notifications',
    subtitle: 'You have no new notifications.',
    groups: [],
    expanded: true,
  },
};

export const AllRead: Story = {
  args: {
    title: 'Notifications',
    groups: [
      {
        id: 'today',
        title: 'Today',
        icon: 'sun',
        notifications: [
          {
            id: '1',
            title: 'New message from John',
            message: 'Hey, check out the new project updates!',
            type: 'info',
            priority: 'normal',
            read: true,
            time: '10 min ago',
          },
          {
            id: '2',
            title: 'Payment received',
            message: 'Your payment of $500 has been successfully processed.',
            type: 'success',
            priority: 'low',
            read: true,
            time: '1 hour ago',
          },
        ],
      },
    ],
    expanded: true,
  },
};
