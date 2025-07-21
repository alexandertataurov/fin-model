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
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cells.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current);
    const [account = '', amountStr = '0', currency = defaultCurrency] = cells;
    return createRow(account, Number(amountStr), currency as Currency);
  });
}
