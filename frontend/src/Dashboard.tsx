import { useMemo } from 'react'
import type { Currency, Row } from './types'
import useMetrics from './hooks/useMetrics'
import MetricsChart from './Chart'

interface Props {
  rows: Row[]
  fxRates: Record<string, number>
  baseCurrency: Currency
}

function Dashboard({ rows, fxRates, baseCurrency }: Props) {
  const { chartData } = useMetrics(rows, fxRates, 1)

  const totals = useMemo(() => {
    const convert = (filter: (r: Row) => boolean) =>
      rows
        .filter(filter)
        .reduce((sum, r) => sum + r.amount / (fxRates[r.currency] ?? 1), 0)
    const revenue = convert((r) => r.amount > 0)
    const expenses = convert((r) => r.amount < 0)
    const profit = revenue + expenses
    return { revenue, profit }
  }, [rows, fxRates])

  const fmt = (v: number) => {
    const abs = Math.abs(v).toLocaleString('en-US', {
      style: 'currency',
      currency: baseCurrency,
    })
    return v < 0 ? `(${abs})` : abs
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="kpi-cards">
        <div className="kpi-card">
          <div className="kpi-label">Revenue</div>
          <div className="kpi-value">{fmt(totals.revenue)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Profit</div>
          <div className="kpi-value">{fmt(totals.profit)}</div>
        </div>
      </div>
      <MetricsChart data={chartData} />
    </div>
  )
}

export default Dashboard
