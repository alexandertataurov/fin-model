import type { Meta, StoryObj } from '@storybook/react';
import { EmailVerification } from './EmailVerification';

const meta: Meta<typeof EmailVerification> = {
  title: 'Components/EmailVerification',
  component: EmailVerification,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const Loading: Story = { parameters: { docs: { description: { story: 'No data state.' } } } };
export const Empty: Story = { parameters: { docs: { description: { story: 'No data state.' } } } };
export const Error: Story = { parameters: { docs: { description: { story: 'Error state.' } } } };
