/**
 * Admin Dashboard Test Suite
 *
 * Comprehensive test coverage for all Admin Dashboard features
 * Organized by feature-based architecture with performance and integration tests
 */

// Test Utilities
export * from './utils/testUtils';

// Feature Tests
export * from './features/user-management/UserManagement.test';
export * from './features/system-monitoring/SystemMonitoring.test';

// Integration Tests
export * from './integration/AdminDashboard.integration.test';

// Performance Tests
export * from './performance/AdminDashboard.performance.test';

// Test Configuration
export const testConfig = {
  // Performance budgets
  performance: {
    initialLoad: 2000, // 2 seconds
    firstContentfulPaint: 1000, // 1 second
    componentRender: 500, // 500ms
    tabSwitch: 300, // 300ms
    largeDatasetRender: 3000, // 3 seconds
    rapidUpdates: 5000, // 5 seconds
    keyboardNavigation: 500, // 500ms
    concurrentOperations: 1000, // 1 second
    rapidTabSwitching: 5000, // 5 seconds
  },

  // Memory budgets
  memory: {
    maxIncrease: 10 * 1024 * 1024, // 10MB
    maxAfterUnmount: 5 * 1024 * 1024, // 5MB
  },

  // API call budgets
  api: {
    maxInitialCalls: 4,
    maxSearchCalls: 2, // Initial + 1 search
  },

  // Test data sizes
  data: {
    largeDataset: 10000,
    stressTestIterations: 50,
    rapidUpdateIterations: 100,
  },
};

// Test Coverage Targets
export const coverageTargets = {
  statements: 90,
  branches: 85,
  functions: 90,
  lines: 90,
};

// Test Categories
export const testCategories = {
  unit: 'Unit tests for individual components and functions',
  integration: 'Integration tests for feature interactions',
  performance: 'Performance tests for load times and memory usage',
  accessibility: 'Accessibility tests for keyboard navigation and ARIA',
  e2e: 'End-to-end tests for complete user workflows',
};

// Test Environment Setup
export const setupTestEnvironment = () => {
  // Mock browser APIs
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock performance API
  Object.defineProperty(global, 'performance', {
    value: {
      now: vi.fn(() => Date.now()),
      mark: vi.fn(),
      measure: vi.fn(),
      clearMarks: vi.fn(),
      clearMeasures: vi.fn(),
      getEntriesByName: vi.fn(() => []),
      memory: {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0,
      },
    },
    writable: true,
  });
};

// Test Data Factories
export const createTestData = {
  users: (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      id: `user-${i}`,
      username: `user${i}`,
      email: `user${i}@example.com`,
      firstName: `User`,
      lastName: `${i}`,
      roles: ['user'],
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      permissions: ['read'],
    })),

  metrics: (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      id: `metric-${i}`,
      name: `Metric ${i}`,
      value: Math.random() * 100,
      unit: '%',
      status: 'healthy' as const,
      trend: 'stable' as const,
      timestamp: new Date().toISOString(),
    })),

  alerts: (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      id: `alert-${i}`,
      type: 'warning' as const,
      title: `Alert ${i}`,
      message: `This is alert ${i}`,
      severity: 'medium' as const,
      timestamp: new Date().toISOString(),
      acknowledged: false,
    })),
};

// Test Helpers
export const testHelpers = {
  waitForLoading: async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  },

  waitForData: async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  },

  clickTab: async (tabName: string) => {
    const tab = screen.getByRole('tab', { name: new RegExp(tabName, 'i') });
    await userEvent.click(tab);
  },

  searchUsers: async (searchTerm: string) => {
    const searchInput = screen.getByPlaceholderText(/search users/i);
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, searchTerm);
  },

  updateUser: async (userId: string, updates: Record<string, any>) => {
    const editButton = screen.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton);

    // Update fields
    for (const [field, value] of Object.entries(updates)) {
      const input = screen.getByDisplayValue(new RegExp(field, 'i'));
      await userEvent.clear(input);
      await userEvent.type(input, value);
    }

    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);
  },
};
