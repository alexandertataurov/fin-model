import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { tokens } from '../tokens';

const meta: Meta = {
  title: 'Design System/Foundations/Tokens',
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="space-y-8">
      <section>
        <h3 className="text-sm font-medium mb-2">Colors</h3>
        {Object.entries(tokens.colors).map(([group, scale]) => (
          <div key={group} className="mb-4">
            <div className="text-xs text-muted-foreground mb-1 capitalize">
              {group}
            </div>
            <div className="grid grid-cols-10 gap-2">
              {Object.entries(scale as Record<string, string>).map(([k, v]) => (
                <div key={k} className="text-[10px] text-center">
                  <div className="h-8 rounded" style={{ background: v }} />
                  <div className="mt-1">{k}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section>
        <h3 className="text-sm font-medium mb-2">Typography</h3>
        {Object.entries(tokens.typography.fontSize).map(([k, [size]]) => (
          <div key={k} className="flex items-baseline gap-4">
            <div className="w-24 text-xs text-muted-foreground">{k}</div>
            <div style={{ fontSize: size as string }}>The quick brown fox</div>
          </div>
        ))}
      </section>
    </div>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
