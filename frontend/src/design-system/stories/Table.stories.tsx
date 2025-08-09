import React from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from '../components/Table';

const meta = {
  title: 'Design System/Table',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
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
