import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Slider } from './ui/slider'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { ChevronDown, Filter, RotateCcw } from 'lucide-react'

export function FilterSidebar() {
  const [dateRange, setDateRange] = useState('12m')
  const [revenueRange, setRevenueRange] = useState([0, 1000000])
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'profit'])
  const [isDateOpen, setIsDateOpen] = useState(true)
  const [isMetricsOpen, setIsMetricsOpen] = useState(true)
  const [isRangeOpen, setIsRangeOpen] = useState(true)

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    )
  }

  const resetFilters = () => {
    setDateRange('12m')
    setRevenueRange([0, 1000000])
    setSelectedMetrics(['revenue', 'profit'])
  }

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-muted-foreground"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card>
        <Collapsible open={isDateOpen} onOpenChange={setIsDateOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer">
              <CardTitle className="flex items-center justify-between text-sm">
                Date Range
                <ChevronDown className={`h-4 w-4 transition-transform ${isDateOpen ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last month</SelectItem>
                  <SelectItem value="3m">Last 3 months</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                  <SelectItem value="24m">Last 24 months</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Metrics Filter */}
      <Card>
        <Collapsible open={isMetricsOpen} onOpenChange={setIsMetricsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer">
              <CardTitle className="flex items-center justify-between text-sm">
                Metrics
                <ChevronDown className={`h-4 w-4 transition-transform ${isMetricsOpen ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {[
                { id: 'revenue', label: 'Revenue' },
                { id: 'profit', label: 'Profit' },
                { id: 'expenses', label: 'Expenses' },
                { id: 'margin', label: 'Margin' },
                { id: 'cashflow', label: 'Cash Flow' },
                { id: 'assets', label: 'Assets' },
                { id: 'liabilities', label: 'Liabilities' }
              ].map(metric => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={metric.id}
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={() => handleMetricToggle(metric.id)}
                  />
                  <Label
                    htmlFor={metric.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {metric.label}
                  </Label>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Revenue Range Filter */}
      <Card>
        <Collapsible open={isRangeOpen} onOpenChange={setIsRangeOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer">
              <CardTitle className="flex items-center justify-between text-sm">
                Revenue Range
                <ChevronDown className={`h-4 w-4 transition-transform ${isRangeOpen ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="px-2">
                <Slider
                  value={revenueRange}
                  onValueChange={setRevenueRange}
                  max={1000000}
                  min={0}
                  step={10000}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${revenueRange[0].toLocaleString()}</span>
                <span>${revenueRange[1].toLocaleString()}</span>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            High Growth
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            Profitable
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            At Risk
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}