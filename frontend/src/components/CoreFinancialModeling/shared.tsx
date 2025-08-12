import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Input } from '@/design-system/components/Input';
import { Label } from '@/design-system/components/Label';

// Shared Types
export type ModelStatus = 'idle' | 'processing' | 'complete' | 'error';
export type ActiveTab =
  | 'overview'
  | 'statements'
  | 'parameters'
  | 'scenarios'
  | 'valuation'
  | 'analysis';

// Shared Interfaces
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface MetricData {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ScenarioData {
  name: string;
  status: 'Active' | 'Inactive';
}

// Shared Components
export const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
}: MetricData) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change}</p>
    </CardContent>
  </Card>
);

export const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  variant = 'outline',
  className = 'h-20 flex flex-col items-center justify-center space-y-2',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: 'outline' | 'default';
  className?: string;
}) => (
  <Button variant={variant} className={className} onClick={onClick}>
    <Icon className="h-6 w-6" />
    <span>{label}</span>
  </Button>
);

export const StatementCard = ({
  title,
  description,
  icon: Icon,
  actionLabel = 'View Statement',
  onAction,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Icon className="h-5 w-5" />
        <span>{title}</span>
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Button variant="outline" className="w-full" onClick={onAction}>
        {actionLabel}
      </Button>
    </CardContent>
  </Card>
);

export const ParameterInput = ({
  label,
  value,
  onChange,
  unit,
  description,
  min,
  max,
  step = 0.1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{label}</Label>
    <div className="flex items-center space-x-2">
      <Input
        type="number"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="flex-1"
      />
      <span className="text-sm text-muted-foreground min-w-fit">{unit}</span>
    </div>
    {description && (
      <p className="text-xs text-muted-foreground">{description}</p>
    )}
  </div>
);

export const StatusBadge = ({ status }: { status: ModelStatus }) => {
  const getStatusConfig = (status: ModelStatus) => {
    switch (status) {
      case 'complete':
        return { variant: 'default' as const, label: 'Model Ready' };
      case 'processing':
        return { variant: 'secondary' as const, label: 'Processing...' };
      case 'error':
        return { variant: 'destructive' as const, label: 'Error' };
      default:
        return { variant: 'secondary' as const, label: 'Model Status' };
    }
  };

  const config = getStatusConfig(status);

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const SectionHeader = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <div className="flex items-center space-x-2 mb-4">
    <Icon className="h-5 w-5 text-muted-foreground" />
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export const DataTable = ({
  headers,
  data,
}: {
  headers: string[];
  data: (string | number)[][];
}) => (
  <div className="border rounded-lg overflow-hidden">
    <table className="w-full">
      <thead className="bg-muted/50">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-4 py-2 text-left text-sm font-medium">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-t">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="px-4 py-2 text-sm">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Shared Constants
export const PARAMETER_CATEGORIES = [
  'Economic Environment',
  'Tax Environment',
  'Revenue Parameters',
  'COGS Parameters',
  'Operating Expenses',
  'Financial Parameters',
  'Operational Parameters',
  'Cash Flow Lifecycle',
  'Cash Flow Statement',
  'Asset Lifecycle',
  'Balance Sheet',
  'Valuation Parameters',
] as const;

export const VALUATION_SECTIONS = [
  'Free Cash Flow Projections',
  'Terminal Value Analysis',
  'Cost of Capital Breakdown',
  'Sensitivity Analysis',
] as const;

// Shared Utilities - Using centralized formatters from @/utils/formatters

export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const getPercentageChangeDisplay = (
  current: number,
  previous: number
): string => {
  const change = calculatePercentageChange(current, previous);
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};
