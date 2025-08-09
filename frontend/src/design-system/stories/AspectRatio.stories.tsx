import React from 'react';
import { AspectRatio } from '../components/AspectRatio';

const meta = {
  title: 'Design System/AspectRatio',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <div className="w-[320px]">
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground">
          16:9 (demo)
        </div>
      </AspectRatio>
    </div>
  ),
};
