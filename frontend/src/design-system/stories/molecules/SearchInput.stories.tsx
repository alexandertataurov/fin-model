import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchInput } from '../../molecules/SearchInput/SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: '3 - Molecules/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A search input component with integrated search and clear buttons, and loading state.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input.',
    },
    value: {
      control: 'text',
      description: 'The current value of the input.',
    },
    onChange: {
      action: 'value changed',
      description: 'Callback when the input value changes.',
    },
    onSearch: {
      action: 'search triggered',
      description:
        'Callback when the search button is clicked or Enter is pressed.',
    },
    onClear: {
      action: 'clear triggered',
      description: 'Callback when the clear button is clicked.',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the search input is in a loading state.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the search input is disabled.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the search input.',
    },
    clearable: {
      control: 'boolean',
      description: 'Whether the clear button is shown when there is input.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return <SearchInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    placeholder: 'Search...',
  },
};

export const WithInitialValue: Story = {
  render: args => {
    const [value, setValue] = useState('initial search term');
    return <SearchInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    placeholder: 'Search...',
  },
};

export const LoadingState: Story = {
  render: args => {
    const [value, setValue] = useState('loading...');
    return <SearchInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    loading: true,
    placeholder: 'Searching...',
  },
};

export const Disabled: Story = {
  render: args => {
    const [value, setValue] = useState('disabled');
    return <SearchInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    disabled: true,
    placeholder: 'Search disabled',
  },
};

export const SmallSize: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return <SearchInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    size: 'sm',
    placeholder: 'Small search',
  },
};

export const LargeSize: Story = {
  render: args => {
    const [value, setValue] = useState('');
    return <SearchInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    size: 'lg',
    placeholder: 'Large search',
  },
};

export const NonClearable: Story = {
  render: args => {
    const [value, setValue] = useState('cannot clear');
    return <SearchInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    clearable: false,
    placeholder: 'Non-clearable',
  },
};
