// Unified Design System Entry Point
// This file serves as the single source of truth for all design system components

// Core Components
export * from '../components/ui/button';
export * from '../components/ui/card';
export * from '../components/ui/input';
export * from '../components/ui/label';
export * from '../components/ui/textarea';
export * from '../components/ui/checkbox';
export * from '../components/ui/select';
export * from '../components/ui/switch';
export * from '../components/ui/slider';
export * from '../components/ui/progress';
export * from '../components/ui/separator';
export * from '../components/ui/skeleton';
export * from '../components/ui/scroll-area';
export * from '../components/ui/tabs';
export * from '../components/ui/dialog';
export * from '../components/ui/sheet';
export * from '../components/ui/dropdown-menu';
export * from '../components/ui/hover-card';
export * from '../components/ui/collapsible';
export * from '../components/ui/menubar';
export * from '../components/ui/navigation-menu';
export * from '../components/ui/popover';
export * from '../components/ui/toggle';
export * from '../components/ui/toggle-group';
export * from '../components/ui/tooltip';
export * from '../components/ui/context-menu';
export * from '../components/ui/accordion';
export * from '../components/ui/alert';
export * from '../components/ui/badge';
export * from '../components/ui/aspect-ratio';
export * from '../components/ui/avatar';
export * from '../components/ui/breadcrumb';
export * from '../components/ui/alert-dialog';
export * from '../components/ui/toast';
export * from '../components/ui/table';

// Theme and Utilities
export * from '../components/ThemeProvider';
export * from '../components/theme-toggle';
export * from '../utils/cn';

// Design System Provider
export { DesignSystemProvider, useDesignSystem } from './provider';

// Design System Components (migrated from old design structure)
export * from './components/Sidebar';
export * from './components/Command';
export * from './components/Carousel';
export * from './components/Calendar';
export * from './components/Pagination';
export * from './components/Form';
export * from './components/RadioGroup';
export * from './components/InputOTP';
export * from './components/Drawer';
export * from './components/Chart';
export * from './components/Toaster';
export * from './components/use-mobile';
export * from './components/ImageWithFallback';

// Types
export type { ButtonProps } from '../components/ui/button';
export type { CardProps } from '../components/ui/card';
export type { InputProps } from '../components/ui/input';
export type { SelectProps } from '../components/ui/select';
export type { DialogProps } from '../components/ui/dialog';
export type { AlertProps } from '../components/ui/alert';
export type { BadgeProps } from '../components/ui/badge';
