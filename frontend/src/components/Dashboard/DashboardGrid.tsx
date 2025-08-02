import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Responsive, 
  WidthProvider,
  Layout as LayoutItem 
} from 'react-grid-layout';
import {
  Plus,
  Maximize2,
  Minimize2,
} from 'lucide-react';

// React Grid Layout CSS should be imported at the app level or in index.html

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType<{ height?: number; isFullscreen?: boolean; onFullscreen?: () => void }>;
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
  onLayoutChange?: (layout: LayoutItem[], layouts: { [key: string]: LayoutItem[] }) => void;
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
        y: Math.floor((index * 2) / defaultCols[breakpoint as keyof typeof defaultCols]) * 2,
        w: widget.defaultWidth || 4,
        h: widget.defaultHeight || 4,
        minW: widget.minWidth || 2,
        minH: widget.minHeight || 2,
      }));
    });
    return generatedLayouts;
  }, [widgets, layouts]);

  const handleLayoutChange = useCallback((layout: LayoutItem[], layouts: { [key: string]: LayoutItem[] }) => {
    if (onLayoutChange) {
      onLayoutChange(layout, layouts);
    }
  }, [onLayoutChange]);

  const handleWidgetFullscreen = useCallback((widgetId: string) => {
    if (fullscreenWidget === widgetId) {
      setFullscreenWidget(null);
      setIsFullscreen(false);
    } else {
      setFullscreenWidget(widgetId);
      setIsFullscreen(true);
    }
  }, [fullscreenWidget]);

  const handleAddWidget = useCallback((widgetId: string) => {
    if (onAddWidget) {
      onAddWidget();
    }
  }, [onAddWidget]);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    if (onRemoveWidget) {
      onRemoveWidget(widgetId);
    }
  }, [onRemoveWidget]);

  const renderWidget = useCallback((widget: DashboardWidget) => {
    const WidgetComponent = widget.component;
    const isFullscreen = fullscreenWidget === widget.id;

    return (
      <div key={widget.id} className="h-full w-full">
        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
          <h3 className="font-medium text-sm">{widget.title}</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleWidgetFullscreen(widget.id)}
              className="h-6 w-6 p-0"
            >
              {isFullscreen ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </Button>
            {editable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {availableWidgets.map((availableWidget) => (
                    <DropdownMenuItem
                      key={availableWidget.id}
                      onClick={() => handleAddWidget(availableWidget.id)}
                    >
                      {availableWidget.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="p-3">
          <WidgetComponent
            height={isFullscreen ? 600 : undefined}
            isFullscreen={isFullscreen}
            onFullscreen={() => handleWidgetFullscreen(widget.id)}
            {...widget.props}
          />
        </div>
      </div>
    );
  }, [fullscreenWidget, editable, availableWidgets, handleWidgetFullscreen, handleAddWidget]);

  if (isFullscreen && fullscreenWidget) {
    const fullscreenWidgetData = widgets.find(w => w.id === fullscreenWidget);
    if (!fullscreenWidgetData) return null;

    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{fullscreenWidgetData.title}</h2>
          <Button
            variant="outline"
            onClick={() => handleWidgetFullscreen(fullscreenWidget)}
          >
            <Minimize2 className="h-4 w-4 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
        <div className="p-4 h-[calc(100vh-80px)]">
          {renderWidget(fullscreenWidgetData)}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
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
        containerPadding={[16, 16]}
      >
        {widgets.map((widget) => (
          <div key={widget.id}>
            {renderWidget(widget)}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardGrid; 