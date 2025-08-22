import React from 'react';
import { cn } from '../../../utils/cn'; // Assuming cn is available
import { Icon } from '../../atoms'; // Import Icon atom
// Keep for Icon atom usage

import {
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
} from './Breadcrumb.types';
import {
  breadcrumbVariants,
  breadcrumbListVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbSeparatorVariants,
} from './Breadcrumb.variants';

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      separator = <Icon name="ChevronRight" size="sm" />,
      size = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        className={cn(breadcrumbVariants({ size }), className)}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className={cn(breadcrumbListVariants())}>
          {React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) return child;

            return (
              <React.Fragment key={index}>
                {child}
                {index < React.Children.count(children) - 1 && (
                  <span className={cn(breadcrumbSeparatorVariants())}>
                    {separator}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  BreadcrumbItemProps
>(({ current = false, className, children, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn(breadcrumbItemVariants(), className)}
      {...props}
    >
      {children}
    </li>
  );
});

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  BreadcrumbLinkProps
>(({ current = false, className, children, ...props }, ref) => {
  return (
    <a
      ref={ref}
      className={cn(breadcrumbLinkVariants({ current }), className)}
      aria-current={current ? 'page' : undefined}
      {...props}
    >
      {children}
    </a>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
BreadcrumbItem.displayName = 'BreadcrumbItem';
BreadcrumbLink.displayName = 'BreadcrumbLink';
