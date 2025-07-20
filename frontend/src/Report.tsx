import { useMemo, useCallback } from 'react'
import type { Currency, Row } from './types'
import { calculateProfitLoss } from './utils/profitLoss'
import { formatMillions } from './utils/format'

interface Props {
  rows: Row[]
  fxRates: Record<string, number>
  baseCurrency: Currency
}

function Report({ rows, fxRates, baseCurrency }: Props) {
  const data = useMemo(
    () => calculateProfitLoss(rows, fxRates),
    [rows, fxRates],
  )

  const fmt = useCallback(formatMillions, [])

  const rowData = useMemo(
    () => [
      { label: 'Revenue', value: data.revenue },
      { label: 'COGS', value: data.cogs },
      { label: 'Gross Profit', value: data.grossProfit, type: 'total' },
      { label: 'OPEX', value: data.opex },
      { label: 'Administrative expenses', value: data.admin },
      { label: 'Operational profit', value: data.operationalProfit, type: 'total' },
      { label: 'Other expenses', value: data.otherExpenses },
      { label: 'Other Income', value: data.otherIncome },
      { label: 'EBT', value: data.ebt, type: 'total' },
      { label: 'Taxes', value: data.taxes },
    ],
    [data],
  )

  const pinnedBottomRowData = useMemo(
    () => [{ label: 'Net Profit', value: data.netProfit, type: 'final' }],
    [data],
  )

  const getRowClass = useCallback((row: { type?: string }) => {
    if (row.type === 'final') return 'final'
    if (row.type === 'total') return 'total'
    return ''
  }, [])

  return (
    <div className="report-container">
      <h1>Form 10-K Report</h1>
      <table className="report-table">
        <thead>
          <tr>
            <th>Line Item</th>
            <th className="val">Amount ({baseCurrency} M)</th>
          </tr>
        </thead>
        <tbody>
          {rowData.map((r) => (
            <tr key={r.label} className={getRowClass(r)}>
              <td>{r.label}</td>
              <td className="val">{fmt(r.value)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {pinnedBottomRowData.map((r) => (
            <tr key={r.label} className={getRowClass(r)}>
              <td>{r.label}</td>
              <td className="val">{fmt(r.value)}</td>
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  )
}

export default Report
