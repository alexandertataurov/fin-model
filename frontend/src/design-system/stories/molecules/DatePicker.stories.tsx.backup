import * as React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '../../molecules/DatePicker/DatePicker';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle, Calendar, Clock, CalendarDays } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof DatePicker> = {
  title: 'Molecules / DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Molecule: DatePicker"
            subtitle="A date picker component that allows users to select single, multiple, or a range of dates with various customization options."
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
    value: {
      control: 'date',
      description: 'The selected date(s).',
    },
    onChange: {
      action: 'date changed',
      description: 'Callback when the date selection changes.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input.',
    },
    format: {
      control: 'text',
      description: 'Date format string (e.g., "MM/dd/yyyy").',
    },
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'ghost'],
      description: 'Visual variant of the date picker.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the date picker.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the date picker is disabled.',
    },
    error: {
      control: 'boolean',
      description: 'Whether the date picker has an error state.',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input.',
    },
    minDate: {
      control: 'date',
      description: 'Minimum selectable date.',
    },
    maxDate: {
      control: 'date',
      description: 'Maximum selectable date.',
    },
    disabledDates: {
      control: 'object',
      description: 'Dates that should be disabled.',
    },
    mode: {
      control: 'select',
      options: ['single', 'multiple', 'range'],
      description: 'Selection mode.',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Whether to show the clear button.',
    },
    showTodayButton: {
      control: 'boolean',
      description: 'Whether to show the today button.',
    },
    editable: {
      control: 'boolean',
      description: 'Whether the input is editable.',
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
        title="DatePicker Variants"
        subtitle="Different date picker configurations and selection modes."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Single Date Selection</h4>
          <DatePickerExample mode="single" placeholder="Select a date" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Date Range Selection</h4>
          <DatePickerExample mode="range" placeholder="Select a date range" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Multiple Dates</h4>
          <DatePickerExample mode="multiple" placeholder="Select multiple dates" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Outline Variant</h4>
          <DatePickerExample variant="outline" placeholder="Outline variant" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Filled Variant</h4>
          <DatePickerExample variant="filled" placeholder="Filled variant" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Ghost Variant</h4>
          <DatePickerExample variant="ghost" placeholder="Ghost variant" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Small Size</h4>
          <DatePickerExample size="sm" placeholder="Small size" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Large Size</h4>
          <DatePickerExample size="lg" placeholder="Large size" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">With Date Constraints</h4>
          <DatePickerExample
            minDate={new Date(2025, 0, 1)}
            maxDate={new Date(2025, 0, 31)}
            placeholder="Select in January 2025"
          />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Error State</h4>
          <DatePickerExample
            error={true}
            helperText="Please select a valid date."
            placeholder="Error state"
          />
        </Card>
      </div>
    </div>
  ),
};

