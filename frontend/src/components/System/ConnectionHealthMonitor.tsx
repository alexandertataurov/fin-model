import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/utils/cn';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  WifiOff,
  XCircle
} from 'lucide-react';
import {
  globalWebSocketErrorHandler,
  type WebSocketError,
  type ConnectionState
} from '../../utils/websocket-error-handler';
import {
  dashboardWebSocketService,
  notificationsWebSocketService,
  financialDataWebSocketService,
  parametersWebSocketService
} from '../../services/websocket';

interface ServiceStatus {
  name: string;
  service: any;
  isConnected: boolean;
  lastError?: WebSocketError;
  reconnectAttempts: number;
}

interface ConnectionHealthMonitorProps {
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

export const ConnectionHealthMonitor: React.FC<ConnectionHealthMonitorProps> = ({
  showDetails = false,
  compact = false,
  className
}) => {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [overallHealth, setOverallHealth] = useState<'good' | 'warning' | 'error'>('good');
  const [errorHistory, setErrorHistory] = useState<WebSocketError[]>([]);
  const [showHealthWarning, setShowHealthWarning] = useState(false);

  // Initialize services
  useEffect(() => {
    const initialServices: ServiceStatus[] = [
      {
        name: 'Dashboard',
        service: dashboardWebSocketService,
        isConnected: false,
        reconnectAttempts: 0
      },
      {
        name: 'Notifications',
        service: notificationsWebSocketService,
        isConnected: false,
        reconnectAttempts: 0
      },
      {
        name: 'Financial Data',
        service: financialDataWebSocketService,
        isConnected: false,
        reconnectAttempts: 0
      },
      {
        name: 'Parameters',
        service: parametersWebSocketService,
        isConnected: false,
        reconnectAttempts: 0
      }
    ];

    setServices(initialServices);
  }, []);

  // Monitor connection states
  useEffect(() => {
    const updateServiceStates = () => {
      setServices(prev => prev.map(service => ({
        ...service,
        isConnected: service.service.isConnectionReady(),
        reconnectAttempts: service.service.getReconnectAttempts()
      })));

      // Update error history
      setErrorHistory(globalWebSocketErrorHandler.getErrorHistory());
      setShowHealthWarning(globalWebSocketErrorHandler.shouldShowHealthWarning());
    };

    // Initial update
    updateServiceStates();

    // Set up periodic monitoring
    const interval = setInterval(updateServiceStates, 2000);

    // Listen for connection state changes
    const unsubscribe = globalWebSocketErrorHandler.addConnectionListener((state: ConnectionState) => {
      updateServiceStates();
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  // Calculate overall health
  useEffect(() => {
    const connectedServices = services.filter(s => s.isConnected).length;
    const totalServices = services.length;
    const reconnectingServices = services.filter(s => s.reconnectAttempts > 0).length;

    if (connectedServices === totalServices) {
      setOverallHealth('good');
    } else if (connectedServices > 0 || reconnectingServices > 0) {
      setOverallHealth('warning');
    } else {
      setOverallHealth('error');
    }
  }, [services]);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getServiceIcon = (service: ServiceStatus) => {
    if (service.isConnected) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (service.reconnectAttempts > 0) {
      return <RefreshCw className="h-4 w-4 text-orange-600 animate-spin" />;
    } else {
      return <WifiOff className="h-4 w-4 text-red-600" />;
    }
  };

  const reconnectAll = () => {
    services.forEach(service => {
      if (!service.isConnected) {
        // Trigger reconnection (this would depend on the specific service implementation)
        console.log(`Attempting to reconnect ${service.name} service`);
      }
    });
  };

  const clearErrorHistory = () => {
    globalWebSocketErrorHandler.clearErrorHistory();
    setErrorHistory([]);
  };

  const recentErrors = errorHistory.slice(-5);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge variant={overallHealth === 'good' ? 'default' : 'destructive'} className="text-xs">
          {getHealthIcon(overallHealth)}
          <span className="ml-1">
            {services.filter(s => s.isConnected).length}/{services.length} Connected
          </span>
        </Badge>
        {showHealthWarning && (
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        )}
      </div>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Connection Health
          </CardTitle>
          <Badge className={getHealthColor(overallHealth)}>
            {getHealthIcon(overallHealth)}
            <span className="ml-1 capitalize">{overallHealth}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Health warning */}
        {showHealthWarning && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Multiple connection issues detected. Real-time features may be degraded.
            </AlertDescription>
          </Alert>
        )}

        {/* Service status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Services</h4>
          <div className="grid grid-cols-1 gap-2">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  {getServiceIcon(service)}
                  <span className="text-sm font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {service.reconnectAttempts > 0 && (
                    <>
                      <Clock className="h-3 w-3" />
                      <span>Attempt {service.reconnectAttempts}</span>
                    </>
                  )}
                  <Badge
                    variant={service.isConnected ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {service.isConnected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent errors */}
        {showDetails && recentErrors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Recent Issues</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearErrorHistory}
                className="text-xs h-6"
              >
                Clear
              </Button>
            </div>
            <div className="space-y-1">
              {recentErrors.map((error, index) => (
                <div
                  key={index}
                  className="p-2 rounded text-xs bg-red-50 border border-red-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {error.endpoint || 'WebSocket'}
                    </span>
                    <span className="text-muted-foreground">
                      {error.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-red-700 mt-1">
                    {error.reason || `Error code: ${error.code}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={reconnectAll}
            className="text-xs"
            disabled={overallHealth === 'good'}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reconnect All
          </Button>
          {showDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
              className="text-xs"
            >
              Refresh Page
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionHealthMonitor;