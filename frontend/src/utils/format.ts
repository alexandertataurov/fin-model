export function formatCurrency(value: number, currency: string) {
  return Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency,
  });
}

export function formatMillions(value: number) {
  const scaled = value / 1_000_000;
  const abs = Math.abs(scaled).toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return value < 0 ? `(${abs})` : abs;
}
