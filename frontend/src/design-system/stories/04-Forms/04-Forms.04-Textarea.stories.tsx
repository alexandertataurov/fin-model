import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../../components/Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Design System/4 - Forms/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the textarea is disabled',
    },
    rows: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      description: 'Number of visible rows',
    },
    maxLength: {
      control: { type: 'number', min: 0, max: 10000, step: 100 },
      description: 'Maximum character length',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your text here',
    rows: 4,
  },
};

export const Basic: Story = {
  render: () => (
    <Textarea placeholder="Type your message here" className="w-80" />
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
    value: 'This textarea is disabled',
  },
};

export const WithMaxLength: Story = {
  args: {
    placeholder: 'Enter text (max 100 characters)',
    maxLength: 100,
    rows: 3,
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large textarea for longer content',
    rows: 8,
    className: 'w-96',
  },
};
