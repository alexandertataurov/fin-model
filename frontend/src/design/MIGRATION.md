# Design System Migration Guide

This guide helps you migrate from the old duplicate components to the unified design system.

## 🎯 What Changed

We've consolidated the design system to eliminate duplicates and provide a single source of truth for all UI components.

### Before (Duplicate Components)
```
src/
├── components/ui/          # Main components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
└── design/components/ui/   # Duplicate components
    ├── button.tsx          # ❌ Duplicate
    ├── card.tsx            # ❌ Duplicate
    └── ...
```

### After (Unified System)
```
src/
├── components/ui/          # Source of truth
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
└── design/components/ui/   # Re-exports + unique components
    ├── index.ts            # ✅ Unified exports
    ├── form.tsx            # ✅ Unique component
    ├── chart.tsx           # ✅ Unique component
    └── ...
```

## 🔄 Migration Steps

### 1. Update Imports

**Old imports (remove these):**
```tsx
// ❌ Direct imports from duplicate components
import { Button } from '@/design/components/ui/button';
import { Card } from '@/design/components/ui/card';
import { Input } from '@/design/components/ui/input';
```

**New imports (use these):**
```tsx
// ✅ Unified imports from design system
import { Button, Card, Input } from '@/design/components/ui';
```

### 2. Component Categories

#### Foundation Components (from main UI)
```tsx
import {
  Button,
  Input,
  Label,
  Textarea,
  Checkbox,
  Select,
  Slider,
  Switch,
} from '@/design/components/ui';
```

#### Layout Components (from main UI)
```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Separator,
  AspectRatio,
} from '@/design/components/ui';
```

#### Navigation Components (from main UI)
```tsx
import {
  Menubar,
  NavigationMenu,
  DropdownMenu,
  Breadcrumb,
  Popover,
  Tooltip,
} from '@/design/components/ui';
```

#### Feedback Components (from main UI)
```tsx
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Progress,
  Skeleton,
  Toast,
  Toaster,
} from '@/design/components/ui';
```

#### Data Display Components (from main UI)
```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/design/components/ui';
```

#### Overlay Components (from main UI)
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/design/components/ui';
```

#### Enhanced Components (from main UI)
```tsx
import {
  EnhancedButton,
  EnhancedCard,
  TextField,
  MultiSelect,
  DataTable,
  BottomNavigation,
  HelpCenter,
} from '@/design/components/ui';
```

#### Unique Design System Components
```tsx
import {
  // Form components
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  
  // Additional components
  Switch,
  RadioGroup,
  RadioGroupItem,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Pagination,
  InputOTP,
  Drawer,
  Command,
  Chart,
  Carousel,
  Calendar,
  Sidebar,
  useMobile,
} from '@/design/components/ui';
```

## 🔍 Finding and Replacing Imports

### Using VS Code Search and Replace

1. **Find all old imports:**
   ```
   from '@/design/components/ui/
   ```

2. **Replace with new imports:**
   ```
   from '@/design/components/ui'
   ```

### Using Command Line

```bash
# Find all files with old imports
grep -r "from '@/design/components/ui/" src/

# Replace in all files (be careful!)
find src/ -name "*.tsx" -exec sed -i 's|from '\''@/design/components/ui/|from '\''@/design/components/ui'\''|g' {} \;
```

## ✅ Verification Checklist

After migration, verify:

- [ ] All imports use `@/design/components/ui` (not individual files)
- [ ] No TypeScript errors related to missing components
- [ ] Components render correctly in the browser
- [ ] Storybook stories work properly
- [ ] Tests pass

## 🐛 Common Issues

### Issue: Component not found
**Error:** `Module not found: Can't resolve '@/design/components/ui/button'`

**Solution:** Update import to use unified path:
```tsx
// ❌ Old
import { Button } from '@/design/components/ui/button';

// ✅ New
import { Button } from '@/design/components/ui';
```

### Issue: Type errors
**Error:** `Property 'variant' does not exist on type 'ButtonProps'`

**Solution:** The main components have more features. Check the component documentation for available props.

### Issue: Styling differences
**Error:** Component looks different after migration

**Solution:** The main components have enhanced styling. Review the component documentation and adjust your usage if needed.

## 📚 Resources

- [Design System Documentation](./README.md)
- [Storybook Overview](./DesignSystem.stories.tsx)
- [Component API Reference](../components/ui/index.ts)

## 🆘 Need Help?

If you encounter issues during migration:

1. Check the [Design System Documentation](./README.md)
2. Review the [Storybook examples](./DesignSystem.stories.tsx)
3. Compare with existing working examples in the codebase
4. Create an issue with details about the problem

## 🎉 Benefits After Migration

- **Consistency**: Single source of truth for all components
- **Maintainability**: Easier to update and maintain components
- **Performance**: Reduced bundle size by eliminating duplicates
- **Developer Experience**: Better TypeScript support and documentation
- **Accessibility**: Enhanced accessibility features in main components 