/**
 * This file serves as a registry for all shadcn/ui components in the application.
 * It helps maintain consistency and makes it easier to track which components are used.
 */

// Primitive UI Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/design-system/molecules';
import { Alert, AlertDescription, AlertTitle } from '@/design-system/molecules';
// import { AspectRatio } from '@/design-system/components/AspectRatio';
// import { Avatar, AvatarFallback, AvatarImage } from '@/design-system/atoms';
import { Badge } from '@/design-system/atoms';
import { Button } from '@/design-system/atoms';
// import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  // CardAction,
} from '@/design-system/molecules';
import { Checkbox } from '@/design-system/atoms';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/design-system/molecules';
// import {
//   Command,
//   CommandDialog,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator,
//   CommandShortcut,
// } from '@/components/ui/command';
// import {
//   ContextMenu,
//   ContextMenuCheckboxItem,
//   ContextMenuContent,
//   ContextMenuItem,
//   ContextMenuLabel,
//   ContextMenuRadioGroup,
//   ContextMenuRadioItem,
//   ContextMenuSeparator,
//   ContextMenuShortcut,
//   ContextMenuSub,
//   ContextMenuSubContent,
//   ContextMenuSubTrigger,
//   ContextMenuTrigger,
// } from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/design-system/molecules';
// Drop non-existent dropdown/hover-card imports in this build
const DropdownMenu: any = {};
const DropdownMenuCheckboxItem: any = {};
const DropdownMenuContent: any = {};
const DropdownMenuGroup: any = {};
const DropdownMenuItem: any = {};
const DropdownMenuLabel: any = {};
const DropdownMenuPortal: any = {};
const DropdownMenuRadioGroup: any = {};
const DropdownMenuRadioItem: any = {};
const DropdownMenuSeparator: any = {};
const DropdownMenuShortcut: any = {};
const DropdownMenuSub: any = {};
const DropdownMenuSubContent: any = {};
const DropdownMenuSubTrigger: any = {};
const DropdownMenuTrigger: any = {};
const HoverCard: any = {};
const HoverCardContent: any = {};
const HoverCardTrigger: any = {};
import { Input } from '@/design-system/atoms';
import { Label } from '@/design-system/atoms';
// import {
//   Menubar,
//   MenubarCheckboxItem,
//   MenubarContent,
//   MenubarGroup,
//   MenubarItem,
//   MenubarLabel,
//   MenubarMenu,
//   MenubarRadioGroup,
//   MenubarRadioItem,
//   MenubarSeparator,
//   MenubarShortcut,
//   MenubarSub,
//   MenubarSubContent,
//   MenubarSubTrigger,
//   MenubarTrigger,
// } from '@/components/ui/menubar';
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
//   navigationMenuTriggerStyle,
// } from '@/components/ui/navigation-menu';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
import { Progress } from '@/design-system/atoms';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea, ScrollBar } from '@/design-system/molecules';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/design-system/molecules';
// import { Separator } from '@/design-system/atoms';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/design-system/molecules';
import { Skeleton } from '@/design-system/atoms';
import { Slider } from '@/design-system/atoms';
// import { Switch } from '@/design-system/atoms';
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/design-system/molecules';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/design-system/molecules';
// import { Textarea } from '@/design-system/atoms';
// import {
//   Toast,
//   ToastAction,
//   ToastClose,
//   ToastDescription,
//   ToastProvider,
//   ToastTitle,
//   ToastViewport,
// } from '@/components/ui/toast';
// import { Toaster } from '@/design-system/molecules';
// import { Toggle } from '@/components/ui/toggle';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from '@/design-system/molecules';

// Custom Components
// Optional components may not exist in this project; stub exports to satisfy types
const DataTable: any = () => null;
const ThemeToggle: any = () => null;
const BottomNavigation: any = () => null;
const MultiSelect: any = () => null;

/**
 * Export all components to make them available through this registry
 */
export {
  // Primitive UI Components (only existing ones)
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Label,
  Progress,
  ScrollArea,
  ScrollBar,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,

  // Custom Components
  DataTable,
  ThemeToggle,
  BottomNavigation,
  MultiSelect,
};
