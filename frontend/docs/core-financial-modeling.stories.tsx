import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

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
