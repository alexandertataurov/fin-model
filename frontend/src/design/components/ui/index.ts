// Design System - Unified Component Library
// This file re-exports all UI components from the main components directory
// to eliminate duplicates and provide a single source of truth

// Base Components
export {
  Button,
  buttonVariants,
} from '../../../components/ui/button';

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from '../../../components/ui/card';

export { Input } from '../../../components/ui/input';
export { Textarea } from '../../../components/ui/textarea';
export { Label } from '../../../components/ui/label';
export { Checkbox } from '../../../components/ui/checkbox';

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

export { Slider } from '../../../components/ui/slider';
export { Separator } from '../../../components/ui/separator';
export { Skeleton } from '../../../components/ui/skeleton';
export { Progress } from '../../../components/ui/progress';
export { ScrollArea, ScrollBar } from '../../../components/ui/scroll-area';

// Form Components (unique to design system)
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from './form';

// Additional Design System Components (unique)
export { Switch } from './switch';
export { RadioGroup, RadioGroupItem } from './radio-group';
export { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './pagination';
export { InputOTP, InputOTPGroup, InputOTPSlot } from './input-otp';
export { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './drawer';
export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from './command';
export { Chart } from './chart';
export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './carousel';
export { Calendar } from './calendar';
export { Sidebar } from './sidebar';
export { useMobile } from './use-mobile';
export { Toaster } from './toaster';

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';

export {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../components/ui/sheet';

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
} from '../../../components/ui/dropdown-menu';

export {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../../components/ui/hover-card';

export {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../components/ui/collapsible';

// Navigation Components
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
} from '../../../components/ui/menubar';

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '../../../components/ui/navigation-menu';

export {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';

export {
  Toggle,
  toggleVariants,
} from '../../../components/ui/toggle';

export {
  ToggleGroup,
  ToggleGroupItem,
} from '../../../components/ui/toggle-group';

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

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
} from '../../../components/ui/context-menu';

// Layout Components
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../../components/ui/accordion';

export {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../../../components/ui/alert';

export { Badge } from '../../../components/ui/badge';
export { AspectRatio } from '../../../components/ui/aspect-ratio';
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '../../../components/ui/avatar';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '../../../components/ui/breadcrumb';

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
} from '../../../components/ui/alert-dialog';

// Toast Components
export { Toaster } from '../../../components/ui/sonner';
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from '../../../components/ui/toast';

// Table Components
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';

// Enhanced Components
export { default as TextField } from '../../../components/ui/TextField';
export { default as MultiSelect } from '../../../components/ui/MultiSelect';
export { default as DataTable } from '../../../components/ui/DataTable';
export { default as BottomNavigation } from '../../../components/ui/BottomNavigation';
export { default as HelpCenter, HelpButton } from '../../../components/ui/HelpCenter';

// Enhanced Design System Components
export {
  EnhancedCard,
  MetricCard,
  FeatureCard,
} from '../../../components/ui/EnhancedCard';

export {
  EnhancedButton,
  ActionButton,
  IconButton,
  LoadingButton,
} from '../../../components/ui/EnhancedButton';

export {
  DesignSystemProvider,
  useDesignSystem,
} from '../../../components/ui/DesignSystemProvider';

// Error Handling
export {
  ErrorBoundary,
  ErrorDisplay,
  InlineError,
  useToast,
  NetworkError,
  NotFound,
} from '../../../components/ui/ErrorHandling';

// Design System Utilities
export {
  componentStyles,
  DesignSystem,
} from '../../../components/ui/utils/designSystem';

export * from '../../../components/ui/utils/tokenHelpers';

// Re-export types
export type { CardProps } from '../../../components/ui/card';
export type { TextFieldProps } from '../../../components/ui/TextField';
export type {
  MultiSelectProps,
  MultiSelectOption,
} from '../../../components/ui/MultiSelect';
export type {
  DataTableProps,
  DataTableColumn,
} from '../../../components/ui/DataTable';
export type { BottomNavigationProps } from '../../../components/ui/BottomNavigation'; 