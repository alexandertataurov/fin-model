import type { Meta, StoryObj } from '@storybook/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/Tooltip';
import { Button } from '../components/Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Design System/Tooltip',
  component: Tooltip,
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'centered' },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: { type: 'boolean' },
      description: 'Whether the tooltip is open by default',
    },
    open: {
      control: { type: 'boolean' },
      description: 'Controlled open state',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Callback when open state changes',
    },
    delayDuration: {
      control: { type: 'number', min: 0, max: 2000 },
      description: 'Delay before showing tooltip (ms)',
    },
    skipDelayDuration: {
      control: { type: 'number', min: 0, max: 2000 },
      description: 'Delay before hiding tooltip (ms)',
    },
    disableHoverableContent: {
      control: { type: 'boolean' },
      description: 'Disable hoverable content behavior',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: false,
    delayDuration: 700,
    skipDelayDuration: 300,
    disableHoverableContent: false,
  },
  render: (args) => (
    <TooltipProvider>
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Basic: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Delayed tooltip</Button>
        </TooltipTrigger>
        <TooltipContent>Appears after 500ms</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex gap-4">
      {(['top', 'right', 'bottom', 'left'] as const).map(side => (
        <TooltipProvider key={side}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary">{side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side}>Placed {side}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  ),
};

export const RichContent: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Details</Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <div className="font-medium">Title</div>
            <div className="text-xs text-primary-foreground/80">
              Extra description with emphasis.
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const FinancialMetric: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="text-blue-600 underline">
            Revenue Growth: 15.2%
          </Button>
        </TooltipTrigger>
        <TooltipContent className="w-64">
          <div className="space-y-2">
            <div className="font-medium">Revenue Growth Analysis</div>
            <div className="text-xs space-y-1">
              <p>• Q1 2024: $1.2M (+12.5%)</p>
              <p>• Q2 2024: $1.4M (+15.2%)</p>
              <p>• Q3 2024: $1.6M (+14.3%)</p>
              <p>• Q4 2024: $1.8M (+12.5%)</p>
            </div>
            <div className="text-xs text-muted-foreground">
              Based on quarterly financial reports
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const ParameterInfo: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="text-blue-600 underline">
            Discount Rate: 12%
          </Button>
        </TooltipTrigger>
        <TooltipContent className="w-64">
          <div className="space-y-2">
            <div className="font-medium">WACC Components</div>
            <div className="text-xs space-y-1">
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
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
