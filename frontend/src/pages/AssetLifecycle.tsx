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
  Building,
  TrendingUp,
  Calculator,
  BarChart3,
  DollarSign,
  Calendar,
  Save,
  Play,
} from 'lucide-react';
import { Download } from 'lucide-react';
import DashboardApiService, { PeriodFilter } from '@/services/dashboardApi';
import { toast } from 'sonner';

const AssetLifecycle: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fixed-assets');
  const [isExporting, setIsExporting] = useState(false);

  const assetSections = [
    {
      id: 'fixed-assets',
      label: 'Fixed Assets',
      icon: <Building className="h-4 w-4" />,
      description: 'Property, plant & equipment lifecycle',
    },
    {
      id: 'intangible-assets',
      label: 'Intangible Assets',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Patents, trademarks, software, goodwill',
    },
    {
      id: 'working-capital',
      label: 'Working Capital Assets',
      icon: <Calculator className="h-4 w-4" />,
      description: 'Inventory, receivables, cash lifecycle',
    },
    {
      id: 'depreciation',
      label: 'Depreciation & Amortization',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Depreciation schedules and methods',
    },
    {
      id: 'replacement',
      label: 'Replacement Planning',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Asset replacement schedules and costs',
    },
    {
      id: 'metrics',
      label: 'Asset Metrics',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Performance metrics and ratios',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Lifecycle</h1>
          <p className="text-muted-foreground">
            Comprehensive asset lifecycle modeling and management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Model
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            Run Analysis
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isExporting}
            onClick={async () => {
              setIsExporting(true);
              try {
                const data = await DashboardApiService.exportDashboardData({
                  format: 'json',
                  period: PeriodFilter.YTD,
                });
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dashboard_export_${new Date()
                  .toISOString()
                  .slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success('Report (JSON) downloaded');
              } catch (_e) {
                toast.error('Export failed');
              } finally {
                setIsExporting(false);
              }
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isExporting}
            onClick={async () => {
              setIsExporting(true);
              try {
                const data = await DashboardApiService.exportDashboardData({
                  format: 'json',
                  period: PeriodFilter.YTD,
                });
                const keyMetrics: any = (data as any).key_metrics || {};
                const headers = [
                  'metric',
                  'current',
                  'previous',
                  'change_percent',
                  'trend',
                  'unit',
                  'benchmark',
                ];
                const rows: string[] = [headers.join(',')];
                Object.entries(keyMetrics).forEach(
                  ([metric, value]: [string, any]) => {
                    const row = [
                      metric,
                      value?.current ?? '',
                      value?.previous ?? '',
                      value?.change_percent ?? '',
                      value?.trend ?? '',
                      value?.unit ?? '',
                      value?.benchmark ?? '',
                    ].map(v => String(v).toString().replace(/,/g, ''));
                    rows.push(row.join(','));
                  }
                );
                const csv = rows.join('\n');
                const blob = new Blob([csv], {
                  type: 'text/csv;charset=utf-8;',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dashboard_key_metrics_${new Date()
                  .toISOString()
                  .slice(0, 10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success('Report (CSV) downloaded');
              } catch (_e) {
                toast.error('CSV export failed');
              } finally {
                setIsExporting(false);
              }
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Asset Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Lifecycle Components</CardTitle>
          <CardDescription>
            Manage all aspects of asset lifecycle modeling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {assetSections.map(section => (
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

            {assetSections.map(section => (
              <TabsContent key={section.id} value={section.id} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    {section.icon}
                    <h3 className="text-lg font-semibold">{section.label}</h3>
                    <Badge variant="secondary">{section.description}</Badge>
                  </div>

                  {/* Section-specific content */}
                  {section.id === 'fixed-assets' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Land Value</Label>
                        <Input placeholder="$500,000" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Buildings Value</Label>
                        <Input placeholder="$2,000,000" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Machinery Value</Label>
                        <Input placeholder="$1,500,000" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Vehicles Value</Label>
                        <Input placeholder="$300,000" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Computer Equipment</Label>
                        <Input placeholder="$200,000" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Furniture Value</Label>
                        <Input placeholder="$150,000" type="text" />
                      </div>
                    </div>
                  )}

                  {section.id === 'intangible-assets' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Goodwill</Label>
                        <Input placeholder="$1,000,000" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Patents</Label>
                        <Input placeholder="$500,000" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Trademarks</Label>
                        <Input placeholder="$300,000" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Software</Label>
                        <Input placeholder="$400,000" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Licenses</Label>
                        <Input placeholder="$200,000" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Customer Relationships</Label>
                        <Input placeholder="$600,000" type="text" />
                      </div>
                    </div>
                  )}

                  {section.id === 'working-capital' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Raw Materials Days</Label>
                        <Input placeholder="30" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>WIP Days</Label>
                        <Input placeholder="15" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Finished Goods Days</Label>
                        <Input placeholder="45" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Collection Period (Days)</Label>
                        <Input placeholder="60" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Terms (Days)</Label>
                        <Input placeholder="30" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Minimum Cash Balance</Label>
                        <Input placeholder="$500,000" type="text" />
                      </div>
                    </div>
                  )}

                  {section.id === 'depreciation' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Buildings Depreciation Rate (%)</Label>
                        <Input placeholder="2.5" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Machinery Depreciation Rate (%)</Label>
                        <Input placeholder="10.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Vehicles Depreciation Rate (%)</Label>
                        <Input placeholder="20.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Computer Equipment Rate (%)</Label>
                        <Input placeholder="33.3" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Patents Amortization Rate (%)</Label>
                        <Input placeholder="10.0" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Software Amortization Rate (%)</Label>
                        <Input placeholder="25.0" type="number" step="0.1" />
                      </div>
                    </div>
                  )}

                  {section.id === 'replacement' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Average Asset Life (Years)</Label>
                        <Input placeholder="10" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Replacement Cycle (Years)</Label>
                        <Input placeholder="8" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Salvage Value (%)</Label>
                        <Input placeholder="10" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Maintenance Spend (%)</Label>
                        <Input placeholder="2" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Technology Upgrade Cycle</Label>
                        <Input placeholder="3" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Inflation Impact (%)</Label>
                        <Input placeholder="3.0" type="number" step="0.1" />
                      </div>
                    </div>
                  )}

                  {section.id === 'metrics' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Return on Assets
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">12.5%</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Asset Turnover
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">1.8x</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Fixed Asset Turnover
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">2.3x</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Working Capital Turnover
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">4.1x</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Changes will update asset lifecycle calculations
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

export default AssetLifecycle;
