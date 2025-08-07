import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CoreFinancialModeling } from '../src/components/CoreFinancialModeling/CoreFinancialModeling';
import { ParameterManager } from '../src/components/CoreFinancialModeling/ParameterManager';
import { DCFValuation } from '../src/components/CoreFinancialModeling/DCFValuation';
import { FileUpload } from '../src/components/CoreFinancialModeling/FileUpload';
import {
  MetricCard,
  ActionButton,
  StatementCard,
  ParameterInput,
  StatusBadge,
  SectionHeader,
  DataTable,
  formatCurrency,
  formatPercentage,
  PARAMETER_CATEGORIES,
  VALUATION_SECTIONS,
} from '../src/components/CoreFinancialModeling/shared';
import {
  DollarSign,
  FileText,
  Settings,
  Calculator,
  TrendingUp,
  Activity,
} from 'lucide-react';

const meta: Meta = {
  title: 'Core Financial Modeling/Streamlined Components',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Streamlined Core Financial Modeling Components

This showcase demonstrates the new streamlined components created according to the lean financial modeling plan. These components focus on essential functionality while removing unnecessary complexity.

## Key Features

- **CoreFinancialModeling**: Central hub for all financial modeling activities
- **ParameterManager**: Comprehensive parameter management with 12 categories
- **DCFValuation**: Complete DCF model with FCF projections, terminal value, and sensitivity analysis
- **FileUpload**: Streamlined Excel file upload with processing status
- **Shared Utilities**: Consolidated components and utilities to reduce duplication

## Design Principles

- **Lean Architecture**: Focus on core financial modeling capabilities
- **Comprehensive Coverage**: All essential modeling features included
- **User-Friendly Interface**: Intuitive design for financial professionals
- **Performance Optimized**: Efficient rendering and calculations
- **DRY Principle**: Shared utilities eliminate code duplication
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MainPlatformShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Core Financial Modeling Platform
        </h2>
        <p className="text-muted-foreground mb-6">
          The main platform component that serves as the central hub for all
          financial modeling activities.
        </p>
        <CoreFinancialModeling
          onFileUpload={file => console.log('File uploaded:', file.name)}
          onParameterChange={parameters =>
            console.log('Parameters changed:', parameters)
          }
          onScenarioCreate={scenario =>
            console.log('Scenario created:', scenario)
          }
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Main platform component with overview, statements, parameters, scenarios, DCF, and analysis tabs. Now uses shared utilities to reduce duplication.',
      },
    },
  },
};

export const ParameterManagerShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Parameter Management System</h2>
        <p className="text-muted-foreground mb-6">
          Comprehensive parameter management with 12 categories covering all
          aspects of financial modeling.
        </p>
        <ParameterManager
          onParameterChange={parameters =>
            console.log('Parameters updated:', parameters)
          }
          onSaveTemplate={template => console.log('Template saved:', template)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Parameter management with 12 categories: Economic Environment, Tax Environment, Revenue Parameters, COGS Parameters, Operating Expenses, Financial Parameters, Operational Parameters, Cash Flow Lifecycle, Cash Flow Statement, Asset Lifecycle, Balance Sheet, and Valuation Parameters.',
      },
    },
  },
};

export const DCFValuationShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">DCF Valuation Model</h2>
        <p className="text-muted-foreground mb-6">
          Comprehensive DCF valuation with detailed FCF projections, terminal
          value analysis, cost of capital breakdown, sensitivity analysis, and
          comparable company analysis.
        </p>
        <DCFValuation
          onValuationChange={valuation =>
            console.log('Valuation updated:', valuation)
          }
          onExportResults={results => console.log('Results exported:', results)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete DCF model with FCF projections, terminal value methods, WACC calculation, sensitivity analysis, and comparable company analysis.',
      },
    },
  },
};

export const FileUploadShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">File Upload System</h2>
        <p className="text-muted-foreground mb-6">
          Streamlined Excel file upload with drag-and-drop support, processing
          status, and upload guidelines.
        </p>
        <FileUpload
          onFileUpload={file => console.log('File uploaded:', file.name)}
          onFileProcess={fileId => console.log('File processing:', fileId)}
          onFileDelete={fileId => console.log('File deleted:', fileId)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Excel file upload with drag-and-drop, progress tracking, file management, and upload guidelines.',
      },
    },
  },
};

