import type { Meta, StoryObj } from '@storybook/react';
import { 
  Skeleton, 
  CardSkeleton, 
  TableSkeleton, 
  StatsSkeleton, 
  ChartSkeleton, 
  LogEntrySkeleton,
  HealthSkeleton 
} from './LoadingSkeleton';

/**
 * LoadingSkeleton - Reusable skeleton components for better loading states
 * 
 * ## Usage
 * ```tsx
 * import { Skeleton, CardSkeleton, TableSkeleton } from '@/components/ui/LoadingSkeleton';
 * 
 * // Basic skeleton
 * <Skeleton className="h-4 w-32" />
 * 
 * // Card skeleton
 * <CardSkeleton />
 * 
 * // Table skeleton
 * <TableSkeleton rows={5} columns={4} />
 * ```
 * 
 * ## Features
 * - Animated pulse effect
 * - Customizable dimensions
 * - Pre-built skeletons for common patterns
 * - Responsive design
 * - Accessibility compliant
 * 
 * ## Accessibility
 * - Screen reader friendly
 * - Proper ARIA labels for loading states
 * - High contrast support
 * - Reduced motion support
 */
const meta: Meta<typeof Skeleton> = {
  title: 'UI/LoadingSkeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Reusable skeleton components for better loading states. Provides animated placeholders that match the layout of actual content, improving perceived performance and user experience.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary story - shows the basic skeleton
export const Default: Story = {
  args: {
    className: 'h-4 w-32',
  },
};

// Different sizes story
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Skeleton className="h-2 w-16" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-12 w-80" />
    </div>
  ),
};

// Card skeleton story
export const Card: Story = {
  render: () => <CardSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Pre-built skeleton for dashboard cards with header, value, and description areas.',
      },
    },
  },
};

// Table skeleton story
export const Table: Story = {
  render: () => <TableSkeleton rows={5} columns={4} />,
  parameters: {
    docs: {
      description: {
        story: 'Pre-built skeleton for data tables with configurable rows and columns.',
      },
    },
  },
};

// Stats skeleton story
export const Stats: Story = {
  render: () => <StatsSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Pre-built skeleton for statistics/metrics cards in a grid layout.',
      },
    },
  },
};

// Chart skeleton story
export const Chart: Story = {
  render: () => <ChartSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Pre-built skeleton for chart components with title and chart area.',
      },
    },
  },
};

// Log entry skeleton story
export const LogEntry: Story = {
  render: () => <LogEntrySkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Pre-built skeleton for log entry items with timestamp, level, and message areas.',
      },
    },
  },
};

// Health skeleton story
export const Health: Story = {
  render: () => <HealthSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Pre-built skeleton for health status indicators.',
      },
    },
  },
};

// States story - shows different skeleton states
export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Basic Skeleton</h3>
        <Skeleton className="h-4 w-32" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Card Layout</h3>
        <CardSkeleton />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Table Layout</h3>
        <TableSkeleton rows={3} columns={3} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Stats Grid</h3>
        <StatsSkeleton />
      </div>
    </div>
  ),
};

// Usage examples story - shows real-world usage patterns
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Dashboard Loading State</h3>
        <div className="space-y-4">
          <StatsSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CardSkeleton />
            <ChartSkeleton />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Data Table Loading</h3>
        <TableSkeleton rows={8} columns={5} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Log Viewer Loading</h3>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <LogEntrySkeleton key={i} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Health Status Loading</h3>
        <HealthSkeleton />
      </div>
    </div>
  ),
};
