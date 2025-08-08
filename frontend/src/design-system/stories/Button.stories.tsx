import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';
import {
  Download,
  Plus,
  Trash2,
  Settings,
  Eye,
  Edit,
  Save,
} from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants, sizes, and states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
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
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'icon'],
      description: 'The size of the button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    asChild: {
      control: { type: 'boolean' },
      description: 'Render as a different element',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic button stories
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

// Size variations
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: <Settings className="h-4 w-4" />,
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading…',
  },
};

// With icons
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </>
    ),
  },
};

export const WithIconRight: Story = {
  args: {
    children: (
      <>
        Download
        <Download className="ml-2 h-4 w-4" />
      </>
    ),
  },
};

// Action buttons
export const ActionButtons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        <Eye className="mr-2 h-4 w-4" />
        View
      </Button>
      <Button size="sm">
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </Button>
      <Button variant="destructive" size="sm">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  ),
};

// Button group
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </div>
  ),
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="info">Info</Button>
      </div>
      <div className="space-y-2">
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="md">MD</Button>
      <Button size="lg">LG</Button>
      <Button size="xl">XL</Button>
      <Button size="icon">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
