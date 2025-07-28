import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Slider } from '../ui/slider'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Play, Pause, RotateCcw, Save } from 'lucide-react'

interface Parameters {
  growthRate: number
  marketingSpend: number
  operatingMargin: number
  taxRate: number
  discountRate: number
  inflationRate: number
}

export function ParametersTab() {
  const [parameters, setParameters] = useState<Parameters>({
    growthRate: 15,
    marketingSpend: 20,
    operatingMargin: 25,
    taxRate: 21,
    discountRate: 10,
    inflationRate: 3
  })

  const [isLivePreview, setIsLivePreview] = useState(true)
  const [scenarioData, setScenarioData] = useState<any[]>([])

  // Generate scenario data based on parameters
  useEffect(() => {
    const generateScenarioData = () => {
      const baseRevenue = 100000
      const data = []
      
      for (let i = 0; i < 12; i++) {
        const month = i + 1
        const revenue = baseRevenue * Math.pow(1 + parameters.growthRate / 100, month / 12)
        const marketingCost = revenue * (parameters.marketingSpend / 100)
        const operatingProfit = revenue * (parameters.operatingMargin / 100)
        const taxes = operatingProfit * (parameters.taxRate / 100)
        const netProfit = operatingProfit - taxes
        
        data.push({
          month: `Month ${month}`,
          revenue: Math.round(revenue),
          marketingCost: Math.round(marketingCost),
          operatingProfit: Math.round(operatingProfit),
          netProfit: Math.round(netProfit)
        })
      }
      
      return data
    }

    if (isLivePreview) {
      setScenarioData(generateScenarioData())
    }
  }, [parameters, isLivePreview])

  const handleParameterChange = (key: keyof Parameters, value: number[]) => {
    setParameters(prev => ({
      ...prev,
      [key]: value[0]
    }))
  }

  const resetParameters = () => {
    setParameters({
      growthRate: 15,
      marketingSpend: 20,
      operatingMargin: 25,
      taxRate: 21,
      discountRate: 10,
      inflationRate: 3
    })
  }

  const saveScenario = () => {
    // In a real app, this would save to backend
    console.log('Saving scenario:', parameters)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Parameters & Scenarios</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={isLivePreview ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLivePreview(!isLivePreview)}
          >
            {isLivePreview ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            Live Preview
          </Button>
          <Button variant="outline" size="sm" onClick={resetParameters}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" onClick={saveScenario}>
            <Save className="h-4 w-4 mr-2" />
            Save Scenario
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parameter Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Model Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="growth" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="growth">Growth</TabsTrigger>
                <TabsTrigger value="costs">Costs</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
              </TabsList>
              
              <TabsContent value="growth" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="growthRate">Growth Rate (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="growthRate"
                      min={0}
                      max={50}
                      step={1}
                      value={[parameters.growthRate]}
                      onValueChange={(value) => handleParameterChange('growthRate', value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={parameters.growthRate}
                      onChange={(e) => handleParameterChange('growthRate', [Number(e.target.value)])}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marketingSpend">Marketing Spend (% of Revenue)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="marketingSpend"
                      min={0}
                      max={50}
                      step={1}
                      value={[parameters.marketingSpend]}
                      onValueChange={(value) => handleParameterChange('marketingSpend', value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={parameters.marketingSpend}
                      onChange={(e) => handleParameterChange('marketingSpend', [Number(e.target.value)])}
                      className="w-20"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="costs" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="operatingMargin">Operating Margin (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="operatingMargin"
                      min={0}
                      max={50}
                      step={1}
                      value={[parameters.operatingMargin]}
                      onValueChange={(value) => handleParameterChange('operatingMargin', value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={parameters.operatingMargin}
                      onChange={(e) => handleParameterChange('operatingMargin', [Number(e.target.value)])}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="inflationRate"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[parameters.inflationRate]}
                      onValueChange={(value) => handleParameterChange('inflationRate', value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={parameters.inflationRate}
                      onChange={(e) => handleParameterChange('inflationRate', [Number(e.target.value)])}
                      className="w-20"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="taxRate"
                      min={0}
                      max={50}
                      step={1}
                      value={[parameters.taxRate]}
                      onValueChange={(value) => handleParameterChange('taxRate', value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={parameters.taxRate}
                      onChange={(e) => handleParameterChange('taxRate', [Number(e.target.value)])}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountRate">Discount Rate (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="discountRate"
                      min={0}
                      max={20}
                      step={0.5}
                      value={[parameters.discountRate]}
                      onValueChange={(value) => handleParameterChange('discountRate', value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={parameters.discountRate}
                      onChange={(e) => handleParameterChange('discountRate', [Number(e.target.value)])}
                      className="w-20"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Scenario Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Year 1 Revenue</p>
                  <p className="text-xl font-bold">
                    ${scenarioData[11]?.revenue.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Year 1 Net Profit</p>
                  <p className="text-xl font-bold">
                    ${scenarioData[11]?.netProfit.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scenarioData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="netProfit" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}