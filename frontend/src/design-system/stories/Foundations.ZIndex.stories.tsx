import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';

const meta: Meta = {
  title: 'Design System/Foundations/Z-Index',
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Layers: Story = {
  render: () => (
    <div className="relative h-64 border rounded-lg overflow-hidden bg-background">
      {Object.entries(tokens.zIndex).map(([name, z], i) => (
        <div
          key={name}
          className="absolute inset-6 rounded-md border flex items-center justify-center text-sm"
          style={{
            zIndex: Number(z as string),
            transform: `translate(${i * 10}px, ${i * 6}px)`,
            background: 'hsl(215 92% 60% / 0.10)',
            borderColor: 'hsl(215 20% 50% / 0.35)',
          }}
        >
          {name} (z={z as string})
        </div>
      ))}
    </div>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
