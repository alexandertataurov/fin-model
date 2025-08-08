import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '../components/Alert';

const meta: Meta<typeof Alert> = {
  title: 'Design System/Alert',
  component: Alert,
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'centered' },
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

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
