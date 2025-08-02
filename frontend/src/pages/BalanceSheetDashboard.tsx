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
  Chip,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  AccountBalance,
  Refresh,
  PictureAsPdf,
  Assessment,
  MonetizationOn,
} from '@mui/icons-material';

import { DashboardGrid, DashboardWidget } from '../components/Dashboard';
import { LineChart, BarChart, PieChart, LineChartDataPoint, BarChartDataPoint } from '../components/Charts';
import { ReportApi } from '../services/reportApi';
import { useBalanceSheetDashboard, useDashboardRefresh } from '../hooks/useDashboardData';
import { DashboardPeriod, BalanceSheetDashboardData } from '../types/dashboard';
import ErrorBoundary from '../components/Dashboard/ErrorBoundary';
import { DashboardLoading } from '../components/Dashboard/LoadingStates';

const BalanceSheetDashboard: React.FC = () => {
  const [period, setPeriod] = useState<DashboardPeriod>('ytd');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { refreshDashboard } = useDashboardRefresh();

  // Chart export handler
  const handleChartExport = async (format: 'PNG' | 'SVG' | 'PDF', _chartTitle: string) => {
    try {
      setIsExporting(true);
      
      // Generate a comprehensive Balance Sheet report
      const reportData = await ReportApi.generateReport({
        export_format: format === 'PDF' ? 'PDF' : 'EXCEL',
        name: `BalanceSheet_Report_${period}_${new Date().toISOString().split('T')[0]}`,
        custom_config: {
          period,
          report_type: 'BALANCE_SHEET',
          include_charts: true,
          chart_format: format
        }
      });

      // Poll for completion and download
      await ReportApi.pollExportStatus(
        reportData.id,
        (_progress) => {
          // Progress callback - could show progress indicator here
          return;
        }
      );

      // Download the completed report
      await ReportApi.downloadFile(reportData.id);
      
    } catch (error) {
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
  } = useBalanceSheetDashboard(period);

  const handlePeriodChange = (event: SelectChangeEvent<DashboardPeriod>) => {
    setPeriod(event.target.value as DashboardPeriod);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      await refreshDashboard('balance-sheet');
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

  const formatNumber = (value: number): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };



  const getRatioDisplay = (ratio: BalanceSheetDashboardData['ratios'][0]): string => {
    if (ratio.category === 'liquidity' || ratio.category === 'leverage') {
      return formatNumber(ratio.value);
    }
    return formatPercentage(ratio.value);
  };



  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assets':
        return <MonetizationOn color="primary" />;
      case 'liabilities':
        return <Assessment color="warning" />;
      case 'equity':
        return <AccountBalance color="success" />;
      default:
        return <AccountBalance color="action" />;
    }
  };

  // Calculate balance sheet validation
  const calculateBalanceValidation = (data: BalanceSheetDashboardData) => {
    const totalAssets = data.metrics
      .filter(m => m.category === 'assets')
      .reduce((sum, m) => sum + m.value, 0);
    
    const totalLiabilities = data.metrics
      .filter(m => m.category === 'liabilities')
      .reduce((sum, m) => sum + m.value, 0);
    
    const totalEquity = data.metrics
      .filter(m => m.category === 'equity')
      .reduce((sum, m) => sum + m.value, 0);

    const difference = Math.abs(totalAssets - (totalLiabilities + totalEquity));
    const isBalanced = difference < 1000; // Allow for small rounding differences

    return {
      totalAssets,
      totalLiabilities,
      totalEquity,
      isBalanced,
      difference
    };
  };

  // Create dashboard widgets
  const widgets: DashboardWidget[] = [
    {
      id: 'balance-sheet-summary',
      title: 'Balance Sheet Summary',
      component: ({ height }: { height?: number }) => {
        if (!dashboardData) return null;
        
        const validation = calculateBalanceValidation(dashboardData);
        
        return (
          <Box sx={{ p: 2, height: height || 'auto' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      {getCategoryIcon('assets')}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {formatCurrency(validation.totalAssets)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Assets
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      {getCategoryIcon('liabilities')}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {formatCurrency(validation.totalLiabilities)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Liabilities
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      {getCategoryIcon('equity')}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {formatCurrency(validation.totalEquity)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Equity
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Chip
                    label={validation.isBalanced ? 'Balance Sheet Balanced ✓' : `Imbalance: ${formatCurrency(validation.difference)}`}
                    color={validation.isBalanced ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      },
      defaultWidth: 12,
      defaultHeight: 3,
      minWidth: 8,
      minHeight: 2,
    },
    {
      id: 'assets-breakdown',
      title: 'Assets Breakdown',
      component: ({ height }: { height?: number }) => {
        const chartData = dashboardData?.charts.assets_breakdown || [];
        const pieData = chartData.map(item => ({
          name: item.label || item.period,
          value: item.value,
        }));

        const totalAssets = pieData.reduce((sum, item) => sum + item.value, 0);

        return (
          <PieChart
            data={pieData}
            height={height || 350}
            currency="$"
            showPercentages={true}
            innerRadius={60}
            centerLabel={{
              title: 'Total Assets',
              value: totalAssets,
            }}
          />
        );
      },
      defaultWidth: 6,
      defaultHeight: 4,
      minWidth: 4,
      minHeight: 3,
    },
    {
      id: 'liabilities-breakdown',
      title: 'Liabilities Breakdown',
      component: ({ height }: { height?: number }) => {
        const rawData = dashboardData?.charts.liabilities_breakdown || [];
        const chartData: BarChartDataPoint[] = rawData.map(item => ({
          category: item.label || item.period,
          value: item.value,
          [item.period]: item.value,
        }));
        
        const series = [{
          dataKey: 'value',
          name: 'Liabilities',
          color: 'var(--chart-2)',
        }];

        return (
          <BarChart
            data={chartData}
            series={series}
            height={height || 350}
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
    {
      id: 'financial-ratios',
      title: 'Key Financial Ratios',
      component: ({ height }: { height?: number }) => (
        <Box sx={{ p: 2, height: height || 'auto' }}>
          <Grid container spacing={2}>
            {dashboardData?.ratios.slice(0, 6).map((ratio) => (
              <Grid item xs={12} sm={6} md={4} key={ratio.name}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">
                      {getRatioDisplay(ratio)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {ratio.name}
                    </Typography>
                    <Chip
                      label={ratio.category.charAt(0).toUpperCase() + ratio.category.slice(1)}
                      size="small"
                      variant="outlined"
                      color={
                        ratio.category === 'liquidity' ? 'primary' :
                        ratio.category === 'leverage' ? 'warning' :
                        ratio.category === 'efficiency' ? 'success' : 'info'
                      }
                    />
                    {ratio.benchmark && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Benchmark: {getRatioDisplay({ ...ratio, value: ratio.benchmark })}
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
      defaultHeight: 4,
      minWidth: 8,
      minHeight: 3,
    },
    {
      id: 'equity-trend',
      title: 'Equity Trend',
      component: ({ height }: { height?: number }) => {
        const rawData = dashboardData?.charts.equity_trend || [];
        const chartData: LineChartDataPoint[] = rawData.map(item => ({
          period: item.period,
          value: item.value,
          [item.period]: item.value,
        }));
        
        const series = [{
          dataKey: 'value',
          name: 'Equity',
          color: 'var(--chart-3)',
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
      id: 'liquidity-ratios',
      title: 'Liquidity Analysis',
      component: ({ height }: { height?: number }) => {
        const rawData = dashboardData?.charts.liquidity_ratios || [];
        const chartData: BarChartDataPoint[] = rawData.map(item => ({
          period: item.period,
          value: item.value,
          [item.period]: item.value,
        }));
        
        const series = [{
          dataKey: 'value',
          name: 'Ratio',
          color: 'var(--chart-4)',
        }];

        return (
          <BarChart
            data={chartData}
            series={series}
            height={height || 300}
            xAxisKey="period"
            yAxisLabel="Ratio"
            formatYAxisTick={(value: number) => value.toFixed(2)}
          />
        );
      },
      defaultWidth: 4,
      defaultHeight: 4,
      minWidth: 3,
      minHeight: 3,
    },
  ];

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <DashboardLoading 
          variant="card" 
          height={400}
          message="Loading Balance Sheet dashboard..."
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || 'Failed to load Balance Sheet dashboard data. Please try refreshing or contact support.'}
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
          Balance Sheet Dashboard
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
            onClick={() => handleChartExport('PDF', 'Balance Sheet Dashboard')}
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
      <ErrorBoundary 
        title="Balance Sheet Dashboard Error"
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

export default BalanceSheetDashboard;