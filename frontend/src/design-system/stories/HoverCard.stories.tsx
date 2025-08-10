import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '../components/HoverCard';

const meta: Meta<typeof HoverCard> = {
  title: 'Design System/HoverCard',
  component: HoverCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Whether the hover card is open',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Callback when open state changes',
    },
    openDelay: {
      control: { type: 'number', min: 0, max: 1000 },
      description: 'Delay before opening the hover card (ms)',
    },
    closeDelay: {
      control: { type: 'number', min: 0, max: 1000 },
      description: 'Delay before closing the hover card (ms)',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    openDelay: 200,
    closeDelay: 300,
  },
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger className="underline cursor-pointer">
        Hover over me
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-1">
          <div className="font-medium">Hover Card</div>
          <div className="text-xs text-muted-foreground">
            Useful for previews.
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const Basic: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="underline cursor-pointer">
        Hover over me
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-1">
          <div className="font-medium">Hover Card</div>
          <div className="text-xs text-muted-foreground">
            Useful for previews.
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const FinancialMetric: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="underline cursor-pointer text-blue-600">
        Revenue Growth: 15.2%
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Revenue Growth</span>
            <span className="text-green-600">+15.2%</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Q1 2024: $1.2M (+12.5%)</p>
            <p>• Q2 2024: $1.4M (+15.2%)</p>
            <p>• Q3 2024: $1.6M (+14.3%)</p>
            <p>• Q4 2024: $1.8M (+12.5%)</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Based on quarterly financial reports
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="underline cursor-pointer text-blue-600">
        John Smith
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">John Smith</h4>
            <p className="text-xs text-muted-foreground">
              Senior Financial Analyst
            </p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                Acme Corporation
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            <div>📧 john.smith@acme.com</div>
            <div>📱 +1 (555) 123-4567</div>
            <div>📍 New York, NY</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const ParameterDetails: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="underline cursor-pointer text-blue-600">
        Discount Rate: 12%
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Discount Rate (WACC)</span>
            <span className="text-blue-600">12.0%</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Components:</strong></p>
            <p>• Risk-free rate: 3.5%</p>
            <p>• Equity risk premium: 6.0%</p>
            <p>• Beta: 1.2</p>
            <p>• Cost of debt: 5.0%</p>
            <p>• Tax rate: 25%</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: 2024-01-15
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const ChartDataPoint: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="inline-block w-4 h-4 bg-blue-500 rounded cursor-pointer">
        <span className="sr-only">Data point</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Q4 2024</span>
            <span className="text-green-600">$1.8M</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Revenue Breakdown:</strong></p>
            <p>• Product A: $800K (44%)</p>
            <p>• Product B: $600K (33%)</p>
            <p>• Services: $400K (22%)</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Growth: +12.5% vs Q3 2024
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const CustomDelays: Story = {
  render: () => (
    <HoverCard openDelay={500} closeDelay={100}>
      <HoverCardTrigger className="underline cursor-pointer">
        Slow to open, fast to close
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-1">
          <div className="font-medium">Custom Delays</div>
          <div className="text-xs text-muted-foreground">
            Opens after 500ms, closes after 100ms
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
