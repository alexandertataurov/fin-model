import { useCallback, useRef, useState } from 'react'

import TopBar from './components/Layout/TopBar'
import ModelControls from './components/ModelControls'
import ModelTable from './components/ModelTable'
import Card from './components/ui/Card'
import useFinancialRows from './hooks/useFinancialRows'
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts"
import useTheme from "./hooks/useTheme"
import useSnapshots from './hooks/useSnapshots'
import useFxRates from './hooks/useFxRates'
import useMetrics from './hooks/useMetrics'
import type { Currency, Scenario } from './types'
import { scenarioOptions } from './types'
import { formatCurrency } from './utils/format'
import { parseCsv, rowsToCsv } from './utils/csv'

const scenarioMultipliers: Record<Scenario, number> = {
  Base: 1,
  Optimistic: 1.1,
  Pessimistic: 0.9,
}

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

  const [scenario, setScenario] = useState<Scenario>('Base')
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const { theme, toggle } = useTheme();

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

  const fmt = useCallback(formatCurrency, [])

  const multiplier = scenarioMultipliers[scenario]
  const { pinnedBottomRowData } = useMetrics(
    rowData,
    fxRates,
    multiplier,
  )

  const handleAccountChange = useCallback(
    (id: string, account: string) => {
      const row = rowData.find((r) => r.id === id)
      if (row) updateRow({ ...row, account })
    },
    [rowData, updateRow],
  )

  const handleCurrencyChange = useCallback(
    (id: string, currency: Currency) => {
      const row = rowData.find((r) => r.id === id)
      if (row) updateRow({ ...row, currency })
    },
    [rowData, updateRow],
  )

  const handleAmountChange = useCallback(
    (id: string, value: string) => {
      const num = Number(value)
      if (Number.isNaN(num)) {
        setErrors((prev) => ({ ...prev, [id]: true }))
        return
      }
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
      const row = rowData.find((r) => r.id === id)
      if (row) updateRow({ ...row, amount: num })
    },
    [rowData, updateRow],
  )


  const handleAddRow = useCallback(() => {
    addRow()
  }, [addRow])

   useKeyboardShortcuts({ addRow, saveSnapshot: handleSaveSnapshot, exportCsv: handleExport, toggleTheme: toggle });
  return (
    <div className="min-h-screen w-full box-border border-2 border-[var(--border-color)] bg-[var(--bg-color)] p-4 md:p-8">
      <TopBar
        theme={theme}
        onToggleTheme={() => toggle()}
      />
      <h1 className="mb-4 border-b-2 pb-1 text-xl font-semibold uppercase tracking-wider">Financial Model</h1>
      <ModelControls
        baseCurrency={baseCurrency}
        scenario={scenario}
        scenarioOptions={scenarioOptions}
        snapshots={snapshots}
        theme={theme}
        onChangeBaseCurrency={setBaseCurrency}
        onChangeScenario={handleScenarioChange}
        onAddRow={handleAddRow}
        onExport={handleExport}
        onImport={handleImportClick}
        onSaveSnapshot={handleSaveSnapshot}
        onLoadSnapshot={handleLoadSnapshot}
        onSync={handleSync}
        onToggleTheme={() => toggle()}
      />
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Card className="mt-4">
        <ModelTable
          rows={rowData}
          errors={errors}
          baseCurrency={baseCurrency}
          fxRates={fxRates}
          pinnedBottomRowData={pinnedBottomRowData}
          onAccountChange={handleAccountChange}
          onCurrencyChange={handleCurrencyChange}
          onAmountChange={handleAmountChange}
          onDeleteRow={handleDeleteRow}
          fmt={fmt}
        />
      </Card>
    </div>
  )
}

export default App
