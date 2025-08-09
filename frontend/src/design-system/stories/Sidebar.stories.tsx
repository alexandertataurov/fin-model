import React from 'react';
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
} from '../components/Sidebar';

const meta = {
  title: 'Design System/Sidebar',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
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
