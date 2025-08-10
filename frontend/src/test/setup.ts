import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util';

// Polyfills for JSDOM gaps used by UI libs
if (typeof window !== 'undefined' && !('matchMedia' in window)) {
    (window as any).matchMedia = () => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
    });
}

if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    } as unknown as typeof ResizeObserver;
}

// Ensure TextEncoder/TextDecoder exist in Node envs
if (!(globalThis as any).TextEncoder) (globalThis as any).TextEncoder = NodeTextEncoder as unknown as typeof TextEncoder;
if (!(globalThis as any).TextDecoder) (globalThis as any).TextDecoder = NodeTextDecoder as unknown as typeof TextDecoder;

// Silence toasts during tests
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
    },
}));

// Simple, accessible mocks for Select to avoid Radix complexity in JSDOM
vi.mock('@/design-system/components/Select', () => {
    const React = require('react');
    const Select = ({ value, onValueChange, children }: any) =>
        React.createElement(
            'select',
            { role: 'combobox', value, onChange: (e: any) => onValueChange?.(e.target.value) },
            children,
        );
    const SelectTrigger = () => null;
    const SelectValue = () => null;
    const SelectContent = ({ children }: any) => React.createElement(React.Fragment, null, children);
    const SelectItem = ({ value, children }: any) => React.createElement('option', { value }, children);
    return { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
});

// Provide authenticated user so admin pages render without routing/provider
// Allow tests to override via globalThis.__TEST_USER__
vi.mock('@/contexts/AuthContext', () => ({
    useAuth: () => {
        const g: any = globalThis as any;
        // Respect explicit null in tests; fallback only when undefined
        const hasTestUser = Object.prototype.hasOwnProperty.call(g, '__TEST_USER__');
        const user = hasTestUser ? g.__TEST_USER__ : { id: 1, username: 'Test User', email: 'test@example.com' };
        return { user } as any;
    },
}));

// Stub navigation to avoid needing a Router wrapper in unit tests
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    const navigateMock = vi.fn() as unknown as import('react-router-dom').NavigateFunction;
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
    Tabs: ({ children }: any) => React.createElement('div', { 'data-testid': 'Tabs' }, children),
    TabsList: ({ children }: any) => React.createElement('div', { role: 'tablist' }, children),
    TabsTrigger: ({ children }: any) => React.createElement('button', { role: 'tab' }, children),
    TabsContent: ({ children }: any) => React.createElement('div', null, children),
}));

vi.mock('@/design-system/components/Switch', () => ({
    Switch: ({ checked, onCheckedChange }: any) => React.createElement(
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
    vi.stubGlobal('clearInterval', (_id: any) => { });
}

// Stub heavy admin sub-components to speed up render
vi.mock('@/components/Admin/UserManagement', () => ({
    default: () => React.createElement('div', { 'data-testid': 'UserManagement' }),
}));
vi.mock('@/components/Admin/SystemMonitoring', () => ({
    default: () => React.createElement('div', { 'data-testid': 'SystemMonitoring' }),
}));
vi.mock('@/components/Admin/DataManagement', () => ({
    default: () => React.createElement('div', { 'data-testid': 'DataManagement' }),
}));
