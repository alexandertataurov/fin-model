import type { Meta, StoryObj } from '@storybook/react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../molecules/Tooltip/Tooltip';
import { Button } from '../../atoms/Button'; // Assuming Button atom is available

const meta: Meta<typeof Tooltip> = {
  title: '3 - Molecules/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable tooltip component that displays informative text on hover or focus.',
      },
    },
  },
  argTypes: {
    content: {
      control: 'text',
      description: 'The content to display inside the tooltip.',
    },
    delayDuration: {
      control: 'number',
      description: 'The delay in milliseconds before the tooltip appears.',
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'The side on which the tooltip content will be displayed.',
    },
    sideOffset: {
      control: 'number',
      description:
        'The distance in pixels between the trigger and the tooltip content.',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description:
        'The alignment of the tooltip content relative to the trigger.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tooltip is disabled.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'This is a default tooltip.',
    children: (
      <TooltipTrigger>
        <Button>Hover me</Button>
      </TooltipTrigger>
    ),
  },
};

export const TopSide: Story = {
  args: {
    content: 'Tooltip on top.',
    side: 'top',
    children: (
      <TooltipTrigger>
        <Button>Top</Button>
      </TooltipTrigger>
    ),
  },
};

export const RightSide: Story = {
  args: {
    content: 'Tooltip on right.',
    side: 'right',
    children: (
      <TooltipTrigger>
        <Button>Right</Button>
      </TooltipTrigger>
    ),
  },
};

export const BottomSide: Story = {
  args: {
    content: 'Tooltip on bottom.',
    side: 'bottom',
    children: (
      <TooltipTrigger>
        <Button>Bottom</Button>
      </TooltipTrigger>
    ),
  },
};

export const LeftSide: Story = {
  args: {
    content: 'Tooltip on left.',
    side: 'left',
    children: (
      <TooltipTrigger>
        <Button>Left</Button>
      </TooltipTrigger>
    ),
  },
};

export const WithDelay: Story = {
  args: {
    content: 'I appear after 1 second.',
    delayDuration: 1000,
    children: (
      <TooltipTrigger>
        <Button>Hover with Delay</Button>
      </TooltipTrigger>
    ),
  },
};

export const DisabledTooltip: Story = {
  args: {
    content: 'You cannot see me.',
    disabled: true,
    children: (
      <TooltipTrigger>
        <Button>Disabled Tooltip</Button>
      </TooltipTrigger>
    ),
  },
};

export const CustomOffset: Story = {
  args: {
    content: 'I am further away.',
    sideOffset: 20,
    children: (
      <TooltipTrigger>
        <Button>Custom Offset</Button>
      </TooltipTrigger>
    ),
  },
};

export const LongContent: Story = {
  args: {
    content:
      'This is a very long tooltip content that should wrap to multiple lines if necessary to ensure readability and proper display.',
    children: (
      <TooltipTrigger>
        <Button className="w-32">Long Content</Button>
      </TooltipTrigger>
    ),
  },
};

export const CustomTrigger: Story = {
  args: {
    content: 'Tooltip for a custom trigger.',
    children: (
      <TooltipTrigger asChild>
        <a href="#" className="text-blue-500 hover:underline">
          Custom Link Trigger
        </a>
      </TooltipTrigger>
    ),
  },
};
