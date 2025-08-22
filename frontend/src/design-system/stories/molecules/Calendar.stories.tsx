import * as React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '../../molecules/Calendar/Calendar';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Calendar> = {
  title: 'Molecules / Calendar',
  component: Calendar,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Molecule: Calendar"
            subtitle="A calendar component for date selection with multiple selection modes and customization options."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple', 'range'],
      description: 'Selection mode for the calendar.',
    },
    value: {
      control: 'date',
      description: 'The selected date(s) in single mode.',
    },
    selected: {
      control: 'object',
      description: 'The selected date(s) in multiple or range mode.',
    },
    onSelect: {
      action: 'date selected',
      description: 'Callback when a date is selected.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the calendar is disabled.',
    },
    disabledDays: {
      control: 'object',
      description: 'Specific days to disable.',
    },
    minDate: {
      control: 'date',
      description: 'Minimum selectable date.',
    },
    maxDate: {
      control: 'date',
      description: 'Maximum selectable date.',
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Whether to show days from outside the current month.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================ // STORIES // ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Calendar Variants"
        subtitle="Different calendar configurations and selection modes."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Single Selection</h4>
          <CalendarExample mode="single" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Multiple Selection</h4>
          <CalendarExample mode="multiple" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Range Selection</h4>
          <CalendarExample mode="range" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Disabled Calendar</h4>
          <Calendar disabled />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">With Disabled Days</h4>
          <Calendar
            disabledDays={[new Date(2025, 7, 15), new Date(2025, 7, 20)]}
          />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Date Range Limits</h4>
          <Calendar
            minDate={new Date(2025, 7, 10)}
            maxDate={new Date(2025, 7, 25)}
          />
        </Card>
      </div>
    </div>
  ),
};

// Helper component for interactive examples
const CalendarExample = ({ mode }: { mode: 'single' | 'multiple' | 'range' }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dates, setDates] = useState<Date[]>([]);
  const [range, setRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  if (mode === 'single') {
    return <Calendar value={date} onSelect={setDate} />;
  } else if (mode === 'multiple') {
    return <Calendar selected={dates} onSelect={setDates} />;
  } else {
    return <Calendar selected={range} onSelect={setRange} />;
  }
};

export const SingleSelection: Story = {
  render: args => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <Calendar {...args} value={date} onSelect={setDate} />;
  },
  args: {
    mode: 'single',
  },
};

export const MultipleSelection: Story = {
  render: args => {
    const [dates, setDates] = useState<Date[]>([]);
    return <Calendar {...args} selected={dates} onSelect={setDates} />;
  },
  args: {
    mode: 'multiple',
  },
};

export const RangeSelection: Story = {
  render: args => {
    const [range, setRange] = useState<{
      from: Date | undefined;
      to: Date | undefined;
    }>({ from: undefined, to: undefined });
    return <Calendar {...args} selected={range} onSelect={setRange} />;
  },
  args: {
    mode: 'range',
  },
};

export const DisabledCalendar: Story = {
  args: {
    disabled: true,
  },
};

export const WithDisabledDays: Story = {
  args: {
    disabledDays: [new Date(2025, 7, 15), new Date(2025, 7, 20)], // August 15th and 20th, 2025
  },
};

export const WithMinAndMaxDate: Story = {
  args: {
    minDate: new Date(2025, 7, 10), // August 10th, 2025
    maxDate: new Date(2025, 7, 25), // August 25th, 2025
  },
};

export const WithoutOutsideDays: Story = {
  args: {
    showOutsideDays: false,
  },
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Calendar Guidelines"
        subtitle="Best practices and design principles for calendar components."
      />

      <GuidelinesSection>
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Clear Date Selection"
          description="Provide clear visual feedback for selected dates and use appropriate selection modes for the use case."
        />
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Accessibility"
          description="Ensure proper keyboard navigation, screen reader support, and ARIA labels for all calendar interactions."
        />
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Date Constraints"
          description="Use min/max dates and disabled days to guide users and prevent invalid selections."
        />
        <GuidelinesCard
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          title="Performance"
          description="Consider performance implications when handling large date ranges or frequent updates."
        />
      </GuidelinesSection>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Interactive Calendar Examples"
        subtitle="Interactive calendar patterns and real-world usage scenarios."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Event Booking
          </h4>
          <CalendarExample mode="single" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Vacation Planning
          </h4>
          <CalendarExample mode="range" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Meeting Scheduling</h4>
          <CalendarExample mode="multiple" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Restricted Dates</h4>
          <Calendar
            disabledDays={[new Date(2025, 7, 15), new Date(2025, 7, 20)]}
            minDate={new Date(2025, 7, 1)}
            maxDate={new Date(2025, 7, 31)}
          />
        </Card>
      </div>
    </div>
  ),
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Calendar Documentation"
        subtitle="Comprehensive documentation and usage examples for the Calendar component."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Component Structure</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Calendar wrapper with selection state management</p>
            <p>• Month navigation and year selection</p>
            <p>• Day grid with proper date calculations</p>
            <p>• Support for multiple selection modes</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Props & Configuration</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• mode: 'single' | 'multiple' | 'range'</p>
            <p>• value/selected: Date selection state</p>
            <p>• disabled: boolean for entire calendar</p>
            <p>• disabledDays: array of disabled dates</p>
            <p>• minDate/maxDate: date range constraints</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Use Cases</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Date pickers and form inputs</p>
            <p>• Event scheduling and booking</p>
            <p>• Vacation and travel planning</p>
            <p>• Meeting and appointment scheduling</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Use appropriate selection mode for the use case</p>
            <p>• Provide clear visual feedback for selections</p>
            <p>• Implement proper date constraints and validation</p>
            <p>• Ensure accessibility compliance</p>
          </div>
        </Card>
      </div>
    </div>
  ),
};
