import { useCallback, useMemo, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type {
  CellValueChangedEvent,
  ColDef,
  CellClassParams,
  CellClassRules,
  ICellRendererParams,
  RowDragEndEvent,
  ValueFormatterParams,
  ValueParserParams,
} from 'ag-grid-community'
import MetricsChart from './Chart'
import useFinancialRows from './hooks/useFinancialRows'
import useSnapshots from './hooks/useSnapshots'
import useFxRates from './hooks/useFxRates'
import useMetrics from './hooks/useMetrics'
import { currencyOptions } from './types'
import type { Currency, Row } from './types'
import { parseCsv, rowsToCsv } from './utils/csv'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import './App.css'

function App() {
  const [baseCurrency, setBaseCurrency] = useState<Currency>('USD')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    rows: rowData,
    setRows: setRowData,
    addRow,
    deleteRow,
    updateRow,
    createRow,
  } = useFinancialRows(baseCurrency)
  const { snapshots, saveSnapshot, renameSnapshot, deleteSnapshot } =
    useSnapshots()
  const fxRates = useFxRates(baseCurrency)

  const scenarioOptions = ['Base', 'Optimistic', 'Pessimistic'] as const
  type Scenario = (typeof scenarioOptions)[number]
  const scenarioMultipliers: Record<Scenario, number> = {
    Base: 1,
    Optimistic: 1.1,
    Pessimistic: 0.9,
  }

  const [scenario, setScenario] = useState<Scenario>('Base')
  const [errors, setErrors] = useState<Record<string, boolean>>({})


  // row state is managed by useFinancialRows


  const handleDeleteRow = useCallback(
    (id: string) => {
      deleteRow(id)
    },
    [deleteRow],
  )

  const handleScenarioChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setScenario(e.target.value as Scenario)
    },
    [],
  )
  const handleExport = useCallback(() => {
    const csv = rowsToCsv(rowData)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'financial-model.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [rowData])

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {

        const text = (reader.result as string)
        const rows = parseCsv(text, createRow, baseCurrency)
        setRowData(rows)
      }
      reader.readAsText(file)
      e.target.value = ''
    },
    [createRow, baseCurrency, setRowData],
  )

  const handleSaveSnapshot = useCallback(() => {
    const name = prompt('Snapshot name?', new Date().toLocaleString())
    if (name) {
      saveSnapshot(rowData, name)
    }
  }, [saveSnapshot, rowData])

  const handleLoadSnapshot = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value
      if (!value) return
      const [action, id] = value.split(':')
      if (!id) return
      if (action === 'load') {
        const snap = snapshots.find((s) => s.id === id)
        if (snap) setRowData(snap.rows)
      } else if (action === 'rename') {
        const name = prompt('Snapshot name?')
        if (name) renameSnapshot(id, name)
      } else if (action === 'delete') {
        if (confirm('Delete snapshot?')) deleteSnapshot(id)
      }
      e.target.selectedIndex = 0
    },
    [snapshots, setRowData, renameSnapshot, deleteSnapshot],
  )

  const handleSync = useCallback(async () => {
    try {
      const res = await fetch('/.netlify/functions/save-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: rowData, timestamp: new Date().toISOString() }),
      })
      if (res.ok) {
        alert('Synced')
      } else {
        alert('Sync failed')
      }
    } catch {
      alert('Sync failed')
    }
  }, [rowData])

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { headerName: '', field: 'drag', rowDrag: true, width: 40 },
      { field: 'account', headerName: 'Account' },
      {
        field: 'currency',
        headerName: 'Currency',
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: currencyOptions as readonly string[] },
        width: 110,
      },
      {
        field: 'amount',
        headerName: 'Amount',
        type: 'numericColumn',
        valueParser: (params: ValueParserParams) => Number(params.newValue),
        valueFormatter: (params: ValueFormatterParams) => {
          const c = (params.data as Row | undefined)?.currency ?? baseCurrency
          return Number(params.value).toLocaleString(undefined, {
            style: 'currency',
            currency: c,
          })
        },
        cellClassRules: {
          positive: (p: CellClassParams<Row>) => Number(p.value) > 0,
          negative: (p: CellClassParams<Row>) => Number(p.value) < 0,
          'input-error': (p: CellClassParams<Row>) =>
            Boolean(p.data && errors[p.data.id]),
        } as CellClassRules<Row>,
      },
      {
        headerName: `Amount (${baseCurrency})`,
        field: 'baseAmount',
        valueGetter: (params) => {
          const row = params.data as Row
          const rate = fxRates[row.currency] ?? 1
          return row.amount / rate
        },
        valueFormatter: (params: ValueFormatterParams) =>
          Number(params.value).toLocaleString(undefined, {
            style: 'currency',
            currency: baseCurrency,
          }),
        editable: false,
        cellClassRules: {
          positive: (p: CellClassParams<Row>) => Number(p.value) > 0,
          negative: (p: CellClassParams<Row>) => Number(p.value) < 0,
        } as CellClassRules<Row>,
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
    [handleDeleteRow, baseCurrency, fxRates, errors],
  )

  const defaultColDef = useMemo<ColDef>(
    () => ({ flex: 1, editable: true, resizable: true }),
    [],
  )

  const multiplier = scenarioMultipliers[scenario]
  const { pinnedBottomRowData, chartData } = useMetrics(
    rowData,
    fxRates,
    multiplier,
  )

  const handleRowDragEnd = useCallback(
    (e: RowDragEndEvent) => {
      const from = e.node.rowIndex ?? 0
      const to = e.overIndex
      if (to == null || from === to) return
      const updated = [...rowData]
      const [moved] = updated.splice(from, 1)
      const insertAt = from < to ? to - 1 : to
      updated.splice(insertAt, 0, moved as Row)
      setRowData(updated)
    },
    [rowData, setRowData],
  )

  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent) => {
      if (params.colDef.field === 'amount') {
        const val = Number(params.newValue)
        if (Number.isNaN(val)) {
          setErrors((prev) => ({ ...prev, [(params.data as Row).id]: true }))
          params.node.setDataValue('amount', params.oldValue)
          return
        }
        setErrors((prev) => {
          const copy = { ...prev }
          delete copy[(params.data as Row).id]
          return copy
        })
      }
      updateRow(params.data as Row)
    },
    [updateRow],
  )

  const handleAddRow = useCallback(() => {
    addRow()
  }, [addRow])
  return (
    <div className="container">
      <h1>Financial Model</h1>
      <div className="controls">
        <label htmlFor="scenario">Scenario:</label>
        <select
          id="scenario"
          value={scenario}
          onChange={handleScenarioChange}
          className="scenario-select"
        >
          {scenarioOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <label htmlFor="baseCurrency">Base:</label>
        <select
          id="baseCurrency"
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value as Currency)}
          className="scenario-select"
        >
          {currencyOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleAddRow} className="add-button">
          Add Row
        </button>
        <button type="button" onClick={handleExport} className="add-button">
          Export CSV
        </button>
        <button type="button" onClick={handleImportClick} className="add-button">
          Import CSV
        </button>
        <button type="button" onClick={handleSaveSnapshot} className="add-button">
          Save Snapshot
        </button>
        <select onChange={handleLoadSnapshot} className="scenario-select">
          <option value="">Snapshots...</option>
          <optgroup label="Load">
            {snapshots.map((s) => (
              <option key={`load-${s.id}`} value={`load:${s.id}`}>
                {s.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Rename">
            {snapshots.map((s) => (
              <option key={`rename-${s.id}`} value={`rename:${s.id}`}>
                {s.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Delete">
            {snapshots.map((s) => (
              <option key={`delete-${s.id}`} value={`delete:${s.id}`}>
                {s.name}
              </option>
            ))}
          </optgroup>
        </select>
        <button type="button" onClick={handleSync} className="add-button">
          Sync to Cloud
        </button>
      </div>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="ag-theme-alpine grid">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowDragManaged
          animateRows
          getRowId={(p) => (p.data as Row).id}
          pinnedBottomRowData={pinnedBottomRowData}
          onCellValueChanged={onCellValueChanged}
          onRowDragEnd={handleRowDragEnd}
        />
      </div>
      <MetricsChart data={chartData} />
    </div>
  )
}

export default App
