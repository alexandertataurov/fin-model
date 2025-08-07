// Dashboard components
export { DashboardGrid } from './DashboardGrid';
export { default as FinancialDashboard } from './FinancialDashboard';
export type { DashboardWidget, DashboardLayout } from './DashboardGrid';

// Dashboard templates
export {
  DASHBOARD_TEMPLATES,
  dashboardTemplates,
  templateMetadata,
  getTemplateLayout,
  getAvailableTemplates,
  type DashboardTemplateKey,
} from './dashboardConstants'; 