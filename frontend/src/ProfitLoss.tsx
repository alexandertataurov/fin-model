import { useMemo } from 'react'
import type { Currency, Row } from './types'

interface Props {
  rows: Row[]
  fxRates: Record<string, number>
  baseCurrency: Currency
}

function ProfitLoss({ rows, fxRates, baseCurrency }: Props) {
  const data = useMemo(() => {
    const convert = (acc: string) =>
      rows
        .filter((r) => r.account.toLowerCase().includes(acc.toLowerCase()))
        .reduce((sum, r) => sum + r.amount / (fxRates[r.currency] ?? 1), 0)

    const revenue = convert('revenue')
    const cogs = convert('cogs') + convert('cost of goods sold')
    const opex = convert('opex') + convert('operating expenses')
    const admin = convert('administrative')
    const otherExpenses = convert('other expenses')
    const otherIncome = convert('other income')
    const taxes = convert('tax')

    const grossProfit = revenue + cogs
    const operationalProfit = grossProfit + opex + admin
    const ebt = operationalProfit + otherIncome + otherExpenses
    const netProfit = ebt + taxes

    return {
      revenue,
      cogs,
      grossProfit,
      opex,
      admin,
      operationalProfit,
      otherExpenses,
      otherIncome,
      ebt,
      taxes,
      netProfit,
    }
  }, [rows, fxRates])

  const fmt = (v: number) => {
    const abs = Math.abs(v).toLocaleString('en-US', {
      style: 'currency',
      currency: baseCurrency,
    })
    return v < 0 ? `(${abs})` : abs
  }

  return (
    <table className="pl-table">
      <tbody>
        <tr>
          <td>Revenue</td>
          <td className="val">{fmt(data.revenue)}</td>
        </tr>
        <tr>
          <td>COGS</td>
          <td className="val">{fmt(data.cogs)}</td>
        </tr>
        <tr>
          <td>Gross Profit</td>
          <td className="val">{fmt(data.grossProfit)}</td>
        </tr>
        <tr>
          <td>OPEX</td>
          <td className="val">{fmt(data.opex)}</td>
        </tr>
        <tr>
          <td>Administrative expenses</td>
          <td className="val">{fmt(data.admin)}</td>
        </tr>
        <tr>
          <td>Operational profit</td>
          <td className="val">{fmt(data.operationalProfit)}</td>
        </tr>
        <tr>
          <td>Other expenses</td>
          <td className="val">{fmt(data.otherExpenses)}</td>
        </tr>
        <tr>
          <td>Other Income</td>
          <td className="val">{fmt(data.otherIncome)}</td>
        </tr>
        <tr>
          <td>EBT</td>
          <td className="val">{fmt(data.ebt)}</td>
        </tr>
        <tr>
          <td>Taxes</td>
          <td className="val">{fmt(data.taxes)}</td>
        </tr>
        <tr>
          <td>Net Profit</td>
          <td className="val">{fmt(data.netProfit)}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default ProfitLoss
