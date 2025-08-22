import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { Progress } from '../../atoms/Progress';
import {
  StatusBarProps,
  StatusBarRef,
  StatusBarContextValue,
} from './StatusBar.types';
import {
  statusBarVariants,
  statusBarContentVariants,
  statusGroupVariants,
} from './StatusBar.variants';

const StatusBarContext = React.createContext<StatusBarContextValue | null>(
  null
);

const useStatusBarContext = () => {
  const context = React.useContext(StatusBarContext);
  if (!context) {
    throw new Error('StatusBar components must be used within a StatusBar');
  }
  return context;
};

const StyledStatusBar = styled.div<{
  $variant: string;
  $size: string;
  $position: string;
}>`
  width: 100%;
  ${({ $variant, $size, $position }) =>
    statusBarVariants({ variant: $variant, size: $size, position: $position })}
`;

const StyledStatusBarContent = styled.div<{ $variant: string; $size: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ $variant, $size }) =>
    statusBarContentVariants({ variant: $variant, size: $size })}
`;

const StyledStatusBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
  flex: 1;
`;

const StyledStatusBarCenter = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
  justify-content: center;
`;

const StyledStatusBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
  justify-content: flex-end;
`;

const StyledStatusGroups = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.4')};
  flex-wrap: wrap;
`;

const StyledStatusGroup = styled.div<{
  $variant: string;
  $size: string;
  $expanded: boolean;
}>`
  ${({ $variant, $size, $expanded }) =>
    statusGroupVariants({
      variant: $variant,
      size: $size,
      expanded: $expanded,
    })}
`;

const StyledStatusGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  margin-bottom: ${getToken('spacing.1')};
`;

const StyledStatusGroupTitle = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  font-weight: ${getToken('typography.fontWeight.medium')};
  color: ${getToken('colors.muted.foreground')};
  text-transform: uppercase;
  letter-spacing: ${getToken('typography.letterSpacing.wide') || '0.025em'};
`;

const StyledStatusGroupItems = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  flex-wrap: wrap;
`;

const StyledStatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.1')};
`;

const StyledStatusItemIcon = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${getToken('spacing.4')};
  height: ${getToken('spacing.4')};
  border-radius: 50%;
  background-color: ${({ $status }) =>
    $status === 'success'
      ? getToken('colors.success.50')
      : $status === 'warning'
        ? getToken('colors.warning.50')
        : $status === 'error'
          ? getToken('colors.destructive.50')
          : $status === 'info'
            ? getToken('colors.info.50')
            : getToken('colors.muted')};
  color: ${({ $status }) =>
    $status === 'success'
      ? getToken('colors.success.foreground')
      : $status === 'warning'
        ? getToken('colors.warning.foreground')
        : $status === 'error'
          ? getToken('colors.destructive.foreground')
          : $status === 'info'
            ? getToken('colors.info.foreground')
            : getToken('colors.muted.foreground')};
`;

const StyledStatusItemText = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.foreground')};
`;

const StyledStatusItemValue = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  font-weight: ${getToken('typography.fontWeight.medium')};
  color: ${getToken('colors.foreground')};
`;

const StyledStatusBarProgress = styled.div`
  min-width: ${getToken('spacing.32')};
`;

const StyledStatusBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
`;

const StyledStatusBarDivider = styled.div`
  width: ${getToken('borderWidth.sm')};
  height: ${getToken('spacing.6')};
  background-color: ${getToken('colors.border')};
  margin: 0 ${getToken('spacing.2')};
