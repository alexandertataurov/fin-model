import React from "react";
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
      control: { type: 'text' },
      description: 'Loading message to display',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the loading spinner',
    },
    showSpinner: {
      control: { type: 'boolean' },
      description: 'Whether to show the loading spinner',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Loading...',
    size: 'md',
    showSpinner: true,
  },
};

export const LoadingParameters: Story = {
  args: {
    message: 'Loading parameters...',
    size: 'md',
    showSpinner: true,
  },
};

export const LoadingData: Story = {
  args: {
    message: 'Loading financial data...',
    size: 'md',
    showSpinner: true,
  },
};

export const Processing: Story = {
  args: {
    message: 'Processing calculations...',
    size: 'md',
    showSpinner: true,
  },
};

export const SmallSpinner: Story = {
  args: {
    message: 'Loading...',
    size: 'sm',
    showSpinner: true,
  },
};

export const LargeSpinner: Story = {
  args: {
    message: 'Loading financial model...',
    size: 'lg',
    showSpinner: true,
  },
};

export const NoSpinner: Story = {
  args: {
    message: 'Please wait...',
    size: 'md',
    showSpinner: false,
  },
};

export const FinancialCalculation: Story = {
  args: {
    message: 'Calculating DCF valuation...',
    size: 'md',
    showSpinner: true,
  },
};

export const MonteCarloSimulation: Story = {
  args: {
    message: 'Running Monte Carlo simulation (10,000 iterations)...',
    size: 'lg',
    showSpinner: true,
  },
};
