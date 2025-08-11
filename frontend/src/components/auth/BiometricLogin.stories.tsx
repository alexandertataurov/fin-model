import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { BiometricLogin } from './BiometricLogin';

const meta: Meta<typeof BiometricLogin> = {
  title: 'Components/BiometricLogin',
  component: BiometricLogin,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onSuccess: {
      action: 'success',
      description: 'Callback when biometric authentication succeeds',
    },
    onError: {
      action: 'error',
      description: 'Callback when biometric authentication fails',
    },
    onFallback: {
      action: 'fallback',
      description: 'Callback when user chooses fallback authentication',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => <BiometricLogin {...args} />,
};

export const Loading: Story = {
  args: {},
  render: (args) => <BiometricLogin {...args} />,
};

export const Empty: Story = {
  args: {},
  render: (args) => <BiometricLogin {...args} />,
};

export const Error: Story = {
  args: {},
  render: (args) => <BiometricLogin {...args} />,
};

export const FingerprintAuth: Story = {
  args: {},
  render: (args) => <BiometricLogin {...args} />,
};

export const FaceIDAuth: Story = {
  args: {},
  render: (args) => <BiometricLogin {...args} />,
};

export const NotSupported: Story = {
  args: {},
  render: (args) => <BiometricLogin {...args} />,
};
