import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';
import { useState } from 'react';

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Advanced pagination component with infinite scrolling and virtual scrolling support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
    },
    totalPages: {
      control: { type: 'number', min: 1 },
    },
    totalItems: {
      control: { type: 'number', min: 0 },
    },
    itemsPerPage: {
      control: { type: 'number', min: 1 },
    },
    loading: {
      control: 'boolean',
    },
    showInfo: {
      control: 'boolean',
    },
    showJumpTo: {
      control: 'boolean',
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

export const NoInfo: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    showInfo: false,
    showJumpTo: true,
  },
};

export const NoJumpTo: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    showInfo: true,
    showJumpTo: false,
  },
};

export const SinglePage: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 5,
    itemsPerPage: 10,
    showInfo: true,
    showJumpTo: true,
  },
};
