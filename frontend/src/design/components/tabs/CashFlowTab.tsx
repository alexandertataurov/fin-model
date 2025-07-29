import { useState } from 'react'
import { DraggableWidget } from '../DraggableWidget'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts'
import { TrendingUp, TrendingDown, Activity, AlertCircle, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { Alert, AlertDescription } from '../ui/alert'

const cashFlowData = [
  { month: 'Jan', operating: 15000, investing: -5000, financing: 2000, net: 12000 },
  { month: 'Feb', operating: 18000, investing: -3000, financing: 0, net: 15000 },
  { month: 'Mar', operating: 16000, investing: -8000, financing: 5000, net: 13000 },
  { month: 'Apr', operating: 22000, investing: -2000, financing: -1000, net: 19000 },
  { month: 'May', operating: 19000, investing: -4000, financing: 0, net: 15000 },
  { month: 'Jun', operating: 25000, investing: -6000, financing: 3000, net: 22000 },
]

const waterfallData = [
  { name: 'Starting Cash', value: 50000, cumulative: 50000 },
  { name: 'Operating Cash', value: 25000, cumulative: 75000 },
  { name: 'Investing Cash', value: -6000, cumulative: 69000 },
  { name: 'Financing Cash', value: 3000, cumulative: 72000 },
  { name: 'Ending Cash', value: 0, cumulative: 72000 },
]

export function CashFlowTab() {
  const [widgets, setWidgets] = useState([
    'cash-flow-trend',
    'waterfall-chart',
    'cash-metrics',
    'cash-alerts'
  ])

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(id => id !== widgetId))
  }

  const addWidget = () => {
    const newWidget = `widget-${Date.now()}`
    setWidgets(prev => [...prev, newWidget])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Cash Flow</h2>
        <Button onClick={addWidget} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {widgets.includes('cash-metrics') && (
          <DraggableWidget
            id="cash-metrics"
            title="Cash Metrics"
            onRemove={removeWidget}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">+15%</span>
                </div>
                <p className="text-2xl font-bold">$72K</p>
                <p className="text-sm text-muted-foreground">Current Cash</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs">Stable</span>
                </div>
                <p className="text-2xl font-bold">$25K</p>
                <p className="text-sm text-muted-foreground">Operating CF</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-xs">-20%</span>
                </div>
                <p className="text-2xl font-bold">-$6K</p>
                <p className="text-sm text-muted-foreground">Investing CF</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">+50%</span>
                </div>
                <p className="text-2xl font-bold">$3K</p>
                <p className="text-sm text-muted-foreground">Financing CF</p>
              </div>
            </div>
          </DraggableWidget>
        )}

        {widgets.includes('cash-flow-trend') && (
          <DraggableWidget
            id="cash-flow-trend"
            title="Cash Flow Trend"
            onRemove={removeWidget}
            className="md:col-span-2"
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* DESIGN_FIX: replace hex colors with design tokens */}
                <Line type="monotone" dataKey="operating" stroke="var(--chart-1)" strokeWidth={2} />
                <Line type="monotone" dataKey="investing" stroke="var(--chart-2)" strokeWidth={2} />
                <Line type="monotone" dataKey="financing" stroke="var(--chart-3)" strokeWidth={2} />
                <Line type="monotone" dataKey="net" stroke="var(--chart-4)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}

        {widgets.includes('waterfall-chart') && (
          <DraggableWidget
            id="waterfall-chart"
            title="Cash Flow Waterfall"
            onRemove={removeWidget}
            className="md:col-span-2"
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={waterfallData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {/* DESIGN_FIX: use chart color token */}
                <Bar dataKey="cumulative" fill="var(--chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}

        {widgets.includes('cash-alerts') && (
          <DraggableWidget
            id="cash-alerts"
            title="Cash Flow Alerts"
            onRemove={removeWidget}
          >
            <div className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Cash runway: 8 months at current burn rate
                </AlertDescription>
              </Alert>
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  Operating cash flow increased 15% this month
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <TrendingDown className="h-4 w-4" />
                <AlertDescription>
                  High investment spending this quarter
                </AlertDescription>
              </Alert>
            </div>
          </DraggableWidget>
        )}
      </div>
    </div>
  )
}