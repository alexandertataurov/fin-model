import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Form } from '../../organisms/Form/Form';

const meta: Meta<typeof Form> = {
  title: 'Organisms / Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'filled'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    layout: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal', 'grid'],
    },
    loading: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'text' },
    },
    success: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultFields = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name', required: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email', required: true, validation: (value) => (!value.includes('@') ? 'Invalid email address' : null) },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', required: true, validation: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null) },
  { name: 'age', label: 'Age', type: 'number', placeholder: 'Enter your age' },
  { name: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Tell us about yourself', rows: 4 },
  { name: 'country', label: 'Country', type: 'select', options: [
    { value: 'usa', label: 'United States' },
    { value: 'can', label: 'Canada' },
    { value: 'mex', label: 'Mexico' },
  ], placeholder: 'Select your country' },
  { name: 'subscribe', label: 'Subscribe to newsletter', type: 'checkbox' },
];

const defaultActions = [
  { label: 'Submit', type: 'submit', variant: 'default' },
  { label: 'Reset', type: 'reset', variant: 'outline' },
];

export const Default: Story = {
  args: {
    fields: defaultFields,
    actions: defaultActions,
    onSubmit: (data) => alert(`Form submitted: ${JSON.stringify(data, null, 2)}`),
    onReset: () => alert('Form reset!'),
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    fields: defaultFields,
    actions: defaultActions,
    onSubmit: (data) => alert(`Form submitted: ${JSON.stringify(data, null, 2)}`),
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    fields: defaultFields,
    actions: defaultActions,
    onSubmit: (data) => alert(`Form submitted: ${JSON.stringify(data, null, 2)}`),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    fields: defaultFields,
    actions: defaultActions,
    onSubmit: (data) => alert(`Form submitted: ${JSON.stringify(data, null, 2)}`),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    fields: defaultFields,
    actions: defaultActions,
    onSubmit: (data) => alert(`Form submitted: ${JSON.stringify(data, null, 2)}`),
  },
};

export const HorizontalLayout: Story = {
  args: {
    layout: 'horizontal',
    fields: defaultFields.slice(0, 3),
    actions: defaultActions,
    onSubmit: (data) => alert(`Form submitted: ${JSON.stringify(data, null, 2)}`),
  },
};

export const GridLayout: Story = {
  args: {
    layout: 'grid',
    fields: defaultFields.slice(0, 4),
    actions: defaultActions,
    onSubmit: (data) => alert(`Form submitted: ${JSON.stringify(data, null, 2)}`),
  },
};

export const LoadingState: Story = {
  args: {
    fields: defaultFields,
    actions: defaultActions,
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    fields: defaultFields,
    actions: defaultActions,
    error: 'Please correct the errors in the form.',
  },
};

export const WithSuccess: Story = {
  args: {
    fields: defaultFields,
    actions: defaultActions,
    success: 'Your information has been saved successfully!',
  },
};

export const CustomField: Story = {
  args: {
    fields: [
      { name: 'username', label: 'Username', type: 'text', required: true },
      { name: 'customInput', label: 'Custom Input', type: 'custom', render: (props) => (
        <div style={{ border: '1px dashed gray', padding: '1rem' }}>
          <label htmlFor="custom-field">{props.label}</label>
          <input id="custom-field" type="text" {...props} style={{ width: '100%', padding: '0.5rem' }} />
          {props.helperText && <p style={{ color: 'red' }}>{props.helperText}</p>}
        </div>
      ) },
    ],
    actions: defaultActions,
    onSubmit: (data) => alert(`Form submitted: ${JSON.stringify(data, null, 2)}`),
  },
};
