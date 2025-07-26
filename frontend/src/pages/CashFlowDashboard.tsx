import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { 
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Refresh,
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { DashboardGrid, DashboardWidget } from '../components/Dashboard';
import { LineChart, BarChart, WaterfallChart, LineChartDataPoint, BarChartDataPoint, WaterfallDataPoint } from '../components/Charts';

interface CFMetric {
  name: string;
  value: number;
  category: string;
  period: string;
  unit: string;
  format_type: string;
  change?: number;
  change_percentage?: number;
  trend?: string;
  description?: string;
  display_order: number;
}

interface ChartDataPoint {
  period: string;
  value: number;
  date: string;
  label?: string;
  category?: string;
}

interface CFDashboardData {
  metrics: CFMetric[];
  charts: {
    cash_waterfall: ChartDataPoint[];
    cash_position: ChartDataPoint[];
  };
  period_info: {
    period: string;
    start_date: string;
    end_date: string;
  };
  last_updated: string;
  data_quality_score: number;
}

type DashboardPeriod = 'mtd' | 'qtd' | 'ytd' | 'last_30_days' | 'last_90_days' | 'last_12_months';

const CashFlowDashboard: React.FC = () => {
  const [period, setPeriod] = useState<DashboardPeriod>('ytd');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery<CFDashboardData>({
    queryKey: ['cash-flow-dashboard', period],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/v1/dashboard/metrics/cash-flow?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cash flow dashboard data');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const handlePeriodChange = (event: SelectChangeEvent<DashboardPeriod>) => {
    setPeriod(event.target.value as DashboardPeriod);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      await queryClient.invalidateQueries(['cash-flow-dashboard']);
    } finally {
      setIsRefreshing(false);
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

  const getValueDisplay = (metric: CFMetric): string => {
    switch (metric.format_type) {
      case 'currency':
        return formatCurrency(metric.value);
      default:
        return metric.value.toLocaleString();
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" />;
      case 'down':
        return <TrendingDown color="error" />;
      default:
        return <AccountBalance color="action" />;
    }
  };

  // Create sample data for demonstration
  const sampleWaterfallData: WaterfallDataPoint[] = [
    { name: 'Starting Cash', value: 100000, type: 'start' },
    { name: 'Operating CF', value: 25000, type: 'positive' },
    { name: 'Investing CF', value: -15000, type: 'negative' },
    { name: 'Financing CF', value: -5000, type: 'negative' },
    { name: 'Ending Cash', value: 105000, type: 'total' },
  ];

  // Create dashboard widgets
  const widgets: DashboardWidget[] = [
    {
      id: 'key-metrics',
      title: 'Key Cash Flow Metrics',
      component: ({ height }: { height?: number }) => (
        <Box sx={{ p: 2, height: height || 'auto' }}>
          <Grid container spacing={2}>
            {dashboardData?.metrics.slice(0, 3).map((metric) => (
              <Grid item xs={12} sm={4} key={metric.name}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      {getTrendIcon(metric.trend)}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {getValueDisplay(metric)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {metric.name}
                    </Typography>
                    {metric.change_percentage && (
                      <Typography 
                        variant="caption" 
                        color={metric.change_percentage > 0 ? 'success.main' : 'error.main'}
                      >
                        {metric.change_percentage > 0 ? '+' : ''}{metric.change_percentage.toFixed(1)}% vs. last period
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )) || [1, 2, 3].map((i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <AccountBalance color="action" />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        ${(Math.random() * 100000).toFixed(0)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Sample Metric {i}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ),
      defaultWidth: 12,
      defaultHeight: 2,
      minWidth: 6,
      minHeight: 2,
    },
    {
      id: 'cash-waterfall',
      title: 'Cash Flow Waterfall',
      component: ({ height }: { height?: number }) => (
        <WaterfallChart
          data={sampleWaterfallData}
          height={height || 400}
          currency="$"
          title="Cash Flow Analysis"
          subtitle="Breaking down cash flow components"
        />
      ),
      defaultWidth: 8,
      defaultHeight: 5,
      minWidth: 6,
      minHeight: 4,
    },
    {
      id: 'cash-position',
      title: 'Cash Position Trend',
      component: ({ height }: { height?: number }) => {
        const rawData = dashboardData?.charts.cash_position || [];
        const chartData: LineChartDataPoint[] = rawData.length > 0 
          ? rawData.map(item => ({
              period: item.period,
              value: item.value,
              [item.period]: item.value,
            }))
          : [
              { period: 'Q1', value: 100000, 'Q1': 100000 },
              { period: 'Q2', value: 125000, 'Q2': 125000 },
              { period: 'Q3', value: 110000, 'Q3': 110000 },
              { period: 'Q4', value: 105000, 'Q4': 105000 },
            ];
        
        const series = [{
          dataKey: 'value',
          name: 'Cash Position',
          color: '#00695c',
        }];

        return (
          <LineChart
            data={chartData}
            series={series}
            height={height || 300}
            xAxisKey="period"
            currency="$"
            showDots={true}
            smooth={true}
            title="Cash Balance Over Time"
          />
        );
      },
      defaultWidth: 4,
      defaultHeight: 5,
      minWidth: 3,
      minHeight: 4,
    },
    {
      id: 'operating-cash-flow',
      title: 'Operating Cash Flow',
      component: ({ height }: { height?: number }) => {
        const chartData: BarChartDataPoint[] = [
          { month: 'Jan', value: 8000, 'Jan': 8000 },
          { month: 'Feb', value: 12000, 'Feb': 12000 },
          { month: 'Mar', value: 5000, 'Mar': 5000 },
          { month: 'Apr', value: 15000, 'Apr': 15000 },
        ];
        
        const series = [{
          dataKey: 'value',
          name: 'Operating CF',
          color: '#2e7d32',
        }];

        return (
          <BarChart
            data={chartData}
            series={series}
            height={height || 300}
            xAxisKey="month"
            currency="$"
            title="Monthly Operating Cash Flow"
          />
        );
      },
      defaultWidth: 6,
      defaultHeight: 4,
      minWidth: 4,
      minHeight: 3,
    },
    {
      id: 'free-cash-flow',
      title: 'Free Cash Flow',
      component: ({ height }: { height?: number }) => {
        const chartData: BarChartDataPoint[] = [
          { month: 'Jan', value: 5000, 'Jan': 5000 },
          { month: 'Feb', value: 8000, 'Feb': 8000 },
          { month: 'Mar', value: 2000, 'Mar': 2000 },
          { month: 'Apr', value: 10000, 'Apr': 10000 },
        ];
        
        const series = [{
          dataKey: 'value',
          name: 'Free CF',
          color: '#1976d2',
        }];

        return (
          <BarChart
            data={chartData}
            series={series}
            height={height || 300}
            xAxisKey="month"
            currency="$"
            title="Monthly Free Cash Flow"
          />
        );
      },
      defaultWidth: 6,
      defaultHeight: 4,
      minWidth: 4,
      minHeight: 3,
    },
  ];

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="info">
          Cash Flow dashboard is in demo mode. Connect your financial data to see real metrics.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Cash Flow Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              label="Period"
              onChange={handlePeriodChange}
            >
              <MenuItem value="mtd">Month to Date</MenuItem>
              <MenuItem value="qtd">Quarter to Date</MenuItem>
              <MenuItem value="ytd">Year to Date</MenuItem>
              <MenuItem value="last_30_days">Last 30 Days</MenuItem>
              <MenuItem value="last_90_days">Last 90 Days</MenuItem>
              <MenuItem value="last_12_months">Last 12 Months</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={isRefreshing ? <CircularProgress size={16} /> : <Refresh />}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Demo Notice */}
      <Alert severity="info" sx={{ mb: 3 }}>
        📊 This is a live demo of the Cash Flow Dashboard. Charts show sample data to demonstrate functionality.
      </Alert>

      {/* Period Info */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Period: {dashboardData?.period_info.start_date || 'Demo Period'} to {dashboardData?.period_info.end_date || 'Current'}
          {dashboardData?.last_updated && (
            <> • Last updated: {new Date(dashboardData.last_updated).toLocaleString()}</>
          )}
        </Typography>
      </Paper>

      {/* Dashboard Grid */}
      <DashboardGrid
        widgets={widgets}
        editable={false}
      />
    </Container>
  );
};

export default CashFlowDashboard; 