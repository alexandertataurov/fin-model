import type { Meta, StoryObj } from '@storybook/react';
import { LogFilterForm } from './LogFilterForm';
import type { LogsState } from '@/stores/admin/types';

const meta: Meta<typeof LogFilterForm> = {
  title: 'AdminDashboard/LogFilterForm',
  component: LogFilterForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Log filter form component for filtering and paginating system logs.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'filter changed' },
    onRefresh: { action: 'refresh clicked' },
    onPrev: { action: 'previous clicked' },
    onNext: { action: 'next clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof LogFilterForm>;

// DEFAULT STORIES
export const Default: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 150,
  },
};

// STATE-BASED STORIES
export const WithActiveFilters: Story = {
  args: {
    level: 'ERROR',
    limit: 100,
    from: '2024-01-01',
    to: '2024-01-31',
    search: 'database',
    skip: 0,
    total: 45,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with active filters applied.',
      },
    },
  },
};

export const WithSearchFilter: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: 'authentication',
    skip: 0,
    total: 12,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with search filter applied.',
      },
    },
  },
};

export const WithDateRangeFilter: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '2024-01-15',
    to: '2024-01-20',
    search: '',
    skip: 0,
    total: 23,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with date range filter applied.',
      },
    },
  },
};

export const WithLevelFilter: Story = {
  args: {
    level: 'WARNING',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 67,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with log level filter applied.',
      },
    },
  },
};

export const WithLargeLimit: Story = {
  args: {
    level: 'all',
    limit: 500,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 1250,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with large limit setting.',
      },
    },
  },
};

// PAGINATION STORIES
export const FirstPage: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 150,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form on the first page of results.',
      },
    },
  },
};

export const MiddlePage: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 50,
    total: 150,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form on a middle page of results.',
      },
    },
  },
};

export const LastPage: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 100,
    total: 150,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form on the last page of results.',
      },
    },
  },
};

export const SinglePage: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 25,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with results that fit on a single page.',
      },
    },
  },
};

export const NoResults: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with no results.',
      },
    },
  },
};

// RESPONSIVE DESIGN STORIES
export const MobileResponsive: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 150,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Shows how the form adapts to mobile screen sizes.',
      },
    },
  },
};

export const TabletResponsive: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 150,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Shows how the form adapts to tablet screen sizes.',
      },
    },
  },
};

export const DesktopWide: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 150,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Shows the form on wide desktop screens.',
      },
    },
  },
};

// ACCESSIBILITY STORIES
export const AccessibilityFocused: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 150,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with accessibility features highlighted for testing.',
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
            id: 'select-name',
            enabled: true,
          },
        ],
      },
    },
  },
};

// INTERACTION STORIES
export const WithUserInteractions: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 150,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with interactive elements for user testing.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // This would contain interaction testing logic
    // For now, it's a placeholder for future interaction testing
  },
};

// COMPLEX FILTER STORIES
export const WithComplexFilters: Story = {
  args: {
    level: 'ERROR',
    limit: 200,
    from: '2024-01-01',
    to: '2024-01-31',
    search: 'database connection timeout',
    skip: 100,
    total: 450,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with multiple complex filters applied.',
      },
    },
  },
};

export const WithLongSearchTerm: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: 'very long search term that might cause layout issues in the filter form',
    skip: 0,
    total: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with a long search term to test layout handling.',
      },
    },
  },
};

// PERFORMANCE STORIES
export const WithLargeDataset: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 50000,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form handling a large dataset with many pages.',
      },
    },
  },
};

// ERROR STATE STORIES
export const WithInvalidDateRange: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '2024-01-31',
    to: '2024-01-01', // Invalid: end date before start date
    search: '',
    skip: 0,
    total: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form with an invalid date range.',
      },
    },
  },
};

// INTEGRATION STORIES
export const WithRealTimeUpdates: Story = {
  args: {
    level: 'all',
    limit: 50,
    from: '',
    to: '',
    search: '',
    skip: 0,
    total: 150,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the form integrated with real-time log updates.',
      },
    },
  },
};
