const EnhancedCashFlowTab = () => { /* component logic */ }; // Extract main logic to a separate functional component
 * Enhanced Cash Flow Tab with Real Data Integration
 *
 * Displays real cash flow data with waterfall charts and trends
 */

import React, { useState } from 'react';
import { DraggableWidget } from '../draggable-widget';
import { Button } from '@/design-system/components/Button';
import { Card, CardContent, CardHeader } from '@/design-system/components/Card';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import { Skeleton } from '@/design-system/components/Skeleton';
import {
  Line,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Area,
  AreaChart,
} from 'recharts';
import CurrencyBarChart from '../Charts/CurrencyBarChart';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  AlertCircle,
  RefreshCw,
  Download,
  DollarSign,
} from 'lucide-react';
import {
  useCashFlowDashboard,
  useActiveStatement,
  useExportDashboard,
  useRefreshDashboard,
} from '../../hooks/useDashboard';
import { PeriodFilter } from '../../services/dashboardApi';

interface CashFlowTabEnhancedProps {
  period?: PeriodFilter;
}

export function CashFlowTabEnhanced({
  period = PeriodFilter.YTD,
}: CashFlowTabEnhancedProps) {
  const { activeStatementId, activeStatement } = useActiveStatement();
  const {
    data: cashFlowData,
    isLoading,
    error,
    refetch,
  } = useCashFlowDashboard(activeStatementId);
  const refreshMutation = useRefreshDashboard();
  const exportMutation = useExportDashboard();

  const [widgets, setWidgets] = useState([
    'cash-position',
    'waterfall-chart',
    'operating-cf',
    'cf-components',
  ]);

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(id => id !== widgetId));
  };

  const addWidget = () => {
    const availableWidgets = ['investing-cf', 'financing-cf', 'cf-forecast'];
    const unusedWidgets = availableWidgets.filter(w => !widgets.includes(w));
    if (unusedWidgets.length > 0) {
      setWidgets(prev => [...prev, unusedWidgets[0]]);
    }
  };

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const handleExport = () => {
    exportMutation.mutate({
      format: 'excel',
      period: period,
      statement_ids: activeStatementId ? [activeStatementId] : undefined,
    });
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  // Calculate key cash flow metrics
  const calculateCashFlowMetrics = () => {
    if (!cashFlowData) return null;

    const operatingCF = cashFlowData.operating_cash_flow.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const investingCF = cashFlowData.investing_cash_flow.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const financingCF = cashFlowData.financing_cash_flow.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const netCashFlow = operatingCF + investingCF + financingCF;

    return {
      operatingCF,
      investingCF,
      financingCF,
      netCashFlow,
    };
  };

  const metrics = calculateCashFlowMetrics();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
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
          <h2 className="text-2xl font-semibold">Cash Flow</h2>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load Cash Flow data. Please try refreshing or contact
            support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (!cashFlowData || !activeStatement) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Cash Flow</h2>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No Cash Flow data available. Upload a financial statement to get
            started.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Cash Flow Statement</h2>
          <p className="text-sm text-muted-foreground">
            {activeStatement.name} • {cashFlowData.period}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshMutation.isPending}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                refreshMutation.isPending ? 'animate-spin' : ''
              }`}
            />
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
          <Button onClick={addWidget} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {/* Cash Position Summary */}
        {widgets.includes('cash-position') && metrics && (
          <DraggableWidget
            id="cash-position"
            title="Cash Flow Summary"
            onRemove={removeWidget}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div
                  className={`flex items-center justify-center gap-1 mb-1 ${
                    metrics.operatingCF >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metrics.operatingCF >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-xs">Operating</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(metrics.operatingCF)}
                </p>
                <p className="text-sm text-muted-foreground">from Operations</p>
              </div>

              <div className="text-center">
                <div
                  className={`flex items-center justify-center gap-1 mb-1 ${
                    metrics.investingCF >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metrics.investingCF >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-xs">Investing</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(metrics.investingCF)}
                </p>
                <p className="text-sm text-muted-foreground">from Investing</p>
              </div>

              <div className="text-center">
                <div
                  className={`flex items-center justify-center gap-1 mb-1 ${
                    metrics.financingCF >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metrics.financingCF >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-xs">Financing</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(metrics.financingCF)}
                </p>
                <p className="text-sm text-muted-foreground">from Financing</p>
              </div>

              <div className="text-center">
                <div
                  className={`flex items-center justify-center gap-1 mb-1 ${
                    metrics.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs">Net Change</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(metrics.netCashFlow)}
                </p>
                <p className="text-sm text-muted-foreground">Net Cash Flow</p>
              </div>
            </div>
          </DraggableWidget>
        )}

        {/* Cash Flow Waterfall Chart */}
        {widgets.includes('waterfall-chart') && (
          <DraggableWidget
            id="waterfall-chart"
            title="Cash Flow Waterfall"
            onRemove={removeWidget}
            className="md:col-span-2"
          >
            <CurrencyBarChart
              data={cashFlowData.waterfall_data}
              tooltipLabel="Cash Flow"
              barColor="var(--chart-2)"
              showLegend
            />
          </DraggableWidget>
        )}

        {/* Operating Cash Flow Trend */}
        {widgets.includes('operating-cf') && (
          <DraggableWidget
            id="operating-cf"
            title="Operating Cash Flow Trend"
            onRemove={removeWidget}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData.operating_cash_flow}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickFormatter={value => formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    'Operating CF',
                  ]}
                  labelClassName="text-foreground"
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}

        {/* Cash Flow Components */}
        {widgets.includes('cf-components') && (
          <DraggableWidget
            id="cf-components"
            title="Cash Flow Components"
            onRemove={removeWidget}
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={cashFlowData.cash_position_trend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickFormatter={value => formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name,
                  ]}
                  labelClassName="text-foreground"
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Legend />
                <Bar dataKey="operating" stackId="cf" fill="var(--chart-2)" />
                <Bar dataKey="investing" stackId="cf" fill="var(--chart-3)" />
                <Bar dataKey="financing" stackId="cf" fill="var(--chart-4)" />
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}
      </div>
    </div>
  );
}
