import type { Meta, StoryObj } from '@storybook/react';
import DataManagement from './DataManagement';

const meta: Meta<typeof DataManagement> = {
  title: 'Admin/DataManagement',
  component: DataManagement,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Data management component for database operations, backup management, and data integrity checks. Part of the consolidated Admin Dashboard system.',
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
        story: 'Default data management interface with database operations and backup management features.',
      },
    },
  },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Loading state during data management operations with progress indicators and user feedback.'
      }
    }
  }
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no data management operations are available or configured.'
      }
    }
  }
};

export const Error: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Error state handling for data management operations with retry functionality and error reporting.'
      }
    }
  }
};
