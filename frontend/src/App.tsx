import { useCallback, useMemo, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type {
  CellValueChangedEvent,
  ColDef,
  ValueFormatterParams,
  ValueParserParams,
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import './App.css'

interface Row {
  id: string
  account: string
  amount: number
}

function App() {
  const createRow = useCallback(
    (account: string, amount: number): Row => ({
      id: crypto.randomUUID(),
      account,
      amount,
    }),
    [],
  )

  const [rowData, setRowData] = useState<Row[]>([
    createRow('Revenue', 1000),
    createRow('Cost of Goods Sold', -300),
    createRow('Operating Expenses', -200),
  ])

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: 'account', headerName: 'Account' },
      {
        field: 'amount',
        headerName: 'Amount',
        type: 'numericColumn',
        valueParser: (params: ValueParserParams) => Number(params.newValue),
        valueFormatter: (params: ValueFormatterParams) =>
          Number(params.value).toFixed(2),
      },
    ],
    [],
  )

  const defaultColDef = useMemo<ColDef>(
    () => ({ flex: 1, editable: true, resizable: true }),
    [],
  )

  const total = useMemo(
    () => rowData.reduce((sum, row) => sum + row.amount, 0),
    [rowData],
  )

  const pinnedBottomRowData = useMemo(
    () => [{ account: 'Total', amount: total }],
    [total],
  )

  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent) => {
      const updated = (params.data as Row)
      setRowData((prev) =>
        prev.map((row) => (row.id === updated.id ? updated : row)),
      )
    },
    [],
  )

  const handleAddRow = useCallback(() => {
    setRowData([...rowData, createRow('', 0)])
  }, [rowData, createRow])

  return (
    <div className="container">
      <h1>Financial Model</h1>
      <button type="button" onClick={handleAddRow} className="add-button">
        Add Row
      </button>
      <div className="ag-theme-alpine grid">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pinnedBottomRowData={pinnedBottomRowData}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  )
}

export default App
