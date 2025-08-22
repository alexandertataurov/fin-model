import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { Avatar } from '../../atoms/Avatar';
import {
  UserMenuProps,
  UserMenuRef,
  UserMenuContextValue,
  UserMenuItem,
} from './UserMenu.types';
import {
  userMenuVariants,
  userMenuHeaderVariants,
  userMenuContentVariants,
  userMenuGroupVariants,
} from './UserMenu.variants';

const UserMenuContext = React.createContext<UserMenuContextValue | null>(null);

const useUserMenuContext = () => {
  const context = React.useContext(UserMenuContext);
  if (!context) {
    throw new Error('UserMenu components must be used within a UserMenu');
  }
  return context;
};

const StyledUserMenu = styled.div<{
  $variant: string;
  $size: string;
  $expanded: boolean;
}>`
  width: 100%;
  ${({ $variant, $size, $expanded }) =>
    userMenuVariants({ variant: $variant, size: $size, expanded: $expanded })}
`;

const StyledUserMenuHeader = styled.div<{ $variant: string; $size: string }>`
  ${({ $variant, $size }) =>
    userMenuHeaderVariants({ variant: $variant, size: $size })}
`;

const StyledUserMenuTrigger = styled.button<{
  $variant: string;
  $size: string;
}>`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
  padding: ${getToken('spacing.2')} ${getToken('spacing.3')};
  border: none;
  background: none;
  border-radius: ${getToken('borderRadius.md')};
  cursor: pointer;
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
  color: ${getToken('colors.foreground')};

  &:hover {
    background-color: ${getToken('colors.muted')};
  }

  &:focus {
    outline: 2px solid ${getToken('colors.primary')};
    outline-offset: 2px;
  }
`;

const StyledUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-width: 0;
`;

const StyledUserName = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  font-weight: ${getToken('typography.fontWeight.medium')};
  color: ${getToken('colors.foreground')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${getToken('spacing.32')};
`;

const StyledUserRole = styled.div`
  font-size: ${getToken('typography.fontSize.xs')};
  color: ${getToken('colors.muted.foreground')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${getToken('spacing.32')};
`;

const StyledUserMenuContent = styled.div<{ $variant: string; $size: string }>`
  ${({ $variant, $size }) =>
    userMenuContentVariants({ variant: $variant, size: $size })}
`;

const StyledUserMenuProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
  padding: ${getToken('spacing.4')};
  border-bottom: ${getToken('borderWidth.sm')} solid
    ${getToken('colors.border')};
  margin-bottom: ${getToken('spacing.2')};
`;

const StyledUserMenuProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const StyledUserMenuProfileName = styled.div`
  font-size: ${getToken('typography.fontSize.base')};
  font-weight: ${getToken('typography.fontWeight.semibold')};
  color: ${getToken('colors.foreground')};
  margin-bottom: ${getToken('spacing.1')};
`;

const StyledUserMenuProfileEmail = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
  margin-bottom: ${getToken('spacing.2')};
`;

const StyledUserMenuProfileStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.1')};
  font-size: ${getToken('typography.fontSize.xs')};
`;

const StyledUserMenuGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getToken('spacing.1')};
`;

const StyledUserMenuGroup = styled.div<{
  $variant: string;
  $size: string;
  $expanded: boolean;
}>`
  ${({ $variant, $size, $expanded }) =>
    userMenuGroupVariants({
      variant: $variant,
      size: $size,
      expanded: $expanded,
    })}
`;

const StyledUserMenuGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  padding: ${getToken('spacing.2')} ${getToken('spacing.3')};
  font-size: ${getToken('typography.fontSize.xs')};
  font-weight: ${getToken('typography.fontWeight.medium')};
  color: ${getToken('colors.muted.foreground')};
  text-transform: uppercase;
  letter-spacing: ${getToken('typography.letterSpacing.wide') || '0.025em'};
`;

const StyledUserMenuItems = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledUserMenuItem = styled.button<{
  $variant: string;
  $size: string;
  $active: boolean;
  $danger: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
  width: 100%;
  padding: ${getToken('spacing.2')} ${getToken('spacing.3')};
  border: none;
  background: none;
  border-radius: ${getToken('borderRadius.sm')};
  cursor: pointer;
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
  text-align: left;
  color: ${({ $danger }) =>
    $danger
      ? getToken('colors.destructive.foreground')
      : getToken('colors.foreground')};

  &:hover {
    background-color: ${({ $danger }) =>
    $danger
      ? getToken('colors.destructive.muted')
      : getToken('colors.muted')};
  }

  &:focus {
    outline: 2px solid ${getToken('colors.primary')};
    outline-offset: 2px;
  }

  ${({ $active }) =>
    $active &&
    `
    background-color: ${getToken('colors.primary.muted')};
    color: ${getToken('colors.primary.foreground')};
  `}
`;

