import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Design System/6 - Data/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
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
    className: 'h-16 w-16',
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Basic: Story = {
  render: () => (
    <Avatar className="h-16 w-16">
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar className="h-16 w-16">
      <AvatarImage src="/invalid.png" alt="Broken" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Small: Story = {
  render: () => (
    <Avatar className="h-8 w-8">
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Large: Story = {
  render: () => (
    <Avatar className="h-24 w-24">
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallbackOnly: Story = {
  render: () => (
    <Avatar className="h-16 w-16">
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const FinancialTeam: Story = {
  render: () => (
    <div className="flex space-x-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="Analyst" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="Manager" />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="Director" />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarFallback>CF</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar className="h-6 w-6">
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="h-16 w-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="h-20 w-20">
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex space-x-4">
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="Online User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
      </div>
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="Away User" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-yellow-500 border-2 border-white"></div>
      </div>
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="Offline User" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gray-500 border-2 border-white"></div>
      </div>
    </div>
  ),
};
