import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserManagement } from '../../../features/user-management';
import {
  createMockUser,
  createMockUserAnalytics,
  mockAdminServices,
} from '../../utils/testUtils';

// Mock the admin services
vi.mock('@/services/admin', () => ({
  getUsers: mockAdminServices.getUsers,
  getUserAnalytics: mockAdminServices.getUserAnalytics,
  updateUser: mockAdminServices.updateUser,
  deleteUser: mockAdminServices.deleteUser,
}));

describe('UserManagement Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('User Table', () => {
    it('renders user table with data', async () => {
      const mockUsers = [
        createMockUser({ id: 'user-1', username: 'john_doe' }),
        createMockUser({ id: 'user-2', username: 'jane_smith' }),
      ];

      mockAdminServices.getUsers.mockResolvedValue({
        users: mockUsers,
        total: 2,
      });

      render(<UserManagement />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('john_doe')).toBeInTheDocument();
        expect(screen.getByText('jane_smith')).toBeInTheDocument();
      });
    });

    it('displays loading state while fetching users', async () => {
      // Delay the mock response to test loading state
      mockAdminServices.getUsers.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve({ users: [], total: 0 }), 100)
          )
      );

      render(<UserManagement />);

      // Should show loading indicator
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('displays error state when API fails', async () => {
      mockAdminServices.getUsers.mockRejectedValue(
        new Error('Failed to fetch users')
      );

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/failed to fetch users/i)).toBeInTheDocument();
      });
    });

    it('allows updating user information', async () => {
      const mockUser = createMockUser();
      mockAdminServices.getUsers.mockResolvedValue({
        users: [mockUser],
        total: 1,
      });

      const updatedUser = { ...mockUser, firstName: 'Updated' };
      mockAdminServices.updateUser.mockResolvedValue(updatedUser);

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      // Find and click edit button
      const editButton = screen.getByRole('button', { name: /edit/i });
      await userEvent.click(editButton);

      // Update user information
      const firstNameInput = screen.getByDisplayValue('Test');
      await userEvent.clear(firstNameInput);
      await userEvent.type(firstNameInput, 'Updated');

      // Save changes
      const saveButton = screen.getByRole('button', { name: /save/i });
      await userEvent.click(saveButton);

      // Verify API was called
      await waitFor(() => {
        expect(mockAdminServices.updateUser).toHaveBeenCalledWith(mockUser.id, {
          firstName: 'Updated',
        });
      });
    });

    it('allows deleting users', async () => {
      const mockUser = createMockUser();
      mockAdminServices.getUsers.mockResolvedValue({
        users: [mockUser],
        total: 1,
      });

      mockAdminServices.deleteUser.mockResolvedValue({ success: true });

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      // Find and click delete button
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await userEvent.click(deleteButton);

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await userEvent.click(confirmButton);

      // Verify API was called
      await waitFor(() => {
        expect(mockAdminServices.deleteUser).toHaveBeenCalledWith(mockUser.id);
      });
    });
  });

  describe('User Analytics', () => {
    it('displays user analytics data', async () => {
      const mockAnalytics = createMockUserAnalytics({
        totalUsers: 150,
        activeUsers: 120,
        newUsers: 15,
      });

      mockAdminServices.getUserAnalytics.mockResolvedValue(mockAnalytics);

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument(); // Total users
        expect(screen.getByText('120')).toBeInTheDocument(); // Active users
        expect(screen.getByText('15')).toBeInTheDocument(); // New users
      });
    });

    it('shows analytics loading state', async () => {
      mockAdminServices.getUserAnalytics.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve(createMockUserAnalytics()), 100)
          )
      );

      render(<UserManagement />);

      expect(screen.getByTestId('analytics-loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(
          screen.queryByTestId('analytics-loading')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('User Activity', () => {
    it('displays user activity list', async () => {
      const mockActivities = [
        createMockUserActivity({ description: 'User logged in' }),
        createMockUserActivity({
          id: 'activity-2',
          description: 'Profile updated',
        }),
      ];

      mockAdminServices.getUserActivity.mockResolvedValue(mockActivities);

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText('User logged in')).toBeInTheDocument();
        expect(screen.getByText('Profile updated')).toBeInTheDocument();
      });
    });

    it('filters activity by user', async () => {
      const mockActivities = [
        createMockUserActivity({
          userId: 'user-1',
          description: 'User 1 activity',
        }),
        createMockUserActivity({
          userId: 'user-2',
          description: 'User 2 activity',
        }),
      ];

      mockAdminServices.getUserActivity.mockResolvedValue(mockActivities);

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText('User 1 activity')).toBeInTheDocument();
        expect(screen.getByText('User 2 activity')).toBeInTheDocument();
      });

      // Select user filter
      const userFilter = screen.getByRole('combobox', {
        name: /filter by user/i,
      });
      await userEvent.selectOptions(userFilter, 'user-1');

      // Should only show user 1 activity
      await waitFor(() => {
        expect(screen.getByText('User 1 activity')).toBeInTheDocument();
        expect(screen.queryByText('User 2 activity')).not.toBeInTheDocument();
      });
    });
  });

  describe('Search and Filtering', () => {
    it('filters users by search term', async () => {
      const mockUsers = [
        createMockUser({ username: 'john_doe' }),
        createMockUser({ id: 'user-2', username: 'jane_smith' }),
      ];

      mockAdminServices.getUsers.mockResolvedValue({
        users: mockUsers,
        total: 2,
      });

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText('john_doe')).toBeInTheDocument();
        expect(screen.getByText('jane_smith')).toBeInTheDocument();
      });

      // Search for john
      const searchInput = screen.getByPlaceholderText(/search users/i);
      await userEvent.type(searchInput, 'john');

      await waitFor(() => {
        expect(screen.getByText('john_doe')).toBeInTheDocument();
        expect(screen.queryByText('jane_smith')).not.toBeInTheDocument();
      });
    });

    it('filters users by status', async () => {
      const mockUsers = [
        createMockUser({ status: 'active' }),
        createMockUser({ id: 'user-2', status: 'inactive' }),
      ];

      mockAdminServices.getUsers.mockResolvedValue({
        users: mockUsers,
        total: 2,
      });

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      // Filter by active status
      const statusFilter = screen.getByRole('combobox', {
        name: /filter by status/i,
      });
      await userEvent.selectOptions(statusFilter, 'active');

      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.queryByText('user2')).not.toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    it('handles pagination correctly', async () => {
      const mockUsers = Array.from({ length: 25 }, (_, i) =>
        createMockUser({ id: `user-${i}`, username: `user${i}` })
      );

      mockAdminServices.getUsers.mockResolvedValue({
        users: mockUsers.slice(0, 10),
        total: 25,
      });

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText('user0')).toBeInTheDocument();
        expect(screen.getByText('user9')).toBeInTheDocument();
      });

      // Click next page
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      // Verify API was called with correct pagination
      await waitFor(() => {
        expect(mockAdminServices.getUsers).toHaveBeenCalledWith(
          expect.objectContaining({ skip: 10, limit: 10 })
        );
      });
    });
  });
});
