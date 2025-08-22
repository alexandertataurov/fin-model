import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '../../organisms/DataTable/DataTable';

const meta: Meta<typeof DataTable> = {
  title: 'Organisms / DataTable',
  component: DataTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'filled'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    striped: {
      control: { type: 'boolean' },
    },
    selectable: {
      control: { type: 'boolean' },
    },
    sortable: {
      control: { type: 'boolean' },
    },
    searchable: {
      control: { type: 'boolean' },
    },
    pagination: {
      control: { type: 'boolean' },
    },
    pageSize: {
      control: { type: 'number' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultColumns = [
  { key: 'id', title: 'ID', sortable: true },
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email' },
  { key: 'role', title: 'Role', sortable: true },
];

const defaultData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
  { id: '3', name: 'Peter Jones', email: 'peter@example.com', role: 'Viewer' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Admin' },
  { id: '5', name: 'Bob White', email: 'bob@example.com', role: 'Editor' },
  { id: '6', name: 'Charlie Green', email: 'charlie@example.com', role: 'Viewer' },
  { id: '7', name: 'Diana Prince', email: 'diana@example.com', role: 'Admin' },
  { id: '8', name: 'Eve Black', email: 'eve@example.com', role: 'Editor' },
  { id: '9', name: 'Frank Red', email: 'frank@example.com', role: 'Viewer' },
  { id: '10', name: 'Grace Blue', email: 'grace@example.com', role: 'Admin' },
];

export const Default: Story = {
  args: {
    title: 'User List',
    columns: defaultColumns,
    data: defaultData,
    selectable: true,
    sortable: true,
    searchable: true,
    pagination: true,
    onRowSelect: (selected) => console.log('Selected rows:', selected),
    onSort: (key, direction) => console.log(`Sorted by ${key}: ${direction}`),
    onSearch: (term) => console.log('Search term:', term),
    onPageChange: (page) => console.log('Page changed to:', page),
    onPageSizeChange: (size) => console.log('Page size changed to:', size),
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    title: 'Product Inventory',
    columns: [
      { key: 'id', title: 'Product ID' },
      { key: 'name', title: 'Product Name' },
      { key: 'price', title: 'Price' },
      { key: 'stock', title: 'Stock' },
    ],
    data: [
      { id: 'P001', name: 'Laptop', price: '$1200', stock: 50 },
      { id: 'P002', name: 'Mouse', price: '$25', stock: 200 },
      { id: 'P003', name: 'Keyboard', price: '$75', stock: 150 },
    ],
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    title: 'Order History',
    columns: [
      { key: 'orderId', title: 'Order ID' },
      { key: 'customer', title: 'Customer' },
      { key: 'total', title: 'Total' },
      { key: 'date', title: 'Order Date' },
    ],
    data: [
      { orderId: 'ORD001', customer: 'John Doe', total: '$150', date: '2023-01-15' },
      { orderId: 'ORD002', customer: 'Jane Smith', total: '$230', date: '2023-01-16' },
      { orderId: 'ORD003', customer: 'Peter Jones', total: '$80', date: '2023-01-17' },
    ],
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Compact Data',
    columns: defaultColumns,
    data: defaultData.slice(0, 5),
    striped: true,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Detailed Report',
    columns: defaultColumns,
    data: defaultData,
    pagination: true,
    pageSize: 5,
  },
};

export const Striped: Story = {
  args: {
    title: 'Striped Table',
    columns: defaultColumns,
    data: defaultData,
    striped: true,
  },
};

export const LoadingState: Story = {
  args: {
    title: 'Loading Data',
    columns: defaultColumns,
    data: [],
    loading: true,
  },
};

export const EmptyState: Story = {
  args: {
    title: 'Empty Table',
    columns: defaultColumns,
    data: [],
    emptyMessage: 'No users found matching your criteria.',
  },
};

export const CustomRender: Story = {
  args: {
    title: 'Users with Custom Render',
    columns: [
      { key: 'id', title: 'ID' },
      { key: 'name', title: 'Name' },
      { key: 'email', title: 'Email' },
      { key: 'status', title: 'Status', render: (value) => (
        <span style={{ color: value === 'Active' ? 'green' : 'red' }}>
          {value}
        </span>
      ) },
    ],
    data: [
      { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    ],
  },
};
