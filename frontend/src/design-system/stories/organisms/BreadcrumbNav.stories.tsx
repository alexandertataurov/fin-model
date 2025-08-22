import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BreadcrumbNav } from '../../organisms/BreadcrumbNav/BreadcrumbNav';

const meta: Meta<typeof BreadcrumbNav> = {
  title: 'Organisms / BreadcrumbNav',
  component: BreadcrumbNav,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'elevated'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    collapsed: {
      control: { type: 'boolean' },
    },
    showHome: {
      control: { type: 'boolean' },
    },
    maxItems: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = [
  { key: 'home', label: 'Home', href: '/', icon: 'home' },
  { key: 'products', label: 'Products', href: '/products' },
  { key: 'category', label: 'Electronics', href: '/products/electronics' },
  { key: 'item', label: 'Smartwatch X1', href: '/products/electronics/smartwatch-x1', active: true },
];

const onItemClick = (item: any) => alert(`Clicked: ${item.label}`);

export const Default: Story = {
  args: { items: defaultItems },
  render: (args) => <BreadcrumbNav {...args} onItemClick={onItemClick} />,
};

export const Minimal: Story = {
  args: { variant: 'minimal', items: defaultItems },
  render: (args) => <BreadcrumbNav {...args} onItemClick={onItemClick} />,
};

export const Elevated: Story = {
  args: { variant: 'elevated', items: defaultItems },
  render: (args) => <BreadcrumbNav {...args} onItemClick={onItemClick} />,
};

export const Small: Story = {
  args: { size: 'sm', items: defaultItems },
  render: (args) => <BreadcrumbNav {...args} onItemClick={onItemClick} />,
};

export const Large: Story = {
  args: { size: 'lg', items: defaultItems },
  render: (args) => <BreadcrumbNav {...args} onItemClick={onItemClick} />,
};

export const WithCustomSeparator: Story = {
  args: { items: defaultItems, separator: 'arrow-right' },
  render: (args) => <BreadcrumbNav {...args} onItemClick={onItemClick} />,
};

export const WithoutHome: Story = {
  args: { items: defaultItems.slice(1), showHome: false },
  render: (args) => <BreadcrumbNav {...args} onItemClick={onItemClick} />,
};

export const Collapsed: Story = {
  args: {
    items: defaultItems.concat([
      { key: 'details', label: 'Product Details', href: '/details' },
      { key: 'reviews', label: 'Customer Reviews', href: '/reviews' },
      { key: 'faq', label: 'FAQ', href: '/faq' },
      { key: 'support', label: 'Support', href: '/support' },
    ]),
    collapsed: true,
    maxItems: 4,
  },
  render: (args) => <BreadcrumbNav {...args} onItemClick={onItemClick} />,
};

export const WithBadges: Story = {
  args: {
    items: [
      { key: 'home', label: 'Home', href: '/', icon: 'home' },
      { key: 'products', label: 'Products', href: '/products', badge: { text: 'New', variant: 'default' } },
      { key: 'category', label: 'Electronics', href: '/products/electronics', badge: { text: 'Hot', variant: 'destructive' } },
      { key: 'item', label: 'Smartwatch X1', href: '/products/electronics/smartwatch-x1', active: true },
    ],
  },
  render: (args) => <BreadcrumbNav {...args} onItemClick={onItemClick} />,
};

export const DisabledItems: Story = {
  args: {
    items: [
      { key: 'home', label: 'Home', href: '/', icon: 'home' },
      { key: 'products', label: 'Products', href: '/products', disabled: true },
      { key: 'category', label: 'Electronics', href: '/products/electronics' },
      { key: 'item', label: 'Smartwatch X1', href: '/products/electronics/smartwatch-x1', active: true },
    ],
  },
  render: (args) => <BreadcrumbNav {...args} onItemClick={onItemClick} />,
};
