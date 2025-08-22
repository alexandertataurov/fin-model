import type { Meta, StoryObj } from '@storybook/react';
import { FormStatusAlert } from '../../molecules/FormStatusAlert/FormStatusAlert';

const meta: Meta<typeof FormStatusAlert> = {
  title: '3 - Molecules/FormStatusAlert',
  component: FormStatusAlert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component to display form submission status (success or error) using the Alert component.',
      },
    },
  },
  argTypes: {
    error: {
      control: 'text',
      description:
        'The error message to display. If provided, an error alert will be shown.',
    },
    success: {
      control: 'text',
      description:
        'The success message to display. If provided, a success alert will be shown.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Hidden: Story = {
  args: {
    error: null,
    success: null,
  },
};

export const ErrorMessage: Story = {
  args: {
    error: 'There was an error submitting your form. Please try again.',
    success: null,
  },
};

export const SuccessMessage: Story = {
  args: {
    error: null,
    success: 'Your form has been submitted successfully!',
  },
};

export const LongErrorMessage: Story = {
  args: {
    error:
      'This is a very long error message that should wrap to multiple lines to ensure readability and proper display within the alert component. It demonstrates how the alert handles extensive text content gracefully.',
    success: null,
  },
};
