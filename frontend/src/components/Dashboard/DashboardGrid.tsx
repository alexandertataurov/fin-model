import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedButton, IconButton } from '@/components/ui/EnhancedButton';
import { EnhancedCard } from '@/components/ui/EnhancedCard';
import { componentStyles } from '@/components/ui/utils/designSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Responsive,
  WidthProvider,
  Layout as LayoutItem,
} from 'react-grid-layout';
import {
  Plus,
  Maximize2,
  Minimize2,
  Settings,
  MoreVertical,
  BarChart3,
} from 'lucide-react';

// React Grid Layout CSS should be imported at the app level or in index.html

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType<{
    height?: number;
    isFullscreen?: boolean;
    onFullscreen?: () => void;
  }>;
  props?: Record<string, unknown>;
  minWidth?: number;
  minHeight?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface DashboardLayout {
  layouts: { [key: string]: LayoutItem[] };
  widgets: DashboardWidget[];
}

interface DashboardGridProps {
  widgets: DashboardWidget[];
  layouts?: { [key: string]: LayoutItem[] };
  onLayoutChange?: (
    layout: LayoutItem[],
    layouts: { [key: string]: LayoutItem[] }
  ) => void;
  editable?: boolean;
  onAddWidget?: () => void;
  onRemoveWidget?: (widgetId: string) => void;
  availableWidgets?: DashboardWidget[];
  className?: string;
}

const defaultBreakpoints = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
};

const defaultCols = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2,
};

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets,
  layouts,
  onLayoutChange,
  editable = false,
  onAddWidget,
  onRemoveWidget,
  availableWidgets = [],
  className,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenWidget, setFullscreenWidget] = useState<string | null>(null);

  // Generate layouts if not provided
  const defaultLayouts = useMemo(() => {
    if (layouts) return layouts;

    const generatedLayouts: { [key: string]: LayoutItem[] } = {};
    Object.keys(defaultCols).forEach(breakpoint => {
      generatedLayouts[breakpoint] = widgets.map((widget, index) => ({
        i: widget.id,
        x: (index * 2) % defaultCols[breakpoint as keyof typeof defaultCols],
        y:
          Math.floor(
            (index * 2) / defaultCols[breakpoint as keyof typeof defaultCols]
          ) * 2,
        w: widget.defaultWidth || 4,
        h: widget.defaultHeight || 4,
        minW: widget.minWidth || 2,
        minH: widget.minHeight || 2,
      }));
    });
    return generatedLayouts;
  }, [widgets, layouts]);

  const handleFullscreen = useCallback(
    (widgetId: string) => {
      if (fullscreenWidget === widgetId) {
        setFullscreenWidget(null);
        setIsFullscreen(false);
      } else {
        setFullscreenWidget(widgetId);
        setIsFullscreen(true);
      }
    },
    [fullscreenWidget]
  );

  const handleLayoutChange = useCallback(
    (
      currentLayout: LayoutItem[],
      allLayouts: { [key: string]: LayoutItem[] }
    ) => {
      if (onLayoutChange) {
        onLayoutChange(currentLayout, allLayouts);
      }
    },
    [onLayoutChange]
  );

  const renderWidget = useCallback(
    (widget: DashboardWidget) => {
      const WidgetComponent = widget.component;
      const isFullscreenWidget = fullscreenWidget === widget.id;

      return (
        <EnhancedCard
          key={widget.id}
          variant="default"
          className={cn(
            'h-full flex flex-col',
            isFullscreenWidget &&
              'z-50 fixed inset-4 bg-background border-2 border-primary'
          )}
          header={
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{widget.title}</h3>
              <div className="flex items-center gap-2">
                <IconButton
                  icon={<Maximize2 className="h-4 w-4" />}
                  onClick={() => handleFullscreen(widget.id)}
                  variant="ghost"
                  size="sm"
                  tooltip={
                    isFullscreenWidget ? 'Exit fullscreen' : 'Fullscreen'
                  }
                />
                {editable && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <IconButton
                        icon={<MoreVertical className="h-4 w-4" />}
                        variant="ghost"
                        size="sm"
                        tooltip="Widget options"
                        onClick={() => {}} // Empty function for dropdown trigger
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onRemoveWidget?.(widget.id)}
                      >
                        Remove Widget
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          }
        >
          <div className="flex-1 min-h-0">
            <WidgetComponent
              height={isFullscreenWidget ? window.innerHeight - 100 : undefined}
              isFullscreen={isFullscreenWidget}
              onFullscreen={() => handleFullscreen(widget.id)}
              {...widget.props}
            />
          </div>
        </EnhancedCard>
      );
    },
    [fullscreenWidget, editable, onRemoveWidget, handleFullscreen]
  );

  if (isFullscreen && fullscreenWidget) {
    const fullscreenWidgetData = widgets.find(w => w.id === fullscreenWidget);
    if (!fullscreenWidgetData) return null;

    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {fullscreenWidgetData.title}
          </h2>
          <IconButton
            icon={<Minimize2 className="h-4 w-4" />}
            onClick={() => handleFullscreen(fullscreenWidget)}
            variant="outline"
            size="sm"
          />
        </div>
        <div className="p-4">{renderWidget(fullscreenWidgetData)}</div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={componentStyles.heading.h2}>Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Customize your dashboard layout and widgets
          </p>
        </div>

        {editable && onAddWidget && (
          <div className="flex items-center gap-3">
            <EnhancedButton
              variant="outline"
              leftIcon={<Settings className="h-4 w-4" />}
              onClick={() => {
                /* Configure dashboard */
              }}
            >
              Configure
            </EnhancedButton>
            <EnhancedButton
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={onAddWidget}
            >
              Add Widget
            </EnhancedButton>
          </div>
        )}
      </div>

      {/* Grid Layout */}
      <div className="relative">
        <ResponsiveGridLayout
          className="layout"
          layouts={defaultLayouts}
          breakpoints={defaultBreakpoints}
          cols={defaultCols}
          rowHeight={100}
          isDraggable={editable}
          isResizable={editable}
          onLayoutChange={handleLayoutChange}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          useCSSTransforms={true}
          compactType="vertical"
          preventCollision={false}
        >
          {widgets.map(widget => (
            <div key={widget.id} className="h-full">
              {renderWidget(widget)}
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      {/* Empty State */}
      {widgets.length === 0 && (
        <EnhancedCard variant="outline" className="text-center py-12">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No widgets added</h3>
              <p className="text-muted-foreground mt-1">
                Add widgets to start building your dashboard
              </p>
            </div>
            {editable && onAddWidget && (
              <EnhancedButton
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={onAddWidget}
              >
                Add Your First Widget
              </EnhancedButton>
            )}
          </div>
        </EnhancedCard>
      )}
    </div>
  );
};

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
