import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  CreditCard,
  Banknote,
  Receipt,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { BarChart } from '../Charts';
import { BalanceSheetMetric, DashboardChartData } from '../../types/dashboard';

interface LiabilitiesAnalysisProps {
  data: {
    charts: {
      liabilities_breakdown: DashboardChartData[];
    };
    metrics: BalanceSheetMetric[];
  };
}

const LiabilitiesAnalysis: React.FC<LiabilitiesAnalysisProps> = ({ data }) => {
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

  const getLiabilityIcon = (subcategory: string) => {
    const category = subcategory.toLowerCase();
    if (category.includes('payable') || category.includes('account')) {
      return <Receipt className="text-orange-500" size={20} />;
    } else if (category.includes('loan') || category.includes('debt') || category.includes('mortgage')) {
      return <Banknote className="text-red-500" size={20} />;
    } else if (category.includes('credit') || category.includes('card')) {
      return <CreditCard className="text-blue-500" size={20} />;
    }
    return <AlertTriangle className="text-gray-500" size={20} />;
  };

  const getTrendIcon = (trend?: string, changePercentage?: number) => {
    if (!trend && !changePercentage) return <Minus className="text-gray-400" size={16} />;
    
    if (trend === 'up' || (changePercentage && changePercentage > 0)) {
      return <TrendingUp className="text-red-500" size={16} />; // Increasing liabilities is typically negative
    } else if (trend === 'down' || (changePercentage && changePercentage < 0)) {
      return <TrendingDown className="text-green-500" size={16} />; // Decreasing liabilities is typically positive
    }
    return <Minus className="text-gray-400" size={16} />;
  };

  const getLiabilityRiskLevel = (percentage: number): { level: string; color: 'success' | 'warning' | 'error' } => {
    if (percentage < 30) return { level: 'Low Risk', color: 'success' };
    if (percentage < 60) return { level: 'Moderate Risk', color: 'warning' };
    return { level: 'High Risk', color: 'error' };
  };

  // Filter and sort liabilities
  const liabilityMetrics = data.metrics
    .filter(m => m.category === 'liabilities')
    .sort((a, b) => b.value - a.value);

  // Calculate total assets for debt ratio calculation
  const totalAssets = data.metrics
    .filter(m => m.category === 'assets')
    .reduce((sum, m) => sum + m.value, 0);

  const totalLiabilities = liabilityMetrics.reduce((sum, m) => sum + m.value, 0);
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
  const riskAssessment = getLiabilityRiskLevel(debtToAssetRatio);

  // Prepare chart data
  const chartData = data.charts.liabilities_breakdown.map(item => ({
    category: item.label || item.period,
    value: item.value,
    [item.period]: item.value,
  }));

  // Group liabilities by subcategory
  const groupedLiabilities = liabilityMetrics.reduce((groups, liability) => {
    const category = liability.subcategory || 'Other Liabilities';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(liability);
    return groups;
  }, {} as Record<string, BalanceSheetMetric[]>);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Liabilities Analysis</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Assessment */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-orange-500" size={20} />
              <span className="font-medium">Debt Risk Assessment</span>
            </div>
            <Badge variant={riskAssessment.color === 'success' ? 'default' : 
                          riskAssessment.color === 'warning' ? 'secondary' : 'destructive'}>
              {riskAssessment.level}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Debt-to-Asset Ratio</span>
              <span>{debtToAssetRatio.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(debtToAssetRatio, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {debtToAssetRatio < 30 ? 'Low debt levels indicate strong financial position' :
               debtToAssetRatio < 60 ? 'Moderate debt levels require monitoring' :
               'High debt levels may indicate financial stress'}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="h-64">
          <BarChart data={chartData} />
        </div>

        {/* Liabilities Breakdown */}
        <div className="space-y-4">
          {Object.entries(groupedLiabilities).map(([category, liabilities]) => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {category}
              </h4>
              <div className="space-y-2">
                {liabilities.map((liability, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getLiabilityIcon(liability.subcategory || '')}
                      <div>
                        <p className="font-medium">{liability.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(liability.value)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {liability.changePercentage !== undefined && (
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(liability.trend, liability.changePercentage)}
                          <span className={`text-sm ${
                            liability.changePercentage > 0 ? 'text-red-600' : 
                            liability.changePercentage < 0 ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {formatPercentage(liability.changePercentage)}
                          </span>
                        </div>
                      )}
                      <Badge variant="secondary">
                        {((liability.value / totalLiabilities) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          ))}
        </div>

        {/* Summary Statistics */}
        <Card>
          <CardHeader>
            <h4 className="text-md font-semibold">Liabilities Summary</h4>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Liabilities</p>
                <p className="text-2xl font-bold">{formatCurrency(totalLiabilities)}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Debt-to-Asset Ratio</p>
                <p className="text-2xl font-bold">{debtToAssetRatio.toFixed(1)}%</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Liability Categories</p>
                <p className="text-2xl font-bold">{Object.keys(groupedLiabilities).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default LiabilitiesAnalysis;