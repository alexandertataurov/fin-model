import React from 'react';
import { Calendar } from '../components/Calendar';

const meta = {
  title: 'Design System/Calendar',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Single = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="p-2 border rounded-md">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
    );
  },
};

export const Range = {
  render: () => {
    const [range, setRange] = React.useState<
      { from?: Date; to?: Date } | undefined
    >();
    return (
      <div className="p-2 border rounded-md">
        <Calendar mode="range" selected={range} onSelect={setRange} />
      </div>
    );
  },
};
