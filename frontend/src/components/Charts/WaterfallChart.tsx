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
import { Box } from '@mui/material';
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
  positiveColor = '#2e7d32',
  negativeColor = '#c62828',
  totalColor = '#1976d2',
  startColor = '#666666',
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
        displayValue: stackTop - stackBottom,
        cumulative,
        color,
        // For invisible bar to create stacking effect
        invisibleBottom: Math.min(stackBottom, stackTop),
        visibleHeight: Math.abs(stackTop - stackBottom),
      };
    });
  }, [data, positiveColor, negativeColor, totalColor, startColor]);

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

  const customTooltip = ({ active, payload, label }: { active?: boolean; payload?: unknown[]; label?: string }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const data = (payload[0] as { payload: WaterfallDataPoint })?.payload;
    if (!data) return null;

    const value = data.value;
    const cumulative = data.cumulative;
    const isPositive = value >= 0;
    const isStart = data.type === 'start';
    const isTotal = data.type === 'total';

    return (
      <Box
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
          boxShadow: 2,
          minWidth: 200,
        }}
      >
        <Box sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 1 }}>
          {label}
        </Box>
        
        {!isStart && !isTotal && (
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
            Change: {formatYAxis(value)}
          </Box>
        )}
        
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {isTotal ? 'Total' : 'Cumulative'}: {formatYAxis(cumulative || 0)}
        </Box>
        
        {!isStart && !isTotal && (
          <Box 
            sx={{ 
              fontSize: '0.75rem', 
              color: isPositive ? positiveColor : negativeColor,
              fontWeight: 500,
              mt: 0.5,
            }}
          >
            {isPositive ? '↑ Increase' : '↓ Decrease'}
          </Box>
        )}
      </Box>
    );
  };

  const yAxisDomain = useMemo(() => {
    const allValues = processedData.flatMap(d => [d.stackBottom, d.stackTop]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  }, [processedData]);

  const chartContent = (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={processedData}
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
        
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          tickFormatter={formatXAxis}
        />
        
        <YAxis
          domain={yAxisDomain}
          tick={{ fontSize: 12 }}
          tickFormatter={formatYAxis}
        />
        
        <ReferenceLine y={0} stroke="#666" strokeWidth={1} />
        
        {/* Invisible bars for stacking */}
        <Bar
          dataKey="invisibleBottom"
          fill="transparent"
          strokeWidth={0}
        />
        
        {/* Visible bars */}
        <Bar
          dataKey="visibleHeight"
          stackId="waterfall"
        >
          {processedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
        
        <Tooltip content={customTooltip} />
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

export default WaterfallChart; 