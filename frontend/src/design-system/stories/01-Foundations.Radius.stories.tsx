import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';
import React from 'react';

const meta: Meta = {
  title: 'Design System/Foundations/Radius',
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Object.entries(tokens.borderRadius).map(([name, radius]) => (
        <div key={name} className="p-4 rounded-lg border bg-card space-y-3">
          <div className="text-sm text-muted-foreground">{name}</div>
          <div
            className="h-20 bg-primary/10 border"
            style={{ borderRadius: radius as string }}
          />
          <div className="text-xs text-muted-foreground">
            {radius as string}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
