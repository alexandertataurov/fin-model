import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';
import {
  TextEncoder as NodeTextEncoder,
  TextDecoder as NodeTextDecoder,
} from 'util';

// Polyfills for JSDOM gaps used by UI libs
if (typeof window !== 'undefined' && !('matchMedia' in window)) {
  (window as any).matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// Ensure TextEncoder/TextDecoder exist in Node envs
if (!(globalThis as any).TextEncoder)
  (globalThis as any).TextEncoder =
    NodeTextEncoder as unknown as typeof TextEncoder;
if (!(globalThis as any).TextDecoder)
  (globalThis as any).TextDecoder =
    NodeTextDecoder as unknown as typeof TextDecoder;

// Comprehensive toast mocking with proper mock functions
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};

vi.mock('sonner', () => ({
  toast: mockToast,
}));

// Comprehensive Radix UI mocks to prevent act() warnings
vi.mock('@radix-ui/react-dialog', () => ({
  Dialog: ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'Dialog' }, children),
  DialogTrigger: ({ children }: any) =>
    React.createElement('div', null, children),
  DialogContent: ({ children }: any) =>
    React.createElement('div', null, children),
  DialogHeader: ({ children }: any) =>
    React.createElement('div', null, children),
  DialogTitle: ({ children }: any) => React.createElement('h2', null, children),
  DialogDescription: ({ children }: any) =>
    React.createElement('p', null, children),
  DialogFooter: ({ children }: any) =>
    React.createElement('div', null, children),
}));

vi.mock('@radix-ui/react-alert-dialog', () => ({
  AlertDialog: ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'AlertDialog' }, children),
  AlertDialogTrigger: ({ children }: any) =>
    React.createElement('div', null, children),
  AlertDialogContent: ({ children }: any) =>
    React.createElement('div', null, children),
  AlertDialogHeader: ({ children }: any) =>
    React.createElement('div', null, children),
  AlertDialogTitle: ({ children }: any) =>
    React.createElement('h2', null, children),
  AlertDialogDescription: ({ children }: any) =>
    React.createElement('p', null, children),
  AlertDialogFooter: ({ children }: any) =>
    React.createElement('div', null, children),
  AlertDialogAction: ({ children, ...props }: any) =>
    React.createElement('button', props, children),
  AlertDialogCancel: ({ children, ...props }: any) =>
    React.createElement('button', props, children),
}));

vi.mock('@radix-ui/react-presence', () => ({
  Presence: ({ children }: any) =>
    React.createElement(React.Fragment, null, children),
}));

vi.mock('@radix-ui/react-portal', () => ({
  Portal: ({ children }: any) =>
    React.createElement(React.Fragment, null, children),
}));

vi.mock('@radix-ui/react-dismissable-layer', () => ({
  DismissableLayer: ({ children }: any) =>
    React.createElement('div', null, children),
}));

vi.mock('@radix-ui/react-focus-scope', () => ({
  FocusScope: ({ children }: any) => React.createElement('div', null, children),
}));

vi.mock('@radix-ui/react-context', () => ({
  createContext: (defaultValue: any) => ({
    Provider: ({ children, value }: any) =>
      React.createElement(
        'div',
        { 'data-testid': 'ContextProvider' },
        children
      ),
    Consumer: ({ children }: any) => children(defaultValue),
  }),
}));

vi.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: any) => React.cloneElement(children, props),
}));

vi.mock('@radix-ui/react-primitive', () => ({
  createPrimitiveComponent: (config: any) => {
    const Component = React.forwardRef((props: any, ref: any) => {
      return React.createElement('div', { ...props, ref }, props.children);
    });
    Component.displayName = config.displayName;
    return Component;
  },
}));

// Enhanced Select mock with better form handling
vi.mock('@/design-system/components/Select', () => {
  const Select = ({ _value, onValueChange, _children }: any) =>
    React.createElement(
      'select',
      {
        role: 'combobox',
        value,
        onChange: (e: any) => onValueChange?.(e.target.value),
        'data-testid': 'select',
      },
      children
    );
  const SelectTrigger = ({ children, ...props }: any) =>
    React.createElement('button', { role: 'combobox', ...props }, children);
  const SelectValue = ({ children }: any) =>
    React.createElement('span', null, children);
  const SelectContent = ({ children }: any) =>
    React.createElement('div', { role: 'listbox' }, children);
  const SelectItem = ({ value, children }: any) =>
    React.createElement('option', { value, role: 'option' }, children);
  return { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
});

// Provide authenticated user so admin pages render without routing/provider
// Allow tests to override via globalThis.__TEST_USER__
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => {
    const g: any = globalThis as any;
    // Respect explicit null in tests; fallback only when undefined
    const hasTestUser = Object.prototype.hasOwnProperty.call(
      g,
      '__TEST_USER__'
    );
    const user = hasTestUser
      ? g.__TEST_USER__
      : { id: 1, username: 'Test User', email: 'test@example.com' };
    return { user } as any;
  },
}));

