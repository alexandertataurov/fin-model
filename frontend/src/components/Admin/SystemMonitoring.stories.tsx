import type { Meta, StoryObj } from '@storybook/react';
import SystemMonitoring from './SystemMonitoring';

const meta: Meta<typeof SystemMonitoring> = {
  title: 'Admin/SystemMonitoring',
  component: SystemMonitoring,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'System monitoring component for real-time performance tracking, alert management, and system health monitoring. Integrates with the consolidated Admin Dashboard.',
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
        story: 'Default system monitoring interface with real-time performance metrics and health indicators.',
      },
    },
  },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Loading state during system monitoring data collection with progress indicators.'
      }
    }
  }
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no system monitoring data is available or services are offline.'
      }
    }
  }
};

export const Error: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Error state handling for system monitoring with alert management and recovery options.'
      }
    }
  }
};
