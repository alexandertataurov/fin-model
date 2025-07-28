import { useState } from 'react'
import { DraggableWidget } from '../DraggableWidget'
import { Button } from '../ui/button'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { TrendingUp, TrendingDown, Percent, Plus } from 'lucide-react'

const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
  { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
  { month: 'Jun', revenue: 67000, expenses: 42000, profit: 25000 },
]

const expenseData = [
  { name: 'Salaries', value: 45000, color: '#8884d8' },
  { name: 'Marketing', value: 15000, color: '#82ca9d' },
  { name: 'Operations', value: 12000, color: '#ffc658' },
  { name: 'Technology', value: 8000, color: '#ff7300' },
  { name: 'Other', value: 5000, color: '#0088fe' },
]

export function PLTab() {
  const [widgets, setWidgets] = useState([
    'revenue-trend',
    'expense-breakdown',
    'profit-margin',
    'kpis'
  ])

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(id => id !== widgetId))
  }

  const addWidget = () => {
    // In a real app, this would show a dialog to select widget type
    const newWidget = `widget-${Date.now()}`
    setWidgets(prev => [...prev, newWidget])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Profit & Loss</h2>
        <Button onClick={addWidget} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {widgets.includes('kpis') && (
          <DraggableWidget
            id="kpis"
            title="Key Metrics"
            onRemove={removeWidget}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">+12%</span>
                </div>
                <p className="text-2xl font-bold">$67K</p>
                <p className="text-sm text-muted-foreground">Revenue</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-xs">-3%</span>
                </div>
                <p className="text-2xl font-bold">$42K</p>
                <p className="text-sm text-muted-foreground">Expenses</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">+25%</span>
                </div>
                <p className="text-2xl font-bold">$25K</p>
                <p className="text-sm text-muted-foreground">Profit</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <Percent className="h-4 w-4" />
                  <span className="text-xs">+2%</span>
                </div>
                <p className="text-2xl font-bold">37%</p>
                <p className="text-sm text-muted-foreground">Margin</p>
              </div>
            </div>
          </DraggableWidget>
        )}

        {widgets.includes('revenue-trend') && (
          <DraggableWidget
            id="revenue-trend"
            title="Revenue Trend"
            onRemove={removeWidget}
            className="md:col-span-2"
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}

        {widgets.includes('expense-breakdown') && (
          <DraggableWidget
            id="expense-breakdown"
            title="Expense Breakdown"
            onRemove={removeWidget}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}

        {widgets.includes('profit-margin') && (
          <DraggableWidget
            id="profit-margin"
            title="Profit Margin"
            onRemove={removeWidget}
            className="md:col-span-2"
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
                <Bar dataKey="expenses" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}
      </div>
    </div>
  )
}