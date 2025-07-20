import type { Currency, Row } from '../types';
import styles from './ModelTable.module.css';

interface PinnedRow {
  account: string;
  amount: number;
}

interface Props {
  rows: Row[];
  errors: Record<string, boolean>;
  baseCurrency: Currency;
  fxRates: Record<string, number>;
  pinnedBottomRowData: PinnedRow[];
  onAccountChange: (id: string, value: string) => void;
  onCurrencyChange: (id: string, currency: Currency) => void;
  onAmountChange: (id: string, value: string) => void;
  onDeleteRow: (id: string) => void;
  fmt: (value: number, currency: Currency) => string;
}

function ModelTable({
  rows,
  errors,
  baseCurrency,
  fxRates,
  pinnedBottomRowData,
  onAccountChange,
  onCurrencyChange,
  onAmountChange,
  onDeleteRow,
  fmt,
}: Props) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Account</th>
          <th>Currency</th>
          <th className={styles.val}>Amount</th>
          <th className={styles.val}>Amount ({baseCurrency})</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const amountClass =
            row.amount >= 0 ? styles.positive : styles.negative
          return (
            <tr key={row.id}>
            <td>
              <input
                className="field"
                value={row.account}
                onChange={(e) => onAccountChange(row.id, e.target.value)}
              />
            </td>
            <td>
              <select
                className="field"
                value={row.currency}
                onChange={(e) => onCurrencyChange(row.id, e.target.value as Currency)}
              >
                {['USD', 'EUR', 'GBP'].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="number"
                className={`field ${
                  errors[row.id] ? styles.inputError : amountClass
                }`}
                value={row.amount}
                onChange={(e) => onAmountChange(row.id, e.target.value)}
              />
            </td>
            <td className={`${styles.val} ${amountClass}`}>
              {fmt(row.amount / (fxRates[row.currency] ?? 1), baseCurrency)}
            </td>
            <td>
              <button
                type="button"
                onClick={() => onDeleteRow(row.id)}
                className={`btn ${styles.deleteButton}`}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      })}
      </tbody>
      <tfoot>
        {pinnedBottomRowData.map((r) => {
          const cls = r.amount >= 0 ? styles.positive : styles.negative
          return (
            <tr key={r.account} className="total">
              <td colSpan={3}>{r.account}</td>
              <td className={`${styles.val} ${cls}`}>{fmt(r.amount, baseCurrency)}</td>
              <td />
            </tr>
          )
        })}
      </tfoot>
    </table>
  );
}

export default ModelTable;
