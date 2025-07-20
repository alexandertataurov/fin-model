import ProfitLossCompare from './components/Statements/ProfitLossCompare'
import type { Currency, Row } from './types'

interface Props {
  rows: Row[]
  fxRates: Record<string, number>
  baseCurrency: Currency
}

function Report({ rows, fxRates, baseCurrency }: Props) {
  return (
    <div className="report-container">
      <h1>Form 10-K Report</h1>
      <ProfitLossCompare
        rows={rows}
        fxRates={fxRates}
        baseCurrency={baseCurrency}
      />
    </div>
  )
}

export default Report
