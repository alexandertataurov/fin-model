import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from './Dashboard';
import {
  Header,
  HeaderLogo,
  HeaderNavigation,
  HeaderActions,
} from '../../organisms/Header';
import {
  Navigation,
  NavigationItem,
  NavigationGroup,
} from '../../organisms/Navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '../../molecules/Breadcrumb';
import {
  Home,
  Settings,
  User,
  FileText,
  Bell,
  Mail,
  BarChart3,
  Users,
  Database,
} from 'lucide-react';

const meta: Meta<typeof Dashboard> = {
  title: 'Templates / Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    sidebarCollapsed: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home size={16} />,
    active: true,
  },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 size={16} /> },
  { label: 'Users', href: '/users', icon: <Users size={16} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={16} /> },
];

const sidebarNavigationItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: <Home size={16} />,
    active: true,
  },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 size={16} /> },
  { label: 'Users', href: '/users', icon: <Users size={16} /> },
  { label: 'Database', href: '/database', icon: <Database size={16} /> },
  { label: 'Documents', href: '/documents', icon: <FileText size={16} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={16} /> },
  { label: 'Profile', href: '/profile', icon: <User size={16} /> },
];

export const Default: Story = {
  args: {
    header: (
      <Header>
        <HeaderLogo>MyApp</HeaderLogo>
        <HeaderNavigation items={navigationItems} />
        <HeaderActions>
          <Bell size={16} />
          <Mail size={16} />
        </HeaderActions>
      </Header>
    ),
    sidebar: (
      <Navigation orientation="vertical">
        <NavigationGroup title="Main">
          {sidebarNavigationItems.map(item => (
            <NavigationItem
              key={item.href}
              href={item.href}
              active={item.active}
            >
              {item.icon}
              {item.label}
            </NavigationItem>
          ))}
        </NavigationGroup>
      </Navigation>
    ),
    breadcrumb: (
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            <Home size={16} />
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/overview" current>
            Overview
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    ),
    children: (
      <div>
        <h1>Dashboard Overview</h1>
        <p>This is a dashboard layout optimized for data-heavy applications.</p>
        <p>
          It includes a header, sidebar navigation, breadcrumbs, and main
          content area.
        </p>
      </div>
    ),
  },
};

export const CollapsedSidebar: Story = {
  args: {
    header: (
      <Header>
        <HeaderLogo>MyApp</HeaderLogo>
        <HeaderNavigation items={navigationItems} />
        <HeaderActions>
          <Bell size={16} />
          <Mail size={16} />
        </HeaderActions>
      </Header>
    ),
    sidebar: (
      <Navigation orientation="vertical">
        <NavigationGroup title="Main">
          {sidebarNavigationItems.map(item => (
            <NavigationItem
              key={item.href}
              href={item.href}
              active={item.active}
            >
              {item.icon}
              {item.label}
            </NavigationItem>
          ))}
        </NavigationGroup>
      </Navigation>
    ),
    sidebarCollapsed: true,
    breadcrumb: (
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            <Home size={16} />
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/analytics" current>
            Analytics
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    ),
    children: (
      <div>
        <h1>Analytics Dashboard</h1>
        <p>This dashboard has a collapsed sidebar showing only icons.</p>
        <p>The sidebar can be expanded to show full navigation labels.</p>
      </div>
    ),
  },
};

export const NoSidebar: Story = {
  args: {
    header: (
      <Header>
        <HeaderLogo>MyApp</HeaderLogo>
        <HeaderNavigation items={navigationItems} />
        <HeaderActions>
          <Bell size={16} />
          <Mail size={16} />
        </HeaderActions>
      </Header>
    ),
    breadcrumb: (
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            <Home size={16} />
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/settings" current>
            Settings
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    ),
    children: (
      <div>
        <h1>Settings</h1>
        <p>
          This dashboard layout has no sidebar, providing more space for
          content.
        </p>
        <p>Useful for focused pages that don't need extensive navigation.</p>
      </div>
    ),
  },
};

export const NoBreadcrumb: Story = {
  args: {
    header: (
      <Header>
        <HeaderLogo>MyApp</HeaderLogo>
        <HeaderNavigation items={navigationItems} />
        <HeaderActions>
          <Bell size={16} />
          <Mail size={16} />
        </HeaderActions>
      </Header>
    ),
    sidebar: (
      <Navigation orientation="vertical">
        <NavigationGroup title="Main">
          {sidebarNavigationItems.map(item => (
            <NavigationItem
              key={item.href}
              href={item.href}
              active={item.active}
            >
              {item.icon}
              {item.label}
            </NavigationItem>
          ))}
        </NavigationGroup>
      </Navigation>
    ),
    children: (
      <div>
        <h1>Welcome to Dashboard</h1>
        <p>This dashboard layout has no breadcrumb navigation.</p>
        <p>Useful for landing pages or overview screens.</p>
      </div>
    ),
  },
};

export const NoHeader: Story = {
  args: {
    sidebar: (
      <Navigation orientation="vertical">
        <NavigationGroup title="Main">
          {sidebarNavigationItems.map(item => (
            <NavigationItem
              key={item.href}
              href={item.href}
              active={item.active}
            >
              {item.icon}
              {item.label}
            </NavigationItem>
          ))}
        </NavigationGroup>
      </Navigation>
    ),
    breadcrumb: (
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            <Home size={16} />
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/profile" current>
            Profile
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    ),
    children: (
      <div>
        <h1>User Profile</h1>
        <p>
          This dashboard layout has no header, providing a cleaner interface.
        </p>
        <p>Useful for embedded applications or focused user experiences.</p>
      </div>
    ),
  },
};

export const ContentOnly: Story = {
  args: {
    children: (
      <div>
        <h1>Content Only Dashboard</h1>
        <p>This dashboard layout has no header, sidebar, or breadcrumb.</p>
        <p>Useful for modal content, embedded applications, or simple pages.</p>
      </div>
    ),
  },
};
