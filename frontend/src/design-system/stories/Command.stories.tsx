import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '../components/Command';

const meta: Meta<typeof Command> = {
  title: 'Design System/Command',
  component: Command,
  parameters: { layout: 'padded' },
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
    className: 'w-[420px]',
  },
  render: (args) => (
    <Command {...args}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Basic: Story = {
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            Calendar
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem>Search</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          <CommandItem>FinVision</CommandItem>
          <CommandItem>Design System</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Dialog: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search commands…" />
        <CommandList>
          <CommandGroup heading="Favorites">
            <CommandItem>Dashboard</CommandItem>
            <CommandItem>Files</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    );
  },
};

export const FinancialCommands: Story = {
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Search financial commands…" />
      <CommandList>
        <CommandEmpty>No financial commands found.</CommandEmpty>
        <CommandGroup heading="Model Actions">
          <CommandItem>
            Run Monte Carlo Simulation
            <CommandShortcut>⌘M</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Export Results
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Save Scenario
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Analysis">
          <CommandItem>Sensitivity Analysis</CommandItem>
          <CommandItem>Scenario Comparison</CommandItem>
          <CommandItem>Risk Assessment</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Reports">
          <CommandItem>Generate Executive Summary</CommandItem>
          <CommandItem>Create Detailed Report</CommandItem>
          <CommandItem>Export Charts</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const WithSearchResults: Story = {
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Search parameters…" />
      <CommandList>
        <CommandGroup heading="Revenue Parameters">
          <CommandItem>Annual Revenue</CommandItem>
          <CommandItem>Revenue Growth Rate</CommandItem>
          <CommandItem>Revenue Per Customer</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Cost Parameters">
          <CommandItem>Operating Costs</CommandItem>
          <CommandItem>Cost of Goods Sold</CommandItem>
          <CommandItem>Fixed Costs</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Financial Ratios">
          <CommandItem>Discount Rate</CommandItem>
          <CommandItem>Tax Rate</CommandItem>
          <CommandItem>EBITDA Margin</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Search for anything…" />
      <CommandList>
        <CommandEmpty>
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No results found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
          </div>
        </CommandEmpty>
      </CommandList>
    </Command>
  ),
};
