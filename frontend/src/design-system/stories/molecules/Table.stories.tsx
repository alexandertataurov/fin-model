import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../molecules/Table/Table';

const meta: Meta<typeof Table> = {
  title: '3 - Molecules/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A basic table component for displaying tabular data.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const data = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
  },
  {
    id: 3,
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    role: 'Viewer',
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'Admin',
  },
];

export const Default: Story = {
  args: {
    children: (
      <>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    ),
  },
};

export const EmptyTable: Story = {
  args: {
    children: (
      <>
        <TableHeader>
          <TableRow>
            <TableHead>Column 1</TableHead>
            <TableHead>Column 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={2}
              className="text-center text-muted-foreground py-4"
            >
              No data available.
            </TableCell>
          </TableRow>
        </TableBody>
      </>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    children: (
      <>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              This is a very long description that might wrap to multiple lines.
              It demonstrates how the table handles extensive text content
              gracefully.
            </TableCell>
            <TableCell>More details here, potentially also wrapping.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Short description.</TableCell>
            <TableCell>Short details.</TableCell>
          </TableRow>
        </TableBody>
      </>
    ),
  },
};
