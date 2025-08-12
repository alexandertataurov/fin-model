import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '../../components/Resizable';

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'Design System/2 - Layout/Resizable',
  component: ResizablePanelGroup,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Resize direction',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: { direction: 'horizontal' },
  render: (args) => (
    <div className="h-64 border rounded-md overflow-hidden">
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={40} minSize={20}>
          <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
            Left
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
            Right
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const Horizontal: Story = {
  args: { direction: 'vertical' },
  render: (args) => (
    <div className="h-64 border rounded-md overflow-hidden">
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={50}>
          <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
            Top
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
            Bottom
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const FinancialLayout: Story = {
  render: () => (
    <div className="h-64 border rounded-md overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full w-full p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">Parameters</h3>
            <div className="space-y-2 text-sm">
              <div>Discount Rate: 12%</div>
              <div>Growth Rate: 5%</div>
              <div>Terminal Value: 10x</div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="h-full w-full p-4">
            <h3 className="font-semibold mb-2">DCF Analysis</h3>
            <div className="text-sm text-muted-foreground">
              Financial model results and charts
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
