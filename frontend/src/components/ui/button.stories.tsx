import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Plus, Download, Trash2, Edit } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: '🧩 UI Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Button Component

The Button component is built on top of Radix UI's Slot primitive and uses Class Variance Authority (CVA) for type-safe variant management. It provides consistent styling and behavior across the FinVision platform.

## Key Features

- **Polymorphic**: Can render as any element using \`asChild\` prop
- **Type-safe variants**: Compile-time validation of variant combinations
- **Accessibility**: Built-in focus management and ARIA attributes
- **Icon support**: Automatic icon sizing and spacing
- **Loading states**: Built-in loading state support

## Usage in FinVision

- **Login Component**: Primary CTA for authentication
- **Reports Component**: Template creation, report generation, export actions
- **Dashboard**: Quick actions and navigation
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'success',
        'warning',
        'info',
      ],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size variant',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child element (polymorphic)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interaction',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
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
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants with their visual styles.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Create
      </Button>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
      <Button variant="secondary">
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with icons following the FinVision icon guidelines.',
      },
    },
  },
};

export const LoginExample: Story = {
  render: () => (
    <div className="w-80 space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Login Form Example</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter password"
          />
        </div>
        <Button className="w-full" size="lg">
          Sign In
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example usage from the Login component showing the primary CTA button.',
      },
    },
  },
};

export const ReportsExample: Story = {
  render: () => (
    <div className="space-y-4 p-6 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Report Templates</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="secondary" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example usage from the Reports component showing various button patterns.',
      },
    },
  },
};
