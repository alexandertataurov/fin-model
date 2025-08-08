import type { Meta, StoryObj } from '@storybook/react';
import AuthGuard from './AuthGuard';

const meta: Meta<typeof AuthGuard> = {
  title: 'Components/Auth/AuthGuard',
  component: AuthGuard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Protected content',
  },
};
