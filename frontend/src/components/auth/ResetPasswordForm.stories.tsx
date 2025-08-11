import type { Meta, StoryObj } from '@storybook/react';
import ResetPasswordForm from './ResetPasswordForm';

const meta: Meta<typeof ResetPasswordForm> = {
  title: 'Components/ResetPasswordForm',
  component: ResetPasswordForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    token: {
      control: { type: 'text' },
      description: 'Reset password token',
    },
    onSuccess: {
      action: 'success',
      description: 'Callback when password reset succeeds',
    },
    onError: {
      action: 'error',
      description: 'Callback when password reset fails',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    token: 'valid-reset-token-123',
  },
  render: (args) => <ResetPasswordForm {...args} />,
};

export const Loading: Story = {
  args: {
    token: 'valid-reset-token-123',
  },
  render: (args) => <ResetPasswordForm {...args} />,
};

export const Empty: Story = {
  args: {
    token: '',
  },
  render: (args) => <ResetPasswordForm {...args} />,
};

export const Error: Story = {
  args: {
    token: 'invalid-token',
  },
  render: (args) => <ResetPasswordForm {...args} />,
};

export const ExpiredToken: Story = {
  args: {
    token: 'expired-token-456',
  },
  render: (args) => <ResetPasswordForm {...args} />,
};

export const WithCustomValidation: Story = {
  args: {
    token: 'valid-reset-token-123',
  },
  render: (args) => <ResetPasswordForm {...args} />,
};
