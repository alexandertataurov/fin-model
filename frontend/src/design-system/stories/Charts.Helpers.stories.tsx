import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from '../components/Chart';

const meta = {
  title: 'Design System/Charts/Helpers',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

const data = [
  { month: 'Jan', revenue: 4000, cost: 2400 },
  { month: 'Feb', revenue: 3000, cost: 2210 },
  { month: 'Mar', revenue: 2000, cost: 2290 },
  { month: 'Apr', revenue: 2780, cost: 2000 },
];

export const WithTokens = {
  render: () => (
    <ChartContainer
      config={{
        revenue: { label: 'Revenue', color: 'var(--primary)' },
        cost: { label: 'Cost', color: 'var(--destructive)' },
      }}
    >
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="cost"
          stroke="var(--color-cost)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  ),
};
