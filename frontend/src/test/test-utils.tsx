import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider as CustomThemeProvider } from '../contexts/ThemeContext';
import { createTheme } from '@mui/material/styles';

// Create a test theme
const testTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Create a new QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // Previously cacheTime
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
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  isLoading: false,
  isAuthenticated: false,
};

// Removed unused MockAuthProvider to fix linting error

const AllTheProviders: React.FC<{
  children: React.ReactNode;
  queryClient?: QueryClient;
  authContext?: typeof mockAuthContext;
}> = ({
  children,
  queryClient = createTestQueryClient(),
  authContext = mockAuthContext,
}) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={testTheme}>
          <CustomThemeProvider>
            <CssBaseline />
            <AuthProvider value={authContext}>{children}</AuthProvider>
          </CustomThemeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  authContext?: typeof mockAuthContext;
  route?: string;
}

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const { queryClient, authContext, route = '/', ...renderOptions } = options;

  // Set the initial route if provided
  if (route !== '/') {
    window.history.pushState({}, 'Test page', route);
  }

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AllTheProviders queryClient={queryClient} authContext={authContext}>
      {children}
    </AllTheProviders>
  );

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
      original_filename: 'test.xlsx',
      stored_filename: 'stored-test.xlsx',
      file_size: 1024,
      upload_date: '2023-01-01T00:00:00Z',
      processing_status: 'completed',
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

// Mock fetch for API calls
export const mockFetch = (response: any, status = 200) => {
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(response),
    text: jest.fn().mockResolvedValue(JSON.stringify(response)),
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
