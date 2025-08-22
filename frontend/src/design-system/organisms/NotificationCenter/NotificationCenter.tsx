import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { Select } from '../../molecules/Select';
import { SearchInput } from '../../molecules/SearchInput';
import {
  NotificationCenterProps,
  NotificationCenterRef,
  NotificationCenterContextValue,
  Notification,
} from './NotificationCenter.types';
import {
  notificationCenterVariants,
  notificationCenterHeaderVariants,
  notificationCenterContentVariants,
  notificationGroupVariants,
} from './NotificationCenter.variants';

const NotificationCenterContext =
  React.createContext<NotificationCenterContextValue | null>(null);

const useNotificationCenterContext = () => {
  const context = React.useContext(NotificationCenterContext);
  if (!context) {
    throw new Error(
      'NotificationCenter components must be used within a NotificationCenter'
    );
  }
  return context;
};

const StyledNotificationCenter = styled.div<{
  $variant: string;
  $size: string;
  $expanded: boolean;
}>`
  width: 100%;
  ${({ $variant, $size, $expanded }) =>
    notificationCenterVariants({
      variant: $variant,
      size: $size,
      expanded: $expanded,
    })}
`;

const StyledNotificationCenterHeader = styled.div<{
  $variant: string;
  $size: string;
}>`
  ${({ $variant, $size }) =>
    notificationCenterHeaderVariants({ variant: $variant, size: $size })}
`;

const StyledNotificationCenterTitle = styled.div`
  font-size: ${getToken('typography.fontSize.lg')};
  font-weight: ${getToken('typography.fontWeight.semibold')};
  color: ${getToken('colors.foreground')};
  margin-bottom: ${getToken('spacing.2')};
`;

const StyledNotificationCenterSubtitle = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
  margin-bottom: ${getToken('spacing.4')};
`;

const StyledNotificationCenterActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  margin-bottom: ${getToken('spacing.4')};
`;

const StyledNotificationCenterContent = styled.div<{
  $variant: string;
  $size: string;
}>`
  ${({ $variant, $size }) =>
    notificationCenterContentVariants({ variant: $variant, size: $size })}
`;

const StyledNotificationCenterFilters = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
  margin-bottom: ${getToken('spacing.4')};
  flex-wrap: wrap;
`;

const StyledNotificationCenterSearch = styled.div`
  min-width: ${getToken('spacing.64')};
`;

const StyledNotificationGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getToken('spacing.4')};
`;

const StyledNotificationGroup = styled.div<{
  $variant: string;
  $size: string;
  $expanded: boolean;
}>`
  ${({ $variant, $size, $expanded }) =>
    notificationGroupVariants({
      variant: $variant,
      size: $size,
      expanded: $expanded,
    })}
`;

const StyledNotificationGroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: ${getToken('spacing.3')};
  border-radius: ${getToken('borderRadius.md')};
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};

  &:hover {
    background-color: ${getToken('colors.muted')};
  }
`;

const StyledNotificationGroupTitle = styled.div`
  font-size: ${getToken('typography.fontSize.base')};
  font-weight: ${getToken('typography.fontWeight.medium')};
  color: ${getToken('colors.foreground')};
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
`;

const StyledNotificationGroupBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.1')};
`;

const StyledNotificationGroupIcon = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${getToken('spacing.4')};
  height: ${getToken('spacing.4')};
  transition: transform ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
  transform: rotate(${({ $expanded }) => ($expanded ? '90deg' : '0deg')});
`;

const StyledNotificationGroupContent = styled.div<{ $expanded: boolean }>`
  padding: ${getToken('spacing.3')};
  padding-top: 0;
  max-height: ${({ $expanded }) => ($expanded ? '500px' : '0')};
  overflow: hidden;
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
  opacity: ${({ $expanded }) => ($expanded ? '1' : '0')};
`;

const StyledNotifications = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getToken('spacing.2')};
`;

