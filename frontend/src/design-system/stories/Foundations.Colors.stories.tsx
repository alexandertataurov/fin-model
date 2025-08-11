import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';
import { tokenVal } from './_utils';

const meta: Meta = {
  title: 'Design System/Foundations/Colors',
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'padded'
  },
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
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Semantic Color Roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            ['--primary', '--primary-foreground', 'Primary'],
            ['--secondary', '--secondary-foreground', 'Secondary'],
            ['--accent', '--accent-foreground', 'Accent'],
            ['--muted', '--muted-foreground', 'Muted'],
            ['--destructive', '--destructive-foreground', 'Destructive'],
            ['--success', '--success-foreground', 'Success'],
            ['--warning', '--warning-foreground', 'Warning'],
            ['--info', '--info-foreground', 'Info'],
          ].map(([bgVar, fgVar, label]) => (
            <div key={bgVar} className="p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-3">{label}</div>
              <div
                className="h-20 rounded-md flex items-center justify-center font-medium"
                style={{ background: `hsl(var(${bgVar}))`, color: `hsl(var(${fgVar}))` }}
              >
                {bgVar}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Surface Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            ['--background', '--foreground', 'Background'],
            ['--card', '--card-foreground', 'Card'],
            ['--popover', '--popover-foreground', 'Popover'],
            ['--surface', '--on-surface', 'Surface'],
          ].map(([bgVar, fgVar, label]) => (
            <div key={bgVar} className="p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-3">{label}</div>
              <div
                className="h-20 rounded-md flex items-center justify-center font-medium border"
                style={{ background: `hsl(var(${bgVar}))`, color: `hsl(var(${fgVar}))` }}
              >
                {bgVar}
              </div>
            </div>
          ))}
        </div>
      </div>
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

export const ColorScales: Story = {
  render: () => (
    <div className="space-y-8">
      {['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'info', 'muted'].map((colorName) => (
        <div key={colorName} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{colorName}</h3>
          <div className="grid grid-cols-11 gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className="text-center">
                <div
                  className="h-16 w-full rounded-md border mb-2"
                  style={{ background: `var(--${colorName}-${shade})` }}
                />
                <div className="text-xs font-medium">{shade}</div>
                <div className="text-xs text-muted-foreground">
                  --{colorName}-{shade}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const StateColors: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Hover States</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'info'].map((colorName) => (
            <div key={colorName} className="text-center">
              <div
                className="h-16 w-full rounded-md border mb-2 hover:opacity-80 transition-opacity"
                style={{ background: `var(--${colorName}-600)` }}
              />
              <div className="text-sm font-medium capitalize">Hover {colorName}</div>
              <div className="text-xs text-muted-foreground">
                --{colorName}-600
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Focus Rings</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'info'].map((colorName) => (
            <div key={colorName} className="text-center">
              <div
                className="h-16 w-full rounded-md border-2 mb-2"
                style={{ borderColor: `var(--${colorName}-500)` }}
              />
              <div className="text-sm font-medium capitalize">Focus {colorName}</div>
              <div className="text-xs text-muted-foreground">
                --{colorName}-500
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