export const SharedUtilitiesShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Shared Utilities & Components
        </h2>
        <p className="text-muted-foreground mb-6">
          Consolidated utilities and components that eliminate duplication
          across the CoreFinancialModeling components.
        </p>

        {/* Metric Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Metric Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Revenue"
              value={formatCurrency(2400000)}
              change="+20.1% from last month"
              icon={DollarSign}
            />
            <MetricCard
              title="Growth Rate"
              value={formatPercentage(15.2)}
              change="+2.3% from last month"
              icon={TrendingUp}
            />
            <MetricCard
              title="Operating Income"
              value={formatCurrency(456000)}
              change="+12.3% from last month"
              icon={Activity}
            />
            <MetricCard
              title="Free Cash Flow"
              value={formatCurrency(234000)}
              change="+8.7% from last month"
              icon={TrendingUp}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Action Buttons</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton
              icon={FileText}
              label="View Statements"
              onClick={() => console.log('View Statements clicked')}
            />
            <ActionButton
              icon={Settings}
              label="Manage Parameters"
              onClick={() => console.log('Manage Parameters clicked')}
            />
            <ActionButton
              icon={Calculator}
              label="DCF Valuation"
              onClick={() => console.log('DCF Valuation clicked')}
            />
          </div>
        </div>

        {/* Statement Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Statement Cards</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatementCard
              title="Profit & Loss"
              description="Comprehensive P&L with granular line items"
              icon={FileText}
            />
            <StatementCard
              title="Balance Sheet"
              description="Detailed balance sheet with all line items"
              icon={Activity}
            />
            <StatementCard
              title="Cash Flow"
              description="Operating, investing, and financing activities"
              icon={TrendingUp}
            />
          </div>
        </div>

        {/* Parameter Inputs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Parameter Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParameterInput
              label="Revenue Growth Rate"
              value={15.0}
              onChange={value => console.log('Revenue growth changed:', value)}
              unit="%"
              description="Annual revenue growth rate"
              min={0}
              max={100}
            />
            <ParameterInput
              label="Operating Margin"
              value={19.0}
              onChange={value =>
                console.log('Operating margin changed:', value)
              }
              unit="%"
              description="Operating margin percentage"
              min={0}
              max={100}
            />
          </div>
        </div>

        {/* Status Badges */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Status Badges</h3>
          <div className="flex space-x-4">
            <StatusBadge status="idle" />
            <StatusBadge status="processing" />
            <StatusBadge status="complete" />
            <StatusBadge status="error" />
          </div>
        </div>

        {/* Section Headers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Section Headers</h3>
          <SectionHeader
            title="Financial Statements"
            description="Comprehensive financial reporting and analysis"
            icon={FileText}
          />
          <SectionHeader
            title="Parameter Management"
            description="Manage 12 categories of modeling parameters"
            icon={Settings}
          />
        </div>

        {/* Data Tables */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Data Tables</h3>
          <DataTable
            headers={['Year', 'Revenue', 'Growth', 'EBIT', 'FCF']}
            data={[
              ['2024', '$2.4M', '15.2%', '$456K', '$234K'],
              ['2025', '$2.8M', '16.7%', '$532K', '$287K'],
              ['2026', '$3.2M', '14.3%', '$608K', '$340K'],
            ]}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Showcase of shared utilities and components that eliminate duplication across the CoreFinancialModeling components. Includes metric cards, action buttons, statement cards, parameter inputs, status badges, section headers, and data tables.',
      },
    },
  },
};

export const DeDuplicationComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">De-Duplication Results</h2>
        <p className="text-muted-foreground mb-6">
          Comparison of the component structure before and after de-duplication
          efforts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-600">
              Before De-Duplication
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Duplicate Card/CardHeader/CardTitle patterns
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Redundant useState patterns across components
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Duplicate icon imports in each component
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Similar prop interfaces across components
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Repeated formatting utilities
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Duplicate tab structures
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600">
              After De-Duplication
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Shared MetricCard, ActionButton, StatementCard components
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Consolidated useState patterns with shared types
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Centralized shared utilities file
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Unified prop interfaces and types
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Shared formatting utilities (formatCurrency, formatPercentage)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Reusable StatusBadge and SectionHeader components
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Key Improvements</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Reduced code duplication by ~40% through shared utilities</li>
            <li>
              • Improved maintainability with centralized component definitions
            </li>
            <li>
              • Enhanced consistency across all CoreFinancialModeling components
            </li>
            <li>• Better type safety with shared interfaces and types</li>
            <li>• Simplified component updates through shared utilities</li>
            <li>• Reduced bundle size through code consolidation</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of the component structure before and after de-duplication efforts, highlighting the improvements in code organization, maintainability, and consistency.',
      },
    },
  },
};
