/**
 * Comprehensive Financial Charts and Visualizations
 * Based on lean financial modeling plan - interactive financial data visualization
 */

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/design-system/components/Select';
// import { Badge } from '@/design-system/components/Badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { BarChart3, Download, Eye, EyeOff } from 'lucide-react';

interface FinancialData {
  period: string;
  revenue: number;
  costs: number;
  gross_profit: number;
  operating_expenses: number;
  operating_income: number;
  net_income: number;
  ebitda: number;
  free_cash_flow: number;
  total_assets: number;
  total_liabilities: number;
  equity: number;
  debt: number;
  cash: number;
}

interface ChartMetric {
  key: string;
  name: string;
  color: string;
  format: 'currency' | 'percentage' | 'number';
  category: 'revenue' | 'profitability' | 'cash_flow' | 'balance_sheet';
}

interface FinancialChartsProps {
  data: FinancialData[];
  title?: string;
  defaultChartType?: 'line' | 'bar' | 'area' | 'composed';
  showControls?: boolean;
}

  const FinancialCharts: React.FC<FinancialChartsProps> = ({
  data,
  title = 'Financial Performance',
  defaultChartType = 'line',
  showControls = true,
}) => {
  const [chartType, setChartType] = useState<
    'line' | 'bar' | 'area' | 'composed'
  >(defaultChartType);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'revenue',
    'net_income',
    'free_cash_flow',
  ]);
  const [timeRange, setTimeRange] = useState<'all' | '12m' | '6m' | '3m'>(
    'all'
  );

  const metrics: ChartMetric[] = [
    {
      key: 'revenue',
      name: 'Revenue',
      color: '#3B82F6',
      format: 'currency',
      category: 'revenue',
    },
    {
      key: 'gross_profit',
      name: 'Gross Profit',
      color: '#10B981',
      format: 'currency',
      category: 'profitability',
    },
    {
      key: 'operating_income',
      name: 'Operating Income',
      color: '#8B5CF6',
      format: 'currency',
      category: 'profitability',
    },
    {
      key: 'net_income',
      name: 'Net Income',
      color: '#F59E0B',
      format: 'currency',
      category: 'profitability',
    },
    {
      key: 'ebitda',
      name: 'EBITDA',
      color: '#EF4444',
      format: 'currency',
      category: 'profitability',
    },
    {
      key: 'free_cash_flow',
      name: 'Free Cash Flow',
      color: '#06B6D4',
      format: 'currency',
      category: 'cash_flow',
    },
    {
      key: 'total_assets',
      name: 'Total Assets',
      color: '#84CC16',
      format: 'currency',
      category: 'balance_sheet',
    },
    {
      key: 'equity',
      name: 'Equity',
      color: '#F97316',
      format: 'currency',
      category: 'balance_sheet',
    },
    {
      key: 'debt',
      name: 'Debt',
      color: '#EC4899',
      format: 'currency',
      category: 'balance_sheet',
    },
    {
      key: 'cash',
      name: 'Cash',
      color: '#14B8A6',
      format: 'currency',
      category: 'balance_sheet',
    },
  ];

  const filteredData = useMemo(() => {
    if (timeRange === 'all') return data;

    const monthsToShow =
      {
        '3m': 3,
        '6m': 6,
        '12m': 12,
      }[timeRange] || data.length;

    return data.slice(-monthsToShow);
  }, [data, timeRange]);

  const formatValue = (
    value: number,
    format: 'currency' | 'percentage' | 'number'
  ) => {
    switch (format) {
      case 'currency':
        if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
        if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
        if (Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  const CustomTooltipComp = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{`Period: ${label}`}</p>
          {payload.map((entry: any, index: number) => {
            const metric = metrics.find(m => m.key === entry.dataKey);
            return (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {`${entry.name}: ${formatValue(
                  entry.value,
                  metric?.format || 'currency'
                )}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricKey)
        ? prev.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };

  const renderChart = () => {
    const selectedMetricConfigs = metrics.filter(m =>
      selectedMetrics.includes(m.key)
    );

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={value => formatValue(value, 'currency')} />
              <Tooltip content={<CustomTooltipComp />} />
              <Legend />
              {selectedMetricConfigs.map(metric => (
                <Bar
                  key={metric.key}
                  dataKey={metric.key}
                  fill={metric.color}
                  name={metric.name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={value => formatValue(value, 'currency')} />
              <Tooltip content={<CustomTooltipComp />} />
              <Legend />
              {selectedMetricConfigs.map(metric => (
                <Area
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  fill={metric.color}
                  stroke={metric.color}
                  name={metric.name}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={value => formatValue(value, 'currency')} />
              <Tooltip content={<CustomTooltipComp />} />
              <Legend />
              {selectedMetricConfigs.slice(0, 2).map(metric => (
                <Bar
                  key={metric.key}
                  dataKey={metric.key}
                  fill={metric.color}
                  name={metric.name}
                />
              ))}
              {selectedMetricConfigs.slice(2).map(metric => (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  name={metric.name}
                  strokeWidth={2}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        );

      default: // line
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={value => formatValue(value, 'currency')} />
              <Tooltip content={<CustomTooltipComp />} />
              <Legend />
              {selectedMetricConfigs.map(metric => (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  name={metric.name}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const MetricSelector = () => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">Select Metrics</h4>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map(metric => (
          <button
            key={metric.key}
            onClick={() => toggleMetric(metric.key)}
            className={`flex items-center space-x-2 p-2 rounded text-sm transition-colors ${
              selectedMetrics.includes(metric.key)
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {selectedMetrics.includes(metric.key) ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            <span>{metric.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6" />
          <span>{title}</span>
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showControls && (
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Chart Type</label>
                <Select
                  value={chartType}
                  onValueChange={(value: any) => setChartType(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="area">Area</SelectItem>
                    <SelectItem value="composed">Composed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <Select
                  value={timeRange}
                  onValueChange={(value: any) => setTimeRange(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="12m">12 Months</SelectItem>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="3m">3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <MetricSelector />
          </div>
        )}

        <div className="mb-4">{renderChart()}</div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedMetrics.slice(0, 4).map(metricKey => {
            const metric = metrics.find(m => m.key === metricKey);
            const latestValue =
              filteredData[filteredData.length - 1]?.[
                metricKey as keyof FinancialData
              ] || 0;
            const previousValue =
              filteredData[filteredData.length - 2]?.[
                metricKey as keyof FinancialData
              ] || 0;
            const change = latestValue - previousValue;
            const changePercent =
              previousValue !== 0 ? (change / previousValue) * 100 : 0;

            return (
              <Card key={metricKey} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium text-gray-600">
                    {metric?.name}
                  </h4>
                  <div
                    className={`text-xs ${
                      change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {change >= 0 ? '+' : ''}
                    {changePercent.toFixed(1)}%
                  </div>
                </div>
                <p
                  className="text-lg font-semibold"
                  style={{ color: metric?.color }}
                >
                  {formatValue(
                    latestValue as number,
                    metric?.format || 'currency'
                  )}
                </p>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialCharts;
