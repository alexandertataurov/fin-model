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
    args: {},
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
