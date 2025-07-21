import { useMemo } from 'react';
import type { Metric } from '../types';

export default function useChartData(income: number, grossMargin: number, cashFlow: number) {
  return useMemo<Metric[]>(
    () => [
      { label: 'Revenue', value: income },
      { label: 'Profit', value: grossMargin },
      { label: 'Cash Flow', value: cashFlow },
    ],
    [income, grossMargin, cashFlow],
  );
}
