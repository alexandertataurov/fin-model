import React from 'react';
import { Skeleton } from '../components/Skeleton';

const meta = {
  title: 'Design System/Skeleton',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Blocks = {
  render: () => (
    <div className="w-96 space-y-3">
      <Skeleton className="h-5 w-2/3 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
      <Skeleton className="h-10 w-full rounded" />
    </div>
  ),
};
