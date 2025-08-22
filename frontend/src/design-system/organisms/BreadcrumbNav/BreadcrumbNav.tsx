import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../../utils/cn';
import { useDesignTokens } from '../../../hooks/useDesignTokens';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import {
  BreadcrumbNavProps,
  BreadcrumbNavRef,
  BreadcrumbNavContextValue,
  BreadcrumbItem,
} from './BreadcrumbNav.types';
import {
  breadcrumbNavVariants,
  breadcrumbItemVariants,
} from './BreadcrumbNav.variants';

const BreadcrumbNavContext =
  React.createContext<BreadcrumbNavContextValue | null>(null);

const useBreadcrumbNavContext = () => {
  const context = React.useContext(BreadcrumbNavContext);
  if (!context) {
    throw new Error(
      'BreadcrumbNav components must be used within a BreadcrumbNav'
    );
  }
  return context;
};

const BreadcrumbNav = React.forwardRef<BreadcrumbNavRef, BreadcrumbNavProps>(
  (
    {
      items = [],
      separator = 'chevron-right',
      maxItems = 5,
      showHome = true,
      homeIcon = 'home',
      homeLabel = 'Home',
      variant = 'default',
      size = 'md',
      collapsed = false,
      onItemClick,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [collapsedExpanded, setCollapsedExpanded] = useState(false);
    const tokens = useDesignTokens();

    // Handle item click
    const handleItemClick = useCallback(
      (item: BreadcrumbItem) => {
        if (!item.disabled) {
          onItemClick?.(item);
        }
      },
      [onItemClick]
    );

    // Handle collapsed toggle
    const handleCollapsedToggle = useCallback(() => {
      setCollapsedExpanded(!collapsedExpanded);
    }, [collapsedExpanded]);

    // Build breadcrumb items
    const breadcrumbItems = useMemo(() => {
      const allItems: BreadcrumbItem[] = [];

      // Add home item if enabled
      if (showHome) {
        allItems.push({
          key: 'home',
          label: homeLabel,
          icon: homeIcon,
          href: '/',
          active: items.length === 0,
          disabled: false,
        });
      }

      // Add provided items
      allItems.push(...items);

      return allItems;
    }, [items, showHome, homeLabel, homeIcon]);

    // Handle collapsed breadcrumbs
    const visibleItems = useMemo(() => {
      if (!collapsed || breadcrumbItems.length <= maxItems) {
        return breadcrumbItems;
      }

      const startItems = breadcrumbItems.slice(0, 1);
      const endItems = breadcrumbItems.slice(-(maxItems - 2));
      const hiddenItems = breadcrumbItems.slice(
        1,
        breadcrumbItems.length - (maxItems - 2)
      );

      return {
        startItems,
        hiddenItems,
        endItems,
      };
    }, [breadcrumbItems, collapsed, maxItems]);

    const contextValue: BreadcrumbNavContextValue = {
      items: breadcrumbItems,
      collapsedExpanded,
      onItemClick: handleItemClick,
      onCollapsedToggle: handleCollapsedToggle,
      variant,
      size,
    };

    return (
      <BreadcrumbNavContext.Provider value={contextValue}>
        <nav
          ref={ref}
          className={cn(
            breadcrumbNavVariants({ variant, size, collapsed }),
            className
          )}
          style={style}
          aria-label="Breadcrumb navigation"
          {...props}
        >
          <ol className="flex items-center list-none m-0 p-0 flex-wrap gap-1">
            {!collapsed || breadcrumbItems.length <= maxItems ? (
              // Show all items
              breadcrumbItems.map((item, index) => (
                <React.Fragment key={item.key}>
                  <li
                    className={cn(
                      breadcrumbItemVariants({
                        variant,
                        size,
                        active: item.active,
                        disabled: item.disabled,
                      })
                    )}
                  >
                    <Button
                      variant={item.active ? 'default' : 'ghost'}
                      size={size}
                      onClick={() => handleItemClick(item)}
                      disabled={item.disabled}
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-sm transition-all',
                        'hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/20',
                        item.active && 'font-medium',
                        item.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                      aria-current={item.active ? 'page' : undefined}
                    >
                      {item.icon && (
                        <Icon 
                          name={item.icon} 
                          size="sm"
                          className={cn(
                            'flex-shrink-0',
                            item.active ? 'text-foreground' : 'text-muted-foreground',
                            item.disabled && 'text-muted-foreground'
                          )}
                        />
                      )}
                      <span 
                        className="whitespace-nowrap overflow-hidden text-ellipsis max-w-32"
                        style={{
                          maxWidth: tokens.getSpacing('32'),
                        }}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge variant={item.badge.variant} size="xs">
                          {item.badge.text}
                        </Badge>
                      )}
                    </Button>
                  </li>

                  {index < breadcrumbItems.length - 1 && (
                    <li className="flex items-center justify-center w-4 h-4 text-muted-foreground mx-1 flex-shrink-0">
                      <Icon name={separator} size="sm" />
                    </li>
                  )}
                </React.Fragment>
              ))
            ) : (
              // Show collapsed breadcrumbs
              <>
                {/* Start items */}
                {visibleItems.startItems.map((item, index) => (
                  <React.Fragment key={item.key}>
                    <li
                      className={cn(
                        breadcrumbItemVariants({
                          variant,
                          size,
                          active: item.active,
                          disabled: item.disabled,
                        })
                      )}
                    >
                      <Button
                        variant={item.active ? 'default' : 'ghost'}
                        size={size}
                        onClick={() => handleItemClick(item)}
                        disabled={item.disabled}
                        className={cn(
                          'flex items-center gap-1 px-2 py-1 rounded-sm transition-all',
                          'hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/20',
                          item.active && 'font-medium',
                          item.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                        aria-current={item.active ? 'page' : undefined}
                      >
                        {item.icon && (
                          <Icon 
                            name={item.icon} 
                            size="sm"
                            className={cn(
                              'flex-shrink-0',
                              item.active ? 'text-foreground' : 'text-muted-foreground',
                              item.disabled && 'text-muted-foreground'
                            )}
                          />
                        )}
                        <span 
                          className="whitespace-nowrap overflow-hidden text-ellipsis max-w-32"
                          style={{
                            maxWidth: tokens.getSpacing('32'),
                          }}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge variant={item.badge.variant} size="xs">
                            {item.badge.text}
                          </Badge>
                        )}
                      </Button>
                    </li>

                    <li className="flex items-center justify-center w-4 h-4 text-muted-foreground mx-1 flex-shrink-0">
                      <Icon name={separator} size="sm" />
                    </li>
                  </React.Fragment>
                ))}

                {/* Collapsed items */}
                <li className="relative">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size={size}
                      onClick={handleCollapsedToggle}
                      className="flex items-center justify-center w-6 h-6 rounded-sm transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/20"
                      aria-expanded={collapsedExpanded}
                      aria-label="Show more breadcrumbs"
                    >
                      <Icon name="more-horizontal" size="sm" />
                    </Button>

                    <div
                      className={cn(
                        'absolute top-full left-0 bg-background border border-border rounded-md shadow-md p-1 z-50 min-w-48',
                        'transition-all duration-normal ease-smooth',
                        collapsedExpanded 
                          ? 'opacity-100 visible translate-y-0' 
                          : 'opacity-0 invisible -translate-y-1'
                      )}
                    >
                      {visibleItems.hiddenItems.map(item => (
                        <Button
                          key={item.key}
                          variant="ghost"
                          size={size}
                          onClick={() => handleItemClick(item)}
                          disabled={item.disabled}
                          className={cn(
                            'flex items-center gap-2 w-full px-3 py-2 rounded-sm transition-all',
                            'hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/20',
                            'text-left justify-start',
                            item.active && 'font-medium',
                            item.disabled && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          {item.icon && (
                            <Icon 
                              name={item.icon} 
                              size="sm"
                              className={cn(
                                'flex-shrink-0',
                                item.active ? 'text-foreground' : 'text-muted-foreground',
                                item.disabled && 'text-muted-foreground'
                              )}
                            />
                          )}
                          <span 
                            className="whitespace-nowrap overflow-hidden text-ellipsis max-w-32"
                            style={{
                              maxWidth: tokens.getSpacing('32'),
                            }}
                          >
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge variant={item.badge.variant} size="xs">
                              {item.badge.text}
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </li>

                <li className="flex items-center justify-center w-4 h-4 text-muted-foreground mx-1 flex-shrink-0">
                  <Icon name={separator} size="sm" />
                </li>

                {/* End items */}
                {visibleItems.endItems.map((item, index) => (
                  <React.Fragment key={item.key}>
                    <li
                      className={cn(
                        breadcrumbItemVariants({
                          variant,
                          size,
                          active: item.active,
                          disabled: item.disabled,
                        })
                      )}
                    >
                      <Button
                        variant={item.active ? 'default' : 'ghost'}
                        size={size}
                        onClick={() => handleItemClick(item)}
                        disabled={item.disabled}
                        className={cn(
                          'flex items-center gap-1 px-2 py-1 rounded-sm transition-all',
                          'hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/20',
                          item.active && 'font-medium',
                          item.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                        aria-current={item.active ? 'page' : undefined}
                      >
                        {item.icon && (
                          <Icon 
                            name={item.icon} 
                            size="sm"
                            className={cn(
                              'flex-shrink-0',
                              item.active ? 'text-foreground' : 'text-muted-foreground',
                              item.disabled && 'text-muted-foreground'
                            )}
                          />
                        )}
                        <span 
                          className="whitespace-nowrap overflow-hidden text-ellipsis max-w-32"
                          style={{
                            maxWidth: tokens.getSpacing('32'),
                          }}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge variant={item.badge.variant} size="xs">
                            {item.badge.text}
                          </Badge>
                        )}
                      </Button>
                    </li>

                    {index < visibleItems.endItems.length - 1 && (
                      <li className="flex items-center justify-center w-4 h-4 text-muted-foreground mx-1 flex-shrink-0">
                        <Icon name={separator} size="sm" />
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </ol>

          {children}
        </nav>
      </BreadcrumbNavContext.Provider>
    );
  }
);

BreadcrumbNav.displayName = 'BreadcrumbNav';

export { BreadcrumbNav, useBreadcrumbNavContext };
