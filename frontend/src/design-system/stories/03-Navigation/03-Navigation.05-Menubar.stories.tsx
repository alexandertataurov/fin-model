import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
} from '../../components/Menubar';

const meta: Meta<typeof Menubar> = {
  title: 'Design System/3 - Navigation/Menubar',
  component: Menubar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: '',
  },
  render: (args) => (
    <Menubar {...args}>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab</MenubarItem>
          <MenubarItem>Open…</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Actions</MenubarLabel>
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const Basic: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab</MenubarItem>
          <MenubarItem>Open…</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Actions</MenubarLabel>
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const FinancialApplication: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Model</MenubarItem>
          <MenubarItem>Open Model…</MenubarItem>
          <MenubarItem>Save</MenubarItem>
          <MenubarItem>Save As…</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Export to Excel</MenubarItem>
          <MenubarItem>Export to PDF</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Find Parameters</MenubarItem>
          <MenubarItem>Replace Values</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      
      <MenubarMenu>
        <MenubarTrigger>Analysis</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Simulations</MenubarLabel>
          <MenubarItem>Run Monte Carlo</MenubarItem>
          <MenubarItem>Sensitivity Analysis</MenubarItem>
          <MenubarItem>Scenario Comparison</MenubarItem>
          <MenubarSeparator />
          <MenubarLabel>Reports</MenubarLabel>
          <MenubarItem>Generate Executive Summary</MenubarItem>
          <MenubarItem>Create Detailed Report</MenubarItem>
          <MenubarItem>Export Charts</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Parameters Panel</MenubarItem>
          <MenubarItem>Results Panel</MenubarItem>
          <MenubarItem>Charts Panel</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Zoom In</MenubarItem>
          <MenubarItem>Zoom Out</MenubarItem>
          <MenubarItem>Reset Zoom</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>Video Tutorials</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>About Financial Modeler</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const Compact: Story = {
  render: () => (
    <Menubar className="text-sm">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
          <MenubarItem>Save</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>📁 File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>📄 New Model</MenubarItem>
          <MenubarItem>📂 Open Model…</MenubarItem>
          <MenubarItem>💾 Save</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>📊 Export to Excel</MenubarItem>
          <MenubarItem>📋 Export to PDF</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      
      <MenubarMenu>
        <MenubarTrigger>✏️ Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>↶ Undo</MenubarItem>
          <MenubarItem>↷ Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>✂️ Cut</MenubarItem>
          <MenubarItem>📋 Copy</MenubarItem>
          <MenubarItem>📌 Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      
      <MenubarMenu>
        <MenubarTrigger>📈 Analysis</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>🎲 Simulations</MenubarLabel>
          <MenubarItem>🎯 Monte Carlo</MenubarItem>
          <MenubarItem>📊 Sensitivity</MenubarItem>
          <MenubarSeparator />
          <MenubarLabel>📋 Reports</MenubarLabel>
          <MenubarItem>📄 Executive Summary</MenubarItem>
          <MenubarItem>📊 Detailed Report</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Model</MenubarItem>
          <MenubarItem>Open Model…</MenubarItem>
          <MenubarItem disabled>Save</MenubarItem>
          <MenubarItem disabled>Save As…</MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>Export to Excel</MenubarItem>
          <MenubarItem disabled>Export to PDF</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem disabled>Undo</MenubarItem>
          <MenubarItem disabled>Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
