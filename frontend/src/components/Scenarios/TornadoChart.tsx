import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TornadoDataPoint {
  parameter: string;
  low_impact: number;
  high_impact: number;
  sensitivity: number;
  rank: number;
}

interface TornadoChartProps {
  data: TornadoDataPoint[];
  title?: string;
  baseValue?: number;
  className?: string;
}

export const TornadoChart: React.FC<TornadoChartProps> = ({
  data,
  title = 'Parameter Sensitivity Analysis',
  baseValue = 0,
  className = '',
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No sensitivity data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate the maximum absolute impact for scaling
  const maxImpact = Math.max(
    ...data.map(d =>
      Math.max(
        Math.abs(d.low_impact - baseValue),
        Math.abs(d.high_impact - baseValue)
      )
    )
  );

  const formatValue = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return value.toFixed(0);
    }
  };

  const getBarColorClass = (rank: number): string => {
    if (rank <= 3) return 'bg-red-500';
    if (rank <= 6) return 'bg-orange-500';
    if (rank <= 9) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Badge variant="secondary">{data.length} parameters</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="space-y-3">
            {data.map((item, index) => {
              const lowDiff = item.low_impact - baseValue;
              const highDiff = item.high_impact - baseValue;

              // Calculate percentages for bar width
              const lowPercent = (Math.abs(lowDiff) / maxImpact) * 45; // Max 45% of container
              const highPercent = (Math.abs(highDiff) / maxImpact) * 45;

              return (
                <div key={index} className="relative">
                  {/* Parameter name */}
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className="text-sm font-medium truncate max-w-[200px]"
                        title={item.parameter}
                      >
                        {item.parameter}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        #{item.rank}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Impact:{' '}
                      {Math.abs(highDiff - lowDiff) > 1000
                        ? formatValue(Math.abs(highDiff - lowDiff))
                        : Math.abs(highDiff - lowDiff).toFixed(1)}
                    </div>
                  </div>

                  {/* Tornado bar */}
                  <div className="relative h-8 bg-gray-100 rounded-md">
                    {/* Center line */}
                    <div className="absolute left-1/2 top-0 w-px h-full bg-gray-400 z-10"></div>

                    {/* Low impact bar (left side) */}
                    {lowDiff < 0 && (
                      <div
                        className={`absolute top-1 bottom-1 ${getBarColorClass(
                          item.rank
                        )} opacity-70 rounded-l-sm`}
                        style={{
                          right: '50%',
                          width: `${lowPercent}%`,
                        }}
                      ></div>
                    )}

                    {/* High impact bar (right side) */}
                    {highDiff > 0 && (
                      <div
                        className={`absolute top-1 bottom-1 ${getBarColorClass(
                          item.rank
                        )} opacity-70 rounded-r-sm`}
                        style={{
                          left: '50%',
                          width: `${highPercent}%`,
                        }}
                      ></div>
                    )}

                    {/* Low impact bar (right side if positive) */}
                    {lowDiff > 0 && (
                      <div
                        className={`absolute top-1 bottom-1 ${getBarColorClass(
                          item.rank
                        )} opacity-70 rounded-r-sm`}
                        style={{
                          left: '50%',
                          width: `${lowPercent}%`,
                        }}
                      ></div>
                    )}

                    {/* High impact bar (left side if negative) */}
                    {highDiff < 0 && (
                      <div
                        className={`absolute top-1 bottom-1 ${getBarColorClass(
                          item.rank
                        )} opacity-70 rounded-l-sm`}
                        style={{
                          right: '50%',
                          width: `${highPercent}%`,
                        }}
                      ></div>
                    )}

                    {/* Value labels */}
                    <div className="absolute inset-0 flex justify-between items-center px-2 text-xs font-medium">
                      <span className="text-gray-700">
                        {formatValue(item.low_impact)}
                      </span>
                      <span className="text-gray-700">
                        {formatValue(item.high_impact)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-6 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-xs text-muted-foreground">
                High Impact (Top 3)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-xs text-muted-foreground">
                Medium Impact (4-6)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-xs text-muted-foreground">
                Low Impact (7-9)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs text-muted-foreground">
                Minimal Impact (10+)
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Base value: {formatValue(baseValue)} | Parameters ranked by
              sensitivity impact
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
