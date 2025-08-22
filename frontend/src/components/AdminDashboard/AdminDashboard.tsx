/**
 * Admin Dashboard Component
 *
 * Modern admin dashboard using atomic design principles
 * ATOMIC DESIGN: atoms > molecules > organisms > templates > pages
 * PERFORMANCE OPTIMIZED: Memoized components, lazy loading, virtualization
 */

import React, {
  useState,
  useEffect,
  memo,
  useMemo,
  useCallback,
  Suspense,
  lazy,
} from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/design-system/molecules';
import { Button } from '@/design-system/atoms';
import { useAdminStore } from '@/stores/admin';

import OverviewTab from './OverviewTab';
import DashboardCustomization from './DashboardCustomization';

// Import icons
import {
  Activity,
  Server,
  Shield,
  CheckCircle,
  Database,
  FileText,
  Bell,
  Settings,
  TrendingUp,
} from 'lucide-react';

// Lazy load heavy components
const LazyDataManagement = lazy(() => import('./DataManagement'));
const LazyMaintenanceTools = lazy(() =>
  import('./MaintenanceTools').then(module => ({
    default: module.MaintenanceTools,
  }))
);
const LazyUserManagement = lazy(
  () => import('./features/user-management/UserManagement')
);
const LazySystemMonitoring = lazy(() => import('./SystemMonitoring'));
const LazyLogsTab = lazy(() => import('./LogsTab'));

// Memoized loading fallback
const LoadingFallback = memo(() => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
      <span className="text-sm text-muted-foreground">
        Loading component...
      </span>
    </div>
  </div>
));

// Memoized tab trigger component
const TabTrigger = memo<{
  value: string;
  icon: React.ComponentType<any>;
  label: string;
}>(({ value, icon: IconComponent, label }) => (
  <TabsTrigger value={value} className="flex items-center gap-3 rounded-lg">
    <IconComponent className="h-4 w-4" />
    <span className="text-sm">{label}</span>
  </TabsTrigger>
));

// Main Admin Dashboard Component
export const AdminDashboard: React.FC = memo(() => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    fetchOverviewData,
    fetchSystemData,
    fetchAuditData,
    fetchHealthData,
  } = useAdminStore();

  // Memoized tab change handler
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Memoized data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      switch (activeTab) {
        case 'overview':
          await fetchOverviewData();
          break;
        case 'system':
          await fetchSystemData();
          break;
        case 'audit':
          await fetchAuditData();
          break;
        case 'health':
          await fetchHealthData();
          break;
        case 'data':
        case 'logs':
          // These components handle their own data fetching
          break;
        default:
          await fetchOverviewData();
      }
    };

    fetchData();
  }, [
    activeTab,
    fetchOverviewData,
    fetchSystemData,
    fetchAuditData,
    fetchHealthData,
  ]);

  // Memoized tab configuration
  const tabsConfig = useMemo(
    () => [
      { value: 'overview', icon: Activity, label: 'Overview' },
      { value: 'system', icon: Server, label: 'System' },
      { value: 'audit', icon: Shield, label: 'Audit' },
      { value: 'health', icon: CheckCircle, label: 'Health' },
      { value: 'data', icon: Database, label: 'Data' },
      { value: 'logs', icon: FileText, label: 'Logs' },
    ],
    []
  );

  // Memoized action bar content
  const actionBarContent = useMemo(
    () => (
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4 mr-2" />
          <span className="text-sm">Notifications</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-xs flex items-center justify-center bg-destructive text-background">
            3
          </span>
        </Button>
        <Suspense fallback={<LoadingFallback />}>
          <DashboardCustomization
            userRole="admin"
            onConfigChange={() => {
              // Handle configuration changes
            }}
          />
        </Suspense>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          <span className="text-sm">Settings</span>
        </Button>
        <Button size="sm">
          <TrendingUp className="h-4 w-4 mr-2" />
          <span className="text-sm">Export Report</span>
        </Button>
      </div>
    ),
    []
  );

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage system performance, user activity, and system
            health
          </p>
        </div>
        {actionBarContent}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-8"
      >
        <TabsList className="grid w-full grid-cols-6 h-14 p-1 rounded-xl">
          {tabsConfig.map(tab => (
            <TabTrigger key={tab.value} {...tab} />
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="system" className="space-y-8">
          <Suspense fallback={<LoadingFallback />}>
            <LazyMaintenanceTools />
          </Suspense>
        </TabsContent>

        <TabsContent value="audit" className="space-y-8">
          <Suspense fallback={<LoadingFallback />}>
            <LazyUserManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="health" className="space-y-8">
          <Suspense fallback={<LoadingFallback />}>
            <LazySystemMonitoring refreshInterval={30000} />
          </Suspense>
        </TabsContent>

        <TabsContent value="data" className="space-y-8">
          <Suspense fallback={<LoadingFallback />}>
            <LazyDataManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="logs" className="space-y-8">
          <Suspense fallback={<LoadingFallback />}>
            <LazyLogsTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;
