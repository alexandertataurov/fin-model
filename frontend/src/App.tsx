import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MetricsChart from './Chart'
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
  currency: string
}

const baseCurrency = 'USD'
const currencyOptions = ['USD', 'EUR', 'GBP'] as const

function App() {
  const createRow = useCallback(
    (account: string, amount: number, currency = 'USD'): Row => ({
      id: crypto.randomUUID(),
      account,
      amount,
      currency,
    }),
    [],
  )

  const [rowData, setRowData] = useState<Row[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scenarioOptions = ['Base', 'Optimistic', 'Pessimistic'] as const
  type Scenario = (typeof scenarioOptions)[number]
  const scenarioMultipliers: Record<Scenario, number> = {
    Base: 1,
    Optimistic: 1.1,
    Pessimistic: 0.9,
  }
  const [scenario, setScenario] = useState<Scenario>('Base')

  const [fxRates, setFxRates] = useState<Record<string, number>>({
    [baseCurrency]: 1,
  })

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(
          `https://api.exchangerate.host/latest?base=${baseCurrency}`,
        )
        const data = await res.json()
        setFxRates({ [baseCurrency]: 1, ...data.rates })
      } catch {
        setFxRates({ USD: 1, EUR: 0.92, GBP: 0.8 })
      }
    }
    fetchRates()
  }, [])


  useEffect(() => {
    const stored = localStorage.getItem('rows')
    if (stored) {
      try {
        const parsed = (JSON.parse(stored) as unknown[]).map((r) => {
          const row = r as Partial<Row>
          return {
            id: row.id ?? crypto.randomUUID(),
            account: row.account ?? '',
            amount: row.amount ?? 0,
            currency: row.currency ?? baseCurrency,
          }
        })
        setRowData(parsed)
      } catch {
        setRowData([
          createRow('Revenue', 1000, baseCurrency),
          createRow('Cost of Goods Sold', -300, baseCurrency),
          createRow('Operating Expenses', -200, baseCurrency),
        ])
      }
    } else {
      setRowData([
        createRow('Revenue', 1000, baseCurrency),
        createRow('Cost of Goods Sold', -300, baseCurrency),
        createRow('Operating Expenses', -200, baseCurrency),
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

  const handleScenarioChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setScenario(e.target.value as Scenario)
    },
    [],
  )
  const handleExport = useCallback(() => {
    const lines = [
      ['account', 'amount', 'currency'],
      ...rowData.map((r) => [r.account, r.amount, r.currency]),
    ]
    const csv = lines.map((line) => line.join(',')).join('\n')
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
        const text = (reader.result as string).trim()
        const lines = text.split('\n').slice(1)
        const rows = lines.map((line) => {
          const [account = '', amountStr = '0', currency = baseCurrency] =
            line.split(',')
          return createRow(account, Number(amountStr), currency)
        })
        setRowData(rows)
      }
      reader.readAsText(file)
      e.target.value = ''
    },
    [createRow],
  )

  const columnDefs = useMemo<ColDef[]>(
    () => [
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

  const multiplier = scenarioMultipliers[scenario]

  const convertedAmounts = useMemo(
    () => rowData.map((row) => row.amount * (fxRates[row.currency] ?? 1)),
    [rowData, fxRates],
  )

  const scaledAmounts = useMemo(
    () => convertedAmounts.map((val) => val * multiplier),
    [convertedAmounts, multiplier],
  )

  const total = useMemo(
    () => scaledAmounts.reduce((sum, amount) => sum + amount, 0),
    [scaledAmounts],
  )


  const average = useMemo(
    () => (rowData.length ? total / rowData.length : 0),
    [rowData.length, total],
  )

  const max = useMemo(
    () => (rowData.length ? Math.max(...scaledAmounts) : 0),
    [rowData.length, scaledAmounts],
  )

  const min = useMemo(
    () => (rowData.length ? Math.min(...scaledAmounts) : 0),
    [rowData.length, scaledAmounts],
  )

  const income = useMemo(
    () => scaledAmounts.filter((v) => v > 0).reduce((sum, v) => sum + v, 0),
    [scaledAmounts],
  )

  const expenses = useMemo(
    () => scaledAmounts.filter((v) => v < 0).reduce((sum, v) => sum + v, 0),
    [scaledAmounts],
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

  const chartData = useMemo(
    () => [
      { label: 'Revenue', value: income },
      { label: 'Profit', value: grossMargin },
      { label: 'Cash Flow', value: cashFlow },
    ],
    [income, grossMargin, cashFlow],
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
    setRowData([...rowData, createRow('', 0, baseCurrency)])
  }, [rowData, createRow])

  return (
    <div className="container">
      <h1>Financial Model</h1>
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
      <button type="button" onClick={handleAddRow} className="add-button">
        Add Row
      </button>
      <button type="button" onClick={handleExport} className="add-button">
        Export CSV
      </button>
      <button type="button" onClick={handleImportClick} className="add-button">
        Import CSV
      </button>
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
          pinnedBottomRowData={pinnedBottomRowData}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
      <MetricsChart data={chartData} />
    </div>
  )
}

export default App
