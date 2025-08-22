import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../../utils/cn';
import { useDesignTokens } from '../../../hooks/useDesignTokens';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { Select } from '../../molecules/Select';
import { SearchInput } from '../../molecules/SearchInput';
import {
  ActionBarProps,
  ActionBarRef,
  ActionBarContextValue,
  ActionItem,
} from './ActionBar.types';
import {
  actionBarVariants,
  actionBarHeaderVariants,
  actionBarContentVariants,
  actionGroupVariants,
} from './ActionBar.variants';

const ActionBarContext = React.createContext<ActionBarContextValue | null>(
  null
);

const useActionBarContext = () => {
  const context = React.useContext(ActionBarContext);
  if (!context) {
    throw new Error('ActionBar components must be used within an ActionBar');
  }
  return context;
};

const ActionBar = React.forwardRef<ActionBarRef, ActionBarProps>(
  (
    {
      title,
      subtitle,
      groups = [],
      searchable = false,
      filterable = false,
      bulkActions = false,
      selectedCount = 0,
      filters = [],
      variant = 'default',
      size = 'md',
      sticky = false,
      onActionClick,
      onSearch,
      onFilterChange,
      onBulkAction,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
      new Set()
    );
    const tokens = useDesignTokens();

    // Handle action click
    const handleActionClick = useCallback(
      (action: ActionItem) => {
        onActionClick?.(action);
      },
      [onActionClick]
    );

    // Handle search
    const handleSearch = useCallback(
      (value: string) => {
        setSearchTerm(value);
        onSearch?.(value);
      },
      [onSearch]
    );

    // Handle filter change
    const handleFilterChange = useCallback(
      (filterKey: string, value: any) => {
        setActiveFilters(prev => ({ ...prev, [filterKey]: value }));
        onFilterChange?.(filterKey, value);
      },
      [onFilterChange]
    );

    // Handle bulk action
    const handleBulkAction = useCallback(
      (action: ActionItem) => {
        onBulkAction?.(action);
      },
      [onBulkAction]
    );

    // Handle group toggle
    const handleGroupToggle = useCallback((groupId: string) => {
      setExpandedGroups(prev => {
        const newSet = new Set(prev);
        if (newSet.has(groupId)) {
          newSet.delete(groupId);
        } else {
          newSet.add(groupId);
        }
        return newSet;
      });
    }, []);

    // Filter groups based on search
    const filteredGroups = useMemo(() => {
      if (!searchTerm) return groups;

      return groups
        .map(group => ({
          ...group,
          actions: group.actions.filter(
            action =>
              action.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
              action.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
          ),
        }))
        .filter(group => group.actions.length > 0);
    }, [groups, searchTerm]);

    const contextValue: ActionBarContextValue = {
      searchTerm,
      activeFilters,
      expandedGroups,
      selectedCount,
      onActionClick: handleActionClick,
      onSearch: handleSearch,
      onFilterChange: handleFilterChange,
      onBulkAction: handleBulkAction,
      onGroupToggle: handleGroupToggle,
      variant,
      size,
    };

    return (
      <ActionBarContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            actionBarVariants({ variant, size, sticky }),
            className
          )}
          style={{
            ...style,
            position: sticky ? 'sticky' : 'relative',
            top: sticky ? 0 : 'auto',
            zIndex: sticky ? tokens.getZIndex('sticky') : 'auto',
          }}
          {...props}
        >
          {/* Header */}
          {(title || subtitle) && (
            <div className={cn(actionBarHeaderVariants({ variant, size }))}>
              {title && (
                <h2
                  className="text-lg font-semibold text-foreground mb-1"
                  style={{
                    fontSize: tokens.getFontSize('lg')[0],
                    fontWeight: tokens.getFontWeight('semibold'),
                    color: tokens.getColor('foreground'),
                    marginBottom: tokens.getSpacing('1'),
                  }}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  className="text-sm text-muted-foreground mb-4"
                  style={{
                    fontSize: tokens.getFontSize('sm'),
                    color: tokens.getColor('muted.foreground'),
                    marginBottom: tokens.getSpacing('4'),
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className={cn(actionBarContentVariants({ variant, size }))}>
            {/* Left Section */}
            <div className="flex items-center gap-3 flex-1">
              {/* Bulk Actions */}
              {bulkActions && selectedCount > 0 && (
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-md"
                  style={{
                    padding: `${tokens.getSpacing('2')} ${tokens.getSpacing('3')}`,
                    backgroundColor: tokens.getColor('primary.50'),
                    border: `${tokens.borderWidth.sm} solid ${tokens.getColor('primary.200')}`,
                    borderRadius: tokens.getBorderRadius('md'),
                  }}
                >
                  <span
                    className="text-sm font-medium text-primary"
                    style={{
                      fontSize: tokens.getFontSize('sm'),
                      fontWeight: tokens.getFontWeight('medium'),
                      color: tokens.getColor('primary.foreground'),
                    }}
                  >
                    {selectedCount} selected
                  </span>
                  <div
                    className="w-px h-6 bg-border mx-2"
                    style={{
                      width: tokens.borderWidth.sm,
                      height: tokens.getSpacing('6'),
                      backgroundColor: tokens.getColor('border'),
                      margin: `0 ${tokens.getSpacing('2')}`,
                    }}
                  />
                  {groups
                    .flatMap(g => g.actions)
                    .filter(a => a.bulkAction)
                    .map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant || 'ghost'}
                        size={size}
                        onClick={() => handleBulkAction(action)}
                        disabled={action.disabled}
                      >
                        {action.icon && <Icon name={action.icon} size="sm" />}
                        {action.label}
                      </Button>
                    ))}
                </div>
              )}

              {/* Action Groups */}
              <div className="flex items-center gap-4 flex-wrap">
                {filteredGroups.map(group => (
                  <div
                    key={group.id}
                    className={cn(
                      actionGroupVariants({
                        variant,
                        size,
                        expanded: expandedGroups.has(group.id),
                      })
                    )}
                  >
                    {group.title && (
                      <div className="flex items-center gap-2 mb-2">
                        {group.icon && <Icon name={group.icon} size="sm" />}
                        <span
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                          style={{
                            fontSize: tokens.getFontSize('xs'),
                            fontWeight: tokens.getFontWeight('medium'),
                            color: tokens.getColor('muted.foreground'),
                            textTransform: 'uppercase',
                            letterSpacing: tokens.getToken('typography.letterSpacing.wide') || '0.025em',
                          }}
                        >
                          {group.title}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      {(group.actions || []).map((action, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Button
                            variant={action.variant || 'default'}
                            size={size}
                            onClick={() => handleActionClick(action)}
                            disabled={action.disabled}
                          >
                            {action.icon && (
                              <Icon name={action.icon} size="sm" />
                            )}
                            {action.label}
                            {action.badge && (
                              <Badge variant={action.badge.variant} size="sm">
                                {action.badge.text}
                              </Badge>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Section */}
            <div className="flex items-center gap-3 justify-center">
              {children}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 justify-end">
              {/* Search */}
              {searchable && (
                <div className="min-w-64">
                  <SearchInput
                    placeholder="Search actions..."
                    value={searchTerm}
                    onChange={handleSearch}
                    variant={variant}
                    size={size}
                    showClearButton={true}
                  />
                </div>
              )}

              {/* Filters */}
              {filterable && filters.length > 0 && (
                <div className="flex items-center gap-2">
                  {filters.map((filter, index) => (
                    <Select
                      key={index}
                      placeholder={filter.placeholder}
                      value={activeFilters[filter.key] || ''}
                      onChange={value => handleFilterChange(filter.key, value)}
                      options={filter.options}
                      variant={variant}
                      size={size}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ActionBarContext.Provider>
    );
  }
);

ActionBar.displayName = 'ActionBar';

export { ActionBar, useActionBarContext };
