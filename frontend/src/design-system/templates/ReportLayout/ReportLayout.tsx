import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';
import { BreadcrumbNav } from '../../organisms/BreadcrumbNav';
import { FilterPanel } from '../../organisms/FilterPanel';
import { ActionBar } from '../../organisms/ActionBar';
import { PaginationControls } from '../../organisms/PaginationControls';
import {
  ReportLayoutProps,
  ReportLayoutRef,
  ReportLayoutContextValue,
} from './ReportLayout.types';
import {
  reportLayoutVariants,
  reportContentVariants,
} from './ReportLayout.variants';

const ReportLayoutContext =
  React.createContext<ReportLayoutContextValue | null>(null);

const useReportLayoutContext = () => {
  const context = React.useContext(ReportLayoutContext);
  if (!context) {
    throw new Error(
      'ReportLayout components must be used within a ReportLayout'
    );
  }
  return context;
};

const StyledReportLayout = styled.div<{
  $variant: string;
  $size: string;
  $sidebarCollapsed: boolean;
}>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  ${({ $variant, $size, $sidebarCollapsed }) =>
    reportLayoutVariants({
      variant: $variant,
      size: $size,
      sidebarCollapsed: $sidebarCollapsed,
    })}
`;

const StyledReportHeader = styled.header<{ $variant: string; $size: string }>`
  flex-shrink: 0;
  z-index: 20;
  border-bottom: ${getToken('borderWidth.sm')} solid
    ${getToken('colors.border')};
  background-color: ${getToken('colors.background')};
`;

const StyledReportMain = styled.main<{
  $variant: string;
  $size: string;
  $sidebarCollapsed: boolean;
}>`
  flex: 1;
  display: flex;
  min-height: 0;
`;

const StyledReportSidebar = styled.aside<{
  $variant: string;
  $size: string;
  $collapsed: boolean;
}>`
  flex-shrink: 0;
  width: ${({ $collapsed }) =>
    $collapsed ? getToken('spacing.16') : getToken('spacing.80')};
  background-color: ${getToken('colors.background')};
  border-right: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  transition: width ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
  overflow: hidden;
  z-index: 15;
`;

const StyledReportContent = styled.div<{
  $variant: string;
  $size: string;
  $sidebarCollapsed: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  ${({ $variant, $size, $sidebarCollapsed }) =>
    reportContentVariants({
      variant: $variant,
      size: $size,
      sidebarCollapsed: $sidebarCollapsed,
    })}
`;

const StyledReportContentHeader = styled.div<{
  $variant: string;
  $size: string;
}>`
  flex-shrink: 0;
  padding: ${getToken('spacing.4')};
  background-color: ${getToken('colors.background')};
  border-bottom: ${getToken('borderWidth.sm')} solid
    ${getToken('colors.border')};
`;

const StyledReportContentBody = styled.div<{ $variant: string; $size: string }>`
  flex: 1;
  padding: ${getToken('spacing.6')};
  overflow: auto;
  background-color: ${getToken('colors.muted')};
`;

const StyledReportContentFooter = styled.div<{
  $variant: string;
  $size: string;
}>`
  flex-shrink: 0;
  padding: ${getToken('spacing.4')};
  background-color: ${getToken('colors.background')};
  border-top: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
`;

