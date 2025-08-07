#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Optimizing Storybook for FinVision...\n');

// Configuration
const config = {
  storybookDir: path.join(__dirname, '..', '.storybook'),
  srcDir: path.join(__dirname, '..', 'src'),
  outputDir: path.join(__dirname, '..', 'storybook-static'),
  maxWorkers: Math.max(1, Math.floor(require('os').cpus().length * 0.75)),
};

// Utility functions
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m', // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
  };
  console.log(`${colors[type]}${message}\x1b[0m`);
}

function checkDependencies() {
  log('📦 Checking dependencies...');

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
  );
  const requiredAddons = [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
    '@storybook/addon-coverage',
    '@storybook/addon-jest',
  ];

  const missingAddons = requiredAddons.filter(
    addon => !packageJson.devDependencies[addon]
  );

  if (missingAddons.length > 0) {
    log(`⚠️  Missing addons: ${missingAddons.join(', ')}`, 'warning');
    log('Run: npm install --save-dev ' + missingAddons.join(' '), 'warning');
    return false;
  }

  log('✅ All dependencies are installed', 'success');
  return true;
}

function optimizeViteConfig() {
  log('⚡ Optimizing Vite configuration...');

  const mainConfigPath = path.join(config.storybookDir, 'main.ts');
  let mainConfig = fs.readFileSync(mainConfigPath, 'utf8');

  // Add performance optimizations
  const optimizations = `
    // Performance optimizations
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include || []),
        'tailwindcss',
        'autoprefixer',
        'lucide-react',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        '@radix-ui/react-slot',
        '@radix-ui/react-dialog',
        '@radix-ui/react-select',
        '@radix-ui/react-tabs',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-switch',
        '@radix-ui/react-alert-dialog',
        '@radix-ui/react-popover',
        '@radix-ui/react-tooltip',
      ],
    };

    // Build optimizations
    config.build = {
      ...config.build,
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        ...config.build?.rollupOptions,
        output: {
          ...config.build?.rollupOptions?.output,
          manualChunks: {
            'storybook-vendor': ['react', 'react-dom'],
            'storybook-addons': [
              '@storybook/addon-essentials',
              '@storybook/addon-a11y',
              '@storybook/addon-interactions',
            ],
            'ui-components': [
              'lucide-react',
              'class-variance-authority',
              'clsx',
              'tailwind-merge',
            ],
          },
        },
      },
    };
  `;

  if (!mainConfig.includes('Performance optimizations')) {
    mainConfig = mainConfig.replace(
      'return config;',
      `${optimizations}\n    return config;`
    );
    fs.writeFileSync(mainConfigPath, mainConfig);
    log('✅ Vite configuration optimized', 'success');
  } else {
    log('✅ Vite configuration already optimized', 'success');
  }
}

function createPerformanceStories() {
  log('📝 Creating performance test stories...');

  const performanceStoryPath = path.join(
    config.srcDir,
    'components',
    'ui',
    'performance-test.stories.tsx'
  );

  if (!fs.existsSync(performanceStoryPath)) {
    const performanceStory = `import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';

const meta: Meta = {
  title: '🧪 Performance Tests',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Performance testing stories for measuring component rendering and interaction performance.',
      },
    },
  },
  tags: ['autodocs', 'performance'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Large component grid for performance testing
export const LargeGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 20 }, (_, i) => (
        <Card key={i} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Component {i + 1}
              <Badge variant="secondary">{i + 1}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full">
              Action {i + 1}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

// Interactive performance test
export const InteractiveTest: Story = {
  render: () => {
    const [count, setCount] = React.useState(0);
    const [items, setItems] = React.useState(Array.from({ length: 10 }, (_, i) => i));
    
    const addItem = () => {
      setItems(prev => [...prev, prev.length]);
      setCount(prev => prev + 1);
    };
    
    const removeItem = (index: number) => {
      setItems(prev => prev.filter((_, i) => i !== index));
      setCount(prev => prev - 1);
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={addItem}>Add Item</Button>
          <Badge>Count: {count}</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <Card key={item} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Item {item}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is item number {item} for performance testing
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  },
};
`;

    fs.writeFileSync(performanceStoryPath, performanceStory);
    log('✅ Performance test stories created', 'success');
  } else {
    log('✅ Performance test stories already exist', 'success');
  }
}

function optimizeBuildProcess() {
  log('🔧 Optimizing build process...');

  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Add optimized build scripts
  const newScripts = {
    'storybook:fast':
      'cross-env NODE_OPTIONS="--max-old-space-size=4096" storybook dev -p 6006',
    'build-storybook:fast':
      'cross-env NODE_OPTIONS="--max-old-space-size=4096" storybook build',
    'storybook:analyze':
      'npm run build-storybook && npx bundle-analyzer storybook-static/**/*.js',
    'storybook:test': 'storybook test --watch',
    'storybook:test:ci': 'storybook test --ci',
  };

  let updated = false;
  Object.entries(newScripts).forEach(([script, command]) => {
    if (!packageJson.scripts[script]) {
      packageJson.scripts[script] = command;
      updated = true;
    }
  });

  if (updated) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    log('✅ Build scripts optimized', 'success');
  } else {
    log('✅ Build scripts already optimized', 'success');
  }
}

