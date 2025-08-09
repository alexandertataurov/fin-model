import React from 'react';
import { Card, CardHeader, CardContent } from '@/design-system/components/Card';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { Badge } from '@/design-system/components/Badge';
import { Separator } from '@/design-system/components/Separator';
import {
  TrendingUp,
  TrendingDown,
  Banknote,
  Building2,
  DollarSign,
  BarChart3,
  Minus,
} from 'lucide-react';
import { LineChart } from '../Charts';
import { BalanceSheetMetric, DashboardChartData } from '../../types/dashboard';

interface EquityTrendProps {
  data: {
    charts: {
      equity_trend: DashboardChartData[];
    };
    metrics: BalanceSheetMetric[];
  };
}

const EquityTrend: React.FC<EquityTrendProps> = ({ data }) => {




  const getEquityIcon = (subcategory: string) => {
    const category = subcategory.toLowerCase();
    if (
      category.includes('share') ||
      category.includes('stock') ||
      category.includes('capital')
    ) {
      return <Building2 className="text-blue-500" size={20} />;
    } else if (category.includes('retained') || category.includes('earning')) {
      return <DollarSign className="text-green-500" size={20} />;
    } else if (category.includes('reserve') || category.includes('surplus')) {
      return <BarChart3 className="text-purple-500" size={20} />;
    }
    return <Banknote className="text-gray-500" size={20} />;
  };

  const getTrendIcon = (trend?: string, changePercent?: number) => {
    if (!trend && !changePercent) {
      return <Minus className="text-gray-400" size={16} />;
    }

    if (trend === 'up' || (changePercent && changePercent > 0)) {
      return <TrendingUp className="text-green-500" size={16} />;
    } else if (trend === 'down' || (changePercent && changePercent < 0)) {
      return <TrendingDown className="text-red-500" size={16} />;
    }
    return <Minus className="text-gray-400" size={16} />;
  };

  const getEquityHealthColor = (
    roePlaceholder: number
  ): 'success' | 'warning' | 'error' => {
    if (roePlaceholder > 15) return 'success';
    if (roePlaceholder > 5) return 'warning';
    return 'error';
  };

  // Filter and sort equity metrics
  const equityMetrics = data.metrics
    .filter(m => m.category === 'equity')
    .sort((a, b) => b.value - a.value);

  const totalEquity = equityMetrics.reduce((sum, m) => sum + m.value, 0);

  // Calculate total assets for ROE calculation (simplified)
  const totalAssets = data.metrics
    .filter(m => m.category === 'assets')
    .reduce((sum, m) => sum + m.value, 0);

  // Placeholder for Return on Equity calculation (would normally come from P&L data)
  const estimatedROE = totalAssets > 0 ? (totalEquity / totalAssets) * 10 : 0; // Simplified placeholder

  // Prepare chart data
  const chartData = data.charts.equity_trend.map(item => ({
    period: item.period,
    value: item.value,
    [item.period]: item.value,
  }));
  const chartSeries = [
    { dataKey: 'value', name: 'Equity', color: 'var(--chart-1)' },
  ];

  // Group equity by subcategory
  const groupedEquity = equityMetrics.reduce(
    (groups, equity) => {
      const category = equity.subcategory || 'Other Equity';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(equity);
      return groups;
    },
    {} as Record<string, BalanceSheetMetric[]>
  );

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Equity Trend Analysis</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart Section */}
        <div className="h-64">
          <LineChart data={chartData} series={chartSeries} />
        </div>

        {/* Equity Components */}
        <div className="space-y-4">
          {Object.entries(groupedEquity).map(([category, equities]) => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {category}
              </h4>
              <div className="space-y-2">
                {equities.map((equity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getEquityIcon(equity.subcategory || '')}
                      <div>
                        <p className="font-medium">{equity.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(equity.value)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {equity.change_percentage !== undefined && (
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(equity.trend, equity.change_percentage)}
                          <span
                            className={`text-sm ${equity.change_percentage > 0
                                ? 'text-green-600'
                                : equity.change_percentage < 0
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                              }`}
                          >
                            {formatPercentage(equity.change_percentage)}
                          </span>
                        </div>
                      )}
                      <Badge variant="secondary">
                        {((equity.value / totalEquity) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          ))}
        </div>

        {/* Equity Health Summary */}
        <Card>
          <CardHeader>
            <h4 className="text-md font-semibold">Equity Health Indicators</h4>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Equity</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalEquity)}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Equity Ratio</p>
                <p className="text-2xl font-bold">
                  {totalAssets > 0
                    ? ((totalEquity / totalAssets) * 100).toFixed(1)
                    : '0'}
                  %
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Estimated ROE</p>
                <p className="text-2xl font-bold">{estimatedROE.toFixed(1)}%</p>
                <Badge
                  variant={
                    getEquityHealthColor(estimatedROE) === 'success'
                      ? 'default'
                      : getEquityHealthColor(estimatedROE) === 'warning'
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {getEquityHealthColor(estimatedROE) === 'success'
                    ? 'Excellent'
                    : getEquityHealthColor(estimatedROE) === 'warning'
                      ? 'Good'
                      : 'Needs Attention'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default EquityTrend;
