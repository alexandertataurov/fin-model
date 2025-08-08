import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { componentStyles } from '@/design-system/utils/designSystem';
import {
  useActiveStatement,
  useBalanceSheetDashboard,
  useUserStatements,
} from '@/hooks/useDashboard';
import DashboardApiService, { PeriodFilter } from '@/services/dashboardApi';
import { toast } from 'sonner';
import { CloudUpload, Download } from 'lucide-react';

const BalanceSheetDashboard: React.FC = () => {
  const { activeStatementId, setActiveStatementId, statements } =
    useActiveStatement();
  const { data: statementsData } = useUserStatements(undefined, 10);
  const {
    data: bsData,
    isLoading,
    isError,
  } = useBalanceSheetDashboard(activeStatementId);

  const handleExport = async () => {
    if (!activeStatementId) return;
    try {
      const result = await DashboardApiService.exportDashboardData({
        format: 'json',
        period: PeriodFilter.YTD,
        statement_ids: [activeStatementId],
      });
      const blob = new Blob([JSON.stringify(result, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `balance_sheet_export_${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Balance Sheet exported');
    } catch (e) {
      toast.error('Export failed');
    }
  };

  const formatCurrency = (n?: number) => {
    if (n === undefined || n === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(n);
  };

  const formatPercent = (n?: number) => {
    if (n === undefined || n === null) return 'N/A';
    return `${Number(n).toFixed(1)}%`;
  };

  const availableStatements = statementsData?.statements || statements || [];
  const hasStatements = (availableStatements?.length || 0) > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className={componentStyles.container}>
        <header className="py-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className={componentStyles.heading.h1}>
              Balance Sheet Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Assets, liabilities, and equity analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="border rounded px-2 py-1 bg-background"
              value={activeStatementId || ''}
              onChange={e => setActiveStatementId(e.target.value || null)}
              disabled={!hasStatements}
              title="Select statement"
            >
              <option value="" disabled>
                {hasStatements ? 'Select statement' : 'No statements available'}
              </option>
              {availableStatements.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.type.toUpperCase()})
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!activeStatementId}
            >
              <Download className="h-4 w-4 mr-2" /> Export JSON
            </Button>
          </div>
        </header>

        <main className="space-y-6">
          {!hasStatements ? (
            <Card>
              <CardContent className="py-10 text-center">
                <CloudUpload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No financial statements found. Upload your financial data to
                  view Balance Sheet.
                </p>
                <div className="mt-4">
                  <a href="/upload">
                    <Button>Upload Data</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : isError ? (
            <Card>
              <CardHeader>
                <CardTitle>Error loading Balance Sheet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Please try selecting another statement.
                </p>
              </CardContent>
            </Card>
          ) : isLoading || !bsData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Leverage & Liquidity metrics */}
              {((bsData as any).leverage_metrics ||
                (bsData as any).liquidity_ratios) && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">Key Ratios</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(
                      ((bsData as any).leverage_metrics &&
                        Object.entries((bsData as any).leverage_metrics)) ||
                      []
                    )
                      .slice(0, 8)
                      .map(([key, metric]: any) => (
                        <Card key={`lev-${key}`}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">
                              {metric?.name ||
                                String(key).replace('_', ' ').toUpperCase()}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {metric?.format_type === 'percentage'
                                ? formatPercent(metric?.value)
                                : formatCurrency(metric?.value)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    {(
                      ((bsData as any).liquidity_ratios &&
                        (bsData as any).liquidity_ratios) ||
                      []
                    )
                      .slice(0, 8)
                      .map((metric: any, idx: number) => (
                        <Card key={`liq-${idx}`}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">
                              {metric?.name || 'Liquidity Ratio'}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {metric?.format_type === 'percentage'
                                ? formatPercent(metric?.value)
                                : formatCurrency(metric?.value)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Composition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {((bsData as any).asset_composition || [])
                      .slice(0, 10)
                      .map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1 text-sm"
                        >
                          <span className="text-muted-foreground">
                            {item.name}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                      ))}
                    {((bsData as any).asset_composition || []).length === 0 && (
                      <p className="text-muted-foreground">No asset data.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Liability Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {((bsData as any).liability_breakdown || [])
                      .slice(0, 10)
                      .map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1 text-sm"
                        >
                          <span className="text-muted-foreground">
                            {item.name}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                      ))}
                    {((bsData as any).liability_breakdown || []).length ===
                      0 && (
                      <p className="text-muted-foreground">
                        No liability data.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Equity Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {((bsData as any).equity_structure || [])
                      .slice(0, 10)
                      .map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1 text-sm"
                        >
                          <span className="text-muted-foreground">
                            {item.name}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                      ))}
                    {((bsData as any).equity_structure || []).length === 0 && (
                      <p className="text-muted-foreground">No equity data.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BalanceSheetDashboard;
