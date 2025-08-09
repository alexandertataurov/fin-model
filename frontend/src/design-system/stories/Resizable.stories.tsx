import React from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '../components/Resizable';

const meta = {
  title: 'Design System/Resizable',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Vertical = {
  render: () => (
    <div className="h-64 border rounded-md overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
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

export const Horizontal = {
  render: () => (
    <div className="h-64 border rounded-md overflow-hidden">
      <ResizablePanelGroup direction="vertical">
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
