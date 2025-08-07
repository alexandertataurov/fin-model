/**
 * Comprehensive Balance Sheet View
 * Based on lean financial modeling plan - detailed balance sheet with all line items
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { Button } from '@/design-system/components/Button';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { Download, Building, CreditCard, PieChart, BarChart3 } from 'lucide-react';

interface BalanceSheetData {
  // Assets Section
  assets: {
    // Current Assets
    current_assets: {
      cash: number;
      cash_equivalents: number;
      marketable_securities: number;
      restricted_cash: number;
      total_cash_and_equivalents: number;

      accounts_receivable: number;
      allowance_for_doubtful_accounts: number;
      net_accounts_receivable: number;

      raw_materials: number;
      work_in_progress: number;
      finished_goods: number;
      total_inventory: number;

      prepaid_expenses: number;
      other_receivables: number;
      deferred_tax_assets_current: number;
      other_current_assets: number;

      total_current_assets: number;
    };

    // Non-Current Assets
    non_current_assets: {
      property_plant_equipment: {
        land: number;
        buildings: number;
        machinery_and_equipment: number;
        vehicles: number;
        computer_equipment: number;
        furniture_and_fixtures: number;
        leasehold_improvements: number;
        construction_in_progress: number;
        total_pp_e: number;
      };

      accumulated_depreciation: {
        buildings_depreciation: number;
        machinery_depreciation: number;
        vehicles_depreciation: number;
        computer_depreciation: number;
        furniture_depreciation: number;
        leasehold_depreciation: number;
        total_accumulated_depreciation: number;
      };

      net_property_plant_equipment: number;

      intangible_assets: {
        goodwill: number;
        patents: number;
        trademarks: number;
        software: number;
        licenses: number;
        customer_relationships: number;
        other_intangibles: number;
        total_intangible_assets: number;
      };

      accumulated_amortization: {
        patents_amortization: number;
        trademarks_amortization: number;
        software_amortization: number;
        licenses_amortization: number;
        customer_relationships_amortization: number;
        other_amortization: number;
        total_accumulated_amortization: number;
      };

      net_intangible_assets: number;

      other_non_current_assets: {
        long_term_investments: number;
        deferred_tax_assets_non_current: number;
        other_long_term_assets: number;
        total_other_non_current_assets: number;
      };

      total_non_current_assets: number;
    };

    total_assets: number;
  };

  // Liabilities Section
  liabilities: {
    // Current Liabilities
    current_liabilities: {
      accounts_payable: number;

      short_term_debt: {
        bank_overdrafts: number;
        short_term_loans: number;
        current_portion_long_term_debt: number;
        credit_line_utilization: number;
        total_short_term_debt: number;
      };

      accrued_expenses: {
        accrued_salaries: number;
        accrued_taxes: number;
        accrued_interest: number;
        accrued_utilities: number;
        other_accrued_expenses: number;
        total_accrued_expenses: number;
      };

      other_current_liabilities: {
        deferred_revenue: number;
        income_taxes_payable: number;
        dividends_payable: number;
        other_current_liabilities: number;
        total_other_current_liabilities: number;
      };

      total_current_liabilities: number;
    };

    // Non-Current Liabilities
    non_current_liabilities: {
      long_term_debt: {
        term_loans: number;
        bonds_payable: number;
        mortgage_payable: number;
        capital_leases: number;
        other_long_term_debt: number;
        total_long_term_debt: number;
      };

      deferred_tax_liabilities: number;

      other_non_current_liabilities: {
        pension_liabilities: number;
        warranty_liabilities: number;
        environmental_liabilities: number;
        other_long_term_liabilities: number;
        total_other_non_current_liabilities: number;
      };

      total_non_current_liabilities: number;
    };

    total_liabilities: number;
  };

  // Equity Section
  equity: {
    share_capital: {
      common_stock: number;
      preferred_stock: number;
      treasury_stock: number;
      additional_paid_in_capital: number;
      total_share_capital: number;
    };

    retained_earnings: {
      beginning_retained_earnings: number;
      net_income: number;
      dividends_paid: number;
      stock_repurchases: number;
      ending_retained_earnings: number;
    };

    other_equity: {
      accumulated_other_comprehensive_income: number;
      foreign_currency_translation: number;
      unrealized_gains_losses: number;
      other_equity_adjustments: number;
      total_other_equity: number;
    };

    non_controlling_interest: number;
    total_equity: number;
  };

  // Balance Sheet Metrics
  balance_sheet_metrics: {
    current_ratio: number;
    quick_ratio: number;
    debt_to_equity_ratio: number;
    debt_to_assets_ratio: number;
    working_capital: number;
    working_capital_ratio: number;
    asset_turnover: number;
    equity_multiplier: number;
  };
}

interface BalanceSheetViewProps {
  data?: BalanceSheetData;
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

const formatRatio = (value: number): string => {
  return value.toFixed(2);
};

const BalanceSheetView: React.FC<BalanceSheetViewProps> = ({
  data,
  isLoading = false,
  onRefresh,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['current_assets', 'current_liabilities', 'equity'])
  );

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
          <CardTitle>Balance Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(10)].map((_, i) => (
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
          <CardTitle>Balance Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No balance sheet data available</p>
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
    isNegative?: boolean;
  }> = ({ label, value, isTotal = false, isSubtotal = false, indent = 0, isNegative = false }) => (
    <div
      className={`flex justify-between items-center py-2 px-4 ${
        isTotal ? 'font-bold bg-blue-50 border-t-2 border-b-2 border-blue-200' : 
        isSubtotal ? 'font-semibold bg-gray-50 border-t' : ''
      }`}
      style={{ paddingLeft: `${16 + indent * 16}px` }}
    >
      <span className={isTotal ? 'text-lg' : isSubtotal ? 'text-md font-medium' : 'text-sm'}>
        {label}
      </span>
      <span className={`${isTotal ? 'text-lg font-bold' : 'font-medium'} ${
        isNegative ? 'text-red-600' : 'text-gray-900'
      }`}>
        {isNegative ? `(${formatCurrency(Math.abs(value))})` : formatCurrency(value)}
      </span>
    </div>
  );

  const ExpandableSection: React.FC<{
    title: string;
    sectionKey: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
  }> = ({ title, sectionKey, children, icon }) => (
    <div className="border rounded-lg">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <BarChart3 
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
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-6 h-6" />
            <span>Balance Sheet</span>
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
          {/* ASSETS SECTION */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-600 border-b-2 border-blue-200 pb-2">
              ASSETS
            </h2>

            {/* Current Assets */}
            <ExpandableSection 
              title="Current Assets" 
              sectionKey="current_assets"
              icon={<CreditCard className="w-5 h-5 text-green-600" />}
            >
              {/* Cash & Cash Equivalents */}
              <div className="bg-green-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Cash & Cash Equivalents</h4>
                <LineItem label="Cash" value={data.assets.current_assets.cash} indent={2} />
                <LineItem label="Cash Equivalents" value={data.assets.current_assets.cash_equivalents} indent={2} />
                <LineItem label="Marketable Securities" value={data.assets.current_assets.marketable_securities} indent={2} />
                <LineItem label="Restricted Cash" value={data.assets.current_assets.restricted_cash} indent={2} />
                <LineItem 
                  label="Total Cash & Equivalents" 
                  value={data.assets.current_assets.total_cash_and_equivalents} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              {/* Accounts Receivable */}
              <div className="bg-blue-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Accounts Receivable</h4>
                <LineItem label="Accounts Receivable" value={data.assets.current_assets.accounts_receivable} indent={2} />
                <LineItem 
                  label="Allowance for Doubtful Accounts" 
                  value={data.assets.current_assets.allowance_for_doubtful_accounts} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Net Accounts Receivable" 
                  value={data.assets.current_assets.net_accounts_receivable} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              {/* Inventory */}
              <div className="bg-yellow-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Inventory</h4>
                <LineItem label="Raw Materials" value={data.assets.current_assets.raw_materials} indent={2} />
                <LineItem label="Work in Progress" value={data.assets.current_assets.work_in_progress} indent={2} />
                <LineItem label="Finished Goods" value={data.assets.current_assets.finished_goods} indent={2} />
                <LineItem 
                  label="Total Inventory" 
                  value={data.assets.current_assets.total_inventory} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              {/* Other Current Assets */}
              <LineItem label="Prepaid Expenses" value={data.assets.current_assets.prepaid_expenses} indent={1} />
              <LineItem label="Other Receivables" value={data.assets.current_assets.other_receivables} indent={1} />
              <LineItem label="Deferred Tax Assets" value={data.assets.current_assets.deferred_tax_assets_current} indent={1} />
              <LineItem label="Other Current Assets" value={data.assets.current_assets.other_current_assets} indent={1} />

              <LineItem 
                label="Total Current Assets" 
                value={data.assets.current_assets.total_current_assets} 
                isTotal={true} 
              />
            </ExpandableSection>

            {/* Non-Current Assets */}
            <ExpandableSection 
              title="Non-Current Assets" 
              sectionKey="non_current_assets"
              icon={<Building className="w-5 h-5 text-blue-600" />}
            >
              {/* Property, Plant & Equipment */}
              <div className="bg-blue-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Property, Plant & Equipment</h4>
                <LineItem label="Land" value={data.assets.non_current_assets.property_plant_equipment.land} indent={2} />
                <LineItem label="Buildings" value={data.assets.non_current_assets.property_plant_equipment.buildings} indent={2} />
                <LineItem label="Machinery & Equipment" value={data.assets.non_current_assets.property_plant_equipment.machinery_and_equipment} indent={2} />
                <LineItem label="Vehicles" value={data.assets.non_current_assets.property_plant_equipment.vehicles} indent={2} />
                <LineItem label="Computer Equipment" value={data.assets.non_current_assets.property_plant_equipment.computer_equipment} indent={2} />
                <LineItem label="Furniture & Fixtures" value={data.assets.non_current_assets.property_plant_equipment.furniture_and_fixtures} indent={2} />
                <LineItem label="Leasehold Improvements" value={data.assets.non_current_assets.property_plant_equipment.leasehold_improvements} indent={2} />
                <LineItem label="Construction in Progress" value={data.assets.non_current_assets.property_plant_equipment.construction_in_progress} indent={2} />
                <LineItem 
                  label="Total PP&E (Gross)" 
                  value={data.assets.non_current_assets.property_plant_equipment.total_pp_e} 
                  indent={1} 
                  isSubtotal={true} 
                />

                <h5 className="font-medium text-gray-600 mt-3 mb-2">Less: Accumulated Depreciation</h5>
                <LineItem 
                  label="Buildings Depreciation" 
                  value={data.assets.non_current_assets.accumulated_depreciation.buildings_depreciation} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Machinery Depreciation" 
                  value={data.assets.non_current_assets.accumulated_depreciation.machinery_depreciation} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Vehicles Depreciation" 
                  value={data.assets.non_current_assets.accumulated_depreciation.vehicles_depreciation} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Computer Depreciation" 
                  value={data.assets.non_current_assets.accumulated_depreciation.computer_depreciation} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Furniture Depreciation" 
                  value={data.assets.non_current_assets.accumulated_depreciation.furniture_depreciation} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Leasehold Depreciation" 
                  value={data.assets.non_current_assets.accumulated_depreciation.leasehold_depreciation} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Total Accumulated Depreciation" 
                  value={data.assets.non_current_assets.accumulated_depreciation.total_accumulated_depreciation} 
                  indent={1} 
                  isSubtotal={true}
                  isNegative={true}
                />

                <LineItem 
                  label="Net Property, Plant & Equipment" 
                  value={data.assets.non_current_assets.net_property_plant_equipment} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              {/* Intangible Assets */}
              <div className="bg-purple-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Intangible Assets</h4>
                <LineItem label="Goodwill" value={data.assets.non_current_assets.intangible_assets.goodwill} indent={2} />
                <LineItem label="Patents" value={data.assets.non_current_assets.intangible_assets.patents} indent={2} />
                <LineItem label="Trademarks" value={data.assets.non_current_assets.intangible_assets.trademarks} indent={2} />
                <LineItem label="Software" value={data.assets.non_current_assets.intangible_assets.software} indent={2} />
                <LineItem label="Licenses" value={data.assets.non_current_assets.intangible_assets.licenses} indent={2} />
                <LineItem label="Customer Relationships" value={data.assets.non_current_assets.intangible_assets.customer_relationships} indent={2} />
                <LineItem label="Other Intangibles" value={data.assets.non_current_assets.intangible_assets.other_intangibles} indent={2} />
                <LineItem 
                  label="Total Intangible Assets (Gross)" 
                  value={data.assets.non_current_assets.intangible_assets.total_intangible_assets} 
                  indent={1} 
                  isSubtotal={true} 
                />

                <h5 className="font-medium text-gray-600 mt-3 mb-2">Less: Accumulated Amortization</h5>
                <LineItem 
                  label="Patents Amortization" 
                  value={data.assets.non_current_assets.accumulated_amortization.patents_amortization} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Trademarks Amortization" 
                  value={data.assets.non_current_assets.accumulated_amortization.trademarks_amortization} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Software Amortization" 
                  value={data.assets.non_current_assets.accumulated_amortization.software_amortization} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Licenses Amortization" 
                  value={data.assets.non_current_assets.accumulated_amortization.licenses_amortization} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Customer Relationships Amortization" 
                  value={data.assets.non_current_assets.accumulated_amortization.customer_relationships_amortization} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Other Amortization" 
                  value={data.assets.non_current_assets.accumulated_amortization.other_amortization} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Total Accumulated Amortization" 
                  value={data.assets.non_current_assets.accumulated_amortization.total_accumulated_amortization} 
                  indent={1} 
                  isSubtotal={true}
                  isNegative={true}
                />

                <LineItem 
                  label="Net Intangible Assets" 
                  value={data.assets.non_current_assets.net_intangible_assets} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              {/* Other Non-Current Assets */}
              <div className="bg-gray-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Other Non-Current Assets</h4>
                <LineItem label="Long-term Investments" value={data.assets.non_current_assets.other_non_current_assets.long_term_investments} indent={2} />
                <LineItem label="Deferred Tax Assets" value={data.assets.non_current_assets.other_non_current_assets.deferred_tax_assets_non_current} indent={2} />
                <LineItem label="Other Long-term Assets" value={data.assets.non_current_assets.other_non_current_assets.other_long_term_assets} indent={2} />
                <LineItem 
                  label="Total Other Non-Current Assets" 
                  value={data.assets.non_current_assets.other_non_current_assets.total_other_non_current_assets} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              <LineItem 
                label="Total Non-Current Assets" 
                value={data.assets.non_current_assets.total_non_current_assets} 
                isTotal={true} 
              />
            </ExpandableSection>

            <LineItem 
              label="TOTAL ASSETS" 
              value={data.assets.total_assets} 
              isTotal={true} 
            />
          </div>

          {/* LIABILITIES AND EQUITY SECTION */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-600 border-b-2 border-red-200 pb-2">
              LIABILITIES AND EQUITY
            </h2>

            {/* Current Liabilities */}
            <ExpandableSection 
              title="Current Liabilities" 
              sectionKey="current_liabilities"
              icon={<CreditCard className="w-5 h-5 text-red-600" />}
            >
              <LineItem label="Accounts Payable" value={data.liabilities.current_liabilities.accounts_payable} indent={1} />

              {/* Short-term Debt */}
              <div className="bg-red-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Short-term Debt</h4>
                <LineItem label="Bank Overdrafts" value={data.liabilities.current_liabilities.short_term_debt.bank_overdrafts} indent={2} />
                <LineItem label="Short-term Loans" value={data.liabilities.current_liabilities.short_term_debt.short_term_loans} indent={2} />
                <LineItem label="Current Portion of Long-term Debt" value={data.liabilities.current_liabilities.short_term_debt.current_portion_long_term_debt} indent={2} />
                <LineItem label="Credit Line Utilization" value={data.liabilities.current_liabilities.short_term_debt.credit_line_utilization} indent={2} />
                <LineItem 
                  label="Total Short-term Debt" 
                  value={data.liabilities.current_liabilities.short_term_debt.total_short_term_debt} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              {/* Accrued Expenses */}
              <div className="bg-orange-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Accrued Expenses</h4>
                <LineItem label="Accrued Salaries" value={data.liabilities.current_liabilities.accrued_expenses.accrued_salaries} indent={2} />
                <LineItem label="Accrued Taxes" value={data.liabilities.current_liabilities.accrued_expenses.accrued_taxes} indent={2} />
                <LineItem label="Accrued Interest" value={data.liabilities.current_liabilities.accrued_expenses.accrued_interest} indent={2} />
                <LineItem label="Accrued Utilities" value={data.liabilities.current_liabilities.accrued_expenses.accrued_utilities} indent={2} />
                <LineItem label="Other Accrued Expenses" value={data.liabilities.current_liabilities.accrued_expenses.other_accrued_expenses} indent={2} />
                <LineItem 
                  label="Total Accrued Expenses" 
                  value={data.liabilities.current_liabilities.accrued_expenses.total_accrued_expenses} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              {/* Other Current Liabilities */}
              <div className="bg-yellow-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Other Current Liabilities</h4>
                <LineItem label="Deferred Revenue" value={data.liabilities.current_liabilities.other_current_liabilities.deferred_revenue} indent={2} />
                <LineItem label="Income Taxes Payable" value={data.liabilities.current_liabilities.other_current_liabilities.income_taxes_payable} indent={2} />
                <LineItem label="Dividends Payable" value={data.liabilities.current_liabilities.other_current_liabilities.dividends_payable} indent={2} />
                <LineItem label="Other Current Liabilities" value={data.liabilities.current_liabilities.other_current_liabilities.other_current_liabilities} indent={2} />
                <LineItem 
                  label="Total Other Current Liabilities" 
                  value={data.liabilities.current_liabilities.other_current_liabilities.total_other_current_liabilities} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              <LineItem 
                label="Total Current Liabilities" 
                value={data.liabilities.current_liabilities.total_current_liabilities} 
                isTotal={true} 
              />
            </ExpandableSection>

            {/* Non-Current Liabilities */}
            <ExpandableSection 
              title="Non-Current Liabilities" 
              sectionKey="non_current_liabilities"
              icon={<Building className="w-5 h-5 text-red-600" />}
            >
              {/* Long-term Debt */}
              <div className="bg-red-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Long-term Debt</h4>
                <LineItem label="Term Loans" value={data.liabilities.non_current_liabilities.long_term_debt.term_loans} indent={2} />
                <LineItem label="Bonds Payable" value={data.liabilities.non_current_liabilities.long_term_debt.bonds_payable} indent={2} />
                <LineItem label="Mortgage Payable" value={data.liabilities.non_current_liabilities.long_term_debt.mortgage_payable} indent={2} />
                <LineItem label="Capital Leases" value={data.liabilities.non_current_liabilities.long_term_debt.capital_leases} indent={2} />
                <LineItem label="Other Long-term Debt" value={data.liabilities.non_current_liabilities.long_term_debt.other_long_term_debt} indent={2} />
                <LineItem 
                  label="Total Long-term Debt" 
                  value={data.liabilities.non_current_liabilities.long_term_debt.total_long_term_debt} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              <LineItem label="Deferred Tax Liabilities" value={data.liabilities.non_current_liabilities.deferred_tax_liabilities} indent={1} />

              {/* Other Non-Current Liabilities */}
              <div className="bg-gray-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Other Non-Current Liabilities</h4>
                <LineItem label="Pension Liabilities" value={data.liabilities.non_current_liabilities.other_non_current_liabilities.pension_liabilities} indent={2} />
                <LineItem label="Warranty Liabilities" value={data.liabilities.non_current_liabilities.other_non_current_liabilities.warranty_liabilities} indent={2} />
                <LineItem label="Environmental Liabilities" value={data.liabilities.non_current_liabilities.other_non_current_liabilities.environmental_liabilities} indent={2} />
                <LineItem label="Other Long-term Liabilities" value={data.liabilities.non_current_liabilities.other_non_current_liabilities.other_long_term_liabilities} indent={2} />
                <LineItem 
                  label="Total Other Non-Current Liabilities" 
                  value={data.liabilities.non_current_liabilities.other_non_current_liabilities.total_other_non_current_liabilities} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              <LineItem 
                label="Total Non-Current Liabilities" 
                value={data.liabilities.non_current_liabilities.total_non_current_liabilities} 
                isTotal={true} 
              />
            </ExpandableSection>

            <LineItem 
              label="TOTAL LIABILITIES" 
              value={data.liabilities.total_liabilities} 
              isTotal={true} 
            />

            {/* Equity Section */}
            <ExpandableSection 
              title="Equity" 
              sectionKey="equity"
              icon={<PieChart className="w-5 h-5 text-green-600" />}
            >
              {/* Share Capital */}
              <div className="bg-green-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Share Capital</h4>
                <LineItem label="Common Stock" value={data.equity.share_capital.common_stock} indent={2} />
                <LineItem label="Preferred Stock" value={data.equity.share_capital.preferred_stock} indent={2} />
                <LineItem 
                  label="Treasury Stock" 
                  value={data.equity.share_capital.treasury_stock} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem label="Additional Paid-in Capital" value={data.equity.share_capital.additional_paid_in_capital} indent={2} />
                <LineItem 
                  label="Total Share Capital" 
                  value={data.equity.share_capital.total_share_capital} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              {/* Retained Earnings */}
              <div className="bg-blue-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Retained Earnings</h4>
                <LineItem label="Beginning Retained Earnings" value={data.equity.retained_earnings.beginning_retained_earnings} indent={2} />
                <LineItem label="Net Income" value={data.equity.retained_earnings.net_income} indent={2} />
                <LineItem 
                  label="Dividends Paid" 
                  value={data.equity.retained_earnings.dividends_paid} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Stock Repurchases" 
                  value={data.equity.retained_earnings.stock_repurchases} 
                  indent={2}
                  isNegative={true}
                />
                <LineItem 
                  label="Ending Retained Earnings" 
                  value={data.equity.retained_earnings.ending_retained_earnings} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              {/* Other Equity */}
              <div className="bg-purple-25 p-2">
                <h4 className="font-medium text-gray-700 mb-2">Other Equity</h4>
                <LineItem label="Accumulated Other Comprehensive Income" value={data.equity.other_equity.accumulated_other_comprehensive_income} indent={2} />
                <LineItem label="Foreign Currency Translation" value={data.equity.other_equity.foreign_currency_translation} indent={2} />
                <LineItem label="Unrealized Gains/Losses" value={data.equity.other_equity.unrealized_gains_losses} indent={2} />
                <LineItem label="Other Equity Adjustments" value={data.equity.other_equity.other_equity_adjustments} indent={2} />
                <LineItem 
                  label="Total Other Equity" 
                  value={data.equity.other_equity.total_other_equity} 
                  indent={1} 
                  isSubtotal={true} 
                />
              </div>

              <LineItem label="Non-Controlling Interest" value={data.equity.non_controlling_interest} indent={1} />

              <LineItem 
                label="Total Equity" 
                value={data.equity.total_equity} 
                isTotal={true} 
              />
            </ExpandableSection>

            <LineItem 
              label="TOTAL LIABILITIES AND EQUITY" 
              value={data.liabilities.total_liabilities + data.equity.total_equity} 
              isTotal={true} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Balance Sheet Metrics */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6" />
            <span>Key Balance Sheet Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <h4 className="text-sm font-medium text-gray-600">Current Ratio</h4>
              <p className="text-2xl font-bold text-green-600">
                {formatRatio(data.balance_sheet_metrics.current_ratio)}
              </p>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium text-gray-600">Quick Ratio</h4>
              <p className="text-2xl font-bold text-blue-600">
                {formatRatio(data.balance_sheet_metrics.quick_ratio)}
              </p>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium text-gray-600">Debt-to-Equity</h4>
              <p className="text-2xl font-bold text-red-600">
                {formatRatio(data.balance_sheet_metrics.debt_to_equity_ratio)}
              </p>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium text-gray-600">Debt-to-Assets</h4>
              <p className="text-2xl font-bold text-orange-600">
                {formatRatio(data.balance_sheet_metrics.debt_to_assets_ratio)}
              </p>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium text-gray-600">Working Capital</h4>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(data.balance_sheet_metrics.working_capital)}
              </p>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium text-gray-600">Asset Turnover</h4>
              <p className="text-2xl font-bold text-indigo-600">
                {formatRatio(data.balance_sheet_metrics.asset_turnover)}
              </p>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium text-gray-600">Equity Multiplier</h4>
              <p className="text-2xl font-bold text-pink-600">
                {formatRatio(data.balance_sheet_metrics.equity_multiplier)}
              </p>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium text-gray-600">WC Ratio</h4>
              <p className="text-2xl font-bold text-teal-600">
                {formatRatio(data.balance_sheet_metrics.working_capital_ratio)}
              </p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceSheetView;