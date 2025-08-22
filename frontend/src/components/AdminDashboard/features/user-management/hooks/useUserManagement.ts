import { useCallback, useEffect } from 'react';
import {
  useAdminDashboardStore,
} from '../../state/AdminDashboardStore';
import { UserWithRoles } from '../types';

export const useUserManagement = () => {
  const {
    users,
    userAnalytics,
    userActivity,
    setUsers,
    updateUser,
    deleteUser,
    setUserAnalytics,
    setUserActivity,
    setLoadingState,
    setErrorState,
  } = useAdminDashboardStore();

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingState('users', true);
      setErrorState('users', null);

      // Simulate API call
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      setUsers(data.users);
    } catch (error) {
      setErrorState(
        'users',
        error instanceof Error ? error.message : 'Failed to fetch users'
      );
    } finally {
      setLoadingState('users', false);
    }
  }, [setUsers, setLoadingState, setErrorState]);

  const fetchUserAnalytics = useCallback(async () => {
    try {
      setLoadingState('userAnalytics', true);
      setErrorState('userAnalytics', null);

      // Simulate API call
      const response = await fetch('/api/admin/users/analytics');
      const data = await response.json();

      setUserAnalytics(data);
    } catch (error) {
      setErrorState(
        'userAnalytics',
        error instanceof Error
          ? error.message
          : 'Failed to fetch user analytics'
      );
    } finally {
      setLoadingState('userAnalytics', false);
    }
  }, [setUserAnalytics, setLoadingState, setErrorState]);

  const fetchUserActivity = useCallback(async () => {
    try {
      setLoadingState('userActivity', true);
      setErrorState('userActivity', null);

      // Simulate API call
      const response = await fetch('/api/admin/users/activity');
      const data = await response.json();

      setUserActivity(data.activity);
    } catch (error) {
      setErrorState(
        'userActivity',
        error instanceof Error ? error.message : 'Failed to fetch user activity'
      );
    } finally {
      setLoadingState('userActivity', false);
    }
  }, [setUserActivity, setLoadingState, setErrorState]);

  const handleUpdateUser = useCallback(
    async (userId: string, updates: Partial<UserWithRoles>) => {
      try {
        setLoadingState(`updateUser-${userId}`, true);
        setErrorState(`updateUser-${userId}`, null);

        // Simulate API call
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error('Failed to update user');

        const updatedUser = await response.json();
        updateUser(userId, updatedUser);
      } catch (error) {
        setErrorState(
          `updateUser-${userId}`,
          error instanceof Error ? error.message : 'Failed to update user'
        );
      } finally {
        setLoadingState(`updateUser-${userId}`, false);
      }
    },
    [updateUser, setLoadingState, setErrorState]
  );

  const handleDeleteUser = useCallback(
    async (userId: string) => {
      try {
        setLoadingState(`deleteUser-${userId}`, true);
        setErrorState(`deleteUser-${userId}`, null);

        // Simulate API call
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete user');

        deleteUser(userId);
      } catch (error) {
        setErrorState(
          `deleteUser-${userId}`,
          error instanceof Error ? error.message : 'Failed to delete user'
        );
      } finally {
        setLoadingState(`deleteUser-${userId}`, false);
      }
    },
    [deleteUser, setLoadingState, setErrorState]
  );

  // Load data on mount
  useEffect(() => {
    fetchUsers();
    fetchUserAnalytics();
    fetchUserActivity();
  }, [fetchUsers, fetchUserAnalytics, fetchUserActivity]);

  return {
    // State
    users,
    userAnalytics,
    userActivity,

    // Actions
    fetchUsers,
    fetchUserAnalytics,
    fetchUserActivity,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,

    // Loading states
    isLoadingUsers: useAdminDashboardStore(selectLoadingState('users')),
    isLoadingAnalytics: useAdminDashboardStore(
      selectLoadingState('userAnalytics')
    ),
    isLoadingActivity: useAdminDashboardStore(
      selectLoadingState('userActivity')
    ),

    // Error states
    usersError: useAdminDashboardStore(selectErrorState('users')),
    analyticsError: useAdminDashboardStore(selectErrorState('userAnalytics')),
    activityError: useAdminDashboardStore(selectErrorState('userActivity')),
  };
};
