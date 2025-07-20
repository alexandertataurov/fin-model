import { useEffect, useState } from 'react';
import type { Currency } from '../types';

export default function useFxRates(baseCurrency: Currency) {
  const [rates, setRates] = useState<Record<string, number>>({ [baseCurrency]: 1 });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`https://api.exchangerate.host/latest?base=${baseCurrency}`);
        const data = await res.json();
        setRates({ [baseCurrency]: 1, ...data.rates });
      } catch {
        setRates({ USD: 1, EUR: 0.92, GBP: 0.8 });
      }
    };
    fetchRates();
  }, [baseCurrency]);

  return rates;
}
