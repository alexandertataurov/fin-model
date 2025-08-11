import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import LogsTab from './LogsTab';
import { useLogFilters } from '@/hooks/useLogFilters';

// Mock the log filters hook
const mockLogFilters = {
  logs: {
    items: [],
    total: 0,
    skip: 0,
    limit: 50,
    level: 'all',
    from: null,
    to: null,
    search: '',
  },
  handleFilterChange: jest.fn(),
  handlePrev: jest.fn(),
  handleNext: jest.fn(),
  handleRefresh: jest.fn(),
};

jest.mock('@/hooks/useLogFilters', () => ({
  useLogFilters: jest.fn(() => mockLogFilters),
}));

const meta: Meta<typeof LogsTab> = {
  title: 'AdminDashboard/LogsTab',
  component: LogsTab,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Logs tab component for the admin dashboard showing system logs with filtering and pagination.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-6xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LogsTab>;

// DEFAULT STORIES
export const Default: Story = {
  args: {},
};

// STATE-BASED STORIES
export const LoadingState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the loading state when logs are being fetched.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          ...mockLogFilters.logs,
          items: [],
          total: 0,
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};

export const NoLogsState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the empty state when no logs are available.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          ...mockLogFilters.logs,
          items: [],
          total: 0,
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};

export const WithLogs: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with sample log entries.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          items: [
            {
              id: 1,
              level: 'INFO',
              module: 'API',
              message: 'User authentication successful',
              timestamp: new Date().toISOString(),
            },
            {
              id: 2,
              level: 'WARNING',
              module: 'Database',
              message: 'Connection pool reaching capacity',
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
            {
              id: 3,
              level: 'ERROR',
              module: 'FileProcessor',
              message: 'Failed to process uploaded file: invalid format',
              timestamp: new Date(Date.now() - 600000).toISOString(),
            },
            {
              id: 4,
              level: 'DEBUG',
              module: 'Cache',
              message: 'Cache miss for key: user_preferences_123',
              timestamp: new Date(Date.now() - 900000).toISOString(),
            },
            {
              id: 5,
              level: 'INFO',
              module: 'System',
              message: 'Scheduled maintenance completed successfully',
              timestamp: new Date(Date.now() - 1200000).toISOString(),
            },
          ],
          total: 150,
          skip: 0,
          limit: 50,
          level: 'all',
          from: null,
          to: null,
          search: '',
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};

export const WithErrorLogs: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with error-level log entries.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          items: [
            {
              id: 1,
              level: 'ERROR',
              module: 'Database',
              message: 'Connection timeout after 30 seconds',
              timestamp: new Date().toISOString(),
            },
            {
              id: 2,
              level: 'ERROR',
              module: 'API',
              message: 'Rate limit exceeded for user 12345',
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
            {
              id: 3,
              level: 'ERROR',
              module: 'FileProcessor',
              message: 'Corrupted file detected: checksum mismatch',
              timestamp: new Date(Date.now() - 600000).toISOString(),
            },
            {
              id: 4,
              level: 'ERROR',
              module: 'Authentication',
              message: 'Invalid JWT token provided',
              timestamp: new Date(Date.now() - 900000).toISOString(),
            },
            {
              id: 5,
              level: 'ERROR',
              module: 'System',
              message: 'Memory usage exceeded 90% threshold',
              timestamp: new Date(Date.now() - 1200000).toISOString(),
            },
          ],
          total: 25,
          skip: 0,
          limit: 50,
          level: 'error',
          from: null,
          to: null,
          search: '',
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};

export const WithWarningLogs: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with warning-level log entries.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          items: [
            {
              id: 1,
              level: 'WARNING',
              module: 'Database',
              message: 'Connection pool utilization at 85%',
              timestamp: new Date().toISOString(),
            },
            {
              id: 2,
              level: 'WARNING',
              module: 'Cache',
              message: 'Redis memory usage approaching limit',
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
            {
              id: 3,
              level: 'WARNING',
              module: 'API',
              message: 'Response time exceeded 2 seconds',
              timestamp: new Date(Date.now() - 600000).toISOString(),
            },
            {
              id: 4,
              level: 'WARNING',
              module: 'System',
              message: 'Disk space usage at 78%',
              timestamp: new Date(Date.now() - 900000).toISOString(),
            },
            {
              id: 5,
              level: 'WARNING',
              module: 'Security',
              message: 'Multiple failed login attempts detected',
              timestamp: new Date(Date.now() - 1200000).toISOString(),
            },
          ],
          total: 45,
          skip: 0,
          limit: 50,
          level: 'warning',
          from: null,
          to: null,
          search: '',
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};

// RESPONSIVE DESIGN STORIES
export const MobileResponsive: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Shows how the component adapts to mobile screen sizes.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          items: [
            {
              id: 1,
              level: 'INFO',
              module: 'API',
              message: 'User authentication successful',
              timestamp: new Date().toISOString(),
            },
            {
              id: 2,
              level: 'WARNING',
              module: 'Database',
              message: 'Connection pool reaching capacity',
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
          ],
          total: 150,
          skip: 0,
          limit: 50,
          level: 'all',
          from: null,
          to: null,
          search: '',
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};

