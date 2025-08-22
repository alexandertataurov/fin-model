import { useMemo } from 'react';
import {
  useAdminDashboardStore,
  selectUsers,
  selectUserAnalytics,
  selectUserActivity,
} from '../../state/AdminDashboardStore';

export const useUserAnalytics = () => {
  const users = useAdminDashboardStore(selectUsers);
  const userAnalytics = useAdminDashboardStore(selectUserAnalytics);
  const userActivity = useAdminDashboardStore(selectUserActivity);

  // Computed analytics
  const computedAnalytics = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    const inactiveUsers = users.filter(
      user => user.status === 'inactive'
    ).length;
    const adminUsers = users.filter(user =>
      user.roles.includes('admin')
    ).length;
    const regularUsers = users.filter(
      user => !user.roles.includes('admin')
    ).length;

    // Calculate user growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = users.filter(
      user => new Date(user.createdAt) > thirtyDaysAgo
    ).length;

    // Activity analysis
    const recentActivity = userActivity.filter(
      activity => new Date(activity.timestamp) > thirtyDaysAgo
    );

    const activityByType = recentActivity.reduce(
      (acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // User engagement score
    const userEngagement = users
      .map(user => {
        const userActivities = userActivity.filter(
          activity => activity.userId === user.id
        );
        const recentUserActivities = userActivities.filter(
          activity => new Date(activity.timestamp) > thirtyDaysAgo
        );

        return {
          userId: user.id,
          username: user.username,
          engagementScore: recentUserActivities.length,
          lastActivity:
            userActivities.length > 0
              ? new Date(
                  Math.max(
                    ...userActivities.map(a => new Date(a.timestamp).getTime())
                  )
                )
              : null,
        };
      })
      .sort((a, b) => b.engagementScore - a.engagementScore);

    return {
      // Basic metrics
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminUsers,
      regularUsers,
      recentUsers,

      // Growth metrics
      userGrowthRate: totalUsers > 0 ? (recentUsers / totalUsers) * 100 : 0,
      activeUserRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,

      // Activity metrics
      totalActivities: recentActivity.length,
      activityByType,
      averageActivitiesPerUser:
        totalUsers > 0 ? recentActivity.length / totalUsers : 0,

      // Engagement metrics
      userEngagement,
      topEngagedUsers: userEngagement.slice(0, 10),
      lowEngagedUsers: userEngagement.slice(-10).reverse(),

      // Status distribution
      statusDistribution: {
        active: activeUsers,
        inactive: inactiveUsers,
      },

      // Role distribution
      roleDistribution: {
        admin: adminUsers,
        regular: regularUsers,
      },
    };
  }, [users, userAnalytics, userActivity]);

  // Performance metrics
  const performanceMetrics = useMemo(() => {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const lastDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const hourlyActivity = userActivity.filter(
      activity => new Date(activity.timestamp) > lastHour
    ).length;

    const dailyActivity = userActivity.filter(
      activity => new Date(activity.timestamp) > lastDay
    ).length;

    return {
      hourlyActivity,
      dailyActivity,
      averageHourlyActivity: hourlyActivity,
      averageDailyActivity: dailyActivity,
    };
  }, [userActivity]);

  return {
    // Raw data
    users,
    userAnalytics,
    userActivity,

    // Computed analytics
    computedAnalytics,
    performanceMetrics,

    // Helper functions
    getUserById: (userId: string) => users.find(user => user.id === userId),
    getUsersByRole: (role: string) =>
      users.filter(user => user.roles.includes(role)),
    getUsersByStatus: (status: string) =>
      users.filter(user => user.status === status),
    getUserActivity: (userId: string) =>
      userActivity.filter(activity => activity.userId === userId),
  };
};
