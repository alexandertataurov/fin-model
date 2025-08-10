import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from '../components/AspectRatio';

const meta: Meta<typeof AspectRatio> = {
  title: 'Design System/AspectRatio',
  component: AspectRatio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: { type: 'number' },
      description: 'Aspect ratio (width / height)',
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
    ratio: 16 / 9,
  },
  render: (args) => (
    <div className="w-[320px]">
      <AspectRatio {...args}>
        <div className="w-full h-full rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
          16:9 (demo)
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Basic: Story = {
  render: () => (
    <div className="w-[320px]">
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
          16:9 (demo)
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-[200px]">
      <AspectRatio ratio={1}>
        <div className="w-full h-full rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
          1:1 (Square)
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Portrait: Story = {
  render: () => (
    <div className="w-[200px]">
      <AspectRatio ratio={3 / 4}>
        <div className="w-full h-full rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
          3:4 (Portrait)
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Landscape: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={21 / 9}>
        <div className="w-full h-full rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
          21:9 (Ultrawide)
        </div>
      </AspectRatio>
    </div>
  ),
};

export const FinancialChart: Story = {
  render: () => (
    <div className="w-[500px]">
      <AspectRatio ratio={2 / 1}>
        <div className="w-full h-full rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
          Financial Chart (2:1)
        </div>
      </AspectRatio>
    </div>
  ),
};

export const MultipleRatios: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="w-[300px]">
        <AspectRatio ratio={16 / 9}>
          <div className="w-full h-full rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
            16:9
          </div>
        </AspectRatio>
      </div>
      <div className="w-[300px]">
        <AspectRatio ratio={4 / 3}>
          <div className="w-full h-full rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
            4:3
          </div>
        </AspectRatio>
      </div>
      <div className="w-[300px]">
        <AspectRatio ratio={1}>
          <div className="w-full h-full rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
            1:1
          </div>
        </AspectRatio>
      </div>
    </div>
  ),
};

export const WithImage: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={16 / 9}>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo"
          className="rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};
