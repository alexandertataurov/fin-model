import type { Meta, StoryObj } from '@storybook/react';
import ForgotPasswordForm from './ForgotPasswordForm';

const meta: Meta<typeof ForgotPasswordForm> = {
  title: 'Components/ForgotPasswordForm',
  component: ForgotPasswordForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onSuccess: {
      action: 'success',
      description: 'Callback when password reset email is sent',
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
  args: {},
  render: (args) => <ForgotPasswordForm {...args} />,
};

export const Loading: Story = {
  args: {},
  render: (args) => <ForgotPasswordForm {...args} />,
};

export const Empty: Story = {
  args: {},
  render: (args) => <ForgotPasswordForm {...args} />,
};

export const Error: Story = {
  args: {},
  render: (args) => <ForgotPasswordForm {...args} />,
};

export const SuccessState: Story = {
  args: {},
  render: (args) => <ForgotPasswordForm {...args} />,
};

export const InvalidEmail: Story = {
  args: {},
  render: (args) => <ForgotPasswordForm {...args} />,
};
