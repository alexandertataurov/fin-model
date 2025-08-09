import React from 'react';
import { Slider } from '../components/Slider';

const meta = {
  title: 'Design System/Slider',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Controlled = {
  render: () => {
    const [value, setValue] = React.useState([50]);
    return (
      <div className="w-80 space-y-2">
        <Slider value={value} onValueChange={setValue} max={100} min={0} />
        <div className="text-sm text-muted-foreground">Value: {value[0]}</div>
      </div>
    );
  },
};
