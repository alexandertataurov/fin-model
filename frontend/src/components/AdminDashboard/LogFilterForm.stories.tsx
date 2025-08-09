import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LogFilterForm from './LogFilterForm';

const meta: Meta<typeof LogFilterForm> = {
  title: 'Admin/LogFilterForm',
  component: LogFilterForm,
};

export default meta;

type Story = StoryObj<typeof LogFilterForm>;

export const Default: Story = {
  args: {
    level: 'INFO',
    limit: 100,
    from: '',
    to: '',
    search: '',
    total: 0,
    skip: 0,
    onFilterChange: action('filter change'),
    onPrev: action('prev'),
    onNext: action('next'),
    onRefresh: action('refresh'),
  },
};
