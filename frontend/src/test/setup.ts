import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Polyfills for JSDOM gaps used by UI libs
if (typeof window !== 'undefined' && !('matchMedia' in window)) {
    // @ts-expect-error
    window.matchMedia = () => ({
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

// @ts-expect-error
if (typeof globalThis.ResizeObserver === 'undefined') {
    // @ts-expect-error
    globalThis.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    } as unknown as typeof ResizeObserver;
}

// Ensure TextEncoder/TextDecoder exist in Node envs
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { TextEncoder, TextDecoder } = require('util');
// @ts-expect-error
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
// @ts-expect-error
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

// Silence toasts during tests
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
    },
}));

// Provide authenticated user so admin pages render without routing/provider
// Allow tests to override via globalThis.__TEST_USER__
vi.mock('@/contexts/AuthContext', () => ({
    useAuth: () => ({ user: (globalThis as any).__TEST_USER__ ?? { id: 1, username: 'Test User', email: 'test@example.com' } }),
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
// @ts-expect-error
if (typeof window !== 'undefined') {
    // @ts-expect-error
    window.confirm = () => true;
}

// Ensure global confirm is stubbed too
// @ts-expect-error
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
// @ts-expect-error
if (typeof globalThis.setInterval === 'function') {
    // @ts-expect-error
    vi.stubGlobal('setInterval', (_cb: any, _ms?: number) => 0 as any);
}
// @ts-expect-error
if (typeof globalThis.clearInterval === 'function') {
    // @ts-expect-error
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


