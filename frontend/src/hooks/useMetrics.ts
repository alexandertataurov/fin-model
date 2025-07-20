import { useMemo } from 'react';
import type { Row } from '../types';
import useChartData from './useChartData';

export default function useMetrics(
  rows: Row[],
  fxRates: Record<string, number>,
  multiplier: number,
) {
  const converted = useMemo(
    () => rows.map((row) => row.amount / (fxRates[row.currency] ?? 1)),
    [rows, fxRates],
  );

  const scaled = useMemo(
    () => converted.map((val) => val * multiplier),
    [converted, multiplier],
  );

  const total = useMemo(
    () => scaled.reduce((sum, amount) => sum + amount, 0),
    [scaled],
  );

  const average = useMemo(
    () => (rows.length ? total / rows.length : 0),
    [rows.length, total],
  );

  const max = useMemo(
    () => (rows.length ? Math.max(...scaled) : 0),
    [rows.length, scaled],
  );

  const min = useMemo(
    () => (rows.length ? Math.min(...scaled) : 0),
    [rows.length, scaled],
  );

  const income = useMemo(
    () => scaled.filter((v) => v > 0).reduce((sum, v) => sum + v, 0),
    [scaled],
  );

  const expenses = useMemo(
    () => scaled.filter((v) => v < 0).reduce((sum, v) => sum + v, 0),
    [scaled],
  );

  const grossMargin = useMemo(() => income + expenses, [income, expenses]);

  const ebitda = grossMargin;

  const cashFlow = total;

  const roi = useMemo(() => {
    const base = Math.abs(expenses);
    return base ? (cashFlow / base) * 100 : 0;
  }, [cashFlow, expenses]);

  const pinnedBottomRowData = useMemo(
    () => [
      { account: 'Total', amount: total },
      { account: 'Average', amount: average },
      { account: 'Max', amount: max },
      { account: 'Min', amount: min },
      { account: 'Gross Margin', amount: grossMargin },
      { account: 'EBITDA', amount: ebitda },
      { account: 'ROI', amount: roi },
      { account: 'Cash Flow', amount: cashFlow },
    ],
    [total, average, max, min, grossMargin, ebitda, roi, cashFlow],
  );

  const chartData = useChartData(income, grossMargin, cashFlow);

  return {
    pinnedBottomRowData,
    chartData,
  } as const;
}
