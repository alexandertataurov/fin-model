import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea, ScrollBar } from '../../components/ScrollArea';

const meta: Meta<typeof ScrollArea> = {
  title: 'Design System/2 - Layout/ScrollArea',
  component: ScrollArea,
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
    className: 'h-40 w-80 rounded border p-4',
  },
  render: (args) => (
    <ScrollArea {...args}>
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-6 rounded bg-muted" />
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  ),
};

export const Basic: Story = {
  render: () => (
    <ScrollArea className="h-40 w-80 rounded border p-4">
      <div className="space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-6 rounded bg-muted" />
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  ),
};

export const WithContent: Story = {
  render: () => (
    <ScrollArea className="h-60 w-96 rounded border p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Financial Data</h3>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="p-3 rounded border bg-card">
            <div className="font-medium">Item {i + 1}</div>
            <div className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  ),
};

export const HorizontalScroll: Story = {
  render: () => (
    <ScrollArea className="h-32 w-80 rounded border p-4">
      <div className="flex space-x-4" style={{ width: '600px' }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-32 h-20 rounded bg-muted flex items-center justify-center">
            Card {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

export const BothDirections: Story = {
  render: () => (
    <ScrollArea className="h-60 w-80 rounded border p-4">
      <div className="space-y-4" style={{ width: '600px' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="p-3 rounded border bg-card">
            <div className="font-medium">Item {i + 1}</div>
            <div className="text-sm text-muted-foreground">
              This is a longer description that demonstrates horizontal scrolling capabilities.
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
