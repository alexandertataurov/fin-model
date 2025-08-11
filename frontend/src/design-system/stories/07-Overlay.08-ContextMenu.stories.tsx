import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
} from '../components/ContextMenu';

const meta: Meta<typeof ContextMenu> = {
  title: 'Design System/ContextMenu',
  component: ContextMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Whether the context menu is open',
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
    <ContextMenu {...args}>
      <ContextMenuTrigger>
        <div className="p-8 border rounded-md bg-card">Right click here</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const Basic: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-8 border rounded-md bg-card">Right click here</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const FinancialContext: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-8 border rounded-md bg-card">Right click on financial data</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Financial Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>Export to Excel</ContextMenuItem>
        <ContextMenuItem>Generate Report</ContextMenuItem>
        <ContextMenuItem>Run Sensitivity Analysis</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Copy Value</ContextMenuItem>
        <ContextMenuItem>Copy Formula</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Format Cell</ContextMenuItem>
        <ContextMenuItem>Add Comment</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-8 border rounded-md bg-card">Right click for options</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>File Operations</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>📁 Open</ContextMenuItem>
        <ContextMenuItem>💾 Save</ContextMenuItem>
        <ContextMenuItem>📋 Copy</ContextMenuItem>
        <ContextMenuItem>📄 Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>✏️ Edit</ContextMenuItem>
        <ContextMenuItem>🗑️ Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-8 border rounded-md bg-card">Right click with disabled items</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>Available Action</ContextMenuItem>
        <ContextMenuItem disabled>Disabled Action</ContextMenuItem>
        <ContextMenuItem>Another Action</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>No Permission</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
