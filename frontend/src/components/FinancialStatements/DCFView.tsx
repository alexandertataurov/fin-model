/**
 * Comprehensive DCF (Discounted Cash Flow) Valuation View
 * Based on lean financial modeling plan - detailed DCF analysis and valuation
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { formatCurrency as formatCurrencyUtil, formatPercentage as formatPercentageUtil } from '@/utils/formatters';
import { Button } from '@/design-system/components/Button';
// duplicate import removed
import { Download, TrendingUp, TrendingDown, Target, Calculator } from 'lucide-react';

interface DCFData {
  // Projection Parameters
  projection_years: number;
  terminal_growth_rate: number;
  discount_rate_wacc: number;

  // Free Cash Flow Projections
  fcf_projections: {
    year: number;
    revenue: number;
    ebitda: number;
    ebit: number;
    taxes: number;
    nopat: number;
    capex: number;
    depreciation: number;
    working_capital_change: number;
    unlevered_fcf: number;
    discount_factor: number;
    present_value_fcf: number;
  }[];

  // Terminal Value Calculation
  terminal_value: {
    final_year_fcf: number;
    terminal_growth_rate: number;
    terminal_fcf: number;
    terminal_value: number;
    terminal_discount_factor: number;
    present_value_terminal: number;
  };

  // Valuation Summary
  valuation_summary: {
    sum_pv_fcf: number;
    present_value_terminal: number;
    enterprise_value: number;
    net_debt: number;
    equity_value: number;
    shares_outstanding: number;
    value_per_share: number;
  };

  // Sensitivity Analysis
  sensitivity_analysis: {
    discount_rate_range: number[];
    terminal_growth_range: number[];
    valuation_matrix: number[][];
    base_case_value: number;
    bull_case_value: number;
    bear_case_value: number;
  };

  // Key Metrics and Ratios
  key_metrics: {
    current_share_price: number;
    upside_downside: number;
    upside_downside_percentage: number;
    ev_revenue_multiple: number;
    ev_ebitda_multiple: number;
    pe_ratio_implied: number;
    fcf_yield: number;
    roic: number;
    wacc: number;
    economic_profit: number;
  };

  // Risk Analysis
  risk_analysis: {
    beta: number;
    cost_of_equity: number;
    cost_of_debt: number;
    debt_to_equity_ratio: number;
    interest_coverage_ratio: number;
    volatility: number;
    credit_rating: string;
  };
}

interface DCFViewProps {
  data?: DCFData;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  } else if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  } else if (Math.abs(value) >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

const formatMultiple = (value: number): string => {
  return `${value.toFixed(1)}x`;
};

const DCFView: React.FC<DCFViewProps> = ({
  data,
  isLoading = false,
  onRefresh,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['projections', 'valuation']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>DCF Valuation Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>DCF Valuation Model</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No DCF valuation data available</p>
        </CardContent>
      </Card>
    );
  }

  const ExpandableSection: React.FC<{
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }> = ({ title, sectionKey, children }) => (
    <div className="border rounded-lg">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-semibold text-lg">{title}</h3>
        <Calculator
          className={`w-5 h-5 transition-transform ${expandedSections.has(sectionKey) ? 'rotate-90' : ''
            }`}
        />
      </button>
      {expandedSections.has(sectionKey) && (
        <div className="border-t">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-6 h-6" />
          <span>DCF Valuation Model</span>
        </CardTitle>
        <div className="flex space-x-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              Refresh
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Valuation Summary - Top Priority */}
        <div className="border-2 border-blue-200 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="font-semibold text-xl mb-4 text-blue-800">Valuation Summary</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Enterprise Value</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.valuation_summary.enterprise_value)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Equity Value</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.valuation_summary.equity_value)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Value Per Share</p>
              <p className="text-3xl font-bold text-purple-600">
                {formatCurrency(data.valuation_summary.value_per_share)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Upside/Downside</p>
              <div className="flex items-center justify-center space-x-2">
                <p className={`text-2xl font-bold ${data.key_metrics.upside_downside >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {formatPercentage(data.key_metrics.upside_downside_percentage)}
                </p>
                {data.key_metrics.upside_downside >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-500" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-500" />
                )}
              </div>
            </div>
          </div>
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">Current Share Price: {formatCurrency(data.key_metrics.current_share_price)}</p>
            <p className="text-sm text-gray-600">
              Upside/Downside: {formatCurrency(data.key_metrics.upside_downside)}
            </p>
          </div>
        </div>

        {/* Free Cash Flow Projections */}
        <ExpandableSection title="Free Cash Flow Projections" sectionKey="projections">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Year</th>
                  <th className="px-4 py-2 text-right">Revenue</th>
                  <th className="px-4 py-2 text-right">EBITDA</th>
                  <th className="px-4 py-2 text-right">EBIT</th>
                  <th className="px-4 py-2 text-right">NOPAT</th>
                  <th className="px-4 py-2 text-right">FCF</th>
                  <th className="px-4 py-2 text-right">Discount Factor</th>
                  <th className="px-4 py-2 text-right">PV of FCF</th>
                </tr>
              </thead>
              <tbody>
                {data.fcf_projections.map((projection, index) => (
                  <tr key={projection.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                    <td className="px-4 py-2 font-medium">Year {projection.year}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(projection.revenue)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(projection.ebitda)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(projection.ebit)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(projection.nopat)}</td>
                    <td className="px-4 py-2 text-right font-semibold">{formatCurrency(projection.unlevered_fcf)}</td>
                    <td className="px-4 py-2 text-right">{projection.discount_factor.toFixed(3)}</td>
                    <td className="px-4 py-2 text-right font-semibold text-blue-600">{formatCurrency(projection.present_value_fcf)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ExpandableSection>

        {/* Terminal Value Calculation */}
        <ExpandableSection title="Terminal Value Calculation" sectionKey="terminal">
          <div className="bg-gray-50 p-4 space-y-3">
            <div className="flex justify-between">
              <span>Final Year FCF:</span>
              <span className="font-semibold">{formatCurrency(data.terminal_value.final_year_fcf)}</span>
            </div>
            <div className="flex justify-between">
              <span>Terminal Growth Rate:</span>
              <span className="font-semibold">{formatPercentage(data.terminal_value.terminal_growth_rate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Terminal FCF:</span>
              <span className="font-semibold">{formatCurrency(data.terminal_value.terminal_fcf)}</span>
            </div>
            <div className="flex justify-between">
              <span>WACC Discount Rate:</span>
              <span className="font-semibold">{formatPercentage(data.discount_rate_wacc)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Terminal Value:</span>
              <span className="font-bold">{formatCurrency(data.terminal_value.terminal_value)}</span>
            </div>
            <div className="flex justify-between">
              <span>Terminal Discount Factor:</span>
              <span className="font-semibold">{data.terminal_value.terminal_discount_factor.toFixed(3)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">PV of Terminal Value:</span>
              <span className="font-bold text-green-600">{formatCurrency(data.terminal_value.present_value_terminal)}</span>
            </div>
          </div>
        </ExpandableSection>

        {/* Detailed Valuation Breakdown */}
        <ExpandableSection title="Valuation Breakdown" sectionKey="valuation">
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Enterprise Value Components</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sum of PV of FCF:</span>
                    <span className="font-semibold">{formatCurrency(data.valuation_summary.sum_pv_fcf)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PV of Terminal Value:</span>
                    <span className="font-semibold">{formatCurrency(data.valuation_summary.present_value_terminal)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold">Enterprise Value:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(data.valuation_summary.enterprise_value)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Equity Value Calculation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Enterprise Value:</span>
                    <span className="font-semibold">{formatCurrency(data.valuation_summary.enterprise_value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Less: Net Debt:</span>
                    <span className="font-semibold">({formatCurrency(Math.abs(data.valuation_summary.net_debt))})</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold">Equity Value:</span>
                    <span className="font-bold text-green-600">{formatCurrency(data.valuation_summary.equity_value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shares Outstanding:</span>
                    <span className="font-semibold">{data.valuation_summary.shares_outstanding.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold">Value Per Share:</span>
                    <span className="font-bold text-purple-600">{formatCurrency(data.valuation_summary.value_per_share)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ExpandableSection>

        {/* Sensitivity Analysis */}
        <ExpandableSection title="Sensitivity Analysis" sectionKey="sensitivity">
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Bear Case</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(data.sensitivity_analysis.bear_case_value)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Base Case</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(data.sensitivity_analysis.base_case_value)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Bull Case</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(data.sensitivity_analysis.bull_case_value)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <p className="text-sm font-medium mb-2">Sensitivity Matrix (WACC vs Terminal Growth Rate)</p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-1">WACC / Terminal Growth</th>
                    {data.sensitivity_analysis.terminal_growth_range.map((rate, index) => (
                      <th key={index} className="px-2 py-1">{formatPercentage(rate)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.sensitivity_analysis.discount_rate_range.map((wacc, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-2 py-1 font-medium">{formatPercentage(wacc)}</td>
                      {data.sensitivity_analysis.valuation_matrix[i]?.map((value, j) => (
                        <td key={j} className="px-2 py-1 text-center">
                          {formatCurrency(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ExpandableSection>

        {/* Key Metrics and Ratios */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600">EV/Revenue</h4>
            <p className="text-2xl font-bold text-blue-600">
              {formatMultiple(data.key_metrics.ev_revenue_multiple)}
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600">EV/EBITDA</h4>
            <p className="text-2xl font-bold text-green-600">
              {formatMultiple(data.key_metrics.ev_ebitda_multiple)}
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600">Implied P/E</h4>
            <p className="text-2xl font-bold text-purple-600">
              {formatMultiple(data.key_metrics.pe_ratio_implied)}
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600">FCF Yield</h4>
            <p className="text-2xl font-bold text-indigo-600">
              {formatPercentageUtil(data.key_metrics.fcf_yield)}
            </p>
          </Card>
        </div>

        {/* Risk Analysis */}
        <ExpandableSection title="Risk Analysis" sectionKey="risk">
          <div className="p-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Beta</p>
              <p className="text-lg font-semibold">{data.risk_analysis.beta.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cost of Equity</p>
              <p className="text-lg font-semibold">{formatPercentage(data.risk_analysis.cost_of_equity)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cost of Debt</p>
              <p className="text-lg font-semibold">{formatPercentage(data.risk_analysis.cost_of_debt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">D/E Ratio</p>
              <p className="text-lg font-semibold">{data.risk_analysis.debt_to_equity_ratio.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Coverage</p>
              <p className="text-lg font-semibold">{formatMultiple(data.risk_analysis.interest_coverage_ratio)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Credit Rating</p>
              <p className="text-lg font-semibold">{data.risk_analysis.credit_rating}</p>
            </div>
          </div>
        </ExpandableSection>

        {/* Economic Value Analysis */}
        <div className="border rounded-lg p-4 bg-orange-50">
          <h3 className="font-semibold text-lg mb-3 text-orange-800">Economic Value Creation</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">ROIC</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatPercentageUtil(data.key_metrics.roic)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">WACC</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatPercentageUtil(data.key_metrics.wacc)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Economic Profit</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(data.key_metrics.economic_profit)}
              </p>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              Value Creation: {data.key_metrics.roic > data.key_metrics.wacc ? 'Positive' : 'Negative'}
              (ROIC {data.key_metrics.roic > data.key_metrics.wacc ? '>' : '<'} WACC)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DCFView;