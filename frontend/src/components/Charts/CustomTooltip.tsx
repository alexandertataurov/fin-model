import React from 'react';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { Card, Separator } from '../ui';



interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number | string;
    name: string;
    color: string;
    dataKey: string;
    payload?: unknown;
  }>;
  label?: string;
  formatter?: (value: number | string, name: string) => [string, string];
  labelFormatter?: (label: string) => string;
  currency?: string;
  showTotal?: boolean;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  currency = '$',
  showTotal = false,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }





  const getFormattedValue = (value: number | string, name: string): string => {
    if (formatter) {
      return formatter(value, name)[0];
    }
    
    // Auto-detect formatting based on name or value
    if (name.toLowerCase().includes('percent') || name.toLowerCase().includes('rate') || name.toLowerCase().includes('margin')) {
      return formatPercentage(value);
    }
    
    if (typeof value === 'number' && Math.abs(value) > 100) {
      return formatCurrency(value);
    }
    
    return String(value);
  };

  const formattedLabel = labelFormatter ? labelFormatter(label || '') : label;
  
  const total = showTotal && payload.length > 1 
    ? payload.reduce((sum, item) => {
        const val = typeof item.value === 'number' ? item.value : parseFloat(String(item.value)) || 0;
        return sum + val;
      }, 0)
    : null;

  return (
    <Card
      data-testid="tooltip"
      className="min-w-[200px] max-w-[300px] border shadow-lg bg-background p-3 text-sm"
    >
      {/* Label */}
      {formattedLabel && (
        <h4 className="font-semibold mb-2 text-foreground">
          {formattedLabel}
        </h4>
      )}

      {/* Data Items */}
      <div className="flex flex-col gap-1">
        {payload.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground font-medium">
                {formatter ? formatter(item.value, item.name)[1] : item.name}
              </span>
            </div>
            <span className="font-semibold text-foreground text-right">
              {getFormattedValue(item.value, item.name)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      {total !== null && (
        <>
          <Separator className="my-2" />
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-foreground">
              Total
            </span>
            <span className="font-bold text-primary text-right">
              {formatCurrency(total)}
            </span>
          </div>
        </>
      )}
    </Card>
  );
};

export default CustomTooltip; 