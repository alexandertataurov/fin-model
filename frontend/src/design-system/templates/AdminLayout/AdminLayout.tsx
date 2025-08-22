import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';
import { Navigation } from '../../organisms/Navigation';
import { StatusBar } from '../../organisms/StatusBar';
import { ActionBar } from '../../organisms/ActionBar';
import {
  AdminLayoutProps,
  AdminLayoutRef,
  AdminLayoutContextValue,
} from './AdminLayout.types';
import {
  adminLayoutVariants,
  adminContentVariants,
} from './AdminLayout.variants';

const AdminLayoutContext = React.createContext<AdminLayoutContextValue | null>(
  null
);

const useAdminLayoutContext = () => {
  const context = React.useContext(AdminLayoutContext);
  if (!context) {
    throw new Error(
      'AdminLayout components must be used within an AdminLayout'
    );
  }
  return context;
};

const StyledAdminLayout = styled.div<{
  $variant: string;
  $size: string;
  $sidebarCollapsed: boolean;
}>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  ${({ $variant, $size, $sidebarCollapsed }) =>
    adminLayoutVariants({
      variant: $variant,
      size: $size,
      sidebarCollapsed: $sidebarCollapsed,
    })}
`;

const StyledAdminHeader = styled.header<{ $variant: string; $size: string }>`
  flex-shrink: 0;
  z-index: 20;
  border-bottom: ${getToken('borderWidth.sm')} solid
    ${getToken('colors.border')};
  background-color: ${getToken('colors.background')};
`;

const StyledAdminMain = styled.main<{
  $variant: string;
  $size: string;
  $sidebarCollapsed: boolean;
}>`
  flex: 1;
  display: flex;
  min-height: 0;
`;

const StyledAdminSidebar = styled.aside<{
  $variant: string;
  $size: string;
  $collapsed: boolean;
}>`
  flex-shrink: 0;
  width: ${({ $collapsed }) =>
    $collapsed ? getToken('spacing.16') : getToken('spacing.64')};
  background-color: ${getToken('colors.background')};
  border-right: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  transition: width ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
  overflow: hidden;
  z-index: 15;
`;

const StyledAdminContent = styled.div<{
  $variant: string;
  $size: string;
  $sidebarCollapsed: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  ${({ $variant, $size, $sidebarCollapsed }) =>
    adminContentVariants({
      variant: $variant,
      size: $size,
      sidebarCollapsed: $sidebarCollapsed,
    })}
`;

const StyledAdminContentHeader = styled.div<{
  $variant: string;
  $size: string;
}>`
  flex-shrink: 0;
  padding: ${getToken('spacing.4')};
  background-color: ${getToken('colors.background')};
  border-bottom: ${getToken('borderWidth.sm')} solid
    ${getToken('colors.border')};
`;

const StyledAdminContentBody = styled.div<{ $variant: string; $size: string }>`
  flex: 1;
  padding: ${getToken('spacing.6')};
  overflow: auto;
  background-color: ${getToken('colors.muted')};
`;

const StyledAdminContentFooter = styled.div<{
  $variant: string;
  $size: string;
}>`
  flex-shrink: 0;
  padding: ${getToken('spacing.4')};
  background-color: ${getToken('colors.background')};
  border-top: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
`;

const StyledAdminSidebarToggle = styled.button<{
  $variant: string;
  $size: string;
  $collapsed: boolean;
}>`
  position: absolute;
  top: ${getToken('spacing.4')};
  right: ${getToken('spacing.4')};
  width: ${getToken('spacing.8')};
  height: ${getToken('spacing.8')};
  border: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  background-color: ${getToken('colors.background')};
  color: ${getToken('colors.foreground')};
  border-radius: ${getToken('borderRadius.sm')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
  z-index: 25;

  &:hover {
    background-color: ${getToken('colors.muted')};
    border-color: ${getToken('colors.border')};
  }

  &:focus {
    outline: 2px solid ${getToken('colors.primary')};
    outline-offset: 2px;
  }
`;

const StyledAdminOverlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  opacity: ${({ $visible }) => ($visible ? '1' : '0')};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
`;

const AdminLayout = React.forwardRef<AdminLayoutRef, AdminLayoutProps>(
  (
    {
      title,
      subtitle,
      logo,
      logoText,
      navigationItems = [],
      user,
      notifications = [],
      statusItems = [],
      actions = [],
      variant = 'default',
      size = 'md',
      sidebarCollapsed = false,
      showHeader = true,
      showFooter = true,
      showSidebar = true,
      showStatusBar = true,
      showNotificationCenter = true,
      showUserMenu = true,
      showActionBar = true,
      headerProps,
      footerProps,
      navigationProps,
      statusBarProps,
      notificationCenterProps,
      userMenuProps,
      actionBarProps,
      onSidebarToggle,
      onLogoClick,
      onNavigationItemClick,
      onUserMenuClick,
      onNotificationClick,
      onStatusItemClick,
      onActionClick,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] =
      useState(sidebarCollapsed);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle sidebar toggle
    const handleSidebarToggle = useCallback(() => {
      const newCollapsed = !isSidebarCollapsed;
      setIsSidebarCollapsed(newCollapsed);
      onSidebarToggle?.(newCollapsed);
    }, [isSidebarCollapsed, onSidebarToggle]);

    // Handle mobile menu toggle
    const handleMobileMenuToggle = useCallback(() => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }, [isMobileMenuOpen]);

    // Handle logo click
    const handleLogoClick = useCallback(() => {
      onLogoClick?.();
    }, [onLogoClick]);

    // Handle navigation item click
    const handleNavigationItemClick = useCallback(
      (item: any) => {
        onNavigationItemClick?.(item);
      },
      [onNavigationItemClick]
    );

    // Handle user menu click
    const handleUserMenuClick = useCallback(
      (item: any) => {
        onUserMenuClick?.(item);
      },
      [onUserMenuClick]
    );

    // Handle notification click
    const handleNotificationClick = useCallback(
      (notification: any) => {
        onNotificationClick?.(notification);
      },
      [onNotificationClick]
    );

    // Handle status item click
    const handleStatusItemClick = useCallback(
      (item: any) => {
        onStatusItemClick?.(item);
      },
      [onStatusItemClick]
    );

    // Handle action click
    const handleActionClick = useCallback(
      (action: any) => {
        onActionClick?.(action);
      },
      [onActionClick]
    );

    const contextValue: AdminLayoutContextValue = {
      title,
      subtitle,
      logo,
      logoText,
      navigationItems,
      user,
      notifications,
      statusItems,
      actions,
      variant,
      size,
      sidebarCollapsed: isSidebarCollapsed,
      mobileMenuOpen: isMobileMenuOpen,
      onSidebarToggle: handleSidebarToggle,
      onMobileMenuToggle: handleMobileMenuToggle,
      onLogoClick: handleLogoClick,
      onNavigationItemClick: handleNavigationItemClick,
      onUserMenuClick: handleUserMenuClick,
      onNotificationClick: handleNotificationClick,
      onStatusItemClick: handleStatusItemClick,
      onActionClick: handleActionClick,
    };

    return (
      <AdminLayoutContext.Provider value={contextValue}>
        <StyledAdminLayout
          ref={ref}
          $variant={variant}
          $size={size}
          $sidebarCollapsed={isSidebarCollapsed}
          className={className}
          style={style}
          {...props}
        >
          {/* Header */}
          {showHeader && (
            <StyledAdminHeader $variant={variant} $size={size}>
              <Header
                variant={variant}
                size={size}
                logo={logo}
                logoText={logoText}
                onLogoClick={handleLogoClick}
                navigationItems={navigationItems}
                user={user}
                notifications={notifications}
                showNotificationCenter={showNotificationCenter}
                showUserMenu={showUserMenu}
                onNavigationItemClick={handleNavigationItemClick}
                onUserMenuClick={handleUserMenuClick}
                onNotificationClick={handleNotificationClick}
                {...headerProps}
              />
            </StyledAdminHeader>
          )}

          {/* Main Content */}
          <StyledAdminMain
            $variant={variant}
            $size={size}
            $sidebarCollapsed={isSidebarCollapsed}
          >
            {/* Sidebar */}
            {showSidebar && (
              <StyledAdminSidebar
                $variant={variant}
                $size={size}
                $collapsed={isSidebarCollapsed}
              >
                <Navigation
                  variant={variant}
                  size={size}
                  items={navigationItems}
                  collapsed={isSidebarCollapsed}
                  onItemClick={handleNavigationItemClick}
                  {...navigationProps}
                />

                <StyledAdminSidebarToggle
                  $variant={variant}
                  $size={size}
                  $collapsed={isSidebarCollapsed}
                  onClick={handleSidebarToggle}
                  aria-label={
                    isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                  }
                >
                  <Icon
                    name={isSidebarCollapsed ? 'chevron-right' : 'chevron-left'}
                    size="sm"
                  />
                </StyledAdminSidebarToggle>
              </StyledAdminSidebar>
            )}

            {/* Content Area */}
            <StyledAdminContent
              $variant={variant}
              $size={size}
              $sidebarCollapsed={isSidebarCollapsed}
            >
              {/* Action Bar */}
              {showActionBar && actions.length > 0 && (
                <ActionBar
                  variant={variant}
                  size={size}
                  actions={actions}
                  onActionClick={handleActionClick}
                  {...actionBarProps}
                />
              )}

              {/* Content Header */}
              <StyledAdminContentHeader $variant={variant} $size={size}>
                {title && (
                  <h1
                    style={{
                      margin: 0,
                      fontSize: getToken('typography.fontSize.xl'),
                      fontWeight: getToken('typography.fontWeight.bold'),
                    }}
                  >
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p
                    style={{
                      margin: '4px 0 0 0',
                      color: getToken('colors.muted.foreground'),
                    }}
                  >
                    {subtitle}
                  </p>
                )}
              </StyledAdminContentHeader>

              {/* Content Body */}
              <StyledAdminContentBody $variant={variant} $size={size}>
                {children}
              </StyledAdminContentBody>

              {/* Content Footer */}
              <StyledAdminContentFooter $variant={variant} $size={size}>
                {/* Footer content can be added here */}
              </StyledAdminContentFooter>
            </StyledAdminContent>
          </StyledAdminMain>

          {/* Status Bar */}
          {showStatusBar && statusItems.length > 0 && (
            <StatusBar
              variant={variant}
              size={size}
              items={statusItems}
              onItemClick={handleStatusItemClick}
              {...statusBarProps}
            />
          )}

          {/* Footer */}
          {showFooter && (
            <Footer variant={variant} size={size} {...footerProps} />
          )}

          {/* Mobile Overlay */}
          <StyledAdminOverlay
            $visible={isMobileMenuOpen}
            onClick={handleMobileMenuToggle}
          />
        </StyledAdminLayout>
      </AdminLayoutContext.Provider>
    );
  }
);

AdminLayout.displayName = 'AdminLayout';

export { AdminLayout, useAdminLayoutContext };
