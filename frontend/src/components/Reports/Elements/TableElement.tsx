import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableConfig } from '@/types/template-builder';

interface TableElementProps {
  config?: TableConfig;
}

// Sample data for preview
const sampleData = [
  { id: 1, account: 'Revenue', q1: 125000, q2: 135000, q3: 145000, q4: 155000 },
  { id: 2, account: 'Cost of Goods Sold', q1: -75000, q2: -81000, q3: -87000, q4: -93000 },
  { id: 3, account: 'Gross Profit', q1: 50000, q2: 54000, q3: 58000, q4: 62000 },
  { id: 4, account: 'Operating Expenses', q1: -25000, q2: -27000, q3: -29000, q4: -31000 },
  { id: 5, account: 'Net Income', q1: 25000, q2: 27000, q3: 29000, q4: 31000 }
];

const sampleColumns = [
  { key: 'account', title: 'Account', format: 'text' as const },
  { key: 'q1', title: 'Q1', format: 'currency' as const },
  { key: 'q2', title: 'Q2', format: 'currency' as const },
  { key: 'q3', title: 'Q3', format: 'currency' as const },
  { key: 'q4', title: 'Q4', format: 'currency' as const }
];

export const TableElement: React.FC<TableElementProps> = ({ config }) => {
  if (!config || !config.columns || config.columns.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
        <div className="text-center text-gray-500">
          <div className="text-sm">Data Table</div>
          <div className="text-xs mt-1">Configure data source and columns</div>
        </div>
      </div>
    );
  }

  const formatValue = (value: any, format?: string) => {
    if (value === null || value === undefined) return '';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(Number(value));
      case 'percentage':
        return `${(Number(value) * 100).toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(Number(value));
      default:
        return String(value);
    }
  };

  // Use sample data if no data source is configured
  const data = sampleData;
  const columns = config.columns.length > 0 ? config.columns : sampleColumns;

  return (
    <div className="w-full h-full overflow-auto text-xs">
      <Table>
        {config.showHeaders !== false && (
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="text-xs font-medium">
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key} className="text-xs py-1">
                  {formatValue(row[column.key as keyof typeof row], column.format)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};