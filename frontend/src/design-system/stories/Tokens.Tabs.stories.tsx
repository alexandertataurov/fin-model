import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs';

const meta = {
  title: 'Design System/Tabs',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account content</TabsContent>
      <TabsContent value="password">Password content</TabsContent>
    </Tabs>
  ),
};
