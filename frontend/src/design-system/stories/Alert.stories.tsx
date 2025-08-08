import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '../components/Alert';

const meta: Meta<typeof Alert> = {
  title: 'Design System/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  render: () => (
    <Alert className="max-w-md">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can use this alert component to show contextual feedback.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert className="border-destructive/50 text-destructive max-w-md">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        There was a problem with your request. Please try again.
      </AlertDescription>
    </Alert>
  ),
};
