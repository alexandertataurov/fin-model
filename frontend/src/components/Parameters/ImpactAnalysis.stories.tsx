import type { Meta, StoryObj } from '@storybook/react';
import { ImpactAnalysis } from './ImpactAnalysis';

const meta: Meta<typeof ImpactAnalysis> = {
  title: 'Components/ImpactAnalysis',
  component: ImpactAnalysis,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Impact analysis component for analyzing how parameter changes affect financial model outputs and key metrics.',
      },
    },
  },
  argTypes: {
    parameters: {
      control: { type: 'object' },
      description: 'Array of parameters to analyze',
    },
    targetMetric: {
      control: { type: 'text' },
      description: 'Target metric to analyze impact on',
    },
    impactData: {
      control: { type: 'object' },
      description: 'Impact analysis results data',
    },
    onParameterChange: {
      action: 'parameter changed',
      description: 'Callback when parameter value changes',
    },
    onAnalysisRun: {
      action: 'analysis run',
      description: 'Callback when analysis is triggered',
    },
    onExportResults: {
      action: 'results exported',
      description: 'Callback when results are exported',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    showCharts: {
      control: { type: 'boolean' },
      description: 'Show impact visualization charts',
    },
    sensitivityLevel: {
      control: { type: 'select', options: ['low', 'medium', 'high'] },
      description: 'Sensitivity level for analysis',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockParameters = [
  {
    id: 'revenue',
    name: 'Annual Revenue',
    value: 1500000,
    unit: 'USD',
    category: 'revenue',
    currentValue: 1500000,
    baseValue: 1200000,
  },
  {
    id: 'growthRate',
    name: 'Growth Rate',
    value: 0.15,
    unit: '%',
    category: 'revenue',
    currentValue: 0.15,
    baseValue: 0.10,
  },
  {
    id: 'operatingMargin',
    name: 'Operating Margin',
    value: 0.25,
    unit: '%',
    category: 'costs',
    currentValue: 0.25,
    baseValue: 0.20,
  },
  {
    id: 'discountRate',
    name: 'Discount Rate',
    value: 0.12,
    unit: '%',
    category: 'valuation',
    currentValue: 0.12,
    baseValue: 0.10,
  },
];

const mockImpactData = {
  targetMetric: 'Company Valuation',
  baseValue: 5000000,
  currentValue: 6500000,
  impactPercentage: 30,
  parameterImpacts: [
    {
      parameterId: 'revenue',
      parameterName: 'Annual Revenue',
      impact: 25,
      contribution: 0.83,
      direction: 'positive',
    },
    {
      parameterId: 'growthRate',
      parameterName: 'Growth Rate',
      impact: 15,
      contribution: 0.50,
      direction: 'positive',
    },
    {
      parameterId: 'operatingMargin',
      parameterName: 'Operating Margin',
      impact: 8,
      contribution: 0.27,
      direction: 'positive',
    },
    {
      parameterId: 'discountRate',
      parameterName: 'Discount Rate',
      impact: -12,
      contribution: -0.40,
      direction: 'negative',
    },
  ],
  scenarios: [
    {
      name: 'Optimistic',
      value: 8000000,
      probability: 0.25,
    },
    {
      name: 'Base Case',
      value: 6500000,
      probability: 0.50,
    },
    {
      name: 'Pessimistic',
      value: 4500000,
      probability: 0.25,
    },
  ],
};

export const Default: Story = {
  args: {
    parameters: mockParameters,
    targetMetric: 'Company Valuation',
    impactData: mockImpactData,
    isLoading: false,
    showCharts: true,
    sensitivityLevel: 'medium',
  },
};

export const Loading: Story = {
  args: {
    parameters: [],
    targetMetric: 'Company Valuation',
    impactData: null,
    isLoading: true,
    showCharts: false,
    sensitivityLevel: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Impact analysis component in loading state while calculating parameter impacts.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    parameters: [],
    targetMetric: 'Company Valuation',
    impactData: null,
    isLoading: false,
    showCharts: false,
    sensitivityLevel: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Impact analysis component with no parameters to analyze.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    parameters: mockParameters,
    targetMetric: 'Company Valuation',
    impactData: null,
    isLoading: false,
    showCharts: false,
    sensitivityLevel: 'medium',
    error: 'Failed to calculate impact analysis. Please check your parameters and try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Impact analysis component showing error state when calculation fails.',
      },
    },
  },
};

export const HighSensitivity: Story = {
  args: {
    parameters: mockParameters,
    targetMetric: 'Company Valuation',
    impactData: {
      ...mockImpactData,
      parameterImpacts: mockImpactData.parameterImpacts.map(impact => ({
        ...impact,
        impact: impact.impact * 1.5,
      })),
    },
    isLoading: false,
    showCharts: true,
    sensitivityLevel: 'high',
  },
  parameters: {
    docs: {
      description: {
        story: 'Impact analysis component with high sensitivity settings showing more detailed parameter impacts.',
      },
    },
  },
};

export const ChartsOnly: Story = {
  args: {
    parameters: mockParameters,
    targetMetric: 'Company Valuation',
    impactData: mockImpactData,
    isLoading: false,
    showCharts: true,
    sensitivityLevel: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Impact analysis component showing only visualization charts without detailed tables.',
      },
    },
  },
};

export const RevenueFocus: Story = {
  args: {
    parameters: mockParameters.filter(p => p.category === 'revenue'),
    targetMetric: 'Revenue Growth',
    impactData: {
      targetMetric: 'Revenue Growth',
      baseValue: 1000000,
      currentValue: 1500000,
      impactPercentage: 50,
      parameterImpacts: [
        {
          parameterId: 'revenue',
          parameterName: 'Annual Revenue',
          impact: 50,
          contribution: 1.0,
          direction: 'positive',
        },
        {
          parameterId: 'growthRate',
          parameterName: 'Growth Rate',
          impact: 30,
          contribution: 0.60,
          direction: 'positive',
        },
      ],
      scenarios: [
        {
          name: 'High Growth',
          value: 2000000,
          probability: 0.30,
        },
        {
          name: 'Base Case',
          value: 1500000,
          probability: 0.50,
        },
        {
          name: 'Low Growth',
          value: 1200000,
          probability: 0.20,
        },
      ],
    },
    isLoading: false,
    showCharts: true,
    sensitivityLevel: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Impact analysis component focused on revenue-related parameters and their effects on revenue growth.',
      },
    },
  },
};
