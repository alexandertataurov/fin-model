import type { Meta, StoryObj } from '@storybook/react';
import { OverviewSection } from './OverviewSection';
import { useAdminStore } from '@/stores/admin';

// Mock the admin store
const mockAdminStore = {
    systemStats: {
        data: null,
        loading: false,
        error: null,
    },
    userActivity: {
        data: [],
        loading: false,
        error: null,
    },
    systemMetrics: {
        data: null,
        loading: false,
        error: null,
    },
    fetchOverviewData: jest.fn(),
};

// Mock the store hook
jest.mock('@/stores/admin', () => ({
    useAdminStore: jest.fn(() => mockAdminStore),
}));

const meta: Meta<typeof OverviewSection> = {
    title: 'Admin/OverviewSection',
    component: OverviewSection,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Overview section component for the admin dashboard showing system status, performance metrics, and user activity.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div className="max-w-7xl mx-auto p-6">
                <Story />
            </div>
        ),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OverviewSection>;

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
                story: 'Shows the loading state with skeleton components when data is being fetched.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockStore = {
                ...mockAdminStore,
                systemStats: { ...mockAdminStore.systemStats, loading: true },
                userActivity: { ...mockAdminStore.userActivity, loading: true },
                systemMetrics: { ...mockAdminStore.systemMetrics, loading: true },
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
                story: 'Shows the empty state when no data is available.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockStore = {
                ...mockAdminStore,
                systemStats: { ...mockAdminStore.systemStats, data: null },
                userActivity: { ...mockAdminStore.userActivity, data: [] },
                systemMetrics: { ...mockAdminStore.systemMetrics, data: null },
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
                story: 'Shows the dashboard with healthy system metrics and normal performance indicators.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockStore = {
                systemStats: {
                    data: {
                        users: { total: 1250, active: 1180, verified: 1200 },
                        files: { total: 3450, completed: 3200, processing: 150, failed: 100 },
                        financial: { statements: 890, parameters: 2340 },
                    },
                    loading: false,
                    error: null,
                },
                userActivity: {
                    data: [
                        {
                            user_id: 1,
                            username: 'admin@example.com',
                            last_login: new Date().toISOString(),
                            login_count: 45,
                            is_active: true,
                        },
                        {
                            user_id: 2,
                            username: 'user1@example.com',
                            last_login: new Date(Date.now() - 3600000).toISOString(),
                            login_count: 23,
                            is_active: true,
                        },
                        {
                            user_id: 3,
                            username: 'user2@example.com',
                            last_login: new Date(Date.now() - 7200000).toISOString(),
                            login_count: 12,
                            is_active: false,
                        },
                    ],
                    loading: false,
                    error: null,
                },
                systemMetrics: {
                    data: {
                        cpu_usage: 35,
                        memory_usage: 45,
                        disk_usage: 60,
                        request_count_24h: 15420,
                        error_rate_24h: 0.5,
                        avg_response_time: 120,
                    },
                    loading: false,
                    error: null,
                },
                fetchOverviewData: jest.fn(),
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
                story: 'Shows the dashboard with warning-level system metrics requiring attention.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockStore = {
                systemStats: {
                    data: {
                        users: { total: 1250, active: 1180, verified: 1200 },
                        files: { total: 3450, completed: 3200, processing: 150, failed: 100 },
                        financial: { statements: 890, parameters: 2340 },
                    },
                    loading: false,
                    error: null,
                },
                userActivity: {
                    data: [
                        {
                            user_id: 1,
                            username: 'admin@example.com',
                            last_login: new Date().toISOString(),
                            login_count: 45,
                            is_active: true,
                        },
                        {
                            user_id: 2,
                            username: 'user1@example.com',
                            last_login: new Date(Date.now() - 3600000).toISOString(),
                            login_count: 23,
                            is_active: true,
                        },
                    ],
                    loading: false,
                    error: null,
                },
                systemMetrics: {
                    data: {
                        cpu_usage: 75,
                        memory_usage: 82,
                        disk_usage: 85,
                        request_count_24h: 15420,
                        error_rate_24h: 2.5,
                        avg_response_time: 250,
                    },
                    loading: false,
                    error: null,
                },
                fetchOverviewData: jest.fn(),
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
                story: 'Shows the dashboard with critical system metrics requiring immediate attention.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockStore = {
                systemStats: {
                    data: {
                        users: { total: 1250, active: 1180, verified: 1200 },
                        files: { total: 3450, completed: 3200, processing: 150, failed: 100 },
                        financial: { statements: 890, parameters: 2340 },
                    },
                    loading: false,
                    error: null,
                },
                userActivity: {
                    data: [
                        {
                            user_id: 1,
                            username: 'admin@example.com',
                            last_login: new Date().toISOString(),
                            login_count: 45,
                            is_active: true,
                        },
                    ],
                    loading: false,
                    error: null,
                },
                systemMetrics: {
                    data: {
                        cpu_usage: 95,
                        memory_usage: 92,
                        disk_usage: 98,
                        request_count_24h: 15420,
                        error_rate_24h: 8.5,
                        avg_response_time: 500,
                    },
                    loading: false,
                    error: null,
                },
                fetchOverviewData: jest.fn(),
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
                story: 'Shows how the component adapts to mobile screen sizes with stacked layout.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockStore = {
                systemStats: {
                    data: {
                        users: { total: 1250, active: 1180, verified: 1200 },
                        files: { total: 3450, completed: 3200, processing: 150, failed: 100 },
                        financial: { statements: 890, parameters: 2340 },
                    },
                    loading: false,
                    error: null,
                },
                userActivity: {
                    data: [
                        {
                            user_id: 1,
                            username: 'admin@example.com',
                            last_login: new Date().toISOString(),
                            login_count: 45,
                            is_active: true,
                        },
                        {
                            user_id: 2,
                            username: 'user1@example.com',
                            last_login: new Date(Date.now() - 3600000).toISOString(),
                            login_count: 23,
                            is_active: true,
                        },
                    ],
                    loading: false,
                    error: null,
                },
                systemMetrics: {
                    data: {
                        cpu_usage: 35,
                        memory_usage: 45,
                        disk_usage: 60,
                        request_count_24h: 15420,
                        error_rate_24h: 0.5,
                        avg_response_time: 120,
                    },
                    loading: false,
                    error: null,
                },
                fetchOverviewData: jest.fn(),
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
                systemStats: {
                    data: {
                        users: { total: 1250, active: 1180, verified: 1200 },
                        files: { total: 3450, completed: 3200, processing: 150, failed: 100 },
                        financial: { statements: 890, parameters: 2340 },
                    },
                    loading: false,
                    error: null,
                },
                userActivity: {
                    data: [
                        {
                            user_id: 1,
                            username: 'admin@example.com',
                            last_login: new Date().toISOString(),
                            login_count: 45,
                            is_active: true,
                        },
                        {
                            user_id: 2,
                            username: 'user1@example.com',
                            last_login: new Date(Date.now() - 3600000).toISOString(),
                            login_count: 23,
                            is_active: true,
                        },
                    ],
                    loading: false,
                    error: null,
                },
                systemMetrics: {
                    data: {
                        cpu_usage: 35,
                        memory_usage: 45,
                        disk_usage: 60,
                        request_count_24h: 15420,
                        error_rate_24h: 0.5,
                        avg_response_time: 120,
                    },
                    loading: false,
                    error: null,
                },
                fetchOverviewData: jest.fn(),
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
                story: 'Shows the component on wide desktop screens with full layout.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockStore = {
                systemStats: {
                    data: {
                        users: { total: 1250, active: 1180, verified: 1200 },
                        files: { total: 3450, completed: 3200, processing: 150, failed: 100 },
                        financial: { statements: 890, parameters: 2340 },
                    },
                    loading: false,
                    error: null,
                },
                userActivity: {
                    data: [
                        {
                            user_id: 1,
                            username: 'admin@example.com',
                            last_login: new Date().toISOString(),
                            login_count: 45,
                            is_active: true,
                        },
                        {
                            user_id: 2,
                            username: 'user1@example.com',
                            last_login: new Date(Date.now() - 3600000).toISOString(),
                            login_count: 23,
                            is_active: true,
                        },
                    ],
                    loading: false,
                    error: null,
                },
                systemMetrics: {
                    data: {
                        cpu_usage: 35,
                        memory_usage: 45,
                        disk_usage: 60,
                        request_count_24h: 15420,
                        error_rate_24h: 0.5,
                        avg_response_time: 120,
                    },
                    loading: false,
                    error: null,
                },
                fetchOverviewData: jest.fn(),
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
                systemStats: {
                    data: {
                        users: { total: 1250, active: 1180, verified: 1200 },
                        files: { total: 3450, completed: 3200, processing: 150, failed: 100 },
                        financial: { statements: 890, parameters: 2340 },
                    },
                    loading: false,
                    error: null,
                },
                userActivity: {
                    data: [
                        {
                            user_id: 1,
                            username: 'admin@example.com',
                            last_login: new Date().toISOString(),
                            login_count: 45,
                            is_active: true,
                        },
                        {
                            user_id: 2,
                            username: 'user1@example.com',
                            last_login: new Date(Date.now() - 3600000).toISOString(),
                            login_count: 23,
                            is_active: true,
                        },
                    ],
                    loading: false,
                    error: null,
                },
                systemMetrics: {
                    data: {
                        cpu_usage: 35,
                        memory_usage: 45,
                        disk_usage: 60,
                        request_count_24h: 15420,
                        error_rate_24h: 0.5,
                        avg_response_time: 120,
                    },
                    loading: false,
                    error: null,
                },
                fetchOverviewData: jest.fn(),
            };
            (useAdminStore as jest.Mock).mockReturnValue(mockStore);
            return <Story />;
        },
    ],
};

