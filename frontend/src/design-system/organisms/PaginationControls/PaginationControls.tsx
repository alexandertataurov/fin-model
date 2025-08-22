import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Icon } from '../../atoms/Icon';
import { Select } from '../../molecules/Select';
import {
  PaginationControlsProps,
  PaginationControlsRef,
  PaginationControlsContextValue,
} from './PaginationControls.types';
import {
  paginationControlsVariants,
  paginationInfoVariants,
} from './PaginationControls.variants';

const PaginationControlsContext =
  React.createContext<PaginationControlsContextValue | null>(null);

const usePaginationControlsContext = () => {
  const context = React.useContext(PaginationControlsContext);
  if (!context) {
    throw new Error(
      'PaginationControls components must be used within a PaginationControls'
    );
  }
  return context;
};

const StyledPaginationControls = styled.div<{
  $variant: string;
  $size: string;
  $alignment: string;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({ $alignment }) =>
    $alignment === 'left'
      ? 'flex-start'
      : $alignment === 'center'
        ? 'center'
        : $alignment === 'right'
          ? 'flex-end'
          : 'space-between'};
  gap: ${getToken('spacing.4')};
  ${({ $variant, $size, $alignment }) =>
    paginationControlsVariants({
      variant: $variant,
      size: $size,
      alignment: $alignment,
    })}
`;

const StyledPaginationInfo = styled.div<{ $variant: string; $size: string }>`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  ${({ $variant, $size }) =>
    paginationInfoVariants({ variant: $variant, size: $size })}
`;

const StyledPaginationText = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
  white-space: nowrap;
`;

const StyledPaginationNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.1')};
`;

const StyledPaginationButton = styled.button<{
  $variant: string;
  $size: string;
  $active: boolean;
  $disabled: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${getToken('spacing.8')};
  height: ${getToken('spacing.8')};
  padding: ${getToken('spacing.1')} ${getToken('spacing.2')};
  border: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  background-color: ${({ $active }) =>
    $active ? getToken('colors.primary') : getToken('colors.background')};
  color: ${({ $active }) =>
    $active
      ? getToken('colors.primary.foreground')
      : getToken('colors.foreground')};
  border-radius: ${getToken('borderRadius.sm')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
  font-size: ${getToken('typography.fontSize.sm')};
  font-weight: ${({ $active }) =>
    $active
      ? getToken('typography.fontWeight.medium')
      : getToken('typography.fontWeight.normal')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:hover {
    background-color: ${({ $disabled, $active }) =>
      $disabled
        ? getToken('colors.background')
        : $active
          ? getToken('colors.primary')
          : getToken('colors.muted')};
    border-color: ${({ $disabled, $active }) =>
      $disabled
        ? getToken('colors.border')
        : $active
          ? getToken('colors.primary')
          : getToken('colors.border')};
  }

  &:focus {
    outline: 2px solid ${getToken('colors.primary')};
    outline-offset: 2px;
  }
`;

const StyledPaginationNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.1')};
`;

const StyledPaginationNavigationButton = styled.button<{
  $variant: string;
  $size: string;
  $disabled: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${getToken('spacing.8')};
  height: ${getToken('spacing.8')};
  border: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  background-color: ${getToken('colors.background')};
  color: ${({ $disabled }) =>
    $disabled
      ? getToken('colors.muted.foreground')
      : getToken('colors.foreground')};
  border-radius: ${getToken('borderRadius.sm')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:hover {
    background-color: ${({ $disabled }) =>
      $disabled ? getToken('colors.background') : getToken('colors.muted')};
    border-color: ${({ $disabled }) =>
      $disabled ? getToken('colors.border') : getToken('colors.border')};
  }

  &:focus {
    outline: 2px solid ${getToken('colors.primary')};
    outline-offset: 2px;
  }
`;

const StyledPaginationPageSize = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
`;

const StyledPaginationPageSizeLabel = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
  white-space: nowrap;
`;

const StyledPaginationPageSizeSelect = styled.div`
  min-width: ${getToken('spacing.20')};
`;

const StyledPaginationEllipsis = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${getToken('spacing.8')};
  height: ${getToken('spacing.8')};
  color: ${getToken('colors.muted.foreground')};
  font-size: ${getToken('typography.fontSize.sm')};
