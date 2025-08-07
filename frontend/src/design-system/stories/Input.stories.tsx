import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Input } from '../components/Input';
import { Label } from '../components/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { 
  Search, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  MapPin,
  Calendar,
  DollarSign,
  Percent,
  Hash,
  AtSign,
  Globe,
  FileText,
} from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: '🎨 Design System/Components/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Input Component

A flexible and accessible input component that provides consistent styling and behavior across different input types. The Input component supports various states, validation, and helper text.

## Key Features

- **🎨 Consistent Styling**: Unified appearance across all input types
- **📱 Responsive Design**: Adapts to different screen sizes
- **♿ Accessibility**: Full keyboard navigation and screen reader support
- **✅ Validation States**: Error states with helper text
- **🎯 Focus Management**: Clear focus indicators and states
- **🎭 Design System**: Consistent with design tokens and theming

## Usage

\`\`\`tsx
import { Input } from '@/design-system';

// Basic input
<Input placeholder="Enter your name" />

// With label and helper text
<Input 
  label="Email"
  placeholder="Enter your email"
  helperText="We\'ll never share your email"
/>

// With error state
<Input 
  label="Password"
  type="password"
  error
  helperText="Password must be at least 8 characters"
/>

// With icon
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-10" placeholder="Search..." />
</div>
\`\`\`

## Design Principles

1. **Consistency**: All inputs follow the same design patterns
2. **Clarity**: Clear visual hierarchy and readable text
3. **Feedback**: Immediate visual feedback for all states
4. **Accessibility**: Inclusive design for all users
5. **Performance**: Optimized rendering and minimal bundle impact
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date'],
      description: 'The type of input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input has an error state',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the input',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Input
export const Default: Story = {
  args: {
    placeholder: 'Enter your text here',
  },
};

// Input with Label
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
};

// Input with Helper Text
export const WithHelperText: Story = {
  args: {
    placeholder: 'Enter your email',
    helperText: 'We\'ll never share your email with anyone else.',
  },
};

// Input with Error
export const WithError: Story = {
  args: {
    placeholder: 'Enter your password',
    type: 'password',
    error: true,
    helperText: 'Password must be at least 8 characters long.',
  },
};

// Disabled Input
export const Disabled: Story = {
  args: {
    placeholder: 'This input is disabled',
    disabled: true,
    helperText: 'This field cannot be edited.',
  },
};

// Input Types
export const InputTypes: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="text">Text</Label>
        <Input id="text" type="text" placeholder="Enter text" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter email" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter password" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="number">Number</Label>
        <Input id="number" type="number" placeholder="Enter number" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tel">Phone</Label>
        <Input id="tel" type="tel" placeholder="Enter phone number" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input id="url" type="url" placeholder="Enter URL" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input id="search" type="search" placeholder="Search..." />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" />
      </div>
    </div>
  ),
};

// Input with Icons
export const WithIcons: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="search" className="pl-10" placeholder="Search..." />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="email" type="email" className="pl-10" placeholder="Enter your email" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="password" type="password" className="pl-10 pr-10" placeholder="Enter your password" />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="phone" type="tel" className="pl-10" placeholder="Enter phone number" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="location" className="pl-10" placeholder="Enter location" />
        </div>
      </div>
    </div>
  ),
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          Please provide your contact details below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="name" className="pl-10" placeholder="Enter your full name" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="email" type="email" className="pl-10" placeholder="Enter your email" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="phone" type="tel" className="pl-10" placeholder="Enter your phone number" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="company" className="pl-10" placeholder="Enter your company name" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <textarea 
              id="message" 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter your message"
            />
          </div>
        </div>
        
        <Button className="w-full">Submit</Button>
      </CardContent>
    </Card>
  ),
};

// Financial Inputs
export const FinancialInputs: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Financial Calculator</CardTitle>
        <CardDescription>
          Enter financial values for calculations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="amount" type="number" className="pl-10" placeholder="0.00" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rate">Interest Rate</Label>
          <div className="relative">
            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="rate" type="number" className="pl-10" placeholder="0.00" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="period">Period (Years)</Label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="period" type="number" className="pl-10" placeholder="1" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Start Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="date" type="date" className="pl-10" />
          </div>
        </div>
        
        <Button className="w-full">Calculate</Button>
      </CardContent>
    </Card>
  ),
};

// Validation States
export const ValidationStates: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="valid">Valid Input</Label>
        <Input id="valid" placeholder="This input is valid" />
        <p className="text-sm text-green-600">✓ Input is valid</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="error">Error Input</Label>
        <Input id="error" placeholder="This input has an error" error />
        <p className="text-sm text-red-600">✗ This field is required</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="warning">Warning Input</Label>
        <Input id="warning" placeholder="This input has a warning" />
        <p className="text-sm text-yellow-600">⚠ Please review this field</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="info">Info Input</Label>
        <Input id="info" placeholder="This input has info" />
        <p className="text-sm text-blue-600">ℹ Additional information</p>
      </div>
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="small">Small Input</Label>
        <Input id="small" className="h-8 text-sm" placeholder="Small input" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="default">Default Input</Label>
        <Input id="default" placeholder="Default input" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="large">Large Input</Label>
        <Input id="large" className="h-12 text-lg" placeholder="Large input" />
      </div>
    </div>
  ),
};
