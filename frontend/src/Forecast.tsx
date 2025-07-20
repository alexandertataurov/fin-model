import { useMemo, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, ValueFormatterParams } from 'ag-grid-community'
import useMetrics from './hooks/useMetrics'
import type { Currency, Row } from './types'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

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

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: 'account', headerName: 'Account', flex: 1 },
      { field: 'currency', headerName: 'Currency', width: 100 },
      {
        field: 'amount',
        headerName: `Amount (${baseCurrency})`,
        type: 'numericColumn',
        valueFormatter: (p: ValueFormatterParams) =>
          Number(p.value).toLocaleString('en-US', {
            style: 'currency',
            currency: baseCurrency,
          }),
        cellStyle: { textAlign: 'right' },
      },
    ],
    [baseCurrency],
  )

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
      <div className="ag-theme-alpine grid">
        <AgGridReact
          rowData={forecastRows}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1, editable: false, resizable: true }}
          pinnedBottomRowData={pinnedBottomRowData}
        />
      </div>
    </div>
  )
}

export default Forecast
