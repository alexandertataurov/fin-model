import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Speed,
  Error,
  CloudUpload,
  CheckCircle,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SelectChangeEvent } from '@mui/material/Select';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = '/api/v1';

interface DashboardData {
  overview: {
    total_files: number;
    completed_files: number;
    failed_files: number;
    success_rate: number;
    average_processing_time_minutes: number;
    total_size_mb: number;
  };
  daily_trends: Array<{
    date: string;
    total_files: number;
    completed_files: number;
    failed_files: number;
    success_rate: number;
    total_size_mb: number;
  }>;
  file_type_distribution: {
    distribution: Array<{
      file_type: string;
      count: number;
      percentage: number;
      average_size_mb: number;
    }>;
  };
  top_users: Array<{
    username: string;
    total_uploads: number;
    success_rate: number;
  }>;
  error_summary: {
    total_errors: number;
    top_error_categories: Array<{
      category: string;
      count: number;
    }>;
  };
  performance_summary: {
    avg_processing_time: number;
    throughput: number;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState(7);

  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['analytics-dashboard', timePeriod],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`, {
        params: { days: timePeriod },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleTimePeriodChange = (event: SelectChangeEvent<number>) => {
    setTimePeriod(event.target.value as number);
  };

  // Colors for charts
  const chartColors = [
    // DESIGN_FIX: use CSS variables for chart palette
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ];

  // Default values to prevent undefined errors
  const overview = dashboardData?.overview || {
    total_files: 0,
    completed_files: 0,
    failed_files: 0,
    success_rate: 0,
    average_processing_time_minutes: 0,
    total_size_mb: 0,
  };

  const dailyTrends = dashboardData?.daily_trends || [];
  const fileTypeDistribution = dashboardData?.file_type_distribution?.distribution || [];
  const topUsers = dashboardData?.top_users || [];
  const errorSummary = dashboardData?.error_summary || {
    total_errors: 0,
    top_error_categories: [],
  };
  const performanceSummary = dashboardData?.performance_summary || {
    avg_processing_time: 0,
    throughput: 0,
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load dashboard data. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analytics Dashboard
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={timePeriod}
            label="Time Period"
            onChange={handleTimePeriodChange}
          >
            <MenuItem value={7}>Last 7 days</MenuItem>
            <MenuItem value={14}>Last 14 days</MenuItem>
            <MenuItem value={30}>Last 30 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Overview Cards */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CloudUpload color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Files
                    </Typography>
                    <Typography variant="h5">
                      {overview.total_files}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Success Rate
                    </Typography>
                    <Typography variant="h5">
                      {overview.success_rate.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Speed color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Avg Processing Time
                    </Typography>
                    <Typography variant="h5">
                      {performanceSummary.avg_processing_time.toFixed(1)}m
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Error color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Failed Files
                    </Typography>
                    <Typography variant="h5">
                      {overview.failed_files}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Daily Trends Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Daily Processing Trends" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total_files"
                      // DESIGN_FIX: use chart color token
                      stroke="var(--chart-1)"
                      name="Total Files"
                    />
                    <Line
                      type="monotone"
                      dataKey="completed_files"
                      // DESIGN_FIX: use chart color token
                      stroke="var(--chart-2)"
                      name="Completed"
                    />
                    <Line
                      type="monotone"
                      dataKey="failed_files"
                      // DESIGN_FIX: use chart color token
                      stroke="var(--chart-3)"
                      name="Failed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* File Type Distribution */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="File Type Distribution" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fileTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ file_type, percentage }) => `${file_type} (${percentage}%)`}
                      outerRadius={80}
                      // DESIGN_FIX: use chart color token
                      fill="var(--chart-1)"
                      dataKey="count"
                    >
                      {fileTypeDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Users (if available) */}
          {topUsers.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Top Active Users" />
                <CardContent>
                  <List>
                    {topUsers.slice(0, 5).map((user, index) => (
                      <React.Fragment key={user.username}>
                        <ListItem>
                          <ListItemText
                            primary={user.username}
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2">
                                  {user.total_uploads} files
                                </Typography>
                                <Chip
                                  size="small"
                                  label={`${user.success_rate.toFixed(1)}% success`}
                                  color={user.success_rate > 90 ? 'success' : user.success_rate > 70 ? 'warning' : 'error'}
                                  variant="outlined"
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < Math.min(topUsers.length - 1, 4) && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Error Summary */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Common Issues" />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" color="error">
                    {errorSummary.total_errors} Total Errors
                  </Typography>
                </Box>
                <List>
                  {errorSummary.top_error_categories.length > 0 ? (
                    errorSummary.top_error_categories.map((error, index) => (
                      <React.Fragment key={error.category}>
                        <ListItem>
                          <ListItemText
                            primary={error.category}
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {error.count} occurrences
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min((error.count / errorSummary.total_errors) * 100, 100)}
                                  sx={{ mt: 1 }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < errorSummary.top_error_categories.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No errors recorded"
                        secondary="System is running smoothly"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Performance Summary" />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {performanceSummary.avg_processing_time.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Processing Time (minutes)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="secondary">
                        {performanceSummary.throughput.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Files per Hour
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {overview.total_size_mb.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Data Processed (MB)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AnalyticsDashboard; 