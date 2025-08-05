import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as CustomThemeProvider } from '../components/theme-provider';
import { vi } from 'vitest';

// Mock the useAuth hook but preserve other exports like AuthProvider
vi.mock('../contexts/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('../contexts/AuthContext')>(
    '../contexts/AuthContext'
  );
  return {
    ...actual,
    useAuth: () => ({
      user: null,
      token: null,
      permissions: [],
      roles: [],
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      refreshToken: vi.fn(),
      updateUser: vi.fn(),
      hasPermission: vi.fn(() => false),
      hasRole: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
      isAnalyst: vi.fn(() => false),
      isLoading: false,
      isAuthenticated: false,
    }),
  };
});

// Create a new QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0, // Use cacheTime for compatibility
      },
      mutations: {
        retry: false,
      },
    },
  });

// Mock auth context
const mockAuthContext = {
  user: null,
  token: null,
  permissions: [],
  roles: [],
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  refreshToken: vi.fn(),
  updateUser: vi.fn(),
  hasPermission: vi.fn(() => false),
  hasRole: vi.fn(() => false),
  isAdmin: vi.fn(() => false),
  isAnalyst: vi.fn(() => false),
  isLoading: false,
  isAuthenticated: false,
};

// Removed unused MockAuthProvider to fix linting error

interface ProviderProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
  withRouter?: boolean;
}

const AllTheProviders: React.FC<ProviderProps> = ({
  children,
  queryClient = createTestQueryClient(),
  withRouter = true,
}) => {
  const content = (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>{children}</CustomThemeProvider>
    </QueryClientProvider>
  );

  return withRouter ? <BrowserRouter>{content}</BrowserRouter> : content;
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  route?: string;
  withRouter?: boolean;
  skipRouterWrap?: boolean; // New option to skip router wrapping for App component
}

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const { queryClient, route = '/', withRouter = true, skipRouterWrap = false, ...renderOptions } = options;

  // Set the initial route if provided
  if (route !== '/') {
    window.history.pushState({}, 'Test page', route);
  }

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // If skipRouterWrap is true, don't wrap in router (for App component)
    if (skipRouterWrap) {
      return (
        <QueryClientProvider client={queryClient || createTestQueryClient()}>
          <CustomThemeProvider>{children}</CustomThemeProvider>
        </QueryClientProvider>
      );
    }

    return (
      <AllTheProviders queryClient={queryClient} withRouter={withRouter}>
        {children}
      </AllTheProviders>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock API responses
export const mockApiResponses = {
  auth: {
    login: {
      access_token: 'mock-jwt-token',
      token_type: 'bearer',
      expires_in: 3600,
    },
    user: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      full_name: 'Test User',
      is_active: true,
      is_admin: false,
    },
  },
  files: [
    {
      id: 1,
      filename: 'test.xlsx',
      original_filename: 'test.xlsx',
      stored_filename: 'stored-test.xlsx',
      file_size: 1024 * 1024, // 1MB
      file_type: 'xlsx',
      created_at: '2023-01-01T00:00:00Z',
      status: 'completed',
      processing_status: 'completed',
    },
    {
      id: 2,
      filename: 'sample.xlsx',
      original_filename: 'sample.xlsx',
      stored_filename: 'stored-sample.xlsx',
      file_size: 2048 * 1024, // 2MB
      file_type: 'xlsx',
      created_at: '2023-01-02T00:00:00Z',
      status: 'pending',
      processing_status: 'pending',
    },
    {
      id: 3,
      filename: 'data.xlsx',
      original_filename: 'data.xlsx',
      stored_filename: 'stored-data.xlsx',
      file_size: 512 * 1024, // 512KB
      file_type: 'xlsx',
      created_at: '2023-01-03T00:00:00Z',
      status: 'processing',
      processing_status: 'processing',
    },
  ],
  parameters: [
    {
      id: 1,
      name: 'Growth Rate',
      value: 0.15,
      category: 'assumptions',
      description: 'Annual revenue growth rate',
    },
  ],
  reports: [
    {
      id: 1,
      name: 'Financial Analysis Report',
      type: 'financial_analysis',
      created_date: '2023-01-01T00:00:00Z',
      file_url: '/reports/1/download',
    },
  ],
  dashboard: {
    metrics: {
      total_files: 5,
      total_parameters: 10,
      total_reports: 3,
      last_upload: '2023-01-01T00:00:00Z',
    },
    charts: {
      revenue_trend: [
        { period: 'Q1 2023', value: 1000000 },
        { period: 'Q2 2023', value: 1200000 },
        { period: 'Q3 2023', value: 1100000 },
      ],
      expense_breakdown: [
        { category: 'COGS', value: 600000 },
        { category: 'Operating', value: 250000 },
        { category: 'Other', value: 50000 },
      ],
    },
  },
};

