import React from 'react';
import { Input } from '../components/Input';

const meta = {
  title: 'Design System/Tokens/Input',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const States = {
  render: () => (
    <div className="grid gap-3 w-80">
      <Input placeholder="Default" />
      <Input placeholder="With error" error helperText="Required field" />
      <Input placeholder="Disabled" disabled />
    </div>
  ),
};
