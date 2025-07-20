import { useCallback, useEffect, useState } from 'react';
import type { Currency, Row } from '../types';

const STORAGE_KEY = 'rows';

export default function useFinancialRows(baseCurrency: Currency) {
  const createRow = useCallback(
    (account: string, amount: number, currency: Currency): Row => ({
      id: crypto.randomUUID(),
      account,
      amount,
      currency,
    }),
    [],
  );

  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = (JSON.parse(stored) as unknown[]).map((r) => {
          const row = r as Partial<Row>;
          return {
            id: row.id ?? crypto.randomUUID(),
            account: row.account ?? '',
            amount: row.amount ?? 0,
            currency: row.currency ?? baseCurrency,
          };
        });
        setRows(parsed);
        return;
      } catch {
        // ignore and fall through to default
      }
    }
    setRows([
      createRow('Revenue', 1000, baseCurrency),
      createRow('Cost of Goods Sold', -300, baseCurrency),
      createRow('Operating Expenses', -200, baseCurrency),
    ]);
  }, [createRow, baseCurrency]);

  useEffect(() => {
    if (rows.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    }
  }, [rows]);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, createRow('', 0, baseCurrency)]);
  }, [createRow, baseCurrency]);

  const deleteRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const updateRow = useCallback((row: Row) => {
    setRows((prev) => prev.map((r) => (r.id === row.id ? row : r)));
  }, []);

  return {
    rows,
    setRows,
    addRow,
    deleteRow,
    updateRow,
    createRow,
  } as const;
}
