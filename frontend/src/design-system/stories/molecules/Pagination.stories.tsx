import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
} from '../../molecules/Pagination/Pagination';

const meta: Meta<typeof Pagination> = {
  title: '3 - Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A pagination component for navigating through pages of content.',
      },
    },
  },
  argTypes: {
    currentPage: {
      control: 'number',
      description: 'The current active page.',
    },
    totalPages: {
      control: 'number',
      description: 'The total number of pages.',
    },
    onPageChange: {
      action: 'page changed',
      description: 'Callback when the page changes.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the pagination links.',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'Visual variant of the pagination.',
    },
    showFirstLast: {
      control: 'boolean',
      description: 'Whether to show "first" and "last" page buttons.',
    },
    showPrevNext: {
      control: 'boolean',
      description: 'Whether to show "previous" and "next" page buttons.',
    },
    maxVisiblePages: {
      control: 'number',
      description: 'Maximum number of page links to display.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  },
  args: {
    totalPages: 10,
  },
};

export const ManyPages: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(5);
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  },
  args: {
    totalPages: 50,
    maxVisiblePages: 7,
  },
};

export const NoFirstLast: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(3);
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  },
  args: {
    totalPages: 10,
    showFirstLast: false,
  },
};

export const NoPrevNext: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(3);
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  },
  args: {
    totalPages: 10,
    showPrevNext: false,
  },
};

export const SmallSize: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  },
  args: {
    totalPages: 5,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  },
  args: {
    totalPages: 5,
    size: 'lg',
  },
};

export const OutlineVariant: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  },
  args: {
    totalPages: 10,
    variant: 'outline',
  },
};

export const GhostVariant: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  },
  args: {
    totalPages: 10,
    variant: 'ghost',
  },
};