const StyledUserMenuItemIcon = styled.div<{
  $active: boolean;
  $danger: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${getToken('spacing.4')};
  height: ${getToken('spacing.4')};
  color: ${({ $active, $danger }) =>
    $active
      ? getToken('colors.primary.foreground')
      : $danger
        ? getToken('colors.destructive.foreground')
        : getToken('colors.muted.foreground')};
`;

const StyledUserMenuItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const StyledUserMenuItemLabel = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  font-weight: ${getToken('typography.fontWeight.medium')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledUserMenuItemDescription = styled.div`
  font-size: ${getToken('typography.fontSize.xs')};
  color: ${getToken('colors.muted.foreground')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: ${getToken('spacing.0.5')};
`;

const StyledUserMenuItemBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.1')};
  flex-shrink: 0;
`;

const StyledUserMenuFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${getToken('spacing.3')};
  border-top: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  margin-top: ${getToken('spacing.2')};
`;

const StyledUserMenuThemeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
`;

const UserMenu = React.forwardRef<UserMenuRef, UserMenuProps>(
  (
    {
      user,
      groups = [],
      themeToggle = false,
      variant = 'default',
      size = 'md',
      expanded = false,
      onItemClick,
      onThemeToggle,
      onLogout,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(expanded);
    const [activeItem, setActiveItem] = useState<string | null>(null);

    // Handle menu toggle
    const handleMenuToggle = useCallback(() => {
      setIsExpanded(!isExpanded);
    }, [isExpanded]);

    // Handle item click
    const handleItemClick = useCallback(
      (item: UserMenuItem) => {
        setActiveItem(item.key);
        onItemClick?.(item);
      },
      [onItemClick]
    );

    // Handle theme toggle
    const handleThemeToggle = useCallback(() => {
      onThemeToggle?.();
    }, [onThemeToggle]);

    // Handle logout
    const handleLogout = useCallback(() => {
      onLogout?.();
    }, [onLogout]);

    const contextValue: UserMenuContextValue = {
      isExpanded,
      activeItem,
      onMenuToggle: handleMenuToggle,
      onItemClick: handleItemClick,
      onThemeToggle: handleThemeToggle,
      onLogout: handleLogout,
      variant,
      size,
    };

    return (
      <UserMenuContext.Provider value={contextValue}>
        <StyledUserMenu
          ref={ref}
          $variant={variant}
          $size={size}
          $expanded={isExpanded}
          className={className}
          style={style}
          {...props}
        >
          {/* Trigger */}
          <StyledUserMenuTrigger
            $variant={variant}
            $size={size}
            onClick={handleMenuToggle}
            aria-expanded={isExpanded}
            aria-haspopup="true"
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              size={size}
              fallback={user.name.charAt(0).toUpperCase()}
            />

            <StyledUserInfo>
              <StyledUserName>{user.name}</StyledUserName>
              <StyledUserRole>{user.role}</StyledUserRole>
            </StyledUserInfo>

            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size="sm" />
          </StyledUserMenuTrigger>

          {/* Content */}
          {isExpanded && (
            <StyledUserMenuContent $variant={variant} $size={size}>
              {/* Profile Section */}
              <StyledUserMenuProfile>
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  size="lg"
                  fallback={user.name.charAt(0).toUpperCase()}
                />

                <StyledUserMenuProfileInfo>
                  <StyledUserMenuProfileName>
                    {user.name}
                  </StyledUserMenuProfileName>
                  <StyledUserMenuProfileEmail>
                    {user.email}
                  </StyledUserMenuProfileEmail>
                  <StyledUserMenuProfileStatus>
                    <Icon name="circle" size="xs" />
                    <span>{user.status}</span>
                  </StyledUserMenuProfileStatus>
                </StyledUserMenuProfileInfo>
              </StyledUserMenuProfile>

              {/* Menu Groups */}
              <StyledUserMenuGroups>
                {groups.map(group => (
                  <StyledUserMenuGroup
                    key={group.id}
                    $variant={variant}
                    $size={size}
                    $expanded={true}
                  >
                    {group.title && (
                      <StyledUserMenuGroupHeader>
                        <Icon name={group.icon || 'menu'} size="xs" />
                        {group.title}
                      </StyledUserMenuGroupHeader>
                    )}

                    <StyledUserMenuItems>
                      {group.items.map((item, index) => (
                        <StyledUserMenuItem
                          key={index}
                          $variant={variant}
                          $size={size}
                          $active={activeItem === item.key}
                          $danger={item.danger || false}
                          onClick={() => handleItemClick(item)}
                        >
                          <StyledUserMenuItemIcon
                            $active={activeItem === item.key}
                            $danger={item.danger || false}
                          >
                            <Icon name={item.icon} size="sm" />
                          </StyledUserMenuItemIcon>

                          <StyledUserMenuItemContent>
                            <StyledUserMenuItemLabel>
                              {item.label}
                            </StyledUserMenuItemLabel>
                            {item.description && (
                              <StyledUserMenuItemDescription>
                                {item.description}
                              </StyledUserMenuItemDescription>
                            )}
                          </StyledUserMenuItemContent>

                          {item.badge && (
                            <StyledUserMenuItemBadge>
                              <Badge variant={item.badge.variant} size="xs">
                                {item.badge.text}
                              </Badge>
                            </StyledUserMenuItemBadge>
                          )}
                        </StyledUserMenuItem>
                      ))}
                    </StyledUserMenuItems>
                  </StyledUserMenuGroup>
                ))}
              </StyledUserMenuGroups>

              {children}
            </StyledUserMenuContent>
          )}

          {/* Footer */}
          {isExpanded && (
            <StyledUserMenuFooter>
              {themeToggle && (
                <StyledUserMenuThemeToggle>
                  <Button variant="ghost" size="sm" onClick={handleThemeToggle}>
                    <Icon name="moon" size="sm" />
                    Theme
                  </Button>
                </StyledUserMenuThemeToggle>
              )}

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <Icon name="log-out" size="sm" />
                Logout
              </Button>
            </StyledUserMenuFooter>
          )}
        </StyledUserMenu>
      </UserMenuContext.Provider>
    );
  }
);

UserMenu.displayName = 'UserMenu';

export { UserMenu, useUserMenuContext };
