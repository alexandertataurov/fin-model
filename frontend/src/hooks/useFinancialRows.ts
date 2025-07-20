import { useCallback } from 'react';
import type { Currency, Row } from '../types';
import useLocalStorage from './useLocalStorage';

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

  const defaultRows = [
    createRowData('Revenue', 1000, baseCurrency),
    createRowData('Cost of Goods Sold', -300, baseCurrency),
    createRowData('Operating Expenses', -200, baseCurrency),
  ]

  const [rows, setRows] = useLocalStorage<Row[]>(STORAGE_KEY, defaultRows)

  const createRow = useCallback(createRowData, []);


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
