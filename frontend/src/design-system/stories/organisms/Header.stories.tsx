import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Header,
  HeaderLogo,
  HeaderNavigation,
  HeaderActions,
  HeaderMobileMenuButton,
} from '../../organisms/Header/Header';
import { Button } from '../../atoms/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../../atoms/Avatar';
import { Icon } from '../../atoms/Icon/Icon';
import {
  SectionHeader,
  AnimatedBanner,
  GuidelinesSection,
  GuidelinesCard,
  Card
} from '../components';
import { Check, AlertTriangle, Layout, Menu, Bell, User } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Header> = {
  title: 'Organisms / Header',
  component: Header,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Organism: Header"
            subtitle="A sophisticated header component for navigation, branding, and user actions. Perfect for financial applications requiring professional navigation and user management."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'elevated'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    sticky: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// STORIES
// ============================================================================

const navigationItems = [
  { label: 'Home', href: '/', icon: 'home', active: true },
  { label: 'Settings', href: '/settings', icon: 'settings' },
  { label: 'Profile', href: '/profile', icon: 'user' },
];

const DefaultChildren = (
  <>
    <HeaderLogo>MyApp</HeaderLogo>
    <HeaderNavigation items={navigationItems} />
    <HeaderActions>
                      <Button variant="ghost" size="sm">
                  <Icon name="bell" size="sm" />
                </Button>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </HeaderActions>
  </>
);

export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Header Variants"
        subtitle="Explore the different visual styles and states available for the Header component."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <Layout className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Default</h3>
          </div>
          <div className="space-y-3">
            <Header>
              {DefaultChildren}
            </Header>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Standard header</p>
              <p className="text-gray-600">With navigation and actions</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: default</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
              <Menu className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Minimal</h3>
          </div>
          <div className="space-y-3">
            <Header variant="minimal">
              <HeaderLogo>MyApp</HeaderLogo>
              <HeaderActions>
                <Button variant="outline" size="sm">Sign In</Button>
              </HeaderActions>
            </Header>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Clean design</p>
              <p className="text-gray-600">Minimal navigation</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: minimal</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Elevated</h3>
          </div>
          <div className="space-y-3">
            <Header variant="elevated">
              {DefaultChildren}
            </Header>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Prominent header</p>
              <p className="text-gray-600">With shadow and elevation</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: elevated</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {},
  render: (args) => <Header {...args}>{DefaultChildren}</Header>,
};

export const UseCases: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Common Use Cases"
        subtitle="Real-world examples of Header usage in typical UI patterns for financial applications."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <Layout className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Dashboard Header</h3>
          </div>
          <div className="space-y-3">
            <Header variant="elevated">
              <HeaderLogo>Financial Dashboard</HeaderLogo>
              <HeaderNavigation items={[
                { label: 'Overview', href: '/', icon: 'bar-chart', active: true },
                { label: 'Portfolio', href: '/portfolio', icon: 'pie-chart' },
                { label: 'Transactions', href: '/transactions', icon: 'credit-card' },
              ]} />
              <HeaderActions>
                <Button variant="ghost" size="sm">
                  <Icon name="bell" size="sm" />
                </Button>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </HeaderActions>
            </Header>
            <p className="text-xs font-mono text-gray-400 mt-2">role: dashboard-navigation</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">E-commerce Header</h3>
          </div>
          <div className="space-y-3">
            <Header variant="minimal">
              <HeaderLogo>ShopName</HeaderLogo>
              <HeaderNavigation items={[
                { label: 'Products', href: '/products', icon: 'shopping-bag' },
                { label: 'Categories', href: '/categories', icon: 'grid' },
                { label: 'Deals', href: '/deals', icon: 'tag' },
              ]} />
              <HeaderActions>
                <Button variant="ghost" size="sm">
                  <Icon name="search" size="sm" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="shopping-cart" size="sm" />
                </Button>
                <Button variant="outline" size="sm">Sign In</Button>
              </HeaderActions>
            </Header>
            <p className="text-xs font-mono text-gray-400 mt-2">role: ecommerce-navigation</p>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Usage Guidelines"
        subtitle="Guidelines for using the Header component effectively."
      />
      <Card className="p-8">
        <GuidelinesSection title="Do">
          <GuidelinesCard
            title="Do"
            variant="success"
            icon={<Check />}
            items={[
              'Use consistent navigation patterns across your application.',
              'Include clear branding and logo placement.',
              'Provide accessible navigation with proper ARIA labels.',
              'Consider mobile responsiveness with collapsible menus.',
            ]}
          />
        </GuidelinesSection>
        <GuidelinesSection title="Don't">
          <GuidelinesCard
            title="Don't"
            variant="warning"
            icon={<AlertTriangle />}
            items={[
              'Don\'t overcrowd the header with too many navigation items.',
              'Avoid inconsistent styling across different pages.',
              'Don\'t forget to handle mobile navigation properly.',
              'Avoid using header for non-navigation content.',
            ]}
          />
        </GuidelinesSection>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
            <Layout className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Interactive Header</h3>
        </div>

        <div className="mb-6">
          <Header {...args}>
            {DefaultChildren}
          </Header>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Current Variant</p>
            <p className="font-mono text-gray-600">{args.variant || 'default'}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Current Size</p>
            <p className="font-mono text-gray-600">{args.size || 'md'}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Use the controls panel on the right to experiment with different variants and sizes.
          </p>
        </div>
      </Card>
    </div>
  ),
  args: {
    variant: 'default',
    size: 'md',
    sticky: false,
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Complete Header Documentation"
        subtitle="Comprehensive guide to using the sophisticated Header component."
      />
      <Card className="p-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          🌟 Design Philosophy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Layout className="w-4 h-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">Professional Navigation</h5>
                <p className="text-sm text-gray-600">Provides clear, accessible navigation patterns for financial applications</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Menu className="w-4 h-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">Responsive Design</h5>
                <p className="text-sm text-gray-600">Adapts seamlessly across desktop, tablet, and mobile devices</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">User Actions</h5>
                <p className="text-sm text-gray-600">Centralizes user interactions and account management</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">Brand Identity</h5>
                <p className="text-sm text-gray-600">Maintains consistent branding and visual hierarchy</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  ),
};

