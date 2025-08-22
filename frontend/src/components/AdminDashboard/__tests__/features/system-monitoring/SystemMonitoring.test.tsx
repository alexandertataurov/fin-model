import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SystemMonitoring } from '../../../features/system-monitoring';
import {
  createMockSystemMetric,
  createMockSystemAlert,
  mockAdminServices,
} from '../../utils/testUtils';

// Mock the admin services
vi.mock('@/services/admin', () => ({
  getSystemMetrics: mockAdminServices.getSystemMetrics,
  getSystemAlerts: mockAdminServices.getSystemAlerts,
  getSystemHealth: mockAdminServices.getSystemHealth,
}));

describe('SystemMonitoring Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('System Metrics', () => {
    it('renders system metrics grid', async () => {
      const mockMetrics = [
        createMockSystemMetric({ name: 'CPU Usage', value: 75.5 }),
        createMockSystemMetric({
          id: 'metric-2',
          name: 'Memory Usage',
          value: 60.2,
        }),
      ];

      mockAdminServices.getSystemMetrics.mockResolvedValue(mockMetrics);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText('CPU Usage')).toBeInTheDocument();
        expect(screen.getByText('Memory Usage')).toBeInTheDocument();
        expect(screen.getByText('75.5%')).toBeInTheDocument();
        expect(screen.getByText('60.2%')).toBeInTheDocument();
      });
    });

    it('displays metric status indicators', async () => {
      const mockMetrics = [
        createMockSystemMetric({ status: 'healthy', value: 30 }),
        createMockSystemMetric({
          id: 'metric-2',
          status: 'warning',
          value: 75,
        }),
        createMockSystemMetric({
          id: 'metric-3',
          status: 'critical',
          value: 95,
        }),
      ];

      mockAdminServices.getSystemMetrics.mockResolvedValue(mockMetrics);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByTestId('metric-healthy')).toBeInTheDocument();
        expect(screen.getByTestId('metric-warning')).toBeInTheDocument();
        expect(screen.getByTestId('metric-critical')).toBeInTheDocument();
      });
    });

    it('shows metric trends', async () => {
      const mockMetrics = [
        createMockSystemMetric({ trend: 'up', value: 75 }),
        createMockSystemMetric({ id: 'metric-2', trend: 'down', value: 45 }),
        createMockSystemMetric({ id: 'metric-3', trend: 'stable', value: 60 }),
      ];

      mockAdminServices.getSystemMetrics.mockResolvedValue(mockMetrics);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByTestId('trend-up')).toBeInTheDocument();
        expect(screen.getByTestId('trend-down')).toBeInTheDocument();
        expect(screen.getByTestId('trend-stable')).toBeInTheDocument();
      });
    });

    it('displays loading state for metrics', async () => {
      mockAdminServices.getSystemMetrics.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      render(<SystemMonitoring />);

      expect(screen.getByTestId('metrics-loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId('metrics-loading')).not.toBeInTheDocument();
      });
    });
  });

  describe('System Alerts', () => {
    it('renders system alerts list', async () => {
      const mockAlerts = [
        createMockSystemAlert({ title: 'High CPU Usage', severity: 'medium' }),
        createMockSystemAlert({
          id: 'alert-2',
          title: 'Disk Space Low',
          severity: 'high',
        }),
      ];

      mockAdminServices.getSystemAlerts.mockResolvedValue(mockAlerts);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText('High CPU Usage')).toBeInTheDocument();
        expect(screen.getByText('Disk Space Low')).toBeInTheDocument();
      });
    });

    it('displays alert severity indicators', async () => {
      const mockAlerts = [
        createMockSystemAlert({ severity: 'low' }),
        createMockSystemAlert({ id: 'alert-2', severity: 'medium' }),
        createMockSystemAlert({ id: 'alert-3', severity: 'high' }),
        createMockSystemAlert({ id: 'alert-4', severity: 'critical' }),
      ];

      mockAdminServices.getSystemAlerts.mockResolvedValue(mockAlerts);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByTestId('severity-low')).toBeInTheDocument();
        expect(screen.getByTestId('severity-medium')).toBeInTheDocument();
        expect(screen.getByTestId('severity-high')).toBeInTheDocument();
        expect(screen.getByTestId('severity-critical')).toBeInTheDocument();
      });
    });

    it('allows acknowledging alerts', async () => {
      const mockAlert = createMockSystemAlert({ acknowledged: false });
      mockAdminServices.getSystemAlerts.mockResolvedValue([mockAlert]);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText('High CPU Usage')).toBeInTheDocument();
      });

      // Click acknowledge button
      const acknowledgeButton = screen.getByRole('button', {
        name: /acknowledge/i,
      });
      await userEvent.click(acknowledgeButton);

      // Verify alert is acknowledged
      await waitFor(() => {
        expect(screen.getByTestId('alert-acknowledged')).toBeInTheDocument();
      });
    });

    it('filters alerts by severity', async () => {
      const mockAlerts = [
        createMockSystemAlert({ severity: 'low', title: 'Low Priority Alert' }),
        createMockSystemAlert({
          id: 'alert-2',
          severity: 'high',
          title: 'High Priority Alert',
        }),
      ];

      mockAdminServices.getSystemAlerts.mockResolvedValue(mockAlerts);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText('Low Priority Alert')).toBeInTheDocument();
        expect(screen.getByText('High Priority Alert')).toBeInTheDocument();
      });

      // Filter by high severity
      const severityFilter = screen.getByRole('combobox', {
        name: /filter by severity/i,
      });
      await userEvent.selectOptions(severityFilter, 'high');

      await waitFor(() => {
        expect(screen.getByText('High Priority Alert')).toBeInTheDocument();
        expect(
          screen.queryByText('Low Priority Alert')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('System Health', () => {
    it('displays overall system health status', async () => {
      const mockHealth = {
        status: 'healthy',
        uptime: 86400, // 24 hours in seconds
        lastCheck: new Date().toISOString(),
        components: {
          database: 'healthy',
          api: 'healthy',
          cache: 'warning',
        },
      };

      mockAdminServices.getSystemHealth.mockResolvedValue(mockHealth);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText(/system status: healthy/i)).toBeInTheDocument();
        expect(screen.getByText(/uptime: 24h/i)).toBeInTheDocument();
      });
    });

    it('shows component health status', async () => {
      const mockHealth = {
        status: 'warning',
        uptime: 3600,
        lastCheck: new Date().toISOString(),
        components: {
          database: 'healthy',
          api: 'warning',
          cache: 'critical',
        },
      };

      mockAdminServices.getSystemHealth.mockResolvedValue(mockHealth);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText('database: healthy')).toBeInTheDocument();
        expect(screen.getByText('api: warning')).toBeInTheDocument();
        expect(screen.getByText('cache: critical')).toBeInTheDocument();
      });
    });

    it('displays health check timestamp', async () => {
      const mockHealth = {
        status: 'healthy',
        uptime: 3600,
        lastCheck: new Date('2024-01-01T12:00:00Z').toISOString(),
        components: {},
      };

      mockAdminServices.getSystemHealth.mockResolvedValue(mockHealth);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText(/last check:/i)).toBeInTheDocument();
      });
    });
  });

  describe('Real-time Updates', () => {
    it('refreshes data automatically', async () => {
      const mockMetrics = [createMockSystemMetric()];
      mockAdminServices.getSystemMetrics.mockResolvedValue(mockMetrics);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText('CPU Usage')).toBeInTheDocument();
      });

      // Simulate automatic refresh
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Verify data was refreshed
      expect(mockAdminServices.getSystemMetrics).toHaveBeenCalledTimes(2);
    });

    it('allows manual refresh', async () => {
      const mockMetrics = [createMockSystemMetric()];
      mockAdminServices.getSystemMetrics.mockResolvedValue(mockMetrics);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText('CPU Usage')).toBeInTheDocument();
      });

      // Click refresh button
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await userEvent.click(refreshButton);

      // Verify data was refreshed
      expect(mockAdminServices.getSystemMetrics).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('displays error when metrics API fails', async () => {
      mockAdminServices.getSystemMetrics.mockRejectedValue(
        new Error('Failed to fetch metrics')
      );

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(
          screen.getByText(/failed to fetch metrics/i)
        ).toBeInTheDocument();
      });
    });

    it('displays error when alerts API fails', async () => {
      mockAdminServices.getSystemAlerts.mockRejectedValue(
        new Error('Failed to fetch alerts')
      );

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText(/failed to fetch alerts/i)).toBeInTheDocument();
      });
    });

    it('displays error when health API fails', async () => {
      mockAdminServices.getSystemHealth.mockRejectedValue(
        new Error('Failed to fetch health')
      );

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText(/failed to fetch health/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('handles large datasets efficiently', async () => {
      const mockMetrics = Array.from({ length: 100 }, (_, i) =>
        createMockSystemMetric({ id: `metric-${i}`, name: `Metric ${i}` })
      );

      mockAdminServices.getSystemMetrics.mockResolvedValue(mockMetrics);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText('Metric 0')).toBeInTheDocument();
        expect(screen.getByText('Metric 99')).toBeInTheDocument();
      });

      // Should render without performance issues
      expect(screen.getAllByTestId('metric-card')).toHaveLength(100);
    });

    it('debounces rapid refresh requests', async () => {
      const mockMetrics = [createMockSystemMetric()];
      mockAdminServices.getSystemMetrics.mockResolvedValue(mockMetrics);

      render(<SystemMonitoring />);

      await waitFor(() => {
        expect(screen.getByText('CPU Usage')).toBeInTheDocument();
      });

      // Rapidly click refresh multiple times
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await userEvent.click(refreshButton);
      await userEvent.click(refreshButton);
      await userEvent.click(refreshButton);

      // Should only make one additional API call due to debouncing
      await waitFor(() => {
        expect(mockAdminServices.getSystemMetrics).toHaveBeenCalledTimes(2);
      });
    });
  });
});
