import type { Meta, StoryObj } from '@storybook/react';
import UserManagement from './UserManagement';

const meta: Meta<typeof UserManagement> = {
  title: 'Admin/UserManagement',
  component: UserManagement,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'User management component for user administration, role management, and access control. Part of the consolidated Admin Dashboard system.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default user management interface with user administration and role management features.',
      },
    },
  },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Loading state during user management operations with progress indicators and user feedback.'
      }
    }
  }
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no users are available or user management features are disabled.'
      }
    }
  }
};

export const Error: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Error state handling for user management operations with retry functionality and error reporting.'
      }
    }
  }
};
