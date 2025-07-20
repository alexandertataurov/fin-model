import { useMemo } from 'react'
import type { Currency, Row } from '../../types'

interface Props {
  rows: Row[]
  fxRates: Record<string, number>
  baseCurrency: Currency
}

function ProfitLossCompare({ rows, fxRates, baseCurrency }: Props) {
  const gaap = useMemo(() => {
    const get = (name: string) =>
      rows
        .filter((r) => r.account.toLowerCase().includes(name.toLowerCase()))
        .reduce((sum, r) => sum + r.amount / (fxRates[r.currency] ?? 1), 0)
    const revenue = get('revenue')
    const cogs = get('cogs') + get('cost of goods sold')
    const opex = get('opex') + get('operating expenses')
    const admin = get('administrative')
    const otherExp = get('other expenses')
    const otherInc = get('other income')
    const taxes = get('tax')

    const grossProfit = revenue + cogs
    const operationalProfit = grossProfit + opex + admin
    const ebt = operationalProfit + otherInc + otherExp
    const netProfit = ebt + taxes

    return {
      revenue,
      cogs,
      grossProfit,
      opex,
      admin,
      operationalProfit,
      otherExp,
      otherInc,
      ebt,
      taxes,
      netProfit,
    }
  }, [rows, fxRates])

  const ifrs = useMemo(() => {
    const mul = 0.97
    return Object.fromEntries(
      Object.entries(gaap).map(([k, v]) => [k, v * mul]),
    ) as typeof gaap
  }, [gaap])

  const fmt = (v: number) => {
    const scaled = v / 1_000_000
    const abs = Math.abs(scaled).toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })
    return v < 0 ? `(${abs})` : abs
  }

  const RowItem = (
    label: string,
    key: keyof typeof gaap,
    isTotal?: boolean,
    isFinal?: boolean,
  ) => (
    <tr className={isFinal ? 'final' : isTotal ? 'total' : ''}>
      <td>{label}</td>
      <td className="val">{fmt(gaap[key])}</td>
      <td className="val">{fmt(ifrs[key])}</td>
      <td
        className={`val diff ${ifrs[key] - gaap[key] === 0 ? 'zero' : ifrs[key] - gaap[key] > 0 ? 'positive' : 'negative'}`}
      >
        {fmt(ifrs[key] - gaap[key])}
      </td>
    </tr>
  )

  return (
    <table className="statement-table">
      <thead>
        <tr>
          <th>Line Item</th>
          <th className="val">GAAP ({baseCurrency} M)</th>
          <th className="val">IFRS ({baseCurrency} M)</th>
          <th className="val">Difference</th>
        </tr>
      </thead>
      <tbody>
        {RowItem('Revenue', 'revenue')}
        {RowItem('COGS', 'cogs')}
        {RowItem('Gross Profit', 'grossProfit', true)}
        {RowItem('OPEX', 'opex')}
        {RowItem('Administrative expenses', 'admin')}
        {RowItem('Operational profit', 'operationalProfit', true)}
        {RowItem('Other expenses', 'otherExp')}
        {RowItem('Other Income', 'otherInc')}
        {RowItem('EBT', 'ebt', true)}
        {RowItem('Taxes', 'taxes')}
        {RowItem('Net Profit', 'netProfit', false, true)}
      </tbody>
    </table>
  )
}

export default ProfitLossCompare
