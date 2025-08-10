import type { Meta, StoryObj } from '@storybook/react';
import AdminGuard from './AdminGuard';

const meta: Meta<typeof AdminGuard> = {
  title: 'Components/AdminGuard',
  component: AdminGuard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Admin guard component for protecting admin-only routes and features.',
      },
    },
  },
  argTypes: {
    isAdmin: {
      control: { type: 'boolean' },
      description: 'Whether the user has admin privileges',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state for permission check',
    },
    fallback: {
      control: { type: 'text' },
      description: 'Fallback content when user is not admin',
    },
    children: {
      control: false,
      description: 'Content to render when user is admin',
    },
    onUnauthorized: {
      action: 'unauthorized',
      description: 'Callback when unauthorized access is attempted',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { 
  args: {
    isAdmin: true,
    isLoading: false,
    children: <div className="p-4 border rounded">Admin content here</div>,
  },
};

export const NotAdmin: Story = { 
  args: {
    isAdmin: false,
    isLoading: false,
    fallback: <div className="p-4 text-red-600">Access denied. Admin privileges required.</div>,
    children: <div className="p-4 border rounded">Admin content here</div>,
  },
};

export const Loading: Story = { 
  args: {
    isAdmin: false,
    isLoading: true,
    children: <div className="p-4 border rounded">Admin content here</div>,
  },
};

export const WithCustomFallback: Story = { 
  args: {
    isAdmin: false,
    isLoading: false,
    fallback: (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Access Restricted</h3>
        <p className="text-sm text-muted-foreground">
          This area requires administrator privileges. Please contact your system administrator.
        </p>
      </div>
    ),
    children: <div className="p-4 border rounded">Admin content here</div>,
  },
};

export const Empty: Story = { 
  args: {
    isAdmin: false,
    isLoading: false,
    children: null,
  },
};

export const Error: Story = { 
  args: {
    isAdmin: false,
    isLoading: false,
    fallback: <div className="p-4 text-red-600">Error checking permissions. Please try again.</div>,
    children: <div className="p-4 border rounded">Admin content here</div>,
  },
};
