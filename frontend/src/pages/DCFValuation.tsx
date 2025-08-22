import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/design-system/molecules';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/design-system/molecules';
import { Button } from '@/design-system/atoms';
import { Input } from '@/design-system/atoms';
import { Label } from '@/design-system/atoms';
import { Badge } from '@/design-system/atoms';
import {
  Target,
  TrendingUp,
  Calculator,
  BarChart3,
  DollarSign,
  Save,
  Play,
} from 'lucide-react';

const DCFValuation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fcf-projection');

  const dcfSections = [
    {
      id: 'fcf-projection',
      label: 'FCF Projection',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Free Cash Flow projections for 5-10 years',
    },
    {
      id: 'terminal-value',
      label: 'Terminal Value',
      icon: <Target className="h-4 w-4" />,
      description: 'Terminal value calculation methods',
    },
    {
      id: 'cost-of-capital',
      label: 'Cost of Capital',
      icon: <Calculator className="h-4 w-4" />,
      description: 'WACC calculation and components',
    },
    {
      id: 'sensitivity',
      label: 'Sensitivity Analysis',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Key value drivers and scenario analysis',
    },
    {
      id: 'comparable',
      label: 'Comparable Analysis',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Trading multiples and peer comparison',
    },
    {
      id: 'results',
      label: 'Valuation Results',
      icon: <Target className="h-4 w-4" />,
      description: 'Final valuation and per-share metrics',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DCF Valuation</h1>
          <p className="text-muted-foreground">
            Comprehensive Discounted Cash Flow valuation with detailed analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Model
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            Run Valuation
          </Button>
        </div>
      </div>

      {/* DCF Sections */}
      <Card>
        <CardHeader>
          <CardTitle>DCF Model Components</CardTitle>
          <CardDescription>
            Configure all aspects of the DCF valuation model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {dcfSections.map(section => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="flex items-center gap-2"
                >
                  {section.icon}
                  <span className="hidden lg:inline">{section.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {dcfSections.map(section => (
              <TabsContent key={section.id} value={section.id} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    {section.icon}
                    <h3 className="text-lg font-semibold">{section.label}</h3>
                    <Badge variant="secondary">{section.description}</Badge>
                  </div>

                  {/* Section-specific content */}
                  {section.id === 'fcf-projection' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Projection Period (Years)</Label>
                        <Input placeholder="5" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Revenue Growth Rate (%)</Label>
                        <Input placeholder="10.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Operating Margin (%)</Label>
                        <Input placeholder="15.0" type="number" step="0.1" />
                      </div>
                    </div>
                  )}

                  {section.id === 'terminal-value' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Terminal Growth Rate (%)</Label>
                        <Input placeholder="3.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Exit Multiple (EV/EBITDA)</Label>
                        <Input placeholder="12.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Terminal Method</Label>
                        <select className="w-full p-2 border rounded">
                          <option>Perpetuity Growth</option>
                          <option>Exit Multiple</option>
                          <option>Asset-Based</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {section.id === 'cost-of-capital' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Risk-Free Rate (%)</Label>
                        <Input placeholder="2.5" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Market Risk Premium (%)</Label>
                        <Input placeholder="6.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Beta</Label>
                        <Input placeholder="1.2" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Cost of Debt (%)</Label>
                        <Input placeholder="5.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Tax Rate (%)</Label>
                        <Input placeholder="25.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Target D/E Ratio</Label>
                        <Input placeholder="0.3" type="number" step="0.1" />
                      </div>
                    </div>
                  )}

                  {section.id === 'sensitivity' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Revenue Growth Range (%)</Label>
                        <Input placeholder="5-15" />
                      </div>
                      <div className="space-y-2">
                        <Label>Margin Range (%)</Label>
                        <Input placeholder="10-20" />
                      </div>
                      <div className="space-y-2">
                        <Label>WACC Range (%)</Label>
                        <Input placeholder="8-12" />
                      </div>
                    </div>
                  )}

                  {section.id === 'comparable' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>P/E Multiple</Label>
                        <Input placeholder="15.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>EV/EBITDA Multiple</Label>
                        <Input placeholder="12.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>P/B Multiple</Label>
                        <Input placeholder="2.5" type="number" step="0.1" />
                      </div>
                    </div>
                  )}

                  {section.id === 'results' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Enterprise Value
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">$1,250M</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Equity Value
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">$1,180M</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Per Share Value
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">$45.20</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">WACC</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">9.8%</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Changes will update the DCF model in real-time
                    </p>
                    <Button variant="outline" size="sm">
                      Update Model
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DCFValuation;
