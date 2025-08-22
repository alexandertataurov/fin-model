import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PaginationControls } from '../../organisms/PaginationControls/PaginationControls';

const meta: Meta<typeof PaginationControls> = {
  title: 'Organisms / PaginationControls',
  component: PaginationControls,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'elevated'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    alignment: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'space-between'],
    },
    showInfo: {
      control: { type: 'boolean' },
    },
    showPageSize: {
      control: { type: 'boolean' },
    },
    showNavigation: {
      control: { type: 'boolean' },
    },
    showNumbers: {
      control: { type: 'boolean' },
    },
    maxVisiblePages: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    onPageChange: (page) => alert(`Page changed to: ${page}`),
    onPageSizeChange: (size) => alert(`Page size changed to: ${size}`),
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    currentPage: 3,
    totalPages: 15,
    totalItems: 145,
    pageSize: 10,
    showInfo: false,
    showPageSize: false,
    onPageChange: (page) => alert(`Page changed to: ${page}`),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    currentPage: 5,
    totalPages: 20,
    totalItems: 198,
    pageSize: 10,
    onPageChange: (page) => alert(`Page changed to: ${page}`),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    currentPage: 2,
    totalPages: 5,
    totalItems: 48,
    pageSize: 10,
    onPageChange: (page) => alert(`Page changed to: ${page}`),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    currentPage: 1,
    totalPages: 25,
    totalItems: 245,
    pageSize: 10,
    onPageChange: (page) => alert(`Page changed to: ${page}`),
  },
};

export const LeftAligned: Story = {
  args: {
    alignment: 'left',
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    onPageChange: (page) => alert(`Page changed to: ${page}`),
  },
};

export const RightAligned: Story = {
  args: {
    alignment: 'right',
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    onPageChange: (page) => alert(`Page changed to: ${page}`),
  },
};

export const OnlyNavigation: Story = {
  args: {
    showInfo: false,
    showPageSize: false,
    showNumbers: false,
    currentPage: 5,
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    onPageChange: (page) => alert(`Page changed to: ${page}`),
  },
};

export const OnlyNumbers: Story = {
  args: {
    showInfo: false,
    showPageSize: false,
    showNavigation: false,
    currentPage: 3,
    totalPages: 7,
    totalItems: 65,
    pageSize: 10,
    onPageChange: (page) => alert(`Page changed to: ${page}`),
  },
};

export const CustomPageSizeOptions: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    pageSize: 20,
    pageSizeOptions: [5, 10, 20, 50, 100],
    onPageChange: (page) => alert(`Page changed to: ${page}`),
    onPageSizeChange: (size) => alert(`Page size changed to: ${size}`),
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 50,
    totalPages: 100,
    totalItems: 1000,
    pageSize: 10,
    maxVisiblePages: 7,
    onPageChange: (page) => alert(`Page changed to: ${page}`),
  },
};
