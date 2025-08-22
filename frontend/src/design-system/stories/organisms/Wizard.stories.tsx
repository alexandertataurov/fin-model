import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Wizard } from '../../organisms/Wizard/Wizard';
import { Form } from '../../organisms/Form';

const meta: Meta<typeof Wizard> = {
  title: 'Organisms / Wizard',
  component: Wizard,
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
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    showProgress: {
      control: { type: 'boolean' },
    },
    showStepNumbers: {
      control: { type: 'boolean' },
    },
    allowStepNavigation: {
      control: { type: 'boolean' },
    },
    currentStep: {
      control: { type: 'number', min: 0 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultSteps = [
  {
    title: 'Personal Information',
    description: 'Provide your basic personal details.',
    icon: 'user',
    content: ({ data, onChange, onValidation }) => (
      <Form
        fields={[
          { name: 'firstName', label: 'First Name', type: 'text', required: true },
          { name: 'lastName', label: 'Last Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true, validation: (value) => (!value.includes('@') ? 'Invalid email' : null) },
        ]}
        onSubmit={(formData) => {
          onChange(formData);
          onValidation([]);
        }}
        onReset={() => {}}
      />
    ),
  },
  {
    title: 'Address Details',
    description: 'Enter your current residential address.',
    icon: 'map-pin',
    content: ({ data, onChange, onValidation }) => (
      <Form
        fields={[
          { name: 'address1', label: 'Address Line 1', type: 'text', required: true },
          { name: 'city', label: 'City', type: 'text', required: true },
          { name: 'zipCode', label: 'Zip Code', type: 'text', required: true },
        ]}
        onSubmit={(formData) => {
          onChange(formData);
          onValidation([]);
        }}
        onReset={() => {}}
      />
    ),
  },
  {
    title: 'Payment Information',
    description: 'Provide your payment method details.',
    icon: 'credit-card',
    content: ({ data, onChange, onValidation }) => (
      <Form
        fields={[
          { name: 'cardNumber', label: 'Card Number', type: 'text', required: true, validation: (value) => (value.length !== 16 ? 'Card number must be 16 digits' : null) },
          { name: 'expiryDate', label: 'Expiry Date', type: 'text', placeholder: 'MM/YY', required: true },
          { name: 'cvv', label: 'CVV', type: 'text', required: true, validation: (value) => (value.length !== 3 && value.length !== 4 ? 'CVV must be 3 or 4 digits' : null) },
        ]}
        onSubmit={(formData) => {
          onChange(formData);
          onValidation([]);
        }}
        onReset={() => {}}
      />
    ),
  },
  {
    title: 'Review and Confirm',
    description: 'Review all the information before submitting.',
    icon: 'check-circle',
    content: ({ data }) => (
      <div style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
        <h3>Summary:</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 0,
    onStepChange: (step) => console.log('Current step:', step),
    onComplete: (data) => alert(`Wizard completed! Data: ${JSON.stringify(data, null, 2)}`),
    onCancel: () => alert('Wizard cancelled!'),
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    steps: defaultSteps,
    currentStep: 0,
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    steps: defaultSteps,
    currentStep: 0,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    steps: defaultSteps,
    currentStep: 0,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    steps: defaultSteps,
    currentStep: 0,
  },
};

export const NoProgress: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 0,
    showProgress: false,
  },
};

export const NoStepNumbers: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 0,
    showStepNumbers: false,
  },
};

export const NoStepNavigation: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 0,
    allowStepNavigation: false,
  },
};

export const StartAtMiddleStep: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 1,
  },
};

export const CompletedWizard: Story = {
  args: {
    steps: defaultSteps,
    currentStep: defaultSteps.length - 1,
  },
};
