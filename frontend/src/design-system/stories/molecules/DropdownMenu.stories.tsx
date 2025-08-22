import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../molecules/DropdownMenu/DropdownMenu';
import { Button } from '../../atoms/Button';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle, MoreVertical, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Molecules / DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Molecule: DropdownMenu"
            subtitle="A dropdown menu component for displaying a list of actions or options with customizable alignment and styling."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================ // STORIES // ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="DropdownMenu Variants"
        subtitle="Different dropdown menu configurations and alignment options."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Menu</h4>
          <DropdownMenuExample />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Right Aligned</h4>
          <DropdownMenuExample align="end" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Center Aligned</h4>
          <DropdownMenuExample align="center" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">With Disabled Item</h4>
          <DropdownMenuExampleWithDisabled />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Custom Trigger</h4>
          <DropdownMenuExampleCustomTrigger />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Icon Trigger</h4>
          <DropdownMenuExampleIconTrigger />
        </Card>
      </div>
    </div>
  ),
};

// Helper components for variants
const DropdownMenuExample = ({ align = 'start' }: { align?: 'start' | 'center' | 'end' }) => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button>Open Menu</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align={align}>
      <DropdownMenuItem onClick={() => alert('Profile clicked')}>
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => alert('Settings clicked')}>
        Settings
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => alert('Logout clicked')}>
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const DropdownMenuExampleWithDisabled = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button>Menu with Disabled</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem disabled onClick={() => alert('Disabled clicked')}>
        Disabled Item
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => alert('Settings clicked')}>
        Settings
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const DropdownMenuExampleCustomTrigger = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <a href="#" className="text-blue-500 hover:underline">
        Custom Link Trigger
      </a>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => alert('Link 1 clicked')}>
        Link 1
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => alert('Link 2 clicked')}>
        Link 2
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const DropdownMenuExampleIconTrigger = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="ghost" size="sm">
        <MoreVertical className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => alert('Edit clicked')}>
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => alert('Delete clicked')}>
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const Default: Story = {
  args: {
    children: (
      <>
        <DropdownMenuTrigger>
          <Button>Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => alert('Profile clicked')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('Settings clicked')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('Logout clicked')}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </>
    ),
  },
};

export const AlignRight: Story = {
  args: {
    children: (
      <>
        <DropdownMenuTrigger>
          <Button>Align Right</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => alert('Profile clicked')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('Settings clicked')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('Logout clicked')}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </>
    ),
  },
};

export const AlignCenter: Story = {
  args: {
    children: (
      <>
        <DropdownMenuTrigger>
          <Button>Align Center</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={() => alert('Profile clicked')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('Settings clicked')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('Logout clicked')}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </>
    ),
  },
};

export const WithDisabledItem: Story = {
  args: {
    children: (
      <>
        <DropdownMenuTrigger>
          <Button>Menu with Disabled</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled onClick={() => alert('Disabled clicked')}>
            Disabled Item
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('Settings clicked')}>
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </>
    ),
  },
};

export const CustomTrigger: Story = {
  args: {
    children: (
      <>
        <DropdownMenuTrigger asChild>
          <a href="#" className="text-blue-500 hover:underline">
            Custom Link Trigger
          </a>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => alert('Link 1 clicked')}>
            Link 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('Link 2 clicked')}>
            Link 2
          </DropdownMenuItem>
        </DropdownMenuContent>
      </>
    ),
  },
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="DropdownMenu Guidelines"
        subtitle="Best practices and design principles for dropdown menu components."
      />
      
      <GuidelinesSection>
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Clear Actions"
          description="Use descriptive labels for menu items and group related actions logically."
        />
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Accessibility"
          description="Ensure proper keyboard navigation, focus management, and screen reader support."
        />
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Visual Hierarchy"
          description="Use appropriate alignment and styling to guide user attention and improve usability."
        />
        <GuidelinesCard
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          title="Overuse Prevention"
          description="Don't overload menus with too many options - consider using submenus for complex hierarchies."
        />
      </GuidelinesSection>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Interactive DropdownMenu Examples"
        subtitle="Interactive dropdown menu patterns and real-world usage scenarios."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            User Actions
          </h4>
          <DropdownMenuExample />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings Menu
          </h4>
          <DropdownMenuExample align="end" />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MoreVertical className="w-5 h-5" />
            Context Menu
          </h4>
          <DropdownMenuExampleIconTrigger />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ChevronDown className="w-5 h-5" />
            Navigation Menu
          </h4>
          <DropdownMenuExample align="center" />
        </Card>
      </div>
    </div>
  ),
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="DropdownMenu Documentation"
        subtitle="Comprehensive documentation and usage examples for the DropdownMenu component."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Component Structure</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• DropdownMenu wrapper with trigger and content</p>
            <p>• DropdownMenuTrigger for activation</p>
            <p>• DropdownMenuContent for menu items</p>
            <p>• DropdownMenuItem for individual options</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Props & Configuration</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• align: 'start' | 'center' | 'end'</p>
            <p>• asChild: boolean for custom triggers</p>
            <p>• disabled: boolean for menu items</p>
            <p>• onClick: callback for item selection</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Use Cases</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• User account actions</p>
            <p>• Context menus and options</p>
            <p>• Navigation and filtering</p>
            <p>• Settings and preferences</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Use clear, actionable labels</p>
            <p>• Group related actions logically</p>
            <p>• Provide appropriate visual feedback</p>
            <p>• Test keyboard and screen reader access</p>
          </div>
        </Card>
      </div>
    </div>
  ),
};
