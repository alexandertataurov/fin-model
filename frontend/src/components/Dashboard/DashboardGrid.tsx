import React, { useState, useCallback, useMemo } from 'react';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { 
  Responsive, 
  WidthProvider,
  Layout as LayoutItem 
} from 'react-grid-layout';
import {
  Add as AddIcon,
  FullscreenExit as ExitFullscreenIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';

// Import CSS for react-grid-layout
import 'react-grid-layout/css/styles.css';
import 'react-grid-layout/css/resizable.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: any;
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
  const [addMenuAnchor, setAddMenuAnchor] = useState<HTMLElement | null>(null);

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
    setFullscreenWidget(widgetId);
    setIsFullscreen(true);
  }, []);

  const handleExitFullscreen = useCallback(() => {
    setIsFullscreen(false);
    setFullscreenWidget(null);
  }, []);

  const handleAddWidget = useCallback((_widget: DashboardWidget) => {
    setAddMenuAnchor(null);
    if (onAddWidget) {
      onAddWidget();
    }
  }, [onAddWidget]);

  // Render fullscreen widget
  if (isFullscreen && fullscreenWidget) {
    const widget = widgets.find(w => w.id === fullscreenWidget);
    if (widget) {
      const WidgetComponent = widget.component;
      return (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6">{widget.title}</Typography>
            <IconButton onClick={handleExitFullscreen}>
              <ExitFullscreenIcon />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
            <WidgetComponent
              {...widget.props}
              onFullscreen={() => handleExitFullscreen()}
              isFullscreen={true}
            />
          </Box>
        </Box>
      );
    }
  }

  return (
    <Box className={className} sx={{ position: 'relative' }}>
      {/* Add Widget Button */}
      {editable && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: 16,
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={(e) => setAddMenuAnchor(e.currentTarget)}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <AddIcon />
          </IconButton>
          
          <Menu
            anchorEl={addMenuAnchor}
            open={Boolean(addMenuAnchor)}
            onClose={() => setAddMenuAnchor(null)}
          >
            {availableWidgets.map((widget) => (
              <MenuItem
                key={widget.id}
                onClick={() => handleAddWidget(widget)}
              >
                {widget.title}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}

      {/* Grid Layout */}
      <ResponsiveGridLayout
        className="dashboard-grid"
        layouts={defaultLayouts}
        breakpoints={defaultBreakpoints}
        cols={defaultCols}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        isDraggable={editable}
        isResizable={editable}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
        preventCollision={false}
        compactType="vertical"
      >
        {widgets.map((widget) => {
          const WidgetComponent = widget.component;
          return (
            <Box
              key={widget.id}
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: 1,
                overflow: 'hidden',
                border: 1,
                borderColor: 'divider',
                position: 'relative',
                '&:hover .widget-actions': {
                  opacity: 1,
                },
              }}
            >
              {/* Widget Actions */}
              {editable && (
                <Box
                  className="widget-actions"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 10,
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out',
                    display: 'flex',
                    gap: 0.5,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleWidgetFullscreen(widget.id)}
                    sx={{
                      backgroundColor: 'background.paper',
                      boxShadow: 1,
                    }}
                  >
                    <FullscreenIcon fontSize="small" />
                  </IconButton>
                  {onRemoveWidget && (
                    <IconButton
                      size="small"
                      onClick={() => onRemoveWidget(widget.id)}
                      sx={{
                        backgroundColor: 'background.paper',
                        boxShadow: 1,
                        color: 'error.main',
                      }}
                    >
                      ×
                    </IconButton>
                  )}
                </Box>
              )}

              {/* Widget Content */}
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <WidgetComponent
                  {...widget.props}
                  onFullscreen={() => handleWidgetFullscreen(widget.id)}
                />
              </Box>
            </Box>
          );
        })}
      </ResponsiveGridLayout>
    </Box>
  );
};

export default DashboardGrid; 