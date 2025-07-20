import { useMemo, useState } from 'react'
import useMetrics from './hooks/useMetrics'
import type { Currency, Row } from './types'

interface Props {
  rows: Row[]
  fxRates: Record<string, number>
  baseCurrency: Currency
}

function Forecast({ rows, fxRates, baseCurrency }: Props) {
  const [multiplier, setMultiplier] = useState(1)

  const forecastRows = useMemo(() => {
    return rows.map((r) => ({ ...r, amount: r.amount * multiplier }))
  }, [rows, multiplier])

  const { pinnedBottomRowData } = useMetrics(rows, fxRates, multiplier)

  const fmt = (val: number) =>
    Number(val).toLocaleString('en-US', {
      style: 'currency',
      currency: baseCurrency,
    })

  return (
    <div className="container">
      <h1>Forecast</h1>
      <label htmlFor="multiplier">
        Scenario Multiplier: {multiplier.toFixed(2)}
      </label>
      <input
        id="multiplier"
        type="range"
        min="0.5"
        max="1.5"
        step="0.1"
        value={multiplier}
        onChange={(e) => setMultiplier(Number(e.target.value))}
        className="slider"
      />
      <table className="model-table">
        <thead>
          <tr>
            <th>Account</th>
            <th>Currency</th>
            <th className="val">Amount ({baseCurrency})</th>
          </tr>
        </thead>
        <tbody>
          {forecastRows.map((r) => (
            <tr key={r.id}>
              <td>{r.account}</td>
              <td>{r.currency}</td>
              <td className="val">{fmt(r.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {pinnedBottomRowData.map((row) => (
            <tr key={row.account} className="total">
              <td colSpan={2}>{row.account}</td>
              <td className="val">{fmt(row.amount)}</td>
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  )
}

export default Forecast