`;

const PaginationControls = React.forwardRef<
  PaginationControlsRef,
  PaginationControlsProps
>(
  (
    {
      currentPage = 1,
      totalPages = 1,
      totalItems = 0,
      pageSize = 10,
      pageSizeOptions = [10, 25, 50, 100],
      showInfo = true,
      showPageSize = true,
      showNavigation = true,
      showNumbers = true,
      maxVisiblePages = 5,
      variant = 'default',
      size = 'md',
      alignment = 'center',
      onPageChange,
      onPageSizeChange,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Calculate pagination info
    const paginationInfo = useMemo(() => {
      const startItem = (currentPage - 1) * pageSize + 1;
      const endItem = Math.min(currentPage * pageSize, totalItems);

      return {
        startItem,
        endItem,
        totalItems,
        currentPage,
        totalPages,
        pageSize,
      };
    }, [currentPage, totalPages, totalItems, pageSize]);

    // Generate page numbers to display
    const visiblePages = useMemo(() => {
      if (!showNumbers || totalPages <= 1) return [];

      const pages: (number | 'ellipsis')[] = [];
      const halfVisible = Math.floor(maxVisiblePages / 2);

      if (totalPages <= maxVisiblePages) {
        // Show all pages
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages with ellipsis
        if (currentPage <= halfVisible + 1) {
          // Near start
          for (let i = 1; i <= maxVisiblePages - 1; i++) {
            pages.push(i);
          }
          pages.push('ellipsis');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - halfVisible) {
          // Near end
          pages.push(1);
          pages.push('ellipsis');
          for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          // In middle
          pages.push(1);
          pages.push('ellipsis');
          for (
            let i = currentPage - halfVisible;
            i <= currentPage + halfVisible;
            i++
          ) {
            pages.push(i);
          }
          pages.push('ellipsis');
          pages.push(totalPages);
        }
      }

      return pages;
    }, [currentPage, totalPages, showNumbers, maxVisiblePages]);

    // Handle page change
    const handlePageChange = useCallback(
      (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
          onPageChange?.(page);
        }
      },
      [currentPage, totalPages, onPageChange]
    );

    // Handle page size change
    const handlePageSizeChange = useCallback(
      (newPageSize: number) => {
        if (newPageSize !== pageSize) {
          onPageSizeChange?.(newPageSize);
        }
      },
      [pageSize, onPageSizeChange]
    );

    // Navigation handlers
    const handleFirstPage = useCallback(() => {
      handlePageChange(1);
    }, [handlePageChange]);

    const handlePreviousPage = useCallback(() => {
      handlePageChange(currentPage - 1);
    }, [currentPage, handlePageChange]);

    const handleNextPage = useCallback(() => {
      handlePageChange(currentPage + 1);
    }, [currentPage, handlePageChange]);

    const handleLastPage = useCallback(() => {
      handlePageChange(totalPages);
    }, [totalPages, handlePageChange]);

    const contextValue: PaginationControlsContextValue = {
      currentPage,
      totalPages,
      totalItems,
      pageSize,
      paginationInfo,
      visiblePages,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
      onFirstPage: handleFirstPage,
      onPreviousPage: handlePreviousPage,
      onNextPage: handleNextPage,
      onLastPage: handleLastPage,
      variant,
      size,
    };

    return (
      <PaginationControlsContext.Provider value={contextValue}>
        <StyledPaginationControls
          ref={ref}
          $variant={variant}
          $size={size}
          $alignment={alignment}
          className={className}
          style={style}
          {...props}
        >
          {/* Pagination Info */}
          {showInfo && (
            <StyledPaginationInfo $variant={variant} $size={size}>
              <StyledPaginationText>
                Showing {paginationInfo.startItem} to {paginationInfo.endItem}{' '}
                of {paginationInfo.totalItems} results
              </StyledPaginationText>
            </StyledPaginationInfo>
          )}

          {/* Page Size Selector */}
          {showPageSize && (
            <StyledPaginationPageSize>
              <StyledPaginationPageSizeLabel>
                Show:
              </StyledPaginationPageSizeLabel>
              <StyledPaginationPageSizeSelect>
                <Select
                  value={pageSize.toString()}
                  onChange={value => handlePageSizeChange(parseInt(value))}
                  options={pageSizeOptions.map(size => ({
                    value: size.toString(),
                    label: size.toString(),
                  }))}
                  variant={variant}
                  size={size}
                />
              </StyledPaginationPageSizeSelect>
            </StyledPaginationPageSize>
          )}

          {/* Navigation Controls */}
          {showNavigation && (
            <StyledPaginationNavigation>
              {/* First Page */}
              <StyledPaginationNavigationButton
                $variant={variant}
                $size={size}
                $disabled={currentPage === 1}
                onClick={handleFirstPage}
                aria-label="Go to first page"
              >
                <Icon name="chevrons-left" size="sm" />
              </StyledPaginationNavigationButton>

              {/* Previous Page */}
              <StyledPaginationNavigationButton
                $variant={variant}
                $size={size}
                $disabled={currentPage === 1}
                onClick={handlePreviousPage}
                aria-label="Go to previous page"
              >
                <Icon name="chevron-left" size="sm" />
              </StyledPaginationNavigationButton>

              {/* Page Numbers */}
              {showNumbers && (
                <StyledPaginationNumbers>
                  {visiblePages.map((page, index) => (
                    <React.Fragment key={index}>
                      {page === 'ellipsis' ? (
                        <StyledPaginationEllipsis>...</StyledPaginationEllipsis>
                      ) : (
                        <StyledPaginationButton
                          $variant={variant}
                          $size={size}
                          $active={page === currentPage}
                          $disabled={false}
                          onClick={() => handlePageChange(page)}
                          aria-label={`Go to page ${page}`}
                          aria-current={
                            page === currentPage ? 'page' : undefined
                          }
                        >
                          {page}
                        </StyledPaginationButton>
                      )}
                    </React.Fragment>
                  ))}
                </StyledPaginationNumbers>
              )}

              {/* Next Page */}
              <StyledPaginationNavigationButton
                $variant={variant}
                $size={size}
                $disabled={currentPage === totalPages}
                onClick={handleNextPage}
                aria-label="Go to next page"
              >
                <Icon name="chevron-right" size="sm" />
              </StyledPaginationNavigationButton>

              {/* Last Page */}
              <StyledPaginationNavigationButton
                $variant={variant}
                $size={size}
                $disabled={currentPage === totalPages}
                onClick={handleLastPage}
                aria-label="Go to last page"
              >
                <Icon name="chevrons-right" size="sm" />
              </StyledPaginationNavigationButton>
            </StyledPaginationNavigation>
          )}

          {children}
        </StyledPaginationControls>
      </PaginationControlsContext.Provider>
    );
  }
);

PaginationControls.displayName = 'PaginationControls';

export { PaginationControls, usePaginationControlsContext };
