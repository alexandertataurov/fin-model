import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: '🏗️ Application Structure/💰 Financial Modeling',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Comprehensive financial modeling and valuation framework - DCF analysis engines, scenario modeling systems, and financial statement generation workflows.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FinancialModelingOverview: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">💰 Financial Modeling Framework</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive financial modeling and valuation framework for DCF
          analysis, scenario modeling, and financial statement generation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">DCF Analysis</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium">FCF Projections</p>
                <p className="text-sm text-muted-foreground">
                  Free cash flow modeling
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Terminal Value</p>
                <p className="text-sm text-muted-foreground">
                  Perpetuity and exit multiples
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-medium">WACC Calculation</p>
                <p className="text-sm text-muted-foreground">
                  Cost of capital analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Scenario Modeling</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <div>
                <p className="font-medium">Base Case</p>
                <p className="text-sm text-muted-foreground">
                  Conservative assumptions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-medium">Upside/Downside</p>
                <p className="text-sm text-muted-foreground">
                  Optimistic/pessimistic
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <div>
                <p className="font-medium">Sensitivity</p>
                <p className="text-sm text-muted-foreground">
                  Key driver analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Financial Statements</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              <div>
                <p className="font-medium">Income Statement</p>
                <p className="text-sm text-muted-foreground">
                  Revenue and profitability
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <div>
                <p className="font-medium">Balance Sheet</p>
                <p className="text-sm text-muted-foreground">
                  Assets and liabilities
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">Cash Flow</p>
                <p className="text-sm text-muted-foreground">
                  Operating, investing, financing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Modeling Framework</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Valuation Methods</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Discounted Cash Flow (DCF)</li>
              <li>• Comparable Company Analysis</li>
              <li>• Precedent Transactions</li>
              <li>• Asset-Based Valuation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Analysis Tools</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Sensitivity analysis</li>
              <li>• Monte Carlo simulation</li>
              <li>• Scenario comparison</li>
              <li>• Risk assessment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive overview of the Financial Modeling framework, showcasing DCF analysis, scenario modeling, and financial statement capabilities.',
      },
    },
  },
};

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
        <div className="p-8 border rounded-lg bg-muted/50">
          <p className="text-center text-muted-foreground">
            CoreFinancialModeling component would be rendered here
          </p>
        </div>
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
        <div className="p-8 border rounded-lg bg-muted/50">
          <p className="text-center text-muted-foreground">
            ParameterManager component would be rendered here
          </p>
        </div>
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
        <div className="p-8 border rounded-lg bg-muted/50">
          <p className="text-center text-muted-foreground">
            DCFValuation component would be rendered here
          </p>
        </div>
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
        <div className="p-8 border rounded-lg bg-muted/50">
          <p className="text-center text-muted-foreground">
            FileUpload component would be rendered here
          </p>
        </div>
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
        <div className="p-8 border rounded-lg bg-muted/50">
          <p className="text-center text-muted-foreground">
            Shared utilities components would be rendered here
          </p>
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
        <div className="p-8 border rounded-lg bg-muted/50">
          <p className="text-center text-muted-foreground">
            De-duplication comparison would be rendered here
          </p>
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
