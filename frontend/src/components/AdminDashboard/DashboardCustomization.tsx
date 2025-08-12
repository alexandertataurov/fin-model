/**
 * Dashboard Customization Component
 * 
 * Role-based dashboard layout and widget customization
 */

import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Settings,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Users,
  Database,
  Activity,
  Shield,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
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

export type UserRole = 'admin' | 'analyst' | 'editor' | 'viewer';

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

export const DashboardCustomization: React.FC<DashboardCustomizationProps> = memo(({
  userRole,
  onConfigChange,
  currentConfig = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>(currentConfig);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize widgets based on role if no current config
  useEffect(() => {
    if (currentConfig.length === 0) {
      const defaultWidgets = AVAILABLE_WIDGETS.filter(widget =>
        widget.requiredRole.includes(userRole)
      ).map(widget => ({
        ...widget,
        visible: ROLE_WIDGET_DEFAULTS[userRole][widget.type] ?? false,
      }));
      setWidgets(defaultWidgets);
    } else {
      setWidgets(currentConfig);
    }
  }, [currentConfig, userRole]);

  const handleWidgetToggle = useCallback((widgetId: string, visible: boolean) => {
    setWidgets(prev => prev.map(widget =>
      widget.id === widgetId ? { ...widget, visible } : widget
    ));
    setHasChanges(true);
  }, []);

  const handleReset = useCallback(() => {
    const defaultWidgets = AVAILABLE_WIDGETS.filter(widget =>
      widget.requiredRole.includes(userRole)
    ).map(widget => ({
      ...widget,
      visible: ROLE_WIDGET_DEFAULTS[userRole][widget.type] ?? false,
    }));
    setWidgets(defaultWidgets);
    setHasChanges(true);
  }, [userRole]);

  const handleSave = useCallback(() => {
    onConfigChange(widgets);
    setHasChanges(false);
    setIsOpen(false);
    toast.success('Dashboard configuration saved successfully');
  }, [widgets, onConfigChange]);

  const handleCancel = useCallback(() => {
    setWidgets(currentConfig);
    setHasChanges(false);
    setIsOpen(false);
  }, [currentConfig]);

  const visibleWidgets = widgets.filter(w => w.visible);
  const hiddenWidgets = widgets.filter(w => !w.visible);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Customize Dashboard
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Dashboard Customization
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Configure which widgets are visible on your dashboard based on your role and preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Role Information */}
            <Card>
              <CardHeader
                className="p-6"
              >
                <CardTitle className="text-lg">
                  Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent
                className="p-6"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    {userRole}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    You can customize {widgets.length} available widgets
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Visible Widgets */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Visible Widgets ({visibleWidgets.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleWidgets.map(widget => (
                  <Card key={widget.id} className="border-green-200 bg-green-50/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            {widget.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{widget.title}</h4>
                            <p className="text-sm text-muted-foreground">{widget.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={widget.visible}
                          onCheckedChange={(checked) => handleWidgetToggle(widget.id, checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Hidden Widgets */}
            {hiddenWidgets.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <EyeOff className="h-5 w-5 text-gray-500" />
                  Hidden Widgets ({hiddenWidgets.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hiddenWidgets.map(widget => (
                    <Card key={widget.id} className="border-gray-200 bg-gray-50/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              {widget.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{widget.title}</h4>
                              <p className="text-sm text-muted-foreground">{widget.description}</p>
                            </div>
                          </div>
                          <Switch
                            checked={widget.visible}
                            onCheckedChange={(checked) => handleWidgetToggle(widget.id, checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Widget Size Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Widget Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleWidgets.map(widget => (
                    <Card key={widget.id} className="p-3">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              {widget.icon}
                            </div>
                            <span className="font-medium">{widget.title}</span>
                          </div>
                          <Select
                            value={widget.size}
                            onValueChange={(value) => {
                              setWidgets(prev => prev.map(w =>
                                w.id === widget.id ? { ...w, size: value as any } : w
                              ));
                              setHasChanges(true);
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="full-width">Full Width</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

DashboardCustomization.displayName = 'DashboardCustomization';

export default DashboardCustomization;
