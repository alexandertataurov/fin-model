# Design Tokens

The design system exposes a consolidated set of tokens generated from `frontend/src/design-system/tokens.json`.

## Color States

- `color.hover.primary` → `#2563eb`
- `color.active.primary` → `#1d4ed8`

## Semantic Colors

- `color.surface` → Alias for `color.background`
- `color.onSurface` → Alias for `color.foreground`
- `color.danger` → Alias for `color.destructive.500`

Use semantic tokens in components instead of referencing base tokens directly. This
improves flexibility when theming and keeps visual intent separate from the
underlying palette.

## Border Width

- `border.width.sm` → `1px`
- `border.width.md` → `2px`

## Typography Letter Spacing

- `typography.letterSpacing.tight` → `-0.025em`
- `typography.letterSpacing.wide` → `0.025em`

## Motion Easing

- `motion.easing.in` → `cubic-bezier(0.4, 0, 1, 1)`
- `motion.easing.inOut` → `cubic-bezier(0.4, 0, 0.2, 1)`

These tokens can be consumed in components via the `getToken` helper:

```ts
import { getToken } from 'frontend/src/design-system/tokens';

const timing = getToken('motion.easing.inOut');
```
