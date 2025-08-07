import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from '../components/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/Card';
import {
  Plus,
  Download,
  Trash2,
  Edit,
  Search,
  Mail,
  Eye,
  EyeOff,
  Settings,
  User,
  Bell,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Info,
  Lock,
  Star,
  Heart,
  Share2,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
} from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: '🎨 Design System/Components/Button',
  component: Button,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Button Component

A versatile button component built with modern design principles and comprehensive accessibility support. The Button component is the primary interaction element in the FinVision design system.

## Key Features

- **🎨 Multiple Variants**: Default, secondary, outline, ghost, link, and semantic variants
- **📏 Flexible Sizing**: XS, SM, MD, LG, XL sizes with icon-only options
- **⚡ Interactive States**: Loading, disabled, hover, focus, and active states
- **🎯 Icon Support**: Left/right icons with automatic sizing and spacing
- **♿ Accessibility**: Full keyboard navigation and screen reader support
- **🎭 Polymorphic**: Can render as any element using the \`asChild\` prop
- **🎨 Design System**: Consistent with design tokens and theming

## Usage

\`\`\`tsx
import { Button } from '@/design-system';

// Basic usage
<Button>Click me</Button>

// With variants and sizes
<Button variant="outline" size="lg">
  Large Outline Button
</Button>

// With icons
<Button leftIcon={<Plus />} rightIcon={<ArrowRight />}>
  Add Item
</Button>

// Loading state
<Button loading>Processing...</Button>

// Icon only
<Button size="icon" variant="outline">
  <Settings />
</Button>
\`\`\`

## Design Principles

1. **Consistency**: All buttons follow the same design patterns
2. **Clarity**: Clear visual hierarchy and purpose
3. **Feedback**: Immediate visual feedback for all interactions
4. **Accessibility**: Inclusive design for all users
5. **Performance**: Optimized rendering and minimal bundle impact
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'outline',
        'ghost',
        'link',
        'destructive',
        'success',
        'warning',
        'info',
      ],
      description: 'Visual style variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner and disable interaction',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interaction',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    leftIcon: {
      control: false,
      description: 'Icon to display before the button text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    rightIcon: {
      control: false,
      description: 'Icon to display after the button text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child element (polymorphic)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default Button
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

// All Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Button Variants</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
        </div>
      </div>
    </div>
  ),
};

// All Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Button Sizes</h3>
        <div className="flex items-center gap-3">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Icon Button Sizes</h3>
        <div className="flex items-center gap-3">
          <Button size="icon" variant="outline">
            <Plus className="size-3" />
          </Button>
          <Button size="icon" variant="outline">
            <Plus className="size-4" />
          </Button>
          <Button size="icon" variant="outline">
            <Plus className="size-4" />
          </Button>
          <Button size="icon" variant="outline">
            <Plus className="size-5" />
          </Button>
          <Button size="icon" variant="outline">
            <Plus className="size-6" />
          </Button>
        </div>
      </div>
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Buttons with Icons</h3>
        <div className="flex flex-wrap gap-3">
          <Button leftIcon={<Plus />}>Add Item</Button>
          <Button rightIcon={<ArrowRight />}>Continue</Button>
          <Button leftIcon={<Download />} rightIcon={<ArrowRight />}>
            Download & Install
          </Button>
          <Button leftIcon={<Mail />}>Send Email</Button>
          <Button leftIcon={<Settings />}>Settings</Button>
          <Button leftIcon={<User />}>Profile</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Icon Only Buttons</h3>
        <div className="flex items-center gap-3">
          <Button size="icon" variant="outline" aria-label="Add item">
            <Plus />
          </Button>
          <Button size="icon" variant="outline" aria-label="Edit">
            <Edit />
          </Button>
          <Button size="icon" variant="outline" aria-label="Delete">
            <Trash2 />
          </Button>
          <Button size="icon" variant="outline" aria-label="Search">
            <Search />
          </Button>
          <Button size="icon" variant="outline" aria-label="Settings">
            <Settings />
          </Button>
          <Button size="icon" variant="outline" aria-label="More options">
            <MoreHorizontal />
          </Button>
        </div>
      </div>
    </div>
  ),
};

// States
export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Button States</h3>
        <div className="flex flex-wrap gap-3">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button variant="outline" disabled>
            Disabled Outline
          </Button>
          <Button variant="ghost" loading>
            Loading Ghost
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive States</h3>
        <p className="text-sm text-muted-foreground">
          Hover, focus, and active states are automatically handled by the
          component.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">Hover me</Button>
          <Button variant="ghost">Focus me</Button>
          <Button variant="secondary">Click me</Button>
        </div>
      </div>
    </div>
  ),
};

// Semantic Variants
export const SemanticVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Semantic Variants</h3>
        <p className="text-sm text-muted-foreground">
          Use semantic variants to convey meaning through color and styling.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="success" leftIcon={<CheckCircle />}>
            Success Action
          </Button>
          <Button variant="warning" leftIcon={<AlertTriangle />}>
            Warning Action
          </Button>
          <Button variant="destructive" leftIcon={<Trash2 />}>
            Delete Item
          </Button>
          <Button variant="info" leftIcon={<Info />}>
            Information
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contextual Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="size-5" />
                Financial Action
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="success"
                className="w-full"
                leftIcon={<TrendingUp />}
              >
                Approve Transaction
              </Button>
              <Button variant="outline" className="w-full" leftIcon={<Eye />}>
                View Details
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                Document Action
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="default"
                className="w-full"
                leftIcon={<Download />}
              >
                Download Report
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                leftIcon={<Trash2 />}
              >
                Delete Document
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};

// Loading States
export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Loading States</h3>
        <p className="text-sm text-muted-foreground">
          Loading states automatically show a spinner and disable interaction.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button loading>Processing...</Button>
          <Button variant="outline" loading>
            Loading...
          </Button>
          <Button variant="ghost" loading>
            Please wait...
          </Button>
          <Button size="icon" loading>
            <Settings />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Example</h3>
        <div className="space-y-3">
          <Button onClick={() => alert('Button clicked!')} leftIcon={<Play />}>
            Start Process
          </Button>
          <p className="text-sm text-muted-foreground">
            Click the button above to see the interaction. In a real
            application, you would typically manage the loading state with React
            state.
          </p>
        </div>
      </div>
    </div>
  ),
};

// Polymorphic Example
export const Polymorphic: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Polymorphic Buttons</h3>
        <p className="text-sm text-muted-foreground">
          Use the \`asChild\` prop to render buttons as different elements while
          maintaining styling.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="#polymorphic">Link Button</a>
          </Button>
          <Button asChild variant="outline">
            <button type="submit">Submit Button</button>
          </Button>
          <Button asChild variant="ghost">
            <span>Span Button</span>
          </Button>
        </div>
      </div>
    </div>
  ),
};

// Accessibility
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Accessibility Features</h3>
        <p className="text-sm text-muted-foreground">
          All buttons include proper accessibility attributes and keyboard
          navigation.
        </p>
        <div className="space-y-3">
          <Button aria-label="Add new item to the list">
            <Plus />
          </Button>
          <Button aria-describedby="delete-description">
            <Trash2 />
          </Button>
          <p id="delete-description" className="text-sm text-muted-foreground">
            This will permanently delete the selected item
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Keyboard Navigation</h3>
        <p className="text-sm text-muted-foreground">
          Try using Tab to navigate between buttons and Enter/Space to activate
          them.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">First Button</Button>
          <Button variant="outline">Second Button</Button>
          <Button variant="outline">Third Button</Button>
        </div>
      </div>
    </div>
  ),
};
