import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  MonetizationOn,
  Assessment,
  Remove,
} from '@mui/icons-material';
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

const MetricDisplay: React.FC<MetricDisplayProps> = ({ label, value, change, trend, category }) => {
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
    if (!trend && !change) return <Remove color="disabled" />;
    
    if (trend === 'up' || (change && change > 0)) {
      return category === 'liabilities' ? 
        <TrendingUp color="warning" /> : 
        <TrendingUp color="success" />;
    } else if (trend === 'down' || (change && change < 0)) {
      return category === 'liabilities' ? 
        <TrendingDown color="success" /> : 
        <TrendingDown color="error" />;
    }
    return <Remove color="disabled" />;
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'assets':
        return <MonetizationOn color="primary" />;
      case 'liabilities':
        return <Warning color="warning" />;
      case 'equity':
        return <AccountBalance color="success" />;
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {getCategoryIcon()}
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
        {formatCurrency(value)}
      </Typography>
      {(change || trend) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getTrendIcon()}
          {change && (
            <Chip
              label={formatPercentage(change)}
              size="small"
              color={
                category === 'liabilities' 
                  ? (change > 0 ? 'warning' : 'success')
                  : (change > 0 ? 'success' : 'error')
              }
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Paper>
  );
};

interface BalanceValidationProps {
  assets: number;
  liabilitiesEquity: number;
}

const BalanceValidation: React.FC<BalanceValidationProps> = ({ assets, liabilitiesEquity }) => {
  const difference = Math.abs(assets - liabilitiesEquity);
  const isBalanced = difference < 1000; // Allow for small rounding differences
  const percentageDifference = assets > 0 ? (difference / assets) * 100 : 0;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Alert 
      severity={isBalanced ? 'success' : percentageDifference < 5 ? 'warning' : 'error'}
      icon={isBalanced ? <CheckCircle /> : <Error />}
      sx={{ mt: 2 }}
    >
      <Typography variant="subtitle2">
        Balance Sheet Equation: Assets = Liabilities + Equity
      </Typography>
      <Typography variant="body2">
        {formatCurrency(assets)} = {formatCurrency(liabilitiesEquity)}
      </Typography>
      {!isBalanced && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Imbalance detected:</strong> {formatCurrency(difference)} difference ({percentageDifference.toFixed(2)}%)
        </Typography>
      )}
      {isBalanced && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          ✓ Balance sheet equation is satisfied
        </Typography>
      )}
    </Alert>
  );
};

const BalanceSheetSummary: React.FC<BalanceSheetSummaryProps> = ({ data }) => {
  const calculateTotal = (category: 'assets' | 'liabilities' | 'equity'): number => {
    return data.metrics
      .filter(m => m.category === category)
      .reduce((sum, m) => sum + m.value, 0);
  };

  const calculateChange = (category: 'assets' | 'liabilities' | 'equity'): number => {
    const metrics = data.metrics.filter(m => m.category === category);
    if (metrics.length === 0) return 0;
    
    const weightedChange = metrics.reduce((sum, m) => {
      const weight = m.value / calculateTotal(category);
      return sum + (m.change_percentage || 0) * weight;
    }, 0);
    
    return weightedChange;
  };

  const totalAssets = calculateTotal('assets');
  const totalLiabilities = calculateTotal('liabilities');
  const totalEquity = calculateTotal('equity');

  const assetsChange = calculateChange('assets');
  const liabilitiesChange = calculateChange('liabilities');
  const equityChange = calculateChange('equity');

  // Calculate key financial health indicators
  const debtToEquityRatio = totalEquity > 0 ? totalLiabilities / totalEquity : 0;
  const equityRatio = totalAssets > 0 ? (totalEquity / totalAssets) * 100 : 0;
  const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  // Assess financial health
  const getFinancialHealthColor = (): 'success' | 'warning' | 'error' => {
    if (equityRatio >= 50 && debtToEquityRatio <= 1) return 'success';
    if (equityRatio >= 30 && debtToEquityRatio <= 2) return 'warning';
    return 'error';
  };

  const getFinancialHealthLabel = (): string => {
    const color = getFinancialHealthColor();
    switch (color) {
      case 'success': return 'Strong';
      case 'warning': return 'Moderate';
      case 'error': return 'Weak';
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatRatio = (value: number): string => {
    return value.toFixed(2);
  };

  // Key insights
  const insights = [
    {
      icon: <Assessment color="info" />,
      text: `Total assets of ${formatCurrency(totalAssets)} represent the company's resource base`,
    },
    {
      icon: debtToEquityRatio <= 1 ? <CheckCircle color="success" /> : <Warning color="warning" />,
      text: `Debt-to-equity ratio of ${formatRatio(debtToEquityRatio)} indicates ${debtToEquityRatio <= 1 ? 'conservative' : 'aggressive'} leverage`,
    },
    {
      icon: equityRatio >= 50 ? <CheckCircle color="success" /> : <Warning color="warning" />,
      text: `Equity represents ${formatPercentage(equityRatio)} of total assets, indicating ${equityRatio >= 50 ? 'strong' : 'moderate'} ownership position`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <Typography variant="h6" component="div">
          Balance Sheet Summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Financial position overview as of {data.last_updated ? new Date(data.last_updated).toLocaleDateString() : 'N/A'}
        </Typography>
      </CardHeader>
      <CardContent>
        {/* Main Balance Sheet Metrics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <MetricDisplay
              label="Total Assets"
              value={totalAssets}
              change={assetsChange}
              category="assets"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricDisplay
              label="Total Liabilities"
              value={totalLiabilities}
              change={liabilitiesChange}
              category="liabilities"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricDisplay
              label="Total Equity"
              value={totalEquity}
              change={equityChange}
              category="equity"
            />
          </Grid>
        </Grid>

        {/* Balance Sheet Validation */}
        <BalanceValidation
          assets={totalAssets}
          liabilitiesEquity={totalLiabilities + totalEquity}
        />

        <Divider sx={{ my: 3 }} />

        {/* Financial Health Indicators */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Assessment color="primary" />
            Financial Health Indicators
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Overall Health
                </Typography>
                <Chip
                  label={getFinancialHealthLabel()}
                  color={getFinancialHealthColor()}
                  sx={{ mt: 1 }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Debt-to-Equity
                </Typography>
                <Typography variant="h6">
                  {formatRatio(debtToEquityRatio)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Equity Ratio
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(equityRatio)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Debt Ratio
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(debtRatio)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Key Insights */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Key Insights
          </Typography>
          <List dense>
            {insights.map((insight, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {insight.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {insight.text}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Data Quality Note */}
        {data.data_quality_score < 0.9 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Data quality score: {(data.data_quality_score * 100).toFixed(0)}%. 
              Some calculations may be based on estimated or incomplete data.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceSheetSummary;