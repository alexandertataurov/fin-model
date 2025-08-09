import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Target,
  Settings,
  CloudUpload,
  RefreshCw,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { componentStyles } from '@/design-system/utils/designSystem';
import { CoreFinancialModeling } from '@/components/CoreFinancialModeling';
import DashboardApiService, {
  DashboardOverview,
  PeriodFilter,
} from '@/services/dashboardApi';
import type { DashboardLoadingState, DashboardPeriod } from '@/types/dashboard';
import { toast } from 'sonner';
import {
  useUserStatements,
  useRefreshDashboard,
  useExportDashboard,
} from '@/hooks/useDashboard';
import { useFinancialRatios } from '@/hooks/useDashboardData';

/**
 * Main Dashboard/Home Page
 *
 * This component serves as the application's landing page after login, providing:
 * - Core Financial Modeling interface (primary)
 * - Navigation cards to different app sections (secondary)
 * - Quick action buttons for common tasks
 * - Getting started guide for new users
 * - User welcome message and overview
 */

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dashboard state management
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(
    null
  );
  const [loadingState, setLoadingState] = useState<DashboardLoadingState>({
    isLoading: true,
    isRefreshing: false,
    error: null,
  });
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>(
    PeriodFilter.YTD
  );
  // No demo mode: always empty fallback handled by API service
  const { data: statementsData } = useUserStatements(undefined, 6);
  const { data: ratiosData } = useFinancialRatios(selectedPeriod as unknown as DashboardPeriod);

  // Load dashboard data
  const loadDashboardData = useCallback(async (
    period: PeriodFilter = selectedPeriod,
    isRefresh = false
  ) => {
    try {
      setLoadingState(prev => ({
        ...prev,
        isLoading: !isRefresh,
        isRefreshing: isRefresh,
        error: null,
      }));

      const data = await DashboardApiService.getDashboardOverview(period);
      setDashboardData(data);

      if (isRefresh) {
        toast.success('Dashboard data refreshed successfully');
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load dashboard data';

      setLoadingState(prev => ({ ...prev, error: { message: errorMessage } }));

      if (isRefresh) {
        toast.error('Failed to refresh dashboard data');
      }
    } finally {
      setLoadingState(prev => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
      }));
    }
  }, [selectedPeriod]);

  // Use hooks for refresh/export
  const refreshMutation = useRefreshDashboard();
  const exportMutation = useExportDashboard();

  const handleRefreshDashboard = async () => {
    try {
      await refreshMutation.mutateAsync();
      await loadDashboardData(selectedPeriod, true);
    } catch {
      // toast handled in hook
    }
  };

  // Period change handler
  const handlePeriodChange = (period: PeriodFilter) => {
    setSelectedPeriod(period);
    loadDashboardData(period);
  };

  // removed demo toggle

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const dashboardCards = [
    {
      title: 'P&L Statement',
      subtitle:
        'Analyze profit & loss statements with granular line items and key metrics',
      icon: <TrendingUp />,
      color: 'var(--chart-3)',
      path: '/dashboards/pl',
      badge: 'Financial',
      onClick: () => navigate('/dashboards/pl'),
    },
    {
      title: 'Cash Flow Statement',
      subtitle: 'Track cash inflows and outflows with detailed breakdowns',
      icon: <DollarSign />,
      color: 'var(--chart-1)',
      path: '/dashboards/cashflow',
      badge: 'Financial',
      onClick: () => navigate('/dashboards/cashflow'),
    },
    {
      title: 'Balance Sheet',
      subtitle:
        'View assets, liabilities, and equity with comprehensive structure',
      icon: <CreditCard />,
      color: 'var(--chart-2)',
      path: '/dashboards/balance',
      badge: 'Financial',
      onClick: () => navigate('/dashboards/balance'),
    },
    {
      title: 'DCF Valuation',
      subtitle: 'Comprehensive DCF modeling with sensitivity analysis',
      icon: <Target />,
      color: 'var(--chart-4)',
      path: '/dcf-valuation',
      badge: 'Valuation',
      onClick: () => navigate('/dcf-valuation'),
    },
    {
      title: 'Parameters',
      subtitle: 'Configure comprehensive financial modeling parameters',
      icon: <Settings />,
      color: 'var(--chart-5)',
      path: '/parameters',
      badge: 'Configuration',
      onClick: () => navigate('/parameters'),
    },
    {
      title: 'File Upload',
      subtitle: 'Upload and process financial documents and spreadsheets',
      icon: <CloudUpload />,
      color: 'var(--chart-6)',
      path: '/upload',
      badge: 'Tools',
      onClick: () => navigate('/upload'),
    },
  ];

  const quickActions = [
    {
      title: 'Upload File',
      description: 'Process new financial data',
      icon: <CloudUpload className="h-5 w-5" />,
      action: () => navigate('/upload'),
      variant: 'default' as const,
    },
    {
      title: 'Configure Parameters',
      description: 'Set up modeling parameters',
      icon: <Settings className="h-5 w-5" />,
      action: () => navigate('/parameters'),
      variant: 'success' as const,
    },
    {
      title: 'Run DCF Valuation',
      description: 'Perform comprehensive valuation',
      icon: <Target className="h-5 w-5" />,
      action: () => navigate('/dcf-valuation'),
      variant: 'default' as const,
    },
  ];

  // Core Financial Modeling handlers
  const handleFileUpload = async (file: File) => {
    console.info('File uploaded:', file);
    toast.success(`File "${file.name}" uploaded successfully`);
    // Refresh dashboard after file upload
    await loadDashboardData(selectedPeriod, true);
  };

  const handleParameterChange = (parameters: any) => {
    console.debug('Parameters changed:', parameters);
    toast.success('Parameters updated successfully');
  };

  const handleScenarioCreate = (scenario: any) => {
    console.debug('Scenario created:', scenario);
    toast.success('New scenario created successfully');
  };

  const handleValuationChange = (valuation: any) => {
    console.debug('Valuation changed:', valuation);
    toast.success('DCF valuation updated');
  };

  const handleExportResults = async (_results: any) => {
    await exportMutation.mutateAsync({
      format: 'json',
      period: selectedPeriod,
    });
  };

  // Format metric value based on type
  const formatMetricValue = (
    value: number | undefined,
    unit: string,
    formatType?: string
  ) => {
    if (value === undefined || value === null) return 'N/A';

    switch (formatType) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          notation: value >= 1000000 ? 'compact' : 'standard',
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  // Get trend color
  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Display error state
  if (loadingState.error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Error Loading Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {loadingState.error.message}
            </p>
            <Button onClick={() => loadDashboardData()} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Section */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 sm:py-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Welcome back, {user?.first_name || user?.username || 'User'}!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              {dashboardData && (dashboardData as any).data_quality_score !== undefined
                ? `Last updated: ${new Date(
                  (dashboardData as any).last_updated
                ).toLocaleDateString()} - Data quality: ${(
                  Number((dashboardData as any).data_quality_score) * 100
                ).toFixed(0)}%`
                : 'Loading your financial dashboard...'}
            </p>
            {/* No demo badge */}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <select
                value={selectedPeriod}
                onChange={e =>
                  handlePeriodChange(e.target.value as PeriodFilter)
                }
                className="text-xs sm:text-sm border rounded px-2 py-1 bg-background"
                disabled={loadingState.isRefreshing}
              >
                <option value={PeriodFilter.MTD}>Month to Date</option>
                <option value={PeriodFilter.QTD}>Quarter to Date</option>
                <option value={PeriodFilter.YTD}>Year to Date</option>
                <option value={PeriodFilter.LAST_30_DAYS}>Last 30 Days</option>
                <option value={PeriodFilter.LAST_90_DAYS}>Last 90 Days</option>
                <option value={PeriodFilter.LAST_12_MONTHS}>
                  Last 12 Months
                </option>
              </select>
              {/* Removed demo/empty selector */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshDashboard}
                disabled={loadingState.isRefreshing}
                className="text-xs sm:text-sm"
              >
                <RefreshCw
                  className={`h-3 w-3 mr-1 ${loadingState.isRefreshing ? 'animate-spin' : ''
                    }`}
                />
                Refresh
              </Button>
            </div>
            <Badge variant="default" className="text-xs sm:text-sm">
              v2.0.0
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => navigate('/settings')}
            >
              Settings
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main>
        {/* Key Metrics Section */}
        <section className="py-6">
          <div className={componentStyles.container}>
            <h2 className="text-xl font-semibold mb-4">
              Key Financial Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loadingState.isLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader className="pb-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </CardContent>
                  </Card>
                ))
              ) : dashboardData && dashboardData.key_metrics ? (
                Object.entries(dashboardData.key_metrics).map(
                  ([key, metric]) => (
                    <Card
                      key={key}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {metric.name ||
                            key
                              .replace('_', ' ')
                              .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold mb-1">
                          {formatMetricValue(
                            metric.value,
                            metric.unit || '',
                            metric.format_type
                          )}
                        </div>
                        {metric.change_percentage !== undefined && (
                          <div
                            className={`text-sm ${getTrendColor(metric.trend)}`}
                          >
                            {metric.change_percentage > 0 ? '+' : ''}
                            {metric.change_percentage.toFixed(1)}% from last
                            period
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                )
              ) : ratiosData && (ratiosData as any).metrics ? (
                Object.entries((ratiosData as any).metrics).map(
                  ([key, metric]: any) => (
                    <Card
                      key={key}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {metric.name ||
                            key
                              .replace('_', ' ')
                              .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold mb-1">
                          {formatMetricValue(
                            metric.value,
                            metric.unit || '',
                            metric.format_type
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                )
              ) : (
                // No data state
                <div className="col-span-full">
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">
                        No financial metrics available. Upload financial
                        statements to see key metrics.
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Button onClick={() => navigate('/upload')}>
                          Upload Financial Data
                        </Button>
                        {/* No demo button */}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Financial Statements Preview */}
        <section className="py-6 border-t">
          <div className={componentStyles.container}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Recent Financial Statements
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/statements')}
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loadingState.isLoading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (statementsData?.statements?.length || 0) > 0 ? (
                (statementsData?.statements || [])
                  .slice(0, 6)
                  .map(statement => (
                    <Card
                      key={statement.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        const path =
                          statement.type === 'pl'
                            ? '/dashboards/pl'
                            : statement.type === 'balance_sheet'
                              ? '/dashboards/balance'
                              : '/dashboards/cashflow';
                        navigate(path, {
                          state: { statementId: statement.id },
                        });
                      }}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">
                            {statement.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {statement.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {statement.period_start && statement.period_end && (
                            <div>
                              Period:{' '}
                              {new Date(
                                statement.period_start
                              ).toLocaleDateString()}{' '}
                              -{' '}
                              {new Date(
                                statement.period_end
                              ).toLocaleDateString()}
                            </div>
                          )}
                          <div>Currency: {statement.currency}</div>
                          <div>
                            Updated:{' '}
                            {new Date(
                              statement.last_updated
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                // No statements state
                <div className="col-span-full">
                  <Card>
                    <CardContent className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No financial statements found. Upload your financial
                        data to get started.
                      </p>
                      <div className="space-x-2">
                        <Button onClick={() => navigate('/upload')}>
                          <CloudUpload className="h-4 w-4 mr-2" />
                          Upload Data
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => navigate('/parameters')}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Set Parameters
                        </Button>
                        {/* No demo button */}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Core Financial Modeling Interface */}
        <section className="py-8 border-t">
          <div className={componentStyles.container}>
            <h2 className="text-xl font-semibold mb-4">
              Financial Modeling Tools
            </h2>
            <CoreFinancialModeling
              onFileUpload={handleFileUpload}
              onParameterChange={handleParameterChange}
              onScenarioCreate={handleScenarioCreate}
              onValuationChange={handleValuationChange}
              onExportResults={handleExportResults}
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-6 sm:py-8 border-t">
          <div className={componentStyles.container}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className={componentStyles.heading.h2}>Quick Actions</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Get started with common financial modeling tasks
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  onClick={action.action}
                  className="h-auto p-4 sm:p-6 flex flex-col items-start space-y-2 sm:space-y-3"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 w-full">
                    {action.icon}
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base">
                        {action.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation Cards */}
        <section className="py-6 sm:py-8 border-t">
          <div className={componentStyles.container}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className={componentStyles.heading.h2}>Financial Tools</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Access specialized financial analysis tools
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {dashboardCards.map((card, index) => (
                <Card
                  key={index}
                  onClick={card.onClick}
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      {card.icon}
                      <CardTitle>{card.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {card.subtitle}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Started Guide */}
        <section className="py-6 sm:py-8 border-t">
          <div className={componentStyles.container}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className={componentStyles.heading.h2}>Getting Started</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Learn how to use the financial modeling platform
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                View All Guides
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card
                onClick={() => navigate('/upload')}
                className="cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CloudUpload />
                    <CardTitle>Upload Your Data</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Start by uploading your financial spreadsheets and documents
                  </p>
                </CardContent>
              </Card>
              <Card
                onClick={() => navigate('/parameters')}
                className="cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Settings />
                    <CardTitle>Configure Parameters</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Set up your modeling parameters and assumptions
                  </p>
                </CardContent>
              </Card>
              <Card
                onClick={() => navigate('/dcf-valuation')}
                className="cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Target />
                    <CardTitle>Run Analysis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generate comprehensive financial statements and valuations
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
