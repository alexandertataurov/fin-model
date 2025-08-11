import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Design System/6 - Data/Accordion',
  component: Accordion,
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select', options: ['single', 'multiple'] },
      description: 'Type of accordion behavior',
    },
    collapsible: {
      control: { type: 'boolean' },
      description: 'Whether items can be collapsed',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-[420px]',
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is your refund policy?</AccordionTrigger>
        <AccordionContent>
          If you're unhappy with your purchase for any reason, email us within
          90 days and we'll refund you in full.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Do you offer technical support?</AccordionTrigger>
        <AccordionContent>
          Yes. We offer email support 24/7 and real-time chat during business
          hours.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Basic: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[420px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is your refund policy?</AccordionTrigger>
        <AccordionContent>
          If you're unhappy with your purchase for any reason, email us within
          90 days and we'll refund you in full.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Do you offer technical support?</AccordionTrigger>
        <AccordionContent>
          Yes. We offer email support 24/7 and real-time chat during business
          hours.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[420px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Revenue Parameters</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="text-sm">Annual Revenue: $1,500,000</p>
            <p className="text-sm">Growth Rate: 15%</p>
            <p className="text-sm">Revenue Per Customer: $2,500</p>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Cost Parameters</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="text-sm">Operating Costs: $800,000</p>
            <p className="text-sm">Operating Margin: 25%</p>
            <p className="text-sm">Fixed Costs: $300,000</p>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Valuation Parameters</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="text-sm">Discount Rate: 12%</p>
            <p className="text-sm">Terminal Growth: 3%</p>
            <p className="text-sm">Tax Rate: 25%</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const FinancialModel: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[500px]">
      <AccordionItem value="revenue">
        <AccordionTrigger>Revenue Model</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Annual Revenue</p>
                <p className="text-muted-foreground">$1,500,000</p>
              </div>
              <div>
                <p className="font-medium">Growth Rate</p>
                <p className="text-muted-foreground">15%</p>
              </div>
              <div>
                <p className="font-medium">Revenue Per Customer</p>
                <p className="text-muted-foreground">$2,500</p>
              </div>
              <div>
                <p className="font-medium">Customer Count</p>
                <p className="text-muted-foreground">600</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="costs">
        <AccordionTrigger>Cost Structure</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Operating Costs</p>
                <p className="text-muted-foreground">$800,000</p>
              </div>
              <div>
                <p className="font-medium">Operating Margin</p>
                <p className="text-muted-foreground">25%</p>
              </div>
              <div>
                <p className="font-medium">Fixed Costs</p>
                <p className="text-muted-foreground">$300,000</p>
              </div>
              <div>
                <p className="font-medium">Variable Costs</p>
                <p className="text-muted-foreground">$500,000</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="valuation">
        <AccordionTrigger>Valuation Assumptions</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Discount Rate (WACC)</p>
                <p className="text-muted-foreground">12%</p>
              </div>
              <div>
                <p className="font-medium">Terminal Growth</p>
                <p className="text-muted-foreground">3%</p>
              </div>
              <div>
                <p className="font-medium">Tax Rate</p>
                <p className="text-muted-foreground">25%</p>
              </div>
              <div>
                <p className="font-medium">Forecast Period</p>
                <p className="text-muted-foreground">5 years</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Loading: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[420px]">
      <AccordionItem value="loading">
        <AccordionTrigger>Loading Parameters...</AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Loading financial data...</span>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: { docs: { description: { story: 'Accordion component in loading state while fetching data.' } } },
};

export const Empty: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[420px]">
      <AccordionItem value="empty">
        <AccordionTrigger>No Parameters Available</AccordionTrigger>
        <AccordionContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No parameters have been configured yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Click "Add Parameter" to get started.</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: { docs: { description: { story: 'Accordion component with no data available.' } } },
};

export const Error: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[420px]">
      <AccordionItem value="error">
        <AccordionTrigger>Error Loading Parameters</AccordionTrigger>
        <AccordionContent>
          <div className="text-center py-4">
            <p className="text-sm text-destructive">Failed to load parameters.</p>
            <p className="text-xs text-muted-foreground mt-1">Please check your connection and try again.</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: { docs: { description: { story: 'Accordion component showing error state.' } } },
};
