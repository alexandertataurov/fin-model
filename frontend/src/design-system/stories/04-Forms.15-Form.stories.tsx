import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../components/Form';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const meta: Meta<typeof Form> = {
  title: 'Design System/Form',
  component: Form,
  parameters: { 
    layout: 'padded',
    docs: {
      description: {
        component: 'Form component with validation and field management using react-hook-form.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
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
    className: '',
  },
  render: (args) => {
    type Values = { email: string };
    const form = useForm<Values>({ defaultValues: { email: '' } });

    const onSubmit = (values: Values) => alert(`Submitted: ${values.email}`);

    return (
      <Form {...form} {...args}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-96">
          <FormField
            control={form.control}
            name="email"
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

export const Basic: Story = {
  render: () => {
    type Values = { email: string };
    const form = useForm<Values>({ defaultValues: { email: '' } });

    const onSubmit = (values: Values) => alert(`Submitted: ${values.email}`);

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-96">
          <FormField
            control={form.control}
            name="email"
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

export const FinancialModelForm: Story = {
  render: () => {
    type Values = { 
      companyName: string;
      annualRevenue: number;
      growthRate: number;
      discountRate: number;
    };
    const form = useForm<Values>({ 
      defaultValues: { 
        companyName: '',
        annualRevenue: 0,
        growthRate: 0.1,
        discountRate: 0.12,
      } 
    });

    const onSubmit = (values: Values) => alert(`Financial Model: ${JSON.stringify(values, null, 2)}`);

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-96">
          <FormField
            control={form.control}
            name="companyName"
            rules={{ required: 'Company name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="annualRevenue"
            rules={{ 
              required: 'Annual revenue is required',
              min: { value: 0, message: 'Revenue must be positive' }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Revenue (USD)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1500000" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="growthRate"
            rules={{ 
              required: 'Growth rate is required',
              min: { value: -0.5, message: 'Growth rate must be >= -50%' },
              max: { value: 2.0, message: 'Growth rate must be <= 200%' }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Growth Rate (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="15" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="discountRate"
            rules={{ 
              required: 'Discount rate is required',
              min: { value: 0.05, message: 'Discount rate must be >= 5%' },
              max: { value: 0.30, message: 'Discount rate must be <= 30%' }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Rate (WACC %)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.001"
                    placeholder="12" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit">Create Financial Model</Button>
        </form>
      </Form>
    );
  },
};

export const MultiStepForm: Story = {
  render: () => {
    type Values = { 
      step1: { name: string; email: string };
      step2: { company: string; role: string };
    };
    const form = useForm<Values>({ 
      defaultValues: { 
        step1: { name: '', email: '' },
        step2: { company: '', role: '' },
      } 
    });

    const onSubmit = (values: Values) => alert(`Multi-step form: ${JSON.stringify(values, null, 2)}`);

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-96">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 1: Personal Information</h3>
            
            <FormField
              control={form.control}
              name="step1.name"
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="step1.email"
              rules={{ 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 2: Professional Information</h3>
            
            <FormField
              control={form.control}
              name="step2.company"
              rules={{ required: 'Company is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="step2.role"
              rules={{ required: 'Role is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Financial Analyst" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit">Complete Registration</Button>
        </form>
      </Form>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    type Values = { 
      email: string;
      password: string;
      confirmPassword: string;
    };
    const form = useForm<Values>({ 
      defaultValues: { 
        email: '',
        password: '',
        confirmPassword: '',
      } 
    });

    const onSubmit = (values: Values) => alert(`Validated form: ${JSON.stringify(values, null, 2)}`);

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-96">
          <FormField
            control={form.control}
            name="email"
            rules={{ 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            rules={{ 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain uppercase, lowercase, and number'
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            rules={{ 
              required: 'Please confirm your password',
              validate: (value, formValues) => 
                value === formValues.password || 'Passwords do not match'
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit">Create Account</Button>
        </form>
      </Form>
    );
  },
};
