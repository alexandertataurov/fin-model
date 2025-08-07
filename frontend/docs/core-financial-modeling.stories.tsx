import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CoreFinancialModeling } from '../src/components/CoreFinancialModeling/CoreFinancialModeling';
import { ParameterManager } from '../src/components/CoreFinancialModeling/ParameterManager';
import { DCFValuation } from '../src/components/CoreFinancialModeling/DCFValuation';
import { FileUpload } from '../src/components/CoreFinancialModeling/FileUpload';

const meta: Meta = {
  title: '2-Core Financial Modeling/Streamlined Components',
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

## Design Principles

- **Lean Architecture**: Focus on core financial modeling capabilities
- **Comprehensive Coverage**: All essential modeling features included
- **User-Friendly Interface**: Intuitive design for financial professionals
- **Performance Optimized**: Efficient rendering and calculations
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CoreFinancialModelingShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Core Financial Modeling Platform</h2>
        <p className="text-muted-foreground mb-6">
          The main platform component that serves as the central hub for all financial modeling activities.
        </p>
        <CoreFinancialModeling 
          onFileUpload={(file) => console.log('File uploaded:', file.name)}
          onParameterChange={(parameters) => console.log('Parameters changed:', parameters)}
          onScenarioCreate={(scenario) => console.log('Scenario created:', scenario)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Main platform component with overview, statements, parameters, scenarios, DCF, and analysis tabs.',
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
          Comprehensive parameter management with 12 categories covering all aspects of financial modeling.
        </p>
        <ParameterManager 
          onParameterChange={(parameters) => console.log('Parameters updated:', parameters)}
          onSaveTemplate={(template) => console.log('Template saved:', template)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Parameter management with 12 categories: Economic Environment, Tax Environment, Revenue Parameters, COGS Parameters, Operating Expenses, Financial Parameters, Operational Parameters, Cash Flow Lifecycle, Cash Flow Statement, Asset Lifecycle, Balance Sheet, and Valuation Parameters.',
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
          Comprehensive DCF valuation with detailed FCF projections, terminal value analysis, cost of capital breakdown, sensitivity analysis, and comparable company analysis.
        </p>
        <DCFValuation 
          onValuationChange={(valuation) => console.log('Valuation updated:', valuation)}
          onExportResults={(results) => console.log('Results exported:', results)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete DCF model with FCF projections, terminal value methods, WACC calculation, sensitivity analysis, and comparable company analysis.',
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
          Streamlined Excel file upload with drag-and-drop support, processing status, and upload guidelines.
        </p>
        <FileUpload 
          onFileUpload={(file) => console.log('File uploaded:', file.name)}
          onFileProcess={(fileId) => console.log('File processing:', fileId)}
          onFileDelete={(fileId) => console.log('File deleted:', fileId)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Excel file upload with drag-and-drop, progress tracking, file management, and upload guidelines.',
      },
    },
  },
};

export const ComponentComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Component Architecture Comparison</h2>
        <p className="text-muted-foreground mb-6">
          Overview of the streamlined component architecture compared to the previous complex structure.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-600">Previous Structure (Complex)</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Multiple duplicate components
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Scattered parameter management
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Complex navigation structure
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Non-essential features included
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Performance overhead
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600">New Structure (Streamlined)</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Single consolidated components
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Unified parameter management
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Clear tab-based navigation
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Essential features only
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Optimized performance
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Key Improvements</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Reduced component count from 50+ to 4 core components</li>
            <li>• Eliminated duplicate functionality and redundant code</li>
            <li>• Streamlined parameter management with 12 clear categories</li>
            <li>• Comprehensive DCF valuation with all essential features</li>
            <li>• Improved user experience with intuitive navigation</li>
            <li>• Better performance through optimized rendering</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of the previous complex component structure with the new streamlined architecture.',
      },
    },
  },
};
