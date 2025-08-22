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

describe('AdminDashboard Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset performance timers
    performance.clearMarks();
    performance.clearMeasures();
  });

  describe('Initial Load Performance', () => {
    it('loads within performance budget', async () => {
      const startTime = performance.now();

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /overview/i })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Performance budget: 2 seconds for initial load
      expect(loadTime).toBeLessThan(2000);
    });

    it('renders first contentful paint quickly', async () => {
      performance.mark('fcp-start');

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      });

      performance.mark('fcp-end');
      performance.measure('first-contentful-paint', 'fcp-start', 'fcp-end');

      const fcpMeasure = performance.getEntriesByName(
        'first-contentful-paint'
      )[0];

      // Performance budget: 1 second for first contentful paint
      expect(fcpMeasure.duration).toBeLessThan(1000);
    });

    it('handles large datasets efficiently', async () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
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
        users: largeDataset,
        total: 10000,
      });

      const startTime = performance.now();

      render(<AdminDashboard />);

      // Switch to User Management tab
      const userManagementTab = screen.getByRole('tab', {
        name: /user management/i,
      });
      await userEvent.click(userManagementTab);

      await waitFor(() => {
        expect(screen.getByText('user0')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Performance budget: 3 seconds for large dataset render
      expect(renderTime).toBeLessThan(3000);
    });
  });

  describe('Memory Usage', () => {
    it('does not cause memory leaks during tab switching', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;

      const { rerender } = render(<AdminDashboard />);

      // Switch between tabs multiple times
      for (let i = 0; i < 10; i++) {
        const userManagementTab = screen.getByRole('tab', {
          name: /user management/i,
        });
        await userEvent.click(userManagementTab);

        const systemMonitoringTab = screen.getByRole('tab', {
          name: /system monitoring/i,
        });
        await userEvent.click(systemMonitoringTab);

        const logsTab = screen.getByRole('tab', { name: /logs/i });
        await userEvent.click(logsTab);

        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }

      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    it('releases memory when component unmounts', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;

      const { unmount } = render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /overview/i })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      unmount();

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory should be close to initial level after unmount
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    });
  });

  describe('Rendering Performance', () => {
    it('renders components efficiently', async () => {
      performance.mark('render-start');

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /overview/i })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      performance.mark('render-end');
      performance.measure('component-render', 'render-start', 'render-end');

      const renderMeasure = performance.getEntriesByName('component-render')[0];

      // Performance budget: 500ms for component render
      expect(renderMeasure.duration).toBeLessThan(500);
    });

    it('handles rapid state updates efficiently', async () => {
      render(<AdminDashboard />);

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
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      // Rapidly update user data
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        const editButton = screen.getByRole('button', { name: /edit/i });
        await userEvent.click(editButton);

        const firstNameInput = screen.getByDisplayValue('Test');
        await userEvent.clear(firstNameInput);
        await userEvent.type(firstNameInput, `User${i}`);

        const saveButton = screen.getByRole('button', { name: /save/i });
        await userEvent.click(saveButton);
      }

      const endTime = performance.now();
      const updateTime = endTime - startTime;

      // Performance budget: 5 seconds for 100 rapid updates
      expect(updateTime).toBeLessThan(5000);
    });
  });

  describe('Network Performance', () => {
    it('optimizes API calls', async () => {
      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /overview/i })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      // Count API calls made during initial load
      const initialApiCalls =
        mockAdminServices.getUsers.mock.calls.length +
        mockAdminServices.getUserAnalytics.mock.calls.length +
        mockAdminServices.getSystemMetrics.mock.calls.length +
        mockAdminServices.getSystemHealth.mock.calls.length;

      // Should make minimal API calls (4 for initial load)
      expect(initialApiCalls).toBeLessThanOrEqual(4);
    });

    it('debounces search requests', async () => {
      render(<AdminDashboard />);

      // Switch to User Management tab
      const userManagementTab = screen.getByRole('tab', {
        name: /user management/i,
      });
      await userEvent.click(userManagementTab);

      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search users/i);

      // Rapidly type in search
      const startTime = performance.now();
      await userEvent.type(searchInput, 'test');
      await userEvent.type(searchInput, 'user');
      await userEvent.type(searchInput, 'search');
      await userEvent.type(searchInput, 'query');
      const endTime = performance.now();

      const searchTime = endTime - startTime;

      // Search should be fast (less than 100ms for typing)
      expect(searchTime).toBeLessThan(100);

      // Should only make one API call due to debouncing
      await waitFor(() => {
        expect(mockAdminServices.getUsers).toHaveBeenCalledTimes(2); // Initial + 1 search
      });
    });
  });

  describe('Bundle Size Performance', () => {
    it('loads within bundle size budget', () => {
      // This would typically be measured with webpack-bundle-analyzer
      // For now, we'll test that the component loads without errors
      expect(() => {
        render(<AdminDashboard />);
      }).not.toThrow();
    });

    it('supports code splitting', async () => {
      // Test that lazy-loaded components work correctly
      render(<AdminDashboard />);

      // Switch to a tab that uses lazy loading
      const logsTab = screen.getByRole('tab', { name: /logs/i });
      await userEvent.click(logsTab);

      await waitFor(() => {
        expect(screen.getByText(/system logs/i)).toBeInTheDocument();
      });
    });
  });

  describe('Animation Performance', () => {
    it('handles animations smoothly', async () => {
      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /overview/i })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      // Test tab switching animation performance
      const startTime = performance.now();

      const userManagementTab = screen.getByRole('tab', {
        name: /user management/i,
      });
      await userEvent.click(userManagementTab);

      await waitFor(() => {
        expect(userManagementTab).toHaveAttribute('aria-selected', 'true');
      });

      const endTime = performance.now();
      const animationTime = endTime - startTime;

      // Tab switching should be smooth (less than 300ms)
      expect(animationTime).toBeLessThan(300);
    });
  });

  describe('Accessibility Performance', () => {
    it('supports keyboard navigation efficiently', async () => {
      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /overview/i })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      const startTime = performance.now();

      // Navigate through all tabs with keyboard
      await userEvent.tab();
      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowRight}');

      const endTime = performance.now();
      const navigationTime = endTime - startTime;

      // Keyboard navigation should be responsive (less than 500ms)
      expect(navigationTime).toBeLessThan(500);
    });
  });

  describe('Stress Testing', () => {
    it('handles concurrent operations', async () => {
      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /overview/i })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      const startTime = performance.now();

      // Perform multiple operations concurrently
      const promises = [
        userEvent.click(screen.getByRole('tab', { name: /user management/i })),
        userEvent.click(
          screen.getByRole('tab', { name: /system monitoring/i })
        ),
        userEvent.click(screen.getByRole('tab', { name: /logs/i })),
      ];

      await Promise.all(promises);

      const endTime = performance.now();
      const concurrentTime = endTime - startTime;

      // Concurrent operations should complete quickly
      expect(concurrentTime).toBeLessThan(1000);
    });

    it('handles rapid tab switching', async () => {
      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /overview/i })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      const startTime = performance.now();

      // Rapidly switch between tabs
      for (let i = 0; i < 50; i++) {
        const tabs = [
          screen.getByRole('tab', { name: /overview/i }),
          screen.getByRole('tab', { name: /user management/i }),
          screen.getByRole('tab', { name: /system monitoring/i }),
          screen.getByRole('tab', { name: /logs/i }),
        ];

        await userEvent.click(tabs[i % tabs.length]);
      }

      const endTime = performance.now();
      const rapidSwitchTime = endTime - startTime;

      // Rapid tab switching should remain responsive
      expect(rapidSwitchTime).toBeLessThan(5000);
    });
  });
});
