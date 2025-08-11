import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ProtectedRoute from './ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';

const meta: Meta<typeof ProtectedRoute> = {
  title: 'Components/ProtectedRoute',
  component: ProtectedRoute,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A route protection component that wraps AuthGuard for backward compatibility.',
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
    redirectTo: {
      control: { type: 'text' },
      description: 'Redirect path when access is denied',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <Card>
        <CardHeader>
          <CardTitle>Protected Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This content is protected by ProtectedRoute.</p>
          <Button className="mt-2">Action Button</Button>
        </CardContent>
      </Card>
    ),
    requireVerification: true,
  },
};

export const AdminOnly: Story = {
  args: {
    children: (
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This content requires admin role.</p>
          <Button className="mt-2">Admin Action</Button>
        </CardContent>
      </Card>
    ),
    requiredRole: 'admin',
    requireVerification: true,
  },
};

export const AnalystAccess: Story = {
  args: {
    children: (
      <Card>
        <CardHeader>
          <CardTitle>Analyst Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This content requires analyst role or higher.</p>
          <Button className="mt-2">Analyst Action</Button>
        </CardContent>
      </Card>
    ),
    requiredRole: 'analyst',
    requireVerification: false,
  },
};
