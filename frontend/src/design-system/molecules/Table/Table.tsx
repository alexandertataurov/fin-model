import React from 'react';
import { cn } from '../../../utils/cn';

import type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
} from './Table.types';

import {
  tableVariants,
  tableHeaderVariants,
  tableBodyVariants,
  tableRowVariants,
  tableHeadVariants,
  tableCellVariants,
} from './Table.variants';

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => (
    <table ref={ref} className={cn(tableVariants(), className)} {...props}>
      {children}
    </table>
  )
);

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, children, ...props }, ref) => (
  <thead
    ref={ref as any}
    className={cn(tableHeaderVariants(), className)}
    {...props}
  >
    {children}
  </thead>
));

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, children, ...props }, ref) => (
  <tbody
    ref={ref as any}
    className={cn(tableBodyVariants(), className)}
    {...props}
  >
    {children}
  </tbody>
));

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => (
    <tr ref={ref} className={cn(tableRowVariants(), className)} {...props}>
      {children}
    </tr>
  )
);

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => (
    <th ref={ref} className={cn(tableHeadVariants(), className)} {...props}>
      {children}
    </th>
  )
);

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td ref={ref} className={cn(tableCellVariants(), className)} {...props}>
      {children}
    </td>
  )
);

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';
