# FinVision Style Guide

## Design System Overview

This style guide documents the design system used in the FinVision application, based on Tailwind CSS and Radix UI components.

## Color System

### Base Colors

- `primary`: Main brand color, used for primary actions and key UI elements
- `secondary`: Supporting color, used for secondary actions and UI elements
- `muted`: Subtle color used for less prominent UI elements
- `accent`: Highlight color for emphasized UI elements
- `destructive`: Used for destructive actions and error states

Each color has a foreground variant for text/icons that appear on that background.

### Semantic Colors

- `background`: Page background
- `foreground`: Default text color
- `card`: Card component background
- `popover`: Popover/dropdown background
- `border`: Border color for UI elements
- `ring`: Focus ring color
- `input`: Input field styling

### Sidebar Colors

Special color set for sidebar components:

- `sidebar`: Sidebar background
- `sidebar-foreground`: Sidebar text
- `sidebar-primary`: Primary sidebar elements
- `sidebar-accent`: Accent sidebar elements

## Typography

### Font Sizes

- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)

### Font Weights

- `font-normal`: Regular weight (400)
- `font-medium`: Medium weight (500)

## Border Radius

- `rounded-lg`: Large radius (var(--radius))
- `rounded-md`: Medium radius (--radius - 2px)
- `rounded-sm`: Small radius (--radius - 4px)

## Component Guidelines

### Buttons

```tsx
// Primary Button
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Primary Action
</button>

// Secondary Button
<button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
  Secondary Action
</button>

// Destructive Button
<button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
  Delete
</button>
```

### Cards

```tsx
<div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
  Card Content
</div>
```

### Form Fields

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Label</label>
  <input className="bg-input-background border border-border rounded-md px-3 py-2" />
</div>
```

## Dark Mode

The design system supports dark mode through the `dark` class on the root element. Colors automatically adjust based on the color scheme.

To toggle dark mode:

```tsx
// Add or remove 'dark' class to/from document.documentElement
document.documentElement.classList.toggle('dark');
```

## Utility Functions

### Class Name Merging

Use the `cn()` utility to merge Tailwind classes:

```tsx
import { cn } from "@/utils/cn"

// Merge static and dynamic classes
<div className={cn(
  "base-styles",
  conditional && "conditional-styles",
  className
)}>
```

## Migration Guidelines

When migrating from Material-UI:

1. Replace MUI components with their Radix UI counterparts
2. Use Tailwind utility classes instead of styled-components or CSS-in-JS
3. Use the color system variables instead of MUI's palette
4. Use the `cn()` utility instead of MUI's `makeStyles` or `sx` prop

Example migration:

```tsx
// Before (MUI)
<Button
  variant="contained"
  color="primary"
  sx={{ mt: 2 }}
>
  Submit
</Button>

// After (Tailwind + Radix)
<Button
  className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
>
  Submit
</Button>
```

## Best Practices

1. Always use the design system colors instead of hard-coded values
2. Use semantic color names (e.g., `text-destructive` instead of `text-red-500`)
3. Maintain consistent spacing using Tailwind's spacing scale
4. Use the `cn()` utility for class name merging
5. Follow the component patterns for consistent UI/UX
6. Test components in both light and dark modes
