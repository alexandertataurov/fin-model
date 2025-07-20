import { useMemo } from 'react'
import type { Currency, Row } from './types'
import { calculateProfitLoss } from './utils/profitLoss'
import { formatMillions } from './utils/format'

interface Props {
  rows: Row[]
  fxRates: Record<string, number>
  baseCurrency: Currency
}

function ProfitLoss({ rows, fxRates, baseCurrency }: Props) {
  const data = useMemo(
    () => calculateProfitLoss(rows, fxRates),
    [rows, fxRates],
  )

  const fmt = formatMillions

  return (
    <table className="pl-table">
      <thead>
        <tr>
          <th>Line Item</th>
          <th className="val">Amount ({baseCurrency} M)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Revenue</td>
          <td className={`val ${data.revenue < 0 ? 'negative' : ''}`}>{fmt(data.revenue)}</td>
        </tr>
        <tr>
          <td>COGS</td>
          <td className={`val ${data.cogs < 0 ? 'negative' : ''}`}>{fmt(data.cogs)}</td>
        </tr>
        <tr className="total">
          <td>Gross Profit</td>
          <td className="val">{fmt(data.grossProfit)}</td>
        </tr>
        <tr>
          <td>OPEX</td>
          <td className={`val ${data.opex < 0 ? 'negative' : ''}`}>{fmt(data.opex)}</td>
        </tr>
        <tr>
          <td>Administrative expenses</td>
          <td className={`val ${data.admin < 0 ? 'negative' : ''}`}>{fmt(data.admin)}</td>
        </tr>
        <tr className="total">
          <td>Operational profit</td>
          <td className="val">{fmt(data.operationalProfit)}</td>
        </tr>
        <tr>
          <td>Other expenses</td>
          <td className={`val ${data.otherExpenses < 0 ? 'negative' : ''}`}>{fmt(data.otherExpenses)}</td>
        </tr>
        <tr>
          <td>Other Income</td>
          <td className={`val ${data.otherIncome < 0 ? 'negative' : ''}`}>{fmt(data.otherIncome)}</td>
        </tr>
        <tr className="total">
          <td>EBT</td>
          <td className="val">{fmt(data.ebt)}</td>
        </tr>
        <tr>
          <td>Taxes</td>
          <td className={`val ${data.taxes < 0 ? 'negative' : ''}`}>{fmt(data.taxes)}</td>
        </tr>
        <tr className="final">
          <td>Net Profit</td>
          <td className="val">{fmt(data.netProfit)}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default ProfitLoss
