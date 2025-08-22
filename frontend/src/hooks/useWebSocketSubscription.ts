import { useEffect, useRef, useState, type DependencyList } from 'react';
import { dashboardWebSocketService as websocketService } from '@/services/websocket';

export type SetupSubscription = () => void | (() => void);

export const useWebSocketSubscription = (
  isLive: boolean,
  setupSubscription: SetupSubscription,
  deps: DependencyList = [],
  onConnectionChange?: (connected: boolean) => void
) => {
  const [isConnected, setIsConnected] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isLive) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    const subscribe = () => {
      const unsub = setupSubscription();
      if (typeof unsub === 'function') {
        unsubscribeRef.current = unsub;
      }
    };

    subscribe();

    const unsubscribeStatus = websocketService.subscribeStatus(state => {
      const wsConnected = state === 'connected';
      setIsConnected(wsConnected);
      onConnectionChange?.(wsConnected);

      if (wsConnected && !unsubscribeRef.current) {
        subscribe();
      } else if (!wsConnected && unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    });

    return () => {
      unsubscribeStatus();
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isLive, onConnectionChange, setupSubscription, deps]);

  return isConnected;
};

export default useWebSocketSubscription;
