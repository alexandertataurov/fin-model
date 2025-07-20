import { useCallback, useEffect, useMemo, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type {
  CellValueChangedEvent,
  ColDef,
  ICellRendererParams,
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

  const [rowData, setRowData] = useState<Row[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('rows')
    if (stored) {
      try {
        setRowData(JSON.parse(stored))
      } catch {
        setRowData([
          createRow('Revenue', 1000),
          createRow('Cost of Goods Sold', -300),
          createRow('Operating Expenses', -200),
        ])
      }
    } else {
      setRowData([
        createRow('Revenue', 1000),
        createRow('Cost of Goods Sold', -300),
        createRow('Operating Expenses', -200),
      ])
    }
  }, [createRow])

  useEffect(() => {
    if (rowData.length) {
      localStorage.setItem('rows', JSON.stringify(rowData))
    }
  }, [rowData])

  const handleDeleteRow = useCallback((id: string) => {
    setRowData((prev) => prev.filter((row) => row.id !== id))
  }, [])

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: 'account', headerName: 'Account' },
      {
        field: 'amount',
        headerName: 'Amount',
        type: 'numericColumn',
        valueParser: (params: ValueParserParams) => Number(params.newValue),
        valueFormatter: (params: ValueFormatterParams) =>

        Number(params.value).toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          }),
      },
      {
        headerName: '',
        field: 'delete',
        width: 90,
        cellRenderer: (params: ICellRendererParams<Row>) => {
          const handleClick = () => handleDeleteRow((params.data as Row).id)
          return (
            <button type="button" onClick={handleClick} className="delete-button">
              Delete
            </button>
          )
        },
      },
    ],
    [handleDeleteRow],
  )

  const defaultColDef = useMemo<ColDef>(
    () => ({ flex: 1, editable: true, resizable: true }),
    [],
  )

  const total = useMemo(
    () => rowData.reduce((sum, row) => sum + row.amount, 0),
    [rowData],
  )


  const average = useMemo(
    () => (rowData.length ? total / rowData.length : 0),
    [rowData.length, total],
  )

  const max = useMemo(
    () => (rowData.length ? Math.max(...rowData.map((r) => r.amount)) : 0),
    [rowData],
  )

  const min = useMemo(
    () => (rowData.length ? Math.min(...rowData.map((r) => r.amount)) : 0),
    [rowData],
  )

  const income = useMemo(
    () => rowData.filter((r) => r.amount > 0).reduce((sum, r) => sum + r.amount, 0),
    [rowData],
  )

  const expenses = useMemo(
    () => rowData.filter((r) => r.amount < 0).reduce((sum, r) => sum + r.amount, 0),
    [rowData],
  )

  const grossMargin = useMemo(() => income + expenses, [income, expenses])

  const ebitda = useMemo(() => grossMargin, [grossMargin])

  const cashFlow = useMemo(() => total, [total])

  const roi = useMemo(() => {
    const base = Math.abs(expenses)
    return base ? (cashFlow / base) * 100 : 0
  }, [cashFlow, expenses])

  const pinnedBottomRowData = useMemo(
    () => [
      { account: 'Total', amount: total },
      { account: 'Average', amount: average },
      { account: 'Max', amount: max },
      { account: 'Min', amount: min },
      { account: 'Gross Margin', amount: grossMargin },
      { account: 'EBITDA', amount: ebitda },
      { account: 'ROI', amount: roi },
      { account: 'Cash Flow', amount: cashFlow },
    ],
    [total, average, max, min, grossMargin, ebitda, roi, cashFlow],

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
