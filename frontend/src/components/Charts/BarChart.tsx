import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import BaseChart from './BaseChart';
import CustomTooltip from './CustomTooltip';

export interface BarChartDataPoint {
  [key: string]: string | number;
}

export interface BarSeriesConfig {
  dataKey: string;
  name: string;
  color: string;
  stackId?: string;
}

interface BarChartProps {
  data: BarChartDataPoint[];
  series: BarSeriesConfig[];
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
  layout?: 'horizontal' | 'vertical';
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

const defaultColors = [
  '#1976d2', // Primary blue
  '#dc004e', // Secondary pink
  '#2e7d32', // Success green
  '#ed6c02', // Warning orange
  '#9c27b0', // Purple
  '#00695c', // Teal
  '#c62828', // Red
  '#5e35b1', // Deep purple
];

export const BarChart: React.FC<BarChartProps> = ({
  data,
  series,
  title,
  subtitle,
  height = 400,
  loading = false,
  error,
  xAxisKey = 'category',
  xAxisLabel,
  yAxisLabel,
  currency = '$',
  showGrid = true,
  showLegend = true,
  layout = 'vertical',
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
  }));

  const chartContent = (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        layout={layout}
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
            stroke="#e0e0e0"
            opacity={0.5}
          />
        )}
        
        {layout === 'vertical' ? (
          <>
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              tickFormatter={formatXAxis}
              label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : undefined}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={formatYAxis}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={formatYAxis}
              label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : undefined}
            />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              tickFormatter={formatXAxis}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            />
          </>
        )}
        
        <CustomTooltip
          currency={currency}
          formatter={formatTooltip}
          labelFormatter={(label) => `Category: ${label}`}
          showTotal={true}
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
            {...(layout === 'vertical' ? { y: refLine.value } : { x: refLine.value })}
            stroke={refLine.color || '#666'}
            strokeDasharray="5 5"
            label={{
              value: refLine.label || '',
              position: layout === 'vertical' ? 'top' : 'bottom',
              fontSize: 12,
            }}
          />
        ))}

        {/* Data Bars */}
        {enhancedSeries.map((seriesItem) => (
          <Bar
            key={seriesItem.dataKey}
            dataKey={seriesItem.dataKey}
            name={seriesItem.name}
            fill={seriesItem.color}
            stackId={seriesItem.stackId}
            radius={[2, 2, 0, 0]}
          />
        ))}
      </RechartsBarChart>
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
      {chartContent}
    </BaseChart>
  );
};

export default BarChart; 