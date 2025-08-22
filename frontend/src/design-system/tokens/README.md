# Design System Tokens

A comprehensive, standardized design token system with theme support, validation, and automated generation.

## 📁 Structure

```
tokens/
├── tokens.json          # Single source of truth (all design tokens)
├── tokens.ts            # Auto-generated TypeScript tokens
├── tokens.d.ts          # Auto-generated type definitions
├── tokenValidator.ts    # Validation utilities
├── tokenMigration.ts    # Migration utilities
├── themes/
│   ├── light.json       # Light theme colors
│   └── dark.json        # Dark theme colors
├── index.ts             # Main exports
└── README.md            # This documentation
```

## 🎯 Overview

This token system provides a single source of truth for all design values including colors, typography, spacing, shadows, motion, and more. It supports both light and dark themes with automatic generation and validation.

### Key Features

- ✅ **Single Source of Truth**: All tokens consolidated in `tokens.json`
- ✅ **Auto-Generation**: TypeScript files generated from JSON source
- ✅ **Theme Support**: Light and dark theme integration
- ✅ **Validation**: Comprehensive token validation and quality checks
- ✅ **Migration Tools**: Automated migration from old token systems
- ✅ **Type Safety**: Full TypeScript support with autocomplete

## Token Format

All tokens use a standardized format:

```json
{
  "colors": {
    "primary": {
      "500": { "value": "#6366f1" }
    }
  },
  "spacing": {
    "4": { "value": "1rem" }
  }
}
```

## Usage

### Basic Token Access

```typescript
import { tokens, getToken } from '@/design-system/tokens';

// Direct access
const primaryColor = tokens.colors.primary['500'];
const spacing = tokens.spacing['4'];

// Path-based access
const color = getToken('colors.primary.500');
const space = getToken('spacing.4');
```

### React Hook (Recommended)

```typescript
import { useDesignTokens } from '@/hooks/useDesignTokens';

function MyComponent() {
  const tokens = useDesignTokens();

  return (
    <div
      style={{
        backgroundColor: tokens.getColor('primary'),
        padding: tokens.getSpacing('4'),
        borderRadius: tokens.getBorderRadius('lg'),
      }}
    >
      Content
    </div>
  );
}
```

### Theme-Aware Usage

```typescript
import { useDesignTokens } from '@/hooks/useDesignTokens';

function ThemedComponent() {
  const tokens = useDesignTokens();

  // Theme-aware color access
  const backgroundColor = tokens.getThemeColor('background');
  const textColor = tokens.getThemeColor('foreground');

  // Generate CSS variables for current theme
  const cssVars = tokens.generateCSSVariables();

  return <div style={cssVars}>Themed content</div>;
}
```

### Utility Functions

```typescript
import {
  getSpacing,
  getColorScale,
  getMotion,
  createStyles,
} from '@/design-system/tokens';

// Spacing utilities
const padding = getSpacing('4'); // "1rem"
const cssVarPadding = getSpacing('4', true); // "var(--spacing-4)"

// Color utilities
const primary500 = getColorScale('primary', '500'); // "#6366f1"

// Motion utilities
const easing = getMotion('easing', 'smooth'); // "cubic-bezier(0.4, 0, 0.2, 1)"

// CSS-in-JS styles
const styles = createStyles({
  padding: 'token:spacing.4',
  color: 'token:colors.primary.500',
});
```

## Theme System

### Theme Switching

```typescript
import { useThemeSwitcher } from '@/design-system/utils/theme-switcher';

function ThemeToggle() {
  const { toggleTheme, switchToLight, switchToDark } = useThemeSwitcher();

  return (
    <div>
      <button onClick={switchToLight}>Light</button>
      <button onClick={switchToDark}>Dark</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

### Custom Themes

```typescript
import { generateThemeCSS } from '@/design-system/utils/tokenHelpers';

const customTheme = {
  colors: {
    primary: { value: '#ff0000' },
    background: { value: '#ffffff' },
  },
};

const cssVars = generateThemeCSS(customTheme);
// Apply to document or component
```

## Validation

### Token Validation

```typescript
import { validateTokens, validateTokenPath } from '@/design-system/tokens';

// Validate entire token system
const result = validateTokens();
if (!result.isValid) {
  console.error('Token validation failed:', result.errors);
}

// Validate specific token path
const pathResult = validateTokenPath('colors.primary.500');
```

### Usage Report

```typescript
import { generateTokenUsageReport } from '@/design-system/tokens';

