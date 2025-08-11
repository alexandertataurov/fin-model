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
  SidebarTrigger,
} from '../../components/Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Design System/3 - Navigation/Sidebar',
  component: Sidebar,
  parameters: { layout: 'padded' },
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
  render: () => (
    <div className="h-72 rounded-md border overflow-hidden">
      <SidebarProvider>
        <div className="flex h-full">
          <Sidebar>
            <SidebarHeader />
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
          </Sidebar>
          <SidebarInset className="p-3 w-full">
            <SidebarTrigger />
            <div className="mt-3 text-sm text-muted-foreground">
              Content area
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  ),
};

export const Basic: Story = {
  render: () => (
    <div className="h-72 rounded-md border overflow-hidden">
      <SidebarProvider>
        <div className="flex h-full">
          <Sidebar>
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
                  <SidebarMenuItem>
                    <SidebarMenuButton>Settings</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
          </Sidebar>
          <SidebarInset className="p-3 w-full">
            <SidebarTrigger />
            <div className="mt-3 text-sm text-muted-foreground">
              Content area
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  ),
};

export const WithMultipleGroups: Story = {
  render: () => (
    <div className="h-96 rounded-md border overflow-hidden">
      <SidebarProvider>
        <div className="flex h-full">
          <Sidebar>
            <SidebarHeader />
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Analytics</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Management</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Users</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Settings</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
          </Sidebar>
          <SidebarInset className="p-3 w-full">
            <SidebarTrigger />
            <div className="mt-3 text-sm text-muted-foreground">
              Main content area with multiple navigation groups
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  ),
};
