import type { Meta, StoryObj } from '@storybook/react';
import LoadingState from './LoadingState';

const meta: Meta<typeof LoadingState> = {
  title: 'Parameters/LoadingState',
  component: LoadingState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Simple loading state component with customizable message.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const Default: Story = {
  args: {
    message: 'Loading...',
  },
};

export const LoadingParameters: Story = {
  args: {
    message: 'Loading parameters...',
  },
};

export const LoadingData: Story = {
  args: {
    message: 'Loading financial data...',
  },
};

export const Processing: Story = {
  args: {
    message: 'Processing calculations...',
  },
};
