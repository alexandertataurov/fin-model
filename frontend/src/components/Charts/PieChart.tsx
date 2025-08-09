import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
// Removed Material-UI imports - using Tailwind for layout
import BaseChart from './BaseChart';
import { formatCurrency } from '@/utils/formatters';

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

import { DEFAULT_CHART_COLORS } from '../../constants/colors';

// Use centralized chart color constants
const defaultColors = DEFAULT_CHART_COLORS;

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  subtitle,
  height = 400,
  loading = false,
  error,
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

  const renderCustomizedLabel = (entry: { value: number; name: string }) => {
    if (!showLabels) return null;

    const percentage = ((entry.value / total) * 100).toFixed(1);

    if (showPercentages) {
      return `${percentage}%`;
    }

    return entry.name;
  };

  const customTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: unknown[];
  }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const data = payload[0] as PieChartDataPoint;
    const percentage = ((data.value / total) * 100).toFixed(1);

    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <h4 className="font-semibold mb-2 text-foreground">{data.name}</h4>
        <p className="text-sm text-muted-foreground">
          Value: {formatCurrency(data.value)}
        </p>
        <p className="text-sm text-muted-foreground">
          Percentage: {percentage}%
        </p>
      </div>
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
            formatter={(_label: unknown, entry: Record<string, unknown>) => {
              const numericValue = (entry.payload as { value: number }).value;
              const percentage = ((numericValue / total) * 100).toFixed(1);
              return `${numericValue} (${percentage}%)`;
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
      aria-label={title || 'Pie Chart'}
      aria-describedby={subtitle ? undefined : undefined}
    >
      <div className="relative h-full">
        {chartContent}

        {/* Center Label for Donut Charts */}
        {isDonut && centerLabel && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <div className="text-lg font-bold text-primary leading-tight">
              {typeof centerLabel.value === 'number'
                ? formatCurrency(centerLabel.value)
                : centerLabel.value}
            </div>
            <div className="text-sm text-muted-foreground font-medium mt-1">
              {centerLabel.title}
            </div>
          </div>
        )}
      </div>
    </BaseChart>
  );
};

export default PieChart;
