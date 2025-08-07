// Base UI Components - Redirected to Design System
export { Button, buttonVariants } from '@/design-system/components/Button';
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
export { Input } from '@/design-system/components/Input';
export { Textarea } from '@/design-system/components/Textarea';
export { Label } from '@/design-system/components/Label';
export { Checkbox } from '@/design-system/components/Checkbox';
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/design-system/components/Select';
export { Switch } from '@/design-system/components/Switch';
export { Alert, AlertTitle, AlertDescription } from '@/design-system/components/Alert';
export { Badge, badgeVariants } from '@/design-system/components/Badge';
export { Slider } from '@/design-system/components/Slider';
// export { Textarea } from './textarea';
export { Separator } from '@/design-system/components/Separator';
export { Skeleton } from '@/design-system/components/Skeleton';
export { Progress } from '@/design-system/components/Progress';
export { ScrollArea, ScrollBar } from '@/design-system/components/ScrollArea';
export { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/Tabs';
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/design-system/components/Dialog';
export {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/design-system/components/Sheet';
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from './dropdown-menu';
export { HoverCard, HoverCardContent, HoverCardTrigger } from '@/design-system/components/HoverCard';
export {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/design-system/components/Collapsible';

// Newly added Radix UI components
export {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './menubar';
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from './navigation-menu';
export { Popover, PopoverContent, PopoverTrigger } from '@/design-system/components/Popover';
export { Toggle, toggleVariants } from '@/design-system/components/Toggle';
export { ToggleGroup, ToggleGroupItem } from '@/design-system/components/ToggleGroup';
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/design-system/components/Tooltip';
export {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  ContextMenuTrigger,
} from './context-menu';

// Re-export design system ThemeToggle component
export { ThemeToggle } from '../theme-toggle';
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/design-system/components/Accordion';
export { Alert, AlertDescription, AlertTitle } from './alert';
export { Badge } from './badge';
export { AspectRatio } from '@/design-system/components/AspectRatio';
export { Avatar, AvatarImage, AvatarFallback } from '@/design-system/components/Avatar';
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/design-system/components/Breadcrumb';
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/design-system/components/AlertDialog';
export { Toaster } from './sonner';
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from './toast';
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/design-system/components/Table';
// export { default as DataTable } from './DataTable';
// export { default as HelpCenter, HelpButton } from './HelpCenter';

// Loading States

// Error Handling
// export {
//   ErrorBoundary,
//   ErrorDisplay,
//   InlineError,
//   useToast,
//   NetworkError,
//   NotFound,
// } from './ErrorHandling';

// Enhanced Design System Components
// export { EnhancedCard, MetricCard, FeatureCard } from './EnhancedCard';
// export {
//   EnhancedButton,
//   ActionButton,
//   IconButton,
//   LoadingButton,
// } from './EnhancedButton';
// export { DesignSystemProvider, useDesignSystem } from './DesignSystemProvider';

// Design System Utilities
export { componentStyles, DesignSystem } from './utils/designSystem';

// Re-export types
export type { CardProps } from './card';
// export type { DataTableProps, DataTableColumn } from './DataTable';
