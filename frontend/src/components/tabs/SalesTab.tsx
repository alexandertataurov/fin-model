import React, { useState } from 'react';
import { DraggableWidget } from '../draggable-widget';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Users, Target, ShoppingCart, Plus } from 'lucide-react';
import { Button } from '@/design-system/atoms';
import { Progress } from '@/design-system/atoms';

const salesData = [
  { month: 'Jan', sales: 45000, leads: 320, conversion: 14.1 },
  { month: 'Feb', sales: 52000, leads: 380, conversion: 13.7 },
  { month: 'Mar', sales: 48000, leads: 350, conversion: 13.7 },
  { month: 'Apr', sales: 61000, leads: 420, conversion: 14.5 },
  { month: 'May', sales: 55000, leads: 390, conversion: 14.1 },
  { month: 'Jun', sales: 67000, leads: 450, conversion: 14.9 },
];

// DESIGN_FIX: replace hex colors with design system tokens
const salesByChannel = [
  { name: 'Direct Sales', value: 180000, color: 'var(--chart-1)' },
  { name: 'Online', value: 120000, color: 'var(--chart-2)' },
  { name: 'Partners', value: 80000, color: 'var(--chart-3)' },
  { name: 'Referrals', value: 48000, color: 'var(--chart-4)' },
];

const salesTargets = [
  { rep: 'John Smith', target: 100000, actual: 95000, percentage: 95 },
  { rep: 'Sarah Johnson', target: 85000, actual: 92000, percentage: 108 },
  { rep: 'Mike Chen', target: 90000, actual: 78000, percentage: 87 },
  { rep: 'Lisa Brown', target: 75000, actual: 81000, percentage: 108 },
];

export function SalesTab() {
  const [widgets, setWidgets] = useState([
    'sales-metrics',
    'sales-trend',
    'sales-channels',
    'sales-targets',
  ]);

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(id => id !== widgetId));
  };

  const addWidget = () => {
    const newWidget = `widget-${Date.now()}`;
    setWidgets(prev => [...prev, newWidget]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Sales Performance</h2>
        <Button onClick={addWidget} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {widgets.includes('sales-metrics') && (
          <DraggableWidget
            id="sales-metrics"
            title="Sales Metrics"
            onRemove={removeWidget}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">+18%</span>
                </div>
                <p className="text-2xl font-bold">$67K</p>
                <p className="text-sm text-muted-foreground">Monthly Sales</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">+12%</span>
                </div>
                <p className="text-2xl font-bold">450</p>
                <p className="text-sm text-muted-foreground">Leads</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <Target className="h-4 w-4" />
                  <span className="text-xs">+0.8%</span>
                </div>
                <p className="text-2xl font-bold">14.9%</p>
                <p className="text-sm text-muted-foreground">Conversion</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-xs">+15%</span>
                </div>
                <p className="text-2xl font-bold">$1,489</p>
                <p className="text-sm text-muted-foreground">Avg Deal Size</p>
              </div>
            </div>
          </DraggableWidget>
        )}

        {widgets.includes('sales-trend') && (
          <DraggableWidget
            id="sales-trend"
            title="Sales Trend"
            onRemove={removeWidget}
            className="md:col-span-2"
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* DESIGN_FIX: use chart color tokens */}
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}

        {widgets.includes('sales-channels') && (
          <DraggableWidget
            id="sales-channels"
            title="Sales by Channel"
            onRemove={removeWidget}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={salesByChannel}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {salesByChannel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </DraggableWidget>
        )}

        {widgets.includes('sales-targets') && (
          <DraggableWidget
            id="sales-targets"
            title="Sales Rep Performance"
            onRemove={removeWidget}
            className="md:col-span-2"
          >
            <div className="space-y-4">
              {salesTargets.map((rep, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{rep.rep}</span>
                    <span className="text-sm text-muted-foreground">
                      ${rep.actual.toLocaleString()} / $
                      {rep.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={rep.percentage} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs ${rep.percentage >= 100 ? 'text-green-600' : 'text-muted-foreground'}`}
                    >
                      {rep.percentage}% of target
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {rep.percentage >= 100 ? 'Exceeded' : 'In Progress'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DraggableWidget>
        )}
      </div>
    </div>
  );
}
