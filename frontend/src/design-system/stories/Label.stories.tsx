import React from 'react';
import { Label } from '../components/Label';
import { Input } from '../components/Input';

const meta = {
  title: 'Design System/Label',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const WithInput = {
  render: () => (
    <div className="grid w-[280px] items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};
