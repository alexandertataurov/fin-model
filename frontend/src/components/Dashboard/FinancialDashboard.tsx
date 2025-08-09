/**
 * Comprehensive Financial Dashboard
 * Based on lean financial modeling plan - unified financial modeling interface
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/design-system/components/Tabs';
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
} from '@/utils/formatters';
import {
  LayoutDashboard,
  Settings,
  BarChart3,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

// Import our components
import ProfitLossView from '../FinancialStatements/ProfitLossView';
import BalanceSheetView from '../FinancialStatements/BalanceSheetView';
import CashFlowView from '../FinancialStatements/CashFlowView';
import DCFView from '../FinancialStatements/DCFView';
import ParameterManager from '../Parameters/ParameterManager';
import ScenarioManager from '../Parameters/ScenarioManager';
import FinancialCharts from '../Charts/FinancialCharts';

interface DashboardMetrics {
  revenue: number;
  revenue_growth: number;
  net_income: number;
  net_margin: number;
  free_cash_flow: number;
  enterprise_value: number;
  debt_to_equity: number;
  roic: number;
  current_ratio: number;
  employee_count: number;
  revenue_per_employee: number;
}

interface FinancialDashboardProps {
  isLoading?: boolean;
  onRefresh?: () => void;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  isLoading: _isLoading = false,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [calculationStatus, setCalculationStatus] = useState<
    'idle' | 'calculating' | 'completed' | 'error'
  >('completed');

  // Mock data - in real app, this would come from API/state management
  const metrics: DashboardMetrics = {
    revenue: 12500000,
    revenue_growth: 0.15,
    net_income: 2100000,
    net_margin: 0.168,
    free_cash_flow: 1800000,
    enterprise_value: 45000000,
    debt_to_equity: 0.35,
    roic: 0.18,
    current_ratio: 2.3,
    employee_count: 85,
    revenue_per_employee: 147058,
  };

  // Using shared formatters from @/utils/formatters

  const handleRefresh = () => {
    setCalculationStatus('calculating');
    setLastUpdated(new Date());
    onRefresh?.();

    // Simulate calculation time
    setTimeout(() => {
      setCalculationStatus('completed');
    }, 2000);
  };

  const MetricCard: React.FC<{
    title: string;
    value: string;
    change?: number;
    icon: React.ReactNode;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
  }> = ({ title, value, change, icon, color, trend }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <div className={`${color} opacity-80`}>{icon}</div>
        </div>
        {change !== undefined && (
          <div className="mt-2 flex items-center">
            {trend === 'up' && (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            )}
            {trend === 'down' && (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm ${
                trend === 'up'
                  ? 'text-green-600'
                  : trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {change > 0 ? '+' : ''}
              {formatPercentage(change)} vs last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const StatusIndicator = () => (
    <div className="flex items-center space-x-2">
      {calculationStatus === 'calculating' && (
        <>
          <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-sm text-blue-600">Calculating...</span>
        </>
      )}
      {calculationStatus === 'completed' && (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600">Up to date</span>
        </>
      )}
      {calculationStatus === 'error' && (
        <>
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-600">Error in calculation</span>
        </>
      )}
      <span className="text-xs text-gray-500">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </span>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Key Performance Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Revenue"
            value={formatCurrency(metrics.revenue)}
            change={metrics.revenue_growth}
            icon={<TrendingUp className="w-6 h-6" />}
            color="text-blue-600"
            trend="up"
          />
          <MetricCard
            title="Net Income"
            value={formatCurrency(metrics.net_income)}
            change={0.12}
            icon={<DollarSign className="w-6 h-6" />}
            color="text-green-600"
            trend="up"
          />
          <MetricCard
            title="Free Cash Flow"
            value={formatCurrency(metrics.free_cash_flow)}
            change={0.08}
            icon={<Activity className="w-6 h-6" />}
            color="text-purple-600"
            trend="up"
          />
          <MetricCard
            title="Enterprise Value"
            value={formatCurrency(metrics.enterprise_value)}
            change={0.05}
            icon={<Target className="w-6 h-6" />}
            color="text-indigo-600"
            trend="up"
          />
        </div>
      </div>

      {/* Financial Ratios */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Financial Ratios</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Net Margin"
            value={formatPercentage(metrics.net_margin)}
            icon={<BarChart3 className="w-6 h-6" />}
            color="text-emerald-600"
          />
          <MetricCard
            title="ROIC"
            value={formatPercentage(metrics.roic)}
            icon={<Target className="w-6 h-6" />}
            color="text-orange-600"
          />
          <MetricCard
            title="Debt/Equity"
            value={metrics.debt_to_equity.toFixed(2)}
            icon={<BarChart3 className="w-6 h-6" />}
            color="text-pink-600"
          />
          <MetricCard
            title="Current Ratio"
            value={metrics.current_ratio.toFixed(1)}
            icon={<Activity className="w-6 h-6" />}
            color="text-cyan-600"
          />
        </div>
      </div>

      {/* Operational Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Operational Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
          <MetricCard
            title="Employee Count"
            value={formatNumber(metrics.employee_count)}
            change={0.18}
            icon={<Users className="w-6 h-6" />}
            color="text-blue-600"
            trend="up"
          />
          <MetricCard
            title="Revenue/Employee"
            value={formatCurrency(metrics.revenue_per_employee)}
            change={-0.02}
            icon={<DollarSign className="w-6 h-6" />}
            color="text-green-600"
            trend="down"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
        <FinancialCharts
          data={[]} // Mock data would go here
          title="Historical Performance"
          defaultChartType="line"
          showControls={true}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* Dashboard Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <LayoutDashboard className="w-6 h-6" />
            <span>Financial Modeling Dashboard</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <StatusIndicator />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={calculationStatus === 'calculating'}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  calculationStatus === 'calculating' ? 'animate-spin' : ''
                }`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="profit-loss"
            className="flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>P&L</span>
          </TabsTrigger>
          <TabsTrigger
            value="balance-sheet"
            className="flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Balance Sheet</span>
          </TabsTrigger>
          <TabsTrigger
            value="cash-flow"
            className="flex items-center space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>Cash Flow</span>
          </TabsTrigger>
          <TabsTrigger value="dcf" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>DCF</span>
          </TabsTrigger>
          <TabsTrigger
            value="parameters"
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Parameters</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="profit-loss" className="mt-6">
          <ProfitLossView
            isLoading={calculationStatus === 'calculating'}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="balance-sheet" className="mt-6">
          <BalanceSheetView
            isLoading={calculationStatus === 'calculating'}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="cash-flow" className="mt-6">
          <CashFlowView
            isLoading={calculationStatus === 'calculating'}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="dcf" className="mt-6">
          <DCFView
            isLoading={calculationStatus === 'calculating'}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="parameters" className="mt-6">
          <div className="space-y-6">
            <ParameterManager
              isLoading={calculationStatus === 'calculating'}
              onSave={() => handleRefresh()}
            />
            <ScenarioManager isLoading={calculationStatus === 'calculating'} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialDashboard;