const report = generateTokenUsageReport();
console.log(`Total tokens: ${report.totalTokens}`);
console.log('Categories:', report.categories);
```

## Generation

### Auto-Generation

Tokens are automatically generated from `tokens.json`:

```bash
# Generate TypeScript tokens
pnpm gen:tokens

# Validate tokens
pnpm validate:tokens

# Migrate old token usage
pnpm migrate:tokens
```

### Custom Generation

```typescript
import { buildTokensTs } from '@/scripts/generate-tokens';

const tokensJson = readJson('path/to/tokens.json');
const tokensTs = buildTokensTs(tokensJson);
fs.writeFileSync('output.ts', tokensTs);
```

## Best Practices

### 1. Use the Hook for Components

```typescript
// ✅ Good
const tokens = useDesignTokens();
const color = tokens.getColor('primary');

// ❌ Avoid
import { tokens } from '@/design-system/tokens';
const color = tokens.colors.primary['500'];
```

### 2. Use Theme-Aware Functions

```typescript
// ✅ Good
const color = tokens.getThemeColor('background');

// ❌ Avoid
const color = tokens.colors.background;
```

### 3. Validate Token Paths

```typescript
// ✅ Good
if (tokens.hasToken('colors.primary.500')) {
  const color = tokens.getToken('colors.primary.500');
}

// ❌ Avoid
const color = tokens.getToken('colors.primary.500'); // May be undefined
```

### 4. Use CSS Variables for Dynamic Values

```typescript
// ✅ Good
const cssVar = tokens.getCSSVar('color-primary-500');

// ❌ Avoid
const color = tokens.colors.primary['500']; // Static value
```

## Migration Guide

### From Old Token System

1. **Update imports**:

   ```typescript
   // Old
   import { getToken } from '@/design-system/tokens';

   // New
   import { useDesignTokens } from '@/hooks/useDesignTokens';
   ```

2. **Replace direct access**:

   ```typescript
   // Old
   const color = tokens.colors.primary;

   // New
   const tokens = useDesignTokens();
   const color = tokens.getColor('primary');
   ```

3. **Update theme usage**:

   ```typescript
   // Old
   import { setTheme } from '@/design-system/utils/theme-switcher';

   // New
   import { useThemeSwitcher } from '@/design-system/utils/theme-switcher';
   const { switchToLight, switchToDark } = useThemeSwitcher();
   ```

## Troubleshooting

### Common Issues

1. **Token not found**: Use `validateTokenPath()` to check if the token exists
2. **Theme not switching**: Ensure `next-themes` is properly configured
3. **Generation fails**: Check that `tokens.json` follows the standardized format

### Debug Mode

```typescript
import { getAllTokenPaths } from '@/design-system/tokens';

// List all available tokens
const paths = getAllTokenPaths(tokens);
console.log('Available tokens:', paths);
```

## Contributing

1. **Add new tokens** to `tokens.json` using the standardized format
2. **Run validation** with `pnpm validate:tokens`
3. **Generate TypeScript** with `pnpm gen:tokens`
4. **Update themes** if adding new colors
5. **Add tests** for new token utilities

## Token Categories

### Colors
- **Primary**: Main brand colors with full scale (50-950)
- **Secondary**: Supporting colors with full scale
- **Accent**: Highlight colors for emphasis
- **Destructive**: Error and warning colors
- **Success/Warning/Info**: Status colors
- **Muted**: Neutral colors for backgrounds
- **Semantic**: Theme-aware colors (background, foreground, border)

### Typography
- **Font Families**: Sans, serif, mono, display variants
- **Font Sizes**: Complete scale from xs to 9xl
- **Font Weights**: Thin to black (100-900)
- **Line Heights**: Tight to extra-loose
- **Letter Spacing**: Tighter to extra-wide

### Spacing
- **Scale**: 0 to 64 (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64)
- **Units**: Rem-based for responsive design

### Layout
- **Border Radius**: None to full (none, sm, base, md, lg, xl, 2xl, 3xl, full)
- **Border Width**: None to xl (none, sm, md, lg, xl)
- **Shadows**: Complete elevation system (none, xs, sm, base, md, lg, xl, 2xl, 3xl, inner)
- **Z-Index**: Layering system (0, 10, 20, 30, 40, 50, auto, dropdown, sticky, fixed, modal, popover, tooltip)

### Motion
- **Easing**: Linear to elastic curves
- **Duration**: Instant to slowest (50ms to 1000ms)
- **Delay**: None to slow (0ms to 300ms)

### Breakpoints
- **Responsive**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
