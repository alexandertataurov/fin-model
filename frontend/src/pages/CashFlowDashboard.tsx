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

import { DashboardGrid, DashboardWidget } from '../components/Dashboard';
import { LineChart, BarChart, WaterfallChart, LineChartDataPoint, BarChartDataPoint, WaterfallDataPoint } from '../components/Charts';
import { useCashFlowDashboard, useDashboardRefresh } from '../hooks/useDashboardData';
import { DashboardPeriod } from '../types/dashboard';
import ErrorBoundary from '../components/Dashboard/ErrorBoundary';
import { DashboardLoading } from '../components/Dashboard/LoadingStates';
import type { CashFlowDashboardData } from '../types/dashboard';


const CashFlowDashboard: React.FC = () => {
  const [period, setPeriod] = useState<DashboardPeriod>('ytd');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshDashboard } = useDashboardRefresh();

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useCashFlowDashboard(period);

  const handlePeriodChange = (event: SelectChangeEvent<DashboardPeriod>) => {
    setPeriod(event.target.value as DashboardPeriod);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      await refreshDashboard('cash-flow');
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

  const getValueDisplay = (metric: CashFlowDashboardData['metrics'][0]): string => {
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

  // Convert backend waterfall data to chart format
  const getWaterfallData = (): WaterfallDataPoint[] => {
    if (!dashboardData?.charts?.cash_waterfall?.length) {
      return [];
    }
    
    return dashboardData.charts.cash_waterfall.map(item => ({
      name: item.label || item.period,
      value: item.value,
      type: item.category as 'start' | 'positive' | 'negative' | 'total' || 'positive'
    }));
  };

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
      component: ({ height }: { height?: number }) => {
        const waterfallData = getWaterfallData();
        return (
          <WaterfallChart
            data={waterfallData}
            height={height || 400}
            currency="$"
            title="Cash Flow Analysis"
            subtitle="Breaking down cash flow components"
          />
        );
      },
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
          color: 'var(--chart-3)', // DESIGN_FIX: use token
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
        const rawData = dashboardData?.charts?.operating_cash_flow || [];
        const chartData: BarChartDataPoint[] = rawData.map(item => ({
          month: item.period,
          value: item.value,
          [item.period]: item.value,
        }));
        
        const series = [{
          dataKey: 'value',
          name: 'Operating CF',
          color: 'var(--chart-2)',
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
        const rawData = dashboardData?.charts?.financing_cash_flow || [];
        const chartData: BarChartDataPoint[] = rawData.map(item => ({
          month: item.period,
          value: item.value,
          [item.period]: item.value,
        }));
        
        const series = [{
          dataKey: 'value',
          name: 'Free CF',
          color: 'var(--chart-1)',
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
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <DashboardLoading 
          variant="card" 
          height={400}
          message="Loading cash flow dashboard..."
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || 'Failed to load cash flow dashboard data. Please try refreshing or contact support.'}
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Retry
          </Button>
        </Box>
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

      {/* Data Quality Indicator */}
      {dashboardData && dashboardData.data_quality_score < 0.8 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Data quality score: {(dashboardData.data_quality_score * 100).toFixed(0)}%. 
          Some metrics may be estimated or incomplete.
        </Alert>
      )}

      {/* Period Info */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Period: {dashboardData?.period_info.start_date} to {dashboardData?.period_info.end_date}
          {dashboardData?.last_updated && (
            <> • Last updated: {new Date(dashboardData.last_updated).toLocaleString()}</>
          )}
        </Typography>
      </Paper>

      {/* Dashboard Grid */}
      <ErrorBoundary 
        title="Cash Flow Dashboard Error"
        onRetry={handleRefresh}
      >
        <DashboardGrid
          widgets={widgets}
          editable={false}
        />
      </ErrorBoundary>
    </Container>
  );
};

export default CashFlowDashboard; 