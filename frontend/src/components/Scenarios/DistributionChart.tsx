import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';

interface DistributionData {
  values: number[];
  bin_edges: number[];
  title?: string;
}

interface StatisticalSummary {
  mean: number;
  std: number;
  min: number;
  max: number;
  percentile_5?: number;
  percentile_25?: number;
  percentile_50?: number;
  percentile_75?: number;
  percentile_95?: number;
}

interface DistributionChartProps {
  data: DistributionData;
  stats?: StatisticalSummary;
  title?: string;
  className?: string;
  showStats?: boolean;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  data,
  stats,
  title = "Distribution Analysis",
  className = "",
  showStats = true
}) => {
  if (!data || !data.values || data.values.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No distribution data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatValue = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    } else {
      return value.toFixed(2);
    }
  };

  // Find the maximum frequency for scaling
  const maxFrequency = Math.max(...data.values);
  
  // Calculate bin width
  const binWidth = data.bin_edges.length > 1 ? data.bin_edges[1] - data.bin_edges[0] : 1;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Badge variant="secondary">
            {data.values.length} bins
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Histogram */}
          <div className="relative">
            <div className="h-64 flex items-end justify-center space-x-px bg-gray-50 rounded-lg p-4">
              {data.values.map((frequency, index) => {
                const height = (frequency / maxFrequency) * 100;
                const binStart = data.bin_edges[index];
                const binEnd = data.bin_edges[index + 1] || binStart + binWidth;
                
                return (
                  <div
                    key={index}
                    className="bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer relative group"
                    style={{
                      height: `${height}%`,
                      width: `${Math.max(100 / data.values.length - 0.5, 1)}%`,
                      minHeight: frequency > 0 ? '2px' : '0px'
                    }}
                    title={`Range: ${formatValue(binStart)} - ${formatValue(binEnd)}\nFrequency: ${frequency}`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {formatValue(binStart)}-{formatValue(binEnd)}: {frequency}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{formatValue(data.bin_edges[0] || 0)}</span>
              <span>{formatValue(data.bin_edges[Math.floor(data.bin_edges.length / 2)] || 0)}</span>
              <span>{formatValue(data.bin_edges[data.bin_edges.length - 1] || 0)}</span>
            </div>
          </div>

          {/* Statistical Summary */}
          {showStats && stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold">{formatValue(stats.mean)}</div>
                <div className="text-xs text-muted-foreground">Mean</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{formatValue(stats.std)}</div>
                <div className="text-xs text-muted-foreground">Std Dev</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{formatValue(stats.min)}</div>
                <div className="text-xs text-muted-foreground">Min</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{formatValue(stats.max)}</div>
                <div className="text-xs text-muted-foreground">Max</div>
              </div>
            </div>
          )}

          {/* Percentiles */}
          {showStats && stats && (stats.percentile_5 !== undefined || stats.percentile_95 !== undefined) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Risk Metrics</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {stats.percentile_5 !== undefined && (
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="font-semibold text-red-700">{formatValue(stats.percentile_5)}</div>
                    <div className="text-xs text-red-600">5th Percentile</div>
                  </div>
                )}
                {stats.percentile_50 !== undefined && (
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-700">{formatValue(stats.percentile_50)}</div>
                    <div className="text-xs text-blue-600">Median</div>
                  </div>
                )}
                {stats.percentile_95 !== undefined && (
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-semibold text-green-700">{formatValue(stats.percentile_95)}</div>
                    <div className="text-xs text-green-600">95th Percentile</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Confidence Intervals */}
          {showStats && stats && stats.percentile_25 !== undefined && stats.percentile_75 !== undefined && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Confidence Intervals</h4>
              <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                {/* IQR (25th to 75th percentile) */}
                <div 
                  className="absolute h-full bg-blue-300"
                  style={{
                    left: `${((stats.percentile_25! - stats.min) / (stats.max - stats.min)) * 100}%`,
                    width: `${((stats.percentile_75! - stats.percentile_25!) / (stats.max - stats.min)) * 100}%`
                  }}
                ></div>
                
                {/* Median line */}
                {stats.percentile_50 !== undefined && (
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-blue-700"
                    style={{
                      left: `${((stats.percentile_50 - stats.min) / (stats.max - stats.min)) * 100}%`
                    }}
                  ></div>
                )}
                
                {/* Mean marker */}
                <div 
                  className="absolute top-0 h-full w-0.5 bg-red-600"
                  style={{
                    left: `${((stats.mean - stats.min) / (stats.max - stats.min)) * 100}%`
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: {formatValue(stats.min)}</span>
                <span>Max: {formatValue(stats.max)}</span>
              </div>
              
              <div className="flex justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-300 rounded"></div>
                  <span>IQR (25th-75th)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-0.5 bg-blue-700"></div>
                  <span>Median</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-0.5 bg-red-600"></div>
                  <span>Mean</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};