// PERFORMANCE STORIES
export const WithLargeDatasets: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Shows the component handling large datasets with many users and high metrics.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockStore = {
                systemStats: {
                    data: {
                        users: { total: 50000, active: 48000, verified: 49000 },
                        files: { total: 150000, completed: 145000, processing: 3000, failed: 2000 },
                        financial: { statements: 25000, parameters: 75000 },
                    },
                    loading: false,
                    error: null,
                },
                userActivity: {
                    data: Array.from({ length: 20 }, (_, i) => ({
                        user_id: i + 1,
                        username: `user${i + 1}@example.com`,
                        last_login: new Date(Date.now() - i * 3600000).toISOString(),
                        login_count: Math.floor(Math.random() * 100) + 1,
                        is_active: Math.random() > 0.2,
                    })),
                    loading: false,
                    error: null,
                },
                systemMetrics: {
                    data: {
                        cpu_usage: 85,
                        memory_usage: 78,
                        disk_usage: 92,
                        request_count_24h: 500000,
                        error_rate_24h: 1.2,
                        avg_response_time: 180,
                    },
                    loading: false,
                    error: null,
                },
                fetchOverviewData: jest.fn(),
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
                story: 'Shows the component with real-time data updates and live metrics.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockStore = {
                systemStats: {
                    data: {
                        users: { total: 1250, active: 1180, verified: 1200 },
                        files: { total: 3450, completed: 3200, processing: 150, failed: 100 },
                        financial: { statements: 890, parameters: 2340 },
                    },
                    loading: false,
                    error: null,
                },
                userActivity: {
                    data: [
                        {
                            user_id: 1,
                            username: 'admin@example.com',
                            last_login: new Date().toISOString(),
                            login_count: 45,
                            is_active: true,
                        },
                        {
                            user_id: 2,
                            username: 'user1@example.com',
                            last_login: new Date(Date.now() - 3600000).toISOString(),
                            login_count: 23,
                            is_active: true,
                        },
                    ],
                    loading: false,
                    error: null,
                },
                systemMetrics: {
                    data: {
                        cpu_usage: 35,
                        memory_usage: 45,
                        disk_usage: 60,
                        request_count_24h: 15420,
                        error_rate_24h: 0.5,
                        avg_response_time: 120,
                    },
                    loading: false,
                    error: null,
                },
                fetchOverviewData: jest.fn(),
            };
            (useAdminStore as jest.Mock).mockReturnValue(mockStore);
            return <Story />;
        },
    ],
};
