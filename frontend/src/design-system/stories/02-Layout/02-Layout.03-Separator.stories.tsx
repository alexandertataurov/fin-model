import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '../../components/Separator';

const meta: Meta<typeof Separator> = {
  title: 'Design System/2 - Layout/Separator',
  component: Separator,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Separator orientation',
    },
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
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className="w-80 space-y-4">
      <div>Above</div>
      <Separator {...args} />
      <div>Below</div>
    </div>
  ),
};

export const Basic: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>Above</div>
      <Separator />
      <div>Below</div>
      <div className="flex items-center gap-4">
        <div>Left</div>
        <Separator orientation="vertical" className="h-6" />
        <div>Right</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-20">
      <div>Left content</div>
      <Separator orientation="vertical" className="h-12" />
      <div>Right content</div>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="text-sm text-muted-foreground">Section 1</div>
      <Separator />
      <div className="text-sm text-muted-foreground">Section 2</div>
      <Separator />
      <div className="text-sm text-muted-foreground">Section 3</div>
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>Content</div>
      <Separator className="bg-primary h-0.5" />
      <div>More content</div>
      <Separator className="bg-destructive h-1" />
      <div>Final content</div>
    </div>
  ),
};
