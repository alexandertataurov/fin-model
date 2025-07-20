import type { Currency, Row } from '../types';

export function rowsToCsv(rows: Row[]): string {
  const lines = [
    ['account', 'amount', 'currency'],
    ...rows.map((r) => [r.account, String(r.amount), r.currency]),
  ];
  return lines.map((l) => l.join(',')).join('\n');
}

export function parseCsv(
  text: string,
  createRow: (account: string, amount: number, currency: Currency) => Row,
  defaultCurrency: Currency,
): Row[] {
  const lines = text.trim().split('\n').slice(1);
  return lines.map((line) => {
    const [account = '', amountStr = '0', currency = defaultCurrency] = line.split(',');
    return createRow(account, Number(amountStr), currency as Currency);
  });
}
