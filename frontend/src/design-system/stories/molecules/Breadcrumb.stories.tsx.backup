import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '../../molecules/Breadcrumb/Breadcrumb';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle, ChevronRight, Home } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Molecules / Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A breadcrumb navigation component that indicates the current page’s location within a navigational hierarchy.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the breadcrumb items.',
    },
    separator: {
      control: 'text',
      description: 'Custom separator between breadcrumb items.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================ // STORIES // ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Breadcrumb Variants"
        subtitle="Different breadcrumb configurations and navigation patterns."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Breadcrumb</h4>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem current>
              <BreadcrumbLink href="/products/electronics">Electronics</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Small Size</h4>
          <Breadcrumb size="sm">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem current>
              <BreadcrumbLink href="/about">About</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Large Size</h4>
          <Breadcrumb size="lg">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem current>
              <BreadcrumbLink href="/profile">Profile</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Custom Separator</h4>
          <Breadcrumb separator=">">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem current>
              <BreadcrumbLink href="/web-design">Web Design</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Deep Navigation</h4>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users/123">User Details</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem current>
              <BreadcrumbLink href="/admin/users/123/edit">Edit</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">E-commerce</h4>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Store</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/category/electronics">Electronics</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/category/electronics/computers">Computers</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem current>
              <BreadcrumbLink href="/product/laptop-123">Laptop Pro</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Card>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    children: (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/products/electronics">
            Electronics
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem current>
          <BreadcrumbLink href="/products/electronics/laptops">
            Laptops
          </BreadcrumbLink>
        </BreadcrumbItem>
      </>
    ),
  },
};

export const SmallSize: Story = {
  args: {
    size: 'sm',
    children: (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem current>
          <BreadcrumbLink href="/about">About Us</BreadcrumbLink>
        </BreadcrumbItem>
      </>
    ),
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/settings">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem current>
          <BreadcrumbLink href="/dashboard/settings/profile">
            Profile
          </BreadcrumbLink>
        </BreadcrumbItem>
      </>
    ),
  },
};

export const CustomSeparator: Story = {
  args: {
    separator: '>',
    children: (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/services">Services</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem current>
          <BreadcrumbLink href="/services/web-design">
            Web Design
          </BreadcrumbLink>
        </BreadcrumbItem>
      </>
    ),
  },
};

export const WithLongTitles: Story = {
  args: {
    children: (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            This is a very long home page title
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/category">
            A category with an equally long name
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem current>
          <BreadcrumbLink href="/item">
            The current item also has a very descriptive and lengthy title
          </BreadcrumbLink>
        </BreadcrumbItem>
      </>
    ),
  },
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <GuidelinesSection title="Usage Guidelines">
        <GuidelinesCard
          title="Do"
          variant="success"
          icon={<Check />}
          items={[
            'Use breadcrumbs for <strong>hierarchical navigation</strong> with 2+ levels.',
            'Start with the <strong>home page</strong> and show the current location.',
            'Keep breadcrumb labels <strong>short and descriptive</strong>.',
            'Use the <strong>current</strong> prop for the active page.',
          ]}
        />
        <GuidelinesCard
          title="Don't"
          variant="warning"
          icon={<AlertTriangle />}
          items={[
            'Don\'t use breadcrumbs for single-level navigation.',
            'Avoid using breadcrumbs as the primary navigation method.',
            'Don\'t include too many levels (max 4-5 recommended).',
          ]}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Use proper ARIA labels and navigation landmarks.',
          'Ensure keyboard navigation works with Tab and Enter keys.',
          'Provide clear, descriptive link text for screen readers.',
          'Use semantic HTML structure for better accessibility.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    size: 'md',
    separator: '/',
  },
  render: args => {
    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Breadcrumb"
          subtitle="Experiment with different breadcrumb configurations using the controls."
        />

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Breadcrumb Preview</h3>
            <Breadcrumb size={args.size} separator={args.separator}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/products/electronics">Electronics</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem current>
                <BreadcrumbLink href="/products/electronics/laptops">Laptops</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Size: {args.size}</li>
                <li>Separator: "{args.separator}"</li>
              </ul>

              <h4 className="font-medium text-gray-900 mb-2 mt-4">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• E-commerce product pages</li>
                <li>• Documentation sites</li>
                <li>• Admin dashboards</li>
                <li>• File system navigation</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Real-world Examples:</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">E-commerce:</p>
                  <Breadcrumb size="sm" separator=">">
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Store</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem current>
                      <BreadcrumbLink href="/category">Electronics</BreadcrumbLink>
                    </BreadcrumbItem>
                  </Breadcrumb>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Admin Panel:</p>
                  <Breadcrumb size="sm">
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem current>
                      <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
                    </BreadcrumbItem>
                  </Breadcrumb>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive breadcrumb with configurable props. Use the controls to experiment with different breadcrumb configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Breadcrumb Documentation"
        subtitle="Comprehensive guide to using the Breadcrumb component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Use <code>size</code> to control the visual size: sm, md, lg.
          </li>
          <li>
            Set <code>separator</code> to customize the separator between items.
          </li>
          <li>
            Use <code>current</code> prop on the last item to indicate the active page.
          </li>
          <li>
            Keep breadcrumb labels short and descriptive for better UX.
          </li>
          <li>
            Ensure proper ARIA attributes and keyboard navigation support.
          </li>
        </ul>
      </div>
    </div>
  ),
};
