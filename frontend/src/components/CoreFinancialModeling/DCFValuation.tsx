import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/Tabs';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Label } from '@/design-system/components/Label';
import { Badge } from '@/design-system/components/Badge';
import { Separator } from '@/design-system/components/Separator';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  BarChart3,
  Target,
  Zap,
  Activity,
  PieChart,
  FileText,
  Settings,
} from 'lucide-react';

interface DCFValuationProps {
  onValuationChange?: (valuation: any) => void;
  onExportResults?: (results: any) => void;
}

interface FCFProjection {
  year: number;
  revenue: number;
  operatingMargin: number;
  ebit: number;
  taxes: number;
  depreciation: number;
  workingCapitalChange: number;
  capex: number;
  freeCashFlow: number;
}

interface TerminalValue {
  method: 'perpetuity' | 'exit_multiple' | 'asset_based';
  value: number;
  growthRate: number;
  exitMultiple: number;
}

interface CostOfCapital {
  riskFreeRate: number;
  marketRiskPremium: number;
  beta: number;
  costOfEquity: number;
  costOfDebt: number;
  taxRate: number;
  debtToEquityRatio: number;
  wacc: number;
}

export function DCFValuation({
  onValuationChange,
  onExportResults,
}: DCFValuationProps) {
  const [activeTab, setActiveTab] = useState('fcf-projections');
  const [projectionPeriod, setProjectionPeriod] = useState(5);

  const [fcfProjections, setFcfProjections] = useState<FCFProjection[]>([
    {
      year: 1,
      revenue: 2400000,
      operatingMargin: 0.19,
      ebit: 456000,
      taxes: 114000,
      depreciation: 240000,
      workingCapitalChange: -60000,
      capex: -288000,
      freeCashFlow: 234000,
    },
    {
      year: 2,
      revenue: 2760000,
      operatingMargin: 0.2,
      ebit: 552000,
      taxes: 138000,
      depreciation: 276000,
      workingCapitalChange: -72000,
      capex: -331200,
      freeCashFlow: 287400,
    },
    {
      year: 3,
      revenue: 3174000,
      operatingMargin: 0.21,
      ebit: 666540,
      taxes: 166635,
      depreciation: 317400,
      workingCapitalChange: -79350,
      capex: -380880,
      freeCashFlow: 357675,
    },
    {
      year: 4,
      revenue: 3650100,
      operatingMargin: 0.22,
      ebit: 803022,
      taxes: 200756,
      depreciation: 365010,
      workingCapitalChange: -91253,
      capex: -438012,
      freeCashFlow: 438011,
    },
    {
      year: 5,
      revenue: 4197615,
      operatingMargin: 0.23,
      ebit: 965451,
      taxes: 241363,
      depreciation: 419762,
      workingCapitalChange: -104940,
      capex: -503714,
      freeCashFlow: 538196,
    },
  ]);

  const [terminalValue, setTerminalValue] = useState<TerminalValue>({
    method: 'perpetuity',
    value: 5381960,
    growthRate: 0.025,
    exitMultiple: 15.0,
  });

  const [costOfCapital, setCostOfCapital] = useState<CostOfCapital>({
    riskFreeRate: 0.03,
    marketRiskPremium: 0.06,
    beta: 1.2,
    costOfEquity: 0.102,
    costOfDebt: 0.06,
    taxRate: 0.25,
    debtToEquityRatio: 0.3,
    wacc: 0.0894,
  });

  const [sensitivityAnalysis, setSensitivityAnalysis] = useState({
    revenueGrowthRange: [0.05, 0.1, 0.15, 0.2, 0.25],
    marginRange: [0.15, 0.17, 0.19, 0.21, 0.23],
    waccRange: [0.07, 0.08, 0.09, 0.1, 0.11],
  });

  const calculateFCF = (projection: FCFProjection) => {
    const ebit = projection.revenue * projection.operatingMargin;
    const taxes = ebit * costOfCapital.taxRate;
    const depreciation = projection.revenue * 0.1; // 10% of revenue
    const workingCapitalChange = projection.revenue * 0.025; // 2.5% of revenue
    const capex = projection.revenue * 0.12; // 12% of revenue

    return {
      ...projection,
      ebit,
      taxes,
      depreciation,
      workingCapitalChange: -workingCapitalChange,
      capex: -capex,
      freeCashFlow: ebit - taxes + depreciation - workingCapitalChange - capex,
    };
  };

  const calculateTerminalValue = () => {
    const finalFCF = fcfProjections[fcfProjections.length - 1].freeCashFlow;

    if (terminalValue.method === 'perpetuity') {
      return (
        (finalFCF * (1 + terminalValue.growthRate)) /
        (costOfCapital.wacc - terminalValue.growthRate)
      );
    } else if (terminalValue.method === 'exit_multiple') {
      return finalFCF * terminalValue.exitMultiple;
    }
    return terminalValue.value;
  };

  const calculateWACC = () => {
    const costOfEquity =
      costOfCapital.riskFreeRate +
      costOfCapital.beta * costOfCapital.marketRiskPremium;
    const afterTaxCostOfDebt =
      costOfCapital.costOfDebt * (1 - costOfCapital.taxRate);
    const equityWeight = 1 / (1 + costOfCapital.debtToEquityRatio);
    const debtWeight =
      costOfCapital.debtToEquityRatio / (1 + costOfCapital.debtToEquityRatio);

    return costOfEquity * equityWeight + afterTaxCostOfDebt * debtWeight;
  };

  const calculateEnterpriseValue = () => {
    const pvFCF = fcfProjections.reduce((sum, projection, index) => {
      return (
        sum +
        projection.freeCashFlow / Math.pow(1 + costOfCapital.wacc, index + 1)
      );
    }, 0);

    const terminalValuePV =
      calculateTerminalValue() /
      Math.pow(1 + costOfCapital.wacc, projectionPeriod);

    return pvFCF + terminalValuePV;
  };

  const enterpriseValue = calculateEnterpriseValue();
  const equityValue = enterpriseValue - 500000; // Assuming $500K net debt
  const perShareValue = equityValue / 1000000; // Assuming 1M shares

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">DCF Valuation Model</h2>
          <p className="text-muted-foreground">
            Comprehensive DCF with detailed FCF projections, terminal value, and
            sensitivity analysis
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() =>
              onExportResults?.({ enterpriseValue, equityValue, perShareValue })
            }
          >
            Export Results
          </Button>
          <Button>Recalculate</Button>
        </div>
      </div>

      {/* Valuation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enterprise Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(enterpriseValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              Total enterprise value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equity Value</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(equityValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">After net debt</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Per Share Value
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${perShareValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Per share value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WACC</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(costOfCapital.wacc * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Weighted average cost of capital
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger
            value="fcf-projections"
            className="flex items-center space-x-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>FCF Projections</span>
          </TabsTrigger>
          <TabsTrigger
            value="terminal-value"
            className="flex items-center space-x-2"
          >
            <Target className="h-4 w-4" />
            <span>Terminal Value</span>
          </TabsTrigger>
          <TabsTrigger
            value="cost-of-capital"
            className="flex items-center space-x-2"
          >
            <Calculator className="h-4 w-4" />
            <span>Cost of Capital</span>
          </TabsTrigger>
          <TabsTrigger
            value="sensitivity"
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Sensitivity</span>
          </TabsTrigger>
          <TabsTrigger
            value="comparable"
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>Comparable</span>
          </TabsTrigger>
        </TabsList>

        {/* FCF Projections Tab */}
        <TabsContent value="fcf-projections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Free Cash Flow Projections</CardTitle>
              <CardDescription>
                Detailed 5-year FCF projections with operating cash flow and
                capital expenditure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Year</th>
                      <th className="text-right p-2">Revenue</th>
                      <th className="text-right p-2">Operating Margin</th>
                      <th className="text-right p-2">EBIT</th>
                      <th className="text-right p-2">Taxes</th>
                      <th className="text-right p-2">Depreciation</th>
                      <th className="text-right p-2">WC Change</th>
                      <th className="text-right p-2">CapEx</th>
                      <th className="text-right p-2 font-bold">
                        Free Cash Flow
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fcfProjections.map(projection => (
                      <tr key={projection.year} className="border-b">
                        <td className="p-2 font-medium">{projection.year}</td>
                        <td className="text-right p-2">
                          ${(projection.revenue / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right p-2">
                          {(projection.operatingMargin * 100).toFixed(1)}%
                        </td>
                        <td className="text-right p-2">
                          ${(projection.ebit / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right p-2">
                          ${(projection.taxes / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right p-2">
                          ${(projection.depreciation / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right p-2">
                          ${(projection.workingCapitalChange / 1000).toFixed(0)}
                          K
                        </td>
                        <td className="text-right p-2">
                          ${(projection.capex / 1000).toFixed(0)}K
                        </td>
                        <td className="text-right p-2 font-bold">
                          ${(projection.freeCashFlow / 1000).toFixed(0)}K
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Terminal Value Tab */}
        <TabsContent value="terminal-value" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Terminal Value Analysis</CardTitle>
              <CardDescription>
                Terminal value calculation using perpetuity growth and exit
                multiple methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="terminal-method">
                      Terminal Value Method
                    </Label>
                    <select
                      id="terminal-method"
                      className="w-full p-2 border rounded"
                      value={terminalValue.method}
                      onChange={e =>
                        setTerminalValue({
                          ...terminalValue,
                          method: e.target.value as any,
                        })
                      }
                    >
                      <option value="perpetuity">
                        Perpetuity Growth Method
                      </option>
                      <option value="exit_multiple">
                        Exit Multiple Method
                      </option>
                      <option value="asset_based">Asset-Based Method</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="terminal-growth">
                      Terminal Growth Rate (%)
                    </Label>
                    <Input
                      id="terminal-growth"
                      type="number"
                      value={terminalValue.growthRate * 100}
                      onChange={e =>
                        setTerminalValue({
                          ...terminalValue,
                          growthRate: parseFloat(e.target.value) / 100,
                        })
                      }
                      step={0.1}
                    />
                  </div>

                  <div>
                    <Label htmlFor="exit-multiple">
                      Exit Multiple (EV/EBITDA)
                    </Label>
                    <Input
                      id="exit-multiple"
                      type="number"
                      value={terminalValue.exitMultiple}
                      onChange={e =>
                        setTerminalValue({
                          ...terminalValue,
                          exitMultiple: parseFloat(e.target.value),
                        })
                      }
                      step={0.5}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        Terminal Value Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Perpetuity Method:</span>
                          <span className="font-bold">
                            ${(calculateTerminalValue() / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Exit Multiple Method:</span>
                          <span className="font-bold">
                            $
                            {(
                              (fcfProjections[4].freeCashFlow *
                                terminalValue.exitMultiple) /
                              1000000
                            ).toFixed(1)}
                            M
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Selected Terminal Value:</span>
                          <span>
                            ${(calculateTerminalValue() / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost of Capital Tab */}
        <TabsContent value="cost-of-capital" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost of Capital Breakdown</CardTitle>
              <CardDescription>
                WACC calculation with cost of equity and cost of debt components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Cost of Equity (CAPM)</h3>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="risk-free">Risk-free Rate (%)</Label>
                      <Input
                        id="risk-free"
                        type="number"
                        value={costOfCapital.riskFreeRate * 100}
                        onChange={e =>
                          setCostOfCapital({
                            ...costOfCapital,
                            riskFreeRate: parseFloat(e.target.value) / 100,
                          })
                        }
                        step={0.1}
                      />
                    </div>
                    <div>
                      <Label htmlFor="market-premium">
                        Market Risk Premium (%)
                      </Label>
                      <Input
                        id="market-premium"
                        type="number"
                        value={costOfCapital.marketRiskPremium * 100}
                        onChange={e =>
                          setCostOfCapital({
                            ...costOfCapital,
                            marketRiskPremium: parseFloat(e.target.value) / 100,
                          })
                        }
                        step={0.1}
                      />
                    </div>
                    <div>
                      <Label htmlFor="beta">Beta</Label>
                      <Input
                        id="beta"
                        type="number"
                        value={costOfCapital.beta}
                        onChange={e =>
                          setCostOfCapital({
                            ...costOfCapital,
                            beta: parseFloat(e.target.value),
                          })
                        }
                        step={0.1}
                      />
                    </div>
                  </div>

                  <h3 className="font-semibold">Cost of Debt</h3>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="cost-debt">
                        Pre-tax Cost of Debt (%)
                      </Label>
                      <Input
                        id="cost-debt"
                        type="number"
                        value={costOfCapital.costOfDebt * 100}
                        onChange={e =>
                          setCostOfCapital({
                            ...costOfCapital,
                            costOfDebt: parseFloat(e.target.value) / 100,
                          })
                        }
                        step={0.1}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                      <Input
                        id="tax-rate"
                        type="number"
                        value={costOfCapital.taxRate * 100}
                        onChange={e =>
                          setCostOfCapital({
                            ...costOfCapital,
                            taxRate: parseFloat(e.target.value) / 100,
                          })
                        }
                        step={0.1}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        WACC Calculation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Cost of Equity:</span>
                          <span className="font-bold">
                            {(costOfCapital.costOfEquity * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>After-tax Cost of Debt:</span>
                          <span className="font-bold">
                            {(
                              costOfCapital.costOfDebt *
                              (1 - costOfCapital.taxRate) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Debt/Equity Ratio:</span>
                          <span className="font-bold">
                            {costOfCapital.debtToEquityRatio.toFixed(1)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>WACC:</span>
                          <span>{(costOfCapital.wacc * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sensitivity Analysis Tab */}
        <TabsContent value="sensitivity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensitivity Analysis</CardTitle>
              <CardDescription>
                Impact of key value drivers on equity value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Growth Rate</th>
                      {sensitivityAnalysis.waccRange.map(wacc => (
                        <th key={wacc} className="text-right p-2">
                          {(wacc * 100).toFixed(0)}% WACC
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivityAnalysis.revenueGrowthRange.map(growth => (
                      <tr key={growth} className="border-b">
                        <td className="p-2 font-medium">
                          {(growth * 100).toFixed(0)}%
                        </td>
                        {sensitivityAnalysis.waccRange.map(wacc => {
                          // Simplified sensitivity calculation
                          const sensitivityValue =
                            equityValue *
                            (1 + (growth - 0.15) * 2) *
                            (1 - (wacc - 0.09) * 5);
                          return (
                            <td key={wacc} className="text-right p-2">
                              ${(sensitivityValue / 1000000).toFixed(1)}M
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparable Company Analysis Tab */}
        <TabsContent value="comparable" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparable Company Analysis</CardTitle>
              <CardDescription>
                Trading multiples and implied values from peer companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Trading Multiples</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>P/E Ratio:</span>
                      <span className="font-bold">15.2x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EV/EBITDA:</span>
                      <span className="font-bold">12.8x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>P/B Ratio:</span>
                      <span className="font-bold">2.4x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>P/S Ratio:</span>
                      <span className="font-bold">3.1x</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Implied Values</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>P/E Implied Value:</span>
                      <span className="font-bold">
                        ${((equityValue * 1.1) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>EV/EBITDA Implied Value:</span>
                      <span className="font-bold">
                        ${((enterpriseValue * 0.95) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>P/B Implied Value:</span>
                      <span className="font-bold">
                        ${((equityValue * 0.9) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>P/S Implied Value:</span>
                      <span className="font-bold">
                        ${((equityValue * 1.05) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
