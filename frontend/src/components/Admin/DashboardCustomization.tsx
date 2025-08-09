/**
 * Dashboard Customization Component
 * 
 * Role-based dashboard layout and widget customization
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  GripVertical,
  Save,
  RotateCcw,
  Users,
  Database,
  Activity,
  Shield,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Switch } from '@/design-system/components/Switch';
import { Badge } from '@/design-system/components/Badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/design-system/components/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/design-system/components/Select';
import { toast } from 'sonner';

// Dashboard widget types
export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  icon: React.ReactNode;
  visible: boolean;
  position: number;
  size: 'small' | 'medium' | 'large' | 'full-width';
  requiredRole: UserRole[];
  settings?: Record<string, any>;
}

export type WidgetType = 
  | 'system-stats'
  | 'user-activity' 
  | 'system-metrics'
  | 'security-audit'
  | 'logs'
  | 'maintenance'
  | 'performance'
  | 'alerts';

export type UserRole = 'admin' | 'analyst' | 'viewer' | 'editor';

// Default widget configurations based on role
const ROLE_WIDGET_DEFAULTS: Record<UserRole, Partial<Record<WidgetType, boolean>>> = {
  admin: {
    'system-stats': true,
    'user-activity': true,
    'system-metrics': true,
    'security-audit': true,
    'logs': true,
    'maintenance': true,
    'performance': true,
    'alerts': true,
  },
  analyst: {
    'system-stats': true,
    'user-activity': true,
    'system-metrics': true,
    'security-audit': false,
    'logs': true,
    'maintenance': false,
    'performance': true,
    'alerts': true,
  },
  editor: {
    'system-stats': false,
    'user-activity': true,
    'system-metrics': false,
    'security-audit': false,
    'logs': false,
    'maintenance': false,
    'performance': false,
    'alerts': true,
  },
  viewer: {
    'system-stats': true,
    'user-activity': false,
    'system-metrics': true,
    'security-audit': false,
    'logs': false,
    'maintenance': false,
    'performance': true,
    'alerts': true,
  },
};

// Available widgets catalog
const AVAILABLE_WIDGETS: DashboardWidget[] = [
  {
    id: 'system-stats',
    type: 'system-stats',
    title: 'System Statistics',
    description: 'Overall system health and usage metrics',
    icon: <Database className="h-5 w-5" />,
    visible: true,
    position: 0,
    size: 'large',
    requiredRole: ['admin', 'analyst', 'viewer'],
  },
  {
    id: 'user-activity',
    type: 'user-activity',
    title: 'User Activity',
    description: 'Recent user actions and engagement',
    icon: <Users className="h-5 w-5" />,
    visible: true,
    position: 1,
    size: 'medium',
    requiredRole: ['admin', 'analyst', 'editor'],
  },
  {
    id: 'system-metrics',
    type: 'system-metrics',
    title: 'System Metrics',
    description: 'CPU, memory, and performance monitoring',
    icon: <Activity className="h-5 w-5" />,
    visible: true,
    position: 2,
    size: 'medium',
    requiredRole: ['admin', 'analyst', 'viewer'],
  },
  {
    id: 'security-audit',
    type: 'security-audit',
    title: 'Security Audit',
    description: 'Security events and compliance monitoring',
    icon: <Shield className="h-5 w-5" />,
    visible: false,
    position: 3,
    size: 'medium',
    requiredRole: ['admin'],
  },
  {
    id: 'logs',
    type: 'logs',
    title: 'System Logs',
    description: 'Application and system log entries',
    icon: <FileText className="h-5 w-5" />,
    visible: false,
    position: 4,
    size: 'full-width',
    requiredRole: ['admin', 'analyst'],
  },
  {
    id: 'alerts',
    type: 'alerts',
    title: 'System Alerts',
    description: 'Critical alerts and notifications',
    icon: <AlertCircle className="h-5 w-5" />,
    visible: true,
    position: 5,
    size: 'small',
    requiredRole: ['admin', 'analyst', 'editor', 'viewer'],
  },
];

interface DashboardCustomizationProps {
  userRole: UserRole;
  onConfigChange: (config: DashboardWidget[]) => void;
  currentConfig?: DashboardWidget[];
}

export const DashboardCustomization: React.FC<DashboardCustomizationProps> = ({
  userRole,
  onConfigChange,
  currentConfig,
}) => {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  // Initialize widgets based on role and current config
  useEffect(() => {
    if (currentConfig) {
      setWidgets(currentConfig);
    } else {
      // Initialize with role defaults
      const roleDefaults = ROLE_WIDGET_DEFAULTS[userRole] || {};
      const initialWidgets = AVAILABLE_WIDGETS
        .filter(widget => widget.requiredRole.includes(userRole))
        .map(widget => ({
          ...widget,
          visible: roleDefaults[widget.type] ?? widget.visible,
        }))
        .sort((a, b) => a.position - b.position);
      
      setWidgets(initialWidgets);
    }
  }, [userRole, currentConfig]);

  const handleWidgetToggle = (widgetId: string) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    );
  };

  const handleWidgetReorder = (fromIndex: number, toIndex: number) => {
    setWidgets(prev => {
      const newWidgets = [...prev];
      const [removed] = newWidgets.splice(fromIndex, 1);
      newWidgets.splice(toIndex, 0, removed);
      
      // Update positions
      return newWidgets.map((widget, index) => ({
        ...widget,
        position: index,
      }));
    });
  };

  const handleSizeChange = (widgetId: string, size: DashboardWidget['size']) => {
    setWidgets(prev =>
      prev.map(widget =>
        widget.id === widgetId ? { ...widget, size } : widget
      )
    );
  };

  const handleSave = () => {
    onConfigChange(widgets);
    setIsOpen(false);
    toast.success('Dashboard layout saved successfully');
  };

  const handleReset = () => {
    const roleDefaults = ROLE_WIDGET_DEFAULTS[userRole] || {};
    const resetWidgets = AVAILABLE_WIDGETS
      .filter(widget => widget.requiredRole.includes(userRole))
      .map(widget => ({
        ...widget,
        visible: roleDefaults[widget.type] ?? widget.visible,
      }))
      .sort((a, b) => a.position - b.position);
    
    setWidgets(resetWidgets);
    toast.info('Dashboard layout reset to defaults');
  };

  const availableWidgetsCount = widgets.filter(w => w.requiredRole.includes(userRole)).length;
  const visibleWidgetsCount = widgets.filter(w => w.visible && w.requiredRole.includes(userRole)).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dashboard Customization</DialogTitle>
          <DialogDescription>
            Customize your dashboard layout and widget visibility. 
            Role: <Badge variant="secondary">{userRole}</Badge> | 
            Showing {visibleWidgetsCount} of {availableWidgetsCount} available widgets
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWidgets(prev => prev.map(w => ({ ...w, visible: true })))}
              >
                <Eye className="h-4 w-4 mr-2" />
                Show All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWidgets(prev => prev.map(w => ({ ...w, visible: false })))}
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Hide All
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>

          {/* Widget Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Widget Configuration</h3>
            <div className="grid gap-4">
              {widgets
                .filter(widget => widget.requiredRole.includes(userRole))
                .sort((a, b) => a.position - b.position)
                .map((widget, _index) => (
                  <Card 
                    key={widget.id}
                    className={`transition-all ${
                      draggedWidget === widget.id ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={() => setDraggedWidget(widget.id)}
                    onDragEnd={() => setDraggedWidget(null)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedWidget && draggedWidget !== widget.id) {
                        const fromIndex = widgets.findIndex(w => w.id === draggedWidget);
                        const toIndex = widgets.findIndex(w => w.id === widget.id);
                        handleWidgetReorder(fromIndex, toIndex);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                          <div className="flex items-center space-x-2">
                            {widget.icon}
                            <div>
                              <div className="font-medium">{widget.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {widget.description}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {/* Size selector */}
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Size:</span>
                            <Select
                              value={widget.size}
                              onValueChange={(value) => 
                                handleSizeChange(widget.id, value as DashboardWidget['size'])
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                                <SelectItem value="full-width">Full</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Visibility toggle */}
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Visible:</span>
                            <Switch
                              checked={widget.visible}
                              onCheckedChange={() => handleWidgetToggle(widget.id)}
                            />
                          </div>

                          {/* Position indicator */}
                          <Badge variant="outline" className="text-xs">
                            #{widget.position + 1}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Layout Preview</h3>
            <div className="border rounded-lg p-4 bg-muted/20">
              <div className="grid grid-cols-12 gap-4">
                {widgets
                  .filter(w => w.visible && w.requiredRole.includes(userRole))
                  .sort((a, b) => a.position - b.position)
                  .map(widget => (
                    <div
                      key={widget.id}
                      className={`
                        bg-background border rounded p-3 flex items-center justify-center text-sm
                        ${widget.size === 'small' ? 'col-span-3' : ''}
                        ${widget.size === 'medium' ? 'col-span-6' : ''}
                        ${widget.size === 'large' ? 'col-span-9' : ''}
                        ${widget.size === 'full-width' ? 'col-span-12' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        {widget.icon}
                        <span>{widget.title}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Hook for managing dashboard configuration
export const useDashboardConfig = (userRole: UserRole) => {
  const [config, setConfig] = useState<DashboardWidget[]>([]);

  const initializeDefaults = useCallback(() => {
    const roleDefaults = ROLE_WIDGET_DEFAULTS[userRole] || {};
    const defaultConfig = AVAILABLE_WIDGETS
      .filter(widget => widget.requiredRole.includes(userRole))
      .map(widget => ({
        ...widget,
        visible: roleDefaults[widget.type] ?? widget.visible,
      }))
      .sort((a, b) => a.position - b.position);

    setConfig(defaultConfig);
  }, [userRole]);

  useEffect(() => {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem(`dashboard-config-${userRole}`);
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Failed to parse dashboard config:', error);
        // Fall back to defaults
        initializeDefaults();
      }
    } else {
      initializeDefaults();
    }
  }, [userRole, initializeDefaults]);

  const saveConfig = (newConfig: DashboardWidget[]) => {
    setConfig(newConfig);
    localStorage.setItem(`dashboard-config-${userRole}`, JSON.stringify(newConfig));
  };

  const resetConfig = () => {
    localStorage.removeItem(`dashboard-config-${userRole}`);
    initializeDefaults();
  };

  const getVisibleWidgets = () => {
    return config
      .filter(widget => widget.visible && widget.requiredRole.includes(userRole))
      .sort((a, b) => a.position - b.position);
  };

  return {
    config,
    saveConfig,
    resetConfig,
    getVisibleWidgets,
  };
};
