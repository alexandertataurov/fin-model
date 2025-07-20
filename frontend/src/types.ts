export const currencyOptions = ['USD', 'EUR', 'GBP'] as const;
export type Currency = (typeof currencyOptions)[number];

export const scenarioOptions = ['Base', 'Optimistic', 'Pessimistic'] as const;
export type Scenario = (typeof scenarioOptions)[number];

export interface Row {
  id: string;
  account: string;
  amount: number;
  currency: Currency;
}

export interface Snapshot {
  id: string;
  timestamp: string;
  name: string;
  rows: Row[];
}

export interface Metric {
  label: string;
  value: number;
}
