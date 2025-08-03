import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Banknote,
  DollarSign,
  BarChart3,
  Minus,
} from 'lucide-react';
import { BalanceSheetDashboardData } from '../../types/dashboard';

interface BalanceSheetSummaryProps {
  data: BalanceSheetDashboardData;
}

interface MetricDisplayProps {
  label: string;
  value: number;
  change?: number;
  trend?: string;
  category: 'assets' | 'liabilities' | 'equity';
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  change,
  trend,
  category,
}) => {
  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatPercentage = (val: number): string => {
    return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
  };

  const getTrendIcon = () => {
    if (!trend && !change) return <Minus className="text-gray-400" size={16} />;

    if (trend === 'up' || (change && change > 0)) {
      return category === 'liabilities' ? (
        <TrendingUp className="text-orange-500" size={16} />
      ) : (
        <TrendingUp className="text-green-500" size={16} />
      );
    } else if (trend === 'down' || (change && change < 0)) {
      return category === 'liabilities' ? (
        <TrendingDown className="text-green-500" size={16} />
      ) : (
        <TrendingDown className="text-red-500" size={16} />
      );
    }
    return <Minus className="text-gray-400" size={16} />;
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'assets':
        return <DollarSign className="text-blue-500" size={20} />;
      case 'liabilities':
        return <AlertTriangle className="text-orange-500" size={20} />;
      case 'equity':
        return <Banknote className="text-green-500" size={20} />;
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {getCategoryIcon()}
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <p className="text-2xl font-bold mb-2">{formatCurrency(value)}</p>
        {(change || trend) && (
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            {change && (
              <Badge variant={change > 0 ? 'default' : 'destructive'}>
                {formatPercentage(change)}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface BalanceValidationProps {
  assets: number;
  liabilitiesEquity: number;
}

const BalanceValidation: React.FC<BalanceValidationProps> = ({
  assets,
  liabilitiesEquity,
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const difference = assets - liabilitiesEquity;
  const isBalanced = Math.abs(difference) < 1000; // Tolerance of $1,000

  return (
    <Alert
      className={
        isBalanced ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      }
    >
      <CheckCircle
        className={`h-4 w-4 ${isBalanced ? 'text-green-600' : 'text-red-600'}`}
      />
      <AlertDescription>
        <div className="space-y-1">
          <p className="font-medium">
            {isBalanced
              ? 'Balance Sheet is Balanced'
              : 'Balance Sheet Imbalance Detected'}
          </p>
          <p className="text-sm">
            Assets: {formatCurrency(assets)} | Liabilities + Equity:{' '}
            {formatCurrency(liabilitiesEquity)}
          </p>
          {!isBalanced && (
            <p className="text-sm font-medium text-red-600">
              Difference: {formatCurrency(difference)}
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

const BalanceSheetSummary: React.FC<BalanceSheetSummaryProps> = ({ data }) => {
  const calculateTotal = (
    category: 'assets' | 'liabilities' | 'equity'
  ): number => {
    return data.metrics
      .filter(m => m.category === category)
      .reduce((sum, metric) => sum + metric.value, 0);
  };

  const calculateChange = (
    category: 'assets' | 'liabilities' | 'equity'
  ): number => {
    const currentTotal = calculateTotal(category);
    const previousTotal = data.metrics
      .filter(m => m.category === category)
      .reduce((sum, metric) => sum + (metric.previousValue || 0), 0);

    if (previousTotal === 0) return 0;
    return ((currentTotal - previousTotal) / previousTotal) * 100;
  };

  const getFinancialHealthColor = (): 'success' | 'warning' | 'error' => {
    const assets = calculateTotal('assets');
    const liabilities = calculateTotal('liabilities');
    const equity = calculateTotal('equity');

    const debtToEquityRatio = liabilities / equity;
    const currentRatio = assets / liabilities;

    if (debtToEquityRatio < 0.5 && currentRatio > 1.5) return 'success';
    if (debtToEquityRatio < 1.0 && currentRatio > 1.0) return 'warning';
    return 'error';
  };

  const getFinancialHealthLabel = (): string => {
    const health = getFinancialHealthColor();
    switch (health) {
      case 'success':
        return 'Excellent';
      case 'warning':
        return 'Good';
      case 'error':
        return 'Needs Attention';
    }
  };

  const formatRatio = (value: number): string => {
    return value.toFixed(2);
  };

  const totalAssets = calculateTotal('assets');
  const totalLiabilities = calculateTotal('liabilities');
  const totalEquity = calculateTotal('equity');
  const totalLiabilitiesEquity = totalLiabilities + totalEquity;

  const assetsChange = calculateChange('assets');
  const liabilitiesChange = calculateChange('liabilities');
  const equityChange = calculateChange('equity');

  const currentRatio = totalAssets / totalLiabilities;
  const debtToEquityRatio = totalLiabilities / totalEquity;
  const debtToAssetsRatio = totalLiabilities / totalAssets;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricDisplay
          label="Total Assets"
          value={totalAssets}
          change={assetsChange}
          category="assets"
        />
        <MetricDisplay
          label="Total Liabilities"
          value={totalLiabilities}
          change={liabilitiesChange}
          category="liabilities"
        />
        <MetricDisplay
          label="Total Equity"
          value={totalEquity}
          change={equityChange}
          category="equity"
        />
      </div>

      {/* Balance Validation */}
      <BalanceValidation
        assets={totalAssets}
        liabilitiesEquity={totalLiabilitiesEquity}
      />

      {/* Financial Ratios */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Financial Ratios</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Ratio</p>
              <p className="text-2xl font-bold">{formatRatio(currentRatio)}</p>
              <p className="text-xs text-muted-foreground">
                {currentRatio > 1.5
                  ? 'Excellent'
                  : currentRatio > 1.0
                    ? 'Good'
                    : 'Needs Attention'}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Debt-to-Equity</p>
              <p className="text-2xl font-bold">
                {formatRatio(debtToEquityRatio)}
              </p>
              <p className="text-xs text-muted-foreground">
                {debtToEquityRatio < 0.5
                  ? 'Excellent'
                  : debtToEquityRatio < 1.0
                    ? 'Good'
                    : 'High Risk'}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Debt-to-Assets</p>
              <p className="text-2xl font-bold">
                {formatRatio(debtToAssetsRatio)}
              </p>
              <p className="text-xs text-muted-foreground">
                {debtToAssetsRatio < 0.3
                  ? 'Excellent'
                  : debtToAssetsRatio < 0.5
                    ? 'Good'
                    : 'High Risk'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Financial Health</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={20} />
              <span className="font-medium">Overall Health</span>
            </div>
            <Badge
              variant={
                getFinancialHealthColor() === 'success'
                  ? 'default'
                  : getFinancialHealthColor() === 'warning'
                    ? 'secondary'
                    : 'destructive'
              }
            >
              {getFinancialHealthLabel()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceSheetSummary;
