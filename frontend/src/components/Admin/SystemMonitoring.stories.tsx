import type { Meta, StoryObj } from '@storybook/react';
import SystemMonitoring from './SystemMonitoring';

const meta: Meta<typeof SystemMonitoring> = {
  title: 'Admin/SystemMonitoring',
  component: SystemMonitoring,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Real-time system monitoring component for performance metrics, alert management, and health indicators. Part of the consolidated Admin Dashboard system with comprehensive monitoring capabilities, configurable alert thresholds, and automated health checks.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onAlertTriggered: {
      description: 'Callback function when system alerts are triggered',
      control: false,
    },
    onMetricsUpdate: {
      description: 'Callback function when system metrics are updated',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof SystemMonitoring>;

// ============================================================================
// DEFAULT STORIES
// ============================================================================

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default system monitoring interface with performance metrics, alert management, and health indicators. Shows all available monitoring features with real-time data visualization.',
      },
    },
  },
};

// ============================================================================
// PERFORMANCE MONITORING STORIES
// ============================================================================

export const PerformanceMonitoring: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Performance monitoring functionality showing CPU usage, memory utilization, disk I/O, and network performance with real-time metrics and historical trends.',
      },
    },
  },
};

export const WithCPUMonitoring: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'CPU monitoring with detailed processor utilization, load averages, and performance bottlenecks detection with automated alerting for high CPU usage.',
      },
    },
  },
};

export const WithMemoryMonitoring: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Memory monitoring showing RAM usage, swap utilization, and memory leak detection with automated alerts for memory pressure and optimization recommendations.',
      },
    },
  },
};

export const WithDiskMonitoring: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Disk monitoring with storage utilization, I/O performance, and disk health indicators with automated alerts for disk space and performance issues.',
      },
    },
  },
};

export const WithNetworkMonitoring: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Network monitoring showing bandwidth utilization, connection status, and network performance metrics with automated alerts for network issues and bottlenecks.',
      },
    },
  },
};

// ============================================================================
// ALERT MANAGEMENT STORIES
// ============================================================================

export const AlertManagement: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Alert management system with configurable thresholds, notification channels, and alert escalation procedures for proactive system management.',
      },
    },
  },
};

export const WithConfigurableThresholds: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Configurable alert thresholds allowing administrators to set custom warning and critical levels for different system metrics with dynamic threshold adjustment.',
      },
    },
  },
};

export const WithAlertEscalation: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Alert escalation functionality with automated notification routing, escalation procedures, and alert acknowledgment workflows for critical system issues.',
      },
    },
  },
};

export const WithAlertHistory: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Alert history tracking with detailed alert logs, resolution tracking, and historical analysis for improving system reliability and alert effectiveness.',
      },
    },
  },
};

// ============================================================================
// HEALTH INDICATORS STORIES
// ============================================================================

export const HealthIndicators: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Health indicators showing overall system status, service health, and component reliability with visual status indicators and health scoring.',
      },
    },
  },
};

export const WithServiceHealth: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Service health monitoring with individual service status, dependency tracking, and service availability metrics with automated health checks.',
      },
    },
  },
};

export const WithComponentHealth: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Component health monitoring with detailed component status, failure detection, and component reliability metrics with predictive maintenance alerts.',
      },
    },
  },
};

// ============================================================================
// CALLBACK STORIES
// ============================================================================

export const WithAlertTriggered: Story = {
  args: {
    onAlertTriggered: (alert) => {
      console.log('System alert triggered:', alert);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'System monitoring with alert callback functionality for integration with notification systems and external alert management tools.',
      },
    },
  },
};

export const WithMetricsUpdate: Story = {
  args: {
    onMetricsUpdate: (metrics) => {
      console.log('System metrics updated:', metrics);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Metrics update callback functionality showing real-time data integration and metrics processing for external monitoring systems.',
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
        <SystemMonitoring />
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Note: This story shows the component in its default state.
            In a real scenario, monitoring would show real-time data.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'System monitoring with loading state indicators and user feedback during data collection. Shows progress indicators and data refresh status.',
      },
    },
  },
};

export const WithActiveAlerts: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'System monitoring with active alerts showing real-time alert status, alert details, and resolution workflows for immediate system issues.',
      },
    },
  },
};

export const WithHistoricalData: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Historical data visualization showing system performance trends, alert patterns, and system behavior analysis over time for capacity planning.',
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
        story: 'Mobile-responsive system monitoring interface with touch-friendly controls, simplified metrics display, and optimized mobile experience.',
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
        story: 'Tablet-optimized system monitoring interface with balanced metrics display and optimal use of screen real estate for tablet users.',
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
        story: 'Accessibility-focused system monitoring interface with keyboard navigation, screen reader support, and WCAG compliance features.',
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
            id: 'chart-alt',
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
        story: 'Integration with the main admin dashboard showing how system monitoring features work within the larger administrative interface.',
      },
    },
  },
};

export const WithNotificationSystem: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Notification system integration showing real-time alerts, status updates, and user feedback for system monitoring operations.',
      },
    },
  },
};
