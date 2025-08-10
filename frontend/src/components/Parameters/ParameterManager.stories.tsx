import type { Meta, StoryObj } from '@storybook/react';
import ParameterManager from './ParameterManager';

const meta: Meta<typeof ParameterManager> = {
  title: 'Components/Parameters/ParameterManager',
  component: ParameterManager,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Comprehensive parameter management component for financial modeling.',
      },
    },
  },
  argTypes: {
    autoSave: {
      control: { type: 'boolean' },
      description: 'Whether to auto-save parameter changes',
    },
    validationMode: {
      control: { type: 'select' },
      options: ['strict', 'warn', 'none'],
      description: 'Validation mode for parameter inputs',
    },
    showAdvancedOptions: {
      control: { type: 'boolean' },
      description: 'Whether to show advanced parameter options',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    autoSave: true,
    validationMode: 'warn',
    showAdvancedOptions: false,
  },
};

export const StrictValidation: Story = {
  args: {
    autoSave: false,
    validationMode: 'strict',
    showAdvancedOptions: true,
  },
};

export const AdvancedMode: Story = {
  args: {
    autoSave: true,
    validationMode: 'none',
    showAdvancedOptions: true,
  },
};
