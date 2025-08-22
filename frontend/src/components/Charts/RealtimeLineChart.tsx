import React, { useState, useCallback } from 'react';
import { LineChart, LineChartDataPoint, LineSeriesConfig } from './LineChart';
import RealtimeChart from './RealtimeChart';

export interface RealtimeLineChartProps {
  fileId: number;
  chartType: string;
  data: LineChartDataPoint[];
  series: LineSeriesConfig[];
  title?: string;
  subtitle?: string;
  height?: number;
  xAxisKey?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  currency?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showDots?: boolean;
  smooth?: boolean;
  updateInterval?: number;
  maxDataPoints?: number;
  referenceLines?: Array<{
    value: number;
    label?: string;
    color?: string;
  }>;
  onExport?: () => void;
  onFullscreen?: () => void;
  onDataUpdate?: (data: LineChartDataPoint[]) => void;
  onConnectionChange?: (connected: boolean) => void;
  formatTooltip?: (value: number | string, name: string) => [string, string];
  formatXAxisTick?: (value: string) => string;
  formatYAxisTick?: (value: number) => string;
  className?: string;
}

export const RealtimeLineChart: React.FC<RealtimeLineChartProps> = ({
  fileId,
  chartType,
  data,
  series,
  title,
  subtitle,
  height = 400,
  xAxisKey = 'period',
  xAxisLabel,
  yAxisLabel,
  currency = '$',
  showGrid = true,
  showLegend = true,
  showDots = false,
  smooth = true,
  updateInterval = 1000,
  maxDataPoints = 100,
  referenceLines = [],
  onExport,
  onFullscreen,
  onDataUpdate,
  onConnectionChange,
  formatTooltip,
  formatXAxisTick,
  formatYAxisTick,
  className,
}) => {
  const [chartData, setChartData] = useState<LineChartDataPoint[]>(data);
  const [isConnected, setIsConnected] = useState(false);

  // Handle data updates from RealtimeChart
  const handleDataUpdate = useCallback(
    (newData: LineChartDataPoint[]) => {
      setChartData(newData);
      onDataUpdate?.(newData);
    },
    [onDataUpdate]
  );

  // Handle connection changes
  const handleConnectionChange = useCallback(
    (connected: boolean) => {
      setIsConnected(connected);
      onConnectionChange?.(connected);
    },
    [onConnectionChange]
  );

  // Enhance subtitle with connection status
  const enhancedSubtitle = [
    subtitle,
    isConnected ? '🟢 Live Data' : '🔴 Offline',
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <RealtimeChart
      fileId={fileId}
      chartType={chartType}
      title={title}
      subtitle={enhancedSubtitle}
      initialData={data}
      height={height}
      updateInterval={updateInterval}
      maxDataPoints={maxDataPoints}
      onDataUpdate={handleDataUpdate}
      onConnectionChange={handleConnectionChange}
      className={className}
    >
      <LineChart
        data={chartData}
        series={series}
        height={height}
        xAxisKey={xAxisKey}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
        currency={currency}
        showGrid={showGrid}
        showLegend={showLegend}
        showDots={showDots}
        smooth={smooth}
        referenceLines={referenceLines}
        onExport={onExport}
        onFullscreen={onFullscreen}
        formatTooltip={formatTooltip}
        formatXAxisTick={formatXAxisTick}
        formatYAxisTick={formatYAxisTick}
      />
    </RealtimeChart>
  );
};

export default RealtimeLineChart;
