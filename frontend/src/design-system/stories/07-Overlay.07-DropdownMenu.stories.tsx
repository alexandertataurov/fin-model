import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/DropdownMenu';
import { Button } from '../components/Button';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Design System/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Whether the dropdown is open',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Callback when open state changes',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: false,
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Copy</DropdownMenuItem>
        <DropdownMenuItem>Paste</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Loading: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled>
          Loading...
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Loading Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dropdown menu in loading state with disabled trigger and menu items.',
      },
    },
  },
};

export const Empty: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">No Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dropdown menu with no available actions.',
      },
    },
  },
};

export const Error: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-destructive">
          Error loading actions
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dropdown menu showing error state when actions fail to load.',
      },
    },
  },
};

export const FinancialActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Model Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Financial Model</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Run Simulation</DropdownMenuItem>
        <DropdownMenuItem>Export Results</DropdownMenuItem>
        <DropdownMenuItem>Save Scenario</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Duplicate Model</DropdownMenuItem>
        <DropdownMenuItem>Share Model</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Delete Model</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dropdown menu with financial modeling specific actions.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Settings</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>User Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>⚙️ Preferences</DropdownMenuItem>
        <DropdownMenuItem>👤 Profile</DropdownMenuItem>
        <DropdownMenuItem>🔒 Security</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>❓ Help</DropdownMenuItem>
        <DropdownMenuItem>📧 Contact</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dropdown menu with icon indicators for different actions.',
      },
    },
  },
};