// Stub navigation to avoid needing a Router wrapper in unit tests
vi.mock('react-router-dom', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  const navigateMock =
    vi.fn() as unknown as import('react-router-dom').NavigateFunction;
  return {
    ...actual,
    default: (actual as any).default ?? {},
    useNavigate: () => navigateMock,
  } as unknown as typeof import('react-router-dom');
});

// Force confirm stub (jsdom implements confirm but throws by default)
if (typeof window !== 'undefined') {
  (window as any).confirm = () => true;
}

// Ensure global confirm is stubbed too
vi.stubGlobal('confirm', () => true);

// Lightweight UI component mocks to avoid heavy Radix behavior in tests
vi.mock('@/design-system/components/Tabs', () => ({
  Tabs: ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'Tabs' }, children),
  TabsList: ({ children }: any) =>
    React.createElement('div', { role: 'tablist' }, children),
  TabsTrigger: ({ children }: any) =>
    React.createElement('button', { role: 'tab' }, children),
  TabsContent: ({ children }: any) =>
    React.createElement('div', null, children),
}));

vi.mock('@/design-system/components/Switch', () => ({
  Switch: ({ checked, onCheckedChange }: any) =>
    React.createElement(
      'button',
      {
        role: 'switch',
        'aria-checked': !!checked,
        onClick: () => onCheckedChange?.(!checked),
      },
      ''
    ),
}));

// Disable repeating timers to prevent hanging tests due to open intervals
if (typeof globalThis.setInterval === 'function') {
  vi.stubGlobal('setInterval', (_cb: any, _ms?: number) => 0 as any);
}
if (typeof globalThis.clearInterval === 'function') {
  vi.stubGlobal('clearInterval', (_id: any) => {});
}

// Stub heavy admin sub-components to speed up render
vi.mock('@/components/Admin/UserManagement', () => ({
  default: () =>
    React.createElement('div', { 'data-testid': 'UserManagement' }),
}));
vi.mock('@/components/Admin/SystemMonitoring', () => ({
  default: () =>
    React.createElement('div', { 'data-testid': 'SystemMonitoring' }),
}));
vi.mock('@/components/Admin/DataManagement', () => ({
  default: () =>
    React.createElement('div', { 'data-testid': 'DataManagement' }),
}));

// Enhanced ConfirmDialog mock with proper button rendering
vi.mock('@/components/ui/ConfirmDialog', () => {
  const ConfirmDialog = ({
    _children,
    open,
    onOpenChange,
    title,
    description,
    confirmText,
    cancelText,
    onConfirm,
    ...props
  }: any) => {
    if (!open) return null;
    return React.createElement(
      'div',
      { 'data-testid': 'ConfirmDialog', ...props },
      [
        React.createElement('h2', { key: 'title' }, title),
        description &&
          React.createElement('p', { key: 'description' }, description),
        React.createElement('div', { key: 'buttons' }, [
          React.createElement(
            'button',
            {
              key: 'cancel',
              onClick: () => onOpenChange(false),
              'data-testid': 'cancel-button',
            },
            cancelText
          ),
          React.createElement(
            'button',
            {
              key: 'confirm',
              onClick: () => {
                onConfirm();
                onOpenChange(false);
              },
              'data-testid': 'confirm-button',
            },
            confirmText
          ),
        ]),
      ]
    );
  };
  return {
    ConfirmDialog,
    default: ConfirmDialog,
  };
});

// Mock AlertDialog component to prevent act() warnings
vi.mock('@/design-system/components/AlertDialog', () => ({
  default: ({ children, ...props }: any) =>
    React.createElement(
      'div',
      { 'data-testid': 'AlertDialog', ...props },
      children
    ),
}));

// Suppress React warnings about act() in tests
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    args[0]?.includes?.('Warning: An update to') &&
    args[0]?.includes?.('was not wrapped in act')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Export mock toast for tests to access
export { mockToast };
