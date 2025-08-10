import type { Meta } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription,
} from '@/design-system';
import { tokens } from '../tokens';

// Theme context and provider
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  customColors: Record<string, string>;
  updateCustomColor: (key: string, value: string) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState('light');
  const [customColors, setCustomColors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);

    // Apply custom colors as CSS variables
    Object.entries(customColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [theme, customColors]);

  const updateCustomColor = (key: string, value: string) => {
    setCustomColors(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, customColors, updateCustomColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme Switcher Component
const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'brand', name: 'Brand', icon: '🎨' },
    { id: 'high-contrast', name: 'High Contrast', icon: '🔍' },
    { id: 'sepia', name: 'Sepia', icon: '📜' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Switcher</CardTitle>
        <CardDescription>
          Switch between different theme variations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {themes.map(themeOption => (
            <Button
              key={themeOption.id}
              variant={theme === themeOption.id ? 'default' : 'outline'}
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => setTheme(themeOption.id)}
            >
              <span className="text-2xl">{themeOption.icon}</span>
              <span className="text-xs">{themeOption.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Color Palette Display
const ColorPalette = () => {
  const { theme } = useTheme();

  const colorCategories = {
    'Primary Colors': ['primary', 'primary-foreground', 'primary-hover'],
    'Secondary Colors': [
      'secondary',
      'secondary-foreground',
      'secondary-hover',
    ],
    'Accent Colors': ['accent', 'accent-foreground'],
    'Background Colors': [
      'background',
      'foreground',
      'card',
      'card-foreground',
    ],
    'Border Colors': ['border', 'input', 'ring'],
    'Status Colors': [
      'destructive',
      'destructive-foreground',
      'success',
      'warning',
      'info',
    ],
    'Muted Colors': [
      'muted',
      'muted-foreground',
      'popover',
      'popover-foreground',
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Color Palette - {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
        </CardTitle>
        <CardDescription>
          Current theme color tokens and their values
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(colorCategories).map(([category, colors]) => (
            <div key={category}>
              <h4 className="font-medium mb-3">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {colors.map(colorKey => {
                  const cssVar = `--${colorKey}`;
                  const computedValue = getComputedStyle(
                    document.documentElement
                  ).getPropertyValue(cssVar);

                  return (
                    <div
                      key={colorKey}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div
                        className="w-8 h-8 rounded border shadow-sm"
                        style={{ backgroundColor: `var(--${colorKey})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm">{colorKey}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {computedValue || 'Not defined'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Custom Color Editor
const CustomColorEditor = () => {
  const { customColors, updateCustomColor } = useTheme();

  const [newColorKey, setNewColorKey] = useState('');
  const [newColorValue, setNewColorValue] = useState('#000000');

  const addCustomColor = () => {
    if (newColorKey && newColorValue) {
      updateCustomColor(newColorKey, newColorValue);
      setNewColorKey('');
      setNewColorValue('#000000');
    }
  };

  const removeCustomColor = (key: string) => {
    const { [key]: removed, ...rest } = customColors;
    Object.entries(rest).forEach(([k, v]) => updateCustomColor(k, v));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Color Editor</CardTitle>
        <CardDescription>Add and modify custom color tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add new color */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="colorKey">Color Key</Label>
              <Input
                id="colorKey"
                placeholder="e.g., custom-primary"
                value={newColorKey}
                onChange={e => setNewColorKey(e.target.value)}
              />
            </div>
            <div className="w-24">
              <Label htmlFor="colorValue">Color</Label>
              <Input
                id="colorValue"
                type="color"
                value={newColorValue}
                onChange={e => setNewColorValue(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={addCustomColor}
                disabled={!newColorKey || !newColorValue}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Existing custom colors */}
          {Object.keys(customColors).length > 0 && (
            <div>
              <Label>Custom Colors</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {Object.entries(customColors).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div
                      className="w-6 h-6 rounded border shadow-sm"
                      style={{ backgroundColor: value }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm">{key}</div>
                      <div className="text-xs text-muted-foreground">
                        {value}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeCustomColor(key)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Typography System
const TypographySystem = () => {
  const { theme } = useTheme();

  const typographyTokens = {
    Display: ['display-1', 'display-2', 'display-3'],
    Headings: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    Body: ['body-large', 'body', 'body-small'],
    Labels: ['label-large', 'label', 'label-small'],
    Captions: ['caption', 'caption-small'],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Typography System - {theme.charAt(0).toUpperCase() + theme.slice(1)}{' '}
          Theme
        </CardTitle>
        <CardDescription>Font sizes, weights, and line heights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(typographyTokens).map(([category, tokens]) => (
            <div key={category}>
              <h4 className="font-medium mb-3">{category}</h4>
              <div className="space-y-3">
                {tokens.map(token => (
                  <div key={token} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        {token}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getComputedStyle(
                          document.documentElement
                        ).getPropertyValue(`--typography-font-size-${token}`) || 'Default'}
                      </Badge>
                    </div>
                    <div
                      className="text-foreground"
                      style={{
                        fontSize: `var(--typography-font-size-${token})`,
                        fontWeight: `var(--typography-font-weight-${token})`,
                        lineHeight: `var(--typography-line-height-${token})`,
                      }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Spacing and Layout
const SpacingAndLayout = () => {
  const { theme } = useTheme();

  const spacingTokens = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
  const borderRadiusTokens = ['none', 'sm', 'md', 'lg', 'xl', 'full'];
  const shadowTokens = ['none', 'sm', 'md', 'lg', 'xl', '2xl'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Spacing & Layout - {theme.charAt(0).toUpperCase() + theme.slice(1)}{' '}
          Theme
        </CardTitle>
        <CardDescription>
          Spacing, border radius, and shadow tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Spacing */}
          <div>
            <h4 className="font-medium mb-3">Spacing Scale</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {spacingTokens.map(token => (
                <div key={token} className="text-center">
                  <div
                    className="mx-auto mb-2 bg-primary rounded"
                    style={{
                      width: `var(--spacing-${token})`,
                      height: `var(--spacing-${token})`,
                    }}
                  />
                  <div className="font-mono text-xs">{token}</div>
                  <div className="text-xs text-muted-foreground">
                    {getComputedStyle(
                      document.documentElement
                    ).getPropertyValue(`--spacing-${token}`) || 'Default'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <h4 className="font-medium mb-3">Border Radius</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {borderRadiusTokens.map(token => (
                <div key={token} className="text-center">
                  <div
                    className="mx-auto mb-2 bg-primary"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: `var(--border-radius-${token})`,
                    }}
                  />
                  <div className="font-mono text-xs">{token}</div>
                  <div className="text-xs text-muted-foreground">
                    {getComputedStyle(
                      document.documentElement
                    ).getPropertyValue(`--border-radius-${token}`) || 'Default'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shadows */}
          <div>
            <h4 className="font-medium mb-3">Shadow System</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {shadowTokens.map(token => (
                <div key={token} className="text-center">
                  <div
                    className="mx-auto mb-2 bg-background border rounded-lg"
                    style={{
                      width: '80px',
                      height: '60px',
                      boxShadow: `var(--shadows-${token})`,
                    }}
                  />
                  <div className="font-mono text-xs">{token}</div>
                  <div className="text-xs text-muted-foreground">
                    {getComputedStyle(
                      document.documentElement
                    ).getPropertyValue(`--shadows-${token}`) || 'Default'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Theme Preview
const ThemePreview = () => {
  const { theme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Theme Preview - {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
        </CardTitle>
        <CardDescription>
          See how components look in the current theme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Component showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>Buttons</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Form Elements</Label>
              <div className="space-y-2">
                <Input placeholder="Sample input" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Cards and content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sample Card</CardTitle>
                <CardDescription>This shows the current theme</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card demonstrates how the current theme affects component
                  appearance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="default">Active</Badge>
                  <Badge variant="secondary">Pending</Badge>
                  <Badge variant="destructive">Error</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    Primary Action
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Secondary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert examples */}
          <div className="space-y-2">
            <Alert>
              <AlertDescription>
                This is an informational alert in the current theme.
              </AlertDescription>
            </Alert>
            <Alert className="border-destructive bg-destructive/10">
              <AlertDescription className="text-destructive">
                This is an error alert in the current theme.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
const AdvancedThemingShowcase = () => {
  return (
    <ThemeProvider>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Advanced Theming System</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive theming with Light/Dark/Brand variations and custom
            color management
          </p>
        </div>

        <Separator />

        <ThemeSwitcher />

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6">
            <ColorPalette />
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <TypographySystem />
          </TabsContent>

          <TabsContent value="spacing" className="space-y-6">
            <SpacingAndLayout />
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <CustomColorEditor />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <ThemePreview />
          </TabsContent>
        </Tabs>
      </div>
    </ThemeProvider>
  );
};

const meta: Meta = {
  title: 'Design System/Advanced Theming',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Advanced theming system with Light/Dark/Brand variations, toolbar toggle, and comprehensive theming token documentation. Includes color palette, typography system, spacing, and custom color management.',
      },
    },
    layout: 'padded',
  },
};

export default meta;
type StoryObj = StoryObj<typeof meta>;

export const ThemeSwitcherDemo: StoryObj = {
  render: () => (
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive theme switcher with multiple theme variations including Light, Dark, Brand, High Contrast, and Sepia.',
      },
    },
  },
};

export const ColorPaletteDemo: StoryObj = {
  render: () => (
    <ThemeProvider>
      <ColorPalette />
    </ThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Dynamic color palette display showing current theme colors with visual swatches and CSS variable values.',
      },
    },
  },
};

export const TypographySystemDemo: StoryObj = {
  render: () => (
    <ThemeProvider>
      <TypographySystem />
    </ThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Typography system showcase displaying font sizes, weights, and line heights for the current theme.',
      },
    },
  },
};

export const SpacingAndLayoutDemo: StoryObj = {
  render: () => (
    <ThemeProvider>
      <SpacingAndLayout />
    </ThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Spacing scale, border radius, and shadow system visualization with interactive token display.',
      },
    },
  },
};

export const CustomColorEditorDemo: StoryObj = {
  render: () => (
    <ThemeProvider>
      <CustomColorEditor />
    </ThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive custom color editor for adding, modifying, and removing custom color tokens.',
      },
    },
  },
};

export const ThemePreviewDemo: StoryObj = {
  render: () => (
    <ThemeProvider>
      <ThemePreview />
    </ThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Live theme preview showing how components appear in the current theme with real-time updates.',
      },
    },
  },
};

export const CompleteThemingShowcase: StoryObj = {
  render: () => <AdvancedThemingShowcase />,
  parameters: {
    docs: {
      description: {
        story:
          'Complete advanced theming showcase with all features including theme switching, color management, typography, spacing, and live previews.',
      },
    },
  },
};