function createStorybookConfig() {
  log('📋 Creating Storybook configuration documentation...');

  const configDocPath = path.join(
    __dirname,
    '..',
    'docs',
    'STORYBOOK_CONFIG.md'
  );

  const configDoc = `# Storybook Configuration Guide

## Overview

This document outlines the optimized Storybook configuration for FinVision, including performance optimizations, testing setup, and development workflows.

## Configuration Files

### .storybook/main.ts
- **Framework**: React Vite
- **Addons**: Essentials, A11y, Interactions, Links, Viewport, Backgrounds, Measure, Outline, Coverage, Jest
- **Performance**: Optimized Vite configuration with manual chunks and dependency optimization
- **TypeScript**: React docgen with prop filtering

### .storybook/preview.tsx
- **Global Decorators**: Theme provider with light/dark mode support
- **Parameters**: Enhanced controls, accessibility testing, viewport configurations
- **Testing**: Integration with Testing Library and Jest

### .storybook/manager.ts
- **Theme**: Custom FinVision branding
- **Sidebar**: Organized navigation with filters
- **Toolbar**: Enhanced developer tools

## Performance Optimizations

### Build Optimizations
- Manual chunk splitting for vendor libraries
- ESBuild minification
- Dependency pre-bundling
- Tree shaking for unused code

### Runtime Optimizations
- Lazy loading of stories
- Optimized component rendering
- Memory management for large component trees

## Testing Integration

### Accessibility Testing
- Automated a11y checks with axe-core
- Color contrast validation
- Keyboard navigation testing
- Screen reader compatibility

### Component Testing
- Interactive testing with Testing Library
- User interaction simulation
- Component behavior validation
- Error boundary testing

## Development Workflow

### Available Scripts
- \`npm run storybook\`: Start development server
- \`npm run storybook:fast\`: Optimized development server
- \`npm run build-storybook\`: Build for production
- \`npm run build-storybook:fast\`: Optimized build
- \`npm run storybook:test\`: Run component tests
- \`npm run storybook:test:ci\`: CI/CD testing

### Best Practices
1. Use TypeScript for all stories
2. Include comprehensive documentation
3. Test accessibility features
4. Optimize for performance
5. Follow component composition patterns

## Addon Configuration

### Essential Addons
- **Essentials**: Core Storybook functionality
- **A11y**: Accessibility testing
- **Interactions**: User interaction testing
- **Links**: Navigation between stories

### Performance Addons
- **Viewport**: Responsive design testing
- **Backgrounds**: Context testing
- **Measure**: Layout analysis
- **Outline**: Component structure visualization

### Testing Addons
- **Coverage**: Code coverage reporting
- **Jest**: Unit testing integration

## Troubleshooting

### Common Issues
1. **Build Failures**: Check Vite configuration and dependencies
2. **Performance Issues**: Use performance monitoring tools
3. **TypeScript Errors**: Verify prop types and interfaces
4. **A11y Violations**: Review accessibility guidelines

### Performance Monitoring
- Use Chrome DevTools for performance analysis
- Monitor bundle sizes with bundle analyzer
- Track component rendering times
- Optimize large component trees

## Future Improvements

1. **Visual Regression Testing**: Integrate Chromatic or similar tools
2. **Component Documentation**: Enhanced MDX documentation
3. **Design Token Integration**: Automated design system validation
4. **Performance Budgets**: Set and enforce performance limits
`;

  fs.writeFileSync(configDocPath, configDoc);
  log('✅ Configuration documentation created', 'success');
}

// Main execution
async function main() {
  try {
    log('🎯 Starting Storybook optimization...\n');

    // Check dependencies
    if (!checkDependencies()) {
      log('❌ Dependency check failed', 'error');
      process.exit(1);
    }

    // Optimize configurations
    optimizeViteConfig();
    optimizeBuildProcess();

    // Create additional files
    createPerformanceStories();
    createStorybookConfig();

    log('\n🎉 Storybook optimization complete!', 'success');
    log('\n📋 Next steps:', 'info');
    log('1. Run: npm run storybook:fast', 'info');
    log('2. Test performance with: npm run storybook:test', 'info');
    log('3. Build optimized version: npm run build-storybook:fast', 'info');
    log('4. Review configuration at: docs/STORYBOOK_CONFIG.md', 'info');
  } catch (error) {
    log(`❌ Optimization failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  checkDependencies,
  optimizeViteConfig,
  optimizeBuildProcess,
  createPerformanceStories,
  createStorybookConfig,
};
