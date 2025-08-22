import React from 'react';
import { cn } from '../../../utils/cn';
import { Icon } from '../../atoms'; // Import Icon atom



import {
  PaginationProps,
  PaginationItemProps,
  PaginationLinkProps,
} from './Pagination.types';
import {
  paginationVariants,
  paginationListVariants,
  paginationItemVariants,
  paginationLinkVariants,
  paginationEllipsisVariants,
} from './Pagination.variants';

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      size = 'md',
      variant = 'default',
      showFirstLast = true,
      showPrevNext = true,
      maxVisiblePages = 5,
      className,
      ...props
    },
    ref
  ) => {
    const getVisiblePages = () => {
      const pages: (number | string)[] = [];
      const halfVisible = Math.floor(maxVisiblePages / 2);

      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages, currentPage + halfVisible);

      // Adjust start and end to show maxVisiblePages
      if (end - start + 1 < maxVisiblePages) {
        if (start === 1) {
          end = Math.min(totalPages, start + maxVisiblePages - 1);
        } else {
          start = Math.max(1, end - maxVisiblePages + 1);
        }
      }

      // Add first page and ellipsis
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add last page and ellipsis
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }

      return pages;
    };

    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    };

    const visiblePages = getVisiblePages();

    return (
      <nav
        ref={ref}
        className={cn(paginationVariants({ size, variant }), className)}
        aria-label="Pagination"
        {...props}
      >
        <ul className={cn(paginationListVariants())}>
          {showFirstLast && (
            <li className={cn(paginationItemVariants())}>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                aria-label="Go to first page"
                className={cn(
                  paginationLinkVariants({ disabled: currentPage === 1 })
                )}
              >
                <Icon name="ChevronsLeft" size="sm" />
              </button>
            </li>
          )}

          {showPrevNext && (
            <li className={cn(paginationItemVariants())}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
                className={cn(
                  paginationLinkVariants({ disabled: currentPage === 1 })
                )}
              >
                <Icon name="ChevronLeft" size="sm" />
              </button>
            </li>
          )}

          {visiblePages.map((page, index) => (
            <li key={index} className={cn(paginationItemVariants())}>
              {page === '...' ? (
                <span className={cn(paginationEllipsisVariants())}>...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  className={cn(
                    paginationLinkVariants({ active: page === currentPage })
                  )}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          {showPrevNext && (
            <li className={cn(paginationItemVariants())}>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
                className={cn(
                  paginationLinkVariants({
                    disabled: currentPage === totalPages,
                  })
                )}
              >
                <Icon name="ChevronRight" size="sm" />
              </button>
            </li>
          )}

          {showFirstLast && (
            <li className={cn(paginationItemVariants())}>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Go to last page"
                className={cn(
                  paginationLinkVariants({
                    disabled: currentPage === totalPages,
                  })
                )}
              >
                <Icon name="ChevronsRight" size="sm" />
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  }
);

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  PaginationItemProps
>(
  (
    { active = false, disabled = false, className, children, ...props },
    ref
  ) => {
    return (
      <li
        ref={ref}
        className={cn(paginationItemVariants(), className)}
        {...props}
      >
        {children}
      </li>
    );
  }
);

export const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(
  (
    { active = false, disabled = false, className, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(paginationLinkVariants({ active, disabled }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Pagination.displayName = 'Pagination';
PaginationItem.displayName = 'PaginationItem';
PaginationLink.displayName = 'PaginationLink';
