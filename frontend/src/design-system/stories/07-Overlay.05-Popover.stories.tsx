import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverTrigger, PopoverContent } from '../components/Popover';
import { Button } from '../components/Button';

const meta: Meta<typeof Popover> = {
  title: 'Design System/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Whether the popover is open',
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
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-1">
          <div className="font-medium">Popover Title</div>
          <div className="text-sm text-muted-foreground">
            Small description text.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-1">
          <div className="font-medium">Popover Title</div>
          <div className="text-sm text-muted-foreground">
            Small description text.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Parameter Settings</h4>
            <p className="text-sm text-muted-foreground">
              Configure your financial model parameters.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Discount Rate</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="0.10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Growth Rate</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="0.05"
            />
          </div>
          <Button className="w-full">Save Settings</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithChart: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">View Chart</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Revenue Forecast</h4>
            <p className="text-sm text-muted-foreground">
              Projected revenue over the next 5 years.
            </p>
          </div>
          <div className="h-32 bg-muted rounded-md flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Chart Placeholder</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Year 1:</span> $1.2M
            </div>
            <div>
              <span className="text-muted-foreground">Year 2:</span> $1.5M
            </div>
            <div>
              <span className="text-muted-foreground">Year 3:</span> $1.8M
            </div>
            <div>
              <span className="text-muted-foreground">Year 4:</span> $2.2M
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {open ? 'Close' : 'Open'} popover
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <div className="font-medium">Controlled Popover</div>
            <div className="text-sm text-muted-foreground">
              This popover is controlled by React state.
            </div>
            <Button size="sm" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
};
