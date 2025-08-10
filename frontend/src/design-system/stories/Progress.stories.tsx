import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../components/Progress';
import { Button } from '../components/Button';

const meta: Meta<typeof Progress> = {
  title: 'Design System/Progress',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  component: Progress,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState(25);
    return (
      <div className="space-y-2 w-[300px]">
        <Progress value={value} />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setValue(v => Math.max(0, v - 10))}
          >
            -10
          </Button>
          <Button
            size="sm"
            onClick={() => setValue(v => Math.min(100, v + 10))}
          >
            +10
          </Button>
        </div>
      </div>
    );
  },
};
