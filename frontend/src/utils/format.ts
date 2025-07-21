export interface FormatOptions {
  locale?: string;
  currencyDisplay?: 'symbol' | 'code' | 'name';
}

export function formatCurrency(value: number, currency: string, opts: FormatOptions = {}) {
  const { locale = 'en-US', currencyDisplay = 'symbol' } = opts;
  return Number(value).toLocaleString(locale, {
    style: 'currency',
    currency,
    currencyDisplay,
  });
}

