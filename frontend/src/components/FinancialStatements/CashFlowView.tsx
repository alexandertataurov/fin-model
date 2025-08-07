/**
 * Comprehensive Cash Flow Statement View
 * Based on lean financial modeling plan - detailed cash flow breakdown
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from 'lucide-react';

interface CashFlowData {
  // Operating Activities
  operating_activities: {
    net_income: number;
    
    // Non-cash adjustments
    depreciation_expense: number;
    amortization_expense: number;
    stock_based_compensation: number;
    deferred_tax_benefit: number;
    asset_impairment: number;
    bad_debt_provision: number;
    
    // Working capital changes
    accounts_receivable_change: number;
    inventory_change: number;
    prepaid_expenses_change: number;
    accounts_payable_change: number;
    accrued_liabilities_change: number;
    deferred_revenue_change: number;
    other_working_capital_change: number;
    total_working_capital_change: number;
    
    // Other operating activities
    interest_paid: number;
    taxes_paid: number;
    other_operating_cash_flow: number;
    
    total_operating_cash_flow: number;
  };

  // Investing Activities
  investing_activities: {
    // Capital expenditures
    property_plant_equipment_purchases: number;
    intangible_asset_purchases: number;
    software_development_costs: number;
    research_development_capex: number;
    
    // Asset disposals
    asset_sales_proceeds: number;
    business_acquisition_cost: number;
    business_divestiture_proceeds: number;
    
    // Investments
    short_term_investments_change: number;
    long_term_investments_change: number;
    marketable_securities_change: number;
    
    // Other investing activities
    loans_to_subsidiaries: number;
    other_investing_cash_flow: number;
    
    total_investing_cash_flow: number;
  };

  // Financing Activities
  financing_activities: {
    // Debt activities
    debt_proceeds: number;
    debt_repayments: number;
    net_debt_change: number;
    
    // Equity activities
    stock_issuance_proceeds: number;
    stock_repurchase_cost: number;
    dividend_payments: number;
    preferred_dividend_payments: number;
    
    // Other financing activities
    capital_lease_payments: number;
    debt_issuance_costs: number;
    other_financing_cash_flow: number;
    
    total_financing_cash_flow: number;
  };

  // Net cash flow and positions
  net_change_in_cash: number;
  beginning_cash_balance: number;
  ending_cash_balance: number;
  
  // Supplemental information
  supplemental_info: {
    free_cash_flow: number;
    levered_free_cash_flow: number;
    cash_conversion_ratio: number;
    days_sales_outstanding: number;
    days_inventory_outstanding: number;
    days_payable_outstanding: number;
    cash_conversion_cycle: number;
  };
}

interface CashFlowViewProps {
  data?: CashFlowData;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const formatCurrency = (value: number): string => {
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

const formatDays = (value: number): string => {
  return `${Math.round(value)} days`;
};

const CashFlowView: React.FC<CashFlowViewProps> = ({
  data,
  isLoading = false,
  onRefresh,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['operating', 'investing', 'financing']));

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
          <CardTitle>Cash Flow Statement</CardTitle>
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
          <CardTitle>Cash Flow Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No cash flow data available</p>
        </CardContent>
      </Card>
    );
  }

  const LineItem: React.FC<{
    label: string;
    value: number;
    isTotal?: boolean;
    isSubtotal?: boolean;
    indent?: number;
    showTrend?: boolean;
  }> = ({ label, value, isTotal = false, isSubtotal = false, indent = 0, showTrend = true }) => (
    <div
      className={`flex justify-between items-center py-2 px-4 ${
        isTotal ? 'font-bold bg-gray-50 border-t-2 border-b-2' : 
        isSubtotal ? 'font-semibold bg-gray-25 border-t' : ''
      }`}
      style={{ paddingLeft: `${16 + indent * 16}px` }}
    >
      <span className={isTotal ? 'text-lg' : isSubtotal ? 'text-md' : 'text-sm'}>
        {label}
      </span>
      <div className="flex items-center space-x-2">
        <span className={`${isTotal ? 'text-lg font-bold' : 'font-medium'} ${
          value < 0 ? 'text-red-600' : 'text-gray-900'
        }`}>
          {formatCurrency(value)}
        </span>
        {showTrend && value > 0 && (
          <TrendingUp className="w-4 h-4 text-green-500" />
        )}
        {showTrend && value < 0 && (
          <TrendingDown className="w-4 h-4 text-red-500" />
        )}
      </div>
    </div>
  );

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
        <Activity 
          className={`w-5 h-5 transition-transform ${
            expandedSections.has(sectionKey) ? 'rotate-90' : ''
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
          <Activity className="w-6 h-6" />
          <span>Cash Flow Statement</span>
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
      <CardContent className="space-y-4">
        {/* Operating Activities Section */}
        <ExpandableSection title="Cash Flow from Operating Activities" sectionKey="operating">
          <LineItem label="Net Income" value={data.operating_activities.net_income} indent={1} />
          
          <div className="bg-gray-50 p-2">
            <h4 className="font-medium text-gray-700 mb-2">Non-Cash Adjustments</h4>
            <LineItem label="Depreciation Expense" value={data.operating_activities.depreciation_expense} indent={2} />
            <LineItem label="Amortization Expense" value={data.operating_activities.amortization_expense} indent={2} />
            <LineItem label="Stock-Based Compensation" value={data.operating_activities.stock_based_compensation} indent={2} />
            <LineItem label="Deferred Tax Benefit" value={data.operating_activities.deferred_tax_benefit} indent={2} />
            <LineItem label="Asset Impairment" value={data.operating_activities.asset_impairment} indent={2} />
            <LineItem label="Bad Debt Provision" value={data.operating_activities.bad_debt_provision} indent={2} />
          </div>

          <div className="bg-gray-50 p-2">
            <h4 className="font-medium text-gray-700 mb-2">Changes in Working Capital</h4>
            <LineItem label="Accounts Receivable Change" value={data.operating_activities.accounts_receivable_change} indent={2} />
            <LineItem label="Inventory Change" value={data.operating_activities.inventory_change} indent={2} />
            <LineItem label="Prepaid Expenses Change" value={data.operating_activities.prepaid_expenses_change} indent={2} />
            <LineItem label="Accounts Payable Change" value={data.operating_activities.accounts_payable_change} indent={2} />
            <LineItem label="Accrued Liabilities Change" value={data.operating_activities.accrued_liabilities_change} indent={2} />
            <LineItem label="Deferred Revenue Change" value={data.operating_activities.deferred_revenue_change} indent={2} />
            <LineItem label="Other Working Capital Change" value={data.operating_activities.other_working_capital_change} indent={2} />
            <LineItem label="Total Working Capital Change" value={data.operating_activities.total_working_capital_change} indent={1} isSubtotal={true} />
          </div>

          <div className="bg-gray-50 p-2">
            <h4 className="font-medium text-gray-700 mb-2">Other Operating Activities</h4>
            <LineItem label="Interest Paid" value={data.operating_activities.interest_paid} indent={2} />
            <LineItem label="Taxes Paid" value={data.operating_activities.taxes_paid} indent={2} />
            <LineItem label="Other Operating Cash Flow" value={data.operating_activities.other_operating_cash_flow} indent={2} />
          </div>

          <LineItem 
            label="Total Operating Cash Flow" 
            value={data.operating_activities.total_operating_cash_flow}
            isTotal={true}
          />
        </ExpandableSection>

        {/* Investing Activities Section */}
        <ExpandableSection title="Cash Flow from Investing Activities" sectionKey="investing">
          <div className="bg-gray-50 p-2">
            <h4 className="font-medium text-gray-700 mb-2">Capital Expenditures</h4>
            <LineItem label="Property, Plant & Equipment" value={data.investing_activities.property_plant_equipment_purchases} indent={2} />
            <LineItem label="Intangible Asset Purchases" value={data.investing_activities.intangible_asset_purchases} indent={2} />
            <LineItem label="Software Development Costs" value={data.investing_activities.software_development_costs} indent={2} />
            <LineItem label="R&D Capital Expenditures" value={data.investing_activities.research_development_capex} indent={2} />
          </div>

          <div className="bg-gray-50 p-2">
            <h4 className="font-medium text-gray-700 mb-2">Asset Transactions</h4>
            <LineItem label="Asset Sales Proceeds" value={data.investing_activities.asset_sales_proceeds} indent={2} />
            <LineItem label="Business Acquisition Cost" value={data.investing_activities.business_acquisition_cost} indent={2} />
            <LineItem label="Business Divestiture Proceeds" value={data.investing_activities.business_divestiture_proceeds} indent={2} />
          </div>

          <div className="bg-gray-50 p-2">
            <h4 className="font-medium text-gray-700 mb-2">Investment Activities</h4>
            <LineItem label="Short-term Investments Change" value={data.investing_activities.short_term_investments_change} indent={2} />
            <LineItem label="Long-term Investments Change" value={data.investing_activities.long_term_investments_change} indent={2} />
            <LineItem label="Marketable Securities Change" value={data.investing_activities.marketable_securities_change} indent={2} />
            <LineItem label="Loans to Subsidiaries" value={data.investing_activities.loans_to_subsidiaries} indent={2} />
            <LineItem label="Other Investing Cash Flow" value={data.investing_activities.other_investing_cash_flow} indent={2} />
          </div>

          <LineItem 
            label="Total Investing Cash Flow" 
            value={data.investing_activities.total_investing_cash_flow}
            isTotal={true}
          />
        </ExpandableSection>

        {/* Financing Activities Section */}
        <ExpandableSection title="Cash Flow from Financing Activities" sectionKey="financing">
          <div className="bg-gray-50 p-2">
            <h4 className="font-medium text-gray-700 mb-2">Debt Activities</h4>
            <LineItem label="Debt Proceeds" value={data.financing_activities.debt_proceeds} indent={2} />
            <LineItem label="Debt Repayments" value={data.financing_activities.debt_repayments} indent={2} />
            <LineItem label="Net Debt Change" value={data.financing_activities.net_debt_change} indent={1} isSubtotal={true} />
          </div>

          <div className="bg-gray-50 p-2">
            <h4 className="font-medium text-gray-700 mb-2">Equity Activities</h4>
            <LineItem label="Stock Issuance Proceeds" value={data.financing_activities.stock_issuance_proceeds} indent={2} />
            <LineItem label="Stock Repurchase Cost" value={data.financing_activities.stock_repurchase_cost} indent={2} />
            <LineItem label="Dividend Payments" value={data.financing_activities.dividend_payments} indent={2} />
            <LineItem label="Preferred Dividend Payments" value={data.financing_activities.preferred_dividend_payments} indent={2} />
          </div>

          <div className="bg-gray-50 p-2">
            <h4 className="font-medium text-gray-700 mb-2">Other Financing Activities</h4>
            <LineItem label="Capital Lease Payments" value={data.financing_activities.capital_lease_payments} indent={2} />
            <LineItem label="Debt Issuance Costs" value={data.financing_activities.debt_issuance_costs} indent={2} />
            <LineItem label="Other Financing Cash Flow" value={data.financing_activities.other_financing_cash_flow} indent={2} />
          </div>

          <LineItem 
            label="Total Financing Cash Flow" 
            value={data.financing_activities.total_financing_cash_flow}
            isTotal={true}
          />
        </ExpandableSection>

        {/* Net Cash Flow Summary */}
        <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
          <h3 className="font-semibold text-lg mb-3 text-blue-800">Net Cash Flow Summary</h3>
          <LineItem label="Net Change in Cash" value={data.net_change_in_cash} isTotal={true} />
          <LineItem label="Beginning Cash Balance" value={data.beginning_cash_balance} />
          <LineItem label="Ending Cash Balance" value={data.ending_cash_balance} isTotal={true} />
        </div>

        {/* Free Cash Flow Metrics */}
        <div className="border rounded-lg p-4 bg-green-50">
          <h3 className="font-semibold text-lg mb-3 text-green-800">Free Cash Flow Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Free Cash Flow</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.supplemental_info.free_cash_flow)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Levered Free Cash Flow</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.supplemental_info.levered_free_cash_flow)}
              </p>
            </div>
          </div>
        </div>

        {/* Working Capital Metrics */}
        <div className="border rounded-lg p-4 bg-purple-50">
          <h3 className="font-semibold text-lg mb-3 text-purple-800">Working Capital Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Days Sales Outstanding</p>
              <p className="text-lg font-semibold text-purple-600">
                {formatDays(data.supplemental_info.days_sales_outstanding)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Days Inventory Outstanding</p>
              <p className="text-lg font-semibold text-purple-600">
                {formatDays(data.supplemental_info.days_inventory_outstanding)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Days Payable Outstanding</p>
              <p className="text-lg font-semibold text-purple-600">
                {formatDays(data.supplemental_info.days_payable_outstanding)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cash Conversion Cycle</p>
              <p className="text-lg font-semibold text-purple-600">
                {formatDays(data.supplemental_info.cash_conversion_cycle)}
              </p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Cash Conversion Ratio</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatPercentage(data.supplemental_info.cash_conversion_ratio)}
            </p>
          </div>
        </div>

        {/* Key Cash Flow Metrics Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600">Operating Cash Flow</h4>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(data.operating_activities.total_operating_cash_flow)}
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600">Free Cash Flow</h4>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(data.supplemental_info.free_cash_flow)}
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600">Cash Balance</h4>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(data.ending_cash_balance)}
            </p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowView;