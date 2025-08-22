import React from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import {
  BaseLayoutProps,
  BaseLayoutHeaderProps,
  BaseLayoutSidebarProps,
  BaseLayoutMainProps,
  BaseLayoutFooterProps,
} from './BaseLayout.types';

const StyledBaseLayout = styled.div<BaseLayoutProps>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${getToken('colors.background')};

  ${({ variant = 'default' }) => {
    const variants = {
      default: '',
      minimal: `
        background-color: ${getToken('colors.muted.50')};
      `,
      dashboard: `
        background-color: ${getToken('colors.muted.50')};
      `,
      landing: `
        background-color: ${getToken('colors.background')};
      `,
    };
    return variants[variant];
  }}
`;

const StyledLayoutContainer = styled.div<{ $hasSidebar: boolean }>`
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

const StyledHeader = styled.header<BaseLayoutHeaderProps>`
  background-color: ${getToken('colors.background')};
  border-bottom: ${getToken('borderWidths.1')} solid
    ${getToken('colors.border')};
  z-index: 100;
  position: sticky;
  top: 0;
`;

const StyledSidebar = styled.aside<BaseLayoutSidebarProps>`
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

const StyledMain = styled.main<BaseLayoutMainProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background-color: ${getToken('colors.background')};
`;

const StyledMainContent = styled.div`
  flex: 1;
  padding: ${getToken('space.6')};

  @media (max-width: 768px) {
    padding: ${getToken('space.4')};
  }
`;

const StyledFooter = styled.footer<BaseLayoutFooterProps>`
  background-color: ${getToken('colors.background')};
  border-top: ${getToken('borderWidths.1')} solid ${getToken('colors.border')};
  margin-top: auto;
`;

export const BaseLayout = React.forwardRef<HTMLDivElement, BaseLayoutProps>(
  (
    {
      header,
      sidebar,
      footer,
      children,
      variant = 'default',
      sidebarCollapsed = false,
      onSidebarToggle,
      className,
      ...props
    },
    ref
  ) => {
    const hasSidebar = !!sidebar;

    return (
      <StyledBaseLayout
        ref={ref}
        variant={variant}
        className={className}
        {...props}
      >
        {header && <StyledHeader>{header}</StyledHeader>}

        <StyledLayoutContainer $hasSidebar={hasSidebar}>
          {sidebar && (
            <StyledSidebar collapsed={sidebarCollapsed}>
              {sidebar}
            </StyledSidebar>
          )}

          <StyledMain>
            <StyledMainContent>{children}</StyledMainContent>
          </StyledMain>
        </StyledLayoutContainer>

        {footer && <StyledFooter>{footer}</StyledFooter>}
      </StyledBaseLayout>
    );
  }
);

export const BaseLayoutHeader = React.forwardRef<
  HTMLElement,
  BaseLayoutHeaderProps
>(({ className, children, ...props }, ref) => {
  return (
    <header ref={ref} className={className} {...props}>
      {children}
    </header>
  );
});

export const BaseLayoutSidebar = React.forwardRef<
  HTMLElement,
  BaseLayoutSidebarProps
>(({ collapsed = false, className, children, ...props }, ref) => {
  return (
    <aside ref={ref} collapsed={collapsed} className={className} {...props}>
      {children}
    </aside>
  );
});

export const BaseLayoutMain = React.forwardRef<
  HTMLElement,
  BaseLayoutMainProps
>(({ className, children, ...props }, ref) => {
  return (
    <main ref={ref} className={className} {...props}>
      {children}
    </main>
  );
});

export const BaseLayoutFooter = React.forwardRef<
  HTMLElement,
  BaseLayoutFooterProps
>(({ className, children, ...props }, ref) => {
  return (
    <footer ref={ref} className={className} {...props}>
      {children}
    </footer>
  );
});

BaseLayout.displayName = 'BaseLayout';
BaseLayoutHeader.displayName = 'BaseLayoutHeader';
BaseLayoutSidebar.displayName = 'BaseLayoutSidebar';
BaseLayoutMain.displayName = 'BaseLayoutMain';
BaseLayoutFooter.displayName = 'BaseLayoutFooter';