// const MinimalChildren = (
//   <>
//     <HeaderLogo>MyApp</HeaderLogo>
//     <HeaderNavigation items={navigationItems} />
//     <HeaderActions>
//       <Button variant="outline" size="sm">Sign In</Button>
//     </HeaderActions>
//   </>
// );

// export const Minimal: Story = {
//   args: { variant: 'minimal' },
//   render: (args) => <Header {...args}>{MinimalChildren}</Header>,
// };

// const ElevatedChildren = (
//   <>
//     <HeaderLogo>MyApp</HeaderLogo>
//     <HeaderNavigation items={navigationItems} />
//     <HeaderActions>
//       <Button variant="ghost" size="sm">
//         <Icon name="bell" size={16} />
//       </Button>
//       <Avatar>
//         <AvatarImage src="https://github.com/shadcn.png" alt="User" />
//         <AvatarFallback>JD</AvatarFallback>
//       </Avatar>
//     </HeaderActions>
//   </>
// );

// export const Elevated: Story = {
//   args: { variant: 'elevated' },
//   render: (args) => <Header {...args}>{ElevatedChildren}</Header>,
// };

// const SmallChildren = (
//   <>
//     <HeaderLogo>MyApp</HeaderLogo>
//     <HeaderNavigation items={navigationItems} />
//     <HeaderActions>
//       <Button size="sm">Action</Button>
//     </HeaderActions>
//   </>
// );

// export const Small: Story = {
//   args: { size: 'sm' },
//   render: (args) => <Header {...args}>{SmallChildren}</Header>,
// };

// const LargeChildren = (
//   <>
//     <HeaderLogo>MyApp</HeaderLogo>
//     <HeaderNavigation items={navigationItems} />
//     <HeaderActions>
//       <Button size="lg">Action</Button>
//     </HeaderActions>
//   </>
// );

// export const Large: Story = {
//   args: { size: 'lg' },
//   render: (args) => <Header {...args}>{LargeChildren}</Header>,
// };

// const StickyChildren = (
//   <>
//     <HeaderLogo>MyApp</HeaderLogo>
//     <HeaderNavigation items={navigationItems} />
//     <HeaderActions>
//       <Button variant="ghost" size="sm">
//         <Icon name="bell" size={16} />
//       </Button>
//       <Avatar>
//         <AvatarImage src="https://github.com/shadcn.png" alt="User" />
//         <AvatarFallback>JD</AvatarFallback>
//       </Avatar>
//     </HeaderActions>
//   </>
// );

// const StickyRender = (args: any) => (
//   <div style={{ height: '200vh', padding: '1rem' }}>
//     <Header {...args}>{StickyChildren}</Header>
//     <div style={{ padding: '2rem' }}>
//       <h1>Scroll down to see sticky header</h1>
//       <p>This content is here to demonstrate the sticky header behavior.</p>
//       <p>Scroll down to see the header stick to the top.</p>
//     </div>
//   </div>
// );

// export const Sticky: Story = {
//   args: { sticky: true },
//   render: StickyRender,
// };

// const WithLogoChildren = (
//   <>
//     <HeaderLogo src="/logo.png" alt="Company Logo">Company Name</HeaderLogo>
//     <HeaderNavigation items={navigationItems} />
//     <HeaderActions>
//       <Button>Get Started</Button>
//     </HeaderActions>
//   </>
// );

// export const WithLogo: Story = {
//   args: {},
//   render: (args) => <Header {...args}>{WithLogoChildren}</Header>,
// };

// const MobileChildren = (
//   <>
//     <HeaderLogo>MyApp</HeaderLogo>
//     <HeaderNavigation items={navigationItems} />
//     <HeaderActions>
//       <HeaderMobileMenuButton />
//     </HeaderActions>
//   </>
// );

// export const Mobile: Story = {
//   args: {},
//   render: (args) => <Header {...args}>{MobileChildren}</Header>,
//   parameters: {
//     viewport: {
//       defaultViewport: 'mobile1',
//     },
//   },
// };

// const WithSearchChildren = (
//   <>
//     <HeaderLogo>MyApp</HeaderLogo>
//     <HeaderNavigation items={navigationItems} />
//     <HeaderActions>
//       <Button variant="ghost" size="sm">
//         <Icon name="search" size={16} />
//       </Button>
//       <Button variant="ghost" size="sm">
//         <Icon name="bell" size={16} />
//       </Button>
//       <Avatar>
//         <AvatarImage src="https://github.com/shadcn.png" alt="User" />
//         <AvatarFallback>JD</AvatarFallback>
//       </Avatar>
//     </HeaderActions>
//   </>
// );

// export const WithSearch: Story = {
//   args: {},
//   render: (args) => <Header {...args}>{WithSearchChildren}</Header>,
// };
