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
  GetApp,
  PictureAsPdf,
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { DashboardGrid, DashboardWidget } from '../components/Dashboard';
import { LineChart, BarChart, PieChart, LineChartDataPoint, BarChartDataPoint } from '../components/Charts';
import { ReportApi } from '../services/reportApi';

interface PLMetric {
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

interface PLDashboardData {
  metrics: PLMetric[];
  charts: {
    revenue_trend: ChartDataPoint[];
    profit_margins: ChartDataPoint[];
    expense_breakdown: ChartDataPoint[];
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

const PLDashboard: React.FC = () => {
  const [period, setPeriod] = useState<DashboardPeriod>('ytd');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const queryClient = useQueryClient();

  // Chart export handler
  const handleChartExport = async (format: 'PNG' | 'SVG' | 'PDF', chartTitle: string) => {
    try {
      setIsExporting(true);
      
      // Generate a comprehensive P&L report
      const reportData = await ReportApi.generateReport({
        export_format: format === 'PDF' ? 'PDF' : 'EXCEL',
        name: `PL_Report_${period}_${new Date().toISOString().split('T')[0]}`,
        custom_config: {
          period,
          report_type: 'PROFIT_LOSS',
          include_charts: true,
          chart_format: format
        }
      });

      // Poll for completion and download
      await ReportApi.pollExportStatus(
        reportData.id,
        (progress) => console.log(`Export progress: ${progress}%`)
      );

      // Download the completed report
      await ReportApi.downloadFile(reportData.id);
      
    } catch (error) {
      console.error('Export failed:', error);
      // You could show a toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery<PLDashboardData>({
    queryKey: ['pl-dashboard', period],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/v1/dashboard/metrics/pl?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch P&L dashboard data');
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
      await queryClient.invalidateQueries(['pl-dashboard']);
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

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getValueDisplay = (metric: PLMetric): string => {
    switch (metric.format_type) {
      case 'currency':
        return formatCurrency(metric.value);
      case 'percentage':
        return formatPercentage(metric.value);
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

  // Create dashboard widgets
  const widgets: DashboardWidget[] = [
    {
      id: 'key-metrics',
      title: 'Key P&L Metrics',
      component: ({ height }: { height?: number }) => (
        <Box sx={{ p: 2, height: height || 'auto' }}>
          <Grid container spacing={2}>
            {dashboardData?.metrics.slice(0, 4).map((metric) => (
              <Grid item xs={12} sm={6} key={metric.name}>
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
                        {metric.change_percentage > 0 ? '+' : ''}{formatPercentage(metric.change_percentage)} vs. last period
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
      id: 'revenue-trend',
      title: 'Revenue Trend',
      component: ({ height }: { height?: number }) => {
        const rawData = dashboardData?.charts.revenue_trend || [];
        const chartData: LineChartDataPoint[] = rawData.map(item => ({
          period: item.period,
          value: item.value,
          [item.period]: item.value, // Add dynamic key for Recharts
        }));
        
        const series = [{
          dataKey: 'value',
          name: 'Revenue',
          color: '#1976d2',
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
          />
        );
      },
      defaultWidth: 8,
      defaultHeight: 4,
      minWidth: 6,
      minHeight: 3,
    },
    {
      id: 'revenue-breakdown',
      title: 'Revenue Breakdown',
      component: ({ height }: { height?: number }) => {
        // Convert line data to pie chart data for breakdown
        const chartData = dashboardData?.charts.revenue_trend.slice(-1) || [];
        const pieData = chartData.map((item, index) => ({
          name: item.label || `Period ${index + 1}`,
          value: item.value,
        }));

        return (
          <PieChart
            data={pieData}
            height={height || 300}
            currency="$"
            showPercentages={true}
            innerRadius={60}
            centerLabel={{
              title: 'Total Revenue',
              value: pieData.reduce((sum, item) => sum + item.value, 0),
            }}
          />
        );
      },
      defaultWidth: 4,
      defaultHeight: 4,
      minWidth: 3,
      minHeight: 3,
    },
    {
      id: 'profit-margins',
      title: 'Profit Margins',
      component: ({ height }: { height?: number }) => {
        const rawData = dashboardData?.charts.profit_margins || [];
        const chartData: BarChartDataPoint[] = rawData.map(item => ({
          period: item.period,
          value: item.value,
          [item.period]: item.value, // Add dynamic key for Recharts
        }));
        
        const series = [{
          dataKey: 'value',
          name: 'Margin %',
          color: '#2e7d32',
        }];

        return (
          <BarChart
            data={chartData}
            series={series}
            height={height || 300}
            xAxisKey="period"
            yAxisLabel="Margin %"
            formatYAxisTick={(value: number) => `${value}%`}
          />
        );
      },
      defaultWidth: 6,
      defaultHeight: 4,
      minWidth: 4,
      minHeight: 3,
    },
    {
      id: 'expense-breakdown',
      title: 'Expense Analysis',
      component: ({ height }: { height?: number }) => {
        const rawData = dashboardData?.charts.expense_breakdown || [];
        const chartData: BarChartDataPoint[] = rawData.map(item => ({
          category: item.period, // Use category instead of period for expenses
          value: item.value,
          [item.period]: item.value, // Add dynamic key for Recharts
        }));
        
        const series = [{
          dataKey: 'value',
          name: 'Expenses',
          color: '#dc004e',
        }];

        return (
          <BarChart
            data={chartData}
            series={series}
            height={height || 300}
            xAxisKey="category"
            currency="$"
            layout="vertical"
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
        <Alert severity="error">
          Failed to load P&L dashboard data. Please try refreshing the page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Profit & Loss Dashboard
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
          
          <Button
            variant="contained"
            startIcon={isExporting ? <CircularProgress size={16} /> : <PictureAsPdf />}
            onClick={() => handleChartExport('PDF', 'P&L Dashboard')}
            disabled={isExporting}
          >
            Export PDF
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
      <DashboardGrid
        widgets={widgets}
        editable={false}
      />
    </Container>
  );
};

export default PLDashboard; 