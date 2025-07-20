import { AgGridReact } from 'ag-grid-react'
import { useMemo, useCallback } from 'react'
import type { ColDef, RowClassParams } from 'ag-grid-community'
import type { Currency, Row } from './types'

interface Props {
  rows: Row[]
  fxRates: Record<string, number>
  baseCurrency: Currency
}

function Report({ rows, fxRates, baseCurrency }: Props) {
  const data = useMemo(() => {
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

  const fmt = useCallback((v: number) => {
    const scaled = v / 1_000_000
    const abs = Math.abs(scaled).toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })
    return v < 0 ? `(${abs})` : abs
  }, [])

  const rowData = useMemo(
    () => [
      { label: 'Revenue', value: data.revenue },
      { label: 'COGS', value: data.cogs },
      { label: 'Gross Profit', value: data.grossProfit, type: 'total' },
      { label: 'OPEX', value: data.opex },
      { label: 'Administrative expenses', value: data.admin },
      { label: 'Operational profit', value: data.operationalProfit, type: 'total' },
      { label: 'Other expenses', value: data.otherExp },
      { label: 'Other Income', value: data.otherInc },
      { label: 'EBT', value: data.ebt, type: 'total' },
      { label: 'Taxes', value: data.taxes },
    ],
    [data],
  )

  const pinnedBottomRowData = useMemo(
    () => [{ label: 'Net Profit', value: data.netProfit, type: 'final' }],
    [data],
  )

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: 'label', headerName: 'Line Item', flex: 1 },
      {
        field: 'value',
        headerName: `Amount (${baseCurrency} M)`,
        flex: 1,
        type: 'numericColumn',
        valueFormatter: (p) => fmt(p.value as number),
        cellClass: 'val',
      },
    ],
    [baseCurrency, fmt],
  )

  const defaultColDef = useMemo<ColDef>(
    () => ({ editable: false, sortable: false, resizable: false }),
    [],
  )

  const getRowClass = useCallback((p: RowClassParams) => {
    if (p.data?.type === 'final') return 'final-row'
    if (p.data?.type === 'total') return 'total-row'
    return ''
  }, [])

  return (
    <div className="report-container">
      <h1>Form 10-K Report</h1>
      <div className="ag-theme-alpine report-grid">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          headerHeight={40}
          rowHeight={40}
          pinnedBottomRowData={pinnedBottomRowData}
          getRowClass={getRowClass}
        />
      </div>
    </div>
  )
}

export default Report
