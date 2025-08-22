import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
export interface AdminDashboardState {
  // User Management
  users: UserWithRoles[];
  userAnalytics: UserAnalytics;
  userActivity: UserActivity[];

  // System Monitoring
  systemMetrics: SystemMetric[];
  systemAlerts: SystemAlert[];
  systemHealth: SystemHealth;

  // Data Management
  dataTables: DataTable[];
  activityLogs: ActivityLog[];
  dataAnalytics: DataAnalytics;

  // Maintenance Tools
  maintenanceHistory: MaintenanceHistory[];
  maintenanceOperations: MaintenanceOperation[];

  // Logs
  logs: LogEntry[];
  logFilters: LogFilter;

  // Health
  healthStatus: HealthStatus;
  performanceMetrics: PerformanceMetric[];

  // Dashboard Customization
  widgets: Widget[];
  dashboardLayout: DashboardLayout;

  // UI State
  activeTab: string;
  sidebarCollapsed: boolean;
  notifications: NotificationType[];
  loadingStates: Record<string, boolean>;
  errorStates: Record<string, string | null>;
}

export interface AdminDashboardActions {
  // User Management Actions
  setUsers: (users: UserWithRoles[]) => void;
  updateUser: (userId: string, updates: Partial<UserWithRoles>) => void;
  deleteUser: (userId: string) => void;
  setUserAnalytics: (analytics: UserAnalytics) => void;
  setUserActivity: (activity: UserActivity[]) => void;

  // System Monitoring Actions
  setSystemMetrics: (metrics: SystemMetric[]) => void;
  addSystemAlert: (alert: SystemAlert) => void;
  removeSystemAlert: (alertId: string) => void;
  setSystemHealth: (health: SystemHealth) => void;

  // Data Management Actions
  setDataTables: (tables: DataTable[]) => void;
  setActivityLogs: (logs: ActivityLog[]) => void;
  setDataAnalytics: (analytics: DataAnalytics) => void;

  // Maintenance Tools Actions
  setMaintenanceHistory: (history: MaintenanceHistory[]) => void;
  addMaintenanceOperation: (operation: MaintenanceOperation) => void;

  // Logs Actions
  setLogs: (logs: LogEntry[]) => void;
  setLogFilters: (filters: LogFilter) => void;

  // Health Actions
  setHealthStatus: (status: HealthStatus) => void;
  setPerformanceMetrics: (metrics: PerformanceMetric[]) => void;

  // Dashboard Customization Actions
  setWidgets: (widgets: Widget[]) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  setDashboardLayout: (layout: DashboardLayout) => void;

  // UI Actions
  setActiveTab: (tab: string) => void;
  toggleSidebar: () => void;
  addNotification: (notification: NotificationType) => void;
  removeNotification: (notificationId: string) => void;
  setLoadingState: (key: string, loading: boolean) => void;
  setErrorState: (key: string, error: string | null) => void;

  // Utility Actions
  clearErrors: () => void;
  resetState: () => void;
}

// Initial State
const initialState: AdminDashboardState = {
  // User Management
  users: [],
  userAnalytics: {
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    userGrowth: 0,
  },
  userActivity: [],

  // System Monitoring
  systemMetrics: [],
  systemAlerts: [],
  systemHealth: {
    status: 'healthy',
    uptime: 0,
    lastCheck: new Date(),
  },

  // Data Management
  dataTables: [],
  activityLogs: [],
  dataAnalytics: {
    totalRecords: 0,
    activeRecords: 0,
    dataGrowth: 0,
  },

  // Maintenance Tools
  maintenanceHistory: [],
  maintenanceOperations: [],

  // Logs
  logs: [],
  logFilters: {
    level: 'all',
    dateRange: { start: null, end: null },
    search: '',
  },

  // Health
  healthStatus: {
    overall: 'healthy',
    components: {},
    lastCheck: new Date(),
  },
  performanceMetrics: [],

  // Dashboard Customization
  widgets: [],
  dashboardLayout: {
    columns: 3,
    rows: 4,
    widgetPositions: {},
  },

  // UI State
  activeTab: 'overview',
  sidebarCollapsed: false,
  notifications: [],
  loadingStates: {},
  errorStates: {},
};

// Store Creation
export const useAdminDashboardStore = create<
  AdminDashboardState & AdminDashboardActions
>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // User Management Actions
        setUsers: users =>
          set(state => {
            state.users = users;
          }),
        updateUser: (userId, updates) =>
          set(state => {
            const userIndex = state.users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
              state.users[userIndex] = {
                ...state.users[userIndex],
                ...updates,
              };
            }
          }),
        deleteUser: userId =>
          set(state => {
            state.users = state.users.filter(u => u.id !== userId);
          }),
        setUserAnalytics: analytics =>
          set(state => {
            state.userAnalytics = analytics;
          }),
        setUserActivity: activity =>
          set(state => {
            state.userActivity = activity;
          }),

        // System Monitoring Actions
        setSystemMetrics: metrics =>
          set(state => {
            state.systemMetrics = metrics;
          }),
        addSystemAlert: alert =>
          set(state => {
            state.systemAlerts.push(alert);
          }),
        removeSystemAlert: alertId =>
          set(state => {
            state.systemAlerts = state.systemAlerts.filter(
              a => a.id !== alertId
            );
          }),
        setSystemHealth: health =>
          set(state => {
            state.systemHealth = health;
          }),

        // Data Management Actions
        setDataTables: tables =>
          set(state => {
            state.dataTables = tables;
          }),
        setActivityLogs: logs =>
          set(state => {
            state.activityLogs = logs;
          }),
        setDataAnalytics: analytics =>
          set(state => {
            state.dataAnalytics = analytics;
          }),

        // Maintenance Tools Actions
        setMaintenanceHistory: history =>
          set(state => {
            state.maintenanceHistory = history;
          }),
        addMaintenanceOperation: operation =>
          set(state => {
            state.maintenanceOperations.push(operation);
          }),

        // Logs Actions
        setLogs: logs =>
          set(state => {
            state.logs = logs;
          }),
        setLogFilters: filters =>
          set(state => {
            state.logFilters = filters;
          }),

        // Health Actions
        setHealthStatus: status =>
          set(state => {
            state.healthStatus = status;
          }),
        setPerformanceMetrics: metrics =>
          set(state => {
            state.performanceMetrics = metrics;
          }),

        // Dashboard Customization Actions
        setWidgets: widgets =>
          set(state => {
            state.widgets = widgets;
          }),
        updateWidget: (widgetId, updates) =>
          set(state => {
            const widgetIndex = state.widgets.findIndex(w => w.id === widgetId);
            if (widgetIndex !== -1) {
              state.widgets[widgetIndex] = {
                ...state.widgets[widgetIndex],
                ...updates,
              };
            }
          }),
        setDashboardLayout: layout =>
          set(state => {
            state.dashboardLayout = layout;
          }),

        // UI Actions
        setActiveTab: tab =>
          set(state => {
            state.activeTab = tab;
          }),
        toggleSidebar: () =>
          set(state => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }),
        addNotification: notification =>
          set(state => {
            state.notifications.push(notification);
          }),
        removeNotification: notificationId =>
          set(state => {
            state.notifications = state.notifications.filter(
              n => n.id !== notificationId
            );
          }),
        setLoadingState: (key, loading) =>
          set(state => {
            state.loadingStates[key] = loading;
          }),
        setErrorState: (key, error) =>
          set(state => {
            state.errorStates[key] = error;
          }),

        // Utility Actions
        clearErrors: () =>
          set(state => {
            state.errorStates = {};
          }),
        resetState: () => set(() => initialState),
      })),
      {
        name: 'admin-dashboard-store',
        partialize: state => ({
          activeTab: state.activeTab,
          sidebarCollapsed: state.sidebarCollapsed,
          dashboardLayout: state.dashboardLayout,
          widgets: state.widgets,
        }),
      }
    ),
    {
      name: 'admin-dashboard-store',
    }
  )
);

// Selectors for better performance
export const selectUsers = (state: AdminDashboardState) => state.users;
export const selectUserAnalytics = (state: AdminDashboardState) =>
  state.userAnalytics;
export const selectSystemMetrics = (state: AdminDashboardState) =>
  state.systemMetrics;
export const selectSystemAlerts = (state: AdminDashboardState) =>
  state.systemAlerts;
export const selectActiveTab = (state: AdminDashboardState) => state.activeTab;
export const selectLoadingState =
  (key: string) => (state: AdminDashboardState) =>
    state.loadingStates[key];
export const selectErrorState = (key: string) => (state: AdminDashboardState) =>
  state.errorStates[key];
