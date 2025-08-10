import type { Meta, StoryObj } from '@storybook/react';
import LogFilterForm from './LogFilterForm';

const noop = () => {};

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
    onChange: noop,
    onPrev: noop,
    onNext: noop,
    onRefresh: noop,
  },
};
