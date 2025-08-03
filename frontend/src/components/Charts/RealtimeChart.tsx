import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { Play, Pause, RotateCcw, WifiOff, Wifi } from 'lucide-react';
import { websocketService } from '../../services/websocket';
import BaseChart from './BaseChart';

export interface RealtimeChartProps {
  fileId: number;
  chartType: string;
  title?: string;
  subtitle?: string;
  initialData?: any[];
  height?: number;
  children: React.ReactNode;
  updateInterval?: number; // Throttle updates (ms)
  maxDataPoints?: number; // Max points to keep in memory
  className?: string;
  onDataUpdate?: (data: any) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export interface ChartUpdateData {
  file_id: string;
  chart_type: string;
  chart_data: any;
  updated_at: string;
  updated_by?: string;
}

export const RealtimeChart: React.FC<RealtimeChartProps> = ({
  fileId,
  chartType,
  title,
  subtitle,
  initialData = [],
  height = 400,
  children,
  updateInterval = 1000,
  maxDataPoints = 100,
  className,
  onDataUpdate,
  onConnectionChange,
}) => {
  const [chartData, setChartData] = useState(initialData);
  const [isLive, setIsLive] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdateRef = useRef<any>(null);

  // Throttled update function
  const throttledUpdate = useCallback(
    (newData: any) => {
      if (updateTimeoutRef.current) {
        // Store the latest update and wait for throttle period
        pendingUpdateRef.current = newData;
        return;
      }

      // Apply the update immediately
      setChartData(prevData => {
        let updatedData;

        if (Array.isArray(newData)) {
          // Replace entire dataset
          updatedData =
            maxDataPoints > 0 ? newData.slice(-maxDataPoints) : newData;
        } else {
          // Append new data point
          const combined = [...prevData, newData];
          updatedData =
            maxDataPoints > 0 ? combined.slice(-maxDataPoints) : combined;
        }

        onDataUpdate?.(updatedData);
        return updatedData;
      });

      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);

      // Set throttle timeout
      updateTimeoutRef.current = setTimeout(() => {
        updateTimeoutRef.current = null;

        // Apply any pending update
        if (pendingUpdateRef.current) {
          const pendingData = pendingUpdateRef.current;
          pendingUpdateRef.current = null;
          throttledUpdate(pendingData);
        }
      }, updateInterval);
    },
    [updateInterval, maxDataPoints, onDataUpdate]
  );

  // Handle real-time chart updates
  const handleChartUpdate = useCallback(
    (updateData: ChartUpdateData) => {
      if (!isLive) return;

      if (
        updateData.file_id === fileId.toString() &&
        updateData.chart_type === chartType
      ) {
        throttledUpdate(updateData.chart_data);
      }
    },
    [fileId, chartType, isLive, throttledUpdate]
  );

  // WebSocket subscription management
  useEffect(() => {
    if (!isLive) return;

    const setupWebSocketSubscription = () => {
      // Check if WebSocket is connected
      const wsConnected = websocketService.isConnectionReady();
      setIsConnected(wsConnected);
      onConnectionChange?.(wsConnected);

      if (wsConnected) {
        // Subscribe to chart data updates
        unsubscribeRef.current = websocketService.subscribe(
          'chart_data_update',
          handleChartUpdate
        );

        // Send subscription message for this specific chart
        websocketService.send({
          type: 'subscribe_chart',
          data: {
            file_id: fileId,
            chart_type: chartType,
            max_points: maxDataPoints,
          },
        });

        // Subscribed to real-time updates for chart
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
    chartType,
    maxDataPoints,
    handleChartUpdate,
    isConnected,
    onConnectionChange,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Toggle live updates
  const toggleLiveUpdates = useCallback(() => {
    setIsLive(prev => {
      const newState = !prev;

      if (!newState && unsubscribeRef.current) {
        // Unsubscribe when pausing
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      return newState;
    });
  }, []);

  // Reset chart data to initial state
  const resetChart = useCallback(() => {
    setChartData(initialData);
    setUpdateCount(0);
    setLastUpdate(null);
  }, [initialData]);

  // Chart actions
  const chartActions = (
    <div className="flex items-center gap-1">
      {/* Connection status */}
      <Badge
        variant={isConnected ? 'default' : 'secondary'}
        className={cn(
          'flex items-center gap-1 text-xs',
          isConnected
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600'
        )}
      >
        {isConnected ? (
          <>
            <Wifi className="h-3 w-3" />
            Live
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            Offline
          </>
        )}
      </Badge>

      {/* Live controls */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLiveUpdates}
        className="h-8 w-8 p-0"
        title={isLive ? 'Pause live updates' : 'Resume live updates'}
      >
        {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      {/* Reset button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={resetChart}
        className="h-8 w-8 p-0"
        title="Reset chart data"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );

  // Enhanced subtitle with update info
  const enhancedSubtitle = [
    subtitle,
    lastUpdate && `Last updated: ${lastUpdate.toLocaleTimeString()}`,
    updateCount > 0 && `Updates: ${updateCount}`,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <div className={cn('relative', className)}>
      {/* Live indicator overlay */}
      {isLive && isConnected && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-sm border">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            </div>
            <span className="text-xs font-medium text-green-700">LIVE</span>
          </div>
        </div>
      )}

      <BaseChart
        title={title}
        subtitle={enhancedSubtitle}
        height={height}
        actions={chartActions}
        className={cn(
          'transition-all duration-200',
          isLive && isConnected && 'border-green-200 shadow-green-100/50'
        )}
      >
        {React.cloneElement(children as React.ReactElement, {
          data: chartData,
          // Pass through any animation props for smooth updates
          animation: isLive
            ? {
                duration: 750,
                easing: 'ease-out',
              }
            : false,
        })}
      </BaseChart>
    </div>
  );
};

export default RealtimeChart;
