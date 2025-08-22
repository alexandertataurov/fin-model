import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../../utils/cn';
import { useDesignTokens } from '../../../hooks/useDesignTokens';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { Card } from '../../molecules/Card';
import { SearchInput } from '../../molecules/SearchInput';
import { Select } from '../../molecules/Select';
import {
  DashboardProps,
  DashboardRef,
  DashboardContextValue,
  DashboardMetric,
} from './Dashboard.types';
import {
  dashboardVariants,
  dashboardHeaderVariants,
  dashboardContentVariants,
  dashboardWidgetVariants,
} from './Dashboard.variants';

const DashboardContext = React.createContext<DashboardContextValue | null>(
  null
);

const useDashboardContext = () => {
  const context = React.useContext(DashboardContext);
  if (!context) {
    throw new Error('Dashboard components must be used within a Dashboard');
  }
  return context;
};

const Dashboard = React.forwardRef<DashboardRef, DashboardProps>(
  (
    {
      title,
      subtitle,
      metrics = [],
      widgets = [],
      filters = [],
      actions = [],
      variant = 'default',
      size = 'md',
      layout = 'grid',
      onMetricClick,
      onWidgetAction,
      onFilterChange,
      onActionClick,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const tokens = useDesignTokens();

    // Handle filter change
    const handleFilterChange = useCallback(
      (filterKey: string, value: any) => {
        setActiveFilters(prev => ({ ...prev, [filterKey]: value }));
        onFilterChange?.(filterKey, value);
      },
      [onFilterChange]
    );

    // Handle search
    const handleSearch = useCallback((value: string) => {
      setSearchTerm(value);
    }, []);

    // Handle metric click
    const handleMetricClick = useCallback(
      (metric: DashboardMetric) => {
        onMetricClick?.(metric);
      },
      [onMetricClick]
    );

    // Handle widget action
    const handleWidgetAction = useCallback(
      (widgetId: string, action: string) => {
        onWidgetAction?.(widgetId, action);
      },
      [onWidgetAction]
    );

    // Handle action click
    const handleActionClick = useCallback(
      (action: any) => {
        onActionClick?.(action);
      },
      [onActionClick]
    );

    // Filter metrics based on search
    const filteredMetrics = useMemo(() => {
      if (!searchTerm) return metrics;

      return metrics.filter(
        metric =>
          metric.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          metric.value.toString().includes(searchTerm)
      );
    }, [metrics, searchTerm]);

    // Filter widgets based on search
    const filteredWidgets = useMemo(() => {
      if (!searchTerm) return widgets;

      return widgets.filter(widget =>
        widget.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [widgets, searchTerm]);

    const contextValue: DashboardContextValue = {
      metrics: filteredMetrics,
      widgets: filteredWidgets,
      filters: activeFilters,
      searchTerm,
      onMetricClick: handleMetricClick,
      onWidgetAction: handleWidgetAction,
      onFilterChange: handleFilterChange,
      onSearch: handleSearch,
      variant,
      size,
    };

    return (
      <DashboardContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            dashboardVariants({ variant, size, layout }),
            className
          )}
          style={style}
          {...props}
        >
          {/* Header */}
          <div className={cn(dashboardHeaderVariants({ variant, size }))}>
            {title && (
              <h1
                className="text-2xl font-bold text-foreground mb-1"
                style={{
                  fontSize: tokens.getFontSize('2xl'),
                  fontWeight: tokens.getFontWeight('bold'),
                  color: tokens.getColor('foreground'),
                  marginBottom: tokens.getSpacing('1'),
                }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                className="text-base text-muted-foreground mb-6"
                style={{
                  fontSize: tokens.getFontSize('base'),
                  color: tokens.getColor('muted.foreground'),
                  marginBottom: tokens.getSpacing('6'),
                }}
              >
                {subtitle}
              </p>
            )}

            {/* Actions */}
            {actions.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
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
              </div>
            )}

            {/* Filters */}
            {(filters.length > 0 || actions.length > 0) && (
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <SearchInput
                  placeholder="Search dashboard..."
                  value={searchTerm}
                  onChange={handleSearch}
                  variant={variant}
                  size={size}
                  showClearButton={true}
                />

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

          {/* Content */}
          <div className={cn(dashboardContentVariants({ variant, size }))}>
            {/* Metrics */}
            {filteredMetrics.length > 0 && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: tokens.getSpacing('4'),
                  marginBottom: tokens.getSpacing('6'),
                }}
              >
                {filteredMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className={cn(
                      'p-4 bg-background border border-border rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
                      dashboardWidgetVariants({ variant, size, trend: metric.trend || 'neutral' })
                    )}
                    onClick={() => handleMetricClick(metric)}
                    style={{
                      cursor: onMetricClick ? 'pointer' : 'default',
                      padding: tokens.getSpacing('4'),
                      backgroundColor: tokens.getColor('background'),
                      border: `${tokens.getToken('borderWidth.sm') || '1px'} solid ${tokens.getColor('border')}`,
                      borderRadius: tokens.getBorderRadius('lg'),
                      transition: `all ${tokens.getMotion('duration', 'normal')} ${tokens.getMotion('easing', 'smooth')}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className="text-sm font-medium text-muted-foreground"
                        style={{
                          fontSize: tokens.getFontSize('sm'),
                          fontWeight: tokens.getFontWeight('medium'),
                          color: tokens.getColor('muted.foreground'),
                        }}
                      >
                        {metric.title}
                      </h3>
                      <div
                        className={cn(
                          'flex items-center justify-center w-8 h-8 rounded-md',
                          metric.trend === 'positive' && 'bg-success/10 text-success-foreground',
                          metric.trend === 'negative' && 'bg-destructive/10 text-destructive-foreground',
                          metric.trend === 'neutral' && 'bg-muted text-muted-foreground'
                        )}
                        style={{
                          width: tokens.getSpacing('8'),
                          height: tokens.getSpacing('8'),
                          borderRadius: tokens.getBorderRadius('md'),
                          backgroundColor: metric.trend === 'positive'
                            ? tokens.getColor('success.50')
                            : metric.trend === 'negative'
                              ? tokens.getColor('destructive.50')
                              : tokens.getColor('muted'),
                          color: metric.trend === 'positive'
                            ? tokens.getColor('success.foreground')
                            : metric.trend === 'negative'
                              ? tokens.getColor('destructive.foreground')
                              : tokens.getColor('muted.foreground'),
                        }}
                      >
                        <Icon name={metric.icon || 'trending-up'} size="sm" />
                      </div>
                    </div>

                    <div
                      className="text-2xl font-bold text-foreground mb-1"
                      style={{
                        fontSize: tokens.getFontSize('2xl'),
                        fontWeight: tokens.getFontWeight('bold'),
                        color: tokens.getColor('foreground'),
                        marginBottom: tokens.getSpacing('1'),
                      }}
                    >
                      {metric.value}
                    </div>

                    {metric.change && (
                      <div
                        className={cn(
                          'flex items-center gap-1 text-sm',
                          metric.trend === 'positive' && 'text-success-foreground',
                          metric.trend === 'negative' && 'text-destructive-foreground',
                          metric.trend === 'neutral' && 'text-muted-foreground'
                        )}
                        style={{
                          fontSize: tokens.getFontSize('sm'),
                          color: metric.trend === 'positive'
                            ? tokens.getColor('success.foreground')
                            : metric.trend === 'negative'
                              ? tokens.getColor('destructive.foreground')
                              : tokens.getColor('muted.foreground'),
                        }}
                      >
                        <Icon
                          name={
                            metric.trend === 'positive'
                              ? 'trending-up'
                              : metric.trend === 'negative'
                                ? 'trending-down'
                                : 'minus'
                          }
                          size="xs"
                        />
                        {metric.change}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Widgets */}
            {filteredWidgets.length > 0 && (
              <div
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6"
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: tokens.getSpacing('6'),
                  marginBottom: tokens.getSpacing('6'),
                }}
              >
                {filteredWidgets.map((widget, index) => (
                  <div
                    key={index}
                    className={cn(
                      dashboardWidgetVariants({ variant, size }),
                      `col-span-${widget.span || 1}`
                    )}
                    style={{
                      gridColumn: `span ${widget.span || 1}`,
                    }}
                  >
                    <Card variant={variant} size={size}>
                      <div className="flex items-center justify-between mb-4">
                        <h3
                          className="text-lg font-semibold text-foreground"
                          style={{
                            fontSize: tokens.getFontSize('lg'),
                            fontWeight: tokens.getFontWeight('semibold'),
                            color: tokens.getColor('foreground'),
                          }}
                        >
                          {widget.title}
                        </h3>

                        {widget.actions && (
                          <div className="flex items-center gap-2">
                            {widget.actions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                variant={action.variant || 'ghost'}
                                size="sm"
                                onClick={() =>
                                  handleWidgetAction(widget.id, action.key)
                                }
                                disabled={action.disabled}
                              >
                                {action.icon && (
                                  <Icon name={action.icon} size="sm" />
                                )}
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        {typeof widget.content === 'function'
                          ? widget.content({
                            filters: activeFilters,
                            onAction: (action: string) =>
                              handleWidgetAction(widget.id, action),
                          })
                          : widget.content}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {children}
          </div>
        </div>
      </DashboardContext.Provider>
    );
  }
);

Dashboard.displayName = 'Dashboard';

export { Dashboard, useDashboardContext };
