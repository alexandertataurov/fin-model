import React from 'react';
import { ScrollArea, ScrollBar } from '../components/ScrollArea';

const meta = {
  title: 'Design System/ScrollArea',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <ScrollArea className="h-40 w-80 rounded border p-4">
      <div className="space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-6 rounded bg-muted" />
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  ),
};
