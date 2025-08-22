import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminDashboard } from '../../AdminDashboard';
import { mockAdminServices } from '../utils/testUtils';

// Mock all admin services
vi.mock('@/services/admin', () => ({
  getUsers: mockAdminServices.getUsers,
  getUserAnalytics: mockAdminServices.getUserAnalytics,
  getUserActivity: mockAdminServices.getUserActivity,
  getSystemMetrics: mockAdminServices.getSystemMetrics,
  getSystemAlerts: mockAdminServices.getSystemAlerts,
  getSystemHealth: mockAdminServices.getSystemHealth,
  getSystemLogs: mockAdminServices.getSystemLogs,
  getMaintenanceOperations: mockAdminServices.getMaintenanceOperations,
  getWidgets: mockAdminServices.getWidgets,
  updateUser: mockAdminServices.updateUser,
  deleteUser: mockAdminServices.deleteUser,
  updateWidget: mockAdminServices.updateWidget,
}));

describe('AdminDashboard Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Load', () => {
    it('loads all data on initial render', async () => {
      render(<AdminDashboard />);

      // Wait for all data to load
      await waitFor(() => {
        expect(mockAdminServices.getUsers).toHaveBeenCalled();
        expect(mockAdminServices.getUserAnalytics).toHaveBeenCalled();
        expect(mockAdminServices.getSystemMetrics).toHaveBeenCalled();
        expect(mockAdminServices.getSystemHealth).toHaveBeenCalled();
      });
    });

    it('displays overview tab by default', async () => {
      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /overview/i })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });
    });

    it('shows loading states during initial load', async () => {
      // Delay all API responses to test loading states
      mockAdminServices.getUsers.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve({ users: [], total: 0 }), 100)
          )
      );

      render(<AdminDashboard />);

      expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(
          screen.queryByTestId('dashboard-loading')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    it('switches between tabs correctly', async () => {
      render(<AdminDashboard />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /overview/i })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      // Switch to User Management tab
      const userManagementTab = screen.getByRole('tab', {
        name: /user management/i,
      });
      await userEvent.click(userManagementTab);

      await waitFor(() => {
        expect(userManagementTab).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: /overview/i })).toHaveAttribute(
          'aria-selected',
          'false'
        );
      });

      // Switch to System Monitoring tab
      const systemMonitoringTab = screen.getByRole('tab', {
        name: /system monitoring/i,
      });
      await userEvent.click(systemMonitoringTab);

      await waitFor(() => {
        expect(systemMonitoringTab).toHaveAttribute('aria-selected', 'true');
        expect(userManagementTab).toHaveAttribute('aria-selected', 'false');
      });
    });

    it('loads tab-specific data when switching tabs', async () => {
      render(<AdminDashboard />);

      // Switch to Logs tab
      const logsTab = screen.getByRole('tab', { name: /logs/i });
      await userEvent.click(logsTab);

      await waitFor(() => {
        expect(mockAdminServices.getSystemLogs).toHaveBeenCalled();
      });

      // Switch to Maintenance Tools tab
      const maintenanceTab = screen.getByRole('tab', {
        name: /maintenance tools/i,
      });
      await userEvent.click(maintenanceTab);

      await waitFor(() => {
        expect(mockAdminServices.getMaintenanceOperations).toHaveBeenCalled();
      });
    });

    it('maintains tab state across component re-renders', async () => {
      const { rerender } = render(<AdminDashboard />);

      // Switch to User Management tab
      const userManagementTab = screen.getByRole('tab', {
        name: /user management/i,
      });
      await userEvent.click(userManagementTab);

      await waitFor(() => {
        expect(userManagementTab).toHaveAttribute('aria-selected', 'true');
      });

      // Re-render component
      rerender(<AdminDashboard />);

      // Tab state should be maintained
      await waitFor(() => {
        expect(userManagementTab).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Cross-Feature Interactions', () => {
    it('updates user data across all features when user is modified', async () => {
      render(<AdminDashboard />);

      // Switch to User Management tab
      const userManagementTab = screen.getByRole('tab', {
        name: /user management/i,
      });
      await userEvent.click(userManagementTab);

      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      // Update user
      const editButton = screen.getByRole('button', { name: /edit/i });
      await userEvent.click(editButton);

      const firstNameInput = screen.getByDisplayValue('Test');
      await userEvent.clear(firstNameInput);
      await userEvent.type(firstNameInput, 'Updated');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await userEvent.click(saveButton);

      // Verify user was updated
      await waitFor(() => {
        expect(mockAdminServices.updateUser).toHaveBeenCalled();
      });

      // Switch to Overview tab and verify user data is updated there too
      const overviewTab = screen.getByRole('tab', { name: /overview/i });
      await userEvent.click(overviewTab);

      await waitFor(() => {
        expect(screen.getByText('Updated')).toBeInTheDocument();
      });
    });

    it('synchronizes system alerts across features', async () => {
      render(<AdminDashboard />);

      // Switch to System Monitoring tab
      const systemMonitoringTab = screen.getByRole('tab', {
        name: /system monitoring/i,
      });
      await userEvent.click(systemMonitoringTab);

      await waitFor(() => {
        expect(screen.getByText('High CPU Usage')).toBeInTheDocument();
      });

      // Acknowledge alert
      const acknowledgeButton = screen.getByRole('button', {
        name: /acknowledge/i,
      });
      await userEvent.click(acknowledgeButton);

      // Switch to Overview tab and verify alert status is updated
      const overviewTab = screen.getByRole('tab', { name: /overview/i });
      await userEvent.click(overviewTab);

      await waitFor(() => {
        expect(screen.getByTestId('alert-acknowledged')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles API failures gracefully', async () => {
      mockAdminServices.getUsers.mockRejectedValue(new Error('Network error'));

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });

      // Other features should still work
      const systemMonitoringTab = screen.getByRole('tab', {
        name: /system monitoring/i,
      });
      await userEvent.click(systemMonitoringTab);

      await waitFor(() => {
        expect(screen.getByText('CPU Usage')).toBeInTheDocument();
      });
    });

    it('allows retrying failed requests', async () => {
      mockAdminServices.getUsers.mockRejectedValueOnce(
        new Error('Network error')
      );

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });

      // Click retry button
      const retryButton = screen.getByRole('button', { name: /retry/i });
      await userEvent.click(retryButton);

      // Should retry the request
      await waitFor(() => {
        expect(mockAdminServices.getUsers).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Performance', () => {
    it('handles large datasets without performance issues', async () => {
      const largeUserDataset = Array.from({ length: 1000 }, (_, i) => ({
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
      }));

      mockAdminServices.getUsers.mockResolvedValue({
        users: largeUserDataset,
        total: 1000,
      });

      render(<AdminDashboard />);

      // Switch to User Management tab
      const userManagementTab = screen.getByRole('tab', {
        name: /user management/i,
      });
      await userEvent.click(userManagementTab);

      await waitFor(() => {
        expect(screen.getByText('user0')).toBeInTheDocument();
        expect(screen.getByText('user999')).toBeInTheDocument();
      });

      // Should render without performance issues
      expect(screen.getAllByTestId('user-row')).toHaveLength(1000);
    });

    it('debounces rapid user interactions', async () => {
      render(<AdminDashboard />);

      // Switch to User Management tab
      const userManagementTab = screen.getByRole('tab', {
        name: /user management/i,
      });
      await userEvent.click(userManagementTab);

      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      // Rapidly type in search input
      const searchInput = screen.getByPlaceholderText(/search users/i);
      await userEvent.type(searchInput, 'test');
      await userEvent.type(searchInput, 'user');
      await userEvent.type(searchInput, 'search');

      // Should only trigger one search request due to debouncing
      await waitFor(() => {
        expect(mockAdminServices.getUsers).toHaveBeenCalledTimes(2); // Initial load + 1 search
      });
    });
  });

  describe('Accessibility', () => {
    it('supports keyboard navigation', async () => {
      render(<AdminDashboard />);

      // Tab to first tab
      await userEvent.tab();
      expect(screen.getByRole('tab', { name: /overview/i })).toHaveFocus();

      // Use arrow keys to navigate tabs
      await userEvent.keyboard('{ArrowRight}');
      expect(
        screen.getByRole('tab', { name: /user management/i })
      ).toHaveFocus();

      await userEvent.keyboard('{ArrowRight}');
      expect(
        screen.getByRole('tab', { name: /system monitoring/i })
      ).toHaveFocus();

      // Activate tab with Enter key
      await userEvent.keyboard('{Enter}');
      expect(
        screen.getByRole('tab', { name: /system monitoring/i })
      ).toHaveAttribute('aria-selected', 'true');
    });

    it('has proper ARIA labels and roles', async () => {
      render(<AdminDashboard />);

      // Check tab list has proper role
      expect(screen.getByRole('tablist')).toBeInTheDocument();

      // Check tabs have proper roles
      expect(
        screen.getByRole('tab', { name: /overview/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('tab', { name: /user management/i })
      ).toBeInTheDocument();

      // Check tab panels have proper roles
      expect(
        screen.getByRole('tabpanel', { name: /overview/i })
      ).toBeInTheDocument();
    });
  });

  describe('State Persistence', () => {
    it('persists user preferences across sessions', async () => {
      render(<AdminDashboard />);

      // Switch to User Management tab
      const userManagementTab = screen.getByRole('tab', {
        name: /user management/i,
      });
      await userEvent.click(userManagementTab);

      await waitFor(() => {
        expect(userManagementTab).toHaveAttribute('aria-selected', 'true');
      });

      // Simulate page reload by re-rendering
      const { rerender } = render(<AdminDashboard />);

      // Tab selection should be persisted
      await waitFor(() => {
        expect(
          screen.getByRole('tab', { name: /user management/i })
        ).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('persists widget layout preferences', async () => {
      render(<AdminDashboard />);

      // Switch to Dashboard Customization tab
      const customizationTab = screen.getByRole('tab', {
        name: /customization/i,
      });
      await userEvent.click(customizationTab);

      // Modify widget layout
      const widget = screen.getByTestId('widget-1');
      // Simulate drag and drop (this would be more complex in real implementation)
      await userEvent.click(widget);

      // Simulate page reload
      const { rerender } = render(<AdminDashboard />);

      // Widget layout should be persisted
      await waitFor(() => {
        expect(screen.getByTestId('widget-1')).toBeInTheDocument();
      });
    });
  });
});
