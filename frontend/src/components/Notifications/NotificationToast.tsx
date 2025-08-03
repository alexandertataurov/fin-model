import React, { useEffect, useState, useCallback } from 'react';
import { X, Bell, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { type Notification } from '../../contexts/NotificationContext';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  onAction?: (action: string) => void;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onAction,
  duration = 5000,
  position = 'top-right',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Auto-close timer
  useEffect(() => {
    // Show animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto-close timer (if duration > 0)
    let closeTimer: NodeJS.Timeout;
    if (duration > 0) {
      closeTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(showTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [duration, handleClose]);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  }, [onClose]);

  const getIcon = () => {
    switch (notification.priority) {
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'normal':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'low':
        return <Bell className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    const baseStyles =
      'flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm';

    switch (notification.priority) {
      case 'urgent':
        return cn(baseStyles, 'bg-red-50/95 border-red-200 text-red-900');
      case 'high':
        return cn(
          baseStyles,
          'bg-orange-50/95 border-orange-200 text-orange-900'
        );
      case 'normal':
        return cn(baseStyles, 'bg-blue-50/95 border-blue-200 text-blue-900');
      case 'low':
        return cn(baseStyles, 'bg-gray-50/95 border-gray-200 text-gray-900');
      default:
        return cn(baseStyles, 'bg-white/95 border-gray-200');
    }
  };

  const getPositionStyles = () => {
    const transforms = {
      'top-right': isVisible ? 'translate-x-0' : 'translate-x-full',
      'top-left': isVisible ? 'translate-x-0' : '-translate-x-full',
      'bottom-right': isVisible ? 'translate-x-0' : 'translate-x-full',
      'bottom-left': isVisible ? 'translate-x-0' : '-translate-x-full',
    };

    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
    };

    return cn(
      'fixed z-50 w-80 transition-all duration-300 ease-out',
      positions[position],
      transforms[position],
      isLeaving && 'opacity-0 scale-95'
    );
  };

  // Parse actions from notification data
  const actions = notification.data?.actions || [];

  return (
    <div className={getPositionStyles()}>
      <div className={getStyles()}>
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm leading-5 mb-1">
            {notification.title}
          </h4>
          <p className="text-sm leading-5 opacity-90">{notification.message}</p>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {actions.map((action: any, index: number) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.primary ? 'default' : 'outline'}
                  className="h-7 px-3 text-xs"
                  onClick={() => {
                    onAction?.(action.key);
                    if (action.closeOnAction !== false) {
                      handleClose();
                    }
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress bar for auto-close */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-current opacity-30 transition-all ease-linear"
            style={{
              width: isVisible ? '0%' : '100%',
              transitionDuration: `${duration}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
};

// Toast container component
interface NotificationToastContainerProps {
  toasts: Array<{
    id: string;
    notification: Notification;
    duration?: number;
  }>;
  onRemoveToast: (id: string) => void;
  onToastAction?: (id: string, action: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
}

export const NotificationToastContainer: React.FC<
  NotificationToastContainerProps
> = ({
  toasts,
  onRemoveToast,
  onToastAction,
  position = 'top-right',
  maxToasts = 5,
}) => {
  // Limit number of visible toasts
  const visibleToasts = toasts.slice(0, maxToasts);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {visibleToasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index,
          }}
        >
          <NotificationToast
            notification={toast.notification}
            duration={toast.duration}
            position={position}
            onClose={() => onRemoveToast(toast.id)}
            onAction={action => onToastAction?.(toast.id, action)}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
