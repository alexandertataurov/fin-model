import { useEffect, useState, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardWebSocketService } from '../services/websocket';

export interface DashboardData {
  metrics: DashboardMetric[];
  charts: Record<string, any>;
  last_updated: string;
  file_id: number;
}

export interface DashboardMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  change_percentage: number;
  format: string;
  category: string;
}

export interface RealtimeUpdate {
  type: string;
  data: any;
  timestamp: string;
}

interface UseRealtimeDashboardProps {
  fileId: number;
  period: string;
  enabled?: boolean;
}

interface UseRealtimeDashboardReturn {
  dashboardData: DashboardData | undefined;
  isLoading: boolean;
  error: Error | null;
  isConnected: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected';
  lastUpdate: Date | null;
  reconnectAttempts: number;
  refreshData: () => void;
  toggleLiveUpdates: () => void;
  isLiveEnabled: boolean;
}

export const useRealtimeDashboard = ({
  fileId,
  period,
  enabled = true,
}: UseRealtimeDashboardProps): UseRealtimeDashboardReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('disconnected');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLiveEnabled, setIsLiveEnabled] = useState(true);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const queryClient = useQueryClient();
  const unsubscribeRefs = useRef<Array<() => void>>([]);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch dashboard data from API
  const fetchDashboardData = async (): Promise<DashboardData> => {
    const response = await fetch(
      `/api/v1/dashboard/${fileId}?period=${period}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
    }

    return response.json();
  };

  // React Query for dashboard data
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch: refreshData,
  } = useQuery({
    queryKey: ['dashboard', fileId, period],
    queryFn: fetchDashboardData,
    enabled: enabled && !!fileId,
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: false, // Rely on real-time updates instead
    retry: 3,
  });

  // Handle real-time financial data updates
  const handleFinancialDataUpdate = useCallback(
    (updateData: any) => {
      if (!isLiveEnabled) return;

      const { data } = updateData;

      if (data.file_id === fileId.toString()) {
        // Invalidate and refetch dashboard data for comprehensive updates
        queryClient.invalidateQueries({
          queryKey: ['dashboard', fileId, period],
        });
        setLastUpdate(new Date());
      }
    },
    [fileId, period, queryClient, isLiveEnabled]
  );

  // Handle real-time metrics updates
  const handleMetricUpdate = useCallback(
    (updateData: any) => {
      if (!isLiveEnabled) return;

      const { data } = updateData;

      if (data.file_id === fileId.toString()) {
        // Update specific metrics in the cache optimistically
        queryClient.setQueryData(
          ['dashboard', fileId, period],
          (oldData: DashboardData | undefined) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              metrics: oldData.metrics.map((metric: DashboardMetric) =>
                metric.id === data.metric_id
                  ? { ...metric, ...data.updates }
                  : metric
              ),
              last_updated: data.updated_at,
            };
          }
        );

        setLastUpdate(new Date());
      }
    },
    [fileId, period, queryClient, isLiveEnabled]
  );

  // Handle real-time chart data updates
  const handleChartDataUpdate = useCallback(
    (updateData: any) => {
      if (!isLiveEnabled) return;

      const { data } = updateData;

      if (data.file_id === fileId.toString()) {
        // Update chart data in cache
        queryClient.setQueryData(
          ['dashboard', fileId, period],
          (oldData: DashboardData | undefined) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              charts: {
                ...oldData.charts,
                [data.chart_type]: data.chart_data,
              },
              last_updated: data.updated_at,
            };
          }
        );

        setLastUpdate(new Date());
      }
    },
    [fileId, period, queryClient, isLiveEnabled]
  );

  // Handle metrics recalculation
  const handleMetricsRecalculation = useCallback(
    (updateData: any) => {
      if (!isLiveEnabled) return;

      const { data } = updateData;

      if (data.file_id === fileId.toString()) {
        // Trigger a full refresh for comprehensive recalculation
        refreshData();
        setLastUpdate(new Date());
      }
    },
    [fileId, refreshData, isLiveEnabled]
  );

  // Handle connection state changes
  const handleConnectionLost = useCallback((data: any) => {
    setIsConnected(false);
    setConnectionState('disconnected');
    setReconnectAttempts(data.attempts || 0);
  }, []);

  // WebSocket connection management
  const connectWebSocket = useCallback(async () => {
    if (!enabled || !fileId || !isLiveEnabled) return;

    try {
      setConnectionState('connecting');

      // Clear any existing timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }

      await dashboardWebSocketService.connect(`/dashboard/${fileId}`);

      setIsConnected(true);
      setConnectionState('connected');
      setReconnectAttempts(dashboardWebSocketService.getReconnectAttempts());

      // Clear previous subscriptions
      unsubscribeRefs.current.forEach(unsub => unsub());
      unsubscribeRefs.current = [];

      // Subscribe to different types of updates
      const subscriptions = [
        dashboardWebSocketService.subscribe(
          'financial_data_update',
          handleFinancialDataUpdate
        ),
        dashboardWebSocketService.subscribe(
          'metric_update',
          handleMetricUpdate
        ),
        dashboardWebSocketService.subscribe(
          'chart_data_update',
          handleChartDataUpdate
        ),
        dashboardWebSocketService.subscribe(
          'metrics_recalculation',
          handleMetricsRecalculation
        ),
        dashboardWebSocketService.subscribe(
          'connection_lost',
          handleConnectionLost
        ),
      ];

      unsubscribeRefs.current = subscriptions;

      // Send initial subscription message
      dashboardWebSocketService.send({
        type: 'subscribe_metrics',
        data: { file_id: fileId, period },
      });
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
      setConnectionState('disconnected');

      // Retry connection after a delay
      connectionTimeoutRef.current = setTimeout(() => {
        if (enabled && isLiveEnabled) {
          connectWebSocket();
        }
      }, 5000);
    }
  }, [
    enabled,
    fileId,
    period,
    isLiveEnabled,
    handleFinancialDataUpdate,
    handleMetricUpdate,
    handleChartDataUpdate,
    handleMetricsRecalculation,
    handleConnectionLost,
  ]);

  // Toggle live updates
  const toggleLiveUpdates = useCallback(() => {
    setIsLiveEnabled(prev => {
      const newState = !prev;

      if (newState && !isConnected) {
        // Re-connect when enabling live updates
        connectWebSocket();
      } else if (!newState && isConnected) {
        // Disconnect when disabling live updates
        dashboardWebSocketService.disconnect();
        setIsConnected(false);
        setConnectionState('disconnected');
      }

      return newState;
    });
  }, [isConnected, connectWebSocket]);

  // Connection effect
  useEffect(() => {
    if (enabled && isLiveEnabled && fileId) {
      connectWebSocket();
    }

    return () => {
      // Clear timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }

      // Unsubscribe from all
      unsubscribeRefs.current.forEach(unsub => unsub());
      unsubscribeRefs.current = [];

      // Disconnect WebSocket
      if (isConnected) {
        dashboardWebSocketService.disconnect();
        setIsConnected(false);
        setConnectionState('disconnected');
      }
    };
  }, [enabled, fileId, period, isLiveEnabled, connectWebSocket, isConnected]);

  // Update connection state based on WebSocket service state
  useEffect(() => {
    const checkConnectionState = () => {
      const wsState = dashboardWebSocketService.getConnectionState();
      setConnectionState(wsState);
      setIsConnected(wsState === 'connected');
      setReconnectAttempts(dashboardWebSocketService.getReconnectAttempts());
    };

    // Check connection state every 2 seconds
    const interval = setInterval(checkConnectionState, 2000);

    return () => clearInterval(interval);
  }, []);

  return {
    dashboardData,
    isLoading,
    error,
    isConnected,
    connectionState,
    lastUpdate,
    reconnectAttempts,
    refreshData,
    toggleLiveUpdates,
    isLiveEnabled,
  };
};
