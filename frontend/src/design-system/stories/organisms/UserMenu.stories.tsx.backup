import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UserMenu } from '../../organisms/UserMenu/UserMenu';

const meta: Meta<typeof UserMenu> = {
  title: 'Organisms / UserMenu',
  component: UserMenu,
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
    themeToggle: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Administrator',
  status: 'Online',
  avatar: 'https://github.com/shadcn.png',
};

const defaultGroups = [
  {
    id: 'account',
    title: 'Account',
    icon: 'user',
    items: [
      { key: 'profile', label: 'Profile', icon: 'user' },
      { key: 'settings', label: 'Settings', icon: 'settings' },
      { key: 'billing', label: 'Billing', icon: 'credit-card' },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    icon: 'help-circle',
    items: [
      { key: 'help', label: 'Help Center', icon: 'life-buoy' },
      { key: 'feedback', label: 'Send Feedback', icon: 'message-square' },
    ],
  },
  {
    id: 'danger',
    items: [
      { key: 'delete', label: 'Delete Account', icon: 'trash-2', danger: true },
    ],
  },
];

export const Default: Story = {
  args: {
    user: defaultUser,
    groups: defaultGroups,
    themeToggle: true,
    onItemClick: (item) => alert(`Clicked: ${item.label}`),
    onThemeToggle: () => alert('Toggle theme!'),
    onLogout: () => alert('Logged out!'),
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    user: defaultUser,
    groups: defaultGroups.slice(0, 1),
    themeToggle: false,
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    user: defaultUser,
    groups: defaultGroups,
    themeToggle: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    user: defaultUser,
    groups: defaultGroups.slice(0, 1),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    user: defaultUser,
    groups: defaultGroups,
    themeToggle: true,
  },
};

export const Expanded: Story = {
  args: {
    user: defaultUser,
    groups: defaultGroups,
    themeToggle: true,
    expanded: true,
  },
};

export const NoThemeToggle: Story = {
  args: {
    user: defaultUser,
    groups: defaultGroups,
    themeToggle: false,
  },
};

export const WithBadges: Story = {
  args: {
    user: defaultUser,
    groups: [
      {
        id: 'account',
        title: 'Account',
        icon: 'user',
        items: [
          { key: 'profile', label: 'Profile', icon: 'user' },
          { key: 'settings', label: 'Settings', icon: 'settings', badge: { text: 'New', variant: 'default' } },
          { key: 'billing', label: 'Billing', icon: 'credit-card', badge: { text: '2', variant: 'destructive' } },
        ],
      },
    ],
    themeToggle: true,
  },
};

export const CustomChildren: Story = {
  args: {
    user: defaultUser,
    groups: defaultGroups,
    themeToggle: true,
    children: (
      <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'gray' }}>
        Custom content can be placed here.
      </div>
    ),
  },
};
