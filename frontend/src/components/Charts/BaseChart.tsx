import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/cn';
import { Download, Maximize, Loader2, AlertCircle } from 'lucide-react';

interface BaseChartProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number;
  loading?: boolean;
  error?: string;
  onExport?: (format?: 'PNG' | 'SVG' | 'PDF') => void;
  onFullscreen?: () => void;
  actions?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const BaseChart: React.FC<BaseChartProps> = ({
  title,
  subtitle,
  children,
  height = 400,
  loading = false,
  error,
  onExport,
  onFullscreen,
  actions,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
}) => {
  const chartId = React.useId();
  const titleId = title ? `${chartId}-title` : undefined;
  const subtitleId = subtitle ? `${chartId}-subtitle` : undefined;

  return (
    <Card 
      className={cn('relative group', className)}
      aria-label={ariaLabel || title}
      aria-describedby={ariaDescribedby || subtitleId}
      role="region"
    >
      {/* Header */}
      {title && (
        <CardHeader
          actions={
            <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
              {actions}
              {onExport && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onExport('PNG')}>
                      Export as PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport('SVG')}>
                      Export as SVG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport('PDF')}>
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {onFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFullscreen}
                  className="h-8 w-8 p-0"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-1">
            {title && (
              <CardTitle 
                id={titleId}
                className="text-base font-medium"
                data-testid="chart-title"
              >
                {title}
              </CardTitle>
            )}
            {subtitle && (
              <p 
                id={subtitleId}
                className="text-sm text-muted-foreground"
                data-testid="chart-subtitle"
              >
                {subtitle}
              </p>
            )}
          </div>
        </CardHeader>
      )}

      {/* Chart Content */}
      <CardContent className="pb-6">
        <div
          className="relative flex items-center justify-center"
          style={{ height }}
          role="img"
          aria-labelledby={titleId}
          aria-describedby={subtitleId}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading chart data...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full text-destructive">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Error loading chart: {error}</span>
              </div>
            </div>
          )}

          {!loading && !error && children}
        </div>
      </CardContent>
    </Card>
  );
};

export default BaseChart;
