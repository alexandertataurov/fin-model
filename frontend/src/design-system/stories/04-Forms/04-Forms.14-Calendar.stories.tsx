import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '../../components/Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Design System/4 - Forms/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: { type: 'select', options: ['single', 'range', 'multiple'] },
      description: 'Calendar selection mode',
    },
    selected: {
      control: { type: 'object' },
      description: 'Selected date(s)',
    },
    onSelect: {
      action: 'date selected',
      description: 'Callback when date is selected',
    },
    disabled: {
      control: { type: 'object' },
      description: 'Disabled dates',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mode: 'single',
    selected: new Date(),
  },
  render: (args) => (
    <div className="p-2 border rounded-md">
      <Calendar {...args} />
    </div>
  ),
};

export const Single: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="p-2 border rounded-md">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
    );
  },
};

export const Range: Story = {
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

export const Multiple: Story = {
  render: () => {
    const [dates, setDates] = React.useState<Date[] | undefined>([
      new Date(),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ]);
    return (
      <div className="p-2 border rounded-md">
        <Calendar mode="multiple" selected={dates} onSelect={setDates} />
      </div>
    );
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const disabled = {
      before: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      after: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    };
    return (
      <div className="p-2 border rounded-md">
        <Calendar 
          mode="single" 
          selected={date} 
          onSelect={setDate}
          disabled={disabled}
        />
      </div>
    );
  },
};

export const FinancialQuarter: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    
    // Disable weekends and holidays
    const disabled = {
      before: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      after: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      from: new Date(2024, 0, 1), // New Year's Day
      to: new Date(2024, 0, 1),
    };
    
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Select a date for financial reporting
        </div>
        <div className="p-2 border rounded-md">
          <Calendar 
            mode="single" 
            selected={date} 
            onSelect={setDate}
            disabled={disabled}
          />
        </div>
      </div>
    );
  },
};

export const Compact: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="p-1 border rounded-md">
        <Calendar 
          mode="single" 
          selected={date} 
          onSelect={setDate}
          className="w-auto"
        />
      </div>
    );
  },
};

export const WithTodayHighlight: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="p-2 border rounded-md">
        <Calendar 
          mode="single" 
          selected={date} 
          onSelect={setDate}
          className="today-highlight"
        />
      </div>
    );
  },
};