// Mock data generators
export const createMockUser = (
  overrides: Partial<typeof mockApiResponses.auth.user> = {}
) => ({
  ...mockApiResponses.auth.user,
  ...overrides,
});

export const createMockFile = (
  overrides: Partial<(typeof mockApiResponses.files)[0]> = {}
) => ({
  ...mockApiResponses.files[0],
  ...overrides,
});

export const createMockParameter = (
  overrides: Partial<(typeof mockApiResponses.parameters)[0]> = {}
) => ({
  ...mockApiResponses.parameters[0],
  ...overrides,
});

// Mock axios for API calls
const mockAxiosInstance = {
  get: vi.fn().mockResolvedValue({
    data: {
      overview: {
        total_files: 25,
        completed_files: 20,
        failed_files: 5,
        success_rate: 80,
        average_processing_time_minutes: 2.5,
        total_size_mb: 150,
      },
      daily_trends: [
        { date: '2023-01-01', total_files: 5, completed_files: 4, failed_files: 1, success_rate: 80, total_size_mb: 30 },
        { date: '2023-01-02', total_files: 8, completed_files: 7, failed_files: 1, success_rate: 87.5, total_size_mb: 45 },
      ],
      file_type_distribution: {
        distribution: [
          { file_type: 'xlsx', count: 15, percentage: 60, average_size_mb: 8 },
          { file_type: 'csv', count: 10, percentage: 40, average_size_mb: 3 },
        ],
      },
      top_users: [
        { username: 'user1', total_uploads: 10, success_rate: 90 },
        { username: 'user2', total_uploads: 8, success_rate: 75 },
      ],
      error_summary: {
        total_errors: 5,
        top_error_categories: [
          { category: 'Format Error', count: 3 },
          { category: 'Size Limit', count: 2 },
        ],
      },
      performance_summary: {
        avg_processing_time: 2.5,
        throughput: 10,
      },
    },
  }),
  post: vi.fn().mockResolvedValue({ data: { success: true } }),
  put: vi.fn().mockResolvedValue({ data: { success: true } }),
  delete: vi.fn().mockResolvedValue({ data: { success: true } }),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  }
};

vi.mock('axios', () => ({
  default: {
    ...mockAxiosInstance,
    create: vi.fn(() => mockAxiosInstance),
  },
}));

// Mock fetch for API calls
export const mockFetch = (response: unknown, status = 200) => {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(response),
    text: vi.fn().mockResolvedValue(JSON.stringify(response)),
  });
};

// Helper to create mock files for testing
export const createMockFileList = (files: File[]) => {
  const input = document.createElement('input');
  Object.defineProperty(input, 'files', {
    value: files,
    writable: false,
  });
  return input.files;
};

export const createMockFileObject = (
  name = 'test.xlsx',
  size = 1024,
  type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
): File => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Helper to wait for async operations
export const waitFor = (callback: () => void, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      try {
        callback();
        resolve(true);
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(error);
        } else {
          setTimeout(check, 50);
        }
      }
    };

    check();
  });
};

// Helper to simulate user interactions
export const simulateFileUpload = async (
  input: HTMLInputElement,
  files: File[]
) => {
  Object.defineProperty(input, 'files', {
    value: createMockFileList(files),
    writable: false,
  });

  const event = new Event('change', { bubbles: true });
  input.dispatchEvent(event);
};

// Test data factories
export const TestDataFactory = {
  user: createMockUser,
  file: createMockFile,
  parameter: createMockParameter,

  financialData: () => ({
    income_statement: [
      { account: 'Revenue', q1_2023: 1000000, q2_2023: 1200000 },
      { account: 'COGS', q1_2023: -600000, q2_2023: -720000 },
      { account: 'Gross Profit', q1_2023: 400000, q2_2023: 480000 },
    ],
    balance_sheet: [
      { account: 'Cash', q1_2023: 500000, q2_2023: 600000 },
      { account: 'Accounts Receivable', q1_2023: 200000, q2_2023: 240000 },
    ],
  }),

  chartData: () => ({
    labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'],
    datasets: [
      {
        label: 'Revenue',
        data: [1000000, 1200000, 1100000, 1300000],
        backgroundColor: 'rgba(25, 118, 210, 0.5)',
        borderColor: 'rgba(25, 118, 210, 1)',
      },
    ],
  }),
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export * from '@testing-library/user-event';

// Export custom render as default
export { customRender as render };

// Export the mock contexts
export { mockAuthContext, createTestQueryClient };
