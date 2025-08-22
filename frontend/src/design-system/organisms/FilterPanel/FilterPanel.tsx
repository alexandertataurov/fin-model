import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { Checkbox } from '../../atoms/Checkbox';
import { Select } from '../../molecules/Select';
import { SearchInput } from '../../molecules/SearchInput';
import { DatePicker } from '../../molecules/DatePicker';
import {
  FilterPanelProps,
  FilterPanelRef,
  FilterPanelContextValue,
  FilterValue,
} from './FilterPanel.types';
import {
  filterPanelVariants,
  filterPanelHeaderVariants,
  filterPanelContentVariants,
  filterGroupVariants,
} from './FilterPanel.variants';

const FilterPanelContext = React.createContext<FilterPanelContextValue | null>(
  null
);

const useFilterPanelContext = () => {
  const context = React.useContext(FilterPanelContext);
  if (!context) {
    throw new Error('FilterPanel components must be used within a FilterPanel');
  }
  return context;
};

const StyledFilterPanel = styled.div<{
  $variant: string;
  $size: string;
  $collapsed: boolean;
}>`
  width: 100%;
  ${({ $variant, $size, $collapsed }) =>
    filterPanelVariants({
      variant: $variant,
      size: $size,
      collapsed: $collapsed,
    })}
`;

const StyledFilterPanelHeader = styled.div<{ $variant: string; $size: string }>`
  ${({ $variant, $size }) =>
    filterPanelHeaderVariants({ variant: $variant, size: $size })}
`;

const StyledFilterPanelTitle = styled.div`
  font-size: ${getToken('typography.fontSize.lg')};
  font-weight: ${getToken('typography.fontWeight.semibold')};
  color: ${getToken('colors.foreground')};
  margin-bottom: ${getToken('spacing.2')};
`;

const StyledFilterPanelSubtitle = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
  margin-bottom: ${getToken('spacing.4')};
`;

const StyledFilterPanelActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  margin-bottom: ${getToken('spacing.4')};
`;

const StyledFilterPanelContent = styled.div<{
  $variant: string;
  $size: string;
}>`
  ${({ $variant, $size }) =>
    filterPanelContentVariants({ variant: $variant, size: $size })}
`;

const StyledFilterGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getToken('spacing.4')};
`;

const StyledFilterGroup = styled.div<{
  $variant: string;
  $size: string;
  $expanded: boolean;
}>`
  ${({ $variant, $size, $expanded }) =>
    filterGroupVariants({
      variant: $variant,
      size: $size,
      expanded: $expanded,
    })}
`;

const StyledFilterGroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: ${getToken('spacing.3')};
  border-radius: ${getToken('borderRadius.md')};
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};

  &:hover {
    background-color: ${getToken('colors.muted')};
  }
`;

const StyledFilterGroupTitle = styled.div`
  font-size: ${getToken('typography.fontSize.base')};
  font-weight: ${getToken('typography.fontWeight.medium')};
  color: ${getToken('colors.foreground')};
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
`;

const StyledFilterGroupIcon = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${getToken('spacing.4')};
  height: ${getToken('spacing.4')};
  transition: transform ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
  transform: rotate(${({ $expanded }) => ($expanded ? '90deg' : '0deg')});
`;

const StyledFilterGroupBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.1')};
`;

const StyledFilterGroupContent = styled.div<{ $expanded: boolean }>`
  padding: ${getToken('spacing.3')};
  padding-top: 0;
  max-height: ${({ $expanded }) => ($expanded ? '500px' : '0')};
  overflow: hidden;
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
  opacity: ${({ $expanded }) => ($expanded ? '1' : '0')};
`;

const StyledFilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getToken('spacing.2')};
`;

const StyledFilterOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  padding: ${getToken('spacing.2')};
  border-radius: ${getToken('borderRadius.sm')};
  transition: background-color ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};

  &:hover {
    background-color: ${getToken('colors.muted')};
  }
`;

const StyledFilterOptionLabel = styled.div`
  flex: 1;
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.foreground')};
`;

