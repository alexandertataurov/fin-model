import React from 'react';
import { Separator } from '../components/Separator';

const meta = {
  title: 'Design System/Separator',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>Above</div>
      <Separator />
      <div>Below</div>
      <div className="flex items-center gap-4">
        <div>Left</div>
        <Separator orientation="vertical" className="h-6" />
        <div>Right</div>
      </div>
    </div>
  ),
};
