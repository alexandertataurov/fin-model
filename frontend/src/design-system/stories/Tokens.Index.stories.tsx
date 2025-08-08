import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { tokens } from '../tokens';

const meta: Meta = {
  title: 'Design System/Tokens/Overview',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: () => (
    <div className="space-y-6">
      {Object.entries(tokens.colors).map(([group, scale]) => (
        <div key={group}>
          <h3 className="text-sm font-medium mb-2 capitalize">{group}</h3>
          <div className="grid grid-cols-10 gap-2">
            {Object.entries(scale as Record<string, string>).map(([k, v]) => (
              <div key={k} className="text-xs text-center">
                <div className="h-10 rounded" style={{ background: v }} />
                <div className="mt-1">{k}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="space-y-4">
      {Object.entries(tokens.typography.fontSize).map(([k, [size]]) => (
        <div key={k} className="flex items-baseline gap-4">
          <div className="w-24 text-xs text-muted-foreground">{k}</div>
          <div style={{ fontSize: size as string }}>The quick brown fox</div>
        </div>
      ))}
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="space-y-4">
      {Object.entries(tokens.spacing).map(([k, v]) => (
        <div key={k} className="flex items-center gap-4">
          <div className="w-24 text-xs text-muted-foreground">{k}</div>
          <div
            className="bg-muted rounded"
            style={{ height: 8, width: v as string }}
          />
          <div className="text-xs">{v as string}</div>
        </div>
      ))}
    </div>
  ),
};

export const RadiusAndShadows: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Radius</h3>
        {Object.entries(tokens.borderRadius).map(([k, v]) => (
          <div key={k} className="flex items-center gap-4">
            <div className="w-24 text-xs text-muted-foreground">{k}</div>
            <div
              className="bg-muted h-10 w-20"
              style={{ borderRadius: v as string }}
            />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Shadows</h3>
        {Object.entries(tokens.shadows).map(([k, v]) => (
          <div key={k} className="flex items-center gap-4">
            <div className="w-24 text-xs text-muted-foreground">{k}</div>
            <div
              className="bg-white h-12 w-24 rounded shadow"
              style={{ boxShadow: v as string }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};
