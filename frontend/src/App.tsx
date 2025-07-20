import { useCallback, useEffect, useRef, useState } from 'react'

import TopBar from './components/Layout/TopBar'
import ModelControls from './components/ModelControls'
import ModelTable from './components/ModelTable'
import useFinancialRows from './hooks/useFinancialRows'
import useSnapshots from './hooks/useSnapshots'
import useFxRates from './hooks/useFxRates'
import useMetrics from './hooks/useMetrics'
import type { Currency } from './types'
import { formatCurrency } from './utils/format'
import { parseCsv, rowsToCsv } from './utils/csv'
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
  )

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])


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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey) return
      const key = e.key.toLowerCase()
      if (key === 'n') {
        e.preventDefault()
        addRow()
      } else if (key === 's') {
        e.preventDefault()
        handleSaveSnapshot()
      } else if (key === 'e') {
        e.preventDefault()
        handleExport()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [addRow, handleSaveSnapshot, handleExport])
  return (
    <div className="container">
      <TopBar
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
      <h1>Financial Model</h1>
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
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
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
    </div>
  )
}

export default App
