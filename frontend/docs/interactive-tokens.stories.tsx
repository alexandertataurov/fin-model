import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { Input } from '../src/components/ui/input';
import { Badge } from '../src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/components/ui/tabs';
import { designTokens, colorTokens, componentTokens } from '../src/components/ui/utils/tokens';
import { useDesignTokens } from '../src/hooks/useDesignTokens';

const meta: Meta = {
  title: 'Foundation/Interactive Design Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Interactive Design Token Explorer

Explore and test design tokens interactively. This tool helps designers and developers understand how tokens work together and provides real-time examples of token usage.

## Features

- **Live Token Browser**: Browse all available tokens with live examples
- **Copy-to-Clipboard**: Quickly copy token values and CSS custom properties
- **Interactive Examples**: See tokens in action with real components
- **Accessibility Testing**: View contrast ratios and accessibility information
- **Theme Switching**: Test tokens across light and dark themes

## Usage

Use this tool to:
- Find the right token for your use case
- Test color combinations for accessibility
- Copy token values for implementation
- Understand the design system hierarchy
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const TokenCard = ({ 
  name, 
  value, 
  cssVar, 
  category, 
  usage, 
  preview 
}: {
  name: string;
  value: string | [string, object];
  cssVar?: string;
  category: string;
  usage?: string;
  preview?: React.ReactNode;
}) => {
  const [copied, setCopied] = useState(false);
  
  const displayValue = Array.isArray(value) ? value[0] : value;
  const copyValue = cssVar || displayValue;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(copyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2 text-xs"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </Button>
        </div>
        <Badge variant="secondary" className="w-fit text-xs">
          {category}
        </Badge>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {preview && (
          <div className="p-3 rounded-md border bg-muted/50">
            {preview}
          </div>
        )}
        <div className="space-y-2">
          <div className="font-mono text-sm bg-background p-2 rounded border">
            {displayValue}
          </div>
          {cssVar && (
            <div className="font-mono text-xs text-muted-foreground bg-background p-2 rounded border">
              {cssVar}
            </div>
          )}
          {Array.isArray(value) && value[1] && (
            <div className="text-xs text-muted-foreground">
              Line height: {(value[1] as any).lineHeight}
            </div>
          )}
        </div>
        {usage && (
          <p className="text-xs text-muted-foreground">{usage}</p>
        )}
      </CardContent>
    </Card>
  );
};

const ColorSwatch = ({ 
  color, 
  name, 
  textColor = 'white' 
}: { 
  color: string; 
  name: string; 
  textColor?: string;
}) => (
  <div className="space-y-2">
    <div 
      className="h-16 rounded-md border flex items-center justify-center text-sm font-medium"
      style={{ backgroundColor: color, color: textColor }}
    >
      {name}
    </div>
    <p className="text-xs font-mono text-center">{color}</p>
  </div>
);

const TokenExplorerComponent = () => {
  const tokens = useDesignTokens();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const spacingTokens = Object.entries(designTokens.spacing).map(([key, value]) => ({
    name: `spacing-${key}`,
    value,
    cssVar: `var(--spacing-${key})`,
    category: 'spacing',
    usage: `Used for margins, padding, and gap properties`,
    preview: (
      <div className="flex items-center gap-2">
        <div 
          className="bg-primary rounded h-4"
          style={{ width: value }}
        />
        <span className="text-sm font-mono">{value}</span>
      </div>
    )
  }));

  const fontSizeTokens = Object.entries(designTokens.fontSize).map(([key, value]) => ({
    name: `text-${key}`,
    value,
    cssVar: `var(--text-${key})`,
    category: 'typography',
    usage: 'Font size with optimized line height',
    preview: (
      <div 
        className="text-foreground"
        style={{ fontSize: Array.isArray(value) ? value[0] : value }}
      >
        Sample Text ({Array.isArray(value) ? value[0] : value})
      </div>
    )
  }));

  const borderRadiusTokens = Object.entries(designTokens.borderRadius).map(([key, value]) => ({
    name: `radius-${key}`,
    value,
    cssVar: `var(--radius-${key})`,
    category: 'borders',
    usage: 'Border radius for components',
    preview: (
      <div 
        className="w-12 h-12 bg-primary"
        style={{ borderRadius: value }}
      />
    )
  }));

  const shadowTokens = Object.entries(designTokens.boxShadow).map(([key, value]) => ({
    name: `shadow-${key}`,
    value,
    cssVar: `var(--shadow-${key})`,
    category: 'shadows',
    usage: 'Box shadow for elevation and depth',
    preview: (
      <div 
        className="w-12 h-12 bg-card border"
        style={{ boxShadow: value }}
      />
    )
  }));

  const allTokens = [
    ...spacingTokens,
    ...fontSizeTokens, 
    ...borderRadiusTokens,
    ...shadowTokens,
  ];

  const filteredTokens = allTokens.filter(token => {
    const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || token.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'spacing', 'typography', 'borders', 'shadows'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTokens.map((token) => (
          <TokenCard key={token.name} {...token} />
        ))}
      </div>

      {filteredTokens.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tokens found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

const ColorExplorerComponent = () => {
  const tokens = useDesignTokens();
  const currentTheme = tokens.currentTheme;
  const colors = tokens.colors;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Current Theme: {currentTheme}</h3>
        <p className="text-muted-foreground">
          Switch themes using the toolbar to see color changes
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(colors).map(([name, value]) => (
          <div key={name} className="space-y-2">
            <ColorSwatch 
              color={value}
              name={name}
              textColor={name.includes('foreground') ? undefined : 'white'}
            />
            <div className="text-center">
              <code className="text-xs bg-muted px-2 py-1 rounded">
                var(--{name})
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ComponentTokenExplorerComponent = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {Object.entries(componentTokens).map(([componentName, tokens]) => (
          <Card key={componentName}>
            <CardHeader>
              <CardTitle className="capitalize">{componentName} Tokens</CardTitle>
              <CardDescription>
                Component-specific design tokens for {componentName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(tokens as any).map(([property, values]) => (
                  <div key={property} className="space-y-2">
                    <h4 className="font-medium text-sm capitalize">{property}</h4>
                    {typeof values === 'object' && values !== null ? (
                      <div className="space-y-1">
                        {Object.entries(values).map(([variant, value]) => (
                          <div key={variant} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{variant}:</span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {value as string}
                            </code>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <code className="bg-muted px-2 py-1 rounded text-xs block">
                        {values as string}
                      </code>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const TokenExplorer: Story = {
  render: () => (
    <div className="p-6">
      <Tabs defaultValue="tokens" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>
        <TabsContent value="tokens" className="mt-6">
          <TokenExplorerComponent />
        </TabsContent>
        <TabsContent value="colors" className="mt-6">
          <ColorExplorerComponent />
        </TabsContent>
        <TabsContent value="components" className="mt-6">
          <ComponentTokenExplorerComponent />
        </TabsContent>
      </Tabs>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive tool for exploring and testing design tokens.',
      },
    },
  },
};

export const TokenUsageExamples: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Token Usage Examples</h3>
        <p className="text-muted-foreground mb-6">
          Real-world examples of how to use design tokens in components
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spacing Tokens in Layout</CardTitle>
            <CardDescription>Using consistent spacing tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <pre className="text-sm overflow-x-auto">
                <code>{`// Using spacing tokens
<div className="p-4">           // padding: var(--spacing-lg)
  <div className="mb-6">       // margin-bottom: var(--spacing-xl)  
    <h2 className="mb-2">      // margin-bottom: var(--spacing-sm)
      Title
    </h2>
    <p>Content with consistent spacing</p>
  </div>
</div>`}</code>
              </pre>
            </div>
            <div className="p-4 border rounded-md">
              <div className="mb-6">
                <h2 className="mb-2 text-xl font-semibold">Sample Title</h2>
                <p>This content uses our spacing tokens for consistent layout.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typography Tokens</CardTitle>
            <CardDescription>Consistent text sizing with optimal line heights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <pre className="text-sm overflow-x-auto">
                <code>{`// Typography with tokens
<h1 className="text-4xl font-bold">    // font-size: var(--text-4xl)
<h2 className="text-2xl font-semibold"> // font-size: var(--text-2xl)
<p className="text-base">             // font-size: var(--text-base)`}</code>
              </pre>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Heading Level 1</h1>
              <h2 className="text-2xl font-semibold">Heading Level 2</h2>
              <p className="text-base">Regular paragraph text with optimal readability.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Tokens for Theming</CardTitle>
            <CardDescription>Semantic color usage that works across themes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <pre className="text-sm overflow-x-auto">
                <code>{`// Semantic color usage
<div className="bg-card text-card-foreground">
  <Alert className="border-success bg-success/10">
    <AlertDescription className="text-success-foreground">
      Success message using semantic colors
    </AlertDescription>
  </Alert>
</div>`}</code>
              </pre>
            </div>
            <div className="bg-card text-card-foreground p-4 rounded-md border">
              <div className="border-l-4 border-green-600 bg-green-50 p-4 rounded">
                <p className="text-green-800 text-sm">
                  Success message that adapts to theme changes automatically
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Practical examples of how to implement design tokens in your code.',
      },
    },
  },
};