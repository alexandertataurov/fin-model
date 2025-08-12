import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import { formatCurrency } from '@/utils';

interface CurrencyBarChartProps {
  data: any[];
  tooltipLabel: string;
  barColor: string;
  showLegend?: boolean;
}

const CurrencyBarChart: React.FC<CurrencyBarChartProps> = ({
  data,
  tooltipLabel,
  barColor,
  showLegend,
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
      <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 12 }} />
      <YAxis
        className="text-xs"
        tick={{ fontSize: 12 }}
        tickFormatter={value => formatCurrency(value)}
      />
      <Tooltip
        formatter={(value: number) => [formatCurrency(value), tooltipLabel]}
        labelClassName="text-foreground"
        contentStyle={{
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '6px',
        }}
      />
      {showLegend && <Legend />}
      <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default CurrencyBarChart;
