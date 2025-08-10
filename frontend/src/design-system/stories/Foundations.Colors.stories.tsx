import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';
import { tokenVal } from './_utils';

const meta: Meta = {
  title: 'Design System/Foundations/Colors',
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-8 w-8 rounded-md border"
        style={{ background: value }}
      />
      <div className="text-sm">
        <div className="font-medium">{name}</div>
        <div className="text-muted-foreground">{value}</div>
      </div>
    </div>
  );
}

export const Palette: Story = {
  render: () => (
    <div className="space-y-8">
      {Object.entries(tokens.colors).map(([group, scale]) => (
        <div key={group} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{group}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(scale).map(([key, value]) => (
              <Swatch
                key={key}
                name={`${group}-${key}`}
                value={tokenVal(value)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const CoreRoles: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[
        ['--primary', '--primary-foreground', 'Primary'],
        ['--secondary', '--secondary-foreground', 'Secondary'],
        ['--success', '--success-foreground', 'Success'],
        ['--warning', '--warning-foreground', 'Warning'],
        ['--info', '--info-foreground', 'Info'],
        ['--destructive', '--destructive-foreground', 'Destructive'],
        ['--muted', '--muted-foreground', 'Muted'],
        ['--accent', '--accent-foreground', 'Accent'],
      ].map(([bgVar, fgVar, label]) => (
        <div key={bgVar} className="p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground mb-3">{label}</div>
          <div
            className="h-20 rounded-md flex items-center justify-center font-medium"
            style={{ background: `var(${bgVar})`, color: `var(${fgVar})` }}
          >
            {bgVar}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const ChartColors: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Chart Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
            <div key={num} className="text-center">
              <div
                className="h-16 w-full rounded-md border mb-2"
                style={{ background: `var(--chart-${num})` }}
              />
              <div className="text-sm font-medium">Chart {num}</div>
              <div className="text-xs text-muted-foreground">
                --chart-{num}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Chart Color Aliases</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
            <div key={num} className="text-center">
              <div
                className="h-16 w-full rounded-md border mb-2"
                style={{ background: `var(--color-chart-${num})` }}
              />
              <div className="text-sm font-medium">Color Chart {num}</div>
              <div className="text-xs text-muted-foreground">
                --color-chart-{num}
              </div>
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
