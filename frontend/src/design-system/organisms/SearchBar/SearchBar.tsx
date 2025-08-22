import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { SearchInput } from '../../molecules/SearchInput';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import {
  SearchBarProps,
  SearchBarRef,
  SearchBarContextValue,
} from './SearchBar.types';
import {
  searchBarVariants,
  searchBarFiltersVariants,
  searchBarResultsVariants,
} from './SearchBar.variants';

const SearchBarContext = React.createContext<SearchBarContextValue | null>(
  null
);

const useSearchBarContext = () => {
  const context = React.useContext(SearchBarContext);
  if (!context) {
    throw new Error('SearchBar components must be used within a SearchBar');
  }
  return context;
};

const StyledSearchBar = styled.div<{
  $variant: string;
  $size: string;
  $expanded: boolean;
}>`
  position: relative;
  width: 100%;
  ${({ $variant, $size, $expanded }) =>
    searchBarVariants({ variant: $variant, size: $size, expanded: $expanded })}
`;

const StyledSearchBarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
  margin-bottom: ${getToken('spacing.4')};
`;

const StyledSearchBarInput = styled.div`
  flex: 1;
  position: relative;
`;

const StyledSearchBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
`;

const StyledSearchBarFilters = styled.div<{
  $variant: string;
  $size: string;
  $visible: boolean;
}>`
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  align-items: center;
  gap: ${getToken('spacing.3')};
  padding: ${getToken('spacing.3')};
  border-top: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  background: ${getToken('colors.muted')};
  ${({ $variant, $size }) =>
    searchBarFiltersVariants({ variant: $variant, size: $size })}
`;

const StyledSearchBarResults = styled.div<{
  $variant: string;
  $size: string;
  $visible: boolean;
}>`
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${getToken('colors.background')};
  border: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  border-radius: ${getToken('borderRadius.lg')};
  box-shadow: ${getToken('shadows.lg')};
  max-height: 400px;
  overflow-y: auto;
  ${({ $variant, $size }) =>
    searchBarResultsVariants({ variant: $variant, size: $size })}
`;

const StyledSearchResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
  padding: ${getToken('spacing.3')};
  cursor: pointer;
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};

  &:hover {
    background: ${getToken('colors.muted')};
  }

  &:not(:last-child) {
    border-bottom: ${getToken('borderWidth.sm')} solid
      ${getToken('colors.border')};
  }
`;

const StyledSearchResultContent = styled.div`
  flex: 1;
`;

const StyledSearchResultTitle = styled.div`
  font-weight: ${getToken('typography.fontWeight.medium')};
  color: ${getToken('colors.foreground')};
  margin-bottom: ${getToken('spacing.1')};
`;

const StyledSearchResultDescription = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
`;

const StyledSearchResultMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
`;

const StyledFilterChip = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.1')};
  padding: ${getToken('spacing.1')} ${getToken('spacing.2')};
  background: ${getToken('colors.primary')};
  color: ${getToken('colors.primary.foreground')};
  border-radius: ${getToken('borderRadius.full')};
  font-size: ${getToken('typography.fontSize.sm')};
  cursor: pointer;
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};

  &:hover {
    background: ${getToken('colors.primary.hover')};
  }
`;

