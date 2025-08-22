import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from '../../atoms';
import {
  SectionHeader,
  AnimatedBanner,
  GuidelinesSection,
  GuidelinesCard,
  ColorPalette,
  SemanticColor,
  SurfaceColor,
  InteractiveState,
  FormField,
  StatusIndicator,
  Notification,
  DashboardHeader,
  MetricCard,
  QuickActions,
  PhilosophyItem,
  Card
} from '../components';
import { Check, AlertTriangle, User, Users, UserCheck, UserX } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Avatar> = {
  title: '2 - Atoms / Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Avatar"
            subtitle="A sophisticated avatar component for displaying user profiles, images, or initials with various sizes, shapes, and states. Perfect for financial applications requiring professional user representation."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: { type: 'select' },
      options: ['circle', 'square'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// STORIES
// ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Avatar Variants"
        subtitle="Explore the different visual styles and states available for the Avatar component."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Default</h3>
          </div>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Standard avatar</p>
              <p className="text-gray-600">With image and fallback</p>
              <p className="text-xs font-mono text-gray-500 mt-1">size: md • shape: circle</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Small</h3>
          </div>
          <div className="flex items-center gap-4">
            <Avatar size="sm">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Compact size</p>
              <p className="text-gray-600">For dense layouts</p>
              <p className="text-xs font-mono text-gray-500 mt-1">size: sm • shape: circle</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Large</h3>
          </div>
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Prominent display</p>
              <p className="text-gray-600">For profile headers</p>
              <p className="text-xs font-mono text-gray-500 mt-1">size: lg • shape: circle</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Square</h3>
          </div>
          <div className="flex items-center gap-4">
            <Avatar shape="square">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Geometric shape</p>
              <p className="text-gray-600">Modern aesthetic</p>
              <p className="text-xs font-mono text-gray-500 mt-1">size: md • shape: square</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Fallback Only</h3>
          </div>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Initials display</p>
              <p className="text-gray-600">No image available</p>
              <p className="text-xs font-mono text-gray-500 mt-1">fallback: "JD" • no image</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <UserX className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Error State</h3>
          </div>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Graceful fallback</p>
              <p className="text-gray-600">Image fails to load</p>
              <p className="text-xs font-mono text-gray-500 mt-1">fallback: "AB" • error state</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const SizesAndShapes: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Avatar Sizes and Shapes"
        subtitle="Comprehensive demonstration of all available sizes and shapes for the Avatar component."
      />

      {/* Size Scale Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Size Scale</h3>
            <p className="text-sm text-gray-600">Four distinct sizes for different UI contexts</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="relative mb-4">
              <Avatar size="sm" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">1</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Small</p>
            <p className="text-xs font-mono text-gray-500 mb-1">32px</p>
            <p className="text-xs text-gray-600">Comments, lists</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Avatar size="md" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">2</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Medium</p>
            <p className="text-xs font-mono text-gray-500 mb-1">40px</p>
            <p className="text-xs text-gray-600">Default size</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Avatar size="lg" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">3</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Large</p>
            <p className="text-xs font-mono text-gray-500 mb-1">48px</p>
            <p className="text-xs text-gray-600">Profile headers</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Avatar size="xl" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>XL</AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">4</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Extra Large</p>
            <p className="text-xs font-mono text-gray-500 mb-1">64px</p>
            <p className="text-xs text-gray-600">Hero sections</p>
          </div>
        </div>
      </Card>

      {/* Shape Variants Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Shape Variants</h3>
            <p className="text-sm text-gray-600">Two distinct shapes for different design aesthetics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center group">
            <div className="relative mb-4">
              <Avatar shape="circle" size="lg" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CI</AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">A</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Circle</p>
            <p className="text-xs font-mono text-gray-500 mb-1">border-radius: 50%</p>
            <p className="text-xs text-gray-600">Traditional, friendly</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Avatar shape="square" size="lg" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>SQ</AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">B</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Square</p>
            <p className="text-xs font-mono text-gray-500 mb-1">border-radius: 0.375rem</p>
            <p className="text-xs text-gray-600">Modern, geometric</p>
          </div>
        </div>
      </Card>

      {/* Size Comparison Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Size Comparison</h3>
            <p className="text-sm text-gray-600">Visual scale showing relative sizes</p>
          </div>
        </div>

        <div className="flex items-end justify-center gap-4 h-32">
          <div className="text-center">
            <Avatar size="sm" className="shadow-lg">
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <p className="text-xs font-mono text-gray-500 mt-2">32px</p>
          </div>
          <div className="text-center">
            <Avatar size="md" className="shadow-lg">
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <p className="text-xs font-mono text-gray-500 mt-2">40px</p>
          </div>
          <div className="text-center">
            <Avatar size="lg" className="shadow-lg">
              <AvatarFallback>LG</AvatarFallback>
            </Avatar>
            <p className="text-xs font-mono text-gray-500 mt-2">48px</p>
          </div>
          <div className="text-center">
            <Avatar size="xl" className="shadow-lg">
              <AvatarFallback>XL</AvatarFallback>
            </Avatar>
            <p className="text-xs font-mono text-gray-500 mt-2">64px</p>
          </div>
        </div>
      </Card>
    </div>
  ),
};

export const UseCases: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Common Use Cases"
        subtitle="Real-world examples of Avatar usage in typical UI patterns for financial applications."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Profile Header */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Profile Header</h3>
          </div>
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
            <Avatar size="lg">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">Chadwick Nelson</p>
              <p className="text-sm text-gray-600">@shadcn</p>
              <p className="text-xs text-gray-500">Senior Investment Advisor</p>
              <p className="text-xs font-mono text-gray-400 mt-1">role: profile-header</p>
            </div>
          </div>
        </Card>

        {/* Comment Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Comment Thread</h3>
          </div>
          <div className="flex gap-3 p-4 border rounded-lg bg-gray-50">
            <Avatar size="sm">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">Jane Doe</p>
              <p className="text-sm text-gray-600">
                Excellent analysis of the market trends. The portfolio diversification strategy looks promising.
              </p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              <p className="text-xs font-mono text-gray-400 mt-1">role: comment-thread</p>
            </div>
          </div>
        </Card>

        {/* User List Item */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <Avatar size="md">
                <AvatarImage
                  src="https://api.dicebear.com/7.x/initials/svg?seed=Alice"
                  alt="Alice"
                />
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">Alice Smith</p>
                <p className="text-sm text-gray-600">Portfolio Manager</p>
                <p className="text-xs font-mono text-gray-400 mt-1">role: user-management</p>
              </div>
            </div>
            <button className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              View Profile
            </button>
          </div>
        </Card>

        {/* Team Collaboration */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Team Overview</h3>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <Avatar size="sm">
                <AvatarFallback>TM</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">+3 more</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Investment Team</p>
            <p className="text-xs text-gray-500">5 members • Active now</p>
            <p className="text-xs font-mono text-gray-400 mt-1">role: team-overview</p>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Interactive States"
        subtitle="Demonstrates how avatars behave in different interactive contexts."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Clickable Avatar</h3>
          </div>
          <div className="space-y-4">
            <button className="block w-full">
              <Avatar size="lg" className="cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </button>
            <p className="text-sm text-gray-600 text-center">Hover to see focus ring</p>
            <p className="text-xs font-mono text-gray-500 text-center mt-1">state: interactive</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Status Indicator</h3>
          </div>
          <div className="space-y-4">
            <div className="relative inline-block">
              <Avatar size="lg">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 text-center">Online status</p>
            <p className="text-xs font-mono text-gray-500 text-center mt-1">state: online • indicator: green</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Loading State</h3>
          </div>
          <div className="space-y-4">
            <Avatar size="lg" className="animate-pulse">
              <AvatarFallback>LD</AvatarFallback>
            </Avatar>
            <p className="text-sm text-gray-600 text-center">Loading user data</p>
            <p className="text-xs font-mono text-gray-500 text-center mt-1">state: loading • animation: pulse</p>
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
        subtitle="Guidelines for using the Avatar component effectively."
      />

      <Card className="p-8">
        <GuidelinesSection title="Do">
          <GuidelinesCard
            title="Do"
            variant="success"
            icon={<Check />}
            items={[
              'Provide a <strong>fallback</strong> with user initials for accessibility.',
              'Use descriptive <strong>alt text</strong> for images.',
              'Keep size consistent within the same UI area.',
              'Use appropriate shapes for your design system.',
              'Consider status indicators for real-time applications.',
            ]}
          />
        </GuidelinesSection>
        <GuidelinesSection title="Don't">
          <GuidelinesCard
            title="Don't"
            variant="warning"
            icon={<AlertTriangle />}
            items={[
              'Avoid using avatars as <strong>interactive</strong> without clear affordance.',
              'Don\'t use low-contrast placeholders.',
              'Don\'t rely solely on avatars for user identification.',
              'Avoid inconsistent sizing across similar contexts.',
            ]}
          />
        </GuidelinesSection>
      </Card>

      <SectionHeader
        title="Accessibility"
        subtitle="Accessibility considerations for the Avatar component."
      />
      <GuidelinesSection
        items={[
          'Include <code>alt</code> on images; if purely decorative, set <code>alt=""</code>.',
          'Ensure focusable avatars (when interactive) have visible focus and role.',
          'Provide sufficient contrast for fallback initials.',
          'Consider screen reader announcements for status changes.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Interactive Avatar</h3>
        </div>

        <div className="flex items-center justify-center mb-6">
          <Avatar {...args}>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Current Size</p>
            <p className="font-mono text-gray-600">{args.size}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Current Shape</p>
            <p className="font-mono text-gray-600">{args.shape}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Use the controls panel on the right to experiment with different sizes and shapes.
          </p>
        </div>
      </Card>
    </div>
  ),
  args: {
    size: 'md',
    shape: 'circle',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the avatar',
    },
    shape: {
      control: { type: 'select' },
      options: ['circle', 'square'],
      description: 'Shape of the avatar',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive avatar with configurable props. Use the controls to experiment with different sizes and shapes.',
      },
    },
  },
};

export const InteractivePlayground: Story = {
  render: () => {
    const [selectedSize, setSelectedSize] = React.useState('md');
    const [selectedShape, setSelectedShape] = React.useState('circle');
    const [showImage, setShowImage] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isOnline, setIsOnline] = React.useState(true);

    return (
      <div className="space-y-8">
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Avatar Playground</h3>
          </div>

          {/* Avatar Display */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <Avatar
                size={selectedSize as any}
                shape={selectedShape as any}
                className={isLoading ? 'animate-pulse' : ''}
              >
                {showImage ? (
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                ) : null}
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="sm">Small (32px)</option>
                <option value="md">Medium (40px)</option>
                <option value="lg">Large (48px)</option>
                <option value="xl">Extra Large (64px)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Shape</label>
              <select
                value={selectedShape}
                onChange={(e) => setSelectedShape(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="circle">Circle</option>
                <option value="square">Square</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Image</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showImage"
                  checked={showImage}
                  onChange={(e) => setShowImage(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="showImage" className="text-sm text-gray-600">Show image</label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isOnline"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isOnline" className="text-sm text-gray-600">Online indicator</label>
              </div>
            </div>
          </div>

          {/* Loading Toggle */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Loading State</p>
                <p className="text-xs text-gray-600">Toggle loading animation</p>
              </div>
              <button
                onClick={() => setIsLoading(!isLoading)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isLoading
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                  }`}
              >
                {isLoading ? 'Loading...' : 'Start Loading'}
              </button>
            </div>
          </div>

          {/* Current Configuration */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Current Configuration</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="font-mono text-blue-700">size: {selectedSize}</div>
              <div className="font-mono text-blue-700">shape: {selectedShape}</div>
              <div className="font-mono text-blue-700">image: {showImage ? 'true' : 'false'}</div>
              <div className="font-mono text-blue-700">online: {isOnline ? 'true' : 'false'}</div>
            </div>
          </div>
        </Card>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground to experiment with all avatar properties and states. Try different combinations to see how the avatar behaves.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Complete Avatar Documentation"
        subtitle="Comprehensive guide to using the sophisticated Avatar component."
      />

      <Card className="p-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          🌟 Design Philosophy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <PhilosophyItem
              color="#6366f1"
              title="Professional Identity"
              description="Represents users with dignity and professionalism in financial contexts"
            />
            <PhilosophyItem
              color="#6b7280"
              title="Consistent Hierarchy"
              description="Maintains visual hierarchy through standardized sizing"
            />
          </div>
          <div className="space-y-4">
            <PhilosophyItem
              color="#10b981"
              title="Graceful Degradation"
              description="Elegant fallbacks when images are unavailable"
            />
            <PhilosophyItem
              color="#ef4444"
              title="Accessible Design"
              description="Ensures all users can identify and interact with avatars"
            />
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          🚀 Usage Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GuidelinesSection
            title="Size Selection"
            items={[
              '• <strong>sm</strong>: Comments, lists, dense layouts',
              '• <strong>md</strong>: Default size, general use',
              '• <strong>lg</strong>: Profile headers, prominent display',
              '• <strong>xl</strong>: Hero sections, featured content',
            ]}
          />
          <GuidelinesSection
            title="Shape Usage"
            items={[
              '• <strong>circle</strong>: Traditional, friendly appearance',
              '• <strong>square</strong>: Modern, geometric aesthetic',
              '• Choose based on design system consistency',
              '• Consider brand personality',
            ]}
          />
          <GuidelinesSection
            title="Best Practices"
            items={[
              '• Always provide meaningful fallbacks',
              '• Use consistent sizing within contexts',
              '• Consider loading and error states',
              '• Implement proper accessibility',
            ]}
          />
        </div>
      </Card>

      <Card className="p-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          ♿ Accessibility
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GuidelinesSection
            title="Image Accessibility"
            items={[
              '• Provide descriptive alt text for user images',
              '• Use empty alt="" for decorative avatars',
              '• Ensure sufficient contrast for fallbacks',
              '• Test with screen readers',
            ]}
          />
          <GuidelinesSection
            title="Interactive Accessibility"
            items={[
              '• Provide clear focus indicators',
              '• Use appropriate ARIA roles',
              '• Announce status changes',
              '• Support keyboard navigation',
            ]}
          />
        </div>
      </Card>
    </div>
  ),
};
