import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';

const meta: Meta = {
  title: 'Design System/Foundations/Transitions',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const TimingAndEasing: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(tokens.transitions).map(([name, transition]) => (
        <div key={name} className="p-4 rounded-lg border bg-card space-y-3">
          <div className="text-sm text-muted-foreground">{name}</div>
          <div className="h-20 flex items-center justify-center">
            <div
              className="size-12 rounded-md bg-primary/20 hover:bg-primary"
              style={{ transition: `all ${transition as string}` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {transition as string}
          </div>
        </div>
      ))}
    </div>
  ),
};
