import type { Meta, StoryObj } from '@storybook/react';
import { AuthGuard, AdminGuard, AnalystGuard, ViewerGuard, VerifiedUserGuard } from './AuthGuard';
import { useAuth } from '../../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the auth context
const mockAuthContext = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    hasRole: jest.fn(() => false),
};

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: jest.fn(() => mockAuthContext),
}));

const meta: Meta<typeof AuthGuard> = {
    title: 'Auth/AuthGuard',
    component: AuthGuard,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Authentication guard component for protecting routes and enforcing role-based access control.',
            },
        },
    },
    decorators: [
        (Story) => (
            <BrowserRouter>
                <Story />
            </BrowserRouter>
        ),
    ],
    tags: ['autodocs'],
    argTypes: {
        children: {
            control: false,
        },
        requiredRole: {
            control: 'select',
            options: ['admin', 'analyst', 'viewer'],
        },
        requireVerification: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof AuthGuard>;

// DEFAULT STORIES
export const Default: Story = {
    args: {
        children: (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Protected Content</h1>
                <p>This content is protected by the AuthGuard component.</p>
            </div>
        ),
    },
};

// AUTHENTICATION STATE STORIES
export const LoadingState: Story = {
    args: {
        children: (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Protected Content</h1>
                <p>This content is protected by the AuthGuard component.</p>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the loading state while authentication is being determined.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                ...mockAuthContext,
                isLoading: true,
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

export const NotAuthenticated: Story = {
    args: {
        children: (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Protected Content</h1>
                <p>This content is protected by the AuthGuard component.</p>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the redirect behavior when user is not authenticated.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                ...mockAuthContext,
                isAuthenticated: false,
                user: null,
                isLoading: false,
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

export const AuthenticatedUser: Story = {
    args: {
        children: (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Protected Content</h1>
                <p>This content is protected by the AuthGuard component.</p>
                <p className="mt-4 text-green-600">✅ Access granted!</p>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the component when user is authenticated and authorized.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                user: {
                    id: 1,
                    email: 'user@example.com',
                    is_verified: true,
                    role: 'viewer',
                },
                isAuthenticated: true,
                isLoading: false,
                hasRole: jest.fn(() => true),
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

// ROLE-BASED ACCESS STORIES
export const AdminAccessRequired: Story = {
    args: {
        requiredRole: 'admin',
        children: (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <p>This content requires admin access.</p>
                <p className="mt-4 text-green-600">✅ Admin access granted!</p>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the component when admin role is required and user has it.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                user: {
                    id: 1,
                    email: 'admin@example.com',
                    is_verified: true,
                    role: 'admin',
                },
                isAuthenticated: true,
                isLoading: false,
                hasRole: jest.fn((role) => role === 'admin'),
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

export const AccessDenied: Story = {
    args: {
        requiredRole: 'admin',
        children: (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <p>This content requires admin access.</p>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the access denied screen when user lacks required role.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                user: {
                    id: 1,
                    email: 'user@example.com',
                    is_verified: true,
                    role: 'viewer',
                },
                isAuthenticated: true,
                isLoading: false,
                hasRole: jest.fn(() => false),
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

// VERIFICATION STORIES
export const EmailVerificationRequired: Story = {
    args: {
        requireVerification: true,
        children: (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Protected Content</h1>
                <p>This content requires email verification.</p>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the email verification screen when user is not verified.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                user: {
                    id: 1,
                    email: 'user@example.com',
                    is_verified: false,
                    role: 'viewer',
                },
                isAuthenticated: true,
                isLoading: false,
                hasRole: jest.fn(() => true),
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

export const VerifiedUser: Story = {
    args: {
        requireVerification: true,
        children: (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Protected Content</h1>
                <p>This content requires email verification.</p>
                <p className="mt-4 text-green-600">✅ Email verified!</p>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the component when user is verified.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                user: {
                    id: 1,
                    email: 'user@example.com',
                    is_verified: true,
                    role: 'viewer',
                },
                isAuthenticated: true,
                isLoading: false,
                hasRole: jest.fn(() => true),
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

// SPECIFIC GUARD COMPONENTS
export const AdminGuardComponent: Story = {
    render: (args) => (
        <AdminGuard>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <p>This content is protected by AdminGuard.</p>
                <p className="mt-4 text-green-600">✅ Admin access granted!</p>
            </div>
        </AdminGuard>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Shows the AdminGuard component specifically for admin access.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                user: {
                    id: 1,
                    email: 'admin@example.com',
                    is_verified: true,
                    role: 'admin',
                },
                isAuthenticated: true,
                isLoading: false,
                hasRole: jest.fn((role) => role === 'admin'),
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

export const AnalystGuardComponent: Story = {
    render: (args) => (
        <AnalystGuard>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Analyst Dashboard</h1>
                <p>This content is protected by AnalystGuard.</p>
                <p className="mt-4 text-green-600">✅ Analyst access granted!</p>
            </div>
        </AnalystGuard>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Shows the AnalystGuard component specifically for analyst access.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                user: {
                    id: 1,
                    email: 'analyst@example.com',
                    is_verified: true,
                    role: 'analyst',
                },
                isAuthenticated: true,
                isLoading: false,
                hasRole: jest.fn((role) => role === 'analyst'),
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

export const ViewerGuardComponent: Story = {
    render: (args) => (
        <ViewerGuard>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Viewer Dashboard</h1>
                <p>This content is protected by ViewerGuard.</p>
                <p className="mt-4 text-green-600">✅ Viewer access granted!</p>
            </div>
        </ViewerGuard>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Shows the ViewerGuard component specifically for viewer access.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                user: {
                    id: 1,
                    email: 'viewer@example.com',
                    is_verified: true,
                    role: 'viewer',
                },
                isAuthenticated: true,
                isLoading: false,
                hasRole: jest.fn((role) => role === 'viewer'),
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

export const VerifiedUserGuardComponent: Story = {
    render: (args) => (
        <VerifiedUserGuard>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Verified User Content</h1>
                <p>This content is protected by VerifiedUserGuard.</p>
                <p className="mt-4 text-green-600">✅ Email verified!</p>
            </div>
        </VerifiedUserGuard>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Shows the VerifiedUserGuard component for verified users only.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                user: {
                    id: 1,
                    email: 'user@example.com',
                    is_verified: true,
                    role: 'viewer',
                },
                isAuthenticated: true,
                isLoading: false,
                hasRole: jest.fn(() => true),
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

// ERROR SCENARIOS
export const UnverifiedUserWithRole: Story = {
    args: {
        requiredRole: 'admin',
        requireVerification: true,
        children: (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <p>This content requires admin access and email verification.</p>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the email verification screen when user has role but is not verified.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                user: {
                    id: 1,
                    email: 'admin@example.com',
                    is_verified: false,
                    role: 'admin',
                },
                isAuthenticated: true,
                isLoading: false,
                hasRole: jest.fn((role) => role === 'admin'),
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

// ACCESSIBILITY STORIES
export const AccessibilityFocused: Story = {
    args: {
        requiredRole: 'admin',
        children: (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <p>This content requires admin access.</p>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the component with accessibility features highlighted for testing.',
            },
        },
        a11y: {
            config: {
                rules: [
                    {
                        id: 'color-contrast',
                        enabled: true,
                    },
                    {
                        id: 'button-name',
                        enabled: true,
                    },
                    {
                        id: 'heading-order',
                        enabled: true,
                    },
                ],
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                user: {
                    id: 1,
                    email: 'user@example.com',
                    is_verified: true,
                    role: 'viewer',
                },
                isAuthenticated: true,
                isLoading: false,
                hasRole: jest.fn(() => false),
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};

// INTEGRATION STORIES
export const WithComplexContent: Story = {
    args: {
        requiredRole: 'admin',
        requireVerification: true,
        children: (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Complex Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">User Management</h2>
                        <p>Manage user accounts and permissions.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">System Settings</h2>
                        <p>Configure system-wide settings and preferences.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Analytics</h2>
                        <p>View system analytics and performance metrics.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Logs</h2>
                        <p>Access system logs and audit trails.</p>
                    </div>
                </div>
                <p className="mt-6 text-green-600">✅ Full admin access granted!</p>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the component with complex content requiring admin access and verification.',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockAuth = {
                user: {
                    id: 1,
                    email: 'admin@example.com',
                    is_verified: true,
                    role: 'admin',
                },
                isAuthenticated: true,
                isLoading: false,
                hasRole: jest.fn((role) => role === 'admin'),
            };
            (useAuth as jest.Mock).mockReturnValue(mockAuth);
            return <Story />;
        },
    ],
};
