export function formatCurrency(value: number, currency: string) {
  return Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency,
  });
}

