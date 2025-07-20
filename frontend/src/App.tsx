import { useCallback, useMemo, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { CellValueChangedEvent, ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import './App.css'

function App() {
  const [rowData, setRowData] = useState([
    { account: 'Revenue', amount: 1000 },
    { account: 'Cost of Goods Sold', amount: -300 },
    { account: 'Operating Expenses', amount: -200 },
  ])

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: 'account', headerName: 'Account' },
      { field: 'amount', headerName: 'Amount', type: 'numericColumn' },
    ],
    [],
  )

  const defaultColDef = useMemo<ColDef>(
    () => ({ flex: 1, editable: true, resizable: true }),
    [],
  )

  const total = useMemo(
    () => rowData.reduce((sum, row) => sum + Number(row.amount), 0),
    [rowData],
  )

  const pinnedBottomRowData = useMemo(
    () => [{ account: 'Total', amount: total }],
    [total],
  )

  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent) => {
      if (params.rowIndex == null) return
      const data = [...rowData]
      data[params.rowIndex] = params.data
      setRowData(data)
    },
    [rowData],
  )

  const handleAddRow = useCallback(() => {
    setRowData([...rowData, { account: '', amount: 0 }])
  }, [rowData])

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
