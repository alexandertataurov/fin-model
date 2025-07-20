import { useMemo, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import './App.css'

function App() {
  const [rowData] = useState([
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

  return (
    <div className="container">
      <h1>Financial Model</h1>
      <div className="ag-theme-alpine grid">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  )
}

export default App
