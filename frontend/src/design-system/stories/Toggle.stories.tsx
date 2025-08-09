import React from 'react';
import { Toggle } from '../components/Toggle';

const meta = {
  title: 'Design System/Toggle',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Variants = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Bold">B</Toggle>
      <Toggle variant="outline" aria-label="Italic">
        I
      </Toggle>
      <Toggle variant="default" aria-label="Underline">
        U
      </Toggle>
    </div>
  ),
};
