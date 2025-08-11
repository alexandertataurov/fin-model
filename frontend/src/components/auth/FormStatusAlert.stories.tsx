import { Meta, StoryObj } from '@storybook/react';
import FormStatusAlert from './FormStatusAlert';

const meta: Meta<typeof FormStatusAlert> = {
    title: 'Auth/FormStatusAlert',
    component: FormStatusAlert,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Form status alert component for displaying error and success messages in authentication forms.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        error: {
            control: 'text',
        },
        success: {
            control: 'text',
        },
    },
};

export default meta;
type Story = StoryObj<typeof FormStatusAlert>;

export const Default: Story = {
    args: {
        error: null,
        success: null,
    },
    render: (args) => <FormStatusAlert {...args} />,
};

export const ErrorOnly: Story = {
    args: {
        error: 'Invalid email or password. Please try again.',
    },
};

export const SuccessOnly: Story = {
    args: {
        success: 'Login successful! Redirecting...',
    },
};

export const BothErrorAndSuccess: Story = {
    args: {
        error: 'Previous error message',
        success: 'New success message',
    },
};

export const LongError: Story = {
    args: {
        error: 'This is a very long error message that demonstrates how the component handles text wrapping and overflow in different scenarios.',
    },
};

export const LongSuccess: Story = {
    args: {
        success: 'This is a very long success message that demonstrates how the component handles text wrapping and overflow in different scenarios.',
    },
    render: (args) => <FormStatusAlert {...args} />,
};

export const FinancialAuthError: Story = {
    args: {
        error: 'Your account has been temporarily locked due to multiple failed login attempts. Please contact support or try again in 15 minutes.',
    },
    render: (args) => <FormStatusAlert {...args} />,
};

export const FinancialAuthSuccess: Story = {
    args: {
        success: 'Authentication successful! Your financial model data has been loaded.',
    },
    render: (args) => <FormStatusAlert {...args} />,
};

export const TwoFactorAuth: Story = {
    args: {
        success: 'Two-factor authentication code sent to your registered device.',
    },
    render: (args) => <FormStatusAlert {...args} />,
};
