/**
 * Overview Section Tests
 * 
 * Tests for the modular overview section component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OverviewSection } from '../OverviewSection';
import { useAdminStore } from '../../../stores/adminStore';

// Mock the admin store
vi.mock('../../../stores/adminStore');
const mockUseAdminStore = vi.mocked(useAdminStore);

// Mock components that might cause issues in tests
vi.mock('../../../components/ui/LoadingSkeleton', () => ({
  StatsSkeleton: () => <div data-testid="stats-skeleton">Loading stats...</div>,
  CardSkeleton: () => <div data-testid="card-skeleton">Loading card...</div>,
}));

vi.mock('../../../components/ErrorBoundary', () => ({
  AdminSectionErrorBoundary: ({ children, onRetry }: any) => (
    <div data-testid="error-boundary">
      {children}
      <button onClick={onRetry} data-testid="retry-button">Retry</button>
    </div>
  ),
}));

// Sample test data
const mockSystemStats = {
  data: {
    users: { total: 100, active: 80, verified: 75, new_24h: 5 },
    files: { total: 1000, completed: 950, processing: 30, failed: 20 },
    financial_data: { statements: 500, parameters: 200 },
    system: { database_size: '2.5 GB', timestamp: '2023-01-01T00:00:00Z' },
    performance: { avg_file_size_mb: 1.2 },
  },
  loading: false,
  error: null,
  lastUpdated: Date.now(),
};

const mockUserActivity = {
  data: [
    {
      user_id: 1,
      username: 'john_doe',
      last_login: '2023-01-01T12:00:00Z',
      login_count: 25,
      files_uploaded: 10,
      models_created: 5,
      is_active: true,
    },
    {
      user_id: 2,
      username: 'jane_smith',
      last_login: '2023-01-01T10:30:00Z',
      login_count: 15,
      files_uploaded: 8,
      models_created: 3,
      is_active: true,
    },
  ],
  loading: false,
  error: null,
  lastUpdated: Date.now(),
};

const mockSystemMetrics = {
  data: {
    cpu_usage: 45.2,
    memory_usage: 67.8,
    disk_usage: 23.1,
    active_connections: 15,
    request_count_24h: 1234,
  },
  loading: false,
  error: null,
  lastUpdated: Date.now(),
};

const defaultMockStore = {
  systemStats: mockSystemStats,
  userActivity: mockUserActivity,
  systemMetrics: mockSystemMetrics,
  securityAudit: { data: null, loading: false, error: null, lastUpdated: null },
  fetchOverviewData: vi.fn(),
};

describe('OverviewSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdminStore.mockReturnValue(defaultMockStore);
  });

  describe('Loading States', () => {
    it('should show loading skeleton when data is loading', () => {
      mockUseAdminStore.mockReturnValue({
        ...defaultMockStore,
        systemStats: { data: null, loading: true, error: null, lastUpdated: null },
        userActivity: { data: null, loading: true, error: null, lastUpdated: null },
        systemMetrics: { data: null, loading: true, error: null, lastUpdated: null },
      });

      render(<OverviewSection />);

      expect(screen.getByTestId('stats-skeleton')).toBeInTheDocument();
    });

    it('should not show loading skeleton when data exists', () => {
      render(<OverviewSection />);

      expect(screen.queryByTestId('stats-skeleton')).not.toBeInTheDocument();
    });
  });

  describe('System Statistics Display', () => {
    it('should display system statistics correctly', () => {
      render(<OverviewSection />);

      // Check for user stats
      expect(screen.getByText('100')).toBeInTheDocument(); // Total users
      expect(screen.getByText('80 active • 75 verified')).toBeInTheDocument();
      expect(screen.getByText('+5')).toBeInTheDocument(); // New users

      // Check for file stats
      expect(screen.getByText('1,000')).toBeInTheDocument(); // Total files
      expect(screen.getByText('950 completed • 30 processing')).toBeInTheDocument();

      // Check for financial data
      expect(screen.getByText('500')).toBeInTheDocument(); // Statements
      expect(screen.getByText('200 parameters')).toBeInTheDocument();

      // Check for storage
      expect(screen.getByText('2.5 GB')).toBeInTheDocument();
      expect(screen.getByText('Avg file: 1.2 MB')).toBeInTheDocument();
    });

    it('should handle missing data gracefully', () => {
      mockUseAdminStore.mockReturnValue({
        ...defaultMockStore,
        systemStats: {
          data: {
            users: { total: 0, active: 0, verified: 0, new_24h: 0 },
            files: { total: 0, completed: 0, processing: 0, failed: 0 },
            financial_data: { statements: 0, parameters: 0 },
            system: { database_size: '', timestamp: '' },
            performance: { avg_file_size_mb: 0 },
          },
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        },
      });

      render(<OverviewSection />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('0 active • 0 verified')).toBeInTheDocument();
    });

    it('should display progress bars with correct percentages', () => {
      render(<OverviewSection />);

      // User activity percentage: (80/100) * 100 = 80%
      expect(screen.getByText('80% active')).toBeInTheDocument();

      // File completion percentage: (950/1000) * 100 = 95%
      expect(screen.getByText('95% done')).toBeInTheDocument();
    });
  });

  describe('System Health Indicators', () => {
    it('should show green indicators for healthy metrics', () => {
      render(<OverviewSection />);

      // All metrics are below warning thresholds, should be green
      const cpuIndicator = screen.getByText('CPU').previousSibling;
      const memoryIndicator = screen.getByText('Memory').previousSibling;
      const storageIndicator = screen.getByText('Storage').previousSibling;

      expect(cpuIndicator).toHaveClass('bg-green-500');
      expect(memoryIndicator).toHaveClass('bg-yellow-500'); // 67.8% > 60%
      expect(storageIndicator).toHaveClass('bg-green-500');
    });

    it('should show warning indicators for medium usage', () => {
      mockUseAdminStore.mockReturnValue({
        ...defaultMockStore,
        systemMetrics: {
          ...mockSystemMetrics,
          data: {
            ...mockSystemMetrics.data,
            cpu_usage: 75, // Above 60% warning threshold
            memory_usage: 65,
          },
        },
      });

      render(<OverviewSection />);

      const cpuIndicator = screen.getByText('CPU').previousSibling;
      const memoryIndicator = screen.getByText('Memory').previousSibling;

      expect(cpuIndicator).toHaveClass('bg-yellow-500');
      expect(memoryIndicator).toHaveClass('bg-yellow-500');
    });

    it('should show critical indicators for high usage', () => {
      mockUseAdminStore.mockReturnValue({
        ...defaultMockStore,
        systemMetrics: {
          ...mockSystemMetrics,
          data: {
            ...mockSystemMetrics.data,
            cpu_usage: 85, // Above 80% critical threshold
            disk_usage: 90,
          },
        },
      });

      render(<OverviewSection />);

      const cpuIndicator = screen.getByText('CPU').previousSibling;
      const storageIndicator = screen.getByText('Storage').previousSibling;

      expect(cpuIndicator).toHaveClass('bg-red-500');
      expect(storageIndicator).toHaveClass('bg-red-500');
    });
  });

  describe('Performance Metrics', () => {
    it('should display performance metrics correctly', () => {
      render(<OverviewSection />);

      expect(screen.getByText('45.2%')).toBeInTheDocument(); // CPU usage
      expect(screen.getByText('67.8%')).toBeInTheDocument(); // Memory usage
      expect(screen.getByText('23.1%')).toBeInTheDocument(); // Disk usage
      expect(screen.getByText('15')).toBeInTheDocument(); // DB connections
      expect(screen.getByText('1,234')).toBeInTheDocument(); // Requests
    });

    it('should handle null values in metrics', () => {
      mockUseAdminStore.mockReturnValue({
        ...defaultMockStore,
        systemMetrics: {
          ...mockSystemMetrics,
          data: {
            ...mockSystemMetrics.data,
            cpu_usage: null,
            memory_usage: undefined,
          },
        },
      });

      render(<OverviewSection />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('User Activity Section', () => {
    it('should display user activity when data is available', () => {
      render(<OverviewSection />);

      expect(screen.getByText('Recent User Activity')).toBeInTheDocument();
      expect(screen.getByText('john_doe')).toBeInTheDocument();
      expect(screen.getByText('jane_smith')).toBeInTheDocument();
      expect(screen.getByText('25 logins • 10 files • 5 models')).toBeInTheDocument();
    });

    it('should not show user activity section when no data', () => {
      mockUseAdminStore.mockReturnValue({
        ...defaultMockStore,
        userActivity: {
          data: [],
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        },
      });

      render(<OverviewSection />);

      expect(screen.queryByText('Recent User Activity')).not.toBeInTheDocument();
    });

    it('should display activity summary correctly', () => {
      render(<OverviewSection />);

      // Active users: 2 (both users are active)
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Active Users')).toBeInTheDocument();

      // Files uploaded: 10 + 8 = 18
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('Files Uploaded')).toBeInTheDocument();

      // Models created: 5 + 3 = 8
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('Models Created')).toBeInTheDocument();
    });

    it('should limit displayed users to 6', () => {
      const manyUsers = Array.from({ length: 10 }, (_, i) => ({
        user_id: i + 1,
        username: `user_${i + 1}`,
        last_login: '2023-01-01T12:00:00Z',
        login_count: 10,
        files_uploaded: 5,
        models_created: 2,
        is_active: true,
      }));

      mockUseAdminStore.mockReturnValue({
        ...defaultMockStore,
        userActivity: {
          ...mockUserActivity,
          data: manyUsers,
        },
      });

      render(<OverviewSection />);

      // Should only show first 6 users
      expect(screen.getByText('user_1')).toBeInTheDocument();
      expect(screen.getByText('user_6')).toBeInTheDocument();
      expect(screen.queryByText('user_7')).not.toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should show unavailable message when no data is present', () => {
      mockUseAdminStore.mockReturnValue({
        ...defaultMockStore,
        systemStats: { data: null, loading: false, error: null, lastUpdated: null },
        userActivity: { data: null, loading: false, error: null, lastUpdated: null },
        systemMetrics: { data: null, loading: false, error: null, lastUpdated: null },
      });

      render(<OverviewSection />);

      expect(screen.getByText('Admin data is currently unavailable. Please try refreshing the page or check your connection.')).toBeInTheDocument();
    });
  });

  describe('Error Boundary Integration', () => {
    it('should wrap content in error boundary', () => {
      render(<OverviewSection />);

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });

    it('should call fetchOverviewData when retry is clicked', async () => {
      const user = userEvent.setup();
      const mockFetchOverviewData = vi.fn();

      mockUseAdminStore.mockReturnValue({
        ...defaultMockStore,
        fetchOverviewData: mockFetchOverviewData,
      });

      render(<OverviewSection />);

      await user.click(screen.getByTestId('retry-button'));

      expect(mockFetchOverviewData).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<OverviewSection />);

      // Check for proper heading structure
      expect(screen.getByRole('heading', { name: /System Status/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Performance/i })).toBeInTheDocument();
    });

    it('should have keyboard accessible buttons', () => {
      render(<OverviewSection />);

      const viewAllButton = screen.getByRole('button', { name: /View All/i });
      expect(viewAllButton).toBeInTheDocument();
      expect(viewAllButton).not.toHaveAttribute('disabled');
    });
  });

  describe('Data Formatting', () => {
    it('should format numbers with commas', () => {
      mockUseAdminStore.mockReturnValue({
        ...defaultMockStore,
        systemStats: {
          ...mockSystemStats,
          data: {
            ...mockSystemStats.data,
            users: { total: 1234567, active: 1000000, verified: 500000, new_24h: 100 },
          },
        },
      });

      render(<OverviewSection />);

      expect(screen.getByText('1,234,567')).toBeInTheDocument();
    });

    it('should handle zero values correctly', () => {
      mockUseAdminStore.mockReturnValue({
        ...defaultMockStore,
        systemStats: {
          ...mockSystemStats,
          data: {
            ...mockSystemStats.data,
            users: { total: 0, active: 0, verified: 0, new_24h: 0 },
          },
        },
      });

      render(<OverviewSection />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('0% active')).toBeInTheDocument();
    });

    it('should handle null/undefined values gracefully', () => {
      mockUseAdminStore.mockReturnValue({
        ...defaultMockStore,
        systemStats: {
          data: {
            users: { total: null, active: undefined, verified: 0, new_24h: 0 },
            files: { total: 0, completed: 0, processing: 0, failed: 0 },
            financial_data: { statements: 0, parameters: 0 },
            system: { database_size: null, timestamp: '' },
            performance: { avg_file_size_mb: undefined },
          },
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        },
      });

      render(<OverviewSection />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });
});
