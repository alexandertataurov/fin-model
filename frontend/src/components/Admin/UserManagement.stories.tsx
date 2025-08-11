import type { Meta, StoryObj } from '@storybook/react';
import { UserManagement } from './UserManagement';

const meta: Meta<typeof UserManagement> = {
  title: 'Admin/UserManagement',
  component: UserManagement,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Comprehensive user management component for user administration, role management, and access control. Part of the consolidated Admin Dashboard system with advanced user management capabilities, granular permission controls, and user activity monitoring.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onUserUpdated: {
      description: 'Callback function when user operations are completed',
      control: false,
    },
    onRoleChanged: {
      description: 'Callback function when user roles are modified',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserManagement>;

// ============================================================================
// DEFAULT STORIES
// ============================================================================

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default user management interface with user administration, role management, and access control features. Shows all available user management capabilities with comprehensive user oversight.',
      },
    },
  },
};

// ============================================================================
// USER ADMINISTRATION STORIES
// ============================================================================

export const UserAdministration: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'User administration functionality showing user creation, editing, deletion, and account management with comprehensive user lifecycle management.',
      },
    },
  },
};

export const WithUserCreation: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'User creation workflow with account setup, role assignment, and initial configuration. Demonstrates streamlined user onboarding processes.',
      },
    },
  },
};

export const WithUserEditing: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'User editing capabilities with profile updates, role modifications, and account settings management with change tracking and audit logs.',
      },
    },
  },
};

export const WithUserDeletion: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'User deletion functionality with account deactivation, data cleanup, and access revocation with safety confirmations and audit trails.',
      },
    },
  },
};

export const WithBulkOperations: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Bulk user operations for efficient management of multiple users including bulk role assignment, status updates, and data export capabilities.',
      },
    },
  },
};

// ============================================================================
// ROLE MANAGEMENT STORIES
// ============================================================================

export const RoleManagement: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Role management system with role creation, permission assignment, and role hierarchy management with comprehensive access control.',
      },
    },
  },
};

export const WithRoleCreation: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Role creation functionality with custom role definition, permission mapping, and role template management for flexible access control.',
      },
    },
  },
};

export const WithPermissionAssignment: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Permission assignment tools with granular permission controls, permission inheritance, and dynamic permission updates for precise access management.',
      },
    },
  },
};

export const WithRoleHierarchy: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Role hierarchy management with role inheritance, permission cascading, and organizational role structures for complex access control scenarios.',
      },
    },
  },
};

// ============================================================================
// ACCESS CONTROL STORIES
// ============================================================================

export const AccessControl: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Access control management with user permissions, resource access, and security policy enforcement with comprehensive access auditing.',
      },
    },
  },
};

export const WithPermissionManagement: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Permission management with detailed permission controls, access matrix visualization, and permission conflict resolution for comprehensive security.',
      },
    },
  },
};

export const WithResourceAccess: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Resource access management with file permissions, API access controls, and feature-level access restrictions with detailed access logging.',
      },
    },
  },
};

export const WithSecurityPolicies: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Security policy enforcement with password policies, session management, and security compliance features with automated policy validation.',
      },
    },
  },
};

// ============================================================================
// CALLBACK STORIES
// ============================================================================

export const WithUserUpdated: Story = {
  args: {
    onUserUpdated: (user) => {
      console.log('User updated:', user);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'User management with update callback functionality for integration with notification systems and external user management tools.',
      },
    },
  },
};

export const WithRoleChanged: Story = {
  args: {
    onRoleChanged: (user, newRole) => {
      console.log('User role changed:', user, 'to', newRole);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Role change callback functionality showing integration with audit systems and role change tracking for compliance and security.',
      },
    },
  },
};

// ============================================================================
// STATE-BASED STORIES
// ============================================================================

export const LoadingState: Story = {
  render: () => {
    return (
      <div className="p-6">
        <UserManagement />
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Note: This story shows the component in its default state.
            In a real scenario, user operations would trigger loading states.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'User management with loading state indicators and user feedback during operations. Shows progress indicators and operation status updates.',
      },
    },
  },
};

export const WithActiveUsers: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'User management with active user sessions showing real-time user activity, session monitoring, and user status tracking.',
      },
    },
  },
};

export const WithUserActivity: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'User activity monitoring with login history, action tracking, and user behavior analysis for security and compliance purposes.',
      },
    },
  },
};

// ============================================================================
// SECURITY STORIES
// ============================================================================

export const WithSecurityFeatures: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Security features including multi-factor authentication, session management, and security audit logging for comprehensive user security.',
      },
    },
  },
};

export const WithAuditLogging: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Audit logging functionality showing detailed user activity tracking, change history, and compliance reporting for user management operations.',
      },
    },
  },
};

// ============================================================================
// RESPONSIVE STORIES
// ============================================================================

export const MobileResponsive: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-responsive user management interface with touch-friendly controls, simplified user operations, and optimized mobile experience.',
      },
    },
  },
};

export const TabletResponsive: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet-optimized user management interface with balanced controls and optimal use of screen real estate for tablet users.',
      },
    },
  },
};

// ============================================================================
// ACCESSIBILITY STORIES
// ============================================================================

export const AccessibilityFocused: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Accessibility-focused user management interface with keyboard navigation, screen reader support, and WCAG compliance features.',
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
        ],
      },
    },
  },
};

// ============================================================================
// INTEGRATION STORIES
// ============================================================================

export const WithDashboardIntegration: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Integration with the main admin dashboard showing how user management features work within the larger administrative interface.',
      },
    },
  },
};

export const WithNotificationSystem: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Notification system integration showing real-time alerts, user activity updates, and administrative notifications for user management operations.',
      },
    },
  },
};