const StyledFilterOptionCount = styled.div`
  font-size: ${getToken('typography.fontSize.xs')};
  color: ${getToken('colors.muted.foreground')};
  background-color: ${getToken('colors.muted')};
  padding: ${getToken('spacing.1')} ${getToken('spacing.2')};
  border-radius: ${getToken('borderRadius.sm')};
`;

const StyledFilterPanelFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${getToken('spacing.4')};
  border-top: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  margin-top: ${getToken('spacing.4')};
`;

const StyledActiveFilters = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  flex-wrap: wrap;
`;

const StyledActiveFilter = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.1')};
  background-color: ${getToken('colors.primary.muted')};
  color: ${getToken('colors.primary.foreground')};
  padding: ${getToken('spacing.1')} ${getToken('spacing.2')};
  border-radius: ${getToken('borderRadius.sm')};
  font-size: ${getToken('typography.fontSize.sm')};
`;

const StyledFilterPanelSearch = styled.div`
  margin-bottom: ${getToken('spacing.4')};
`;

const FilterPanel = React.forwardRef<FilterPanelRef, FilterPanelProps>(
  (
    {
      title = 'Filters',
      subtitle,
      groups = [],
      searchable = false,
      collapsible = true,
      variant = 'default',
      size = 'md',
      collapsed = false,
      onFilterChange,
      onClearAll,
      onCollapse,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [activeFilters, setActiveFilters] = useState<
      Record<string, FilterValue>
    >({});
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
      new Set()
    );
    const [searchTerm, setSearchTerm] = useState('');

    // Handle filter change
    const handleFilterChange = useCallback(
      (filterKey: string, value: FilterValue) => {
        setActiveFilters(prev => ({ ...prev, [filterKey]: value }));
        onFilterChange?.(filterKey, value);
      },
      [onFilterChange]
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

    // Handle clear all filters
    const handleClearAll = useCallback(() => {
      setActiveFilters({});
      onClearAll?.();
    }, [onClearAll]);

    // Handle remove filter
    const handleRemoveFilter = useCallback(
      (filterKey: string) => {
        setActiveFilters(prev => {
          const newFilters = { ...prev };
          delete newFilters[filterKey];
          return newFilters;
        });
        onFilterChange?.(filterKey, null);
      },
      [onFilterChange]
    );

    // Handle collapse toggle
    const handleCollapseToggle = useCallback(() => {
      onCollapse?.(!collapsed);
    }, [collapsed, onCollapse]);

    // Filter groups based on search
    const filteredGroups = useMemo(() => {
      if (!searchTerm) return groups;

      return groups
        .map(group => ({
          ...group,
          filters: group.filters.filter(
            filter =>
              filter.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
              filter.options?.some(option =>
                option.label.toLowerCase().includes(searchTerm.toLowerCase())
              )
          ),
        }))
        .filter(group => group.filters.length > 0);
    }, [groups, searchTerm]);

    // Get active filter count
    const activeFilterCount = useMemo(() => {
      return Object.keys(activeFilters).length;
    }, [activeFilters]);

    // Get group active filter count
    const getGroupActiveCount = useCallback(
      (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return 0;
        return group.filters.filter(filter => activeFilters[filter.key]).length;
      },
      [activeFilters, groups]
    );

    const contextValue: FilterPanelContextValue = {
      activeFilters,
      expandedGroups,
      searchTerm,
      onFilterChange: handleFilterChange,
      onGroupToggle: handleGroupToggle,
      onRemoveFilter: handleRemoveFilter,
      onClearAll: handleClearAll,
      variant,
      size,
    };

    return (
      <FilterPanelContext.Provider value={contextValue}>
        <StyledFilterPanel
          ref={ref}
          $variant={variant}
          $size={size}
          $collapsed={collapsed}
          className={className}
          style={style}
          {...props}
        >
          {/* Header */}
          <StyledFilterPanelHeader $variant={variant} $size={size}>
            <StyledFilterPanelTitle>{title}</StyledFilterPanelTitle>
            {subtitle && (
              <StyledFilterPanelSubtitle>{subtitle}</StyledFilterPanelSubtitle>
            )}

            {/* Actions */}
            <StyledFilterPanelActions>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" size="sm">
                  {activeFilterCount} active
                </Badge>
              )}

              {collapsible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCollapseToggle}
                >
                  <Icon
                    name={collapsed ? 'chevron-down' : 'chevron-up'}
                    size="sm"
                  />
                </Button>
              )}
            </StyledFilterPanelActions>
          </StyledFilterPanelHeader>

          {/* Content */}
          {!collapsed && (
            <StyledFilterPanelContent $variant={variant} $size={size}>
              {/* Search */}
              {searchable && (
                <StyledFilterPanelSearch>
                  <SearchInput
                    placeholder="Search filters..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    variant={variant}
                    size={size}
                    showClearButton={true}
                  />
                </StyledFilterPanelSearch>
              )}

              {/* Filter Groups */}
              <StyledFilterGroups>
                {filteredGroups.map(group => (
                  <StyledFilterGroup
                    key={group.id}
                    $variant={variant}
                    $size={size}
                    $expanded={expandedGroups.has(group.id)}
                  >
                    <StyledFilterGroupHeader
                      onClick={() => handleGroupToggle(group.id)}
                    >
                      <StyledFilterGroupTitle>
                        <Icon name={group.icon || 'filter'} size="sm" />
                        {group.title}
                      </StyledFilterGroupTitle>

                      <StyledFilterGroupBadge>
                        {getGroupActiveCount(group.id) > 0 && (
                          <Badge variant="primary" size="sm">
                            {getGroupActiveCount(group.id)}
                          </Badge>
                        )}
                        <StyledFilterGroupIcon
                          $expanded={expandedGroups.has(group.id)}
                        >
                          <Icon name="chevron-right" size="sm" />
                        </StyledFilterGroupIcon>
                      </StyledFilterGroupBadge>
                    </StyledFilterGroupHeader>

                    <StyledFilterGroupContent
                      $expanded={expandedGroups.has(group.id)}
                    >
                      <StyledFilterOptions>
                        {group.filters.map(filter => (
                          <StyledFilterOption key={filter.key}>
                            {filter.type === 'checkbox' && (
                              <Checkbox
                                checked={!!activeFilters[filter.key]}
                                onChange={checked =>
                                  handleFilterChange(filter.key, checked)
                                }
                                variant={variant}
                                size={size}
                              />
                            )}

                            {filter.type === 'select' && (
                              <Select
                                value={activeFilters[filter.key] || ''}
                                onChange={value =>
                                  handleFilterChange(filter.key, value)
                                }
                                options={filter.options || []}
                                placeholder={filter.placeholder}
                                variant={variant}
                                size={size}
                              />
                            )}

                            {filter.type === 'date' && (
                              <DatePicker
                                value={activeFilters[filter.key] || null}
                                onChange={value =>
                                  handleFilterChange(filter.key, value)
                                }
                                placeholder={filter.placeholder}
                                variant={variant}
                                size={size}
                              />
                            )}

                            <StyledFilterOptionLabel>
                              {filter.label}
                            </StyledFilterOptionLabel>

                            {filter.count !== undefined && (
                              <StyledFilterOptionCount>
                                {filter.count}
                              </StyledFilterOptionCount>
                            )}
                          </StyledFilterOption>
                        ))}
                      </StyledFilterOptions>
                    </StyledFilterGroupContent>
                  </StyledFilterGroup>
                ))}
              </StyledFilterGroups>

              {children}
            </StyledFilterPanelContent>
          )}

          {/* Footer */}
          {activeFilterCount > 0 && !collapsed && (
            <StyledFilterPanelFooter>
              <StyledActiveFilters>
                {Object.entries(activeFilters).map(([key, value]) => {
                  const filter = groups
                    .flatMap(g => g.filters)
                    .find(f => f.key === key);
                  if (!filter) return null;

                  return (
                    <StyledActiveFilter key={key}>
                      <span>
                        {filter.label}: {String(value)}
                      </span>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleRemoveFilter(key)}
                      >
                        <Icon name="x" size="xs" />
                      </Button>
                    </StyledActiveFilter>
                  );
                })}
              </StyledActiveFilters>

              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                Clear all
              </Button>
            </StyledFilterPanelFooter>
          )}
        </StyledFilterPanel>
      </FilterPanelContext.Provider>
    );
  }
);

FilterPanel.displayName = 'FilterPanel';

export { FilterPanel, useFilterPanelContext };
