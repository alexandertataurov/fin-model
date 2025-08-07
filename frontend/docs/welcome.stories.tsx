import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../src/components/ui/card';
import { Badge } from '../src/components/ui/badge';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  Palette,
  Code,
  Zap,
  Shield,
} from 'lucide-react';

const meta: Meta = {
  title: 'Welcome',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Welcome to FinVision Storybook

This Storybook contains the complete component library for the FinVision financial modeling platform. It serves as both documentation and a development playground for our design system.

## What is FinVision?

FinVision is a comprehensive financial modeling and analysis platform that helps organizations build, analyze, and optimize their financial models. It provides intuitive interfaces for parameter management, scenario analysis, and report generation.

## Design Philosophy

Our design system follows these core principles:

- **Consistency**: Unified visual language across all interfaces
- **Accessibility**: WCAG 2.1 AA compliant components
- **Performance**: Optimized for fast loading and smooth interactions  
- **Flexibility**: Composable components that adapt to various use cases
- **Business Focus**: Financial domain-specific patterns and workflows
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

import React from 'react';

export const Welcome: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          FinVision Design System
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive component library for financial modeling and analysis
          applications
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg">Explore Components</Button>
          <Button variant="outline" size="lg">
            View Documentation
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Design Tokens</CardTitle>
            <CardDescription>
              Consistent colors, typography, and spacing
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">React Components</CardTitle>
            <CardDescription>
              TypeScript-first with full accessibility
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Performance</CardTitle>
            <CardDescription>
              Optimized for large datasets and real-time updates
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Enterprise Ready</CardTitle>
            <CardDescription>
              Security, compliance, and scalability built-in
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Component Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Component Library</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Code className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Foundation</CardTitle>
                  <Badge variant="secondary">12 components</Badge>
                </div>
              </div>
              <CardDescription>
                Core UI primitives: buttons, inputs, cards, dialogs, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Button</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Input</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Card</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Dialog</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Charts</CardTitle>
                  <Badge variant="secondary">8 components</Badge>
                </div>
              </div>
              <CardDescription>
                Data visualization components for financial analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Line Chart</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bar Chart</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pie Chart</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Waterfall</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Parameters</CardTitle>
                  <Badge variant="secondary">6 components</Badge>
                </div>
              </div>
              <CardDescription>
                Financial parameter management and control interfaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Parameter Control</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Parameter Group</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bulk Edit</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Search</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Layout</CardTitle>
                  <Badge variant="secondary">4 components</Badge>
                </div>
              </div>
              <CardDescription>
                Application structure and navigation components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>App Layout</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sidebar</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Header</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Dashboard</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Authentication</CardTitle>
                  <Badge variant="secondary">5 components</Badge>
                </div>
              </div>
              <CardDescription>
                User authentication and security interfaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Login Form</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Register Form</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Password Reset</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Email Verification</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Reports</CardTitle>
                  <Badge variant="secondary">3 components</Badge>
                </div>
              </div>
              <CardDescription>
                Financial report generation and export tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Report Builder</span>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Export Options</span>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Report Preview</span>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Start Guide */}
      <Card className="bg-muted/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quick Start Guide</CardTitle>
          <CardDescription className="text-lg">
            Get up and running with FinVision components in minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h3 className="font-medium">Explore Components</h3>
              <p className="text-sm text-muted-foreground">
                Browse the component library and see examples of each component
                in action
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h3 className="font-medium">Copy Code</h3>
              <p className="text-sm text-muted-foreground">
                Use the code examples and props documentation to implement
                components
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h3 className="font-medium">Customize</h3>
              <p className="text-sm text-muted-foreground">
                Adapt components to your specific needs using our flexible
                theming system
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Status Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Component Status Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Completion Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Ready for Production</span>
                <Badge variant="default" className="bg-green-700 text-white">
                  35 components
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>In Development</span>
                <Badge variant="secondary">8 components</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Planned</span>
                <Badge variant="outline">12 components</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="text-center">
                  <span className="text-2xl font-bold text-green-700">64%</span>
                  <p className="text-sm text-muted-foreground">
                    Overall Progress
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Accessibility Score</span>
                <Badge variant="default" className="bg-green-700 text-white">
                  AA Compliant
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>TypeScript Coverage</span>
                <Badge variant="default">100%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Test Coverage</span>
                <Badge variant="default" className="bg-green-700 text-white">
                  89%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Documentation</span>
                <Badge variant="default" className="bg-green-700 text-white">
                  Complete
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Welcome to the FinVision Storybook - your guide to building consistent, accessible financial applications.',
      },
    },
  },
};
