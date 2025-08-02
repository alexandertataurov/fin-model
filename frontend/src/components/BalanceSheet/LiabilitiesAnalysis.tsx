import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  Warning,
  CreditCard,
  AccountBalance,
  Receipt,
  TrendingUp,
  TrendingDown,
  Remove,
} from '@mui/icons-material';
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
      return <Receipt color="warning" />;
    } else if (category.includes('loan') || category.includes('debt') || category.includes('mortgage')) {
      return <AccountBalance color="error" />;
    } else if (category.includes('credit') || category.includes('card')) {
      return <CreditCard color="info" />;
    }
    return <Warning color="action" />;
  };

  const getTrendIcon = (trend?: string, changePercentage?: number) => {
    if (!trend && !changePercentage) return <Remove color="disabled" />;
    
    if (trend === 'up' || (changePercentage && changePercentage > 0)) {
      return <TrendingUp color="error" />; // Increasing liabilities is typically negative
    } else if (trend === 'down' || (changePercentage && changePercentage < 0)) {
      return <TrendingDown color="success" />; // Decreasing liabilities is typically positive
    }
    return <Remove color="disabled" />;
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

  const series = [{
    dataKey: 'value',
    name: 'Liabilities',
    color: 'var(--chart-2)',
  }];

  // Group liabilities by subcategory
  const groupedLiabilities = liabilityMetrics.reduce((groups, liability) => {
    const category = liability.subcategory || 'Other Liabilities';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(liability);
    return groups;
  }, {} as Record<string, BalanceSheetMetric[]>);

  // Categorize liabilities by term
  const currentLiabilities = liabilityMetrics.filter(l => 
    l.subcategory.toLowerCase().includes('current') || 
    l.subcategory.toLowerCase().includes('payable') ||
    l.subcategory.toLowerCase().includes('short')
  );
  
  const longTermLiabilities = liabilityMetrics.filter(l => 
    l.subcategory.toLowerCase().includes('long') || 
    l.subcategory.toLowerCase().includes('term') ||
    l.subcategory.toLowerCase().includes('mortgage')
  );

  const currentTotal = currentLiabilities.reduce((sum, l) => sum + l.value, 0);
  const longTermTotal = longTermLiabilities.reduce((sum, l) => sum + l.value, 0);

  return (
    <Card>
      <CardHeader>
        <Typography variant="h6" component="div">
          Liabilities & Debt Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Liabilities: {formatCurrency(totalLiabilities)}
        </Typography>
      </CardHeader>
      <CardContent>
        {/* Risk Assessment */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Debt Risk Assessment
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Debt-to-Asset Ratio
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(debtToAssetRatio, 100)}
                  color={riskAssessment.color}
                  sx={{ flex: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" fontWeight="medium">
                  {debtToAssetRatio.toFixed(1)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Risk Level
              </Typography>
              <Chip
                label={riskAssessment.level}
                color={riskAssessment.color}
                size="small"
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Current vs Long-term
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {((currentTotal / totalLiabilities) * 100).toFixed(1)}% Current | {((longTermTotal / totalLiabilities) * 100).toFixed(1)}% Long-term
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Bar Chart */}
          <Box sx={{ flex: 1, minHeight: 300 }}>
            <BarChart
              data={chartData}
              series={series}
              height={300}
              xAxisKey="category"
              currency="$"
              layout="vertical"
            />
          </Box>

          {/* Liabilities List */}
          <Box sx={{ flex: 1, maxHeight: 400, overflow: 'auto' }}>
            {Object.entries(groupedLiabilities).map(([subcategory, liabilities]) => (
              <Box key={subcategory} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="error" sx={{ mb: 1 }}>
                  {subcategory}
                </Typography>
                <List dense>
                  {liabilities.map((liability) => (
                    <ListItem key={liability.id} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getLiabilityIcon(liability.subcategory)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">
                              {liability.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {formatCurrency(liability.value)}
                              </Typography>
                              {getTrendIcon(liability.trend, liability.change_percentage)}
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {((liability.value / totalLiabilities) * 100).toFixed(1)}% of total liabilities
                            </Typography>
                            {liability.change_percentage && (
                              <Chip
                                label={formatPercentage(liability.change_percentage)}
                                size="small"
                                color={liability.change_percentage > 0 ? 'error' : 'success'}
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
            
            {liabilityMetrics.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No liability data available
              </Typography>
            )}
          </Box>
        </Box>

        {/* Liability Composition Summary */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Liability Composition Analysis
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Current Liabilities (Due within 1 year)
              </Typography>
              <Typography variant="h6" color="warning.main">
                {formatCurrency(currentTotal)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {((currentTotal / totalLiabilities) * 100).toFixed(1)}% of total liabilities
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Long-term Liabilities (Due after 1 year)
              </Typography>
              <Typography variant="h6" color="error.main">
                {formatCurrency(longTermTotal)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {((longTermTotal / totalLiabilities) * 100).toFixed(1)}% of total liabilities
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LiabilitiesAnalysis;