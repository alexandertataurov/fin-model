import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import BaseChart from './BaseChart';

export interface PieChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieChartDataPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
  loading?: boolean;
  error?: string;
  currency?: string;
  showLegend?: boolean;
  showLabels?: boolean;
  showPercentages?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: {
    title: string;
    value: string | number;
  };
  onExport?: () => void;
  onFullscreen?: () => void;
  formatTooltip?: (value: number | string, name: string) => [string, string];
}

// DESIGN_FIX: use chart color tokens instead of hex values
const defaultColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  subtitle,
  height = 400,
  loading = false,
  error,
  currency = '$',
  showLegend = true,
  showLabels = true,
  showPercentages = true,
  innerRadius = 0,
  outerRadius,
  centerLabel,
  onExport,
  onFullscreen,
}) => {
  const enhancedData = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length],
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === '$' ? 'USD' : currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  const renderCustomizedLabel = (entry: { value: number; name: string }) => {
    if (!showLabels) return null;

    const percentage = ((entry.value / total) * 100).toFixed(1);

    if (showPercentages) {
      return `${percentage}%`;
    }

    return entry.name;
  };

  const customTooltip = ({ active, payload }: { active?: boolean; payload?: unknown[] }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const data = payload[0] as PieChartDataPoint;
    const percentage = ((data.value / total) * 100).toFixed(1);

    return (
      <Box
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          {data.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Value: {formatCurrency(data.value)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Percentage: {percentage}%
        </Typography>
      </Box>
    );
  };

  const chartRadius = outerRadius || Math.min(height * 0.35, 120);
  const isDonut = innerRadius > 0;

  const chartContent = (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={enhancedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={chartRadius}
          innerRadius={innerRadius}
          fill="var(--chart-1)" // DESIGN_FIX: replace hardcoded color
          dataKey="value"
          stroke="none"
        >
          {enhancedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>

        <Tooltip data-testid="tooltip" content={customTooltip} />

        {showLegend && (
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px',
            }}
            formatter={(value: unknown, entry: Record<string, unknown>) => {
              const percentageValue = formatPercentage((entry.payload as { value: number }).value);
              return `${value} (${percentageValue})`;
            }}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );

  return (
    <BaseChart
      title={title}
      subtitle={subtitle}
      height={height}
      loading={loading}
      error={error}
      onExport={onExport}
      onFullscreen={onFullscreen}
    >
      <Box sx={{ position: 'relative', height: '100%' }}>
        {chartContent}

        {/* Center Label for Donut Charts */}
        {isDonut && centerLabel && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                lineHeight: 1,
              }}
            >
              {typeof centerLabel.value === 'number'
                ? formatCurrency(centerLabel.value)
                : centerLabel.value
              }
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                mt: 0.5,
              }}
            >
              {centerLabel.title}
            </Typography>
          </Box>
        )}
      </Box>
    </BaseChart>
  );
};

export default PieChart;
