import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '../components/Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Design System/Sidebar/Advanced',
  component: Sidebar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['sidebar', 'floating', 'inset'],
      description: 'Sidebar variant',
    },
    collapsible: {
      control: { type: 'select' },
      options: ['offcanvas', 'icon', 'none'],
      description: 'Collapsible behavior',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

function Layout({
  variant,
  collapsible,
}: {
  variant: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
}) {
  return (
    <div className="h-64 rounded-md border overflow-hidden">
      <SidebarProvider>
        <div className="flex h-full">
          <Sidebar variant={variant} collapsible={collapsible}>
            <SidebarHeader />
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Reports</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
          </Sidebar>
          <SidebarInset className="p-3 w-full">
            <div className="text-sm text-muted-foreground">Content area</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export const Floating: Story = {
  args: { variant: 'floating' },
  render: (args) => <Layout variant={args.variant} />
};

export const Inset: Story = {
  args: { variant: 'inset' },
  render: (args) => <Layout variant={args.variant} />
};

export const IconOnly: Story = {
  args: { variant: 'sidebar', collapsible: 'icon' },
  render: (args) => <Layout variant={args.variant} collapsible={args.collapsible} />,
};

export const FinancialDashboard: Story = {
  render: () => (
    <div className="h-64 rounded-md border overflow-hidden">
      <SidebarProvider>
        <div className="flex h-full">
          <Sidebar variant="sidebar">
            <SidebarHeader>
              <div className="px-3 py-2">
                <h2 className="text-lg font-semibold">Financial Model</h2>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Analysis</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>DCF Valuation</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Sensitivity Analysis</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Scenario Planning</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Reports</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Cash Flow</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Balance Sheet</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="px-3 py-2 text-xs text-muted-foreground">
                v2.1.0
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="p-3 w-full">
            <div className="text-sm text-muted-foreground">Financial modeling workspace</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  ),
};
