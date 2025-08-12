import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import EmailVerification from './EmailVerification';

const meta: Meta<typeof EmailVerification> = {
  title: 'Components/EmailVerification',
  component: EmailVerification,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Email verification component for confirming user email addresses during registration.',
      },
    },
  },
  argTypes: {
    email: {
      control: { type: 'text' },
      description: 'Email address to verify',
    },
    isVerified: {
      control: { type: 'boolean' },
      description: 'Whether the email is verified',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state for verification process',
    },
    onResendVerification: {
      action: 'resend verification',
      description: 'Callback when resend verification is requested',
    },
    onVerify: {
      action: 'verify email',
      description: 'Callback when verification is attempted',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message to display',
    },
    success: {
      control: { type: 'text' },
      description: 'Success message to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { 
  args: {
    email: 'user@example.com',
    isVerified: false,
    isLoading: false,
  },
};

export const Verified: Story = { 
  args: {
    email: 'user@example.com',
    isVerified: true,
    isLoading: false,
    success: 'Email verified successfully!',
  },
};

export const Loading: Story = { 
  args: {
    email: 'user@example.com',
    isVerified: false,
    isLoading: true,
  },
};

export const WithError: Story = { 
  args: {
    email: 'user@example.com',
    isVerified: false,
    isLoading: false,
    error: 'Verification failed. Please try again.',
  },
};

export const LongEmail: Story = { 
  args: {
    email: 'very.long.email.address.with.many.subdomains@example.com',
    isVerified: false,
    isLoading: false,
  },
};

export const Empty: Story = { 
  args: {
    email: '',
    isVerified: false,
    isLoading: false,
  },
};

export const Error: Story = { 
  args: {
    email: 'user@example.com',
    isVerified: false,
    isLoading: false,
    error: 'Invalid verification token. Please check your email and try again.',
  },
};
