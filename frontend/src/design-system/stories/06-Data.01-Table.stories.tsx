import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from '../components/Table';

const meta: Meta<typeof Table> = {
  title: 'Design System/6 - Data/Table',
  component: Table,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Default table with sample data</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Revenue</TableCell>
          <TableCell>$1,000,000</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Basic: Story = {
  render: () => (
    <Table>
      <TableCaption>Demo data</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Apples</TableCell>
          <TableCell>3</TableCell>
          <TableCell>$5</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Oranges</TableCell>
          <TableCell>2</TableCell>
          <TableCell>$4</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const FinancialData: Story = {
  render: () => (
    <Table>
      <TableCaption>Financial Performance Summary</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          <TableHead>2023</TableHead>
          <TableHead>2024</TableHead>
          <TableHead>Growth</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Revenue</TableCell>
          <TableCell>$850,000</TableCell>
          <TableCell>$1,200,000</TableCell>
          <TableCell>+41.2%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>EBITDA</TableCell>
          <TableCell>$120,000</TableCell>
          <TableCell>$180,000</TableCell>
          <TableCell>+50.0%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Net Income</TableCell>
          <TableCell>$85,000</TableCell>
          <TableCell>$135,000</TableCell>
          <TableCell>+58.8%</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Compact: Story = {
  render: () => (
    <Table className="w-full">
      <TableCaption>Compact table layout</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">Name</TableHead>
          <TableHead className="w-1/3">Type</TableHead>
          <TableHead className="w-1/3">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Discount Rate</TableCell>
          <TableCell>Percentage</TableCell>
          <TableCell>10.5%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Growth Rate</TableCell>
          <TableCell>Percentage</TableCell>
          <TableCell>15.0%</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
