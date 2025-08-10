import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { tokens } from '../tokens';

type AnyRecord = Record<string, any>;

function isScale(obj: AnyRecord): boolean {
  // Consider it a scale if it has numeric-like keys (e.g., '50', '100', ...)
  return Object.keys(obj).some((k) => /^(?:[0-9]{2,3}|950)$/.test(k));
}

function getValue(v: any): string {
  // Style Dictionary token format stores value in .value
  if (v && typeof v === 'object' && 'value' in v) return String(v.value);
  return String(v);
}

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
        {Object.entries(tokens.colors as AnyRecord).map(([group, value]) => {
          const content = isScale(value)
            ? (
                <div className="grid grid-cols-10 gap-2">
                  {Object.entries(value as AnyRecord)
                    .filter(([k]) => /^(?:[0-9]{2,3}|950)$/.test(k))
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([k, v]) => (
                      <div key={k} className="text-[10px] text-center">
                        <div className="h-8 rounded" style={{ background: getValue(v) }} />
                        <div className="mt-1">{k}</div>
                      </div>
                    ))}
                </div>
              )
            : (
                <div className="grid grid-cols-6 gap-2">
                  {Object.entries(value as AnyRecord)
                    .filter(([k]) => k === 'value')
                    .map(([k, v]) => (
                      <div key={k} className="text-[10px] text-center">
                        <div className="h-8 rounded" style={{ background: getValue(v) }} />
                        <div className="mt-1">{group}</div>
                      </div>
                    ))}
                </div>
              );
          return (
            <div key={group} className="mb-4">
              <div className="text-xs text-muted-foreground mb-1 capitalize">
                {group}
              </div>
              {content}
            </div>
          );
        })}
      </section>
      <section>
        <h3 className="text-sm font-medium mb-2">Typography</h3>
        {Object.entries(tokens.typography.fontSize as AnyRecord).map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-4">
            <div className="w-24 text-xs text-muted-foreground">{k}</div>
            <div style={{ fontSize: getValue(v) }}>The quick brown fox</div>
          </div>
        ))}
      </section>
    </div>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
