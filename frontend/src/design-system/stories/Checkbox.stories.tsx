import React from 'react';
import { Checkbox } from '../components/Checkbox';

const meta = {
  title: 'Design System/Checkbox',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => <Checkbox aria-label="Checkbox" />,
};

export const Controlled = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <div className="flex items-center gap-2">
        <Checkbox checked={checked} onCheckedChange={setChecked} id="c1" />
        <label htmlFor="c1" className="text-sm">
          Subscribe
        </label>
      </div>
    );
  },
};
