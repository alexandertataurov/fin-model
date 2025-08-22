import React from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import {
  DashboardProps,
  DashboardHeaderProps,
  DashboardSidebarProps,
  DashboardMainProps,
  DashboardContentProps,
} from './Dashboard.types';

const StyledDashboard = styled.div<DashboardProps>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${getToken('colors.muted.50')};
`;

const StyledDashboardContainer = styled.div<{ $hasSidebar: boolean }>`
  display: flex;
  flex: 1;

  ${({ $hasSidebar }) =>
    $hasSidebar &&
    `
    @media (max-width: 768px) {
      flex-direction: column;
    }
  `}
`;

const StyledHeader = styled.header<DashboardHeaderProps>`
  background-color: ${getToken('colors.background')};
  border-bottom: ${getToken('borderWidths.1')} solid
    ${getToken('colors.border')};
  z-index: 100;
  position: sticky;
  top: 0;
`;

const StyledSidebar = styled.aside<DashboardSidebarProps>`
  background-color: ${getToken('colors.background')};
  border-right: ${getToken('borderWidths.1')} solid ${getToken('colors.border')};
  width: ${({ collapsed }) =>
    collapsed ? getToken('space.16') : getToken('space.64')};
  transition: width ${getToken('transitionTimingFunction.easeInOut')}
    ${getToken('transitionDuration.300')};
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: ${getToken('borderWidths.1')} solid
      ${getToken('colors.border')};
  }
`;

const StyledMain = styled.main<DashboardMainProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background-color: ${getToken('colors.muted.50')};
`;

const StyledBreadcrumbContainer = styled.div`
  background-color: ${getToken('colors.background')};
  border-bottom: ${getToken('borderWidths.1')} solid
    ${getToken('colors.border')};
  padding: ${getToken('space.4')} ${getToken('space.6')};

  @media (max-width: 768px) {
    padding: ${getToken('space.3')} ${getToken('space.4')};
  }
`;

const StyledContent = styled.div<DashboardContentProps>`
  flex: 1;
  padding: ${getToken('space.6')};

  @media (max-width: 768px) {
    padding: ${getToken('space.4')};
  }
`;

export const Dashboard = React.forwardRef<HTMLDivElement, DashboardProps>(
  (
    {
      header,
      sidebar,
      breadcrumb,
      children,
      sidebarCollapsed = false,
      onSidebarToggle,
      className,
      ...props
    },
    ref
  ) => {
    const hasSidebar = !!sidebar;

    return (
      <StyledDashboard ref={ref} className={className} {...props}>
        {header && <StyledHeader>{header}</StyledHeader>}

        <StyledDashboardContainer $hasSidebar={hasSidebar}>
          {sidebar && (
            <StyledSidebar collapsed={sidebarCollapsed}>
              {sidebar}
            </StyledSidebar>
          )}

          <StyledMain>
            {breadcrumb && (
              <StyledBreadcrumbContainer>
                {breadcrumb}
              </StyledBreadcrumbContainer>
            )}

            <StyledContent>{children}</StyledContent>
          </StyledMain>
        </StyledDashboardContainer>
      </StyledDashboard>
    );
  }
);

export const DashboardHeader = React.forwardRef<
  HTMLElement,
  DashboardHeaderProps
>(({ className, children, ...props }, ref) => {
  return (
    <header ref={ref} className={className} {...props}>
      {children}
    </header>
  );
});

export const DashboardSidebar = React.forwardRef<
  HTMLElement,
  DashboardSidebarProps
>(({ collapsed = false, className, children, ...props }, ref) => {
  return (
    <aside ref={ref} collapsed={collapsed} className={className} {...props}>
      {children}
    </aside>
  );
});

export const DashboardMain = React.forwardRef<HTMLElement, DashboardMainProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <main ref={ref} className={className} {...props}>
        {children}
      </main>
    );
  }
);

export const DashboardContent = React.forwardRef<
  HTMLDivElement,
  DashboardContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
});

Dashboard.displayName = 'Dashboard';
DashboardHeader.displayName = 'DashboardHeader';
DashboardSidebar.displayName = 'DashboardSidebar';
DashboardMain.displayName = 'DashboardMain';
DashboardContent.displayName = 'DashboardContent';
