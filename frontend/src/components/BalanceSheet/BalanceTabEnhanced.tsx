/**
 * Enhanced Balance Sheet Tab with Real Data Integration
 *
 * Displays real balance sheet data with composition charts and financial ratios
 */

import React, { useState } from 'react';
import { DraggableWidget } from '../draggable-widget';
import { Button } from '@/design-system/atoms';
import { Card, CardContent, CardHeader } from '@/design-system/molecules';
import { Alert, AlertDescription } from '@/design-system/molecules';
import { Skeleton } from '@/design-system/atoms';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import CurrencyBarChart from '../Charts/CurrencyBarChart';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  AlertCircle,
  RefreshCw,
  Download,
  Percent,
  Shield,
} from 'lucide-react';
import {
  useBalanceSheetDashboard,
  useActiveStatement,
  useExportDashboard,
  useRefreshDashboard,
} from '../../hooks/useDashboard';
import { PeriodFilter } from '../../services/dashboardApi';

interface BalanceTabEnhancedProps {
  period?: PeriodFilter;
}

export function BalanceTabEnhanced({
  period = PeriodFilter.YTD,
}: BalanceTabEnhancedProps) {
  const { activeStatementId, activeStatement } = useActiveStatement();
  const {
    data: balanceData,
    isLoading,
    error,
    refetch,
  } = useBalanceSheetDashboard(activeStatementId);
  const refreshMutation = useRefreshDashboard();
  const exportMutation = useExportDashboard();

  const [widgets, setWidgets] = useState([
    'financial-ratios',
    'asset-composition',
    'liability-breakdown',
    'equity-structure',
  ]);

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(id => id !== widgetId));
  };

  const addWidget = () => {
    const availableWidgets = [
      'liquidity-trend',
      'leverage-analysis',
      'working-capital',
    ];
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

  // Format ratio values
  const formatRatio = (value: number) => {
    return value.toFixed(2);
  };

  // Format percentage values
  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

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
          <h2 className="text-2xl font-semibold">Balance Sheet</h2>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load Balance Sheet data. Please try refreshing or contact
            support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (!balanceData || !activeStatement) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Balance Sheet</h2>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No Balance Sheet data available. Upload a financial statement to get
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
          <h2 className="text-2xl font-semibold">Balance Sheet</h2>
          <p className="text-sm text-muted-foreground">
            {activeStatement.name} • {balanceData.period}
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
        {/* Financial Ratios */}
        {widgets.includes('financial-ratios') && (
          <DraggableWidget
            id="financial-ratios"
            title="Key Financial Ratios"
            onRemove={removeWidget}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div
                  className={`flex items-center justify-center gap-1 mb-1 ${
                    (balanceData.leverage_metrics.current_ratio?.current ||
                      0) >= 2
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-xs">Liquidity</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatRatio(
                    balanceData.leverage_metrics.current_ratio?.current || 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Current Ratio</p>
              </div>

              <div className="text-center">
                <div
                  className={`flex items-center justify-center gap-1 mb-1 ${
                    (balanceData.leverage_metrics.debt_to_equity?.current ||
                      0) <= 1
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  <Percent className="h-4 w-4" />
                  <span className="text-xs">Leverage</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatRatio(
                    balanceData.leverage_metrics.debt_to_equity?.current || 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Debt-to-Equity</p>
              </div>

              <div className="text-center">
                <div
                  className={`flex items-center justify-center gap-1 mb-1 ${
                    (balanceData.leverage_metrics.return_on_assets
                      ?.change_percent || 0) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {(balanceData.leverage_metrics.return_on_assets
                    ?.change_percent || 0) >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-xs">ROA</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatPercent(
                    balanceData.leverage_metrics.return_on_assets?.current || 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Return on Assets
                </p>
              </div>

              <div className="text-center">
                <div
                  className={`flex items-center justify-center gap-1 mb-1 ${
                    (balanceData.leverage_metrics.return_on_equity
                      ?.change_percent || 0) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {(balanceData.leverage_metrics.return_on_equity
                    ?.change_percent || 0) >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-xs">ROE</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatPercent(
                    balanceData.leverage_metrics.return_on_equity?.current || 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Return on Equity
                </p>
              </div>
            </div>
          </DraggableWidget>
        )}

        {/* Asset Composition */}
        {widgets.includes('asset-composition') && (
          <DraggableWidget
            id="asset-composition"
            title="Asset Composition"
            onRemove={removeWidget}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={balanceData.asset_composition}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="var(--chart-1)"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {balanceData.asset_composition.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || `var(--chart-${(index % 5) + 1})`}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    'Value',
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}

        {/* Liability Breakdown */}
        {widgets.includes('liability-breakdown') && (
          <DraggableWidget
            id="liability-breakdown"
            title="Liability Structure"
            onRemove={removeWidget}
          >
            <CurrencyBarChart
              data={balanceData.liability_breakdown}
              tooltipLabel="Amount"
              barColor="var(--chart-4)"
            />
          </DraggableWidget>
        )}

        {/* Equity Structure */}
        {widgets.includes('equity-structure') && (
          <DraggableWidget
            id="equity-structure"
            title="Equity Structure"
            onRemove={removeWidget}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={balanceData.equity_structure}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="var(--chart-3)"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {balanceData.equity_structure.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || `var(--chart-${(index % 5) + 1})`}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    'Value',
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}

        {/* Liquidity Ratios Trend */}
        {widgets.includes('liquidity-trend') && (
          <DraggableWidget
            id="liquidity-trend"
            title="Liquidity Trend"
            onRemove={removeWidget}
            className="md:col-span-2"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={balanceData.liquidity_ratios}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickFormatter={value => formatRatio(value)}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatRatio(value),
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
                <Line
                  type="monotone"
                  dataKey="current_ratio"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  name="Current Ratio"
                />
                <Line
                  type="monotone"
                  dataKey="quick_ratio"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  name="Quick Ratio"
                />
                <Line
                  type="monotone"
                  dataKey="cash_ratio"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  name="Cash Ratio"
                />
              </LineChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}
      </div>
    </div>
  );
}