export const TabletResponsive: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Shows how the component adapts to tablet screen sizes.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          items: [
            {
              id: 1,
              level: 'INFO',
              module: 'API',
              message: 'User authentication successful',
              timestamp: new Date().toISOString(),
            },
            {
              id: 2,
              level: 'WARNING',
              module: 'Database',
              message: 'Connection pool reaching capacity',
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
            {
              id: 3,
              level: 'ERROR',
              module: 'FileProcessor',
              message: 'Failed to process uploaded file',
              timestamp: new Date(Date.now() - 600000).toISOString(),
            },
          ],
          total: 150,
          skip: 0,
          limit: 50,
          level: 'all',
          from: null,
          to: null,
          search: '',
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};

export const DesktopWide: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Shows the component on wide desktop screens.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          items: [
            {
              id: 1,
              level: 'INFO',
              module: 'API',
              message: 'User authentication successful',
              timestamp: new Date().toISOString(),
            },
            {
              id: 2,
              level: 'WARNING',
              module: 'Database',
              message: 'Connection pool reaching capacity',
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
            {
              id: 3,
              level: 'ERROR',
              module: 'FileProcessor',
              message: 'Failed to process uploaded file',
              timestamp: new Date(Date.now() - 600000).toISOString(),
            },
            {
              id: 4,
              level: 'DEBUG',
              module: 'Cache',
              message: 'Cache miss for key: user_preferences_123',
              timestamp: new Date(Date.now() - 900000).toISOString(),
            },
          ],
          total: 150,
          skip: 0,
          limit: 50,
          level: 'all',
          from: null,
          to: null,
          search: '',
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};

// ACCESSIBILITY STORIES
export const AccessibilityFocused: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with accessibility features highlighted for testing.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'heading-order',
            enabled: true,
          },
        ],
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          items: [
            {
              id: 1,
              level: 'INFO',
              module: 'API',
              message: 'User authentication successful',
              timestamp: new Date().toISOString(),
            },
            {
              id: 2,
              level: 'WARNING',
              module: 'Database',
              message: 'Connection pool reaching capacity',
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
          ],
          total: 150,
          skip: 0,
          limit: 50,
          level: 'all',
          from: null,
          to: null,
          search: '',
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};

// PERFORMANCE STORIES
export const WithLargeLogDataset: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the component handling a large number of log entries.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          items: Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            level: ['INFO', 'WARNING', 'ERROR', 'DEBUG'][Math.floor(Math.random() * 4)],
            module: ['API', 'Database', 'FileProcessor', 'Cache', 'System'][Math.floor(Math.random() * 5)],
            message: `Log entry ${i + 1} with some sample message content`,
            timestamp: new Date(Date.now() - i * 60000).toISOString(),
          })),
          total: 5000,
          skip: 0,
          limit: 100,
          level: 'all',
          from: null,
          to: null,
          search: '',
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};

// FILTERING STORIES
export const WithSearchFilter: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with search filtering applied.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          items: [
            {
              id: 1,
              level: 'ERROR',
              module: 'Database',
              message: 'Connection timeout after 30 seconds',
              timestamp: new Date().toISOString(),
            },
            {
              id: 2,
              level: 'ERROR',
              module: 'Database',
              message: 'Query execution failed: syntax error',
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
          ],
          total: 2,
          skip: 0,
          limit: 50,
          level: 'all',
          from: null,
          to: null,
          search: 'database',
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};

export const WithDateRangeFilter: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with date range filtering applied.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          items: [
            {
              id: 1,
              level: 'INFO',
              module: 'API',
              message: 'User authentication successful',
              timestamp: new Date().toISOString(),
            },
            {
              id: 2,
              level: 'WARNING',
              module: 'Database',
              message: 'Connection pool reaching capacity',
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
          ],
          total: 2,
          skip: 0,
          limit: 50,
          level: 'all',
          from: new Date(Date.now() - 86400000).toISOString(),
          to: new Date().toISOString(),
          search: '',
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};

// INTEGRATION STORIES
export const WithRealTimeUpdates: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with real-time log updates.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockFilters = {
        ...mockLogFilters,
        logs: {
          items: [
            {
              id: 1,
              level: 'INFO',
              module: 'API',
              message: 'User authentication successful',
              timestamp: new Date().toISOString(),
            },
            {
              id: 2,
              level: 'WARNING',
              module: 'Database',
              message: 'Connection pool reaching capacity',
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
          ],
          total: 150,
          skip: 0,
          limit: 50,
          level: 'all',
          from: null,
          to: null,
          search: '',
        },
      };
      (useLogFilters as jest.Mock).mockReturnValue(mockFilters);
      return <Story />;
    },
  ],
};
