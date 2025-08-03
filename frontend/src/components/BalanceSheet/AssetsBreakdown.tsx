import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Banknote,
  DollarSign,
  Building2,
  Package,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { PieChart } from '../Charts';
import { BalanceSheetMetric, DashboardChartData } from '../../types/dashboard';

interface AssetsBreakdownProps {
  data: {
    charts: {
      assets_breakdown: DashboardChartData[];
    };
    metrics: BalanceSheetMetric[];
  };
}

const AssetsBreakdown: React.FC<AssetsBreakdownProps> = ({ data }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getAssetIcon = (subcategory: string) => {
    const category = subcategory.toLowerCase();
    if (category.includes('cash') || category.includes('bank')) {
      return <DollarSign className="text-primary" size={20} />;
    } else if (category.includes('inventory') || category.includes('stock')) {
      return <Package className="text-orange-500" size={20} />;
    } else if (
      category.includes('property') ||
      category.includes('equipment') ||
      category.includes('asset')
    ) {
      return <Building2 className="text-blue-500" size={20} />;
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

  // Filter and sort assets
  const assetMetrics = data.metrics
    .filter(m => m.category === 'assets')
    .sort((a, b) => b.value - a.value);

  // Prepare chart data
  const chartData = data.charts.assets_breakdown.map(item => ({
    name: item.label || item.period,
    value: item.value,
  }));

  const totalAssets = chartData.reduce((sum, item) => sum + item.value, 0);

  // Group assets by subcategory for better organization
  const groupedAssets = assetMetrics.reduce(
    (groups, asset) => {
      const category = asset.subcategory || 'Other Assets';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(asset);
      return groups;
    },
    {} as Record<string, BalanceSheetMetric[]>
  );

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Assets Breakdown</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart Section */}
        <div className="h-64">
          <PieChart data={chartData} />
        </div>

        {/* Assets List */}
        <div className="space-y-4">
          {Object.entries(groupedAssets).map(([category, assets]) => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {category}
              </h4>
              <div className="space-y-2">
                {assets.map((asset, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getAssetIcon(asset.subcategory || '')}
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(asset.value)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {asset.change_percentage !== undefined && (
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(asset.trend, asset.change_percentage)}
                          <span
                            className={`text-sm ${
                              asset.change_percentage > 0
                                ? 'text-green-600'
                                : asset.change_percentage < 0
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                            }`}
                          >
                            {formatPercentage(asset.change_percentage)}
                          </span>
                        </div>
                      )}
                      <Badge variant="secondary">
                        {((asset.value / totalAssets) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-primary/5 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Assets</span>
            <span className="text-xl font-bold">
              {formatCurrency(totalAssets)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetsBreakdown;
