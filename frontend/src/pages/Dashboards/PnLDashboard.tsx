import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { Button } from '@/design-system/atoms';
import { componentStyles } from '@/design-system/utils/designSystem';
import {
  useActiveStatement,
  usePLDashboard,
  useUserStatements,
} from '@/hooks/useDashboard';
import DashboardApiService, { PeriodFilter } from '@/services/dashboardApi';
import { toast } from 'sonner';
import { CloudUpload, Download } from 'lucide-react';

const PnLDashboard: React.FC = () => {
  const { activeStatementId, setActiveStatementId, statements } =
    useActiveStatement();
  const { data: statementsData } = useUserStatements(undefined, 10);
  const {
    data: plData,
    isLoading,
    isError,
  } = usePLDashboard(activeStatementId);

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
      a.download = `pl_export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('P&L exported');
    } catch (_e) {
      toast.error('Export failed');
    }
  };

  const formatNumber = (n?: number) => {
    if (n === undefined || n === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(n);
  };

  const availableStatements = statementsData?.statements || statements || [];
  const hasStatements = (availableStatements?.length || 0) > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className={componentStyles.container}>
        <header className="py-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className={componentStyles.heading.h1}>P&L Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Profit & Loss analysis and insights
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
                  view P&L.
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
                <CardTitle>Error loading P&L</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Please try selecting another statement.
                </p>
              </CardContent>
            </Card>
          ) : isLoading || !plData ? (
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
              {/* Key Metrics */}
              {plData.key_metrics && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">Key Metrics</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(plData.key_metrics as any).map(
                      ([key, metric]: any) => (
                        <Card key={key}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">
                              {metric.name ||
                                key.replace('_', ' ').toUpperCase()}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {metric.format_type === 'percentage'
                                ? `${Number(metric.value ?? 0).toFixed(1)}%`
                                : formatNumber(metric.value)}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Revenue & Expenses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(plData.revenue_data || [])
                      .slice(0, 8)
                      .map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1 text-sm"
                        >
                          <span className="text-muted-foreground">
                            {item.name}
                          </span>
                          <span className="font-medium">
                            {formatNumber(item.value)}
                          </span>
                        </div>
                      ))}
                    {(plData.revenue_data || []).length === 0 && (
                      <p className="text-muted-foreground">No revenue data.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(plData.expense_data || [])
                      .slice(0, 8)
                      .map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1 text-sm"
                        >
                          <span className="text-muted-foreground">
                            {item.name}
                          </span>
                          <span className="font-medium">
                            {formatNumber(item.value)}
                          </span>
                        </div>
                      ))}
                    {(plData.expense_data || []).length === 0 && (
                      <p className="text-muted-foreground">No expense data.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Margins */}
              {plData.margin_analysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Margin Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(plData.margin_analysis || [])
                      .slice(0, 6)
                      .map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1 text-sm"
                        >
                          <span className="text-muted-foreground">
                            {item.name}
                          </span>
                          <span className="font-medium">
                            {item.value != null
                              ? `${Number(item.value).toFixed(1)}%`
                              : 'N/A'}
                          </span>
                        </div>
                      ))}
                    {(plData.margin_analysis || []).length === 0 && (
                      <p className="text-muted-foreground">No margin data.</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default PnLDashboard;
