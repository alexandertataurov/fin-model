import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';
import { DataTable } from '../../organisms/DataTable';
import { SearchBar } from '../../organisms/SearchBar';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import {
  ListLayoutProps,
  ListLayoutRef,
  ListLayoutContextValue,
} from './ListLayout.types';
import {
  listLayoutVariants,
  listLayoutMainVariants,
  listLayoutSidebarVariants,
} from './ListLayout.variants';

const ListLayoutContext = React.createContext<ListLayoutContextValue | null>(
  null
);

const useListLayoutContext = () => {
  const context = React.useContext(ListLayoutContext);
  if (!context) {
    throw new Error('ListLayout components must be used within a ListLayout');
  }
  return context;
};

const StyledListLayout = styled.div<{
  $variant: string;
  $size: string;
  $hasSidebar: boolean;
}>`
  display: flex;
  min-height: 100vh;
  ${({ $variant, $size, $hasSidebar }) =>
    listLayoutVariants({
      variant: $variant,
      size: $size,
      hasSidebar: $hasSidebar,
    })}
`;

const StyledListLayoutMain = styled.main<{
  $variant: string;
  $size: string;
  $hasSidebar: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  ${({ $variant, $size, $hasSidebar }) =>
    listLayoutMainVariants({
      variant: $variant,
      size: $size,
      hasSidebar: $hasSidebar,
    })}
`;

const StyledListLayoutContent = styled.div`
  flex: 1;
  padding: ${getToken('spacing.6')};
  overflow-y: auto;
`;

const StyledListLayoutSidebar = styled.aside<{
  $variant: string;
  $size: string;
}>`
  ${({ $variant, $size }) =>
    listLayoutSidebarVariants({ variant: $variant, size: $size })}
`;

const StyledListLayoutBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  margin-bottom: ${getToken('spacing.6')};
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
`;

const StyledListLayoutPageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${getToken('spacing.6')};
  gap: ${getToken('spacing.4')};
`;

const StyledListLayoutPageTitle = styled.div`
  font-size: ${getToken('typography.fontSize.2xl')};
  font-weight: ${getToken('typography.fontWeight.bold')};
  color: ${getToken('colors.foreground')};
`;

const StyledListLayoutPageActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
`;

const StyledListLayoutSearchSection = styled.div`
  margin-bottom: ${getToken('spacing.6')};
`;

const StyledListLayoutTableSection = styled.div`
  flex: 1;
`;

const StyledListLayoutSidebarContent = styled.div`
  padding: ${getToken('spacing.6')};
  height: 100%;
  overflow-y: auto;
`;

const StyledListLayoutSidebarSection = styled.div`
  margin-bottom: ${getToken('spacing.6')};

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledListLayoutSidebarTitle = styled.h3`
  font-size: ${getToken('typography.fontSize.lg')};
  font-weight: ${getToken('typography.fontWeight.semibold')};
  color: ${getToken('colors.foreground')};
  margin-bottom: ${getToken('spacing.3')};
`;

const ListLayout = React.forwardRef<ListLayoutRef, ListLayoutProps>(
  (
    {
      header,
      footer,
      dataTable,
      searchBar,
      sidebar,
      title,
      breadcrumb,
      actions = [],
      variant = 'default',
      size = 'md',
      onSearch,
      onFilterChange,
      onActionClick,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    // Handle search
    const handleSearch = useCallback(
      (value: string, filters: string[]) => {
        setSearchTerm(value);
        setActiveFilters(filters);
        onSearch?.(value, filters);
      },
      [onSearch]
    );

    // Handle filter change
    const handleFilterChange = useCallback(
      (filters: string[]) => {
        setActiveFilters(filters);
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

    const contextValue: ListLayoutContextValue = {
      searchTerm,
      activeFilters,
      onSearch: handleSearch,
      onFilterChange: handleFilterChange,
      onActionClick: handleActionClick,
      variant,
      size,
    };

    return (
      <ListLayoutContext.Provider value={contextValue}>
        <StyledListLayout
          ref={ref}
          $variant={variant}
          $size={size}
          $hasSidebar={!!sidebar}
          className={className}
          style={style}
          {...props}
        >
          {/* Header */}
          {header && (
            <Header
              {...header.props}
              variant={header.props.variant || variant}
              size={header.props.size || size}
            >
              {header.props.children}
            </Header>
          )}

          {/* Main Content */}
          <StyledListLayoutMain
            $variant={variant}
            $size={size}
            $hasSidebar={!!sidebar}
          >
            {/* Content */}
            <StyledListLayoutContent>
              {/* Breadcrumb */}
              {breadcrumb && (
                <StyledListLayoutBreadcrumb>
                  {breadcrumb.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Icon name="chevron-right" size="sm" />}
                      <span>{item}</span>
                    </React.Fragment>
                  ))}
                </StyledListLayoutBreadcrumb>
              )}

              {/* Page Header */}
              {(title || actions.length > 0) && (
                <StyledListLayoutPageHeader>
                  {title && (
                    <StyledListLayoutPageTitle>
                      {title}
                    </StyledListLayoutPageTitle>
                  )}

                  {actions.length > 0 && (
                    <StyledListLayoutPageActions>
                      {actions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.variant || 'default'}
                          size={size}
                          onClick={() => handleActionClick(action)}
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
                    </StyledListLayoutPageActions>
                  )}
                </StyledListLayoutPageHeader>
              )}

              {/* Search Section */}
              {searchBar && (
                <StyledListLayoutSearchSection>
                  <SearchBar
                    {...searchBar.props}
                    variant={searchBar.props.variant || variant}
                    size={searchBar.props.size || size}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                  >
                    {searchBar.props.children}
                  </SearchBar>
                </StyledListLayoutSearchSection>
              )}

              {/* Table Section */}
              {dataTable && (
                <StyledListLayoutTableSection>
                  <DataTable
                    {...dataTable.props}
                    variant={dataTable.props.variant || variant}
                    size={dataTable.props.size || size}
                  >
                    {dataTable.props.children}
                  </DataTable>
                </StyledListLayoutTableSection>
              )}

              {children}
            </StyledListLayoutContent>

            {/* Sidebar */}
            {sidebar && (
              <StyledListLayoutSidebar $variant={variant} $size={size}>
                <StyledListLayoutSidebarContent>
                  {sidebar.map((section, index) => (
                    <StyledListLayoutSidebarSection key={index}>
                      {section.title && (
                        <StyledListLayoutSidebarTitle>
                          {section.title}
                        </StyledListLayoutSidebarTitle>
                      )}
                      {section.content}
                    </StyledListLayoutSidebarSection>
                  ))}
                </StyledListLayoutSidebarContent>
              </StyledListLayoutSidebar>
            )}
          </StyledListLayoutMain>

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
        </StyledListLayout>
      </ListLayoutContext.Provider>
    );
  }
);

ListLayout.displayName = 'ListLayout';

export { ListLayout, useListLayoutContext };
