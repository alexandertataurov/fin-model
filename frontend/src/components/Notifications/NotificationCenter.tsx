import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/cn';
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Clock,
  Filter,
  MoreVertical,
  RefreshCw,
  Settings,
  Trash2,
  X,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  useNotifications,
  type Notification,
} from '../../contexts/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDismiss,
  onRemove,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50/50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50/50';
      case 'normal':
        return 'border-l-blue-500 bg-blue-50/50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50/50';
      default:
        return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <BellRing className="h-4 w-4 text-red-600" />;
      case 'high':
        return <Bell className="h-4 w-4 text-orange-600" />;
      default:
        return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div
      className={cn(
        'relative flex gap-3 p-3 border-l-4 transition-all duration-200',
        getPriorityColor(notification.priority),
        !notification.is_read && 'bg-opacity-100',
        isHovered && 'bg-opacity-80',
        notification.is_read && 'opacity-75'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Priority Icon */}
      <div className="flex-shrink-0 mt-1">
        {getPriorityIcon(notification.priority)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4
              className={cn(
                'text-sm font-medium leading-5',
                !notification.is_read && 'font-semibold'
              )}
            >
              {notification.title}
            </h4>
            <p className="text-sm text-muted-foreground leading-5 mt-1">
              {notification.message}
            </p>
          </div>

          {/* Actions */}
          <div
            className={cn(
              'flex items-center gap-1 opacity-0 transition-opacity',
              isHovered && 'opacity-100'
            )}
          >
            {!notification.is_read && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onMarkAsRead(notification.id)}
                title="Mark as read"
              >
                <Check className="h-3 w-3" />
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!notification.is_read && (
                  <>
                    <DropdownMenuItem
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark as read
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => onDismiss(notification.id)}>
                  <X className="h-4 w-4 mr-2" />
                  Dismiss
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onRemove(notification.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatTimeAgo(notification.created_at)}</span>

          {notification.type && (
            <>
              <span>•</span>
              <span className="capitalize">
                {notification.type.replace('_', ' ')}
              </span>
            </>
          )}

          {notification.expires_at && (
            <>
              <span>•</span>
              <span>Expires {formatTimeAgo(notification.expires_at)}</span>
            </>
          )}
        </div>
      </div>

      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="absolute top-3 right-3 w-2 h-2 bg-blue-600 rounded-full" />
      )}
    </div>
  );
};

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  className,
}) => {
  const {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    removeNotification,
    refreshNotifications,
    loadMore,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'high')
      return ['high', 'urgent'].includes(notification.priority);
    return true;
  });

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      await markAsRead(id);
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  const handleDismiss = useCallback(
    async (id: string) => {
      await dismissNotification(id);
    },
    [dismissNotification]
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeNotification(id);
    },
    [removeNotification]
  );

  const handleRefresh = useCallback(async () => {
    await refreshNotifications();
  }, [refreshNotifications]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative', className)}
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            <Badge
              variant={isConnected ? 'default' : 'secondary'}
              className={cn(
                'text-xs',
                isConnected
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Live
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            {/* Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? 'bg-accent' : ''}
                >
                  All notifications
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilter('unread')}
                  className={filter === 'unread' ? 'bg-accent' : ''}
                >
                  Unread only
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilter('high')}
                  className={filter === 'high' ? 'bg-accent' : ''}
                >
                  High priority
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Refresh */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh notifications"
            >
              <RefreshCw
                className={cn('h-4 w-4', isLoading && 'animate-spin')}
              />
            </Button>

            {/* Mark all as read */}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleMarkAllAsRead}
                title="Mark all as read"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Notification settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filter indicator */}
        {filter !== 'all' && (
          <div className="px-4 py-2 bg-accent/50 text-sm text-muted-foreground border-b">
            Showing {filter} notifications
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 ml-2 text-xs underline"
              onClick={() => setFilter('all')}
            >
              Show all
            </Button>
          </div>
        )}

        {/* Notifications list */}
        <ScrollArea className="max-h-96">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {filter === 'all'
                  ? 'No notifications'
                  : filter === 'unread'
                    ? 'No unread notifications'
                    : 'No high priority notifications'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification, _index) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDismiss={handleDismiss}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Load more */}
        {filteredNotifications.length > 0 && (
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={loadMore}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load more'
              )}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
