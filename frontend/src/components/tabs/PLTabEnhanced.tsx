/**
 * Enhanced P&L Tab with Real Data Integration
 * 
 * Displays real financial data from processed Excel files
 */

import { useState } from 'react';
import { DraggableWidget } from '../draggable-widget';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Percent, Plus, AlertCircle, RefreshCw, Download } from 'lucide-react';
import { usePLDashboard, useActiveStatement, useExportDashboard, useRefreshDashboard } from '../../hooks/useDashboard';
import { PeriodFilter } from '../../services/dashboardApi';

interface PLTabEnhancedProps {
  period?: PeriodFilter;
}

export function PLTabEnhanced({ period = PeriodFilter.YTD }: PLTabEnhancedProps) {
  const { activeStatementId, activeStatement } = useActiveStatement();
  const { data: plData, isLoading, error, refetch } = usePLDashboard(activeStatementId);
  const refreshMutation = useRefreshDashboard();
  const exportMutation = useExportDashboard();

  const [widgets, setWidgets] = useState([
    'kpis',
    'revenue-trend',
    'expense-breakdown',
    'profit-margin'
  ]);

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(id => id !== widgetId));
  };

  const addWidget = () => {
    // In a real app, this would show a dialog to select widget type
    const availableWidgets = ['revenue-forecast', 'expense-trend', 'margin-comparison'];
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
      statement_ids: activeStatementId ? [activeStatementId] : undefined
    });
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
          <h2 className="text-2xl font-semibold">Profit & Loss</h2>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load P&L data. Please try refreshing or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (!plData || !activeStatement) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Profit & Loss</h2>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No P&L data available. Upload a financial statement to get started.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Profit & Loss</h2>
          <p className="text-sm text-muted-foreground">
            {activeStatement.name} • {plData.period}
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
          <Button onClick={addWidget} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {/* Key Performance Indicators */}
        {widgets.includes('kpis') && (
          <DraggableWidget
            id="kpis"
            title="Key Metrics"
            onRemove={removeWidget}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`flex items-center justify-center gap-1 mb-1 ${
                  (plData.key_metrics.revenue?.change_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(plData.key_metrics.revenue?.change_percent || 0) >= 0 ? 
                    <TrendingUp className="h-4 w-4" /> : 
                    <TrendingDown className="h-4 w-4" />
                  }
                  <span className="text-xs">
                    {formatPercent(plData.key_metrics.revenue?.change_percent || 0)}
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(plData.key_metrics.revenue?.current || 0)}
                </p>
                <p className="text-sm text-muted-foreground">Revenue</p>
              </div>

              <div className="text-center">
                <div className={`flex items-center justify-center gap-1 mb-1 ${
                  (plData.key_metrics.net_income?.change_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(plData.key_metrics.net_income?.change_percent || 0) >= 0 ? 
                    <TrendingUp className="h-4 w-4" /> : 
                    <TrendingDown className="h-4 w-4" />
                  }
                  <span className="text-xs">
                    {formatPercent(plData.key_metrics.net_income?.change_percent || 0)}
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(plData.key_metrics.net_income?.current || 0)}
                </p>
                <p className="text-sm text-muted-foreground">Net Income</p>
              </div>

              <div className="text-center">
                <div className={`flex items-center justify-center gap-1 mb-1 ${
                  (plData.key_metrics.gross_margin?.change_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <Percent className="h-4 w-4" />
                  <span className="text-xs">
                    {formatPercent(plData.key_metrics.gross_margin?.change_percent || 0)}
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {formatPercent(plData.key_metrics.gross_margin?.current || 0)}
                </p>
                <p className="text-sm text-muted-foreground">Gross Margin</p>
              </div>

              <div className="text-center">
                <div className={`flex items-center justify-center gap-1 mb-1 ${
                  (plData.key_metrics.operating_margin?.change_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <Percent className="h-4 w-4" />
                  <span className="text-xs">
                    {formatPercent(plData.key_metrics.operating_margin?.change_percent || 0)}
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {formatPercent(plData.key_metrics.operating_margin?.current || 0)}
                </p>
                <p className="text-sm text-muted-foreground">Operating Margin</p>
              </div>
            </div>
          </DraggableWidget>
        )}

        {/* Revenue Trend Chart */}
        {widgets.includes('revenue-trend') && (
          <DraggableWidget
            id="revenue-trend"
            title="Revenue Trend"
            onRemove={removeWidget}
            className="md:col-span-2"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={plData.time_series}>
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
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--chart-1)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--chart-1)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--chart-1)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}

        {/* Expense Breakdown */}
        {widgets.includes('expense-breakdown') && (
          <DraggableWidget
            id="expense-breakdown"
            title="Expense Breakdown"
            onRemove={removeWidget}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={plData.expense_data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="var(--chart-1)"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {plData.expense_data.map((entry, index) => (
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
          </DraggableWidget>
        )}

        {/* Profit Margin Analysis */}
        {widgets.includes('profit-margin') && (
          <DraggableWidget
            id="profit-margin"
            title="Profit Margins"
            onRemove={removeWidget}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={plData.margin_analysis}>
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
          </DraggableWidget>
        )}
      </div>
    </div>
  );
}