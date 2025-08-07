/**
 * Comprehensive Profit & Loss Statement View
 * Based on lean financial modeling plan - detailed P&L breakdown
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

interface ProfitLossData {
  // Revenue Section
  revenue: {
    product_revenue: number;
    service_revenue: number;
    licensing_revenue: number;
    royalty_revenue: number;
    interest_income: number;
    other_revenue: number;
    total_revenue: number;
  };

  // Cost of Goods Sold Section
  cost_of_goods_sold: {
    direct_materials: number;
    direct_labor: number;
    manufacturing_overhead: number;
    freight_and_delivery: number;
    quality_control: number;
    warranty_costs: number;
    total_cogs: number;
  };

  // Gross Profit
  gross_profit: number;
  gross_margin_percentage: number;

  // Operating Expenses
  operating_expenses: {
    // Sales & Marketing
    sales_commission: number;
    marketing_spend: number;
    advertising: number;
    trade_shows: number;
    sales_team_salaries: number;
    total_sales_marketing: number;

    // Research & Development
    rnd_salaries: number;
    rnd_equipment: number;
    rnd_outsourcing: number;
    total_rnd: number;

    // General & Administrative
    executive_salaries: number;
    admin_salaries: number;
    office_rent: number;
    utilities: number;
    insurance: number;
    legal_fees: number;
    accounting_fees: number;
    it_infrastructure: number;
    travel_expenses: number;
    training: number;
    total_general_admin: number;

    total_operating_expenses: number;
  };

  // Operating Income
  operating_income: number;
  operating_margin_percentage: number;

  // Other Income/Expense
  other_income_expense: {
    interest_expense: number;
    interest_income: number;
    foreign_exchange_gain_loss: number;
    hedging_costs: number;
    other_income: number;
    other_expense: number;
    total_other_income_expense: number;
  };

  // Income Before Tax
  income_before_tax: number;

  // Tax Section
  taxes: {
    current_tax_expense: number;
    deferred_tax_expense: number;
    tax_credits: number;
    total_tax_expense: number;
    effective_tax_rate: number;
  };

  // Net Income
  net_income: number;
  net_margin_percentage: number;

  // Earnings Per Share
  earnings_per_share: number;
  diluted_earnings_per_share: number;
}

interface ProfitLossViewProps {
  data?: ProfitLossData;
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

const ProfitLossView: React.FC<ProfitLossViewProps> = ({
  data,
  isLoading = false,
  onRefresh,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['revenue', 'cogs', 'opex']));

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
          <CardTitle>Profit & Loss Statement</CardTitle>
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
          <CardTitle>Profit & Loss Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No financial data available</p>
        </CardContent>
      </Card>
    );
  }

  const LineItem: React.FC<{
    label: string;
    value: number;
    percentage?: number;
    isTotal?: boolean;
    isSubtotal?: boolean;
    indent?: number;
  }> = ({ label, value, percentage, isTotal = false, isSubtotal = false, indent = 0 }) => (
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
        {percentage !== undefined && (
          <span className="text-sm text-gray-500 w-16 text-right">
            {formatPercentage(percentage)}
          </span>
        )}
        {value > 0 && (
          <TrendingUp className="w-4 h-4 text-green-500" />
        )}
        {value < 0 && (
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-6 h-6" />
          <span>Profit & Loss Statement</span>
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
        {/* Revenue Section */}
        <ExpandableSection title="Revenue" sectionKey="revenue">
          <LineItem label="Product Revenue" value={data.revenue.product_revenue} indent={1} />
          <LineItem label="Service Revenue" value={data.revenue.service_revenue} indent={1} />
          <LineItem label="Licensing Revenue" value={data.revenue.licensing_revenue} indent={1} />
          <LineItem label="Royalty Revenue" value={data.revenue.royalty_revenue} indent={1} />
          <LineItem label="Interest Income" value={data.revenue.interest_income} indent={1} />
          <LineItem label="Other Revenue" value={data.revenue.other_revenue} indent={1} />
          <LineItem 
            label="Total Revenue" 
            value={data.revenue.total_revenue} 
            isSubtotal={true}
          />
        </ExpandableSection>

        {/* Cost of Goods Sold Section */}
        <ExpandableSection title="Cost of Goods Sold" sectionKey="cogs">
          <LineItem label="Direct Materials" value={data.cost_of_goods_sold.direct_materials} indent={1} />
          <LineItem label="Direct Labor" value={data.cost_of_goods_sold.direct_labor} indent={1} />
          <LineItem label="Manufacturing Overhead" value={data.cost_of_goods_sold.manufacturing_overhead} indent={1} />
          <LineItem label="Freight & Delivery" value={data.cost_of_goods_sold.freight_and_delivery} indent={1} />
          <LineItem label="Quality Control" value={data.cost_of_goods_sold.quality_control} indent={1} />
          <LineItem label="Warranty Costs" value={data.cost_of_goods_sold.warranty_costs} indent={1} />
          <LineItem 
            label="Total COGS" 
            value={data.cost_of_goods_sold.total_cogs}
            isSubtotal={true}
          />
        </ExpandableSection>

        {/* Gross Profit */}
        <LineItem 
          label="Gross Profit" 
          value={data.gross_profit}
          percentage={data.gross_margin_percentage}
          isTotal={true}
        />

        {/* Operating Expenses Section */}
        <ExpandableSection title="Operating Expenses" sectionKey="opex">
          {/* Sales & Marketing */}
          <div className="bg-gray-50 p-2">
            <h4 className="font-medium text-gray-700 mb-2">Sales & Marketing</h4>
            <LineItem label="Sales Commission" value={data.operating_expenses.sales_commission} indent={2} />
            <LineItem label="Marketing Spend" value={data.operating_expenses.marketing_spend} indent={2} />
            <LineItem label="Advertising" value={data.operating_expenses.advertising} indent={2} />
            <LineItem label="Trade Shows" value={data.operating_expenses.trade_shows} indent={2} />
            <LineItem label="Sales Team Salaries" value={data.operating_expenses.sales_team_salaries} indent={2} />
            <LineItem label="Total Sales & Marketing" value={data.operating_expenses.total_sales_marketing} indent={1} isSubtotal={true} />
          </div>

          {/* Research & Development */}
          <div className="bg-gray-50 p-2">
            <h4 className="font-medium text-gray-700 mb-2">Research & Development</h4>
            <LineItem label="R&D Salaries" value={data.operating_expenses.rnd_salaries} indent={2} />
            <LineItem label="R&D Equipment" value={data.operating_expenses.rnd_equipment} indent={2} />
            <LineItem label="R&D Outsourcing" value={data.operating_expenses.rnd_outsourcing} indent={2} />
            <LineItem label="Total R&D" value={data.operating_expenses.total_rnd} indent={1} isSubtotal={true} />
          </div>

          {/* General & Administrative */}
          <div className="bg-gray-50 p-2">
            <h4 className="font-medium text-gray-700 mb-2">General & Administrative</h4>
            <LineItem label="Executive Salaries" value={data.operating_expenses.executive_salaries} indent={2} />
            <LineItem label="Admin Salaries" value={data.operating_expenses.admin_salaries} indent={2} />
            <LineItem label="Office Rent" value={data.operating_expenses.office_rent} indent={2} />
            <LineItem label="Utilities" value={data.operating_expenses.utilities} indent={2} />
            <LineItem label="Insurance" value={data.operating_expenses.insurance} indent={2} />
            <LineItem label="Legal Fees" value={data.operating_expenses.legal_fees} indent={2} />
            <LineItem label="Accounting Fees" value={data.operating_expenses.accounting_fees} indent={2} />
            <LineItem label="IT Infrastructure" value={data.operating_expenses.it_infrastructure} indent={2} />
            <LineItem label="Travel Expenses" value={data.operating_expenses.travel_expenses} indent={2} />
            <LineItem label="Training" value={data.operating_expenses.training} indent={2} />
            <LineItem label="Total G&A" value={data.operating_expenses.total_general_admin} indent={1} isSubtotal={true} />
          </div>

          <LineItem 
            label="Total Operating Expenses" 
            value={data.operating_expenses.total_operating_expenses}
            isSubtotal={true}
          />
        </ExpandableSection>

        {/* Operating Income */}
        <LineItem 
          label="Operating Income" 
          value={data.operating_income}
          percentage={data.operating_margin_percentage}
          isTotal={true}
        />

        {/* Other Income/Expense */}
        <ExpandableSection title="Other Income/Expense" sectionKey="other">
          <LineItem label="Interest Expense" value={data.other_income_expense.interest_expense} indent={1} />
          <LineItem label="Interest Income" value={data.other_income_expense.interest_income} indent={1} />
          <LineItem label="FX Gain/Loss" value={data.other_income_expense.foreign_exchange_gain_loss} indent={1} />
          <LineItem label="Hedging Costs" value={data.other_income_expense.hedging_costs} indent={1} />
          <LineItem label="Other Income" value={data.other_income_expense.other_income} indent={1} />
          <LineItem label="Other Expense" value={data.other_income_expense.other_expense} indent={1} />
          <LineItem 
            label="Total Other Income/Expense" 
            value={data.other_income_expense.total_other_income_expense}
            isSubtotal={true}
          />
        </ExpandableSection>

        {/* Income Before Tax */}
        <LineItem 
          label="Income Before Tax" 
          value={data.income_before_tax}
          isTotal={true}
        />

        {/* Tax Section */}
        <ExpandableSection title="Taxes" sectionKey="taxes">
          <LineItem label="Current Tax Expense" value={data.taxes.current_tax_expense} indent={1} />
          <LineItem label="Deferred Tax Expense" value={data.taxes.deferred_tax_expense} indent={1} />
          <LineItem label="Tax Credits" value={-data.taxes.tax_credits} indent={1} />
          <LineItem 
            label="Total Tax Expense" 
            value={data.taxes.total_tax_expense}
            percentage={data.taxes.effective_tax_rate}
            isSubtotal={true}
          />
        </ExpandableSection>

        {/* Net Income */}
        <LineItem 
          label="Net Income" 
          value={data.net_income}
          percentage={data.net_margin_percentage}
          isTotal={true}
        />

        {/* Earnings Per Share */}
        <div className="border rounded-lg p-4 bg-blue-50">
          <h3 className="font-semibold text-lg mb-3">Earnings Per Share</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Basic EPS</p>
              <p className="text-2xl font-bold text-blue-600">
                ${data.earnings_per_share.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Diluted EPS</p>
              <p className="text-2xl font-bold text-blue-600">
                ${data.diluted_earnings_per_share.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600">Gross Margin</h4>
            <p className="text-2xl font-bold text-green-600">
              {formatPercentage(data.gross_margin_percentage)}
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600">Operating Margin</h4>
            <p className="text-2xl font-bold text-blue-600">
              {formatPercentage(data.operating_margin_percentage)}
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600">Net Margin</h4>
            <p className="text-2xl font-bold text-purple-600">
              {formatPercentage(data.net_margin_percentage)}
            </p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitLossView;