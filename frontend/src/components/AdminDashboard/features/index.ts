// Feature-based Admin Dashboard Exports

// Core Features
export * from './user-management';
export * from './system-monitoring';
export * from './data-management';
export * from './maintenance-tools';
export * from './logs';
export * from './health';
export * from './dashboard-customization';
export * from './overview';

// Shared Components
export * from '../shared';

// Main Dashboard Component
export { default as AdminDashboard } from '../AdminDashboard';

// Legacy Support - Re-export from old structure for backward compatibility
export { default as UserManagement } from '../UserManagement';
export { default as SystemMonitoring } from '../SystemMonitoring';
export { default as DataManagement } from '../DataManagement';
export { default as MaintenanceTools } from '../MaintenanceTools';
export { default as LogsTab } from '../LogsTab';
export { default as HealthTab } from '../HealthTab';
export { default as DashboardCustomization } from '../DashboardCustomization';
export { default as OverviewSection } from '../OverviewSection';
export { default as OverviewTab } from '../OverviewTab';
