import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { tokens } from '../tokens';

const meta: Meta<typeof tokens> = {
  title: 'Design System/Tokens/Overview',
  component: tokens,
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    colors: {
      control: false,
      description: 'Color tokens for the design system',
    },
    typography: {
      control: false,
      description: 'Typography tokens including font sizes and weights',
    },
    spacing: {
      control: false,
      description: 'Spacing tokens for consistent layout',
    },
    borderRadius: {
      control: false,
      description: 'Border radius tokens for rounded corners',
    },
    shadows: {
      control: false,
      description: 'Shadow tokens for depth and elevation',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    colors: tokens.colors,
    typography: tokens.typography,
    spacing: tokens.spacing,
    borderRadius: tokens.borderRadius,
    shadows: tokens.shadows,
  },
  render: () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Design System Tokens</h2>
      <p className="text-sm text-muted-foreground">
        Comprehensive design tokens for consistent styling across the application.
      </p>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="space-y-6">
      {Object.entries(tokens.colors).map(([group, scale]) => (
        <div key={group}>
          <h3 className="text-sm font-medium mb-2 capitalize">{group}</h3>
          <div className="grid grid-cols-10 gap-2">
            {Object.entries(scale as Record<string, any>).map(([k, v]) => (
              <div key={k} className="text-xs text-center">
                <div className="h-10 rounded" style={{ background: v.value }} />
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
      {Object.entries(tokens.typography.fontSize).map(([k, v]) => (
        <div key={k} className="flex items-baseline gap-4">
          <div className="w-24 text-xs text-muted-foreground">{k}</div>
          <div style={{ fontSize: v.value }}>The quick brown fox</div>
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
            style={{ height: 8, width: v.value }}
          />
          <div className="text-xs">{v.value}</div>
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
            <div className="bg-muted h-10 w-20" style={{ borderRadius: v.value }} />
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
              style={{ boxShadow: v.value }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const FinancialTheme: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Financial Color Palette</h3>
        <div className="grid grid-cols-5 gap-2">
          <div className="text-xs text-center">
            <div className="h-10 rounded bg-green-500" />
            <div className="mt-1">Success</div>
          </div>
          <div className="text-xs text-center">
            <div className="h-10 rounded bg-red-500" />
            <div className="mt-1">Error</div>
          </div>
          <div className="text-xs text-center">
            <div className="h-10 rounded bg-blue-500" />
            <div className="mt-1">Info</div>
          </div>
          <div className="text-xs text-center">
            <div className="h-10 rounded bg-yellow-500" />
            <div className="mt-1">Warning</div>
          </div>
          <div className="text-xs text-center">
            <div className="h-10 rounded bg-gray-500" />
            <div className="mt-1">Neutral</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Chart Colors</h3>
        <div className="grid grid-cols-6 gap-2">
          {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map((color, i) => (
            <div key={i} className="text-xs text-center">
              <div className="h-8 rounded" style={{ background: color }} />
              <div className="mt-1">Chart {i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
