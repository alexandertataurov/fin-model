import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '../../molecules/InputOTP/InputOTP';

const meta: Meta<typeof InputOTP> = {
  title: '3 - Molecules/InputOTP',
  component: InputOTP,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A one-time password (OTP) input component.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'The current OTP value.',
    },
    onChange: {
      action: 'value changed',
      description: 'Callback when the OTP value changes.',
    },
    length: {
      control: 'number',
      description: 'The number of OTP digits.',
    },
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'ghost'],
      description: 'Visual variant of the input OTP.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input OTP.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input OTP is disabled.',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input OTP has an error state.',
    },
    separator: {
      control: 'text',
      description: 'Separator character between digits.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder character for empty slots.',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Whether to auto-focus the first slot.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return <InputOTP {...args} value={value} onChange={setValue} />;
  },
  args: {
    length: 6,
  },
};

export const WithSeparator: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return <InputOTP {...args} value={value} onChange={setValue} />;
  },
  args: {
    length: 6,
    separator: '-',
  },
};

export const WithCustomPlaceholder: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return <InputOTP {...args} value={value} onChange={setValue} />;
  },
  args: {
    length: 4,
    placeholder: '*',
  },
};

export const Disabled: Story = {
  render: args => {
    const [value, setValue] = useState('1234');
    return <InputOTP {...args} value={value} onChange={setValue} />;
  },
  args: {
    length: 4,
    disabled: true,
  },
};

export const WithError: Story = {
  render: args => {
    const [value, setValue] = useState('123');
    return <InputOTP {...args} value={value} onChange={setValue} />;
  },
  args: {
    length: 4,
    error: true,
  },
};

export const SmallSize: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return <InputOTP {...args} value={value} onChange={setValue} />;
  },
  args: {
    length: 4,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return <InputOTP {...args} value={value} onChange={setValue} />;
  },
  args: {
    length: 4,
    size: 'lg',
  },
};

export const FilledVariant: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return <InputOTP {...args} value={value} onChange={setValue} />;
  },
  args: {
    length: 4,
    variant: 'filled',
  },
};

export const GhostVariant: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return <InputOTP {...args} value={value} onChange={setValue} />;
  },
  args: {
    length: 4,
    variant: 'ghost',
  },
};

export const WithGroupedSlots: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return (
      <InputOTP {...args} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    );
  },
  args: {
    length: 6,
    separator: '', // Separator is handled by InputOTPSeparator component
  },
};