// Helper component for interactive examples
const DatePickerExample = ({
  mode = 'single',
  variant = 'outline',
  size = 'md',
  placeholder = 'Select a date',
  error = false,
  helperText,
  minDate,
  maxDate
}: {
  mode?: 'single' | 'multiple' | 'range';
  variant?: 'outline' | 'filled' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [dates, setDates] = useState<Date[] | null>(null);
  const [range, setRange] = useState<{ from: Date | null; to: Date | null } | null>(null);

  if (mode === 'single') {
    return (
      <DatePicker
        value={date}
        onChange={setDate}
        mode={mode}
        variant={variant}
        size={size}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        minDate={minDate}
        maxDate={maxDate}
      />
    );
  } else if (mode === 'multiple') {
    return (
      <DatePicker
        value={dates}
        onChange={setDates}
        mode={mode}
        variant={variant}
        size={size}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        minDate={minDate}
        maxDate={maxDate}
      />
    );
  } else {
    return (
      <DatePicker
        value={range}
        onChange={setRange}
        mode={mode}
        variant={variant}
        size={size}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        minDate={minDate}
        maxDate={maxDate}
      />
    );
  }
};

export const SingleDate: Story = {
  render: args => {
    const [date, setDate] = useState<Date | null>(null);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    mode: 'single',
    placeholder: 'Select a date',
  },
};

export const DateRange: Story = {
  render: args => {
    const [dateRange, setDateRange] = useState<Date[] | null>(null);
    return <DatePicker {...args} value={dateRange} onChange={setDateRange} />;
  },
  args: {
    mode: 'range',
    placeholder: 'Select a date range',
  },
};

export const MultipleDates: Story = {
  render: args => {
    const [dates, setDates] = useState<Date[] | null>(null);
    return <DatePicker {...args} value={dates} onChange={setDates} />;
  },
  args: {
    mode: 'multiple',
    placeholder: 'Select multiple dates',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Date picker is disabled',
  },
};

export const WithError: Story = {
  args: {
    error: true,
    helperText: 'Please select a valid date.',
    placeholder: 'Error state',
  },
};

export const FilledVariant: Story = {
  render: args => {
    const [date, setDate] = useState<Date | null>(null);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    variant: 'filled',
    placeholder: 'Filled variant',
  },
};

export const GhostVariant: Story = {
  render: args => {
    const [date, setDate] = useState<Date | null>(null);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    variant: 'ghost',
    placeholder: 'Ghost variant',
  },
};

export const SmallSize: Story = {
  render: args => {
    const [date, setDate] = useState<Date | null>(null);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    size: 'sm',
    placeholder: 'Small size',
  },
};

export const LargeSize: Story = {
  render: args => {
    const [date, setDate] = useState<Date | null>(null);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    size: 'lg',
    placeholder: 'Large size',
  },
};

export const WithMinAndMaxDates: Story = {
  render: args => {
    const [date, setDate] = useState<Date | null>(null);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    minDate: new Date(2025, 0, 1), // Jan 1, 2025
    maxDate: new Date(2025, 0, 31), // Jan 31, 2025
    placeholder: 'Select in January 2025',
  },
};

export const NonEditableInput: Story = {
  render: args => {
    const [date, setDate] = useState<Date | null>(new Date());
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    editable: false,
    placeholder: 'Not editable',
  },
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="DatePicker Guidelines"
        subtitle="Best practices and design principles for date picker components."
      />

      <GuidelinesSection>
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Clear Date Format"
          description="Use consistent date formats and provide clear visual feedback for selected dates."
        />
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Accessibility"
          description="Ensure proper keyboard navigation, screen reader support, and ARIA labels for all interactions."
        />
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Date Constraints"
          description="Use min/max dates and disabled dates to guide users and prevent invalid selections."
        />
        <GuidelinesCard
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          title="User Experience"
          description="Provide clear error messages and validation feedback for invalid date selections."
        />
      </GuidelinesSection>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Interactive DatePicker Examples"
        subtitle="Interactive date picker patterns and real-world usage scenarios."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Event Booking
          </h4>
          <DatePickerExample mode="single" placeholder="Select event date" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Vacation Planning
          </h4>
          <DatePickerExample mode="range" placeholder="Select vacation dates" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Meeting Scheduling
          </h4>
          <DatePickerExample mode="multiple" placeholder="Select meeting dates" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Restricted Dates</h4>
          <DatePickerExample
            minDate={new Date(2025, 0, 1)}
            maxDate={new Date(2025, 0, 31)}
            placeholder="Select in January 2025"
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
        title="DatePicker Documentation"
        subtitle="Comprehensive documentation and usage examples for the DatePicker component."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Component Structure</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Input field with calendar popup</p>
            <p>• Calendar component for date selection</p>
            <p>• Support for multiple selection modes</p>
            <p>• Validation and error handling</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Props & Configuration</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• mode: 'single' | 'multiple' | 'range'</p>
            <p>• value/onChange: Date selection state</p>
            <p>• variant: 'outline' | 'filled' | 'ghost'</p>
            <p>• size: 'sm' | 'md' | 'lg'</p>
            <p>• minDate/maxDate: date constraints</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Use Cases</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Form date inputs</p>
            <p>• Event scheduling and booking</p>
            <p>• Vacation and travel planning</p>
            <p>• Meeting and appointment scheduling</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Use appropriate selection mode for the use case</p>
            <p>• Provide clear date constraints and validation</p>
            <p>• Implement proper error handling</p>
            <p>• Ensure accessibility compliance</p>
          </div>
        </Card>
      </div>
    </div>
  ),
};
