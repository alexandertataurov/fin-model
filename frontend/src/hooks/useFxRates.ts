import { useEffect, useState } from 'react';
import type { Currency } from '../types';

interface CacheEntry {
  base: Currency;
  timestamp: number;
  rates: Record<string, number>;
}

export default function useFxRates(baseCurrency: Currency) {
  const [rates, setRates] = useState<Record<string, number>>({ [baseCurrency]: 1 });

  useEffect(() => {
    const fetchRates = async () => {
      const cached = localStorage.getItem('fxRates');
      if (cached) {
        try {
          const entry = JSON.parse(cached) as CacheEntry;
          if (entry.base === baseCurrency && Date.now() - entry.timestamp < 12 * 60 * 60 * 1000) {
            setRates(entry.rates);
            return;
          }
        } catch {}
      }

      try {
        const res = await fetch(`https://api.exchangerate.host/latest?base=${baseCurrency}`);
        const data = await res.json();
        const newRates = { [baseCurrency]: 1, ...data.rates };
        setRates(newRates);
        const entry: CacheEntry = { base: baseCurrency, rates: newRates, timestamp: Date.now() };
        localStorage.setItem('fxRates', JSON.stringify(entry));
      } catch {
        setRates({ USD: 1, EUR: 0.92, GBP: 0.8 });
      }
    };
    fetchRates();
  }, [baseCurrency]);

  return rates;
}
