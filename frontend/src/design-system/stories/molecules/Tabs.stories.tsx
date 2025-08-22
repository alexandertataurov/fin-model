import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../molecules/Tabs/Tabs';

const meta: Meta<typeof Tabs> = {
  title: '3 - Molecules/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A set of layered content panels, with only one panel visible at a time.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'The currently selected tab.',
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback when the selected tab changes.',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the tabs.',
    },
    activationMode: {
      control: 'select',
      options: ['automatic', 'manual'],
      description: 'Activation mode for tabs.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState('account');
    return (
      <Tabs
        {...args}
        value={value}
        onValueChange={setValue}
        className="w-[400px]"
      >
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-2 p-4 border rounded">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password" className="mt-2 p-4 border rounded">
          Change your password here.
        </TabsContent>
        <TabsContent value="notifications" className="mt-2 p-4 border rounded">
          Manage your notification settings.
        </TabsContent>
      </Tabs>
    );
  },
  args: {},
};

export const VerticalTabs: Story = {
  render: args => {
    const [value, setValue] = useState('profile');
    return (
      <Tabs
        {...args}
        value={value}
        onValueChange={setValue}
        orientation="vertical"
        className="h-[200px]"
      >
        <TabsList className="flex-col h-full">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="ml-2 p-4 border rounded">
          View and edit your profile information.
        </TabsContent>
        <TabsContent value="settings" className="ml-2 p-4 border rounded">
          Adjust application settings.
        </TabsContent>
        <TabsContent value="privacy" className="ml-2 p-4 border rounded">
          Manage your privacy preferences.
        </TabsContent>
      </Tabs>
    );
  },
  args: {},
};

export const WithDisabledTab: Story = {
  render: args => {
    const [value, setValue] = useState('home');
    return (
      <Tabs
        {...args}
        value={value}
        onValueChange={setValue}
        className="w-[400px]"
      >
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="dashboard" disabled>
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="mt-2 p-4 border rounded">
          Welcome to the home page.
        </TabsContent>
        <TabsContent value="dashboard" className="mt-2 p-4 border rounded">
          This content is for the disabled dashboard tab.
        </TabsContent>
        <TabsContent value="reports" className="mt-2 p-4 border rounded">
          Access your reports here.
        </TabsContent>
      </Tabs>
    );
  },
  args: {},
};

export const ManualActivation: Story = {
  render: args => {
    const [value, setValue] = useState('tab1');
    return (
      <Tabs
        {...args}
        value={value}
        onValueChange={setValue}
        activationMode="manual"
        className="w-[400px]"
      >
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="mt-2 p-4 border rounded">
          Click to activate this tab.
        </TabsContent>
        <TabsContent value="tab2" className="mt-2 p-4 border rounded">
          Click to activate this tab.
        </TabsContent>
        <TabsContent value="tab3" className="mt-2 p-4 border rounded">
          Click to activate this tab.
        </TabsContent>
      </Tabs>
    );
  },
  args: {},
};
