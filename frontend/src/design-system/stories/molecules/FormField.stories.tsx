import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from '../../molecules/FormField/FormField';
import { Input } from '../../atoms/Input'; // Assuming Input atom is available

const meta: Meta<typeof FormField> = {
  title: '3 - Molecules/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A wrapper component for form fields, providing consistent labeling, error display, and helper text.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The label for the form field.',
    },
    required: {
      control: 'boolean',
      description: 'Indicates if the field is required.',
    },
    error: {
      control: 'boolean',
      description: 'Indicates if the field is in an error state.',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the field.',
    },
    children: {
      control: 'none',
      description:
        'The actual input component to be rendered inside the form field.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Username',
    children: <Input placeholder="Enter your username" />,
  },
};

export const RequiredField: Story = {
  args: {
    label: 'Email Address',
    required: true,
    children: <Input type="email" placeholder="Enter your email" />,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    helperText: 'Must be at least 8 characters long.',
    children: <Input type="password" placeholder="Enter your password" />,
  },
};

export const WithErrorState: Story = {
  args: {
    label: 'Confirm Password',
    error: true,
    helperText: 'Passwords do not match.',
    children: <Input type="password" placeholder="Confirm your password" />,
  },
};

export const RequiredWithError: Story = {
  args: {
    label: 'Full Name',
    required: true,
    error: true,
    helperText: 'This field is required.',
    children: <Input placeholder="Enter your full name" />,
  },
};

export const CustomInput: Story = {
  args: {
    label: 'Custom Field',
    helperText: 'This field can contain any input component.',
    children: (
      <textarea
        className="border rounded p-2 w-full"
        rows={3}
        placeholder="Enter text here"
      ></textarea>
    ),
  },
};
