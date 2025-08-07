import type { Meta, StoryObj } from '@storybook/react';
import AuthGuard, {
  AdminGuard,
  AnalystGuard,
  ViewerGuard,
  VerifiedUserGuard,
} from '../auth/AuthGuard';
import { Button } from '@/design-system/components/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';

const meta: Meta<typeof AuthGuard> = {
  title: 'Components/Auth/AuthGuard',
  component: AuthGuard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Authentication guard components that protect routes based on user roles and verification status.',
      },
    },
  },
  argTypes: {
    requiredRole: {
      control: { type: 'select' },
      options: ['admin', 'analyst', 'viewer'],
      description: 'Required role to access the protected content',
    },
    requireVerification: {
      control: { type: 'boolean' },
      description: 'Whether email verification is required',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock authentication context
const MockAuthProvider = ({
  children,
  user = null,
  isVerified = false,
}: any) => {
  // Simulate authentication context
  const authContext = {
    user,
    isAuthenticated: !!user,
    isVerified,
    role: user?.role || 'viewer',
  };

  return (
    <div className="p-4">
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Auth Context:</h3>
        <pre className="text-sm">{JSON.stringify(authContext, null, 2)}</pre>
      </div>
      {children}
    </div>
  );
};

// Basic AuthGuard stories
export const Default: Story = {
  render: () => (
    <MockAuthProvider
      user={{ id: 1, email: 'user@example.com', role: 'viewer' }}
    >
      <AuthGuard>
        <Card>
          <CardHeader>
            <CardTitle>Protected Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This content is protected by AuthGuard.</p>
            <Button className="mt-2">Action Button</Button>
          </CardContent>
        </Card>
      </AuthGuard>
    </MockAuthProvider>
  ),
};

export const WithRoleRequirement: Story = {
  render: () => (
    <MockAuthProvider
      user={{ id: 1, email: 'analyst@example.com', role: 'analyst' }}
    >
      <AuthGuard requiredRole="analyst">
        <Card>
          <CardHeader>
            <CardTitle>Analyst Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This content requires analyst role.</p>
            <div className="mt-4 space-y-2">
              <Button>View Reports</Button>
              <Button variant="outline">Export Data</Button>
            </div>
          </CardContent>
        </Card>
      </AuthGuard>
    </MockAuthProvider>
  ),
};

export const AdminOnly: Story = {
  render: () => (
    <MockAuthProvider
      user={{ id: 1, email: 'admin@example.com', role: 'admin' }}
    >
      <AuthGuard requiredRole="admin">
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This content requires admin role.</p>
            <div className="mt-4 space-y-2">
              <Button>Manage Users</Button>
              <Button variant="outline">System Settings</Button>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </AuthGuard>
    </MockAuthProvider>
  ),
};

export const RequireVerification: Story = {
  render: () => (
    <MockAuthProvider
      user={{ id: 1, email: 'user@example.com', role: 'viewer' }}
      isVerified={true}
    >
      <AuthGuard requireVerification>
        <Card>
          <CardHeader>
            <CardTitle>Verified User Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This content requires email verification.</p>
            <Button className="mt-2">Verified Action</Button>
          </CardContent>
        </Card>
      </AuthGuard>
    </MockAuthProvider>
  ),
};

// Specialized guard components
export const AdminGuardComponent: Story = {
  render: () => (
    <MockAuthProvider
      user={{ id: 1, email: 'admin@example.com', role: 'admin' }}
    >
      <AdminGuard>
        <Card>
          <CardHeader>
            <CardTitle>Admin Guard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This uses the AdminGuard component directly.</p>
            <Button className="mt-2">Admin Action</Button>
          </CardContent>
        </Card>
      </AdminGuard>
    </MockAuthProvider>
  ),
};

export const AnalystGuardComponent: Story = {
  render: () => (
    <MockAuthProvider
      user={{ id: 1, email: 'analyst@example.com', role: 'analyst' }}
    >
      <AnalystGuard>
        <Card>
          <CardHeader>
            <CardTitle>Analyst Guard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This uses the AnalystGuard component directly.</p>
            <Button className="mt-2">Analyst Action</Button>
          </CardContent>
        </Card>
      </AnalystGuard>
    </MockAuthProvider>
  ),
};

export const ViewerGuardComponent: Story = {
  render: () => (
    <MockAuthProvider
      user={{ id: 1, email: 'viewer@example.com', role: 'viewer' }}
    >
      <ViewerGuard>
        <Card>
          <CardHeader>
            <CardTitle>Viewer Guard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This uses the ViewerGuard component directly.</p>
            <Button className="mt-2">View Action</Button>
          </CardContent>
        </Card>
      </ViewerGuard>
    </MockAuthProvider>
  ),
};

export const VerifiedUserGuardComponent: Story = {
  render: () => (
    <MockAuthProvider
      user={{ id: 1, email: 'user@example.com', role: 'viewer' }}
      isVerified={true}
    >
      <VerifiedUserGuard>
        <Card>
          <CardHeader>
            <CardTitle>Verified User Guard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This uses the VerifiedUserGuard component directly.</p>
            <Button className="mt-2">Verified Action</Button>
          </CardContent>
        </Card>
      </VerifiedUserGuard>
    </MockAuthProvider>
  ),
};

// Access denied scenarios
export const AccessDeniedInsufficientRole: Story = {
  render: () => (
    <MockAuthProvider
      user={{ id: 1, email: 'viewer@example.com', role: 'viewer' }}
    >
      <AuthGuard requiredRole="admin">
        <Card>
          <CardHeader>
            <CardTitle>Admin Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This should not be visible to viewers.</p>
          </CardContent>
        </Card>
      </AuthGuard>
    </MockAuthProvider>
  ),
};

export const AccessDeniedNotVerified: Story = {
  render: () => (
    <MockAuthProvider
      user={{ id: 1, email: 'user@example.com', role: 'viewer' }}
      isVerified={false}
    >
      <AuthGuard requireVerification>
        <Card>
          <CardHeader>
            <CardTitle>Verified Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This should not be visible to unverified users.</p>
          </CardContent>
        </Card>
      </AuthGuard>
    </MockAuthProvider>
  ),
};

export const NotAuthenticated: Story = {
  render: () => (
    <MockAuthProvider user={null}>
      <AuthGuard>
        <Card>
          <CardHeader>
            <CardTitle>Protected Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This should not be visible to unauthenticated users.</p>
          </CardContent>
        </Card>
      </AuthGuard>
    </MockAuthProvider>
  ),
};

// Complex scenarios
export const MultipleGuards: Story = {
  render: () => (
    <MockAuthProvider
      user={{ id: 1, email: 'admin@example.com', role: 'admin' }}
      isVerified={true}
    >
      <div className="space-y-4">
        <AuthGuard requiredRole="admin">
          <Card>
            <CardHeader>
              <CardTitle>Admin Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Only admins can see this.</p>
            </CardContent>
          </Card>
        </AuthGuard>

        <AuthGuard requiredRole="analyst">
          <Card>
            <CardHeader>
              <CardTitle>Analyst Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Analysts and admins can see this.</p>
            </CardContent>
          </Card>
        </AuthGuard>

        <AuthGuard requireVerification>
          <Card>
            <CardHeader>
              <CardTitle>Verified Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Verified users can see this.</p>
            </CardContent>
          </Card>
        </AuthGuard>
      </div>
    </MockAuthProvider>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Role hierarchy demonstration
export const RoleHierarchy: Story = {
  render: () => (
    <div className="space-y-4">
      <MockAuthProvider
        user={{ id: 1, email: 'viewer@example.com', role: 'viewer' }}
      >
        <h3 className="font-semibold">Viewer Access:</h3>
        <div className="space-y-2">
          <AuthGuard requiredRole="viewer">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-3">
                <p className="text-sm">✓ Viewer content accessible</p>
              </CardContent>
            </Card>
          </AuthGuard>
          <AuthGuard requiredRole="analyst">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-3">
                <p className="text-sm">✗ Analyst content not accessible</p>
              </CardContent>
            </Card>
          </AuthGuard>
          <AuthGuard requiredRole="admin">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-3">
                <p className="text-sm">✗ Admin content not accessible</p>
              </CardContent>
            </Card>
          </AuthGuard>
        </div>
      </MockAuthProvider>

      <MockAuthProvider
        user={{ id: 2, email: 'analyst@example.com', role: 'analyst' }}
      >
        <h3 className="font-semibold">Analyst Access:</h3>
        <div className="space-y-2">
          <AuthGuard requiredRole="viewer">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-3">
                <p className="text-sm">✓ Viewer content accessible</p>
              </CardContent>
            </Card>
          </AuthGuard>
          <AuthGuard requiredRole="analyst">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-3">
                <p className="text-sm">✓ Analyst content accessible</p>
              </CardContent>
            </Card>
          </AuthGuard>
          <AuthGuard requiredRole="admin">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-3">
                <p className="text-sm">✗ Admin content not accessible</p>
              </CardContent>
            </Card>
          </AuthGuard>
        </div>
      </MockAuthProvider>

      <MockAuthProvider
        user={{ id: 3, email: 'admin@example.com', role: 'admin' }}
      >
        <h3 className="font-semibold">Admin Access:</h3>
        <div className="space-y-2">
          <AuthGuard requiredRole="viewer">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-3">
                <p className="text-sm">✓ Viewer content accessible</p>
              </CardContent>
            </Card>
          </AuthGuard>
          <AuthGuard requiredRole="analyst">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-3">
                <p className="text-sm">✓ Analyst content accessible</p>
              </CardContent>
            </Card>
          </AuthGuard>
          <AuthGuard requiredRole="admin">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-3">
                <p className="text-sm">✓ Admin content accessible</p>
              </CardContent>
            </Card>
          </AuthGuard>
        </div>
      </MockAuthProvider>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
