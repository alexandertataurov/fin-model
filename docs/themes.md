# Themes

The front-end provides light and dark palettes backed by CSS custom properties.
Theme definitions live in JSON files under `frontend/src/design-system/tokens/themes`.
Each file maps a CSS variable name (for example `--primary`) to a hex color and
includes a `-foreground` variant for readable text.

## Creating a custom theme

1. Copy one of the existing theme files (`light.json` or `dark.json`) and rename
   it to your theme name.
2. Fill in color values for all tokens (e.g., `--accent` / `--accent-foreground`,
   `--border`, `--input`, `--ring`).
3. Verify accessibility by running:

   ```bash
   node scripts/contrast-check.js
   ```

   The script checks that every color pair meets WCAG AA contrast ratios.

## Switching themes at runtime

Use the `setTheme` helper to apply a theme and update the CSS variables on the
`document.documentElement`. A `toggleTheme` helper is also provided:

```ts
import { setTheme, toggleTheme } from '@/design-system/theme-switcher';

setTheme('dark');   // switch to dark mode
toggleTheme();      // toggle based on current theme
```

The helpers set `data-theme` on the root element, allowing additional
styling if needed.