const StyledNotification = styled.div<{ $read: boolean; $priority: string }>`
  display: flex;
  align-items: flex-start;
  gap: ${getToken('spacing.3')};
  padding: ${getToken('spacing.3')};
  border-radius: ${getToken('borderRadius.md')};
  border: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  background-color: ${({ $read }) =>
    $read ? getToken('colors.background') : getToken('colors.muted')};
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
  border-left: ${({ $priority }) =>
    $priority === 'high'
      ? `${getToken('borderWidth.md')} solid ${getToken('colors.destructive')}`
      : $priority === 'medium'
        ? `${getToken('borderWidth.md')} solid ${getToken('colors.warning')}`
        : $priority === 'low'
          ? `${getToken('borderWidth.md')} solid ${getToken('colors.info')}`
          : `${getToken('borderWidth.sm')} solid ${getToken('colors.border')}`};

  &:hover {
    background-color: ${getToken('colors.muted')};
    transform: translateY(-1px);
    box-shadow: ${getToken('shadows.sm')};
  }
`;

const StyledNotificationIcon = styled.div<{ $type: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${getToken('spacing.8')};
  height: ${getToken('spacing.8')};
  border-radius: 50%;
  background-color: ${({ $type }) =>
    $type === 'success'
      ? getToken('colors.success.muted')
      : $type === 'warning'
        ? getToken('colors.warning.muted')
        : $type === 'error'
          ? getToken('colors.destructive.muted')
          : $type === 'info'
            ? getToken('colors.info.muted')
            : getToken('colors.muted')};
  color: ${({ $type }) =>
    $type === 'success'
      ? getToken('colors.success.foreground')
      : $type === 'warning'
        ? getToken('colors.warning.foreground')
        : $type === 'error'
          ? getToken('colors.destructive.foreground')
          : $type === 'info'
            ? getToken('colors.info.foreground')
            : getToken('colors.muted.foreground')};
  flex-shrink: 0;
`;

const StyledNotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const StyledNotificationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${getToken('spacing.1')};
`;

const StyledNotificationTitle = styled.div<{ $read: boolean }>`
  font-size: ${getToken('typography.fontSize.base')};
  font-weight: ${({ $read }) =>
    $read
      ? getToken('typography.fontWeight.normal')
      : getToken('typography.fontWeight.medium')};
  color: ${getToken('colors.foreground')};
  margin-bottom: ${getToken('spacing.1')};
`;

const StyledNotificationMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
`;

const StyledNotificationTime = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
`;

const StyledNotificationPriority = styled.div<{ $priority: string }>`
  font-size: ${getToken('typography.fontSize.xs')};
  padding: ${getToken('spacing.1')} ${getToken('spacing.2')};
  border-radius: ${getToken('borderRadius.sm')};
  background-color: ${({ $priority }) =>
    $priority === 'high'
      ? getToken('colors.destructive.muted')
      : $priority === 'medium'
        ? getToken('colors.warning.muted')
        : $priority === 'low'
          ? getToken('colors.info.muted')
          : getToken('colors.muted')};
  color: ${({ $priority }) =>
    $priority === 'high'
      ? getToken('colors.destructive.foreground')
      : $priority === 'medium'
        ? getToken('colors.warning.foreground')
        : $priority === 'low'
          ? getToken('colors.info.foreground')
          : getToken('colors.muted.foreground')};
`;

const StyledNotificationMessage = styled.div<{ $read: boolean }>`
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${({ $read }) =>
    $read
      ? getToken('colors.muted.foreground')
      : getToken('colors.foreground')};
  line-height: ${getToken('typography.lineHeight.relaxed')};
  margin-bottom: ${getToken('spacing.2')};
`;

const StyledNotificationActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
`;

const StyledNotificationCenterFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${getToken('spacing.4')};
  border-top: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  margin-top: ${getToken('spacing.4')};
`;

const NotificationCenter = React.forwardRef<
  NotificationCenterRef,
  NotificationCenterProps
>(
  (
    {
      title = 'Notifications',
      subtitle,
      groups = [],
      searchable = false,
      filterable = false,
      variant = 'default',
      size = 'md',
      expanded = false,
      onNotificationClick,
      onNotificationAction,
      onMarkAllRead,
      onClearAll,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
      new Set()
    );

    // Handle notification click
    const handleNotificationClick = useCallback(
      (notification: Notification) => {
        onNotificationClick?.(notification);
      },
      [onNotificationClick]
    );

    // Handle notification action
    const handleNotificationAction = useCallback(
      (notification: Notification, action: string) => {
        onNotificationAction?.(notification, action);
      },
      [onNotificationAction]
    );

    // Handle mark all read
    const handleMarkAllRead = useCallback(() => {
      onMarkAllRead?.();
    }, [onMarkAllRead]);

    // Handle clear all
    const handleClearAll = useCallback(() => {
      onClearAll?.();
    }, [onClearAll]);

    // Handle group toggle
    const handleGroupToggle = useCallback((groupId: string) => {
      setExpandedGroups(prev => {
        const newSet = new Set(prev);
        if (newSet.has(groupId)) {
          newSet.delete(groupId);
        } else {
          newSet.add(groupId);
        }
        return newSet;
      });
    }, []);

    // Filter groups based on search
    const filteredGroups = useMemo(() => {
      if (!searchTerm) return groups;

      return groups
        .map(group => ({
          ...group,
          notifications: group.notifications.filter(
            notification =>
              notification.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              notification.message
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          ),
        }))
        .filter(group => group.notifications.length > 0);
    }, [groups, searchTerm]);

    // Get unread count
    const unreadCount = useMemo(() => {
      return groups.reduce(
        (total, group) =>
          total + group.notifications.filter(n => !n.read).length,
        0
      );
    }, [groups]);

    // Get group unread count
    const getGroupUnreadCount = useCallback(
      (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        return group ? group.notifications.filter(n => !n.read).length : 0;
      },
      [groups]
    );

    // Get notification icon
    const getNotificationIcon = useCallback((type: string) => {
      switch (type) {
        case 'success':
          return 'check-circle';
        case 'warning':
          return 'alert-triangle';
        case 'error':
          return 'x-circle';
        case 'info':
          return 'info';
        default:
          return 'bell';
      }
    }, []);

    const contextValue: NotificationCenterContextValue = {
      searchTerm,
      activeFilters,
      expandedGroups,
      unreadCount,
      onNotificationClick: handleNotificationClick,
      onNotificationAction: handleNotificationAction,
      onMarkAllRead: handleMarkAllRead,
      onClearAll: handleClearAll,
      onGroupToggle: handleGroupToggle,
      variant,
      size,
    };

    return (
      <NotificationCenterContext.Provider value={contextValue}>
        <StyledNotificationCenter
          ref={ref}
          $variant={variant}
          $size={size}
          $expanded={expanded}
          className={className}
          style={style}
          {...props}
        >
          {/* Header */}
          <StyledNotificationCenterHeader $variant={variant} $size={size}>
            <StyledNotificationCenterTitle>
              {title}
            </StyledNotificationCenterTitle>
            {subtitle && (
              <StyledNotificationCenterSubtitle>
                {subtitle}
              </StyledNotificationCenterSubtitle>
            )}

            {/* Actions */}
            <StyledNotificationCenterActions>
              {unreadCount > 0 && (
                <Badge variant="secondary" size="sm">
                  {unreadCount} unread
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
              >
                <Icon name="check-double" size="sm" />
                Mark all read
              </Button>

              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                <Icon name="trash-2" size="sm" />
                Clear all
              </Button>
            </StyledNotificationCenterActions>
          </StyledNotificationCenterHeader>

          {/* Content */}
          {expanded && (
            <StyledNotificationCenterContent $variant={variant} $size={size}>
              {/* Filters */}
              {(searchable || filterable) && (
                <StyledNotificationCenterFilters>
                  {searchable && (
                    <StyledNotificationCenterSearch>
                      <SearchInput
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={setSearchTerm}
                        variant={variant}
                        size={size}
                        showClearButton={true}
                      />
                    </StyledNotificationCenterSearch>
                  )}

                  {filterable && (
                    <Select
                      placeholder="Filter by type"
                      value={activeFilters.type || ''}
                      onChange={value =>
                        setActiveFilters(prev => ({ ...prev, type: value }))
                      }
                      options={[
                        { value: '', label: 'All types' },
                        { value: 'success', label: 'Success' },
                        { value: 'warning', label: 'Warning' },
                        { value: 'error', label: 'Error' },
                        { value: 'info', label: 'Info' },
                      ]}
                      variant={variant}
                      size={size}
                    />
                  )}
                </StyledNotificationCenterFilters>
              )}

              {/* Notification Groups */}
              <StyledNotificationGroups>
                {filteredGroups.map(group => (
                  <StyledNotificationGroup
                    key={group.id}
                    $variant={variant}
                    $size={size}
                    $expanded={expandedGroups.has(group.id)}
                  >
                    <StyledNotificationGroupHeader
                      onClick={() => handleGroupToggle(group.id)}
                    >
                      <StyledNotificationGroupTitle>
                        <Icon name={group.icon || 'bell'} size="sm" />
                        {group.title}
                      </StyledNotificationGroupTitle>

                      <StyledNotificationGroupBadge>
                        {getGroupUnreadCount(group.id) > 0 && (
                          <Badge variant="primary" size="sm">
                            {getGroupUnreadCount(group.id)}
                          </Badge>
                        )}
                        <StyledNotificationGroupIcon
                          $expanded={expandedGroups.has(group.id)}
                        >
                          <Icon name="chevron-right" size="sm" />
                        </StyledNotificationGroupIcon>
                      </StyledNotificationGroupBadge>
                    </StyledNotificationGroupHeader>

                    <StyledNotificationGroupContent
                      $expanded={expandedGroups.has(group.id)}
                    >
                      <StyledNotifications>
                        {group.notifications.map((notification, index) => (
                          <StyledNotification
                            key={index}
                            $read={notification.read}
                            $priority={notification.priority}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            style={{ cursor: 'pointer' }}
                          >
                            <StyledNotificationIcon $type={notification.type}>
                              <Icon
                                name={
                                  notification.icon ||
                                  getNotificationIcon(notification.type)
                                }
                                size="sm"
                              />
                            </StyledNotificationIcon>

                            <StyledNotificationContent>
                              <StyledNotificationHeader>
                                <StyledNotificationTitle
                                  $read={notification.read}
                                >
                                  {notification.title}
                                </StyledNotificationTitle>

                                <StyledNotificationMeta>
                                  <StyledNotificationTime>
                                    {notification.time}
                                  </StyledNotificationTime>
                                  <StyledNotificationPriority
                                    $priority={notification.priority}
                                  >
                                    {notification.priority}
                                  </StyledNotificationPriority>
                                </StyledNotificationMeta>
                              </StyledNotificationHeader>

                              <StyledNotificationMessage
                                $read={notification.read}
                              >
                                {notification.message}
                              </StyledNotificationMessage>

                              {notification.actions &&
                                notification.actions.length > 0 && (
                                  <StyledNotificationActions>
                                    {notification.actions.map(
                                      (action, actionIndex) => (
                                        <Button
                                          key={actionIndex}
                                          variant={action.variant || 'ghost'}
                                          size="xs"
                                          onClick={e => {
                                            e.stopPropagation();
                                            handleNotificationAction(
                                              notification,
                                              action.key
                                            );
                                          }}
                                        >
                                          {action.icon && (
                                            <Icon
                                              name={action.icon}
                                              size="xs"
                                            />
                                          )}
                                          {action.label}
                                        </Button>
                                      )
                                    )}
                                  </StyledNotificationActions>
                                )}
                            </StyledNotificationContent>
                          </StyledNotification>
                        ))}
                      </StyledNotifications>
                    </StyledNotificationGroupContent>
                  </StyledNotificationGroup>
                ))}
              </StyledNotificationGroups>

              {children}
            </StyledNotificationCenterContent>
          )}

          {/* Footer */}
          {expanded && (
            <StyledNotificationCenterFooter>
              <div>
                {unreadCount > 0
                  ? `${unreadCount} unread notifications`
                  : 'All notifications read'}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
              >
                Mark all read
              </Button>
            </StyledNotificationCenterFooter>
          )}
        </StyledNotificationCenter>
      </NotificationCenterContext.Provider>
    );
  }
);

NotificationCenter.displayName = 'NotificationCenter';

export { NotificationCenter, useNotificationCenterContext };
