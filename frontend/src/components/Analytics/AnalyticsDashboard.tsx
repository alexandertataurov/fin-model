import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gauge, AlertCircle, Upload, CheckCircle } from 'lucide-react';
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
  const [timePeriod, setTimePeriod] = useState<string>('7');

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<DashboardData>({
    queryKey: ['analytics-dashboard', timePeriod],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`, {
        params: { days: parseInt(timePeriod) },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
  };

  // DESIGN_FIX: use design system chart tokens
  const chartColors = [
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
  const fileTypeDistribution =
    dashboardData?.file_type_distribution?.distribution || [];
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
      <Alert className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overview Cards */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Upload className="text-primary mr-2" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-bold">{overview.total_files}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Completed Files
                  </p>
                  <p className="text-2xl font-bold">
                    {overview.completed_files}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-2" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Failed Files</p>
                  <p className="text-2xl font-bold">{overview.failed_files}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Gauge className="text-blue-500 mr-2" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">
                    {overview.success_rate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trends Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Daily Trends</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_files" stroke="#8884d8" />
                <Line
                  type="monotone"
                  dataKey="completed_files"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* File Type Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">File Type Distribution</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fileTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {fileTypeDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Performance Metrics</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Average Processing Time</span>
              <span>{performanceSummary.avg_processing_time.toFixed(2)}s</span>
            </div>
            <Progress
              value={Math.min(
                (performanceSummary.avg_processing_time / 60) * 100,
                100
              )}
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Throughput (files/hour)</span>
              <span>{performanceSummary.throughput.toFixed(1)}</span>
            </div>
            <Progress
              value={Math.min((performanceSummary.throughput / 100) * 100, 100)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Error Summary</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {errorSummary.top_error_categories.map((error, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{error.category}</span>
                <Badge variant="destructive">{error.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
