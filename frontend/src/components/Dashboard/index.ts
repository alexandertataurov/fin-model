// Dashboard components
export { default as DashboardGrid } from './DashboardGrid';
export type { DashboardWidget, DashboardLayout } from './DashboardGrid';

// Dashboard templates
export {
  DASHBOARD_TEMPLATES,
  dashboardTemplates,
  templateMetadata,
  getTemplateLayout,
  getAvailableTemplates,
} from './DashboardTemplates';
export type { DashboardTemplateKey } from './DashboardTemplates'; 