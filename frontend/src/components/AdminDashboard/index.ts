/**
 * Admin Dashboard - Main Entry Point
 *
 * Centralized exports for all AdminDashboard components, utilities, and hooks
 * Organized by feature-based architecture with backward compatibility
 */

// ============================================================================
// FEATURE-BASED EXPORTS (NEW STRUCTURE)
// ============================================================================
export * from './features';

// ============================================================================
// STATE MANAGEMENT
// ============================================================================
export {
  useAdminDashboardStore,
  selectUsers,
  selectUserAnalytics,
  selectSystemMetrics,
  selectSystemAlerts,
  selectActiveTab,
  selectLoadingState,
  selectErrorState,
} from './state/AdminDashboardStore';

// ============================================================================
// LEGACY EXPORTS (BACKWARD COMPATIBILITY)
// ============================================================================
// Atomic Design Components
export * from './atoms';
export * from './molecules';
export * from './organisms';

// Types & Interfaces
export * from './types/interfaces';

// Utilities
export * from './utils/formatters';
export * from './utils/designSystemHelpers';
export * from './utils/performanceOptimizer';
export * from './utils/bundleOptimizer';

// Patterns
export * from './patterns/ComponentPatterns';

// Hooks
export * from './hooks/useAdminData';
export * from './hooks/useMemoizationAudit';

// Lazy Components
export * from './components/LazyComponents';

// Main Components
export { default as AdminDashboard } from './AdminDashboard';
export { default as OverviewSection } from './OverviewSection';
export { default as OverviewTab } from './OverviewTab';
export { default as SystemMonitoring } from './SystemMonitoring';
export { default as UserManagement } from './UserManagement';
export { default as DashboardCustomization } from './DashboardCustomization';
export { default as DataManagement } from './DataManagement';
export { default as HealthTab } from './HealthTab';
export { default as LogFilterForm } from './LogFilterForm';
export { default as LogsTab } from './LogsTab';
export { default as MaintenanceTools } from './MaintenanceTools';

// ============================================================================
// PERFORMANCE OPTIMIZATION EXPORTS
// ============================================================================
export {
  // Performance monitoring
  useRenderAudit,
  usePerformanceMonitor,
  useExpensiveComputation,
  usePerformanceMetrics,
  PerformanceMetrics,

  // Bundle optimization
  createLazyComponent,
  createChunkedImports,
  conditionalImport,

  // Memory optimization
  useAsyncOperation,
  useVirtualizedList,

  // Optimization helpers
  useDebounce,
  useThrottle,
  useDeepMemo,
  useOptimizedArray,
} from './utils/performanceOptimizer';

export {
  // Bundle analysis
  BundleAnalyzer,
  BundleSizeMonitor,
  bundleSizeAlerts,

  // Code splitting
  createRouteBasedSplitting,
  createFeatureBasedSplitting,
  createComponentBasedSplitting,

  // Tree shaking
  createConditionalImports,
  createPermissionBasedImports,
  createFeatureFlagImports,

  // Webpack optimization
  createChunkConfig,
  createSplitChunksConfig,
  createCacheGroups,
} from './utils/bundleOptimizer';

// ============================================================================
// MEMOIZATION AUDIT EXPORTS
// ============================================================================
export {
  useMemoizationAudit,
  MemoizationAuditProvider,
  useOptimizationHelpers,
  useDebuggingTools,
} from './hooks/useMemoizationAudit';

// ============================================================================
// DESIGN SYSTEM EXPORTS
// ============================================================================
export {
  // Theme utilities
  createTheme,
  useTheme,
  ThemeProvider,

  // Component utilities
  createStyledComponent,
  createResponsiveComponent,
  createAnimatedComponent,

  // Layout utilities
  createGridLayout,
  createFlexLayout,
  createResponsiveLayout,

  // Typography utilities
  createTypography,
  useTypography,
  TypographyProvider,
} from './utils/designSystemHelpers';

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================
export {
  // Number formatting
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,

  // Date formatting
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatTimestamp,

  // Text formatting
  formatText,
  truncateText,
  capitalizeText,
  formatStatus,

  // Status badges
  createStatusBadge,
  StatusBadgeVariant,
  StatusBadgeSize,

  // Trend indicators
  createTrendIndicator,
  TrendDirection,
  TrendIndicatorSize,
} from './utils/formatters';

// ============================================================================
// COMPONENT PATTERNS
// ============================================================================
export {
  // Higher-order components
  withErrorBoundary,
  withLoadingState,
  withEmptyState,
  withRetry,
  withOptimization,

  // Render patterns
  ConditionalRender,
  ListRender,
  AsyncRender,
  OptimizedRender,

  // Common hooks
  useAsyncData,
  useLocalStorage,
  useSessionStorage,
  useDebouncedValue,
  useThrottledValue,
} from './patterns/ComponentPatterns';

// ============================================================================
// ADMIN DATA HOOKS
// ============================================================================
export {
  // Core data hooks
  useAdminData,
  useSystemHealth,
  useUserManagement,
  useDataManagement,
  useMaintenanceTools,
  useLogs,
  useHealth,
  useCustomization,

  // Computed hooks
  useAnalytics,
  useMetrics,
  useTrends,
  useInsights,
  useRecommendations,
} from './hooks/useAdminData';

// ============================================================================
// LAZY COMPONENTS
// ============================================================================
export {
  // Lazy component utilities
  createLazyComponent,
  LazyComponentWrapper,
  PreloadableComponent,

  // Predefined lazy components
  LazyUserManagement,
  LazySystemMonitoring,
  LazyDataManagement,
  LazyMaintenanceTools,
  LazyLogs,
  LazyHealth,
  LazyCustomization,
  LazyOverview,

  // Preloading strategies
  preloadComponent,
  preloadFeature,
  preloadRoute,
} from './components/LazyComponents';
