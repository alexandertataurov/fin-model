import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BaseLayout } from './BaseLayout';
import {
  Header,
  HeaderLogo,
  HeaderNavigation,
  HeaderActions,
} from '../../organisms/Header';
import {
  Footer,
  FooterContent,
  FooterBrand,
  FooterLinks,
  FooterBottom,
} from '../../organisms/Footer';
import {
  Navigation,
  NavigationItem,
  NavigationGroup,
} from '../../organisms/Navigation';
import { Home, Settings, User, FileText, Bell, Mail } from 'lucide-react';

const meta: Meta<typeof BaseLayout> = {
  title: 'Templates / BaseLayout',
  component: BaseLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'dashboard', 'landing'],
    },
    sidebarCollapsed: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const navigationItems = [
  { label: 'Home', href: '/', icon: <Home size={16} />, active: true },
  { label: 'Settings', href: '/settings', icon: <Settings size={16} /> },
  { label: 'Profile', href: '/profile', icon: <User size={16} /> },
];

const sidebarNavigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home size={16} />,
    active: true,
  },
  { label: 'Documents', href: '/documents', icon: <FileText size={16} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={16} /> },
  { label: 'Profile', href: '/profile', icon: <User size={16} /> },
];

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
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
    children: (
      <div>
        <h1>Welcome to MyApp</h1>
        <p>This is the main content area of the application.</p>
        <p>You can put any content here.</p>
      </div>
    ),
    footer: (
      <Footer>
        <FooterContent>
          <FooterBrand>
            <h2>MyApp</h2>
            <p>Building the future of web applications.</p>
          </FooterBrand>
          <FooterLinks title="Links" links={footerLinks} />
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp. All rights reserved." />
      </Footer>
    ),
  },
};

export const WithSidebar: Story = {
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
        <h1>Dashboard</h1>
        <p>This is a dashboard layout with a sidebar navigation.</p>
        <p>The sidebar can be collapsed and expanded.</p>
      </div>
    ),
    footer: (
      <Footer>
        <FooterContent>
          <FooterBrand>
            <h2>MyApp</h2>
            <p>Building the future of web applications.</p>
          </FooterBrand>
          <FooterLinks title="Links" links={footerLinks} />
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp. All rights reserved." />
      </Footer>
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
    children: (
      <div>
        <h1>Dashboard</h1>
        <p>This is a dashboard layout with a collapsed sidebar.</p>
        <p>The sidebar shows only icons when collapsed.</p>
      </div>
    ),
    footer: (
      <Footer>
        <FooterContent>
          <FooterBrand>
            <h2>MyApp</h2>
            <p>Building the future of web applications.</p>
          </FooterBrand>
          <FooterLinks title="Links" links={footerLinks} />
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp. All rights reserved." />
      </Footer>
    ),
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    header: (
      <Header variant="minimal">
        <HeaderLogo>MyApp</HeaderLogo>
        <HeaderActions>
          <button>Sign In</button>
        </HeaderActions>
      </Header>
    ),
    children: (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h1>Welcome to MyApp</h1>
        <p>
          This is a minimal layout for landing pages and simple applications.
        </p>
        <p>It has a clean, focused design.</p>
      </div>
    ),
    footer: (
      <Footer variant="minimal">
        <FooterContent>
          <FooterBrand>
            <h2>MyApp</h2>
            <p>Building the future of web applications.</p>
          </FooterBrand>
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp." />
      </Footer>
    ),
  },
};

export const Dashboard: Story = {
  args: {
    variant: 'dashboard',
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
        <h1>Dashboard</h1>
        <p>This is a dashboard layout optimized for data-heavy applications.</p>
        <p>
          It has a muted background and is designed for long viewing sessions.
        </p>
      </div>
    ),
    footer: (
      <Footer>
        <FooterContent>
          <FooterBrand>
            <h2>MyApp</h2>
            <p>Building the future of web applications.</p>
          </FooterBrand>
          <FooterLinks title="Links" links={footerLinks} />
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp. All rights reserved." />
      </Footer>
    ),
  },
};

export const Landing: Story = {
  args: {
    variant: 'landing',
    header: (
      <Header variant="minimal">
        <HeaderLogo>MyApp</HeaderLogo>
        <HeaderActions>
          <button>Get Started</button>
        </HeaderActions>
      </Header>
    ),
    children: (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <h1>Welcome to MyApp</h1>
        <p>
          This is a landing page layout designed for marketing and product
          pages.
        </p>
        <p>It has a clean, modern design focused on conversion.</p>
      </div>
    ),
    footer: (
      <Footer>
        <FooterContent>
          <FooterBrand>
            <h2>MyApp</h2>
            <p>Building the future of web applications.</p>
          </FooterBrand>
          <FooterLinks title="Product" links={footerLinks} />
          <FooterLinks title="Company" links={footerLinks} />
        </FooterContent>
        <FooterBottom copyright="© 2024 MyApp. All rights reserved." />
      </Footer>
    ),
  },
};

export const NoHeader: Story = {
  args: {
    children: (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h1>Content Only</h1>
        <p>This layout has no header or footer, just the main content area.</p>
        <p>Useful for modal content or embedded applications.</p>
      </div>
    ),
  },
};

export const NoFooter: Story = {
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
    children: (
      <div>
        <h1>No Footer Layout</h1>
        <p>This layout has a header but no footer.</p>
        <p>Useful for applications where the footer is not needed.</p>
      </div>
    ),
  },
};
