import React, { useState } from 'react'
import { DraggableWidget } from '../DraggableWidget'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'
import { Building, CreditCard, TrendingUp, Shield, Plus } from 'lucide-react'
import { Button } from '../ui/button'

const balanceData = [
  { category: 'Current Assets', amount: 125000, color: '#8884d8' },
  { category: 'Fixed Assets', amount: 275000, color: '#82ca9d' },
  { category: 'Current Liabilities', amount: -85000, color: '#ffc658' },
  { category: 'Long-term Debt', amount: -150000, color: '#ff7300' },
  { category: 'Equity', amount: 165000, color: '#0088fe' },
]

const assetBreakdown = [
  { name: 'Cash & Equivalents', value: 72000, color: '#8884d8' },
  { name: 'Accounts Receivable', value: 35000, color: '#82ca9d' },
  { name: 'Inventory', value: 18000, color: '#ffc658' },
  { name: 'Equipment', value: 180000, color: '#ff7300' },
  { name: 'Real Estate', value: 95000, color: '#0088fe' },
]

const liabilityBreakdown = [
  { name: 'Accounts Payable', value: 45000, color: '#8884d8' },
  { name: 'Accrued Expenses', value: 25000, color: '#82ca9d' },
  { name: 'Short-term Debt', value: 15000, color: '#ffc658' },
  { name: 'Long-term Debt', value: 150000, color: '#ff7300' },
]

export function BalanceTab() {
  const [widgets, setWidgets] = useState([
    'balance-overview',
    'asset-breakdown',
    'liability-breakdown',
    'equity-metrics'
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
        <h2 className="text-2xl font-semibold">Balance Sheet</h2>
        <Button onClick={addWidget} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {widgets.includes('balance-overview') && (
          <DraggableWidget
            id="balance-overview"
            title="Balance Overview"
            onRemove={removeWidget}
            className="md:col-span-2"
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={balanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}

        {widgets.includes('equity-metrics') && (
          <DraggableWidget
            id="equity-metrics"
            title="Financial Health"
            onRemove={removeWidget}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <Building className="h-4 w-4" />
                  <span className="text-xs">Strong</span>
                </div>
                <p className="text-2xl font-bold">$400K</p>
                <p className="text-sm text-muted-foreground">Total Assets</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs">Managed</span>
                </div>
                <p className="text-2xl font-bold">$235K</p>
                <p className="text-sm text-muted-foreground">Total Liabilities</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">+8%</span>
                </div>
                <p className="text-2xl font-bold">$165K</p>
                <p className="text-sm text-muted-foreground">Equity</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs">Healthy</span>
                </div>
                <p className="text-2xl font-bold">1.7</p>
                <p className="text-sm text-muted-foreground">Debt-to-Equity</p>
              </div>
            </div>
          </DraggableWidget>
        )}

        {widgets.includes('asset-breakdown') && (
          <DraggableWidget
            id="asset-breakdown"
            title="Asset Breakdown"
            onRemove={removeWidget}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={assetBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}

        {widgets.includes('liability-breakdown') && (
          <DraggableWidget
            id="liability-breakdown"
            title="Liability Breakdown"
            onRemove={removeWidget}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={liabilityBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {liabilityBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}
      </div>
    </div>
  )
}