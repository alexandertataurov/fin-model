import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '../components/NavigationMenu';

const meta: Meta<typeof NavigationMenu> = {
  title: 'Design System/NavigationMenu',
  component: NavigationMenu,
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
    className: '',
  },
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const Basic: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-4 w-64">
              <a className="block rounded-md p-2 hover:bg-accent" href="#">
                Analytics
              </a>
              <a className="block rounded-md p-2 hover:bg-accent" href="#">
                Monitoring
              </a>
              <a className="block rounded-md p-2 hover:bg-accent" href="#">
                Reporting
              </a>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const FinancialApp: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Models</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-4 w-80">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Valuation Models</h4>
                  <a className="block rounded-md p-2 hover:bg-accent" href="#">
                    DCF Analysis
                  </a>
                  <a className="block rounded-md p-2 hover:bg-accent" href="#">
                    Comparable Companies
                  </a>
                  <a className="block rounded-md p-2 hover:bg-accent" href="#">
                    Precedent Transactions
                  </a>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Scenario Analysis</h4>
                  <a className="block rounded-md p-2 hover:bg-accent" href="#">
                    Monte Carlo
                  </a>
                  <a className="block rounded-md p-2 hover:bg-accent" href="#">
                    Sensitivity Analysis
                  </a>
                  <a className="block rounded-md p-2 hover:bg-accent" href="#">
                    Stress Testing
                  </a>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Reports</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-4 w-64">
              <a className="block rounded-md p-2 hover:bg-accent" href="#">
                Executive Summary
              </a>
              <a className="block rounded-md p-2 hover:bg-accent" href="#">
                Detailed Analysis
              </a>
              <a className="block rounded-md p-2 hover:bg-accent" href="#">
                Charts & Graphs
              </a>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Settings
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const Simple: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Parameters
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Scenarios
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Results
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