`;

const StyledStatusBarNotification = styled.div<{ $type: string }>`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  padding: ${getToken('spacing.1')} ${getToken('spacing.2')};
  border-radius: ${getToken('borderRadius.sm')};
  background-color: ${({ $type }) =>
    $type === 'success'
      ? getToken('colors.success.50')
      : $type === 'warning'
        ? getToken('colors.warning.50')
        : $type === 'error'
          ? getToken('colors.destructive.50')
          : $type === 'info'
            ? getToken('colors.info.50')
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
  font-size: ${getToken('typography.fontSize.sm')};
`;

const StatusBar = React.forwardRef<StatusBarRef, StatusBarProps>(
  (
    {
      groups = [],
      progress,
      notification,
      actions = [],
      variant = 'default',
      size = 'md',
      position = 'bottom',
      onActionClick,
      onNotificationClick,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
      new Set()
    );

    // Handle action click
    const handleActionClick = useCallback(
      (action: any) => {
        onActionClick?.(action);
      },
      [onActionClick]
    );

    // Handle notification click
    const handleNotificationClick = useCallback(() => {
      onNotificationClick?.();
    }, [onNotificationClick]);

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

    // Get status icon
    const getStatusIcon = useCallback((status: string) => {
      switch (status) {
        case 'success':
          return 'check-circle';
        case 'warning':
          return 'alert-triangle';
        case 'error':
          return 'x-circle';
        case 'info':
          return 'info';
        default:
          return 'circle';
      }
    }, []);

    const contextValue: StatusBarContextValue = {
      expandedGroups,
      onActionClick: handleActionClick,
      onNotificationClick: handleNotificationClick,
      onGroupToggle: handleGroupToggle,
      variant,
      size,
    };

    return (
      <StatusBarContext.Provider value={contextValue}>
        <StyledStatusBar
          ref={ref}
          $variant={variant}
          $size={size}
          $position={position}
          className={className}
          style={style}
          {...props}
        >
          <StyledStatusBarContent $variant={variant} $size={size}>
            {/* Left Section */}
            <StyledStatusBarLeft>
              {/* Status Groups */}
              <StyledStatusGroups>
                {groups.map(group => (
                  <StyledStatusGroup
                    key={group.id}
                    $variant={variant}
                    $size={size}
                    $expanded={expandedGroups.has(group.id)}
                  >
                    {group.title && (
                      <StyledStatusGroupHeader>
                        {group.icon && <Icon name={group.icon} size="sm" />}
                        <StyledStatusGroupTitle>
                          {group.title}
                        </StyledStatusGroupTitle>
                      </StyledStatusGroupHeader>
                    )}

                    <StyledStatusGroupItems>
                      {group.items.map((item, index) => (
                        <StyledStatusItem key={index}>
                          <StyledStatusItemIcon $status={item.status}>
                            <Icon
                              name={item.icon || getStatusIcon(item.status)}
                              size="xs"
                            />
                          </StyledStatusItemIcon>
                          <StyledStatusItemText>
                            {item.label}
                          </StyledStatusItemText>
                          {item.value && (
                            <StyledStatusItemValue>
                              {item.value}
                            </StyledStatusItemValue>
                          )}
                          {item.badge && (
                            <Badge variant={item.badge.variant} size="xs">
                              {item.badge.text}
                            </Badge>
                          )}
                        </StyledStatusItem>
                      ))}
                    </StyledStatusGroupItems>
                  </StyledStatusGroup>
                ))}
              </StyledStatusGroups>
            </StyledStatusBarLeft>

            {/* Center Section */}
            <StyledStatusBarCenter>
              {/* Progress */}
              {progress && (
                <StyledStatusBarProgress>
                  <Progress
                    value={progress.value}
                    max={progress.max}
                    variant={progress.variant || variant}
                    size={size}
                    showLabel={progress.showLabel}
                    label={progress.label}
                  />
                </StyledStatusBarProgress>
              )}

              {children}
            </StyledStatusBarCenter>

            {/* Right Section */}
            <StyledStatusBarRight>
              {/* Notification */}
              {notification && (
                <StyledStatusBarNotification
                  $type={notification.type}
                  onClick={handleNotificationClick}
                  style={{
                    cursor: onNotificationClick ? 'pointer' : 'default',
                  }}
                >
                  <Icon
                    name={notification.icon || getStatusIcon(notification.type)}
                    size="sm"
                  />
                  <span>{notification.message}</span>
                  {notification.badge && (
                    <Badge variant={notification.badge.variant} size="xs">
                      {notification.badge.text}
                    </Badge>
                  )}
                </StyledStatusBarNotification>
              )}

              {/* Actions */}
              {actions.length > 0 && (
                <>
                  <StyledStatusBarDivider />
                  <StyledStatusBarActions>
                    {actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant || 'ghost'}
                        size={size}
                        onClick={() => handleActionClick(action)}
                        disabled={action.disabled}
                      >
                        {action.icon && <Icon name={action.icon} size="sm" />}
                        {action.label}
                        {action.badge && (
                          <Badge variant={action.badge.variant} size="xs">
                            {action.badge.text}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </StyledStatusBarActions>
                </>
              )}
            </StyledStatusBarRight>
          </StyledStatusBarContent>
        </StyledStatusBar>
      </StatusBarContext.Provider>
    );
  }
);

StatusBar.displayName = 'StatusBar';

export { StatusBar, useStatusBarContext };
