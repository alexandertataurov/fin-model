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
}) => {
  return (
    <Card className={cn('relative group', className)}>
      {/* Header */}
      {(title || subtitle || onExport || onFullscreen || actions) && (
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            {title && (
              <CardTitle className="text-base font-medium">{title}</CardTitle>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

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
        </CardHeader>
      )}

      {/* Chart Content */}
      <CardContent className="pb-6">
        <div
          className="relative flex items-center justify-center"
          style={{ height }}
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
