import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Tooltip as RechartsTooltip,
} from 'recharts';
import BaseChart from './BaseChart';
import CustomTooltip from './CustomTooltip';

export interface LineChartDataPoint {
  [key: string]: string | number;
}

export interface LineSeriesConfig {
  dataKey: string;
  name: string;
  color: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  dot?: boolean;
}

interface LineChartProps {
  data: LineChartDataPoint[];
  series: LineSeriesConfig[];
  title?: string;
  subtitle?: string;
  height?: number;
  loading?: boolean;
  error?: string;
  xAxisKey?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  currency?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showDots?: boolean;
  smooth?: boolean;
  referenceLines?: Array<{
    value: number;
    label?: string;
    color?: string;
  }>;
  onExport?: () => void;
  onFullscreen?: () => void;
  formatTooltip?: (value: number | string, name: string) => [string, string];
  formatXAxisTick?: (value: string) => string;
  formatYAxisTick?: (value: number) => string;
}

import { DEFAULT_CHART_COLORS } from '../../constants/colors';

// Use centralized chart color constants
const defaultColors = DEFAULT_CHART_COLORS;

export const LineChart: React.FC<LineChartProps> = ({
  data,
  series,
  title,
  subtitle,
  height = 400,
  loading = false,
  error,
  xAxisKey = 'period',
  xAxisLabel,
  yAxisLabel,
  currency = '$',
  showGrid = true,
  showLegend = true,
  showDots = false,
  smooth = true,
  referenceLines = [],
  onExport,
  onFullscreen,
  formatTooltip,
  formatXAxisTick,
  formatYAxisTick,
}) => {
  const formatYAxis = (value: number): string => {
    if (formatYAxisTick) {
      return formatYAxisTick(value);
    }

    // Auto-format based on value size
    if (Math.abs(value) >= 1000000) {
      return `${currency}${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${currency}${(value / 1000).toFixed(1)}K`;
    }
    return `${currency}${value}`;
  };

  const formatXAxis = (value: string): string => {
    if (formatXAxisTick) {
      return formatXAxisTick(value);
    }
    return value;
  };

  const enhancedSeries = series.map((seriesItem, index) => ({
    ...seriesItem,
    color: seriesItem.color || defaultColors[index % defaultColors.length],
    strokeWidth: seriesItem.strokeWidth || 2,
    dot: seriesItem.dot !== undefined ? seriesItem.dot : showDots,
  }));

  const chartContent = (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--muted)" // DESIGN_FIX: replace hardcoded grid color
            opacity={0.5}
          />
        )}

        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 12 }}
          tickFormatter={formatXAxis}
          label={
            xAxisLabel
              ? { value: xAxisLabel, position: 'insideBottom', offset: -10 }
              : undefined
          }
        />

        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={formatYAxis}
          label={
            yAxisLabel
              ? { value: yAxisLabel, angle: -90, position: 'insideLeft' }
              : undefined
          }
        />

        <RechartsTooltip
          data-testid="tooltip"
          content={
            <CustomTooltip
              formatter={formatTooltip}
              labelFormatter={label => `Period: ${label}`}
            />
          }
        />

        {showLegend && (
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px',
            }}
          />
        )}

        {/* Reference Lines */}
        {referenceLines.map((refLine, index) => (
          <ReferenceLine
            key={index}
            y={refLine.value}
            stroke={refLine.color || 'var(--muted-foreground)'} // DESIGN_FIX: replace hardcoded reference line color
            strokeDasharray="5 5"
            label={{
              value: refLine.label || '',
              position: 'top',
              fontSize: 12,
            }}
          />
        ))}

        {/* Data Lines */}
        {enhancedSeries.map(seriesItem => (
          <Line
            key={seriesItem.dataKey}
            type={smooth ? 'monotone' : 'linear'}
            dataKey={seriesItem.dataKey}
            name={seriesItem.name}
            stroke={seriesItem.color}
            strokeWidth={seriesItem.strokeWidth}
            strokeDasharray={seriesItem.strokeDasharray}
            dot={seriesItem.dot}
            activeDot={{
              r: 4,
              stroke: seriesItem.color,
              strokeWidth: 2,
              fill: 'var(--background)', // DESIGN_FIX: replace hardcoded active dot color
            }}
            connectNulls={false}
          />
        ))}
      </RechartsLineChart>
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
      aria-label={title || 'Line Chart'}
      aria-describedby={subtitle ? undefined : undefined}
    >
      {chartContent}
    </BaseChart>
  );
};

export default LineChart;
