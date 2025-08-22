import React from 'react';

export interface TableProps extends React.ComponentPropsWithoutRef<'table'> {
  className?: string;
}

export interface TableHeaderProps
  extends React.ComponentPropsWithoutRef<'thead'> {
  className?: string;
}

export interface TableBodyProps
  extends React.ComponentPropsWithoutRef<'tbody'> {
  className?: string;
}

export interface TableRowProps extends React.ComponentPropsWithoutRef<'tr'> {
  className?: string;
}

export interface TableHeadProps extends React.ComponentPropsWithoutRef<'th'> {
  className?: string;
}

export interface TableCellProps extends React.ComponentPropsWithoutRef<'td'> {
  className?: string;
}

export type TableRef = HTMLTableElement;
