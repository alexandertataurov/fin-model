import { useCallback, useEffect, useRef, useState } from 'react'

import MetricsChart from './Chart'
import ProfitLoss from './ProfitLoss'
import Dashboard from './Dashboard'
import Forecast from './Forecast'
import Report from './Report'
import PageContainer from './components/Layout/PageContainer'
import TopBar from './components/Layout/TopBar'
import Sidebar from './components/Layout/Sidebar'
import useFinancialRows from './hooks/useFinancialRows'
import useSnapshots from './hooks/useSnapshots'
import useFxRates from './hooks/useFxRates'
import useMetrics from './hooks/useMetrics'
import { currencyOptions } from './types'
import type { Currency } from './types'
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
  const [view, setView] =
    useState<'model' | 'dashboard' | 'forecast' | 'report'>('model')

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

  const fmt = useCallback(
    (value: number, currency: Currency) =>
      Number(value).toLocaleString(undefined, {
        style: 'currency',
        currency,
      }),
    [],
  )

  const multiplier = scenarioMultipliers[scenario]
  const { pinnedBottomRowData, chartData } = useMetrics(
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
    <div className="layout">
      <TopBar
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {view === 'report' && (
          <button type="button" onClick={() => window.print()} className="btn">
            Print
          </button>
        )}
      </TopBar>
      <div className="content">
        <Sidebar active={view} onSelect={(v) => setView(v)} />
        <PageContainer>
          {view === 'dashboard' ? (
            <Dashboard
              rows={rowData}
              fxRates={fxRates}
              baseCurrency={baseCurrency}
            />
          ) : view === 'forecast' ? (
            <Forecast
              rows={rowData}
              fxRates={fxRates}
              baseCurrency={baseCurrency}
            />
          ) : view === 'report' ? (
            <Report
              rows={rowData}
              fxRates={fxRates}
              baseCurrency={baseCurrency}
            />
          ) : (
            <div className="container">
              <h1>Financial Model</h1>
      <div className="controls">
        <label htmlFor="scenario">
          Scenario{' '}
          <span
            className="help"
            title="Select a scenario multiplier for projections"
          >
            ?
          </span>
        </label>
        <select
          id="scenario"
          value={scenario}
          onChange={handleScenarioChange}
          className="field scenario-select"
        >
          {scenarioOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <label htmlFor="baseCurrency">
          Base{' '}
          <span
            className="help"
            title="Choose the currency for aggregated amounts"
          >
            ?
          </span>
        </label>
        <select
          id="baseCurrency"
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value as Currency)}
          className="field scenario-select"
        >
          {currencyOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleAddRow} className="btn add-button">
          Add Row
        </button>
        <button type="button" onClick={handleExport} className="btn add-button">
          Export CSV
        </button>
        <button type="button" onClick={handleImportClick} className="btn add-button">
          Import CSV
        </button>
        <button type="button" onClick={handleSaveSnapshot} className="btn add-button">
          Save Snapshot
        </button>
        <select onChange={handleLoadSnapshot} className="field scenario-select">
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
        <button type="button" onClick={handleSync} className="btn add-button">
          Sync to Cloud
        </button>
        <button
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="btn add-button"
        >
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <table className="model-table">
        <thead>
          <tr>
            <th>Account</th>
            <th>Currency</th>
            <th className="val">Amount</th>
            <th className="val">Amount ({baseCurrency})</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rowData.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  className="field"
                  value={row.account}
                  onChange={(e) => handleAccountChange(row.id, e.target.value)}
                />
              </td>
              <td>
                <select
                  className="field"
                  value={row.currency}
                  onChange={(e) =>
                    handleCurrencyChange(row.id, e.target.value as Currency)
                  }
                >
                  {currencyOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  className={`field ${errors[row.id] ? 'input-error' : ''}`}
                  value={row.amount}
                  onChange={(e) => handleAmountChange(row.id, e.target.value)}
                />
              </td>
              <td className="val">
                {fmt(row.amount / (fxRates[row.currency] ?? 1), baseCurrency)}
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => handleDeleteRow(row.id)}
                  className="btn delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {pinnedBottomRowData.map((r) => (
            <tr key={r.account} className="total">
              <td colSpan={3}>{r.account}</td>
              <td className="val">
                {fmt(r.amount, baseCurrency)}
              </td>
              <td />
            </tr>
          ))}
        </tfoot>
      </table>
      <ProfitLoss
        rows={rowData}
        fxRates={fxRates}
        baseCurrency={baseCurrency}
      />
      <MetricsChart data={chartData} />
            </div>
          )}
        </PageContainer>
      </div>
    </div>
  )
}

export default App
