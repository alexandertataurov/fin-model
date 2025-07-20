import type { Row } from '../types';

export interface ProfitLossData {
  revenue: number;
  cogs: number;
  grossProfit: number;
  opex: number;
  admin: number;
  operationalProfit: number;
  otherExpenses: number;
  otherIncome: number;
  ebt: number;
  taxes: number;
  netProfit: number;
}

export function calculateProfitLoss(
  rows: Row[],
  fxRates: Record<string, number>,
): ProfitLossData {
  const convert = (name: string) =>
    rows
      .filter((r) => r.account.toLowerCase().includes(name.toLowerCase()))
      .reduce((sum, r) => sum + r.amount / (fxRates[r.currency] ?? 1), 0);

  const revenue = convert('revenue');
  const cogs = convert('cogs') + convert('cost of goods sold');
  const opex = convert('opex') + convert('operating expenses');
  const admin = convert('administrative');
  const otherExpenses = convert('other expenses');
  const otherIncome = convert('other income');
  const taxes = convert('tax');

  const grossProfit = revenue + cogs;
  const operationalProfit = grossProfit + opex + admin;
  const ebt = operationalProfit + otherIncome + otherExpenses;
  const netProfit = ebt + taxes;

  return {
    revenue,
    cogs,
    grossProfit,
    opex,
    admin,
    operationalProfit,
    otherExpenses,
    otherIncome,
    ebt,
    taxes,
    netProfit,
  };
}
