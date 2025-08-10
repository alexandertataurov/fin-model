import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';
import { useState } from 'react';

/**
 * Pagination - Advanced pagination component with infinite scrolling and virtual scrolling support
 * 
 * ## Usage
 * ```tsx
 * import { Pagination } from '@/components/ui/Pagination';
 * 
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   totalItems={100}
 *   itemsPerPage={10}
 *   onPageChange={(page) => setPage(page)}
 * />
 * ```
 * 
 * ## Features
 * - Standard pagination with page numbers
 * - Jump to page functionality
 * - Items per page selection
 * - Loading states
 * - Responsive design
 * - Accessibility compliant
 * 
 * ## Accessibility
 * - Screen reader friendly with proper ARIA labels
 * - Keyboard navigation support
 * - Focus management for interactive elements
 * - High contrast support
 */
const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Advanced pagination component with infinite scrolling and virtual scrolling support. Provides flexible pagination controls with customizable options for different use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'The currently active page number',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages available',
    },
    totalItems: {
      control: { type: 'number', min: 0 },
      description: 'Total number of items across all pages',
    },
    itemsPerPage: {
      control: { type: 'number', min: 1 },
      description: 'Number of items displayed per page',
    },
    onPageChange: {
      action: 'page changed',
      description: 'Callback fired when page changes',
    },
    onItemsPerPageChange: {
      action: 'items per page changed',
      description: 'Callback fired when items per page changes',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the pagination is in a loading state',
    },
    showInfo: {
      control: 'boolean',
      description: 'Whether to show the items info (e.g., "Showing 1-10 of 100 results")',
    },
    showJumpTo: {
      control: 'boolean',
      description: 'Whether to show the jump to page input',
    },
    maxVisiblePages: {
      control: { type: 'number', min: 3, max: 10 },
      description: 'Maximum number of page buttons to show at once',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// Wrapper component to handle state
const PaginationWrapper = (props: any) => {
  const [currentPage, setCurrentPage] = useState(props.currentPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(props.itemsPerPage || 10);
  
  return (
    <Pagination
      {...props}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      onItemsPerPageChange={setItemsPerPage}
    />
  );
};

// Primary story - shows the most common use case
export const Default: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    showInfo: true,
    showJumpTo: true,
  },
};

// Secondary story - shows pagination in the middle
export const MiddlePage: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 5,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    showInfo: true,
    showJumpTo: true,
  },
};

// Large dataset story - demonstrates pagination with many pages
export const LargeDataset: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 5,
    totalPages: 50,
    totalItems: 1000,
    itemsPerPage: 20,
    showInfo: true,
    showJumpTo: true,
  },
};

// Small dataset story - shows pagination with few pages
export const SmallDataset: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 1,
    totalPages: 3,
    totalItems: 25,
    itemsPerPage: 10,
    showInfo: true,
    showJumpTo: false,
  },
};

// Loading state story
export const Loading: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    loading: true,
    showInfo: true,
    showJumpTo: true,
  },
};

// States story - shows different pagination states
export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Default State</h3>
        <PaginationWrapper
          currentPage={1}
          totalPages={10}
          totalItems={100}
          itemsPerPage={10}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Loading State</h3>
        <PaginationWrapper
          currentPage={1}
          totalPages={10}
          totalItems={100}
          itemsPerPage={10}
          loading={true}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Without Info</h3>
        <PaginationWrapper
          currentPage={1}
          totalPages={10}
          totalItems={100}
          itemsPerPage={10}
          showInfo={false}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Without Jump To</h3>
        <PaginationWrapper
          currentPage={1}
          totalPages={10}
          totalItems={100}
          itemsPerPage={10}
          showJumpTo={false}
        />
      </div>
    </div>
  ),
};

// Usage examples story - shows real-world usage patterns
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Data Table Pagination</h3>
        <PaginationWrapper
          currentPage={3}
          totalPages={25}
          totalItems={500}
          itemsPerPage={20}
          showInfo={true}
          showJumpTo={true}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Search Results Pagination</h3>
        <PaginationWrapper
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          showInfo={true}
          showJumpTo={false}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Minimal Pagination</h3>
        <PaginationWrapper
          currentPage={2}
          totalPages={3}
          totalItems={30}
          itemsPerPage={10}
          showInfo={false}
          showJumpTo={false}
        />
      </div>
    </div>
  ),
};
