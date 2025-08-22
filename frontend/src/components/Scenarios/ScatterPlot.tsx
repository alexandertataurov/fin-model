import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/molecules';
import { Badge } from '@/design-system/atoms';

interface ScatterPoint {
  x: number;
  y: number;
}

interface ScatterPlotProps {
  data: ScatterPoint[];
  xLabel?: string;
  yLabel?: string;
  title?: string;
  correlation?: number;
  className?: string;
  width?: number;
  height?: number;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  xLabel = 'X Values',
  yLabel = 'Y Values',
  title = 'Scatter Plot',
  correlation,
  className = '',
  width = 400,
  height = 300,
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No data available for scatter plot
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate data bounds
  const xValues = data.map(d => d.x);
  const yValues = data.map(d => d.y);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  // Add padding
  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  const xPadding = xRange * 0.1;
  const yPadding = yRange * 0.1;

  const plotXMin = xMin - xPadding;
  const plotXMax = xMax + xPadding;
  const plotYMin = yMin - yPadding;
  const plotYMax = yMax + yPadding;

  const plotXRange = plotXMax - plotXMin;
  const plotYRange = plotYMax - plotYMin;

  // Chart dimensions (accounting for margins)
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Scale functions
  const scaleX = (x: number) => ((x - plotXMin) / plotXRange) * chartWidth;
  const scaleY = (y: number) =>
    chartHeight - ((y - plotYMin) / plotYRange) * chartHeight;

  const formatValue = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else if (Math.abs(value) < 1) {
      return value.toFixed(3);
    } else {
      return value.toFixed(1);
    }
  };

  const getCorrelationColor = (corr: number): string => {
    const abs = Math.abs(corr);
    if (abs >= 0.7) return 'text-red-600';
    if (abs >= 0.5) return 'text-orange-600';
    if (abs >= 0.3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getCorrelationStrength = (corr: number): string => {
    const abs = Math.abs(corr);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.5) return 'Moderate';
    if (abs >= 0.3) return 'Weak';
    return 'Very Weak';
  };

  // Generate trend line if correlation exists
  const getTrendLine = () => {
    if (!correlation || Math.abs(correlation) < 0.1) return null;

    // Calculate simple linear regression
    const n = data.length;
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const trendStartX = plotXMin;
    const trendEndX = plotXMax;
    const trendStartY = slope * trendStartX + intercept;
    const trendEndY = slope * trendEndX + intercept;

    return {
      x1: scaleX(trendStartX),
      y1: scaleY(trendStartY),
      x2: scaleX(trendEndX),
      y2: scaleY(trendEndY),
    };
  };

  const trendLine = getTrendLine();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex space-x-2">
            <Badge variant="secondary">{data.length} points</Badge>
            {correlation !== undefined && (
              <Badge
                variant="outline"
                className={getCorrelationColor(correlation)}
              >
                r = {correlation.toFixed(3)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Correlation Summary */}
          {correlation !== undefined && (
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">Correlation:</span>{' '}
                <span className={getCorrelationColor(correlation)}>
                  {getCorrelationStrength(correlation)} (
                  {correlation >= 0 ? 'Positive' : 'Negative'})
                </span>
              </div>
            </div>
          )}

          {/* SVG Chart */}
          <div className="flex justify-center">
            <svg width={width} height={height} className="border rounded">
              {/* Grid lines */}
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                </pattern>
              </defs>
              <rect
                width={chartWidth}
                height={chartHeight}
                x={margin.left}
                y={margin.top}
                fill="url(#grid)"
              />

              {/* Axes */}
              <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* X-axis */}
                <line
                  x1={0}
                  y1={chartHeight}
                  x2={chartWidth}
                  y2={chartHeight}
                  stroke="var(--foreground)"
                  strokeWidth={2}
                />

                {/* Y-axis */}
                <line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={chartHeight}
                  stroke="var(--foreground)"
                  strokeWidth={2}
                />

                {/* X-axis ticks and labels */}
                {[0, 0.25, 0.5, 0.75, 1].map(fraction => {
                  const x = fraction * chartWidth;
                  const value = plotXMin + fraction * plotXRange;
                  return (
                    <g key={fraction}>
                      <line
                        x1={x}
                        y1={chartHeight}
                        x2={x}
                        y2={chartHeight + 5}
                        stroke="var(--foreground)"
                        strokeWidth={1}
                      />
                      <text
                        x={x}
                        y={chartHeight + 20}
                        textAnchor="middle"
                        fontSize="12"
                        fill="var(--muted-foreground)"
                      >
                        {formatValue(value)}
                      </text>
                    </g>
                  );
                })}

                {/* Y-axis ticks and labels */}
                {[0, 0.25, 0.5, 0.75, 1].map(fraction => {
                  const y = chartHeight - fraction * chartHeight;
                  const value = plotYMin + fraction * plotYRange;
                  return (
                    <g key={fraction}>
                      <line
                        x1={0}
                        y1={y}
                        x2={-5}
                        y2={y}
                        stroke="var(--foreground)"
                        strokeWidth={1}
                      />
                      <text
                        x={-10}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="12"
                        fill="var(--muted-foreground)"
                      >
                        {formatValue(value)}
                      </text>
                    </g>
                  );
                })}

                {/* Trend line */}
                {trendLine && (
                  <line
                    x1={trendLine.x1}
                    y1={trendLine.y1}
                    x2={trendLine.x2}
                    y2={trendLine.y2}
                    stroke="var(--destructive)"
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    opacity={0.7}
                  />
                )}

                {/* Data points */}
                {data.map((point, index) => (
                  <circle
                    key={index}
                    cx={scaleX(point.x)}
                    cy={scaleY(point.y)}
                    r={3}
                    fill="var(--chart-1)"
                    fillOpacity={0.7}
                    stroke="var(--chart-2)"
                    strokeWidth={1}
                    className="hover:r-4 hover:fill-opacity-100 transition-all cursor-pointer"
                  >
                    <title>{`X: ${formatValue(point.x)}, Y: ${formatValue(point.y)}`}</title>
                  </circle>
                ))}
              </g>

              {/* Axis labels */}
              <text
                x={width / 2}
                y={height - 5}
                textAnchor="middle"
                fontSize="14"
                fill="var(--foreground)"
                fontWeight="500"
              >
                {xLabel}
              </text>
              <text
                x={15}
                y={height / 2}
                textAnchor="middle"
                fontSize="14"
                fill="var(--foreground)"
                fontWeight="500"
                transform={`rotate(-90 15 ${height / 2})`}
              >
                {yLabel}
              </text>
            </svg>
          </div>

          {/* Summary statistics */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
            <div>
              <div className="font-medium text-muted-foreground">
                {xLabel} Range
              </div>
              <div>
                {formatValue(xMin)} - {formatValue(xMax)}
              </div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">
                {yLabel} Range
              </div>
              <div>
                {formatValue(yMin)} - {formatValue(yMax)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
