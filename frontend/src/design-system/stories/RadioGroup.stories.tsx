import React from 'react';
import { RadioGroup, RadioGroupItem } from '../components/RadioGroup';

const meta = {
  title: 'Design System/RadioGroup',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <RadioGroup defaultValue="2" className="flex gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="1" id="r1" />
        <label htmlFor="r1">Option 1</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="2" id="r2" />
        <label htmlFor="r2">Option 2</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="3" id="r3" />
        <label htmlFor="r3">Option 3</label>
      </div>
    </RadioGroup>
  ),
};
