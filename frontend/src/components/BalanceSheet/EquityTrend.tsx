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
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Business,
  MonetizationOn,
  Assessment,
  Remove,
} from '@mui/icons-material';
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

  const getEquityIcon = (subcategory: string) => {
    const category = subcategory.toLowerCase();
    if (category.includes('share') || category.includes('stock') || category.includes('capital')) {
      return <Business color="primary" />;
    } else if (category.includes('retained') || category.includes('earning')) {
      return <MonetizationOn color="success" />;
    } else if (category.includes('reserve') || category.includes('surplus')) {
      return <Assessment color="info" />;
    }
    return <AccountBalance color="action" />;
  };

  const getTrendIcon = (trend?: string, changePercentage?: number) => {
    if (!trend && !changePercentage) return <Remove color="disabled" />;
    
    if (trend === 'up' || (changePercentage && changePercentage > 0)) {
      return <TrendingUp color="success" />;
    } else if (trend === 'down' || (changePercentage && changePercentage < 0)) {
      return <TrendingDown color="error" />;
    }
    return <Remove color="disabled" />;
  };

  const getEquityHealthColor = (roePlaceholder: number): 'success' | 'warning' | 'error' => {
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

  const series = [{
    dataKey: 'value',
    name: 'Equity',
    color: 'var(--chart-3)',
  }];

  // Calculate equity trend
  const currentValue = chartData[chartData.length - 1]?.value || 0;
  const previousValue = chartData[chartData.length - 2]?.value || 0;
  const equityGrowth = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

  // Group equity by subcategory
  const groupedEquity = equityMetrics.reduce((groups, equity) => {
    const category = equity.subcategory || 'Other Equity';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(equity);
    return groups;
  }, {} as Record<string, BalanceSheetMetric[]>);

  // Calculate equity composition percentages
  const equityComposition = Object.entries(groupedEquity).map(([category, items]) => {
    const categoryTotal = items.reduce((sum, item) => sum + item.value, 0);
    const percentage = totalEquity > 0 ? (categoryTotal / totalEquity) * 100 : 0;
    return { category, total: categoryTotal, percentage };
  });

  return (
    <Card>
      <CardHeader>
        <Typography variant="h6" component="div">
          Equity Trend Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Shareholders' Equity: {formatCurrency(totalEquity)}
        </Typography>
      </CardHeader>
      <CardContent>
        {/* Equity Health Indicators */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
              <Typography variant="body2" color="text.secondary">
                Equity Growth
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                {getTrendIcon(equityGrowth > 0 ? 'up' : equityGrowth < 0 ? 'down' : undefined, equityGrowth)}
                <Typography variant="h6" color={equityGrowth > 0 ? 'success.main' : equityGrowth < 0 ? 'error.main' : 'text.primary'}>
                  {formatPercentage(equityGrowth)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
              <Typography variant="body2" color="text.secondary">
                Est. Return on Equity
              </Typography>
              <Typography variant="h6" color={getEquityHealthColor(estimatedROE)}>
                {formatPercentage(estimatedROE)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
              <Typography variant="body2" color="text.secondary">
                Equity Components
              </Typography>
              <Typography variant="h6">
                {Object.keys(groupedEquity).length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Line Chart */}
          <Box sx={{ flex: 2, minHeight: 300 }}>
            <LineChart
              data={chartData}
              series={series}
              height={300}
              xAxisKey="period"
              currency="$"
              showDots={true}
              smooth={true}
            />
          </Box>

          {/* Equity Breakdown */}
          <Box sx={{ flex: 1, maxHeight: 400, overflow: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Equity Components
            </Typography>
            {Object.entries(groupedEquity).map(([subcategory, equityItems]) => (
              <Box key={subcategory} sx={{ mb: 2 }}>
                <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 'medium' }}>
                  {subcategory}
                </Typography>
                <List dense>
                  {equityItems.map((equity) => (
                    <ListItem key={equity.id} sx={{ py: 0.5, pl: 2 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getEquityIcon(equity.subcategory)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">
                              {equity.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {formatCurrency(equity.value)}
                              </Typography>
                              {getTrendIcon(equity.trend, equity.change_percentage)}
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {((equity.value / totalEquity) * 100).toFixed(1)}% of total equity
                            </Typography>
                            {equity.change_percentage && (
                              <Chip
                                label={formatPercentage(equity.change_percentage)}
                                size="small"
                                color={equity.change_percentage > 0 ? 'success' : 'error'}
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
            
            {equityMetrics.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No equity data available
              </Typography>
            )}
          </Box>
        </Box>

        {/* Equity Composition Summary */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Equity Structure Analysis
          </Typography>
          <Grid container spacing={2}>
            {equityComposition.map(({ category, total, percentage }) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {category}
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(total)}
                  </Typography>
                  <Chip
                    label={`${percentage.toFixed(1)}%`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Key Insights */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Key Equity Insights
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Equity has {equityGrowth > 0 ? 'increased' : equityGrowth < 0 ? 'decreased' : 'remained stable'} by {Math.abs(equityGrowth).toFixed(1)}% from the previous period
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {equityComposition[0]?.category || 'N/A'} represents the largest component at {equityComposition[0]?.percentage.toFixed(1) || '0'}% of total equity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Estimated return on equity of {estimatedROE.toFixed(1)}% indicates {estimatedROE > 15 ? 'strong' : estimatedROE > 5 ? 'moderate' : 'weak'} performance
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EquityTrend;