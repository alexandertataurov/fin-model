import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../components/Progress';
import { Button } from '../components/Button';

const meta: Meta<typeof Progress> = {
  title: 'Design System/Progress',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  component: Progress,
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

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

export const DifferentValues: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div>
        <div className="text-sm mb-1">Low Progress (25%)</div>
        <Progress value={25} />
      </div>
      <div>
        <div className="text-sm mb-1">Medium Progress (50%)</div>
        <Progress value={50} />
      </div>
      <div>
        <div className="text-sm mb-1">High Progress (75%)</div>
        <Progress value={75} />
      </div>
      <div>
        <div className="text-sm mb-1">Complete (100%)</div>
        <Progress value={100} />
      </div>
    </div>
  ),
};

export const SimulationProgress: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0);
    
    React.useEffect(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="space-y-2 w-[300px]">
        <div className="text-sm">Monte Carlo Simulation Progress</div>
        <Progress value={progress} />
        <div className="text-xs text-muted-foreground">
          {progress}% complete
        </div>
      </div>
    );
  },
};

export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div>
        <div className="text-sm mb-1">Default</div>
        <Progress value={60} />
      </div>
      <div>
        <div className="text-sm mb-1">Custom Height</div>
        <Progress value={60} className="h-3" />
      </div>
      <div>
        <div className="text-sm mb-1">Thin Progress</div>
        <Progress value={60} className="h-1" />
      </div>
    </div>
  ),
};
