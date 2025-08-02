import React, { useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Tooltip,
} from 'recharts';

import BaseChart from './BaseChart';

export interface WaterfallDataPoint {
  name: string;
  value: number;
  type?: 'start' | 'positive' | 'negative' | 'total';
  cumulative?: number;
}

interface WaterfallChartProps {
  data: WaterfallDataPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
  loading?: boolean;
  error?: string;
  currency?: string;
  showGrid?: boolean;
  positiveColor?: string;
  negativeColor?: string;
  totalColor?: string;
  startColor?: string;
  onExport?: () => void;
  onFullscreen?: () => void;
  formatTooltip?: (value: number | string, name: string) => [string, string];
  formatXAxisTick?: (value: string) => string;
  formatYAxisTick?: (value: number) => string;
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  data,
  title,
  subtitle,
  height = 400,
  loading = false,
  error,
  currency = '$',
  showGrid = true,
  // DESIGN_FIX: use design tokens for default colors
  positiveColor = 'var(--success)',
  negativeColor = 'var(--destructive)',
  totalColor = 'var(--chart-1)',
  startColor = 'var(--muted-foreground)',
  onExport,
  onFullscreen,
  formatXAxisTick,
  formatYAxisTick,
}) => {
  const processedData = useMemo(() => {
    let cumulative = 0;

    return data.map((item, index) => {
      const isStart = item.type === 'start' || index === 0;
      const isTotal = item.type === 'total';

      let stackBottom = 0;
      let stackTop = item.value;

      if (isStart) {
        cumulative = item.value;
        stackBottom = 0;
        stackTop = item.value;
      } else if (isTotal) {
        // For total bars, show from 0 to cumulative
        stackBottom = 0;
        stackTop = cumulative;
      } else {
        // For regular bars, stack them on the cumulative
        if (item.value >= 0) {
          stackBottom = cumulative;
          stackTop = cumulative + item.value;
        } else {
          stackBottom = cumulative + item.value;
          stackTop = cumulative;
        }
        cumulative += item.value;
      }

      const color = isStart
        ? startColor
        : isTotal
          ? totalColor
          : item.value >= 0
            ? positiveColor
            : negativeColor;

      return {
        ...item,
        stackBottom,
        stackTop,
        color,
        cumulative,
      };
    });
  }, [data, positiveColor, negativeColor, totalColor, startColor]);

  const formatYAxis = (value: number): string => {
    if (formatYAxisTick) {
      return formatYAxisTick(value);
    }

    if (Math.abs(value) >= 1000000) {
      return `${currency}${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${currency}${(value / 1000).toFixed(1)}K`;
    }
    return `${currency}${value.toFixed(0)}`;
  };

  const formatXAxis = (value: string): string => {
    if (formatXAxisTick) {
      return formatXAxisTick(value);
    }
    return value.length > 12 ? `${value.substring(0, 12)}...` : value;
  };

  const customTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: unknown[];
    label?: string;
  }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0] as {
        payload: WaterfallDataPoint & { stackBottom: number; stackTop: number };
      };
      const item = data.payload;

      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Value: {formatYAxis(item.value)}
          </p>
          {item.type !== 'start' && item.type !== 'total' && (
            <p className="text-sm text-muted-foreground">
              Cumulative: {formatYAxis(item.cumulative)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <BaseChart
      title={title}
      subtitle={subtitle}
      height={height}
      onExport={onExport}
      onFullscreen={onFullscreen}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            dataKey="name"
            tickFormatter={formatXAxis}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip content={customTooltip} />
          <ReferenceLine y={0} stroke="#666" />
          <Bar dataKey="stackTop" stackId="a" fill="transparent" />
          <Bar dataKey="stackBottom" stackId="b" fill="transparent" />
          {processedData.map((entry, index) => (
            <Bar
              key={`bar-${index}`}
              dataKey="value"
              fill={entry.color}
              stackId="c"
              name={entry.name}
            >
              {processedData.map((cellEntry, cellIndex) => (
                <Cell key={`cell-${cellIndex}`} fill={cellEntry.color} />
              ))}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </BaseChart>
  );
};

export default WaterfallChart;
