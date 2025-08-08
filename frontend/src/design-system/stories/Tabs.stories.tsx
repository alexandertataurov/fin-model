import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Design System/Tabs',
  component: Tabs,
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account content here</TabsContent>
      <TabsContent value="password">Password content here</TabsContent>
      <TabsContent value="billing">Billing content here</TabsContent>
    </Tabs>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
