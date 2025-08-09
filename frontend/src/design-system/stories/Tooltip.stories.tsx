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
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

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

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
