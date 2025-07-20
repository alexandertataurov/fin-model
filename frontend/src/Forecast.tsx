import { useMemo, useState } from 'react'
import ProfitLoss from './ProfitLoss'
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

  return (
    <div className="container">
      <h1>Forecast</h1>
      <label htmlFor="multiplier">Scenario Multiplier: {multiplier.toFixed(2)}</label>
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
      <ProfitLoss rows={forecastRows} fxRates={fxRates} baseCurrency={baseCurrency} />
    </div>
  )
}

export default Forecast
