import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import CurrencyBarChart from './CurrencyBarChart';

const meta: Meta<typeof CurrencyBarChart> = {
    title: 'Charts/CurrencyBarChart',
    component: CurrencyBarChart,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Responsive bar chart component for displaying currency data with customizable styling and tooltips.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        barColor: {
            control: 'color',
        },
        showLegend: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof CurrencyBarChart>;

const sampleData = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 19000 },
    { name: 'Mar', value: 15000 },
    { name: 'Apr', value: 22000 },
    { name: 'May', value: 18000 },
    { name: 'Jun', value: 25000 },
];

const monthlyRevenueData = [
    { name: 'Q1', value: 45000 },
    { name: 'Q2', value: 52000 },
    { name: 'Q3', value: 48000 },
    { name: 'Q4', value: 61000 },
];

const expenseData = [
    { name: 'Salaries', value: 35000 },
    { name: 'Rent', value: 12000 },
    { name: 'Utilities', value: 8000 },
    { name: 'Marketing', value: 15000 },
    { name: 'Equipment', value: 10000 },
];

export const Default: Story = {
    args: {
        data: sampleData,
        tooltipLabel: 'Revenue',
        barColor: '#3b82f6',
        showLegend: true,
    },
};

export const MonthlyRevenue: Story = {
    args: {
        data: monthlyRevenueData,
        tooltipLabel: 'Revenue',
        barColor: '#10b981',
        showLegend: false,
    },
};

export const Expenses: Story = {
    args: {
        data: expenseData,
        tooltipLabel: 'Amount',
        barColor: '#ef4444',
        showLegend: true,
    },
};

export const CustomColors: Story = {
    args: {
        data: sampleData,
        tooltipLabel: 'Sales',
        barColor: '#8b5cf6',
        showLegend: true,
    },
};

export const EmptyData: Story = {
    args: {
        data: [],
        tooltipLabel: 'Value',
        barColor: '#3b82f6',
        showLegend: false,
    },
};
