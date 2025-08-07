import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/Input';
import { Search, Mail, Lock, User, Phone, Calendar } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'Design System/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component with various types and states.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'The type of input',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic input stories
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Email
      </label>
      <Input
        type="email"
        id="email"
        placeholder="Enter your email"
      />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search..." className="pl-8" />
    </div>
  ),
};

export const WithIconRight: Story = {
  render: () => (
    <div className="relative">
      <Input placeholder="Enter text..." className="pr-8" />
      <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  ),
};

// Input types
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number',
  },
};

export const Tel: Story = {
  args: {
    type: 'tel',
    placeholder: 'Enter phone number',
  },
};

export const SearchInput: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'Read-only value',
  },
};

export const WithError: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input
        type="email"
        placeholder="Enter your email"
        className="border-red-500 focus:border-red-500"
      />
      <p className="text-sm text-red-500">Please enter a valid email address</p>
    </div>
  ),
};

export const WithSuccess: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input
        type="email"
        placeholder="Enter your email"
        className="border-green-500 focus:border-green-500"
      />
      <p className="text-sm text-green-500">Email is valid</p>
    </div>
  ),
};

// Form examples
export const ContactForm: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid items-center gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <div className="relative">
          <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="name" placeholder="Enter your name" className="pl-8" />
        </div>
      </div>
      
      <div className="grid items-center gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="email" type="email" placeholder="Enter your email" className="pl-8" />
        </div>
      </div>
      
      <div className="grid items-center gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>
        <div className="relative">
          <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="phone" type="tel" placeholder="Enter your phone" className="pl-8" />
        </div>
      </div>
      
      <div className="grid items-center gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="password" type="password" placeholder="Enter your password" className="pl-8" />
        </div>
      </div>
    </div>
  ),
};

// Sizes
export const Small: Story = {
  args: {
    className: 'h-8 text-sm',
    placeholder: 'Small input',
  },
};

export const Large: Story = {
  args: {
    className: 'h-12 text-lg',
    placeholder: 'Large input',
  },
};

// Input groups
export const InputGroup: Story = {
  render: () => (
    <div className="flex w-full max-w-sm">
      <Input
        type="text"
        placeholder="Search..."
        className="rounded-r-none border-r-0"
      />
      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        <Search className="h-4 w-4" />
      </button>
    </div>
  ),
};

// All input types showcase
export const AllTypes: Story = {
  render: () => (
    <div className="grid w-full max-w-md gap-4">
      <div className="grid items-center gap-1.5">
        <label className="text-sm font-medium">Text</label>
        <Input type="text" placeholder="Text input" />
      </div>
      
      <div className="grid items-center gap-1.5">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" placeholder="Email input" />
      </div>
      
      <div className="grid items-center gap-1.5">
        <label className="text-sm font-medium">Password</label>
        <Input type="password" placeholder="Password input" />
      </div>
      
      <div className="grid items-center gap-1.5">
        <label className="text-sm font-medium">Number</label>
        <Input type="number" placeholder="Number input" />
      </div>
      
      <div className="grid items-center gap-1.5">
        <label className="text-sm font-medium">Tel</label>
        <Input type="tel" placeholder="Phone input" />
      </div>
      
      <div className="grid items-center gap-1.5">
        <label className="text-sm font-medium">Search</label>
        <Input type="search" placeholder="Search input" />
      </div>
    </div>
  ),
};
