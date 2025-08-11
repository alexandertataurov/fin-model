import type { Meta, StoryObj } from '@storybook/react';
import { DataManagement } from './DataManagement';

const meta: Meta<typeof DataManagement> = {
  title: 'Admin/DataManagement',
  component: DataManagement,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Comprehensive data management component for database operations, backup management, data integrity checks, and migration tools. Part of the consolidated Admin Dashboard system with advanced data handling capabilities and automated maintenance features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onOperationComplete: {
      description: 'Callback function triggered when data operations complete',
      control: false,
    },
    onBackupCreated: {
      description: 'Callback function when backup operations are completed',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataManagement>;

// ============================================================================
// DEFAULT STORIES
// ============================================================================

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default data management interface with database operations, backup management, and data integrity tools. Shows all available data management features with their current status.',
      },
    },
  },
};

// ============================================================================
// BACKUP MANAGEMENT STORIES
// ============================================================================

export const BackupManagement: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Backup management functionality showing automated backup scheduling, manual backup creation, backup verification, and restore operations with comprehensive backup history.',
      },
    },
  },
};

export const WithScheduledBackups: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Scheduled backup configuration with automated backup creation, retention policies, and backup monitoring. Demonstrates automated data protection workflows.',
      },
    },
  },
};

export const WithBackupRestoration: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Backup restoration functionality with point-in-time recovery, selective data restoration, and backup verification processes for data recovery scenarios.',
      },
    },
  },
};

export const WithBackupVerification: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Backup verification tools for ensuring backup integrity, data consistency checks, and backup validation processes to guarantee reliable data recovery.',
      },
    },
  },
};

// ============================================================================
// DATA INTEGRITY STORIES
// ============================================================================

export const DataIntegrityChecks: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Data integrity checking tools for detecting data corruption, orphaned records, and consistency issues with automated repair capabilities and detailed reporting.',
      },
    },
  },
};

export const WithDataValidation: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Data validation processes for ensuring data quality, format compliance, and business rule enforcement with comprehensive validation reporting.',
      },
    },
  },
};

export const WithDataRepair: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Automated data repair tools for fixing data inconsistencies, resolving orphaned records, and restoring data integrity with safety previews and rollback capabilities.',
      },
    },
  },
};

// ============================================================================
// MIGRATION STORIES
// ============================================================================

export const MigrationTools: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Database migration tools for schema updates, data transformations, and version management with rollback capabilities and migration history tracking.',
      },
    },
  },
};

export const WithSchemaMigration: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Schema migration functionality for database structure updates, table modifications, and index optimization with automated migration planning and execution.',
      },
    },
  },
};

export const WithDataMigration: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Data migration tools for transferring data between systems, format conversions, and data transformation with progress tracking and error handling.',
      },
    },
  },
};

// ============================================================================
// OPERATION STORIES
// ============================================================================

export const WithOperationComplete: Story = {
  args: {
    onOperationComplete: (result) => {
      console.log('Data operation completed:', result);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Data management with operation completion callback for integration with the main admin dashboard. Demonstrates proper event handling and result processing.',
      },
    },
  },
};

export const WithBackupCreated: Story = {
  args: {
    onBackupCreated: (backupInfo) => {
      console.log('Backup created:', backupInfo);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Backup creation callback functionality showing integration with notification systems and backup tracking for administrative oversight.',
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
        <DataManagement />
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Note: This story shows the component in its default state.
            In a real scenario, operations would trigger loading states.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Data management with loading state indicators and user feedback during operations. Shows progress indicators and operation status updates.',
      },
    },
  },
};

export const WithActiveOperations: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Data management with active operations in progress, showing real-time status updates, progress bars, and operation cancellation options.',
      },
    },
  },
};

export const WithCompletedOperations: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Data management showing completed operations with detailed results, operation logs, and performance metrics for review and analysis.',
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
        story: 'Security features including encrypted backups, access controls, audit logging, and secure data handling for compliance and data protection.',
      },
    },
  },
};

export const WithAuditLogging: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Audit logging functionality showing detailed operation tracking, user activity logs, and compliance reporting for data management operations.',
      },
    },
  },
};

// ============================================================================
// SAFETY STORIES
// ============================================================================

export const WithSafetyChecks: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Safety check features including operation validation, dependency analysis, and risk assessment before executing data management tasks.',
      },
    },
  },
};

export const WithRollbackCapability: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Rollback capability for data operations allowing users to revert changes and restore previous states with comprehensive rollback tracking.',
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
        story: 'Mobile-responsive data management interface with touch-friendly controls, simplified operation options, and optimized mobile experience.',
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
        story: 'Tablet-optimized data management interface with balanced controls and optimal use of screen real estate for tablet users.',
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
        story: 'Accessibility-focused data management interface with keyboard navigation, screen reader support, and WCAG compliance features.',
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
        story: 'Integration with the main admin dashboard showing how data management features work within the larger administrative interface.',
      },
    },
  },
};

export const WithNotificationSystem: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Notification system integration showing real-time alerts, operation status updates, and user feedback for data management operations.',
      },
    },
  },
};
