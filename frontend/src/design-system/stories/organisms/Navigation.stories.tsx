import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Navigation, NavigationItem, NavigationGroup } from '../../organisms/Navigation/Navigation';

const meta: Meta<typeof Navigation> = {
  title: 'Organisms / Navigation',
  component: Navigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical', 'tabs', 'pills'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    children: (
      <>
        <NavigationItem href="/" active icon="home">
          Home
        </NavigationItem>
        <NavigationItem href="/docs" icon="file-text">
          Documentation
        </NavigationItem>
        <NavigationItem href="/settings" icon="settings">
          Settings
        </NavigationItem>
        <NavigationItem href="/profile" icon="user">
          Profile
        </NavigationItem>
      </>
    ),
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    children: (
      <>
        <NavigationItem href="/" active icon="home">
          Home
        </NavigationItem>
        <NavigationItem href="/docs" icon="file-text">
          Documentation
        </NavigationItem>
        <NavigationItem href="/settings" icon="settings">
          Settings
        </NavigationItem>
        <NavigationItem href="/profile" icon="user">
          Profile
        </NavigationItem>
      </>
    ),
  },
};

export const Tabs: Story = {
  args: {
    variant: 'tabs',
    children: (
      <>
        <NavigationItem href="/overview" active>
          Overview
        </NavigationItem>
        <NavigationItem href="/analytics">Analytics</NavigationItem>
        <NavigationItem href="/reports">Reports</NavigationItem>
        <NavigationItem href="/settings">Settings</NavigationItem>
      </>
    ),
  },
};

export const Pills: Story = {
  args: {
    variant: 'pills',
    children: (
      <>
        <NavigationItem href="/all" active>
          All
        </NavigationItem>
        <NavigationItem href="/active">Active</NavigationItem>
        <NavigationItem href="/archived">Archived</NavigationItem>
        <NavigationItem href="/deleted">Deleted</NavigationItem>
      </>
    ),
  },
};

export const WithBadges: Story = {
  args: {
    children: (
      <>
        <NavigationItem href="/" active icon="home">
          Home
        </NavigationItem>
        <NavigationItem href="/notifications" badge="3" icon="bell">
          Notifications
        </NavigationItem>
        <NavigationItem href="/messages" badge="12" icon="mail">
          Messages
        </NavigationItem>
        <NavigationItem href="/settings" icon="settings">
          Settings
        </NavigationItem>
      </>
    ),
  },
};

export const WithGroups: Story = {
  args: {
    orientation: 'vertical',
    children: (
      <>
        <NavigationGroup title="Main">
          <NavigationItem href="/" active icon="home">
            Home
          </NavigationItem>
          <NavigationItem href="/docs" icon="file-text">
            Documentation
          </NavigationItem>
        </NavigationGroup>
        <NavigationGroup title="Account">
          <NavigationItem href="/profile" icon="user">
            Profile
          </NavigationItem>
          <NavigationItem href="/settings" icon="settings">
            Settings
          </NavigationItem>
        </NavigationGroup>
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: (
      <>
        <NavigationItem href="/" active icon="home">
          Home
        </NavigationItem>
        <NavigationItem href="/docs" icon="file-text">
          Docs
        </NavigationItem>
        <NavigationItem href="/settings" icon="settings">
          Settings
        </NavigationItem>
      </>
    ),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        <NavigationItem href="/" active icon="home">
          Home
        </NavigationItem>
        <NavigationItem href="/docs" icon="file-text">
          Documentation
        </NavigationItem>
        <NavigationItem href="/settings" icon="settings">
          Settings
        </NavigationItem>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    children: (
      <>
        <NavigationItem href="/" active icon="home">
          Home
        </NavigationItem>
        <NavigationItem href="/docs" icon="file-text">
          Documentation
        </NavigationItem>
        <NavigationItem href="/settings" disabled icon="settings">
          Settings
        </NavigationItem>
        <NavigationItem href="/profile" disabled icon="user">
          Profile
        </NavigationItem>
      </>
    ),
  },
};

export const IconsOnly: Story = {
  args: {
    children: (
      <>
        <NavigationItem href="/" active title="Home" icon="home" />
        <NavigationItem href="/docs" title="Documentation" icon="file-text" />
        <NavigationItem href="/settings" title="Settings" icon="settings" />
        <NavigationItem href="/profile" title="Profile" icon="user" />
      </>
    ),
  },
};