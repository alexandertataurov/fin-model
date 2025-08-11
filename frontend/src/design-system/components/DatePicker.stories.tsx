import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
    title: 'Design System/DatePicker',
    component: DatePicker,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Simple date picker component built on top of the Input component.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        placeholder: {
            control: 'text',
        },
        disabled: {
            control: 'boolean',
        },
        required: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
    args: {
        placeholder: 'Select a date',
        disabled: false,
        required: false,
    },
};

export const WithPlaceholder: Story = {
    args: {
        placeholder: 'Select a date',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const Required: Story = {
    args: {
        required: true,
    },
};

export const WithLabel: Story = {
    render: () => (
        <div className="space-y-2">
            <label htmlFor="date-picker" className="text-sm font-medium">
                Select Date
            </label>
            <DatePicker id="date-picker" />
        </div>
    ),
};

export const WithMinMax: Story = {
    args: {
        min: '2024-01-01',
        max: '2024-12-31',
    },
};

export const FinancialDateRange: Story = {
    render: () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="start-date" className="text-sm font-medium">
                    Fiscal Year Start
                </label>
                <DatePicker
                    id="start-date"
                    placeholder="Select fiscal year start"
                    min="2024-01-01"
                    max="2024-12-31"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="end-date" className="text-sm font-medium">
                    Fiscal Year End
                </label>
                <DatePicker
                    id="end-date"
                    placeholder="Select fiscal year end"
                    min="2024-01-01"
                    max="2024-12-31"
                />
            </div>
        </div>
    ),
};

export const ProjectTimeline: Story = {
    render: () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="project-start" className="text-sm font-medium">
                    Project Start Date
                </label>
                <DatePicker
                    id="project-start"
                    placeholder="Select project start"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="project-end" className="text-sm font-medium">
                    Project End Date
                </label>
                <DatePicker
                    id="project-end"
                    placeholder="Select project end"
                />
            </div>
        </div>
    ),
};
