import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Switch } from '../components/Switch';
import { Label } from '../components/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Badge } from '../components/Badge';
import { 
  Bell,
  Moon,
  Sun,
  Wifi,
  Shield,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Zap,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Settings,
  User,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

const meta: Meta<typeof Switch> = {
  title: '🎨 Design System/Components/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Switch Component

A toggle switch component that provides a clean interface for binary choices. The Switch component is perfect for enabling/disabling features, toggling settings, and other on/off states.

## Key Features

- **🎨 Accessible**: Built with proper ARIA attributes and keyboard navigation
- **📱 Responsive**: Adapts to different screen sizes
- **🎯 Customizable**: Flexible styling and content options
- **♿ Screen Reader Support**: Full accessibility compliance
- **🎭 Design System**: Consistent with design tokens and theming
- **🧩 Composition**: Works well with labels and other form components

## Usage

\`\`\`tsx
import { Switch } from '@/design-system';

// Basic switch
<Switch />

// With label
<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane mode</Label>
</div>

// Controlled switch
const [checked, setChecked] = useState(false);

<Switch 
  checked={checked} 
  onCheckedChange={setChecked} 
/>
\`\`\`

## Design Principles

1. **Accessibility**: Full keyboard navigation and screen reader support
2. **Clarity**: Clear visual feedback for on/off states
3. **Consistency**: Unified design patterns across all switches
4. **Feedback**: Immediate visual feedback for state changes
5. **Performance**: Optimized rendering and minimal bundle impact
        `,
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    onCheckedChange: {
      action: 'checked',
      description: 'Callback when the switch state changes',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Switch
export const Basic: Story = {
  args: {},
};

// Switch with Label
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane mode</Label>
    </div>
  ),
};

// Switch States
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch defaultChecked />
        <Label>Enabled (default checked)</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch />
        <Label>Disabled (unchecked)</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch disabled />
        <Label>Disabled (unchecked)</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch disabled defaultChecked />
        <Label>Disabled (checked)</Label>
      </div>
    </div>
  ),
};

// Settings Switches
export const SettingsSwitches: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure your notification preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <Label htmlFor="push-notifications">Push notifications</Label>
          </div>
          <Switch id="push-notifications" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <Label htmlFor="email-notifications">Email notifications</Label>
          </div>
          <Switch id="email-notifications" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4" />
            <Label htmlFor="wifi-only">Wi-Fi only</Label>
          </div>
          <Switch id="wifi-only" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <Label htmlFor="security-alerts">Security alerts</Label>
          </div>
          <Switch id="security-alerts" defaultChecked />
        </div>
      </CardContent>
    </Card>
  ),
};

// Theme Switches
export const ThemeSwitches: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize your app appearance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Moon className="h-4 w-4" />
            <Label htmlFor="dark-mode">Dark mode</Label>
          </div>
          <Switch id="dark-mode" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Monitor className="h-4 w-4" />
            <Label htmlFor="system-theme">Use system theme</Label>
          </div>
          <Switch id="system-theme" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <Label htmlFor="reduced-motion">Reduce motion</Label>
          </div>
          <Switch id="reduced-motion" />
        </div>
      </CardContent>
    </Card>
  ),
};

// Security Switches
export const SecuritySwitches: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your account security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <Label htmlFor="two-factor">Two-factor authentication</Label>
          </div>
          <Switch id="two-factor" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <Label htmlFor="show-password">Show password</Label>
          </div>
          <Switch id="show-password" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <Label htmlFor="auto-lock">Auto-lock after 5 minutes</Label>
          </div>
          <Switch id="auto-lock" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <Label htmlFor="security-alerts">Security alerts</Label>
          </div>
          <Switch id="security-alerts" defaultChecked />
        </div>
      </CardContent>
    </Card>
  ),
};

// Financial Settings
export const FinancialSettings: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Financial Preferences</CardTitle>
        <CardDescription>
          Configure your financial dashboard settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <Label htmlFor="show-currency">Show currency symbols</Label>
          </div>
          <Switch id="show-currency" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <Label htmlFor="show-charts">Show charts by default</Label>
          </div>
          <Switch id="show-charts" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <Label htmlFor="auto-save">Auto-save changes</Label>
          </div>
          <Switch id="auto-save" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <Label htmlFor="share-data">Share data for analytics</Label>
          </div>
          <Switch id="share-data" />
        </div>
      </CardContent>
    </Card>
  ),
};

// Switch with Status
export const SwitchWithStatus: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <Label htmlFor="feature-1">Feature enabled</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="feature-1" defaultChecked />
          <Badge variant="success">Active</Badge>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <XCircle className="h-4 w-4 text-red-500" />
          <Label htmlFor="feature-2">Feature disabled</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="feature-2" />
          <Badge variant="secondary">Inactive</Badge>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <Label htmlFor="feature-3">Beta feature</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="feature-3" />
          <Badge variant="warning">Beta</Badge>
        </div>
      </div>
    </div>
  ),
};

// Switch Groups
export const SwitchGroups: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Privacy Settings</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="profile-visible">Profile visible to public</Label>
            <Switch id="profile-visible" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-email">Show email address</Label>
            <Switch id="show-email" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-location">Show location</Label>
            <Switch id="show-location" />
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">Performance</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-update">Auto-update</Label>
            <Switch id="auto-update" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="background-sync">Background sync</Label>
            <Switch id="background-sync" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="cache-data">Cache data</Label>
            <Switch id="cache-data" defaultChecked />
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">Accessibility</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High contrast mode</Label>
            <Switch id="high-contrast" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="screen-reader">Screen reader support</Label>
            <Switch id="screen-reader" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="keyboard-nav">Keyboard navigation</Label>
            <Switch id="keyboard-nav" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  ),
};

// Interactive Switches
export const InteractiveSwitches: Story = {
  render: () => {
    const [states, setStates] = React.useState({
      notifications: true,
      darkMode: false,
      autoSave: true,
      analytics: false,
    });

    const handleToggle = (key: keyof typeof states) => {
      setStates(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
    };

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Interactive Settings</CardTitle>
          <CardDescription>
            Click the switches to see state changes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <Label>Notifications</Label>
            </div>
            <Switch 
              checked={states.notifications}
              onCheckedChange={() => handleToggle('notifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Moon className="h-4 w-4" />
              <Label>Dark Mode</Label>
            </div>
            <Switch 
              checked={states.darkMode}
              onCheckedChange={() => handleToggle('darkMode')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <Label>Auto Save</Label>
            </div>
            <Switch 
              checked={states.autoSave}
              onCheckedChange={() => handleToggle('autoSave')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <Label>Analytics</Label>
            </div>
            <Switch 
              checked={states.analytics}
              onCheckedChange={() => handleToggle('analytics')}
            />
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Current State:</p>
            <pre className="text-xs text-muted-foreground">
              {JSON.stringify(states, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  },
};
