import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { cn } from '@/utils/cn';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Wifi,
  WifiOff,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { dashboardWebSocketService as websocketService } from '../../services/websocket';

export interface MetricData {
  id: string;
  name: string;
  value: number;
  change: number;
  change_percentage: number;
  format: 'currency' | 'percentage' | 'number';
  category: string;
  unit?: string;
  description?: string;
}

export interface MetricUpdateData {
  file_id: string;
  metric_id: string;
  updates: Partial<MetricData>;
  updated_at: string;
  updated_by?: string;
}

interface RealtimeMetricsProps {
  fileId: number;
  initialMetrics: MetricData[];
  title?: string;
  columns?: number;
  showLiveIndicator?: boolean;
  updateAnimation?: boolean;
  className?: string;
  onMetricUpdate?: (metric: MetricData) => void;
  onConnectionChange?: (connected: boolean) => void;
}

interface MetricCardProps {
  metric: MetricData;
  lastUpdated?: Date;
  showAnimation?: boolean;
  isUpdating?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  lastUpdated,
  showAnimation = true,
  isUpdating = false,
}) => {
  const [isFlashing, setIsFlashing] = useState(false);

  // Flash animation when metric updates
  useEffect(() => {
    if (isUpdating && showAnimation) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isUpdating, showAnimation]);

  const formatValue = (
    value: number,
    format: string,
    unit?: string
  ): string => {
    switch (format) {
      case 'currency':
        if (Math.abs(value) >= 1000000) {
          return `$${(value / 1000000).toFixed(1)}M`;
        } else if (Math.abs(value) >= 1000) {
          return `$${(value / 1000).toFixed(1)}K`;
        }
        return `$${value.toLocaleString()}`;

      case 'percentage':
        return `${value.toFixed(2)}%`;

      case 'number': {
        const formattedNumber =
          Math.abs(value) >= 1000000
            ? `${(value / 1000000).toFixed(1)}M`
            : Math.abs(value) >= 1000
              ? `${(value / 1000).toFixed(1)}K`
              : value.toLocaleString();
        return unit ? `${formattedNumber} ${unit}` : formattedNumber;
      }

      default:
        return value.toString();
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <Card
      className={cn(
        'relative transition-all duration-300',
        isFlashing && 'ring-2 ring-blue-200 shadow-lg scale-105',
        isUpdating && 'border-blue-200'
      )}
    >
      {/* Update indicator */}
      {isUpdating && (
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {metric.name}
          </CardTitle>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          {/* Main value */}
          <div className="text-2xl font-bold">
            {formatValue(metric.value, metric.format, metric.unit)}
          </div>

          {/* Change indicator */}
          <div className="flex items-center gap-2">
            {getTrendIcon(metric.change)}
            <span
              className={cn(
                'text-sm font-medium',
                getTrendColor(metric.change)
              )}
            >
              {formatValue(Math.abs(metric.change), metric.format, metric.unit)}
              {metric.change_percentage !== 0 && (
                <span className="ml-1">
                  ({metric.change_percentage > 0 ? '+' : ''}
                  {metric.change_percentage.toFixed(1)}%)
                </span>
              )}
            </span>
          </div>

          {/* Description */}
          {metric.description && (
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const RealtimeMetrics: React.FC<RealtimeMetricsProps> = ({
  fileId,
  initialMetrics,
  title = 'Key Metrics',
  columns = 4,
  showLiveIndicator = true,
  updateAnimation = true,
  className,
  onMetricUpdate,
  onConnectionChange,
}) => {
  const [metrics, setMetrics] = useState<MetricData[]>(initialMetrics);
  const [isLive, setIsLive] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [updateTimestamps, setUpdateTimestamps] = useState<Map<string, Date>>(
    new Map()
  );
  const [updatingMetrics, setUpdatingMetrics] = useState<Set<string>>(
    new Set()
  );
  const [totalUpdates, setTotalUpdates] = useState(0);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Handle metric updates from WebSocket
  const handleMetricUpdate = useCallback(
    (updateData: MetricUpdateData) => {
      if (!isLive) return;

      if (updateData.file_id === fileId.toString()) {
        setMetrics(prevMetrics => {
          const updatedMetrics = prevMetrics.map(metric => {
            if (metric.id === updateData.metric_id) {
              const updatedMetric = { ...metric, ...updateData.updates };
              onMetricUpdate?.(updatedMetric);
              return updatedMetric;
            }
            return metric;
          });
          return updatedMetrics;
        });

        // Track update timestamp and animation
        setUpdateTimestamps(
          prev => new Map(prev.set(updateData.metric_id, new Date()))
        );

        if (updateAnimation) {
          setUpdatingMetrics(prev => new Set(prev.add(updateData.metric_id)));
          setTimeout(() => {
            setUpdatingMetrics(prev => {
              const newSet = new Set(prev);
              newSet.delete(updateData.metric_id);
              return newSet;
            });
          }, 1000);
        }

        setTotalUpdates(prev => prev + 1);
        // Metric updated
      }
    },
    [fileId, isLive, onMetricUpdate, updateAnimation]
  );

  // Handle comprehensive metrics recalculation
  const handleMetricsRecalculation = useCallback(
    (updateData: any) => {
      if (!isLive) return;

      if (updateData.file_id === fileId.toString()) {
        // Trigger a full refresh of metrics data
        // This would typically refetch from the API
        // Metrics recalculation triggered
        setTotalUpdates(prev => prev + 1);
      }
    },
    [fileId, isLive]
  );

  // WebSocket subscription management
  useEffect(() => {
    if (!isLive) return;

    const setupWebSocketSubscription = () => {
      const wsConnected = websocketService.isConnectionReady();
      setIsConnected(wsConnected);
      onConnectionChange?.(wsConnected);

      if (wsConnected) {
        // Subscribe to metric updates
        const metricUnsubscribe = websocketService.subscribe(
          'metric_update',
          handleMetricUpdate
        );

        // Subscribe to metrics recalculation
        const recalcUnsubscribe = websocketService.subscribe(
          'metrics_recalculation',
          handleMetricsRecalculation
        );

        unsubscribeRef.current = () => {
          metricUnsubscribe();
          recalcUnsubscribe();
        };

        // Send subscription message for metrics
        websocketService.send('subscribe_metrics', { file_id: fileId });

        // Subscribed to real-time metrics
      }
    };

    setupWebSocketSubscription();

    // Setup periodic connection check
    const connectionCheck = setInterval(() => {
      const wsConnected = websocketService.isConnectionReady();
      if (wsConnected !== isConnected) {
        setIsConnected(wsConnected);
        onConnectionChange?.(wsConnected);

        if (wsConnected && !unsubscribeRef.current) {
          setupWebSocketSubscription();
        }
      }
    }, 2000);

    return () => {
      clearInterval(connectionCheck);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [
    isLive,
    fileId,
    handleMetricUpdate,
    handleMetricsRecalculation,
    isConnected,
    onConnectionChange,
  ]);

  // Toggle live updates
  const toggleLiveUpdates = useCallback(() => {
    setIsLive(prev => {
      const newState = !prev;

      if (!newState && unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      return newState;
    });
  }, []);

  // Reset metrics to initial state
  const resetMetrics = useCallback(() => {
    setMetrics(initialMetrics);
    setUpdateTimestamps(new Map());
    setUpdatingMetrics(new Set());
    setTotalUpdates(0);
  }, [initialMetrics]);

  const gridCols =
    {
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-2 md:grid-cols-4',
      5: 'grid-cols-2 md:grid-cols-5',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    }[columns] || 'grid-cols-2 md:grid-cols-4';

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {showLiveIndicator && (
            <div className="flex items-center gap-2">
              <Badge
                variant={isConnected && isLive ? 'default' : 'secondary'}
                className={cn(
                  'flex items-center gap-1 text-xs',
                  isConnected && isLive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                {isConnected ? (
                  <>
                    <Wifi className="h-3 w-3" />
                    {isLive ? 'Live' : 'Paused'}
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    Offline
                  </>
                )}
              </Badge>
              {totalUpdates > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  {totalUpdates} updates
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLiveUpdates}
            className="h-8 w-8 p-0"
            title={isLive ? 'Pause live updates' : 'Resume live updates'}
          >
            {isLive ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetMetrics}
            className="h-8 w-8 p-0"
            title="Reset metrics"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metrics grid */}
      <div className={cn('grid gap-4', gridCols)}>
        {metrics.map(metric => (
          <MetricCard
            key={metric.id}
            metric={metric}
            lastUpdated={updateTimestamps.get(metric.id)}
            showAnimation={updateAnimation}
            isUpdating={updatingMetrics.has(metric.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RealtimeMetrics;
