import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import {
  DashboardLayoutProps,
  DashboardLayoutRef,
  DashboardLayoutContextValue,
} from './DashboardLayout.types';
import {
  dashboardLayoutVariants,
  dashboardLayoutMainVariants,
  dashboardLayoutSidebarVariants,
} from './DashboardLayout.variants';

const DashboardLayoutContext =
  React.createContext<DashboardLayoutContextValue | null>(null);

const useDashboardLayoutContext = () => {
  const context = React.useContext(DashboardLayoutContext);
  if (!context) {
    throw new Error(
      'DashboardLayout components must be used within a DashboardLayout'
    );
  }
  return context;
};

const StyledDashboardLayout = styled.div<{
  $variant: string;
  $size: string;
  $sidebarCollapsed: boolean;
}>`
  display: flex;
  min-height: 100vh;
  ${({ $variant, $size, $sidebarCollapsed }) =>
    dashboardLayoutVariants({
      variant: $variant,
      size: $size,
      sidebarCollapsed: $sidebarCollapsed,
    })}
`;

const StyledDashboardLayoutSidebar = styled.aside<{
  $variant: string;
  $size: string;
  $collapsed: boolean;
}>`
  ${({ $variant, $size, $collapsed }) =>
    dashboardLayoutSidebarVariants({
      variant: $variant,
      size: $size,
      collapsed: $collapsed,
    })}
`;

const StyledDashboardLayoutMain = styled.main<{
  $variant: string;
  $size: string;
  $sidebarCollapsed: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  ${({ $variant, $size, $sidebarCollapsed }) =>
    dashboardLayoutMainVariants({
      variant: $variant,
      size: $size,
      sidebarCollapsed: $sidebarCollapsed,
    })}
`;

const StyledDashboardLayoutContent = styled.div`
  flex: 1;
  padding: ${getToken('spacing.6')};
  overflow-y: auto;
`;

const StyledDashboardLayoutBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  margin-bottom: ${getToken('spacing.6')};
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
`;

const StyledDashboardLayoutPageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${getToken('spacing.6')};
  gap: ${getToken('spacing.4')};
`;

const StyledDashboardLayoutPageTitle = styled.div`
  font-size: ${getToken('typography.fontSize.2xl')};
  font-weight: ${getToken('typography.fontWeight.bold')};
  color: ${getToken('colors.foreground')};
`;

const StyledDashboardLayoutPageActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
`;

const StyledDashboardLayoutToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${getToken('spacing.10')};
  height: ${getToken('spacing.10')};
  border: none;
  background: ${getToken('colors.muted')};
  border-radius: ${getToken('borderRadius.md')};
  color: ${getToken('colors.muted.foreground')};
  cursor: pointer;
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};

  &:hover {
    background: ${getToken('colors.muted.hover')};
    color: ${getToken('colors.foreground')};
  }
`;

const DashboardLayout = React.forwardRef<
  DashboardLayoutRef,
  DashboardLayoutProps
>(
  (
    {
      header,
      sidebar,
      footer,
      title,
      breadcrumb,
      actions = [],
      variant = 'default',
      size = 'md',
      sidebarCollapsed = false,
      onSidebarToggle,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] =
      useState(sidebarCollapsed);

    // Handle sidebar toggle
    const handleSidebarToggle = useCallback(() => {
      const newCollapsed = !isSidebarCollapsed;
      setIsSidebarCollapsed(newCollapsed);
      onSidebarToggle?.(newCollapsed);
    }, [isSidebarCollapsed, onSidebarToggle]);

    const contextValue: DashboardLayoutContextValue = {
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      variant,
      size,
      onSidebarToggle: handleSidebarToggle,
    };

    return (
      <DashboardLayoutContext.Provider value={contextValue}>
        <StyledDashboardLayout
          ref={ref}
          $variant={variant}
          $size={size}
          $sidebarCollapsed={isSidebarCollapsed}
          className={className}
          style={style}
          {...props}
        >
          {/* Sidebar */}
          {sidebar && (
            <StyledDashboardLayoutSidebar
              $variant={variant}
              $size={size}
              $collapsed={isSidebarCollapsed}
            >
              {React.cloneElement(sidebar, {
                collapsed: isSidebarCollapsed,
                onToggle: handleSidebarToggle,
              })}
            </StyledDashboardLayoutSidebar>
          )}

          {/* Main Content */}
          <StyledDashboardLayoutMain
            $variant={variant}
            $size={size}
            $sidebarCollapsed={isSidebarCollapsed}
          >
            {/* Header */}
            {header && (
              <Header
                {...header.props}
                variant={header.props.variant || variant}
                size={header.props.size || size}
              >
                {header.props.children}
                <HeaderActions>
                  <StyledDashboardLayoutToggleButton
                    onClick={handleSidebarToggle}
                    aria-label={
                      isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                    }
                  >
                    <Icon
                      name={
                        isSidebarCollapsed
                          ? 'panel-right-open'
                          : 'panel-left-close'
                      }
                      size="md"
                    />
                  </StyledDashboardLayoutToggleButton>
                </HeaderActions>
              </Header>
            )}

            {/* Content */}
            <StyledDashboardLayoutContent>
              {/* Breadcrumb */}
              {breadcrumb && (
                <StyledDashboardLayoutBreadcrumb>
                  {breadcrumb.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Icon name="chevron-right" size="sm" />}
                      <span>{item}</span>
                    </React.Fragment>
                  ))}
                </StyledDashboardLayoutBreadcrumb>
              )}

              {/* Page Header */}
              {(title || actions.length > 0) && (
                <StyledDashboardLayoutPageHeader>
                  {title && (
                    <StyledDashboardLayoutPageTitle>
                      {title}
                    </StyledDashboardLayoutPageTitle>
                  )}

                  {actions.length > 0 && (
                    <StyledDashboardLayoutPageActions>
                      {actions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.variant || 'default'}
                          size={size}
                          onClick={action.onClick}
                          disabled={action.disabled}
                        >
                          {action.icon && <Icon name={action.icon} size="sm" />}
                          {action.label}
                          {action.badge && (
                            <Badge variant={action.badge.variant} size="sm">
                              {action.badge.text}
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </StyledDashboardLayoutPageActions>
                  )}
                </StyledDashboardLayoutPageHeader>
              )}

              {/* Page Content */}
              {children}
            </StyledDashboardLayoutContent>

            {/* Footer */}
            {footer && (
              <Footer
                {...footer.props}
                variant={footer.props.variant || variant}
                size={footer.props.size || size}
              >
                {footer.props.children}
              </Footer>
            )}
          </StyledDashboardLayoutMain>
        </StyledDashboardLayout>
      </DashboardLayoutContext.Provider>
    );
  }
);

DashboardLayout.displayName = 'DashboardLayout';

export { DashboardLayout, useDashboardLayoutContext };
