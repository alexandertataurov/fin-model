/**
 * Dashboard Overview Component
 * 
 * Main dashboard view showing overview of all financial statements and key metrics
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  DollarSign, 
  Percent,
  AlertCircle,
  RefreshCw,
  Download,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { 
  useDashboardOverview, 
  useRefreshDashboard, 
  useExportDashboard,
  useUserStatements 
} from '../hooks/useDashboard';
import { PeriodFilter } from '../services/dashboardApi';

interface DashboardOverviewProps {
  period?: PeriodFilter;
  onStatementSelect?: (statementId: string) => void;
}

export function DashboardOverview({ 
  period = PeriodFilter.YTD,
  onStatementSelect 
}: DashboardOverviewProps) {
  const { data: overview, isLoading, error, refetch } = useDashboardOverview(period);
  const { data: statements } = useUserStatements();
  const refreshMutation = useRefreshDashboard();
  const exportMutation = useExportDashboard();

  const [selectedPeriod] = useState(period);

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const handleExport = () => {
    exportMutation.mutate({
      format: 'excel',
      period: selectedPeriod
    });
  };

  const handleStatementClick = (statementId: string) => {
    if (onStatementSelect) {
      onStatementSelect(statementId);
    }
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  // Format percentage values
  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Get statement type badge color
  const getStatementTypeBadge = (type: string) => {
    switch (type) {
      case 'pl':
        return { label: 'P&L', variant: 'default' as const };
      case 'balance_sheet':
        return { label: 'Balance Sheet', variant: 'secondary' as const };
      case 'cash_flow':
        return { label: 'Cash Flow', variant: 'outline' as const };
      default:
        return { label: type, variant: 'default' as const };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        
        {/* Key Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (!overview || !statements?.statements?.length) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No financial data available. Upload financial statements to get started with your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            {overview.period_info.description} • Last updated: {new Date(overview.last_updated).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={refreshMutation.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleExport} 
            variant="outline" 
            size="sm"
            disabled={exportMutation.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(overview.key_metrics.revenue?.current || 0)}
            </div>
            <div className={`flex items-center text-xs ${
              (overview.key_metrics.revenue?.change_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {(overview.key_metrics.revenue?.change_percent || 0) >= 0 ? 
                <TrendingUp className="h-3 w-3 mr-1" /> : 
                <TrendingDown className="h-3 w-3 mr-1" />
              }
              {formatPercent(overview.key_metrics.revenue?.change_percent || 0)} from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(overview.key_metrics.net_income?.current || 0)}
            </div>
            <div className={`flex items-center text-xs ${
              (overview.key_metrics.net_income?.change_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {(overview.key_metrics.net_income?.change_percent || 0) >= 0 ? 
                <TrendingUp className="h-3 w-3 mr-1" /> : 
                <TrendingDown className="h-3 w-3 mr-1" />
              }
              {formatPercent(overview.key_metrics.net_income?.change_percent || 0)} from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Margin</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercent(overview.key_metrics.gross_margin?.current || 0)}
            </div>
            <div className={`flex items-center text-xs ${
              (overview.key_metrics.gross_margin?.change_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {(overview.key_metrics.gross_margin?.change_percent || 0) >= 0 ? 
                <TrendingUp className="h-3 w-3 mr-1" /> : 
                <TrendingDown className="h-3 w-3 mr-1" />
              }
              {formatPercent(overview.key_metrics.gross_margin?.change_percent || 0)} from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Ratio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(overview.key_metrics.current_ratio?.current || 0).toFixed(2)}
            </div>
            <div className={`flex items-center text-xs ${
              (overview.key_metrics.current_ratio?.change_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {(overview.key_metrics.current_ratio?.change_percent || 0) >= 0 ? 
                <TrendingUp className="h-3 w-3 mr-1" /> : 
                <TrendingDown className="h-3 w-3 mr-1" />
              }
              {formatPercent(overview.key_metrics.current_ratio?.change_percent || 0)} from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={overview.chart_data.revenue_trend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  labelClassName="text-foreground"
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--chart-1)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--chart-1)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={overview.chart_data.expense_breakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="var(--chart-1)"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {overview.chart_data.expense_breakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || `var(--chart-${(index % 5) + 1})`} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit Margins */}
        <Card>
          <CardHeader>
            <CardTitle>Profit Margins</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overview.chart_data.profit_margins}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Margin']}
                  labelClassName="text-foreground"
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--chart-3)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Financial Statements List */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Statements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overview.statements.map((statement) => {
                const badgeInfo = getStatementTypeBadge(statement.type);
                return (
                  <div 
                    key={statement.id}
                    className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                    onClick={() => handleStatementClick(statement.id)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{statement.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {statement.period_start} to {statement.period_end}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={badgeInfo.variant}>
                        {badgeInfo.label}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Score: {(statement.data_quality_score * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {statement.line_items_count} items
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Quality Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Data Quality Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    overview.data_quality_score >= 0.8 ? 'bg-green-500' :
                    overview.data_quality_score >= 0.6 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${overview.data_quality_score * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium">
              {(overview.data_quality_score * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Overall data quality based on completeness, consistency, and accuracy of financial data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}