const StyledReportSidebarToggle = styled.button<{
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

const StyledReportBreadcrumb = styled.div<{ $variant: string; $size: string }>`
  margin-bottom: ${getToken('spacing.4')};
`;

const StyledReportTitle = styled.h1<{ $variant: string; $size: string }>`
  font-size: ${getToken('typography.fontSize.2xl')};
  font-weight: ${getToken('typography.fontWeight.bold')};
  color: ${getToken('colors.foreground')};
  margin: 0 0 ${getToken('spacing.2')} 0;
`;

const StyledReportSubtitle = styled.p<{ $variant: string; $size: string }>`
  font-size: ${getToken('typography.fontSize.base')};
  color: ${getToken('colors.muted.foreground')};
  margin: 0;
  line-height: ${getToken('typography.lineHeight.relaxed')};
`;

const StyledReportMeta = styled.div<{ $variant: string; $size: string }>`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.4')};
  margin-top: ${getToken('spacing.3')};
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
`;

const StyledReportMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.1')};
`;

const StyledReportOverlay = styled.div<{ $visible: boolean }>`
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

const ReportLayout = React.forwardRef<ReportLayoutRef, ReportLayoutProps>(
  (
    {
      title,
      subtitle,
      logo,
      logoText,
      breadcrumbItems = [],
      filterItems = [],
      actions = [],
      pagination,
      variant = 'default',
      size = 'md',
      sidebarCollapsed = false,
      showHeader = true,
      showFooter = true,
      showSidebar = true,
      showBreadcrumb = true,
      showFilters = true,
      showActions = true,
      showPagination = true,
      headerProps,
      footerProps,
      filterPanelProps,
      actionBarProps,
      paginationProps,
      onSidebarToggle,
      onLogoClick,
      onBreadcrumbItemClick,
      onFilterChange,
      onActionClick,
      onPaginationChange,
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

    // Handle breadcrumb item click
    const handleBreadcrumbItemClick = useCallback(
      (item: any) => {
        onBreadcrumbItemClick?.(item);
      },
      [onBreadcrumbItemClick]
    );

    // Handle filter change
    const handleFilterChange = useCallback(
      (filters: any) => {
        onFilterChange?.(filters);
      },
      [onFilterChange]
    );

    // Handle action click
    const handleActionClick = useCallback(
      (action: any) => {
        onActionClick?.(action);
      },
      [onActionClick]
    );

    // Handle pagination change
    const handlePaginationChange = useCallback(
      (page: number) => {
        onPaginationChange?.(page);
      },
      [onPaginationChange]
    );

    const contextValue: ReportLayoutContextValue = {
      title,
      subtitle,
      logo,
      logoText,
      breadcrumbItems,
      filterItems,
      actions,
      pagination,
      variant,
      size,
      sidebarCollapsed: isSidebarCollapsed,
      mobileMenuOpen: isMobileMenuOpen,
      onSidebarToggle: handleSidebarToggle,
      onMobileMenuToggle: handleMobileMenuToggle,
      onLogoClick: handleLogoClick,
      onBreadcrumbItemClick: handleBreadcrumbItemClick,
      onFilterChange: handleFilterChange,
      onActionClick: handleActionClick,
      onPaginationChange: handlePaginationChange,
    };

    return (
      <ReportLayoutContext.Provider value={contextValue}>
        <StyledReportLayout
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
            <StyledReportHeader $variant={variant} $size={size}>
              <Header
                variant={variant}
                size={size}
                logo={logo}
                logoText={logoText}
                onLogoClick={handleLogoClick}
                {...headerProps}
              />
            </StyledReportHeader>
          )}

          {/* Main Content */}
          <StyledReportMain
            $variant={variant}
            $size={size}
            $sidebarCollapsed={isSidebarCollapsed}
          >
            {/* Sidebar */}
            {showSidebar && (
              <StyledReportSidebar
                $variant={variant}
                $size={size}
                $collapsed={isSidebarCollapsed}
              >
                {showFilters && (
                  <FilterPanel
                    variant={variant}
                    size={size}
                    items={filterItems}
                    collapsed={isSidebarCollapsed}
                    onFilterChange={handleFilterChange}
                    {...filterPanelProps}
                  />
                )}

                <StyledReportSidebarToggle
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
                </StyledReportSidebarToggle>
              </StyledReportSidebar>
            )}

            {/* Content Area */}
            <StyledReportContent
              $variant={variant}
              $size={size}
              $sidebarCollapsed={isSidebarCollapsed}
            >
              {/* Action Bar */}
              {showActions && actions.length > 0 && (
                <ActionBar
                  variant={variant}
                  size={size}
                  actions={actions}
                  onActionClick={handleActionClick}
                  {...actionBarProps}
                />
              )}

              {/* Content Header */}
              <StyledReportContentHeader $variant={variant} $size={size}>
                {/* Breadcrumb */}
                {showBreadcrumb && breadcrumbItems.length > 0 && (
                  <StyledReportBreadcrumb $variant={variant} $size={size}>
                    <BreadcrumbNav
                      variant={variant}
                      size={size}
                      items={breadcrumbItems}
                      onItemClick={handleBreadcrumbItemClick}
                    />
                  </StyledReportBreadcrumb>
                )}

                {/* Title and Subtitle */}
                {title && (
                  <StyledReportTitle $variant={variant} $size={size}>
                    {title}
                  </StyledReportTitle>
                )}

                {subtitle && (
                  <StyledReportSubtitle $variant={variant} $size={size}>
                    {subtitle}
                  </StyledReportSubtitle>
                )}

                {/* Meta Information */}
                <StyledReportMeta $variant={variant} $size={size}>
                  <StyledReportMetaItem>
                    <Icon name="calendar" size="sm" />
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                  </StyledReportMetaItem>

                  <StyledReportMetaItem>
                    <Icon name="users" size="sm" />
                    <span>Generated by: System</span>
                  </StyledReportMetaItem>
                </StyledReportMeta>
              </StyledReportContentHeader>

              {/* Content Body */}
              <StyledReportContentBody $variant={variant} $size={size}>
                {children}
              </StyledReportContentBody>

              {/* Content Footer */}
              <StyledReportContentFooter $variant={variant} $size={size}>
                {/* Pagination */}
                {showPagination && pagination && (
                  <PaginationControls
                    variant={variant}
                    size={size}
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    pageSize={pagination.pageSize}
                    onPageChange={handlePaginationChange}
                    {...paginationProps}
                  />
                )}
              </StyledReportContentFooter>
            </StyledReportContent>
          </StyledReportMain>

          {/* Footer */}
          {showFooter && (
            <Footer variant={variant} size={size} {...footerProps} />
          )}

          {/* Mobile Overlay */}
          <StyledReportOverlay
            $visible={isMobileMenuOpen}
            onClick={handleMobileMenuToggle}
          />
        </StyledReportLayout>
      </ReportLayoutContext.Provider>
    );
  }
);

ReportLayout.displayName = 'ReportLayout';

export { ReportLayout, useReportLayoutContext };
