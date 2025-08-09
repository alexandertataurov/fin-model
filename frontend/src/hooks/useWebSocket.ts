/**
 * WebSocket Hook for Real-time Updates
 * 
 * Provides WebSocket connection management for real-time admin dashboard updates
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAdminStore } from '@/stores/admin';

export interface WebSocketMessage {
    type: 'SYSTEM_STATS' | 'USER_ACTIVITY' | 'SYSTEM_METRICS' | 'LOGS' | 'AUDIT';
    data: any;
    timestamp: number;
}

export interface UseWebSocketOptions {
    enabled?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    onError?: (error: Event) => void;
    onMessage?: (message: WebSocketMessage) => void;
}

export const useWebSocket = (
    url: string,
    options: UseWebSocketOptions = {}
) => {
    const {
        enabled = true,
        reconnectInterval = 5000,
        maxReconnectAttempts = 5,
        onError,
        onMessage,
    } = options;

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const reconnectAttemptsRef = useRef(0);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    // Store reference for updates
    const {
        systemStats,
        userActivity,
        systemMetrics,
        logs,
        audit,
        fetchSystemStats: _fetchSystemStats,
        fetchUserActivity: _fetchUserActivity,
        fetchSystemMetrics: _fetchSystemMetrics,
        fetchLogs: _fetchLogs,
        fetchAudit: _fetchAudit,
    } = useAdminStore();

    const connect = useCallback(() => {
        if (!enabled || wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            wsRef.current = new WebSocket(url);

            wsRef.current.onopen = () => {

                setIsConnected(true);
                setConnectionError(null);
                reconnectAttemptsRef.current = 0;
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);

                    // Handle message through callback if provided
                    if (onMessage) {
                        onMessage(message);
                    }

                    // Update store based on message type
                    switch (message.type) {
                        case 'SYSTEM_STATS':
                            // Only update if data is newer than current
                            if (!systemStats.lastUpdated || message.timestamp > systemStats.lastUpdated) {
                                useAdminStore.setState(state => ({
                                    systemStats: {
                                        ...state.systemStats,
                                        data: message.data,
                                        lastUpdated: message.timestamp,
                                    }
                                }));
                            }
                            break;

                        case 'USER_ACTIVITY':
                            if (!userActivity.lastUpdated || message.timestamp > userActivity.lastUpdated) {
                                useAdminStore.setState(state => ({
                                    userActivity: {
                                        ...state.userActivity,
                                        data: message.data,
                                        lastUpdated: message.timestamp,
                                    }
                                }));
                            }
                            break;

                        case 'SYSTEM_METRICS':
                            if (!systemMetrics.lastUpdated || message.timestamp > systemMetrics.lastUpdated) {
                                useAdminStore.setState(state => ({
                                    systemMetrics: {
                                        ...state.systemMetrics,
                                        data: message.data,
                                        lastUpdated: message.timestamp,
                                    }
                                }));
                            }
                            break;

                        case 'LOGS':
                            // For logs, append new entries rather than replace
                            if (!logs.lastUpdated || message.timestamp > logs.lastUpdated) {
                                useAdminStore.setState(state => ({
                                    logs: {
                                        ...state.logs,
                                        data: message.data.items || message.data,
                                        items: message.data.items || message.data,
                                        total: message.data.total || (message.data.items?.length || 0),
                                        lastUpdated: message.timestamp,
                                    }
                                }));
                            }
                            break;

                        case 'AUDIT':
                            if (!audit.lastUpdated || message.timestamp > audit.lastUpdated) {
                                useAdminStore.setState(state => ({
                                    audit: {
                                        ...state.audit,
                                        data: message.data.items || message.data,
                                        items: message.data.items || message.data,
                                        total: message.data.total || (message.data.items?.length || 0),
                                        lastUpdated: message.timestamp,
                                    }
                                }));
                            }
                            break;
                    }
                } catch (_error) {
                    /* noop */
                }
            };

            wsRef.current.onclose = (event) => {

                setIsConnected(false);

                // Attempt to reconnect if not a clean close and under max attempts
                if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current++;
                    setConnectionError(`Connection lost. Reconnecting... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectInterval);
                } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                    setConnectionError('Failed to reconnect after maximum attempts');
                }
            };

            wsRef.current.onerror = (_error) => {

                setConnectionError('WebSocket connection error');
                if (onError) {
                    onError(_error);
                }
            };
        } catch (_error) {

            setConnectionError('Failed to establish connection');
        }
    }, [
        enabled,
        url,
        reconnectInterval,
        maxReconnectAttempts,
        onError,
        onMessage,
        systemStats.lastUpdated,
        userActivity.lastUpdated,
        systemMetrics.lastUpdated,
        logs.lastUpdated,
        audit.lastUpdated,
    ]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        if (wsRef.current) {
            wsRef.current.close(1000, 'Manual disconnect');
            wsRef.current = null;
        }

        setIsConnected(false);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
    }, []);

    const sendMessage = useCallback((message: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
            return true;
        }
        return false;
    }, []);

    useEffect(() => {
        if (enabled) {
            connect();
        } else {
            disconnect();
        }

        return () => {
            disconnect();
        };
    }, [enabled, connect, disconnect]);

    return {
        isConnected,
        connectionError,
        connect,
        disconnect,
        sendMessage,
    };
};

// Hook specifically for admin dashboard real-time updates
export const useAdminWebSocket = (enabled: boolean = true) => {
    const { autoRefreshEnabled } = useAdminStore();

    // Only connect if both enabled and auto-refresh is on
    const shouldConnect = enabled && autoRefreshEnabled;

    return useWebSocket(
        `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/admin`,
        {
            enabled: shouldConnect,
            onError: (_error) => {

            },
            onMessage: () => {
            },
        }
    );
};
