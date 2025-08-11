import type { Meta, StoryObj } from '@storybook/react';
import HealthTab from './HealthTab';
import { useAdminStore } from '@/stores/adminStore';

// Mock the admin store
const mockAdminStore = {
  systemHealth: {
    data: null,
    loading: false,
    error: null,
  },
  databaseHealth: {
    data: null,
    loading: false,
    error: null,
  },
};

// Mock the store hook
jest.mock('@/stores/adminStore', () => ({
  useAdminStore: jest.fn(() => mockAdminStore),
}));

const meta: Meta<typeof HealthTab> = {
  title: 'AdminDashboard/HealthTab',
  component: HealthTab,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Health tab component for the admin dashboard showing system and database health status.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HealthTab>;

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
        story: 'Shows the loading state when health data is being fetched.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockStore = {
        ...mockAdminStore,
        systemHealth: { ...mockAdminStore.systemHealth, loading: true },
        databaseHealth: { ...mockAdminStore.databaseHealth, loading: true },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
      return <Story />;
    },
  ],
};

export const NoDataState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the empty state when no health data is available.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockStore = {
        ...mockAdminStore,
        systemHealth: { ...mockAdminStore.systemHealth, data: null },
        databaseHealth: { ...mockAdminStore.databaseHealth, data: null },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
      return <Story />;
    },
  ],
};

export const HealthySystemState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the dashboard with healthy system and database status.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockStore = {
        systemHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
        databaseHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
      return <Story />;
    },
  ],
};

export const WarningSystemState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the dashboard with warning-level health status requiring attention.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockStore = {
        systemHealth: {
          data: { status: 'warning' },
          loading: false,
          error: null,
        },
        databaseHealth: {
          data: { status: 'warning' },
          loading: false,
          error: null,
        },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
      return <Story />;
    },
  ],
};

export const CriticalSystemState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the dashboard with critical health status requiring immediate attention.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockStore = {
        systemHealth: {
          data: { status: 'critical' },
          loading: false,
          error: null,
        },
        databaseHealth: {
          data: { status: 'critical' },
          loading: false,
          error: null,
        },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
      return <Story />;
    },
  ],
};

export const MixedHealthState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the dashboard with mixed health states - healthy system but critical database.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockStore = {
        systemHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
        databaseHealth: {
          data: { status: 'critical' },
          loading: false,
          error: null,
        },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
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
      const mockStore = {
        systemHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
        databaseHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
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
      const mockStore = {
        systemHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
        databaseHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
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
      const mockStore = {
        systemHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
        databaseHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
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
      const mockStore = {
        systemHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
        databaseHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
      return <Story />;
    },
  ],
};

// ERROR STATE STORIES
export const ErrorState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the component when there are errors fetching health data.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockStore = {
        systemHealth: {
          data: null,
          loading: false,
          error: 'Failed to fetch system health data',
        },
        databaseHealth: {
          data: null,
          loading: false,
          error: 'Database connection failed',
        },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
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
        story: 'Shows the component with real-time health status updates.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockStore = {
        systemHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
        databaseHealth: {
          data: { status: 'healthy' },
          loading: false,
          error: null,
        },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
      return <Story />;
    },
  ],
};

// DETAILED HEALTH STORIES
export const WithDetailedHealthData: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with detailed health information including metrics and timestamps.',
      },
    },
  },
  decorators: [
    (Story) => {
      const mockStore = {
        systemHealth: {
          data: {
            status: 'healthy',
            uptime: '15 days, 3 hours, 27 minutes',
            version: '1.2.3',
            last_check: new Date().toISOString(),
            services: {
              api: 'healthy',
              database: 'healthy',
              cache: 'healthy',
              queue: 'healthy',
            },
          },
          loading: false,
          error: null,
        },
        databaseHealth: {
          data: {
            status: 'healthy',
            connection_pool: 85,
            active_connections: 12,
            max_connections: 100,
            query_performance: 'excellent',
            last_backup: new Date(Date.now() - 86400000).toISOString(),
          },
          loading: false,
          error: null,
        },
      };
      (useAdminStore as jest.Mock).mockReturnValue(mockStore);
      return <Story />;
    },
  ],
};
