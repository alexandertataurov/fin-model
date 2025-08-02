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
} from '@mui/material';
import {
  AccountBalance,
  MonetizationOn,
  Business,
  Inventory,
  TrendingUp,
  TrendingDown,
  Remove,
} from '@mui/icons-material';
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
      return <MonetizationOn color="primary" />;
    } else if (category.includes('inventory') || category.includes('stock')) {
      return <Inventory color="warning" />;
    } else if (category.includes('property') || category.includes('equipment') || category.includes('asset')) {
      return <Business color="info" />;
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
  const groupedAssets = assetMetrics.reduce((groups, asset) => {
    const category = asset.subcategory || 'Other Assets';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(asset);
    return groups;
  }, {} as Record<string, BalanceSheetMetric[]>);

  return (
    <Card>
      <CardHeader>
        <Typography variant="h6" component="div">
          Assets Breakdown
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Assets: {formatCurrency(totalAssets)}
        </Typography>
      </CardHeader>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Pie Chart */}
          <Box sx={{ flex: 1, minHeight: 300 }}>
            <PieChart
              data={chartData}
              height={300}
              currency="$"
              showPercentages={true}
              innerRadius={60}
              centerLabel={{
                title: 'Total Assets',
                value: totalAssets,
              }}
            />
          </Box>

          {/* Asset List */}
          <Box sx={{ flex: 1, maxHeight: 400, overflow: 'auto' }}>
            {Object.entries(groupedAssets).map(([subcategory, assets]) => (
              <Box key={subcategory} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                  {subcategory}
                </Typography>
                <List dense>
                  {assets.map((asset) => (
                    <ListItem key={asset.id} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getAssetIcon(asset.subcategory)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">
                              {asset.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {formatCurrency(asset.value)}
                              </Typography>
                              {getTrendIcon(asset.trend, asset.change_percentage)}
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {((asset.value / totalAssets) * 100).toFixed(1)}% of total assets
                            </Typography>
                            {asset.change_percentage && (
                              <Chip
                                label={formatPercentage(asset.change_percentage)}
                                size="small"
                                color={asset.change_percentage > 0 ? 'success' : 'error'}
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
            
            {assetMetrics.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No asset data available
              </Typography>
            )}
          </Box>
        </Box>

        {/* Summary Statistics */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Asset Composition Summary
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(groupedAssets).map(([subcategory, assets]) => {
              const categoryTotal = assets.reduce((sum, asset) => sum + asset.value, 0);
              const percentage = ((categoryTotal / totalAssets) * 100).toFixed(1);
              
              return (
                <Chip
                  key={subcategory}
                  label={`${subcategory}: ${percentage}%`}
                  size="small"
                  variant="outlined"
                />
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssetsBreakdown;