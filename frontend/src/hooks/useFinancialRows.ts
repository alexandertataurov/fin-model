import { useCallback, useEffect, useState } from 'react';
import type { Currency, Row } from '../types';

const STORAGE_KEY = 'rows';

export default function useFinancialRows(baseCurrency: Currency) {
  function createRowData(
    account: string,
    amount: number,
    currency: Currency,
  ): Row {
    return {
      id: crypto.randomUUID(),
      account,
      amount,
      currency,
    };
  }

  const [rows, setRows] = useState<Row[]>(() => {
    if (typeof window === 'undefined') {
      return [
        createRowData('Revenue', 1000, baseCurrency),
        createRowData('Cost of Goods Sold', -300, baseCurrency),
        createRowData('Operating Expenses', -200, baseCurrency),
      ]
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const raw = JSON.parse(stored)
        if (Array.isArray(raw) && raw.length) {
          return raw.map((r) => {
            const row = r as Partial<Row>
            return {
              id: row.id ?? crypto.randomUUID(),
              account: row.account ?? '',
              amount: row.amount ?? 0,
              currency: row.currency ?? baseCurrency,
            }
          })
        }
      } catch {
        // ignore and fall through to default
      }
    }

    return [
      createRowData('Revenue', 1000, baseCurrency),
      createRowData('Cost of Goods Sold', -300, baseCurrency),
      createRowData('Operating Expenses', -200, baseCurrency),
    ]
  })

  const createRow = useCallback(createRowData, []);

  useEffect(() => {
    if (rows.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    }
  }, [rows]);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, createRowData('', 0, baseCurrency)]);
  }, [baseCurrency]);

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
