import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// Test Providers
import { AdminDashboardProvider } from '../../state/AdminDashboardProvider';

// Mock data factories
export const createMockUser = (overrides = {}) => ({
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: ['user'],
    status: 'active' as const,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    permissions: ['read'],
    ...overrides,
});

export const createMockUserAnalytics = (overrides = {}) => ({
    totalUsers: 100,
    activeUsers: 85,
    newUsers: 10,
    userGrowth: 5.2,
    averageSessionDuration: 1200,
    retentionRate: 0.85,
    ...overrides,
});

export const createMockUserActivity = (overrides = {}) => ({
    id: 'activity-1',
    userId: 'user-1',
    type: 'login' as const,
    description: 'User logged in',
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    ...overrides,
});

export const createMockSystemMetric = (overrides = {}) => ({
    id: 'metric-1',
    name: 'CPU Usage',
    value: 75.5,
    unit: '%',
    status: 'warning' as const,
    trend: 'up' as const,
    timestamp: new Date().toISOString(),
    ...overrides,
});

export const createMockSystemAlert = (overrides = {}) => ({
    id: 'alert-1',
    type: 'warning' as const,
    title: 'High CPU Usage',
    message: 'CPU usage is above 80%',
    severity: 'medium' as const,
    timestamp: new Date().toISOString(),
    acknowledged: false,
    ...overrides,
});

export const createMockLogEntry = (overrides = {}) => ({
    id: 'log-1',
    level: 'ERROR' as const,
    message: 'Database connection failed',
    module: 'database',
    timestamp: new Date().toISOString(),
    userId: null,
    metadata: {},
    ...overrides,
});

export const createMockMaintenanceOperation = (overrides = {}) => ({
    id: 'op-1',
    type: 'cleanup' as const,
    name: 'Database Cleanup',
    description: 'Clean up old records',
    status: 'completed' as const,
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    duration: 300,
    ...overrides,
});

export const createMockWidget = (overrides = {}) => ({
    id: 'widget-1',
    type: 'metric' as const,
    title: 'User Metrics',
    size: 'medium' as const,
    position: { x: 0, y: 0 },
    config: {},
    ...overrides,
});

// Mock API responses
export const mockApiResponses = {
    users: {
        users: [createMockUser(), createMockUser({ id: 'user-2', username: 'user2' })],
        total: 2,
    },
    userAnalytics: createMockUserAnalytics(),
    userActivity: [createMockUserActivity(), createMockUserActivity({ id: 'activity-2' })],
    systemMetrics: [createMockSystemMetric(), createMockSystemMetric({ id: 'metric-2' })],
    systemAlerts: [createMockSystemAlert(), createMockSystemAlert({ id: 'alert-2' })],
    logs: {
        items: [createMockLogEntry(), createMockLogEntry({ id: 'log-2' })],
        total: 2,
        skip: 0,
        limit: 10,
    },
    maintenanceOperations: [createMockMaintenanceOperation(), createMockMaintenanceOperation({ id: 'op-2' })],
    widgets: [createMockWidget(), createMockWidget({ id: 'widget-2' })],
};

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(AdminDashboardProvider, {}, children);
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock service functions
export const mockAdminServices = {
    getUsers: vi.fn().mockResolvedValue(mockApiResponses.users),
    getUserAnalytics: vi.fn().mockResolvedValue(mockApiResponses.userAnalytics),
    getUserActivity: vi.fn().mockResolvedValue(mockApiResponses.userActivity),
    getSystemMetrics: vi.fn().mockResolvedValue(mockApiResponses.systemMetrics),
    getSystemAlerts: vi.fn().mockResolvedValue(mockApiResponses.systemAlerts),
    getSystemLogs: vi.fn().mockResolvedValue(mockApiResponses.logs),
    getMaintenanceOperations: vi.fn().mockResolvedValue(mockApiResponses.maintenanceOperations),
    getWidgets: vi.fn().mockResolvedValue(mockApiResponses.widgets),
    updateUser: vi.fn().mockResolvedValue(createMockUser()),
    deleteUser: vi.fn().mockResolvedValue({ success: true }),
    updateWidget: vi.fn().mockResolvedValue(createMockWidget()),
};

// Test helpers
export const waitForLoadingToFinish = async () => {
    // Wait for any loading spinners to disappear
    const loadingSpinners = screen.queryAllByTestId('loading-spinner');
    if (loadingSpinners.length > 0) {
        await waitFor(() => {
            expect(screen.queryAllByTestId('loading-spinner')).toHaveLength(0);
        });
    }
};

export const waitForDataToLoad = async () => {
    // Wait for data to be loaded and displayed
    await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render };
export { userEvent };
export { vi };