const SearchBar = React.forwardRef<SearchBarRef, SearchBarProps>(
  (
    {
      placeholder = 'Search...',
      variant = 'default',
      size = 'md',
      expanded = false,
      showFilters = false,
      showResults = false,
      filters = [],
      results = [],
      onSearch,
      onFilterChange,
      onResultSelect,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = useState('');
    const [isExpanded, setIsExpanded] = useState(expanded);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    // Handle search input change
    const handleSearchChange = useCallback(
      (value: string) => {
        setSearchValue(value);
        if (onSearch) {
          onSearch(value, activeFilters);
        }
      },
      [onSearch, activeFilters]
    );

    // Handle filter toggle
    const handleFilterToggle = useCallback(
      (filterKey: string) => {
        const newFilters = activeFilters.includes(filterKey)
          ? activeFilters.filter(f => f !== filterKey)
          : [...activeFilters, filterKey];

        setActiveFilters(newFilters);
        if (onFilterChange) {
          onFilterChange(newFilters);
        }
        if (onSearch) {
          onSearch(searchValue, newFilters);
        }
      },
      [activeFilters, onFilterChange, onSearch, searchValue]
    );

    // Handle result selection
    const handleResultSelect = useCallback(
      (result: any) => {
        if (onResultSelect) {
          onResultSelect(result);
        }
      },
      [onResultSelect]
    );

    // Handle expand/collapse
    const handleToggleExpand = useCallback(() => {
      setIsExpanded(!isExpanded);
    }, [isExpanded]);

    const contextValue: SearchBarContextValue = {
      searchValue,
      setSearchValue,
      activeFilters,
      setActiveFilters,
      isExpanded,
      setIsExpanded,
      variant,
      size,
      onSearch,
      onFilterChange,
      onResultSelect,
    };

    return (
      <SearchBarContext.Provider value={contextValue}>
        <StyledSearchBar
          ref={ref}
          $variant={variant}
          $size={size}
          $expanded={isExpanded}
          className={className}
          style={style}
          {...props}
        >
          <StyledSearchBarHeader>
            <StyledSearchBarInput>
              <SearchInput
                placeholder={placeholder}
                value={searchValue}
                onChange={handleSearchChange}
                variant={variant}
                size={size}
                showClearButton={true}
                showSearchButton={true}
              />
            </StyledSearchBarInput>

            <StyledSearchBarActions>
              {showFilters && (
                <Button
                  variant="ghost"
                  size={size}
                  onClick={handleToggleExpand}
                >
                  <Icon
                    name="filter"
                    size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
                  />
                </Button>
              )}

              {children}
            </StyledSearchBarActions>
          </StyledSearchBarHeader>

          {/* Filters Section */}
          {showFilters && (
            <StyledSearchBarFilters
              $variant={variant}
              $size={size}
              $visible={isExpanded}
            >
              {filters.map(filter => (
                <StyledFilterChip
                  key={filter.key}
                  onClick={() => handleFilterToggle(filter.key)}
                >
                  <Icon
                    name={activeFilters.includes(filter.key) ? 'check' : 'plus'}
                    size="sm"
                  />
                  {filter.label}
                  {activeFilters.includes(filter.key) && (
                    <Badge variant="secondary" size="sm">
                      {filter.count || 1}
                    </Badge>
                  )}
                </StyledFilterChip>
              ))}
            </StyledSearchBarFilters>
          )}

          {/* Results Section */}
          {showResults && results.length > 0 && (
            <StyledSearchBarResults
              $variant={variant}
              $size={size}
              $visible={true}
            >
              {results.map((result, index) => (
                <StyledSearchResultItem
                  key={index}
                  onClick={() => handleResultSelect(result)}
                >
                  {result.icon && <Icon name={result.icon} size="md" />}

                  <StyledSearchResultContent>
                    <StyledSearchResultTitle>
                      {result.title}
                    </StyledSearchResultTitle>
                    {result.description && (
                      <StyledSearchResultDescription>
                        {result.description}
                      </StyledSearchResultDescription>
                    )}
                  </StyledSearchResultContent>

                  <StyledSearchResultMeta>
                    {result.badge && (
                      <Badge variant={result.badge.variant} size="sm">
                        {result.badge.text}
                      </Badge>
                    )}
                    {result.meta && (
                      <span
                        style={{
                          fontSize: getToken('typography.fontSize.sm'),
                          color: getToken('colors.muted.foreground'),
                        }}
                      >
                        {result.meta}
                      </span>
                    )}
                  </StyledSearchResultMeta>
                </StyledSearchResultItem>
              ))}
            </StyledSearchBarResults>
          )}
        </StyledSearchBar>
      </SearchBarContext.Provider>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export { SearchBar, useSearchBarContext };
